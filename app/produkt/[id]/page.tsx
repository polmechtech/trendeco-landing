import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { AllegroProduct } from "@/lib/allegro";

export const dynamic = "force-dynamic";

const PHONE_DISPLAY = "+48 512 077 770";
const PHONE_LINK = "+48512077770";
const EMAIL = "info@widia.tech";

async function getProduct(id: string): Promise<AllegroProduct | null> {
  try {
    const response = await fetch("https://trendeco.eu/api/allegro/offers", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const products = (await response.json()) as AllegroProduct[];
    return products.find((product) => product.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Oferta niedostępna", robots: { index: false } };
  const description = `${product.name}. Cena ${product.price} ${product.currency}. Aktualna dostępność: ${product.stock} szt. Kup na Allegro albo skontaktuj się po indywidualną ofertę.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/produkt/${product.id}` },
    openGraph: {
      title: product.name,
      description,
      url: `/produkt/${product.id}`,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const emailSubject = encodeURIComponent(`Zapytanie o ofertę: ${product.name}`);
  const emailBody = encodeURIComponent(
    `Dzień dobry, proszę o indywidualną ofertę na produkt: ${product.name}\nID oferty Allegro: ${product.id}`
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ? [product.image] : undefined,
    sku: product.id,
    brand: { "@type": "Brand", name: "TrendEco" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: product.currency,
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "TrendEco" },
    },
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <article className="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-zinc-50">
          {product.image ? (
            <img src={product.image} alt={product.name} className="max-h-[520px] max-w-full object-contain" />
          ) : (
            <span className="text-zinc-400">Brak zdjęcia</span>
          )}
        </div>
        <div>
          <a href="/" className="text-sm font-semibold text-zinc-500">← Wróć do katalogu</a>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-orange-600">{product.category}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight">{product.name}</h1>
          <p className="mt-6 text-3xl font-black text-orange-600">{product.price} {product.currency}</p>
          <p className="mt-3 text-zinc-600">Dostępność na Allegro: {product.stock > 0 ? `${product.stock} szt.` : "brak"}</p>
          <p className="mt-6 text-zinc-600">Cena i stan magazynowy są synchronizowane z Allegro co godzinę.</p>

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-8 block rounded-full bg-orange-500 px-6 py-4 text-center text-lg font-black text-white hover:bg-orange-600"
          >
            Kup teraz na Allegro
          </a>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-xl font-black">Chcesz lepszą ofertę niż na Allegro?</h2>
            <p className="mt-2 text-zinc-600">
              Zadzwoń lub napisz. Przygotujemy indywidualną ofertę dla tego produktu.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${PHONE_LINK}`}
                className="rounded-full bg-zinc-950 px-5 py-3 text-center font-bold text-white hover:bg-zinc-800"
              >
                Zadzwoń: {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${emailSubject}&body=${emailBody}`}
                className="rounded-full border border-zinc-300 bg-white px-5 py-3 text-center font-bold text-zinc-950 hover:bg-zinc-100"
              >
                Napisz e-mail
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
