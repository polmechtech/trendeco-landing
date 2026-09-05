import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AllegroProduct } from "@/lib/allegro";
import { countryToLocale } from "@/lib/locales";
import ProductCatalog from "@/components/ProductCatalog";
import FreeShippingBadge from "@/components/FreeShippingBadge";

type ErliInfo = { price: string; currency: string; url: string };
type ErliMap = Record<string, ErliInfo>;

async function getProducts(): Promise<AllegroProduct[]> { try { const requestHeaders = await headers(); const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"); const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"; if (!host) return []; const res = await fetch(`${protocol}://${host}/api/allegro/offers`, { cache: "no-store" }); if (!res.ok) return []; const data = await res.json(); return Array.isArray(data) ? data : []; } catch { return []; } }
async function getErliPrices(products: AllegroProduct[]): Promise<ErliMap> { if (products.length === 0) return {}; try { const requestHeaders = await headers(); const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"); const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"; if (!host) return {}; const ids = products.map((product) => product.id).join(","); const res = await fetch(`${protocol}://${host}/api/erli/prices?ids=${encodeURIComponent(ids)}`, { cache: "no-store" }); if (!res.ok) return {}; return await res.json(); } catch { return {}; } }
const whatsappLink = "https://wa.me/48512077770?text=Dzień%20dobry%2C%20mam%20pytanie%20o%20ofertę%20TrendEco.";
const tiktokLink = "https://www.tiktok.com/@trendeco4";
const languageLinks = [
  { href: "/", flag: "🇵🇱", label: "PL", title: "Polski" },
  { href: "/cs", flag: "🇨🇿", label: "CZ", title: "Čeština" },
  { href: "/sk", flag: "🇸🇰", label: "SK", title: "Slovenčina" },
  { href: "/hu", flag: "🇭🇺", label: "HU", title: "Magyar" },
];

export default async function Home() {
  const requestHeaders = await headers();
  const country = (requestHeaders.get("x-vercel-ip-country") ?? "PL").toUpperCase();
  const locale = countryToLocale[country];
  if (locale) redirect(`/${locale}`);

  const products = await getProducts(); const erliPrices = await getErliPrices(products);
  const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: "TrendEco", url: "https://www.trendeco.eu", inLanguage: "pl-PL" };
  return <main className="min-h-screen bg-zinc-950 text-white"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    <section className="mx-auto max-w-7xl px-4 pb-7 pt-6 sm:px-6 sm:py-10"><div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-4"><h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">TrendEco</h1><FreeShippingBadge dark /></div><p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:mt-6 sm:text-xl">Maszyny i narzędzia dostępne w sprzedaży przez Allegro, ERLI oraz bezpośrednio w TrendEco.</p><p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:mt-4 sm:text-base">Piły formatowe i stołowe, piły do betonu, przecinarki, maszyny stolarskie, łuparki i akcesoria.</p></div><div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3"><nav aria-label="Wybierz język" className="flex flex-wrap items-center gap-2">{languageLinks.map((language) => <a key={language.label} href={language.href} title={language.title} aria-label={language.title} className="inline-flex min-h-12 items-center gap-1 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-black transition hover:border-orange-400 hover:bg-orange-500/20 sm:rounded-full"><span className="text-xl leading-none" aria-hidden="true">{language.flag}</span><span>{language.label}</span></a>)}</nav><div className="flex items-center gap-2 sm:ml-auto sm:gap-3"><a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3 py-3 text-center text-sm font-bold transition hover:bg-white/20 sm:rounded-full sm:px-5">TikTok</a><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-2xl bg-green-600 px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-green-500 sm:rounded-full sm:px-5">WhatsApp<span className="hidden sm:inline"> +48 512 077 770</span></a></div></div></div>
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm sm:mt-5"><span className="font-bold text-zinc-400">Nasze marki:</span><a href="https://trendeco.eu" className="rounded-full border border-white/20 bg-white/10 px-3 py-2 font-black text-white transition hover:border-orange-400 hover:text-orange-300">TrendEco</a><a href="https://polmech.tech" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 bg-white/10 px-3 py-2 font-black text-white transition hover:border-orange-400 hover:text-orange-300">POLMECH.TECH</a><a href="https://widia.tech" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 bg-white/10 px-3 py-2 font-black text-white transition hover:border-orange-400 hover:text-orange-300">WIDIA.TECH</a></div>
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold sm:mt-4"><a href="/o-nas" className="inline-flex min-h-11 items-center text-orange-400">O firmie i kontakt →</a><a href="/poradnik" className="inline-flex min-h-11 items-center text-orange-400">Poradnik wyboru maszyn →</a></div></section>
    {products.length > 0 ? <ProductCatalog products={products} erliPrices={erliPrices} /> : <section className="bg-white px-4 py-16 text-center text-zinc-600 sm:px-6 sm:py-20">Nie udało się obecnie pobrać aktywnych ofert Allegro.</section>}
    <footer className="border-t border-white/10 bg-zinc-950 px-4 py-8 text-sm text-zinc-400 sm:px-6"><div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-3"><a href="/o-nas" className="hover:text-white">O firmie i kontakt</a><a href="/poradnik" className="hover:text-white">Poradnik</a><a href="/dostawa" className="hover:text-white">Dostawa</a><a href="/zwroty-i-reklamacje" className="hover:text-white">Zwroty, reklamacja, gwarancja</a><a href="/regulamin" className="hover:text-white">Regulamin sklepu</a><a href="/polityka-prywatnosci" className="hover:text-white">Polityka prywatności i RODO</a></div></footer>
  </main>;
}
