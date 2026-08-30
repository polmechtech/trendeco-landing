"use client";

import { useMemo, useState } from "react";
import type { AllegroProduct, ProductCategory } from "@/lib/allegro";
import { allegroUrl, texts, type SiteLocale } from "@/lib/locales";

const sections: ProductCategory[] = ["Łuparki", "Budownictwo", "Meblarstwo", "Akcesoria"];

function categoryId(category: ProductCategory) {
  return `category-${category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-")}`;
}

export default function LocalizedProductCatalog({ products, locale }: { products: AllegroProduct[]; locale: SiteLocale }) {
  const t = texts[locale];
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return products;
    return products.filter((product) => `${product.name} ${product.category}`.toLocaleLowerCase().includes(normalizedQuery));
  }, [products, normalizedQuery]);

  return (
    <section className="bg-white px-3 py-5 text-zinc-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <label htmlFor={`product-search-${locale}`} className="sr-only">{t.search}</label>
          <input id={`product-search-${locale}`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="min-h-12 w-full max-w-3xl rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100" />
          <nav className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">{sections.map((section) => <a key={section} href={`#${categoryId(section)}`} className="flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-center text-sm font-bold">{t.categories[section]}</a>)}</nav>
        </div>
        {sections.map((section) => {
          const sectionProducts = filteredProducts.filter((product) => product.category === section);
          if (!sectionProducts.length) return null;
          return <section key={section} id={categoryId(section)} className="scroll-mt-6 pb-10"><h2 className="mb-4 border-b border-zinc-200 pb-3 text-2xl font-black sm:text-4xl">{t.categories[section]}</h2><div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">{sectionProducts.map((product) => {
            const href = allegroUrl(locale, product.id);
            return <article key={product.id} className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-2.5 sm:rounded-3xl sm:p-4"><a href={href} target="_blank" rel="noopener noreferrer sponsored" className="block min-w-0"><div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white p-1 sm:h-48 sm:aspect-auto sm:rounded-2xl sm:p-0">{product.image ? <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain" /> : null}</div><h3 className="mt-2 line-clamp-3 min-h-[3.6rem] break-words text-[13px] font-bold leading-[1.2] sm:mt-4 sm:text-base sm:leading-normal">{product.name}</h3></a><p className="mt-2 text-[11px] text-zinc-600 sm:text-sm">{product.stock > 0 ? `${t.available}: ${product.stock}` : t.unavailable}</p><a href={href} target="_blank" rel="noopener noreferrer sponsored" className="mt-auto flex min-h-11 items-center justify-center rounded-xl bg-orange-500 px-2 py-2 text-center text-[11px] font-black text-white active:scale-[0.98] sm:rounded-full sm:px-4 sm:py-3 sm:text-sm">{t.buyAllegro}</a></article>;
          })}</div></section>;
        })}
        {filteredProducts.length === 0 && <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-12 text-center"><p className="text-lg font-black">{t.noResults}</p><button type="button" onClick={() => setQuery("")} className="mt-5 min-h-11 rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-white">{t.clear}</button></div>}
      </div>
    </section>
  );
}
