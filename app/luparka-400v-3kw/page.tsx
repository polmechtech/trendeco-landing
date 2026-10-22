import type { Metadata } from "next";
export const metadata: Metadata = {
 title: "Łuparka do drewna 400V 3kW POLMECH.TECH – 3789 zł z dostawą",
 description: "Łuparka przekładniowa POLMECH.TECH 400V 3kW z dwoma klinami. 3789 zł brutto z dostawą w Polsce. Silnik PROMOTOR, serwis w Polsce.",
 alternates: { canonical: "https://trendeco.eu/luparka-400v-3kw" },
};
const product = "/oferta/luparka-do-drewna-przekladniowa-sila-400v-3kw-2-kliny-12t-trudne-drewno-18690919967";
export default function SplitterCampaign() {
 return <main className="min-h-screen bg-white text-zinc-900">
 <div className="mx-auto max-w-4xl px-5 py-12">
 <a href="/" className="text-sm text-green-800 underline">← TrendEco</a>
 <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-green-800">POLMECH.TECH • Łuparka przekładniowa</p>
 <h1 className="mt-3 text-4xl font-black leading-tight">Łuparka do drewna 400V 3kW – do sęków i rozwidleń</h1>
 <p className="mt-5 text-lg">Mechaniczna łuparka z dwoma przeciwległymi klinami, napędem przekładniowym i trójfazowym silnikiem PROMOTOR 3 kW. Do przygotowania drewna opałowego, również nieregularnego i sękatego.</p>
 <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
 <p className="text-sm font-bold text-green-900">Cena bezpośrednia TrendEco</p>
 <p className="mt-2 text-4xl font-black">3 789 zł brutto</p>
 <p className="mt-2">Dostawa na terenie Polski w cenie • płatność przy odbiorze</p>
 <a href={product} className="mt-5 inline-block rounded-xl bg-green-700 px-7 py-4 font-bold text-white hover:bg-green-800">Zobacz ofertę i zamów →</a>
 </div>
 <h2 className="mt-12 text-2xl font-bold">Dlaczego ta konstrukcja?</h2>
 <ul className="mt-4 list-disc space-y-3 pl-6">
 <li>Napęd przekładniowy zamiast klasycznego układu hydraulicznego</li>
 <li>Dwa przeciwległe kliny do seryjnego rozłupywania drewna</li>
 <li>Silnik PROMOTOR 400 V / 3 kW</li>
 <li>Specjalne kleszcze do podawania drewna w zestawie</li>
 <li>Serwis i części zamienne w Polsce</li>
 </ul>
 <h2 className="mt-12 text-2xl font-bold">Przed zakupem</h2>
 <p className="mt-3">Maszyna wymaga zasilania trójfazowego 400 V. Rzeczywista wydajność zależy od rodzaju i wymiarów drewna oraz warunków pracy. Obsługuj wyłącznie zgodnie z instrukcją i z użyciem dostarczonych kleszczy.</p>
 <div className="mt-10 border-t pt-6"><a className="font-bold text-green-800 underline" href={product}>Pełna specyfikacja, dostępność i zamówienie →</a></div>
 </div></main>;
}
