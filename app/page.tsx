import { headers } from "next/headers";
import type { AllegroProduct } from "@/lib/allegro";
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

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-5xl font-black md:text-7xl">TrendEco</h1>
            <p className="mt-6 max-w-3xl text-xl text-zinc-300">
              Maszyny i narzędzia dostępne w sprzedaży przez Allegro, ERLI oraz bezpośrednio w TrendEco.
            </p>
            <p className="mt-4 max-w-3xl text-base text-zinc-400">
              Zamówienie za pobraniem ustalamy przez WhatsApp. Koszt dostawy potwierdzamy przed wysyłką.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold transition hover:bg-white/20">
              TikTok TrendEco
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-500">
              Zadzwoń / WhatsApp +48 512 077 770
            </a>
          </div>
        </div>

        <a href="/o-nas" className="mt-6 inline-block text-sm font-bold text-orange-400">
          O firmie i kontakt →
        </a>
      </section>

      {products.length > 0 ? (
        <ProductCatalog products={products} erliPrices={erliPrices} />
      ) : (
        <section className="bg-white px-6 py-20 text-center text-zinc-600">
          Nie udało się obecnie pobrać aktywnych ofert Allegro.
        </section>
      )}
    </main>
  );
}
