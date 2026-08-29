import { NextResponse } from "next/server";
import { getOfferPath, type AllegroProduct } from "@/lib/allegro";
import { seoCategories } from "@/lib/seoCategories";

export const dynamic = "force-dynamic";

const host = "trendeco.eu";
const baseUrl = `https://${host}`;
const key = "6f92c1d8e4a7430b9d1f8c27a56e4b13";

export async function GET() {
  try {
    const productsResponse = await fetch(`${baseUrl}/api/allegro/offers`, { cache: "no-store" });
    const products: AllegroProduct[] = productsResponse.ok ? await productsResponse.json() : [];
    const urlList = [
      baseUrl,
      `${baseUrl}/o-nas`,
      `${baseUrl}/dostawa`,
      `${baseUrl}/zwroty-i-reklamacje`,
      ...seoCategories.map((category) => `${baseUrl}/kategoria/${category.slug}`),
      ...products.map((product) => `${baseUrl}${getOfferPath(product)}`),
    ].slice(0, 10000);

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${baseUrl}/${key}.txt`,
        urlList,
      }),
    });

    return NextResponse.json({ ok: response.ok, status: response.status, submitted: urlList.length }, { status: response.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ ok: false, submitted: 0 }, { status: 500 });
  }
}
