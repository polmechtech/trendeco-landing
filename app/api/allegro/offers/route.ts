import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { mapAllegroOffers, type AllegroProduct } from "@/lib/allegro";

export const dynamic = "force-dynamic";

const CACHE_SECONDS = 15 * 60;
const OFFERS_CACHE_KEY = "allegro:offers_cache:v3";
const REFRESH_TOKEN_KEY = "allegro:refresh_token";
const ACCESS_TOKEN_KEY = "allegro:access_token";
const ACCESS_TOKEN_TTL_KEY = "allegro:access_token_ttl";

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function getRefreshToken(redis: Redis | null) {
  if (redis) {
    const saved = await redis.get<string>(REFRESH_TOKEN_KEY).catch(() => null);
    if (saved) return saved;
  }
  return process.env.ALLEGRO_REFRESH_TOKEN || null;
}

async function saveRefreshToken(redis: Redis | null, token: string) {
  if (redis) await redis.set(REFRESH_TOKEN_KEY, token).catch(() => undefined);
}

async function getAccessToken(redis: Redis | null) {
  if (redis) {
    const [cached, validUntil] = await Promise.all([
      redis.get<string>(ACCESS_TOKEN_KEY).catch(() => null),
      redis.get<number>(ACCESS_TOKEN_TTL_KEY).catch(() => null),
    ]);
    if (cached && validUntil && Date.now() < validUntil - 60_000) return cached;
  }

  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
  const refreshToken = await getRefreshToken(redis);

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Brakuje danych autoryzacji Allegro");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://allegro.pl/auth/oauth/token", {
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

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.access_token) {
    throw new Error(data?.error_description ?? data?.error ?? "Błąd autoryzacji Allegro");
  }

  if (data.refresh_token) await saveRefreshToken(redis, data.refresh_token);

  if (redis) {
    const expiresIn = Math.max(60, Number(data.expires_in ?? 3600));
    await Promise.all([
      redis.set(ACCESS_TOKEN_KEY, data.access_token, { ex: expiresIn }).catch(() => undefined),
      redis.set(ACCESS_TOKEN_TTL_KEY, Date.now() + expiresIn * 1000, { ex: expiresIn }).catch(() => undefined),
    ]);
  }

  return data.access_token as string;
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

  return mapAllegroOffers({ offers: allOffers });
}

async function loadProducts(): Promise<AllegroProduct[]> {
  const redis = getRedis();

  if (redis) {
    const cached = await redis.get<AllegroProduct[]>(OFFERS_CACHE_KEY).catch(() => null);
    if (cached?.length) return cached;
  }

  const accessToken = await getAccessToken(redis);
  const products = await fetchAllActiveOffers(accessToken);

  if (redis && products.length) {
    await redis.set(OFFERS_CACHE_KEY, products, { ex: CACHE_SECONDS }).catch(() => undefined);
  }

  return products;
}

export async function GET() {
  try {
    const products = await loadProducts();
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=3600`,
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Allegro synchronization failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
