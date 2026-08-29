import { headers } from "next/headers";
import type { AllegroProduct } from "@/lib/allegro";
import { seoCategories } from "@/lib/seoCategories";
import ProductCatalog from "@/components/ProductCatalog";

type ErliInfo = { price: string; currency: string; url: string };
type ErliMap = Record<string, ErliInfo>;

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    if (!host) return [];
    const res = await fetch(`${protocol}://${host}/api/allegro/offers`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getErliPrices(products: AllegroProduct[]): Promise<ErliMap> {
  if (products.length === 0) return {};
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    if (!host) return {};
    const ids = products.map((product) => product.id).join(",");
    const res = await fetch(`${protocol}://${host}/api/erli/prices?ids=${encodeURIComponent(ids)}`, { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

const whatsappLink = "https://wa.me/48512077770?text=Dzień%20dobry%2C%20mam%20pytanie%20o%20ofertę%20TrendEco.";
const tiktokLink = "https://www.tiktok.com/@trendeco4";

export default async function Home() {
  const products = await getProducts();
  const erliPrices = await getErliPrices(products);
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TrendEco",
    url: "https://trendeco.eu",
    inLanguage: "pl-PL",
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <section className="mx-auto max-w-7xl px-4 pb-7 pt-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">TrendEco</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:mt-6 sm:text-xl">
              Maszyny i narzędzia dostępne w sprzedaży przez Allegro, ERLI oraz bezpośrednio w TrendEco.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:mt-4 sm:text-base">
              Piły formatowe i stołowe, piły do betonu, przecinarki, maszyny stolarskie, łuparki i akcesoria.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3">
            <a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-center text-sm font-bold transition hover:bg-white/20 sm:rounded-full sm:px-5">TikTok</a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-2xl bg-green-600 px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-green-500 sm:rounded-full sm:px-5">WhatsApp<span className="hidden sm:inline"> +48 512 077 770</span></a>
          </div>
        </div>

        <nav aria-label="Najczęściej szukane produkty" className="mt-5 grid grid-cols-3 gap-2 sm:mt-7">
          {seoCategories.map((category) => (
            <a key={category.slug} href={`/kategoria/${category.slug}`} className="flex min-h-12 items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-500/10 px-2 py-2 text-center text-xs font-black leading-tight text-orange-300 transition hover:bg-orange-500 hover:text-white sm:px-4 sm:text-sm">{category.keyword}</a>
          ))}
        </nav>

        <a href="/o-nas" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-orange-400 sm:mt-4">O firmie i kontakt →</a>
      </section>

      {products.length > 0 ? <ProductCatalog products={products} erliPrices={erliPrices} /> : <section className="bg-white px-4 py-16 text-center text-zinc-600 sm:px-6 sm:py-20">Nie udało się obecnie pobrać aktywnych ofert Allegro.</section>}

      <footer className="border-t border-white/10 bg-zinc-950 px-4 py-8 text-sm text-zinc-400 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-3">
          <a href="/o-nas" className="hover:text-white">O firmie i kontakt</a>
          <a href="/dostawa" className="hover:text-white">Dostawa</a>
          <a href="/zwroty-i-reklamacje" className="hover:text-white">Zwroty i reklamacje</a>
          <a href="/google-merchant.xml" className="hover:text-white">Katalog produktów XML</a>
        </div>
      </footer>
    </main>
  );
}
