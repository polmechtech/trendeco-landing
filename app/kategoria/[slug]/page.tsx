import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOfferPath, type AllegroProduct } from "@/lib/allegro";
import { getSeoCategory, matchesSeoCategory, seoCategories } from "@/lib/seoCategories";

export const revalidate = 3600;

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const response = await fetch("https://www.trendeco.eu/api/allegro/offers", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return seoCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getSeoCategory(slug);
  if (!category) return { title: "Kategoria niedostępna", robots: { index: false, follow: true } };

  const path = `/kategoria/${category.slug}`;
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: path },
    keywords: [category.keyword, "TrendEco", "maszyny", "narzędzia", "Warszawa", "Polska"],
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: path,
      siteName: "TrendEco",
      title: category.title,
      description: category.description,
    },
    twitter: {
      card: "summary_large_image",
      title: category.title,
      description: category.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function SeoCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getSeoCategory(slug);
  if (!category) notFound();

  const products = (await getProducts()).filter((product) => matchesSeoCategory(product, category));
  const url = `https://www.trendeco.eu/kategoria/${category.slug}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.heading,
    description: category.description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.trendeco.eu${getOfferPath(product)}`,
        name: product.name,
      })),
    },
  };

  const categoryFaqs: Record<string, { question: string; answer: string }[]> = {
   "pila-formatowa": [
    { question: "Jak wybrać piłę formatową do płyt meblowych?", answer: "Najważniejsze są: obecność podcinaka, maksymalny format cięcia, stabilność stołu, możliwość regulacji prowadnic oraz dostępność części i serwisu. Do płyt laminowanych podcinak ogranicza wykruszanie dolnej warstwy dekoracyjnej." },
    { question: "Czy przenośna piła formatowa nadaje się do małej stolarni?", answer: "Tak, jeśli zakres pracy odpowiada jej wymiarom i głębokości cięcia. Konstrukcja składana lub mobilna zajmuje mniej miejsca i pozwala wykonywać cięcie formatowe bez inwestowania w dużą przemysłową formatówkę." },
    { question: "Czym różni się piła formatowa od zwykłej piły stołowej?", answer: "Piła formatowa jest przygotowana do dokładnego prowadzenia większych elementów i płyt. Zwykle ma stół przesuwny, prowadnice oraz podcinak, dzięki czemu łatwiej uzyskać prostą krawędź bez odprysków." },
    { question: "Czy podcinak jest potrzebny do MDF i płyt laminowanych?", answer: "Przy cięciu płyt laminowanych podcinak jest bardzo przydatny, ponieważ nacina dolną warstwę przed wejściem tarczy głównej. Przy surowym MDF jego znaczenie jest mniejsze, ale nadal pomaga utrzymać czystą krawędź." },
   ],
   "pila-pierscieniowa": [
    { question: "Do czego służy piła pierścieniowa?", answer: "Piła pierścieniowa służy do głębokiego cięcia betonu, żelbetu, kamienia, cegły i podobnych materiałów. Konstrukcja pierścienia pozwala uzyskać większą głębokość cięcia niż klasyczna tarcza o zbliżonej średnicy zewnętrznej." },
    { question: "Czy piła pierścieniowa wymaga chłodzenia wodą?", answer: "Tak. Woda chłodzi pierścień i prowadnicę, ogranicza pylenie oraz wypłukuje urobek ze strefy cięcia. Praca bez prawidłowego dopływu wody może szybko uszkodzić pierścień i prowadnicę." },
    { question: "Czy piła pierścieniowa nadaje się do żelbetu?", answer: "Tak, jeśli zastosowano odpowiedni pierścień diamentowy i zachowano prawidłowe chłodzenie. Podczas przechodzenia przez zbrojenie należy prowadzić maszynę równomiernie i nie wymuszać posuwu." },
    { question: "Jakie części eksploatacyjne zużywa piła pierścieniowa?", answer: "Zużyciu podlegają przede wszystkim pierścień diamentowy, prowadnica, rolki lub łożyska prowadzące oraz zębatka napędowa. Przed zakupem warto sprawdzić ich dostępność i możliwość serwisu w Polsce." },
   ],
   "luparka-przekladniowa": [
    { question: "Jak działa łuparka przekładniowa?", answer: "Silnik przekazuje napęd przez pasy i przekładnię redukcyjną na wał z klinem. Redukcja obrotów zwiększa moment obrotowy, dzięki czemu klin rozłupuje drewno przy spokojnym, kontrolowanym ruchu." },
    { question: "Wybrać łuparkę przekładniową 230 V czy 400 V?", answer: "Wersja 230 V jest wygodna tam, gdzie nie ma instalacji trójfazowej. Do częstej i długotrwałej pracy korzystniejsza jest zwykle wersja 400 V, ponieważ silnik trójfazowy lepiej znosi stałe obciążenie." },
    { question: "Jak układać polano w łuparce przekładniowej?", answer: "Polano należy stabilnie oprzeć i podawać zgodnie z instrukcją maszyny. W konstrukcjach TrendEco korzystne jest wejście klina około 2–3 cm od krawędzi polana, co ogranicza ryzyko zakleszczenia w mokrym i włóknistym drewnie." },
    { question: "Czy łuparka przekładniowa wymaga oleju?", answer: "Tak. Przekładnia musi być napełniona właściwym olejem przekładniowym w ilości podanej w instrukcji. Przed pierwszym uruchomieniem trzeba sprawdzić poziom oleju, osłony, napięcie pasów i działanie wyłącznika awaryjnego." },
   ],
  };
  const faq = categoryFaqs[category.slug] ?? [];
  const faqJsonLd = faq.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) } : null;

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <header className="bg-zinc-950 px-4 py-8 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <a href="/" className="text-sm font-bold text-orange-400">← TrendEco</a>
          <h1 className="mt-5 max-w-5xl text-3xl font-black leading-tight sm:text-5xl">{category.heading}</h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-zinc-300 sm:text-lg">{category.intro}</p>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Powiązane kategorie" className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {seoCategories.map((item) => (
              <a
                key={item.slug}
                href={`/kategoria/${item.slug}`}
                className={`min-w-max rounded-full border px-4 py-2 text-sm font-bold ${item.slug === category.slug ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
              >
                {item.keyword}
              </a>
            ))}
          </nav>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article key={product.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 sm:rounded-3xl sm:p-4">
                  <a href={getOfferPath(product)} className="block">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-zinc-400">Brak zdjęcia</span>
                      )}
                    </div>
                    <h2 className="mt-3 text-sm font-black leading-snug sm:text-base">{product.name}</h2>
                    <p className="mt-2 text-lg font-black text-orange-600 sm:text-xl">{product.price} {product.currency}</p>
                    <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{product.stock > 0 ? `Dostępne: ${product.stock} szt.` : "Sprawdź dostępność"}</p>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-zinc-600">
              Aktualne oferty z tej kategorii są w trakcie aktualizacji. Sprawdź pełny katalog TrendEco.
            </div>
          )}

          <section className="mt-12 max-w-4xl border-t border-zinc-200 pt-8">
            <h2 className="text-2xl font-black">{category.keyword} — oferta TrendEco</h2>
            <p className="mt-4 leading-7 text-zinc-700">{category.intro}</p>
            <p className="mt-4 leading-7 text-zinc-700">TrendEco prowadzi sprzedaż maszyn i narzędzi w Polsce. Aktualne produkty możesz sprawdzić bezpośrednio na stronie, przez Allegro i ERLI. Przy wybranych produktach dostępne jest również zamówienie bezpośrednie.</p>
          </section>

          {category.slug === "pila-formatowa" && products.length > 0 && <section className="mt-12 border-t border-zinc-200 pt-10">
            <h2 className="text-2xl font-black sm:text-3xl">Porównanie dostępnych pił formatowych TrendEco</h2>
            <p className="mt-4 max-w-4xl leading-7 text-zinc-700">Poniższe zestawienie jest tworzone automatycznie z aktualnych ofert. Kliknij nazwę modelu, aby sprawdzić opis, dane techniczne, producenta, informacje GPSR i możliwość zakupu.</p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
              <table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-zinc-950 text-white"><tr><th className="p-4">Model</th><th className="p-4">Cena</th><th className="p-4">Dostępność</th><th className="p-4">Szczegóły</th></tr></thead><tbody>{products.map((product)=><tr key={product.id} className="border-t border-zinc-200"><td className="p-4 font-bold">{product.name}</td><td className="p-4 whitespace-nowrap font-black text-orange-600">{product.price} {product.currency}</td><td className="p-4 whitespace-nowrap">{product.stock>0?`${product.stock} szt.`:"Brak"}</td><td className="p-4"><a className="font-bold underline" href={getOfferPath(product)}>Zobacz model</a></td></tr>)}</tbody></table>
            </div>
          </section>}

          {category.slug === "pila-formatowa" && <section className="mt-12 max-w-5xl border-t border-zinc-200 pt-10">
            <h2 className="text-2xl font-black sm:text-3xl">Jak dobrać piłę formatową do rodzaju pracy?</h2>
            <div className="mt-5 space-y-5 leading-7 text-zinc-700">
              <p>Do sporadycznego cięcia płyt i pracy montażowej najważniejsze są mobilność, szybkie składanie oraz możliwość zasilania z instalacji 230 V. W małym warsztacie liczy się również powierzchnia zajmowana po zakończeniu pracy. Przenośna piła formatowa może być rozsądnym rozwiązaniem, gdy duża maszyna przemysłowa byłaby wykorzystywana tylko częściowo.</p>
              <p>Przy obróbce płyt laminowanych warto wybierać model z osobnym podcinakiem. Podcinak wykonuje płytkie nacięcie od spodu materiału przed tarczą główną, ograniczając wyrywanie laminatu. Dla jakości cięcia znaczenie mają również prawidłowe ustawienie obu tarcz, odpowiedni dobór ich grubości oraz stabilne prowadzenie płyty.</p>
              <p>Stół przesuwny lub wahadłowy ułatwia pracę z większymi formatami, ale przed zakupem trzeba porównać realny zakres przesuwu z najczęściej obrabianymi elementami. Sama duża powierzchnia stołu nie zastępuje sztywnej konstrukcji, poprawnie ustawionej prowadnicy równoległej i możliwości dokładnej regulacji kąta.</p>
              <p>W ofercie TrendEco znajdują się kompletne zestawy oraz osobne stoły i zespoły tnące. Dzięki temu można dobrać konfigurację do miejsca pracy i planowanych operacji, zamiast kupować rozbudowany zestaw z elementami, które nie będą używane. Dostępność modeli, ceny i stany magazynowe w tabeli są aktualizowane automatycznie.</p>
            </div>
            <h2 className="mt-10 text-2xl font-black">Najczęstsze pytania</h2>
            <div className="mt-5 grid gap-4">{faq.map(item=><details key={item.question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"><summary className="cursor-pointer font-black">{item.question}</summary><p className="mt-3 leading-7 text-zinc-700">{item.answer}</p></details>)}</div>
          </section>}

          {category.slug !== "pila-formatowa" && faq.length > 0 && <section className="mt-12 max-w-5xl border-t border-zinc-200 pt-10">
            <h2 className="text-2xl font-black sm:text-3xl">Jak wybrać: {category.keyword}?</h2>
            {category.slug === "pila-pierscieniowa" && <div className="mt-5 space-y-5 leading-7 text-zinc-700"><p>Przy wyborze piły pierścieniowej należy porównać realną głębokość cięcia, moc roboczą, prędkość pierścienia, wymagany przepływ wody i masę urządzenia. Sama wysoka moc maksymalna nie zastępuje stabilnego napędu, prawidłowego chłodzenia i dostępności elementów prowadzących.</p><p>Do pracy w żelbecie ważny jest odpowiedni pierścień diamentowy oraz równomierny posuw. Warto również sprawdzić dostępność pierścieni, prowadnic, zębatek i łożysk, ponieważ są to części eksploatacyjne. TrendEco zapewnia części i obsługę serwisową dla pił z własnej dystrybucji.</p></div>}
            {category.slug === "luparka-przekladniowa" && <div className="mt-5 space-y-5 leading-7 text-zinc-700"><p>Łuparkę przekładniową dobiera się przede wszystkim do częstotliwości pracy, średnicy i rodzaju drewna oraz dostępnego zasilania. Wersja 230 V ułatwia użytkowanie w gospodarstwie domowym, natomiast silnik 400 V jest rozsądnym wyborem do częstszej pracy pod obciążeniem.</p><p>Przed zakupem warto porównać kompletną maszynę z modułem do samodzielnej zabudowy. Znaczenie mają osłony strefy roboczej, sterowanie oburęczne, rewers, wyłącznik awaryjny, stabilna rama oraz możliwość zakupu części do przekładni i układu napędowego.</p></div>}
            <h2 className="mt-10 text-2xl font-black">Najczęstsze pytania</h2>
            <div className="mt-5 grid gap-4">{faq.map(item=><details key={item.question} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"><summary className="cursor-pointer font-black">{item.question}</summary><p className="mt-3 leading-7 text-zinc-700">{item.answer}</p></details>)}</div>
          </section>}
        </div>
      </section>
    </main>
  );
}
