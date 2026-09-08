import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas",
  description: "TrendEco — polska marka handlowa Ekogratis sp. z o.o. Powiązane marki: POLMECH.TECH i WIDIA.TECH. Zakup produktów bezpośrednio na oficjalnych stronach marek.",
  alternates: { canonical: "/o-nas" },
};

export default function AboutPage() {
  const brandNetworkJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ekogratis sp. z o.o.",
    url: "https://trendeco.eu",
    address: { "@type": "PostalAddress", streetAddress: "Jagielska 25/27", postalCode: "02-886", addressLocality: "Warszawa", addressCountry: "PL" },
    brand: [
      { "@type": "Brand", name: "TrendEco", url: "https://trendeco.eu" },
      { "@type": "Brand", name: "POLMECH.TECH", url: "https://polmech.tech" },
      { "@type": "Brand", name: "WIDIA.TECH", url: "https://widia.tech" },
    ],
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandNetworkJsonLd) }} />
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm md:p-12">
        <a href="/" className="text-sm font-semibold text-zinc-500">← Katalog</a>
        <h1 className="mt-8 text-4xl font-black">O TrendEco</h1>
        <p className="mt-6 text-lg leading-8 text-zinc-700"><a href="https://trendeco.eu" className="font-bold text-orange-600 underline decoration-orange-300 underline-offset-4">TrendEco</a> jest polską marką handlową prowadzoną przez Ekogratis sp. z o.o. z siedzibą w Warszawie. TrendEco, <a href="https://polmech.tech" className="font-bold text-orange-600 underline decoration-orange-300 underline-offset-4">POLMECH.TECH</a> i <a href="https://widia.tech" className="font-bold text-orange-600 underline decoration-orange-300 underline-offset-4">WIDIA.TECH</a> są powiązanymi markami tej samej polskiej firmy.</p>
        <p className="mt-4 text-lg leading-8 text-zinc-700">TrendEco koncentruje się na maszynach i narzędziach, POLMECH.TECH na łuparkach przekładniowych i powiązanych układach mechanicznych, a WIDIA.TECH na frezach, nożach, narzędziach skrawających i wyposażeniu do obróbki drewna.</p>
        <p className="mt-4 text-lg leading-8 text-zinc-700">Ceny i dostępność są aktualizowane na stronach produktów. Produkty można kupować bezpośrednio na oficjalnych stronach odpowiednich marek: trendeco.eu, polmech.tech i widia.tech, zgodnie z opcjami zakupu widocznymi na danej karcie produktu.</p>
        <h2 className="mt-10 text-2xl font-black">Kontakt</h2>
        <p className="mt-4 text-zinc-700">Ekogratis sp. z o.o.<br />Jagielska 25/27, 02-886 Warszawa<br />tel. +48 512 077 770<br />e-mail: mail@trendeco.eu</p>
      </article>
    </main>
  );
}
