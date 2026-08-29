import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOfferPath, type AllegroProduct } from "@/lib/allegro";
import { getSeoCategory, matchesSeoCategory, seoCategories } from "@/lib/seoCategories";

export const revalidate = 3600;

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const response = await fetch("https://trendeco.eu/api/allegro/offers", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return seoCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getSeoCategory(slug);
  if (!category) return { title: "Kategoria niedostępna", robots: { index: false, follow: true } };

  const path = `/kategoria/${category.slug}`;
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: path },
    keywords: [category.keyword, "TrendEco", "maszyny", "narzędzia", "Warszawa", "Polska"],
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: path,
      siteName: "TrendEco",
      title: category.title,
      description: category.description,
    },
    twitter: {
      card: "summary_large_image",
      title: category.title,
      description: category.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function SeoCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getSeoCategory(slug);
  if (!category) notFound();

  const products = (await getProducts()).filter((product) => matchesSeoCategory(product, category));
  const url = `https://trendeco.eu/kategoria/${category.slug}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.heading,
    description: category.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://trendeco.eu${getOfferPath(product)}`,
        name: product.name,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <header className="bg-zinc-950 px-4 py-8 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <a href="/" className="text-sm font-bold text-orange-400">← TrendEco</a>
          <h1 className="mt-5 max-w-5xl text-3xl font-black leading-tight sm:text-5xl">{category.heading}</h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-zinc-300 sm:text-lg">{category.intro}</p>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Powiązane kategorie" className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {seoCategories.map((item) => (
              <a
                key={item.slug}
                href={`/kategoria/${item.slug}`}
                className={`min-w-max rounded-full border px-4 py-2 text-sm font-bold ${item.slug === category.slug ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
              >
                {item.keyword}
              </a>
            ))}
          </nav>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article key={product.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:rounded-3xl sm:p-4">
                  <a href={getOfferPath(product)} className="block">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-zinc-400">Brak zdjęcia</span>
                      )}
                    </div>
                    <h2 className="mt-3 text-sm font-black leading-snug sm:text-base">{product.name}</h2>
                    <p className="mt-2 text-lg font-black text-orange-600 sm:text-xl">{product.price} {product.currency}</p>
                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{product.stock > 0 ? `Dostępne: ${product.stock} szt.` : "Sprawdź dostępność"}</p>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-zinc-600">
              Aktualne oferty z tej kategorii są w trakcie aktualizacji. Sprawdź pełny katalog TrendEco.
            </div>
          )}

          <section className="mt-12 max-w-4xl border-t border-zinc-200 pt-8">
            <h2 className="text-2xl font-black">{category.keyword} — oferta TrendEco</h2>
            <p className="mt-4 leading-7 text-zinc-700">{category.intro}</p>
            <p className="mt-4 leading-7 text-zinc-700">TrendEco prowadzi sprzedaż maszyn i narzędzi w Polsce. Aktualne produkty możesz sprawdzić bezpośrednio na stronie, przez Allegro i ERLI. Przy wybranych produktach dostępne jest również zamówienie bezpośrednie.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
