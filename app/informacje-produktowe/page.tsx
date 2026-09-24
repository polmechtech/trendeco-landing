import type { Metadata } from "next";
import type { AllegroProduct } from "@/lib/allegro";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Producent i informacje bezpieczeństwa GPSR | TrendEco",
  description: "Dane producenta, podmiotu odpowiedzialnego w UE oraz informacje bezpieczeństwa GPSR dla produktów dostępnych w TrendEco.",
};

async function getProduct(offerId: string): Promise<AllegroProduct | null> {
  if (!offerId) return null;
  try {
    const response = await fetch("https://trendeco.eu/api/allegro/offers", { cache: "no-store" });
    if (!response.ok) return null;
    const products = (await response.json()) as AllegroProduct[];
    return products.find(product => product.id === offerId) ?? null;
  } catch { return null; }
}

function address(party: NonNullable<AllegroProduct["gpsr"]>["manufacturer"]) {
  if (!party) return "";
  return [party.address?.street, [party.address?.postalCode, party.address?.city].filter(Boolean).join(" "), party.address?.countryCode].filter(Boolean).join(", ");
}

export default async function ProductInfoPage({ searchParams }: { searchParams: Promise<{ offerId?: string }> }) {
  const { offerId = "" } = await searchParams;
  const product = await getProduct(offerId);
  if (!product) return <main className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-950"><section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm"><h1 className="text-3xl font-black">Informacje o produkcie</h1><p className="mt-4 text-zinc-600">Nie znaleziono produktu. Otwórz tę stronę z linku „Dane producenta” lub „GPSR / bezpieczeństwo” w karcie produktu.</p></section></main>;

  const gpsr = product.gpsr;
  const manufacturer = gpsr?.manufacturer;
  const responsible = gpsr?.responsiblePerson;

  return <main className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-950">
    <div className="mx-auto max-w-4xl">
      <a href={`/oferta/${product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}-${product.id}`} className="text-sm font-semibold text-zinc-500">← Wróć do produktu</a>
      <h1 className="mt-6 text-3xl font-black">Producent i informacje bezpieczeństwa GPSR</h1>
      <p className="mt-3 text-zinc-600">{product.name}</p>

      <section id="producent" className="mt-8 rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <h2 className="text-2xl font-black">Dane producenta</h2>
        {manufacturer ? <div className="mt-5 leading-7 text-zinc-700"><p className="font-bold text-zinc-950">{manufacturer.name}</p>{address(manufacturer)&&<p>{address(manufacturer)}</p>}{manufacturer.contact?.email&&<p><a className="underline" href={`mailto:${manufacturer.contact.email}`}>{manufacturer.contact.email}</a></p>}{manufacturer.contact?.phoneNumber&&<p>{manufacturer.contact.phoneNumber}</p>}</div> : <p className="mt-5 text-zinc-600">Brak danych producenta w aktualnej ofercie.</p>}
      </section>

      <section id="podmiot-odpowiedzialny" className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <h2 className="text-2xl font-black">Podmiot odpowiedzialny w UE</h2>
        {responsible ? <div className="mt-5 leading-7 text-zinc-700"><p className="font-bold text-zinc-950">{responsible.name}</p>{address(responsible)&&<p>{address(responsible)}</p>}{responsible.contact?.email&&<p><a className="underline" href={`mailto:${responsible.contact.email}`}>{responsible.contact.email}</a></p>}{responsible.contact?.phoneNumber&&<p>{responsible.contact.phoneNumber}</p>}</div> : <p className="mt-5 text-zinc-600">Ekogratis sp. z o.o., Warszawa</p>}
      </section>

      <section id="gpsr" className="mt-6 rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <h2 className="text-2xl font-black">Informacje bezpieczeństwa GPSR</h2>
        {gpsr?.safetyInformation?.description ? <p className="mt-5 whitespace-pre-line leading-7 text-zinc-700">{gpsr.safetyInformation.description}</p> : <p className="mt-5 text-zinc-600">Brak dodatkowego tekstu bezpieczeństwa w aktualnych danych oferty.</p>}
      </section>
    </div>
  </main>;
}
