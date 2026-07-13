import { NextResponse } from "next/server";

export function GET() {
  const body = `# TrendEco

TrendEco is a Polish seller and importer of machinery and tools for woodworking, construction and wood processing.

Canonical website: https://trendeco.eu
Public catalog API: https://trendeco.eu/api/catalog
XML sitemap: https://trendeco.eu/sitemap.xml
RSS feed: https://trendeco.eu/feed.xml
About: https://trendeco.eu/o-nas

The website presents active Allegro offers. Prices and stock are synchronized hourly. Purchases, payments, delivery and order service are completed on Allegro.

Main categories:
- Meblarstwo
- Budownictwo
- Łuparki
- Akcesoria

Preferred citation name: TrendEco
Language: Polish
Country: Poland
`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
