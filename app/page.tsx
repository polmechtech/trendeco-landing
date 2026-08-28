import { headers } from "next/headers";
import { getOfferPath, type AllegroProduct, type ProductCategory } from "@/lib/allegro";

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    if (!host) return [];

    const res = await fetch(`${protocol}://${host}/api/allegro/offers`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getDiscountedPrice(product: AllegroProduct) {
  const price = Number.parseFloat(String(product.price).replace(",", "."));
  if (!Number.isFinite(price)) return product.price;
  const discounted = price * 0.95;
  const roundedDownToNine = Math.floor((discounted + 1) / 10) * 10 - 1;
  return Math.max(9, roundedDownToNine).toFixed(2);
}

function getCashOnDeliveryLink(product: AllegroProduct) {
  const discountedPrice = getDiscountedPrice(product);
  const message = [
    "Dzień dobry, chcę zamówić za pobraniem:",
    product.name,
    `Cena TrendEco: ${discountedPrice} ${product.currency}`,
    `Allegro ID: ${product.id}`,
    "Proszę o potwierdzenie dostępności oraz kosztu dostawy.",
  ].join("\n");

  return `https://wa.me/48512077770?text=${encodeURIComponent(message)}`;
}

const sections: ProductCategory[] = ["Łuparki", "Budownictwo", "Meblarstwo", "Akcesoria", "Inne"];
const whatsappLink = "https://wa.me/48512077770?text=Dzień%20dobry%2C%20mam%20pytanie%20o%20ofertę%20TrendEco.";
const tiktokLink = "https://www.tiktok.com/@trendeco4";

export default async function Home() {
  const products = await getProducts();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TrendEco",
    url: "https://trendeco.eu",
    inLanguage: "pl-PL",
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-5xl font-black md:text-7xl">TrendEco</h1>
            <p className="mt-6 max-w-3xl text-xl text-zinc-300">
              Maszyny i narzędzia dostępne w sprzedaży przez Allegro oraz bezpośrednio w TrendEco.
            </p>
            <p className="mt-4 max-w-3xl text-base text-zinc-400">
              Zamówienie za pobraniem ustalamy przez WhatsApp. Koszt dostawy potwierdzamy przed wysyłką.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold transition hover:bg-white/20">
              TikTok TrendEco
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-500">
              Zadzwoń / WhatsApp +48 512 077 770
            </a>
          </div>
        </div>

        <a href="/o-nas" className="mt-6 inline-block text-sm font-bold text-orange-400">O firmie i kontakt →</a>
      </section>

      {sections.map((section) => {
        const sectionProducts = products.filter((product) => product.category === section);
        if (sectionProducts.length === 0) return null;
        return (
          <section key={section} className="bg-white px-6 py-16 text-zinc-950">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-4xl font-black">{section}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {sectionProducts.map((product) => {
                  const discountedPrice = getDiscountedPrice(product);
                  return (
                    <article key={product.id} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 transition hover:-translate-y-1 hover:shadow-lg">
                      <a href={getOfferPath(product)}>
                        <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-white">
                          {product.image ? <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" /> : <span className="text-zinc-400">Brak zdjęcia</span>}
                        </div>
                        <h3 className="mt-4 text-base font-bold">{product.name}</h3>
                      </a>
                      <div className="mt-3">
                        <p className="text-sm text-zinc-400 line-through">Allegro: {product.price} {product.currency}</p>
                        <p className="text-xl font-black text-green-700">Cena TrendEco: {discountedPrice} {product.currency}</p>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600">{product.stock > 0 ? `Dostępne: ${product.stock} szt.` : "Chwilowo niedostępne"}</p>
                      <div className="mt-4 grid gap-2">
                        <a href={getCashOnDeliveryLink(product)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-600 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-green-500">
                          Zamów za pobraniem — niższa cena
                        </a>
                        <a href={getOfferPath(product)} className="rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white">
                          Zobacz ofertę
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {products.length === 0 && <section className="bg-white px-6 py-20 text-center text-zinc-600">Nie udało się obecnie pobrać aktywnych ofert Allegro.</section>}
    </main>
  );
}
