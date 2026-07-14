import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { extractOfferId, getOfferPath, type AllegroProduct } from "@/lib/allegro";

export const dynamic = "force-dynamic";

type VideoLinks = {
  youtube?: string;
  tiktok?: string;
};

async function getProductBySlug(slug: string): Promise<AllegroProduct | null> {
  const id = extractOfferId(slug);
  if (!id) return null;

  try {
    const response = await fetch("https://trendeco.eu/api/allegro/offers", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const products = (await response.json()) as AllegroProduct[];
    return products.find((product) => product.id === id) ?? null;
  } catch {
    return null;
  }
}

async function getVideos(offerId: string): Promise<VideoLinks> {
  try {
    const response = await fetch(`https://trendeco.eu/api/videos?offerId=${encodeURIComponent(offerId)}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return {};
    return (await response.json()) as VideoLinks;
  } catch {
    return {};
  }
}

function getYouTubeEmbedUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const id = url.hostname === "youtu.be"
      ? url.pathname.split("/").filter(Boolean)[0]
      : url.searchParams.get("v") ?? url.pathname.match(/\/(?:shorts|embed)\/([^/?]+)/)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
  } catch {
    return null;
  }
}

function getTikTokEmbedUrl(value?: string) {
  if (!value) return null;
  const id = value.match(/\/video\/(\d+)/)?.[1];
  return id ? `https://www.tiktok.com/player/v1/${id}` : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Oferta niedostępna", robots: { index: false } };

  const canonical = getOfferPath(product);
  const description = `${product.name}. Cena ${product.price} ${product.currency}. Dostępność: ${product.stock} szt. Kup na Allegro lub skontaktuj się po indywidualną ofertę.`;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
      type: "website",
    },
  };
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const canonicalPath = getOfferPath(product);
  if (`/oferta/${slug}` !== canonicalPath) permanentRedirect(canonicalPath);

  const videos = await getVideos(product.id);
  const youtubeEmbed = getYouTubeEmbedUrl(videos.youtube);
  const tiktokEmbed = getTikTokEmbedUrl(videos.tiktok);

  const mailSubject = encodeURIComponent(`Zapytanie o ofertę: ${product.name}`);
  const mailBody = encodeURIComponent(`Dzień dobry, proszę o indywidualną ofertę na produkt: ${product.name} (Allegro ID: ${product.id}).`);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image ? [product.image] : undefined,
    sku: product.id,
    brand: { "@type": "Brand", name: "TrendEco" },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "TrendEco" },
    },
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12 text-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <article className="mx-auto grid max-w-5xl gap-10 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-zinc-50">
          {product.image ? <img src={product.image} alt={product.name} className="max-h-[520px] max-w-full object-contain" /> : <span className="text-zinc-400">Brak zdjęcia</span>}
        </div>
        <div>
          <a href="/" className="text-sm font-semibold text-zinc-500">← Wróć do katalogu</a>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-orange-600">{product.category}</p>
          <h1 className="mt-3 text-3xl font-black leading-tight">{product.name}</h1>
          <p className="mt-6 text-3xl font-black text-orange-600">{product.price} {product.currency}</p>
          <p className="mt-3 text-zinc-600">Dostępność: {product.stock > 0 ? `${product.stock} szt.` : "brak"}</p>

          <a href={product.url} target="_blank" rel="noopener noreferrer sponsored" className="mt-8 block rounded-full bg-orange-500 px-6 py-4 text-center text-lg font-black text-white hover:bg-orange-600">
            Kup teraz na Allegro
          </a>

          <section className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-xl font-black">Chcesz lepszą ofertę niż na Allegro?</h2>
            <p className="mt-2 text-zinc-600">Zadzwoń lub napisz. Przygotujemy indywidualną ofertę.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a href="tel:+48512077770" className="rounded-full bg-zinc-950 px-5 py-3 text-center font-bold text-white">Zadzwoń</a>
              <a href={`mailto:mail@trendeco.eu?subject=${mailSubject}&body=${mailBody}`} className="rounded-full border border-zinc-300 px-5 py-3 text-center font-bold">Napisz e-mail</a>
            </div>
          </section>

          <p className="mt-6 text-sm text-zinc-500">Cena i dostępność są synchronizowane z Allegro co godzinę.</p>
        </div>
      </article>

      {(youtubeEmbed || tiktokEmbed || videos.youtube || videos.tiktok) && (
        <section className="mx-auto mt-8 max-w-5xl rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <h2 className="text-2xl font-black">Film produktu</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {youtubeEmbed && (
              <iframe
                src={youtubeEmbed}
                title={`YouTube: ${product.name}`}
                className="aspect-video w-full rounded-2xl border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
            {tiktokEmbed && (
              <iframe
                src={tiktokEmbed}
                title={`TikTok: ${product.name}`}
                className="min-h-[640px] w-full rounded-2xl border-0"
                loading="lazy"
                allow="fullscreen"
              />
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {videos.youtube && <a href={videos.youtube} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-3 font-bold">Otwórz w YouTube</a>}
            {videos.tiktok && <a href={videos.tiktok} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-3 font-bold">Otwórz w TikTok</a>}
          </div>
        </section>
      )}
    </main>
  );
}
