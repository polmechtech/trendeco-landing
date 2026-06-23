import { NextResponse } from "next/server";
import { mapAllegroOffers } from "@/lib/allegro";
import fs from "fs";
import path from "path";

const tokenFile = path.join(process.cwd(), ".allegro-refresh-token");

function getStoredRefreshToken() {
  if (fs.existsSync(tokenFile)) {
    return fs.readFileSync(tokenFile, "utf8").trim();
  }

  return process.env.ALLEGRO_REFRESH_TOKEN;
}

function saveRefreshToken(refreshToken: string) {
  fs.writeFileSync(tokenFile, refreshToken, "utf8");
}

export async function GET() {
  try {
    const clientId = process.env.ALLEGRO_CLIENT_ID;
    const clientSecret = process.env.ALLEGRO_CLIENT_SECRET;
    const refreshToken = getStoredRefreshToken();

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json({
        error: "Brakuje danych Allegro",
        clientId: Boolean(clientId),
        clientSecret: Boolean(clientSecret),
        refreshToken: Boolean(refreshToken),
      });
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
      saveRefreshToken(tokenData.refresh_token);
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