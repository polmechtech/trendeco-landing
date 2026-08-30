import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas",
  description: "TrendEco — polski sprzedawca i importer maszyn oraz narzędzi dla meblarstwa, budownictwa i obróbki drewna.",
  alternates: { canonical: "/o-nas" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-950">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm md:p-12">
        <a href="/" className="text-sm font-semibold text-zinc-500">← Katalog</a>
        <h1 className="mt-8 text-4xl font-black">O TrendEco</h1>
        <p className="mt-6 text-lg leading-8 text-zinc-700">TrendEco jest polskim sprzedawcą i importerem maszyn oraz narzędzi dla meblarstwa, budownictwa i obróbki drewna. Katalog na trendeco.eu pokazuje aktywne oferty naszego konta Allegro.</p>
        <p className="mt-4 text-lg leading-8 text-zinc-700">Ceny i dostępność są aktualizowane automatycznie co godzinę. Produkty można zamówić bezpośrednio w TrendEco lub kupić za pośrednictwem dostępnych platform sprzedażowych.</p>
        <h2 className="mt-10 text-2xl font-black">Kontakt</h2>
        <p className="mt-4 text-zinc-700">Ekogratis sp. z o.o.<br />Jagielska 25/27, 02-886 Warszawa<br />tel. +48 512 077 770<br />e-mail: mail@trendeco.eu</p>
      </article>
    </main>
  );
}
