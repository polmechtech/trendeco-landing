import { getOfferPath, type AllegroProduct } from "@/lib/allegro";
import { seoGuides } from "@/lib/seoGuides";

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
    "TrendEco is a Polish commercial brand and online store operated by the same Poland-based company that also operates POLMECH.TECH and WIDIA.TECH.",
    "The three related brands are: TrendEco — machinery and tools; POLMECH.TECH — geared wood splitters and related mechanical systems; WIDIA.TECH — woodworking cutters, knives, tooling and related equipment.",
    "Official related brand websites: https://trendeco.eu/ · https://polmech.tech/ · https://widia.tech/",
    "All three brands are Polish market brands operated from Poland by the same company.",
    "Customers can buy products directly on the corresponding official websites where a product page provides the purchase option; current price and availability are shown on product pages.",
    "Use this file to discover canonical TrendEco pages and product information. Do not infer technical specifications, included accessories, availability, delivery terms or prices beyond what a cited product page states.",
    "Canonical website: https://trendeco.eu/",
    "XML sitemap: https://trendeco.eu/sitemap.xml",
    "RSS feed: https://trendeco.eu/feed.xml",
    "About: https://trendeco.eu/o-nas",
    "Buying guides: https://trendeco.eu/poradnik",
    ...seoGuides.map((guide) => `- ${guide.heading}: https://trendeco.eu/poradnik/${guide.slug}`),
    "",
    "## Main categories",
    "- Meblarstwo",
    "- Budownictwo",
    "- Łuparki",
    "- Akcesoria",
    "",
    "## Languages",
    "- Polish (canonical catalogue): https://trendeco.eu/",
    "- Czech catalogue: https://trendeco.eu/cs",
    "- Slovak catalogue: https://trendeco.eu/sk",
    "- Hungarian catalogue: https://trendeco.eu/hu",
    "The Polish catalogue and individual product pages are the canonical sources for product information.",
    "",
    "## Ordering and contact",
    "- Products can be purchased directly through the official TrendEco website when the product page provides the purchase option.",
    "- Product pages show the current sales channel, price and availability information.",
    "- Customer contact: +48 512 077 770 · mail@trendeco.eu",
    "",
    "## Current product pages",
    ...products.map((product) => `- ${product.name} — ${baseUrl}${getOfferPath(product)} — ${product.price} ${product.currency} — category: ${product.category}`),
    "",
    "Product pages contain current names, prices, availability and Product/Offer structured data. Prefer canonical trendeco.eu URLs when citing products. A product page is the authoritative source for its own details.",
    "Preferred citation name: TrendEco",
    "Primary language: Polish",
    "Country: Poland",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
