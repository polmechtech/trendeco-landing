import type { AllegroProduct, ProductCategory } from "@/lib/allegro";

async function getProducts(): Promise<AllegroProduct[]> {
  try {
    const res = await fetch("http://localhost:3000/api/allegro/offers", {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    return data;
  } catch {
    return [];
  }
}

const sections: ProductCategory[] = [
  "Łuparki",
  "Budownictwo",
  "Meblarstwo",
  "Akcesoria",
];

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-5xl font-black md:text-7xl">TrendEco</h1>
        <p className="mt-6 max-w-3xl text-xl text-zinc-300">
          Maszyny i narzędzia dla meblarstwa, budownictwa, łupania drewna oraz
          obróbki technicznej. Zakup odbywa się przez Allegro.
        </p>
      </section>

      {sections.map((section) => {
        const sectionProducts = products.filter(
          (product) => product.category === section
        );

        return (
          <section key={section} className="bg-white px-6 py-16 text-zinc-950">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-4xl font-black">{section}</h2>

              <div className="mt-8 grid gap-6 md:grid-cols-4">
                {sectionProducts.length > 0 ? (
                  sectionProducts.map((product) => (
                    <a
                      key={product.id}
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 hover:shadow-lg"
                    >
                      <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-white">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-zinc-400">Brak zdjęcia</span>
                        )}
                      </div>

                      <h3 className="mt-4 text-base font-bold">
                        {product.name}
                      </h3>

                      <p className="mt-3 text-xl font-black text-orange-600">
                        {product.price} {product.currency}
                      </p>

                      <div className="mt-4 rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white">
                        Zobacz na Allegro
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-zinc-500">
                    Brak aktywnych ofert w tej kategorii.
                  </p>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}