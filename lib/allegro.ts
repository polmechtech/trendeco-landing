export type ProductCategory =
  | "Łuparki"
  | "Budownictwo"
  | "Meblarstwo"
  | "Akcesoria";

export type AllegroProduct = {
  id: string;
  name: string;
  image: string;
  price: string;
  currency: string;
  stock: number;
  url: string;
  category: ProductCategory;
};

export const TRENDECO_UI_VERSION = "pobranie-whatsapp-tiktok-v1";

export function classifyProduct(name: string): ProductCategory {
  const n = name.toLowerCase();
  if (
    n.includes("cnc") ||
    n.includes("piła stołowa") ||
    n.includes("pila stolowa") ||
    n.includes("stół") ||
    n.includes("stolowa") ||
    n.includes("stołowa")
  ) return "Meblarstwo";
  if (
    n.includes("łupar") ||
    n.includes("rozłupyw") ||
    n.includes("przekładnia") ||
    n.includes("przekladnia")
  ) return "Łuparki";
  if (
    n.includes("piła pierścieniowa") || n.includes("piła pierscieniowa") ||
    n.includes("ring saw") || n.includes("przecinarka") ||
    n.includes("prowadnica do piły") || n.includes("prowadnica 2,5") ||
    n.includes("prowadnica 2.5") || n.includes("beton") || n.includes("żelbet")
  ) return "Budownictwo";
  if (n.includes("piła formatowa") || n.includes("formatowa") || n.includes("okleiniarka")) return "Meblarstwo";
  if (
    n.includes("wał spiralny") || n.includes("wal spiralny") ||
    n.includes("nóż") || n.includes("noże") || n.includes("płytka") || n.includes("frez") ||
    n.includes("przymiar") || n.includes("osłona") || n.includes("oslona")
  ) return "Akcesoria";
  return "Meblarstwo";
}

export function slugifyOfferName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 140) || "oferta";
}

export function getOfferPath(product: Pick<AllegroProduct, "id" | "name">): string {
  return `/oferta/${slugifyOfferName(product.name)}-${product.id}`;
}

export function extractOfferId(slug: string): string | null {
  const match = slug.match(/-(\d+)$/);
  return match?.[1] ?? null;
}

export function mapAllegroOffers(data: any): AllegroProduct[] {
  const offers = Array.isArray(data?.offers) ? data.offers : [];
  return offers.map((offer: any) => ({
    id: String(offer.id),
    name: String(offer.name ?? ""),
    image: offer.primaryImage?.url ?? "",
    price: offer.sellingMode?.price?.amount ?? "",
    currency: offer.sellingMode?.price?.currency ?? "PLN",
    stock: Number(offer.stock?.available ?? 0),
    url: `https://allegro.pl/oferta/${offer.id}`,
    category: classifyProduct(String(offer.name ?? "")),
  }));
}
