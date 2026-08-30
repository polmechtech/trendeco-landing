import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zwroty, reklamacje i gwarancja",
  description: "Informacje TrendEco dotyczące zwrotów, reklamacji oraz 2-letniej gwarancji.",
  alternates: { canonical: "/zwroty-i-reklamacje" },
};

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 sm:py-12">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-sm sm:p-10">
        <a href="/" className="text-sm font-semibold text-zinc-500">← Katalog</a>
        <h1 className="mt-6 text-4xl font-black">Zwroty, reklamacje, gwarancja</h1>

        <h2 className="mt-8 text-2xl font-black">Zwroty — 30 dni</h2>
        <p className="mt-3 leading-7 text-zinc-700">TrendEco umożliwia zwrot towaru w terminie 30 dni od dnia jego otrzymania. Uprawnienie to nie ogranicza praw przysługujących konsumentowi na podstawie obowiązujących przepisów. W przypadku zakupów dokonanych przez Allegro lub ERLI zwrot można również zgłosić za pośrednictwem panelu danego zamówienia.</p>

        <h2 className="mt-8 text-2xl font-black">Jak zgłosić zwrot</h2>
        <p className="mt-3 leading-7 text-zinc-700">Skontaktuj się z nami i podaj dane pozwalające zidentyfikować zamówienie oraz produkt. Przekażemy informacje potrzebne do prawidłowego odesłania towaru.</p>

        <h2 className="mt-8 text-2xl font-black">Reklamacja</h2>
        <p className="mt-3 leading-7 text-zinc-700">W przypadku problemu z produktem prosimy o kontakt z opisem usterki oraz danymi pozwalającymi zidentyfikować zakup. Przekażemy dalsze informacje dotyczące diagnostyki, serwisu, naprawy lub innego sposobu rozpatrzenia reklamacji zgodnie z obowiązującymi przepisami.</p>

        <h2 className="mt-8 text-2xl font-black">Gwarancja — 2 lata</h2>
        <p className="mt-3 leading-7 text-zinc-700">Na produkty TrendEco udzielamy 2-letniej gwarancji. Okres gwarancji jest taki sam niezależnie od tego, czy produkt został zakupiony przez konsumenta do użytku prywatnego, czy przez przedsiębiorcę do celów związanych z działalnością gospodarczą.</p>
        <p className="mt-3 leading-7 text-zinc-700">Gwarancja nie ogranicza ani nie wyłącza uprawnień kupującego wynikających z bezwzględnie obowiązujących przepisów prawa.</p>

        <h2 className="mt-8 text-2xl font-black">Kontakt — zwroty, reklamacje i gwarancja</h2>
        <p className="mt-3 leading-7 text-zinc-700">Ekogratis sp. z o.o.<br />Jagielska 25/27, 02-886 Warszawa<br />tel. +48 512 077 770<br />e-mail: mail@trendeco.eu</p>
        <nav className="mt-10 flex flex-wrap gap-4 border-t pt-6 text-sm font-bold">
          <a href="/dostawa" className="text-orange-600">Dostawa →</a>
          <a href="/o-nas" className="text-zinc-600">O firmie</a>
        </nav>
      </article>
    </main>
  );
}
