"use client";

import { useMemo, useState } from "react";
import { getOfferPath, type AllegroProduct, type ProductCategory } from "@/lib/allegro";

type ErliInfo = { price: string; currency: string; url: string };
type ErliMap = Record<string, ErliInfo>;

const sections: ProductCategory[] = ["Łuparki", "Budownictwo", "Meblarstwo", "Akcesoria"];

function getDiscountedPrice(product: AllegroProduct) {
  const price = Number.parseFloat(String(product.price).replace(",", "."));
  if (!Number.isFinite(price)) return product.price;
  const discounted = price * 0.95;
  const roundedDownToNine = Math.floor((discounted + 1) / 10) * 10 - 1;
  return Math.max(9, roundedDownToNine).toFixed(2);
}

function getCashOnDeliveryLink(product: AllegroProduct) {
  const discountedPrice = getDiscountedPrice(product);
  const message = [
    "Dzień dobry, chcę zamówić za pobraniem:",
    product.name,
    `Cena TrendEco: ${discountedPrice} ${product.currency}`,
    `Allegro ID: ${product.id}`,
    "Proszę o potwierdzenie dostępności oraz kosztu dostawy.",
  ].join("\n");
  return `https://wa.me/48512077770?text=${encodeURIComponent(message)}`;
}

function categoryId(category: ProductCategory) {
  return `kategoria-${category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-")}`;
}

export default function ProductCatalog({ products, erliPrices }: { products: AllegroProduct[]; erliPrices: ErliMap }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("pl-PL");

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return products;
    return products.filter((product) =>
      `${product.name} ${product.category}`.toLocaleLowerCase("pl-PL").includes(normalizedQuery),
    );
  }, [products, normalizedQuery]);

  const counts = useMemo(() => {
    return Object.fromEntries(sections.map((section) => [section, products.filter((product) => product.category === section).length])) as Record<ProductCategory, number>;
  }, [products]);

  return (
    <section className="bg-white px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <label htmlFor="product-search" className="mb-3 block text-sm font-black uppercase tracking-[0.14em] text-zinc-500">
            Szukaj produktu
          </label>
          <div className="relative max-w-3xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-zinc-400">⌕</span>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Np. łuparka, przekładnia, piła, okleiniarka, frez..."
              className="w-full rounded-2xl border border-zinc-300 bg-white py-4 pl-12 pr-4 text-base outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>
          {normalizedQuery && (
            <p className="mt-3 text-sm text-zinc-500">
              Znaleziono: <strong className="text-zinc-900">{filteredProducts.length}</strong>
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside>
            <div className="lg:sticky lg:top-6">
              <h2 className="mb-4 text-xl font-black">Kategorie</h2>
              <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                {sections.map((section) => (
                  <a
                    key={section}
                    href={`#${categoryId(section)}`}
                    className="flex min-w-max items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-bold transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 lg:w-full"
                  >
                    <span>{section}</span>
                    <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">{counts[section]}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            {sections.map((section) => {
              const sectionProducts = filteredProducts.filter((product) => product.category === section);
              if (sectionProducts.length === 0) return null;

              return (
                <section key={section} id={categoryId(section)} className="scroll-mt-6 pb-14 last:pb-0">
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-zinc-200 pb-4">
                    <h2 className="text-3xl font-black sm:text-4xl">{section}</h2>
                    <span className="text-sm font-semibold text-zinc-500">{sectionProducts.length} produktów</span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {sectionProducts.map((product) => {
                      const discountedPrice = getDiscountedPrice(product);
                      const erli = erliPrices[product.id];

                      return (
                        <article key={product.id} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-1 hover:shadow-lg">
                          <a href={getOfferPath(product)}>
                            <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-white">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                              ) : (
                                <span className="text-zinc-400">Brak zdjęcia</span>
                              )}
                            </div>
                            <h3 className="mt-4 text-base font-bold">{product.name}</h3>
                          </a>

                          <div className="mt-3">
                            <p className="text-sm text-zinc-400 line-through">Allegro: {product.price} {product.currency}</p>
                            {erli && <p className="text-sm text-zinc-400 line-through">ERLI: {erli.price} {erli.currency}</p>}
                            <p className="text-xl font-black text-green-700">Cena TrendEco: {discountedPrice} {product.currency}</p>
                          </div>

                          <p className="mt-2 text-sm text-zinc-600">{product.stock > 0 ? `Dostępne: ${product.stock} szt.` : "Chwilowo niedostępne"}</p>

                          <div className="mt-4 grid gap-2">
                            <a href={getCashOnDeliveryLink(product)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-green-500">
                              Zamów za pobraniem — niższa cena
                            </a>
                            {erli && (
                              <a href={erli.url} target="_blank" rel="noopener noreferrer sponsored" className="rounded-full bg-[#00B8B0] px-4 py-3 text-center text-sm font-black text-white transition hover:opacity-90">
                                Kup na ERLI
                              </a>
                            )}
                            <a href={getOfferPath(product)} className="rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-400">
                              Kup na Allegro
                            </a>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
                <p className="text-xl font-black">Nie znaleziono produktów</p>
                <p className="mt-2 text-zinc-500">Spróbuj wpisać inną nazwę lub fragment nazwy produktu.</p>
                <button type="button" onClick={() => setQuery("")} className="mt-5 rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-white">
                  Wyczyść wyszukiwanie
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
