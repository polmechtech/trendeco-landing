import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { mapAllegroOffers } from "@/lib/allegro";

const redis = Redis.fromEnv();

const REFRESH_TOKEN_KEY = "allegro:refresh_token";
const LOCK_KEY = "allegro:refresh_lock";

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
  const result = await redis.set(LOCK_KEY, "1", {
    nx: true,
    ex: 20,
  });

  return result === "OK";
}

async function releaseLock() {
  await redis.del(LOCK_KEY);
}

async function getAccessToken() {
  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Brakuje ALLEGRO_CLIENT_ID albo ALLEGRO_CLIENT_SECRET");
  }

  let hasLock = await acquireLock();

  for (let i = 0; i < 10 && !hasLock; i++) {
    await sleep(500);
    hasLock = await acquireLock();
  }

  if (!hasLock) {
    throw new Error("Nie udało się uzyskać blokady Redis dla tokenu");
  }

  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error("Brakuje refresh tokenu");
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

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
    });

    const tokenText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      throw new Error(`Token error ${tokenResponse.status}: ${tokenText}`);
    }

    const tokenData = JSON.parse(tokenText);

    if (!tokenData.access_token) {
      throw new Error("Brak access_token w odpowiedzi Allegro");
    }

    if (tokenData.refresh_token) {
      await saveRefreshToken(tokenData.refresh_token);
    }

    return tokenData.access_token as string;
  } finally {
    await releaseLock();
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const offersResponse = await fetch(
      "https://api.allegro.pl/sale/offers?publication.status=ACTIVE&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.allegro.public.v1+json",
        },
      }
    );

    const offersText = await offersResponse.text();

    if (!offersResponse.ok) {
      return NextResponse.json({
        error: "Offers error",
        status: offersResponse.status,
        details: offersText,
      });
    }

    const offersData = JSON.parse(offersText);

    return NextResponse.json(mapAllegroOffers(offersData));
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server crash",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}