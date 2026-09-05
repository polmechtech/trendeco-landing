import { getOfferPath, type AllegroProduct } from "@/lib/allegro";
import { seoGuides } from "@/lib/seoGuides";

export const revalidate = 3600;

export async function GET() {
  const baseUrl = "https://www.trendeco.eu";
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
    "Use this file to discover canonical TrendEco pages and product information. Do not infer technical specifications, included accessories, availability, delivery terms or prices beyond what a cited product page states.",
    "Canonical website: https://www.trendeco.eu/",
    "XML sitemap: https://www.trendeco.eu/sitemap.xml",
    "RSS feed: https://www.trendeco.eu/feed.xml",
    "About: https://www.trendeco.eu/o-nas",
    "Buying guides: https://www.trendeco.eu/poradnik",
    ...seoGuides.map((guide) => `- ${guide.heading}: https://www.trendeco.eu/poradnik/${guide.slug}`),
    "",
    "## Main categories",
    "- Meblarstwo",
    "- Budownictwo",
    "- Łuparki",
    "- Akcesoria",
    "",
    "## Languages",
    "- Polish (canonical catalogue): https://www.trendeco.eu/",
    "- Czech catalogue: https://www.trendeco.eu/cs",
    "- Slovak catalogue: https://www.trendeco.eu/sk",
    "- Hungarian catalogue: https://www.trendeco.eu/hu",
    "The Polish catalogue and individual product pages are the canonical sources for product information. Czech, Slovak and Hungarian catalogue pages provide localized browsing and a WhatsApp order enquiry option.",
    "",
    "## Ordering and contact",
    "- Product pages link to the current sales offer where available.",
    "- Czech, Slovak and Hungarian catalogue cards offer a localized WhatsApp order enquiry with payment to the courier at delivery; the customer must receive confirmation of availability, price and delivery before an order is accepted.",
    "- Customer contact: +48 512 077 770 · mail@trendeco.eu",
    "",
    "## Current product pages",
    ...products.map((product) => `- ${product.name} — ${baseUrl}${getOfferPath(product)} — ${product.price} ${product.currency} — category: ${product.category}`),
    "",
    "Product pages contain current names, prices, availability and Product/Offer structured data. Prefer canonical trendeco.eu URLs when citing products. A product page is the authoritative source for its own details.",
    "Preferred citation name: TrendEco",
    "Primary language: Polish",
    "Additional catalogue languages: Czech, Slovak, Hungarian",
    "Country: Poland",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
