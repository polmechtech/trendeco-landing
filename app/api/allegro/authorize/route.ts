import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE = "allegro_oauth_state";

export async function GET(request: NextRequest) {
  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const adminSecret = process.env.ADMIN_SECRET;
  const suppliedSecret = request.nextUrl.searchParams.get("key");

  if (!clientId) {
    return NextResponse.json(
      { error: "Brakuje ALLEGRO_CLIENT_ID" },
      { status: 500 }
    );
  }

  if (adminSecret && suppliedSecret !== adminSecret) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }

  const state = randomBytes(24).toString("hex");
  const redirectUri = `${request.nextUrl.origin}/api/allegro/callback`;
  const authorizationUrl = new URL("https://allegro.pl/auth/oauth/authorize");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
