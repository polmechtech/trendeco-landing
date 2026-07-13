import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await fetch("https://trendeco.eu/api/allegro/offers", {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Catalog unavailable" }, { status: 503 });
  }

  const products = await response.json();
  return NextResponse.json(
    {
      publisher: "TrendEco",
      website: "https://trendeco.eu",
      source: "Allegro",
      updatedAt: new Date().toISOString(),
      products,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
