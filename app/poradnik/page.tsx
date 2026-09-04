import type { Metadata } from "next";
import Link from "next/link";
import { seoGuides } from "@/lib/seoGuides";

export const metadata: Metadata = { title: "Poradnik wyboru maszyn i narzędzi", description: "Praktyczne poradniki TrendEco o piłach, łuparkach, okleiniarkach i narzędziach do drewna.", alternates: { canonical: "/poradnik" } };

export default function GuidesPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "CollectionPage", name: "Poradnik TrendEco", url: "https://www.trendeco.eu/poradnik", mainEntity: { "@type": "ItemList", itemListElement: seoGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.heading, url: `https://www.trendeco.eu/poradnik/${guide.slug}` })) } };
  return <main className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-950 sm:px-6"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><div className="mx-auto max-w-5xl"><Link href="/" className="font-bold text-orange-600">← Katalog TrendEco</Link><h1 className="mt-6 text-4xl font-black sm:text-6xl">Poradnik wyboru maszyn i narzędzi</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-700">Konkretne kryteria doboru, eksploatacji i bezpieczeństwa oraz bezpośrednie przejścia do aktualnych produktów.</p><div className="mt-10 grid gap-5 md:grid-cols-2">{seoGuides.map((guide) => <article key={guide.slug} className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">{guide.heading}</h2><p className="mt-3 leading-7 text-zinc-600">{guide.description}</p><Link href={`/poradnik/${guide.slug}`} className="mt-5 inline-flex font-black text-orange-600">Czytaj poradnik →</Link></article>)}</div></div></main>;
}
