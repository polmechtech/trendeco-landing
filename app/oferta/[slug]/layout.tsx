import type { ReactNode } from "react";
import { extractOfferId, type AllegroProduct } from "@/lib/allegro";

const TEST_OFFER_IDS = new Set([
  "18775327435", // piła pierścieniowa Profi Bud
  "18550934081", // piła stołowa Profi S z podcinakiem
  "18550932673", // przenośna okleiniarka TrendEco
]);

type EngineeringCopy = {
  lead: string;
  construction: string[];
  application: string[];
  limitations: string[];
};

async function getProduct(offerId: string): Promise<AllegroProduct | null> {
  try {
    const response = await fetch("https://trendeco.eu/api/allegro/offers", { cache: "no-store" });
    if (!response.ok) return null;
    const products = (await response.json()) as AllegroProduct[];
    return products.find((product) => product.id === offerId) ?? null;
  } catch {
    return null;
  }
}

function normalize(value: string) {
  return value.toLocaleLowerCase("pl-PL");
}

function buildEngineeringCopy(product: AllegroProduct): EngineeringCopy | null {
  const corpus = normalize(`${product.name}\n${product.description ?? ""}`);

  if (corpus.includes("piła pierścieniowa")) {
    return {
      lead:
        "Piła pierścieniowa jest rozwiązaniem do sytuacji, w których klasyczna tarcza ma zbyt małą efektywną głębokość cięcia. W konstrukcji pierścieniowej część robocza nie jest ograniczona typową piastą tarczy, dlatego narzędzie może wejść w materiał znacznie głębiej przy zachowaniu ręcznej, przenośnej formy urządzenia.",
      construction: [
        "Napęd przekazuje moment na pierścień tnący przez układ prowadzenia, dlatego prawidłowe prowadzenie, chłodzenie i smarowanie strefy cięcia mają bezpośredni wpływ na stabilność pracy oraz zużycie elementów współpracujących.",
        "Moc podana w ofercie należy oceniać razem z charakterem pracy narzędzia: w betonie i żelbecie istotne jest nie tylko szybkie rozpędzenie części tnącej, lecz także utrzymanie obciążenia podczas głębokiego, mokrego cięcia.",
        "Jeżeli oferta obejmuje prowadnicę, jej zadaniem jest ograniczenie bocznego odchylenia narzędzia i utrzymanie geometrii cięcia. Ma to szczególne znaczenie przy długich cięciach ściennych, gdzie ręczne korygowanie toru powoduje większe zużycie prowadzenia i nierówną szczelinę.",
      ],
      application: [
        "głębokie cięcie betonu, żelbetu i innych materiałów mineralnych wskazanych w ofercie",
        "otwory i cięcia instalacyjne, w których ważna jest duża głębokość bez stosowania dużej przecinarki jezdnej",
        "prace, w których prowadnica może poprawić prostoliniowość i powtarzalność cięcia",
      ],
      limitations: [
        "To nie jest narzędzie do pracy na sucho, jeżeli oferta przewiduje chłodzenie wodne — brak chłodzenia zwiększa temperaturę części tnącej i prowadzenia.",
        "Prędkość posuwu należy dopasować do zbrojenia i przekroju materiału; wymuszanie posuwu nie zwiększa proporcjonalnie wydajności, a zwiększa obciążenie układu prowadzenia.",
      ],
    };
  }

  if ((corpus.includes("piła stołowa") || corpus.includes("formatowa")) && corpus.includes("podcin")) {
    return {
      lead:
        "Najważniejszą cechą tej pilarki nie jest sama obecność drugiego zespołu tnącego, lecz funkcja podcinania. Podcinak wykonuje płytkie nacięcie spodniej warstwy płyty przed wejściem tarczy głównej, dzięki czemu ogranicza wyrywanie laminatu na krawędzi wyjściowej. To rozwiązanie jest szczególnie istotne przy płytach meblowych, gdzie jakość krawędzi ma znaczenie przed oklejaniem.",
      construction: [
        "Oddzielenie funkcji podcinania od cięcia głównego pozwala ustawić oba procesy pod konkretne zadanie: podcinak przygotowuje warstwę dekoracyjną, a tarcza główna wykonuje właściwy przekrój płyty.",
        corpus.includes("bezszczotk")
          ? "Zastosowanie napędu bezszczotkowego eliminuje szczotki węglowe jako element eksploatacyjny silnika. W praktyce oznacza mniej okresowej obsługi samego układu komutacji oraz brak zużycia szczotek charakterystycznego dla klasycznych silników szczotkowych."
          : "Przy wyborze pilarki warto oceniać stabilność zespołu tnącego, sposób regulacji i prowadzenie materiału, a nie wyłącznie deklarowaną moc silnika.",
        "Wbudowany lub współpracujący stół i przykładnice przejmują funkcję pozycjonowania płyty. Im większy format obrabianego elementu, tym większe znaczenie ma sztywność podparcia i powtarzalne ustawienie względem linii cięcia.",
      ],
      application: [
        "formatowanie laminowanych płyt meblowych MDF, HDF i płyt wiórowych zgodnie z zakresem oferty",
        "małe zakłady meblarskie i prace montażowe, gdzie potrzebna jest czystsza krawędź niż po zwykłej pilarce stołowej",
        "seryjne docinanie elementów, kiedy ważna jest powtarzalność wymiaru i ograniczenie późniejszej obróbki krawędzi",
      ],
      limitations: [
        "Podcinak nie kompensuje źle ustawionej przykładnicy, zużytej tarczy ani luzów zespołu prowadzącego; jakość cięcia zależy od całego układu.",
        "Przed obróbką dużych płyt trzeba zapewnić stabilne podparcie materiału na całej drodze posuwu.",
      ],
    };
  }

  if (corpus.includes("okleiniarka") || corpus.includes("oklejarka")) {
    return {
      lead:
        "Przenośna okleiniarka ma sens tam, gdzie pełnowymiarowa automatyczna linia jest nieuzasadniona gabarytowo lub ekonomicznie. Jej zadaniem jest kontrolowane podawanie obrzeża i kleju przy prowadzeniu urządzenia albo elementu wzdłuż krawędzi płyty, zależnie od konfiguracji wskazanej w ofercie.",
      construction: [
        "Układ grzania odpowiada za utrzymanie kleju w zakresie roboczym, a mechanizm podawania stabilizuje prędkość przesuwu obrzeża. Zbyt niska temperatura pogarsza zwilżanie powierzchni klejem, natomiast zbyt wysoka może niepotrzebnie zwiększać jego płynność i czasowo obciążać układ grzejny.",
        "Możliwość pracy na krawędziach prostych i krzywoliniowych zwiększa zakres zastosowania urządzenia, ponieważ operator nie jest ograniczony wyłącznie do prostych boków płyt.",
        "W pracy seryjnej równie ważna jak moc grzania jest powtarzalność docisku obrzeża do płyty — to ona decyduje o równomiernym kontakcie na całej długości krawędzi.",
      ],
      application: [
        "oklejanie krótkich serii i elementów wykonywanych na wymiar",
        "prace montażowe oraz warsztaty, które nie potrzebują stacjonarnej automatycznej okleiniarki",
        "elementy proste i krzywoliniowe, jeżeli taki tryb pracy jest przewidziany w konkretnej ofercie",
      ],
      limitations: [
        "Rzeczywista jakość spoiny zależy od przygotowania krawędzi płyty, temperatury kleju, prędkości prowadzenia i docisku — samo zwiększenie temperatury nie naprawia źle przygotowanej powierzchni.",
        "Przed rozpoczęciem serii warto wykonać próbę na odpadzie z tego samego materiału i obrzeża, aby dobrać ustawienia bez ryzyka uszkodzenia właściwego elementu.",
      ],
    };
  }

  return null;
}

function EngineeringDescription({ product }: { product: AllegroProduct }) {
  const copy = buildEngineeringCopy(product);
  if (!copy) return null;

  return (
    <section className="mx-auto mt-8 max-w-5xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Analiza konstrukcji TrendEco</p>
        <h2 className="mt-2 text-2xl font-black">Dlaczego ta konstrukcja ma znaczenie w praktyce?</h2>
        <p className="mt-5 leading-7 text-zinc-700">{copy.lead}</p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-black">Konstrukcja i efekt techniczny</h3>
          <div className="mt-4 space-y-4 text-zinc-700">
            {copy.construction.map((paragraph) => (
              <p key={paragraph} className="leading-7">{paragraph}</p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-black">Gdzie ten produkt ma sens</h3>
          <ul className="mt-4 space-y-3 text-zinc-700">
            {copy.application.map((item) => (
              <li key={item} className="flex gap-3"><span aria-hidden="true">✓</span><span>{item}</span></li>
            ))}
          </ul>
          <h3 className="mt-7 text-lg font-black">Ograniczenia i warunki poprawnej pracy</h3>
          <ul className="mt-4 space-y-3 text-zinc-700">
            {copy.limitations.map((item) => (
              <li key={item} className="flex gap-3"><span aria-hidden="true">•</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-8 border-t border-zinc-200 pt-5 text-sm leading-6 text-zinc-500">
        Powyższy komentarz techniczny rozwija informacje z aktualnej oferty i nie zastępuje parametrów, instrukcji obsługi ani informacji bezpieczeństwa producenta.
      </p>
    </section>
  );
}

export default async function OfferLayout({ children, params }: { children: ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offerId = extractOfferId(slug);
  if (!offerId || !TEST_OFFER_IDS.has(offerId)) return children;

  const product = await getProduct(offerId);
  if (!product) return children;

  return (
    <>
      {children}
      <div className="bg-zinc-100 px-6 pb-12 text-zinc-950">
        <EngineeringDescription product={product} />
      </div>
    </>
  );
}
