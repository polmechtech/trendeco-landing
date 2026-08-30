import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dostawa",
  description: "Informacje o dostawie zamówień TrendEco na terenie Polski.",
  alternates: { canonical: "/dostawa" },
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <a href="/" className="text-sm font-semibold text-zinc-500">← Katalog</a>
        <h1 className="mt-6 text-4xl font-black">Dostawa</h1>
        <p className="mt-5 leading-7 text-zinc-700">Towary TrendEco wysyłamy z Polski. Dostępne metody i koszt dostawy zależą od gabarytu, masy produktu oraz miejsca dostawy.</p>
        <h2 className="mt-8 text-2xl font-black">Koszt dostawy</h2>
        <p className="mt-3 leading-7 text-zinc-700">W przypadku zakupu przez Allegro lub ERLI koszt i dostępne metody dostawy są prezentowane na platformie przed złożeniem zamówienia. Przy zamówieniu bezpośrednim koszt dostawy potwierdzamy przed przyjęciem zamówienia do realizacji — klient zna pełny koszt przed zawarciem transakcji.</p>
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
