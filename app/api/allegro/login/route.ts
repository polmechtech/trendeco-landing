import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const redirectUri = "http://localhost:3000/api/allegro/callback";

  if (!clientId) {
    return NextResponse.json({ error: "Brakuje ALLEGRO_CLIENT_ID" }, { status: 500 });
  }

  const url = new URL("https://allegro.pl/auth/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("prompt", "confirm");

  return NextResponse.redirect(url.toString());
}