export type ProductCategory =
  | "Łuparki"
  | "Budownictwo"
  | "Meblarstwo"
  | "Akcesoria"
  | "Inne";

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

export function classifyProduct(name: string): ProductCategory {
  const n = name.toLowerCase();

  if (n.includes("łupar") || n.includes("rozłupyw")) return "Łuparki";

  if (
    n.includes("piła pierścieniowa") ||
    n.includes("piła pierscieniowa") ||
    n.includes("ring saw") ||
    n.includes("przecinarka") ||
    n.includes("prowadnica do piły") ||
    n.includes("prowadnica 2,5") ||
    n.includes("prowadnica 2.5") ||
    n.includes("beton") ||
    n.includes("żelbet")
  ) {
    return "Budownictwo";
  }

  if (
    n.includes("piła formatowa") ||
    n.includes("formatowa") ||
    n.includes("okleiniarka")
  ) {
    return "Meblarstwo";
  }

  if (
    n.includes("wał spiralny") ||
    n.includes("wal spiralny") ||
    n.includes("nóż") ||
    n.includes("noże") ||
    n.includes("płytka") ||
    n.includes("frez")
  ) {
    return "Akcesoria";
  }

  return "Inne";
}

export function getSelectedOfferIds(): Set<string> {
  const raw = process.env.ALLEGRO_OFFER_IDS?.trim();
  if (!raw) return new Set();

  return new Set(
    raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );
}

export function mapAllegroOffers(data: any): AllegroProduct[] {
  const offers = Array.isArray(data?.offers) ? data.offers : [];
  const selectedIds = getSelectedOfferIds();

  return offers
    .filter((offer: any) => selectedIds.size === 0 || selectedIds.has(String(offer.id)))
    .map((offer: any) => ({
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
