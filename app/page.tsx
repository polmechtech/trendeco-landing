import { headers } from "next/headers";
import type { AllegroProduct, ProductCategory } from "@/lib/allegro";

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    if (!host) return [];

    const res = await fetch(`${protocol}://${host}/api/allegro/offers`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const sections: ProductCategory[] = [
  "Łuparki",
  "Budownictwo",
  "Meblarstwo",
  "Akcesoria",
  "Inne",
];

export default async function Home() {
  const products = await getProducts();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TrendEco",
    url: "https://trendeco.eu",
    inLanguage: "pl-PL",
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-5xl font-black md:text-7xl">TrendEco</h1>
        <p className="mt-6 max-w-3xl text-xl text-zinc-300">
          Maszyny i narzędzia dostępne w sprzedaży przez Allegro. Ceny i stany
          magazynowe są aktualizowane automatycznie co godzinę.
        </p>
        <a href="/o-nas" className="mt-6 inline-block text-sm font-bold text-orange-400">
          O firmie i kontakt →
        </a>
      </section>

      {sections.map((section) => {
        const sectionProducts = products.filter((product) => product.category === section);
        if (sectionProducts.length === 0) return null;

        return (
          <section key={section} className="bg-white px-6 py-16 text-zinc-950">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-4xl font-black">{section}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {sectionProducts.map((product) => (
                  <a
                    key={product.id}
                    href={`/produkt/${product.id}`}
                    className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-white">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-zinc-400">Brak zdjęcia</span>
                      )}
                    </div>
                    <h3 className="mt-4 text-base font-bold">{product.name}</h3>
                    <p className="mt-3 text-xl font-black text-orange-600">
                      {product.price} {product.currency}
                    </p>
                    <p className="mt-2 text-sm text-zinc-600">
                      {product.stock > 0 ? `Dostępne: ${product.stock} szt.` : "Chwilowo niedostępne"}
                    </p>
                    <div className="mt-4 rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white">
                      Zobacz ofertę
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {products.length === 0 && (
        <section className="bg-white px-6 py-20 text-center text-zinc-600">
          Nie udało się obecnie pobrać aktywnych ofert Allegro.
        </section>
      )}
    </main>
  );
}
