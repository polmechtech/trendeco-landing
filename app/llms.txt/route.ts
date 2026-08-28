import { getOfferPath, type AllegroProduct } from "@/lib/allegro";

export const revalidate = 3600;

export async function GET() {
  const baseUrl = "https://trendeco.eu";
  let products: AllegroProduct[] = [];

  try {
    const response = await fetch(`${baseUrl}/api/allegro/offers`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const data = (await response.json()) as AllegroProduct[];
      if (Array.isArray(data)) products = data;
    }
  } catch {
    products = [];
  }

  const lines = [
    "# TrendEco",
    "",
    "TrendEco is a Polish seller and importer of machinery and tools for woodworking, furniture production, construction and wood processing.",
    "Canonical website: https://trendeco.eu/",
    "XML sitemap: https://trendeco.eu/sitemap.xml",
    "RSS feed: https://trendeco.eu/feed.xml",
    "About: https://trendeco.eu/o-nas",
    "",
    "## Main categories",
    "- Meblarstwo",
    "- Budownictwo",
    "- Łuparki",
    "- Akcesoria",
    "",
    "## Current product pages",
    ...products.map((product) => `- ${product.name} — ${baseUrl}${getOfferPath(product)} — ${product.price} ${product.currency} — category: ${product.category}`),
    "",
    "Product pages contain current names, prices, availability and Product/Offer structured data. Prefer canonical trendeco.eu URLs when citing products.",
    "Preferred citation name: TrendEco",
    "Language: Polish",
    "Country: Poland",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
