import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { classifyProduct, mapAllegroOffers, type AllegroProduct } from "@/lib/allegro";

const redis = Redis.fromEnv();

const REFRESH_TOKEN_KEY = "allegro:refresh_token";
const ACCESS_TOKEN_KEY = "allegro:access_token";
const ACCESS_TOKEN_TTL_KEY = "allegro:access_token_ttl";
const LOCK_KEY = "allegro:refresh_lock";
const OFFERS_CACHE_KEY = "allegro:offers_cache:v2";
const OFFERS_CACHE_SECONDS = 60 * 60;
const TRANSLATION_CACHE_SECONDS = 60 * 60;
const SUPPORTED_TRANSLATION_LANGUAGES = new Set(["cs-CZ", "sk-SK", "hu-HU"]);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getRefreshToken() {
  const tokenFromRedis = await redis.get<string>(REFRESH_TOKEN_KEY);
  return tokenFromRedis || process.env.ALLEGRO_REFRESH_TOKEN;
}

async function saveRefreshToken(token: string) {
  await redis.set(REFRESH_TOKEN_KEY, token);
}

async function acquireLock() {
  const result = await redis.set(LOCK_KEY, crypto.randomUUID(), {
    nx: true,
    ex: 30,
  });

  return result === "OK";
}

async function releaseLock() {
  await redis.del(LOCK_KEY);
}

async function getCachedAccessToken() {
  const [token, validUntil] = await Promise.all([
    redis.get<string>(ACCESS_TOKEN_KEY),
    redis.get<number>(ACCESS_TOKEN_TTL_KEY),
  ]);

  if (!token || !validUntil || Date.now() >= validUntil - 60_000) return null;
  return token;
}

async function getAccessToken() {
  const cachedToken = await getCachedAccessToken();
  if (cachedToken) return cachedToken;

  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Brakuje ALLEGRO_CLIENT_ID albo ALLEGRO_CLIENT_SECRET");
  }

  let hasLock = await acquireLock();

  for (let i = 0; i < 10 && !hasLock; i++) {
    await sleep(500);

    const tokenAfterWait = await getCachedAccessToken();
    if (tokenAfterWait) return tokenAfterWait;

    hasLock = await acquireLock();
  }

  if (!hasLock) {
    throw new Error("Nie udało się uzyskać blokady Redis dla tokenu");
  }

  try {
    const secondCachedCheck = await getCachedAccessToken();
    if (secondCachedCheck) return secondCachedCheck;

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error("Brakuje refresh tokenu Allegro. Wymagana jest ponowna autoryzacja.");
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch("https://allegro.pl/auth/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });

    const tokenData = await tokenResponse.json().catch(() => null);

    if (!tokenResponse.ok) {
      const description = tokenData?.error_description ?? tokenData?.error ?? "Błąd autoryzacji Allegro";
      throw new Error(`${description}. Wymagana jest ponowna autoryzacja konta Allegro.`);
    }

    if (!tokenData?.access_token) {
      throw new Error("Brak access_token w odpowiedzi Allegro");
    }

    if (tokenData.refresh_token) {
      await saveRefreshToken(tokenData.refresh_token);
    }

    const expiresIn = Number(tokenData.expires_in ?? 3600);
    const validUntil = Date.now() + expiresIn * 1000;

    await Promise.all([
      redis.set(ACCESS_TOKEN_KEY, tokenData.access_token, { ex: Math.max(60, expiresIn) }),
      redis.set(ACCESS_TOKEN_TTL_KEY, validUntil, { ex: Math.max(60, expiresIn) }),
    ]);

    return tokenData.access_token as string;
  } finally {
    await releaseLock();
  }
}

async function fetchAllActiveOffers(accessToken: string) {
  const allOffers: any[] = [];
  const limit = 100;

  for (let offset = 0; ; offset += limit) {
    const url = new URL("https://api.allegro.pl/sale/offers");
    url.searchParams.set("publication.status", "ACTIVE");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.allegro.public.v1+json",
      },
      cache: "no-store",
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(body?.errors?.[0]?.message ?? `Allegro offers error ${response.status}`);
    }

    const batch = Array.isArray(body?.offers) ? body.offers : [];
    allOffers.push(...batch);

    if (batch.length < limit) break;
  }

  return { offers: allOffers };
}

function applyCurrentCategories(products: AllegroProduct[]): AllegroProduct[] {
  return products.map((product) => ({
    ...product,
    category: classifyProduct(product.name),
  }));
}

async function loadProducts(): Promise<AllegroProduct[]> {
  const cached = await redis.get<AllegroProduct[]>(OFFERS_CACHE_KEY);
  if (cached) return applyCurrentCategories(cached);

  const accessToken = await getAccessToken();
  const offersData = await fetchAllActiveOffers(accessToken);
  const products = mapAllegroOffers(offersData);

  await redis.set(OFFERS_CACHE_KEY, products, { ex: OFFERS_CACHE_SECONDS });
  return products;
}

async function fetchTranslatedTitle(accessToken: string, offerId: string, language: string): Promise<string | null> {
  const url = new URL(`https://api.allegro.pl/sale/offers/${encodeURIComponent(offerId)}/translations`);
  url.searchParams.set("language", language);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.allegro.public.v1+json",
      "Accept-Language": language,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const body = await response.json().catch(() => null);
  const translations = Array.isArray(body?.translations) ? body.translations : [];
  const item = translations.find((translation: any) => translation?.language === language) ?? translations[0];
  const title = item?.title?.translation;
  return typeof title === "string" && title.trim() ? title.trim() : null;
}

async function loadTranslatedTitles(products: AllegroProduct[], language: string): Promise<Record<string, string>> {
  const cacheKey = `allegro:offer_titles:${language}:v1`;
  const cached = await redis.get<Record<string, string>>(cacheKey).catch(() => null);
  if (cached) return cached;

  const accessToken = await getAccessToken();
  const titles: Record<string, string> = {};
  const concurrency = 6;

  for (let i = 0; i < products.length; i += concurrency) {
    const batch = products.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(async (product) => ({
      id: product.id,
      title: await fetchTranslatedTitle(accessToken, product.id, language),
    })));
    for (const result of results) {
      if (result.title) titles[result.id] = result.title;
    }
  }

  await redis.set(cacheKey, titles, { ex: TRANSLATION_CACHE_SECONDS });
  return titles;
}

export async function GET(request: Request) {
  try {
    const products = await loadProducts();
    const language = new URL(request.url).searchParams.get("language");

    if (!language || !SUPPORTED_TRANSLATION_LANGUAGES.has(language)) {
      return NextResponse.json(products, {
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }

    const translatedTitles = await loadTranslatedTitles(products, language);
    const localizedProducts = products.map((product) => ({
      ...product,
      name: translatedTitles[product.id] ?? product.name,
    }));

    return NextResponse.json(localizedProducts, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    const cached = await redis.get<AllegroProduct[]>(OFFERS_CACHE_KEY).catch(() => null);

    if (cached) {
      return NextResponse.json(applyCurrentCategories(cached), {
        headers: {
          "X-Allegro-Cache": "stale",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    return NextResponse.json(
      {
        error: "Allegro synchronization failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
