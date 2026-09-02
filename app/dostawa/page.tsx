import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dostawa",
  description: "Darmowa dostawa wszystkich zamówień składanych bezpośrednio w TrendEco na terenie Polski.",
  alternates: { canonical: "/dostawa" },
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <a href="/" className="text-sm font-semibold text-zinc-500">← Katalog</a>
        <h1 className="mt-6 text-4xl font-black">Darmowa dostawa w Polsce</h1>
        <p className="mt-5 leading-7 text-zinc-700">Wszystkie towary zamówione bezpośrednio na trendeco.eu wysyłamy z Polski bez dodatkowych kosztów dostawy na terenie Polski — również przesyłki gabarytowe i paletowe.</p>
        <h2 className="mt-8 text-2xl font-black">Koszt dostawy</h2>
        <p className="mt-3 leading-7 text-zinc-700"><strong>Zamówienie bezpośrednie na trendeco.eu: 0 PLN.</strong> Przy zakupie przez Allegro lub ERLI obowiązują metody i koszty dostawy prezentowane przez daną platformę przed złożeniem zamówienia.</p>
        <h2 className="mt-8 text-2xl font-black">Termin</h2>
        <p className="mt-3 leading-7 text-zinc-700">Termin zależy od rodzaju produktu i przewoźnika. Dostępność widoczna na stronie jest synchronizowana z bieżącym katalogiem. W przypadku dużych maszyn i przesyłek paletowych termin uzgadniamy indywidualnie.</p>
        <h2 className="mt-8 text-2xl font-black">Kontakt w sprawie dostawy</h2>
        <p className="mt-3 leading-7 text-zinc-700">tel. +48 512 077 770 · e-mail: mail@trendeco.eu</p>
        <nav className="mt-10 flex flex-wrap gap-4 border-t pt-6 text-sm font-bold">
          <a href="/zwroty-i-reklamacje" className="text-orange-600">Zwroty, reklamacja, gwarancja →</a>
          <a href="/o-nas" className="text-zinc-600">O firmie</a>
        </nav>
      </article>
    </main>
  );
}
