import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const externalId = request.nextUrl.searchParams.get("id")?.trim();

  if (!externalId || !/^\d+$/.test(externalId)) {
    return NextResponse.json(
      { error: "Pass a numeric Allegro/ERLI externalId in ?id=" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const apiKey = process.env.ERLI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ERLI_API_KEY is not configured" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const response = await fetch(
      `https://erli.pl/svc/shop-api/products/${encodeURIComponent(externalId)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
          "User-Agent": "TrendEco/1.0 (ERLI price diagnostic)",
        },
        cache: "no-store",
      }
    );

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          externalId,
          erliStatus: response.status,
          error: body?.message ?? body?.error ?? "ERLI request failed",
        },
        { status: response.status, headers: { "Cache-Control": "no-store" } }
      );
    }

    const priceFields = body && typeof body === "object"
      ? Object.fromEntries(
          Object.entries(body).filter(([key]) =>
            /(price|promo|discount|mobile|app|go|campaign|catalogue)/i.test(key)
          )
        )
      : {};

    return NextResponse.json(
      {
        externalId,
        erliStatus: response.status,
        priceFields,
        availableTopLevelFields:
          body && typeof body === "object" ? Object.keys(body).sort() : [],
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        externalId,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
