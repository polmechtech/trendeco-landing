import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { mapAllegroOffers } from "@/lib/allegro";

const redis = Redis.fromEnv();
const REFRESH_TOKEN_KEY = "allegro:refresh_token";

async function getRefreshToken() {
  const tokenFromRedis = await redis.get<string>(REFRESH_TOKEN_KEY);
  return tokenFromRedis || process.env.ALLEGRO_REFRESH_TOKEN;
}

async function saveRefreshToken(token: string) {
  await redis.set(REFRESH_TOKEN_KEY, token);
}

export async function GET() {
  try {
    const clientId = process.env.ALLEGRO_CLIENT_ID;
    const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
    const refreshToken = await getRefreshToken();

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json({
        error: "Brakuje danych Allegro",
        clientId: Boolean(clientId),
        clientSecret: Boolean(clientSecret),
        refreshToken: Boolean(refreshToken),
      });
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
      return NextResponse.json({
        error: "Token error",
        status: tokenResponse.status,
        details: tokenText,
      });
    }

    const tokenData = JSON.parse(tokenText);

    if (tokenData.refresh_token) {
      await saveRefreshToken(tokenData.refresh_token);
    }

    const offersResponse = await fetch(
      "https://api.allegro.pl/sale/offers?publication.status=ACTIVE&limit=50",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
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
    return NextResponse.json({
      error: "Server crash",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}