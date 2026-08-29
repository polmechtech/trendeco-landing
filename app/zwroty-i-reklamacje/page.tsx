import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zwroty i reklamacje",
  description: "Informacje TrendEco dotyczące odstąpienia od umowy, zwrotów i reklamacji.",
  alternates: { canonical: "/zwroty-i-reklamacje" },
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <a href="/" className="text-sm font-semibold text-zinc-500">← Katalog</a>
        <h1 className="mt-6 text-4xl font-black">Zwroty i reklamacje</h1>
        <h2 className="mt-8 text-2xl font-black">Odstąpienie od umowy</h2>
        <p className="mt-3 leading-7 text-zinc-700">Konsument dokonujący zakupu na odległość może skorzystać z ustawowego prawa odstąpienia od umowy w terminie 14 dni, z zastrzeżeniem wyjątków przewidzianych przez obowiązujące przepisy. Szczegółowe warunki transakcji dokonanych przez Allegro lub ERLI są również dostępne w ramach danego zamówienia na tej platformie.</p>
        <h2 className="mt-8 text-2xl font-black">Jak zgłosić zwrot</h2>
        <p className="mt-3 leading-7 text-zinc-700">Skontaktuj się z nami i podaj dane pozwalające zidentyfikować zamówienie oraz produkt. Dla zamówień złożonych przez marketplace można również skorzystać z procedury zwrotu dostępnej bezpośrednio w panelu zamówienia.</p>
        <h2 className="mt-8 text-2xl font-black">Reklamacje</h2>
        <p className="mt-3 leading-7 text-zinc-700">W przypadku problemu z produktem prosimy o kontakt z opisem usterki i danymi zakupu. Przekażemy dalsze informacje dotyczące diagnostyki, serwisu, naprawy lub innego sposobu rozpatrzenia reklamacji zgodnie z obowiązującymi przepisami.</p>
        <h2 className="mt-8 text-2xl font-black">Dane sprzedawcy</h2>
        <p className="mt-3 leading-7 text-zinc-700">Ekogratis sp. z o.o.<br />Jagielska 25/27, 02-886 Warszawa<br />tel. +48 512 077 770<br />e-mail: info@widia.tech</p>
        <nav className="mt-10 flex flex-wrap gap-4 border-t pt-6 text-sm font-bold">
          <a href="/dostawa" className="text-orange-600">Dostawa →</a>
          <a href="/o-nas" className="text-zinc-600">O firmie</a>
        </nav>
      </article>
    </main>
  );
}
