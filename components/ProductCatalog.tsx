"use client";

import { useMemo, useState } from "react";
import { getOfferPath, type AllegroProduct, type ProductCategory } from "@/lib/allegro";

type ErliInfo = { price: string; currency: string; url: string };
type ErliMap = Record<string, ErliInfo>;
type CartItem = { id: string; name: string; price: string; currency: string; image?: string; quantity: number };

const CART_KEY = "trendeco-cart";
const sections: ProductCategory[] = ["Łuparki", "Budownictwo", "Meblarstwo", "Akcesoria"];

function getDiscountedPrice(product: AllegroProduct) {
  const price = Number.parseFloat(String(product.price).replace(",", "."));
  if (!Number.isFinite(price)) return product.price;
  const discounted = price * 0.95;
  const roundedDownToNine = Math.floor((discounted + 1) / 10) * 10 - 1;
  return Math.max(9, roundedDownToNine).toFixed(2);
}

function addToCart(product: AllegroProduct) {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || "[]") as CartItem[];
    const existing = items.find((item) => item.id === product.id);
    const next = existing
      ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { id: product.id, name: product.name, price: getDiscountedPrice(product), currency: product.currency, image: product.image, quantity: 1 }];
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("trendeco-cart-updated"));
    window.location.href = "/koszyk";
  } catch {
    window.location.href = "/koszyk";
  }
}

function categoryId(category: ProductCategory) {
  return `kategoria-${category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-")}`;
}

function constructionRank(product: AllegroProduct) {
  const name = product.name.toLocaleLowerCase("pl-PL");
  const isCutter = name.includes("przecinarka do płytek") || name.includes("przecinarka do plytek") || name.includes("glazury gresu");
  const isElectric = name.includes("elektryczna prowadnica") || name.includes("prowadnica elektryczna");
  const isGuide = name.includes("prowadnica");
  const isSaw = name.includes("piła pierścieniowa") || name.includes("pila pierscieniowa");
  const isLongGuide = name.includes("2,5 m") || name.includes("2,5m");
  if (isCutter) return 90;
  if (isGuide && !isSaw && !isElectric) return 20;
  if (isGuide && !isSaw && isElectric) return 21;
  if (isSaw && isLongGuide && !isElectric) return 30;
  if (isSaw && isElectric) return 31;
  if (isSaw && !isLongGuide && !isElectric) return 10;
  return 50;
}

export default function ProductCatalog({ products, erliPrices }: { products: AllegroProduct[]; erliPrices: ErliMap }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("pl-PL");
  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return products;
    return products.filter((product) => `${product.name} ${product.category}`.toLocaleLowerCase("pl-PL").includes(normalizedQuery));
  }, [products, normalizedQuery]);

  return (
    <section className="bg-white px-3 py-5 text-zinc-950 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="sticky top-0 z-20 -mx-3 mb-5 border-b border-zinc-200 bg-white/95 px-3 pb-3 pt-3 backdrop-blur sm:static sm:mx-0 sm:mb-8 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0 sm:backdrop-blur-none">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <label htmlFor="product-search" className="sr-only">Szukaj produktu</label>
              <div className="relative w-full sm:max-w-3xl">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400">⌕</span>
                <input id="product-search" type="search" inputMode="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj produktu..." className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-white py-3 pl-11 pr-4 text-base shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 sm:min-h-14 sm:py-4 sm:pl-12" />
              </div>
            </div>
            <a href="/" aria-label="TrendEco — strona główna" className="ml-auto hidden shrink-0 sm:block"><img src="/trendeco-logo-official.svg?v=20260830-4" alt="TrendEco" className="h-20 w-auto object-contain lg:h-24" /></a>
          </div>
          <nav className="mt-3 grid grid-cols-2 gap-2 lg:hidden">{sections.map((section) => <a key={section} href={`#${categoryId(section)}`} className="flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-center text-sm font-bold active:scale-[0.98]">{section}</a>)}</nav>
          {normalizedQuery && <p className="mt-2 text-xs text-zinc-500 sm:mt-3 sm:text-sm">Znaleziono: <strong className="text-zinc-900">{filteredProducts.length}</strong></p>}
        </div>
        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="hidden lg:block"><div className="sticky top-6"><h2 className="mb-4 text-xl font-black">Kategorie</h2><nav className="grid grid-cols-2 gap-2">{sections.map((section) => <a key={section} href={`#${categoryId(section)}`} className="flex min-h-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-center text-xs font-bold transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700">{section}</a>)}</nav></div></aside>
          <div className="min-w-0">
            {sections.map((section) => {
              const sectionProducts = filteredProducts.filter((product) => product.category === section).sort((a, b) => section === "Budownictwo" ? constructionRank(a) - constructionRank(b) : 0);
              if (sectionProducts.length === 0) return null;
              return <section key={section} id={categoryId(section)} className="scroll-mt-32 pb-9 last:pb-0 sm:scroll-mt-6 sm:pb-14"><div className="mb-4 border-b border-zinc-200 pb-3 sm:mb-6 sm:pb-4"><h2 className="text-2xl font-black sm:text-4xl">{section}</h2></div><div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-2">{sectionProducts.map((product) => {
                const discountedPrice = getDiscountedPrice(product); const erli = erliPrices[product.id];
                return <article key={product.id} className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-2.5 sm:rounded-3xl sm:p-4 sm:transition sm:hover:-translate-y-1 sm:hover:shadow-lg"><a href={getOfferPath(product)} className="block min-w-0"><div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white p-1 sm:h-48 sm:aspect-auto sm:rounded-2xl sm:p-0">{product.image ? <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain" /> : <span className="text-xs text-zinc-400 sm:text-base">Brak zdjęcia</span>}</div><h3 className="mt-2 line-clamp-3 min-h-[3.6rem] break-words text-[13px] font-bold leading-[1.2] sm:mt-4 sm:min-h-0 sm:text-base sm:leading-normal">{product.name}</h3></a><div className="mt-2 sm:mt-3"><p className="text-[11px] leading-tight text-zinc-400 line-through sm:text-sm">Allegro: {product.price} {product.currency}</p>{erli && <p className="text-[11px] leading-tight text-zinc-400 line-through sm:text-sm">ERLI: {erli.price} {erli.currency}</p>}<p className="mt-1 text-base font-black leading-tight text-green-700 sm:text-xl">{discountedPrice} {product.currency}</p><p className="text-[11px] font-bold text-green-700 sm:text-sm">Cena TrendEco</p></div><p className="mt-1.5 text-[11px] text-zinc-600 sm:mt-2 sm:text-sm">{product.stock > 0 ? `Dostępne: ${product.stock} szt.` : "Chwilowo niedostępne"}</p><div className="mt-auto grid gap-1.5 pt-3 sm:gap-2 sm:pt-4"><button type="button" disabled={product.stock <= 0} onClick={() => addToCart(product)} className="flex min-h-11 items-center justify-center rounded-xl bg-green-600 px-2 py-2 text-center text-[11px] font-black leading-tight text-white active:scale-[0.98] disabled:bg-zinc-400 sm:rounded-full sm:px-4 sm:py-3 sm:text-sm">Dodaj do koszyka — zakup za pobraniem</button>{erli && <a href={erli.url} target="_blank" rel="noopener noreferrer sponsored" className="flex min-h-10 items-center justify-center rounded-xl bg-[#00B8B0] px-2 py-2 text-center text-[11px] font-black text-white active:scale-[0.98] sm:rounded-full sm:px-4 sm:py-3 sm:text-sm">Kup na ERLI</a>}<a href={getOfferPath(product)} className="flex min-h-10 items-center justify-center rounded-xl bg-orange-500 px-2 py-2 text-center text-[11px] font-bold text-white active:scale-[0.98] sm:rounded-full sm:px-4 sm:py-3 sm:text-sm">Kup na Allegro</a></div></article>;
              })}</div></section>;
            })}
            {filteredProducts.length === 0 && <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-12 text-center sm:rounded-3xl sm:px-6 sm:py-16"><p className="text-lg font-black sm:text-xl">Nie znaleziono produktów</p><p className="mt-2 text-sm text-zinc-500 sm:text-base">Spróbuj wpisać inną nazwę lub fragment nazwy produktu.</p><button type="button" onClick={() => setQuery("")} className="mt-5 min-h-11 rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-white">Wyczyść wyszukiwanie</button></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
