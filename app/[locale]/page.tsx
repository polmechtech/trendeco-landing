import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { AllegroProduct } from "@/lib/allegro";
import { isSiteLocale, localeLabels, supportedLocales, texts, type SiteLocale } from "@/lib/locales";
import LocalizedProductCatalog from "@/components/LocalizedProductCatalog";

export const dynamic = "force-dynamic";

const allegroLanguages: Partial<Record<SiteLocale, string>> = {
  cs: "cs-CZ",
  sk: "sk-SK",
  hu: "hu-HU",
};

async function getProducts(locale: SiteLocale): Promise<AllegroProduct[]> {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
    if (!host) return [];
    const language = allegroLanguages[locale];
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    const response = await fetch(`${protocol}://${host}/api/allegro/offers${query}`, { cache: "no-store" });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSiteLocale(locale)) return {};
  const t = texts[locale];
  return {
    title: `TrendEco — ${t.intro}`,
    description: t.subintro,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pl-PL": "/",
        "en": "/en",
        "cs-CZ": "/cs",
        "sk-SK": "/sk",
        "hu-HU": "/hu",
        "ro-RO": "/ro",
      },
    },
  };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isSiteLocale(rawLocale)) notFound();
  const locale: SiteLocale = rawLocale;
  const t = texts[locale];
  const products = await getProducts(locale);

  return <main className="min-h-screen bg-zinc-950 text-white">
    <section className="mx-auto max-w-7xl px-4 pb-7 pt-6 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">TrendEco</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:mt-6 sm:text-xl">{t.intro}</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:mt-4 sm:text-base">{t.subintro}</p>
        </div>
        <nav aria-label="Language" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <a href="/" className="rounded-full border border-white/20 px-3 py-2 text-center text-xs font-bold hover:bg-white/10">PL</a>
          {supportedLocales.map((item) => <a key={item} href={`/${item}`} title={localeLabels[item]} className={`rounded-full border px-3 py-2 text-center text-xs font-bold ${item === locale ? "border-orange-500 bg-orange-500 text-white" : "border-white/20 hover:bg-white/10"}`}>{item.toUpperCase()}</a>)}
        </nav>
      </div>
    </section>
    {products.length > 0 ? <LocalizedProductCatalog products={products} locale={locale} /> : <section className="bg-white px-4 py-16 text-center text-zinc-600 sm:px-6 sm:py-20">{t.noProducts}</section>}
    <footer className="border-t border-white/10 bg-zinc-950 px-4 py-8 text-sm text-zinc-400 sm:px-6">
      <div className="mx-auto max-w-7xl">TrendEco · Warszawa · +48 512 077 770 · mail@trendeco.eu</div>
    </footer>
  </main>;
}
