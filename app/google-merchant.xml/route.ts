import { getOfferPath, type AllegroProduct } from "@/lib/allegro";

export const dynamic = "force-dynamic";

const baseUrl = "https://trendeco.eu";

function escapeXml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getDiscountedPrice(product: AllegroProduct) {
  const price = Number.parseFloat(String(product.price).replace(",", "."));
  if (!Number.isFinite(price)) return product.price;
  const discounted = price * 0.95;
  const roundedDownToNine = Math.floor((discounted + 1) / 10) * 10 - 1;
  return Math.max(9, roundedDownToNine).toFixed(2);
}

function descriptionFor(product: AllegroProduct) {
  return `${product.name}. Nowy produkt dostępny w TrendEco. Kategoria: ${product.category}. Aktualna cena i dostępność na trendeco.eu. Możliwość zamówienia z dostawą na terenie Polski.`;
}

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const response = await fetch(`${baseUrl}/api/allegro/offers`, {
      next: { revalidate: 1800 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const products = await getProducts();

  const items = products
    .filter((product) => product.id && product.name && product.image && product.price)
    .map((product) => {
      const price = getDiscountedPrice(product);
      const link = `${baseUrl}${getOfferPath(product)}`;
      const availability = product.stock > 0 ? "in_stock" : "out_of_stock";

      return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <title>${escapeXml(product.name)}</title>
      <description>${escapeXml(descriptionFor(product))}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(product.image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${escapeXml(`${price} ${product.currency || "PLN"}`)}</g:price>
      <g:condition>new</g:condition>
      <g:brand>TrendEco</g:brand>
      <g:product_type>${escapeXml(product.category)}</g:product_type>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>TrendEco — katalog produktów</title>
    <link>${baseUrl}</link>
    <description>Aktualny katalog produktów TrendEco dla Google Merchant Center</description>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
