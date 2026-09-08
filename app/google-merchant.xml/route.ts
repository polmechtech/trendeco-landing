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
  return product.description?.slice(0, 5000) || `${product.name}. Nowy produkt dostępny w TrendEco. Kategoria: ${product.category}. Aktualna cena, dostępność i możliwość zakupu bezpośrednio na trendeco.eu. Darmowa dostawa na terenie Polski.`;
}

function confirmedFacts(product: AllegroProduct) {
  const source = `${product.name} ${product.description || ""}`.replace(/\s+/g, " ");
  const facts: { section: string; name: string; value: string }[] = [];
  const add = (name: string, regex: RegExp, section = "Parametry techniczne") => {
    const match = source.match(regex);
    if (match?.[1]) facts.push({ section, name, value: match[1].trim() });
  };
  const wholeNumber = String.raw`(?:\d{1,2}(?:[ \u00A0]\d{3})+|\d{3,5})`;
  add("Napięcie", /\b(230\s?V|400\s?V|220\s?V|380\s?V)\b/i);
  add("Moc", new RegExp(`\\b(${wholeNumber}(?:[.,]\\d+)?\\s?W|\\d{1,3}(?:[.,]\\d+)?\\s?kW)\\b`, "i"));
  add("Prędkość obrotowa", new RegExp(`\\b(${wholeNumber}\\s?(?:obr\\.?\\/?min|rpm|r\\/?min))\\b`, "i"));
  add("Średnica", /\b(?:średnica|Ø|fi)\s*[:=]?\s*(\d{2,4}(?:[.,]\d+)?\s?mm)\b/i);
  add("Wymiar", /\b(\d{2,4}\s?[x×]\s?\d{2,4}(?:\s?[x×]\s?\d{1,4})?\s?mm)\b/i);
  return facts.slice(0, 6);
}

function highlightsFor(product: AllegroProduct) {
  const facts = confirmedFacts(product);
  const highlights = [`Typ produktu: ${product.category}`];
  for (const fact of facts.slice(0, 4)) highlights.push(`${fact.name}: ${fact.value}`);
  if (product.stock > 0) highlights.push("Produkt dostępny do zakupu bezpośrednio na trendeco.eu");
  return [...new Set(highlights)].slice(0, 6);
}

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const response = await fetch(`${baseUrl}/api/allegro/offers`, { next: { revalidate: 1800 } });
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
      const highlights = highlightsFor(product).map((value) => `<g:product_highlight>${escapeXml(value)}</g:product_highlight>`).join("");
      const details = confirmedFacts(product).map((fact) => `<g:product_detail><g:section_name>${escapeXml(fact.section)}</g:section_name><g:attribute_name>${escapeXml(fact.name)}</g:attribute_name><g:attribute_value>${escapeXml(fact.value)}</g:attribute_value></g:product_detail>`).join("");
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
      <g:brand>${escapeXml(product.gpsr?.manufacturer?.name || "TrendEco")}</g:brand>
      <g:product_type>${escapeXml(product.category)}</g:product_type>
      ${highlights}${details}
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping><g:country>PL</g:country><g:service>Darmowa dostawa TrendEco</g:service><g:price>0 PLN</g:price></g:shipping>
    </item>`;
    }).join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>TrendEco — katalog produktów</title><link>${baseUrl}</link><description>Aktualny katalog produktów TrendEco dla Google Merchant Center i systemów Google AI</description>${items}</channel></rss>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
