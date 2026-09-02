import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const STATE_COOKIE = "allegro_oauth_state";
const REFRESH_TOKEN_KEY = "allegro:refresh_token";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get(STATE_COOKIE)?.value;

  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
  const redirectUri = `${request.nextUrl.origin}/api/allegro/callback`;

  if (!code) {
    return NextResponse.json({ error: "Brakuje code" }, { status: 400 });
  }

  if (!state || !savedState || state !== savedState) {
    return NextResponse.json({ error: "Nieprawidłowy stan autoryzacji Allegro" }, { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Brakuje ALLEGRO_CLIENT_ID albo ALLEGRO_CLIENT_SECRET" },
      { status: 500 }
    );
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://allegro.pl/auth/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.error_description ?? data?.error ?? "Błąd autoryzacji Allegro" },
      { status: response.status }
    );
  }

  if (!data?.refresh_token) {
    return NextResponse.json({ error: "Allegro nie zwróciło refresh tokenu" }, { status: 502 });
  }

  await redis.set(REFRESH_TOKEN_KEY, data.refresh_token);

  const result = NextResponse.json({ ok: true, message: "Konto Allegro zostało ponownie autoryzowane." });
  result.cookies.delete(STATE_COOKIE);
  return result;
}
