import { NextResponse } from "next/server";
import { sprzedajemyEditorial } from "@/lib/sprzedajemyEditorial";
import { sprzedajemyMapping } from "@/lib/sprzedajemyMapping";

export const dynamic = "force-dynamic";
const SOURCE_ID = "18550962217";
const EXTERNAL_ID = `trendeco_${SOURCE_ID}`;
const API = "https://sprzedajemy.pl/webapi/v1";

export async function POST(request: Request) {
  try {
    const token = process.env.SPRZEDAJEMY_API_TOKEN;
    if (!token) return NextResponse.json({ error: "SPRZEDAJEMY_API_TOKEN missing" }, { status: 500 });
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const existing = await fetch(`${API}/offer-details?external_id=${encodeURIComponent(EXTERNAL_ID)}`, { headers, cache: "no-store" });
    if (existing.ok) {
      const offer = await existing.json();
      return NextResponse.json({ created: false, reason: "already_exists", offer });
    }

    const origin = new URL(request.url).origin;
    const catalogRes = await fetch(`${origin}/api/catalog`, { cache: "no-store" });
    if (!catalogRes.ok) throw new Error(`Catalog HTTP ${catalogRes.status}`);
    const data = await catalogRes.json();
    const products = Array.isArray(data) ? data : (data.products ?? []);
    const p = products.find((x: any) => String(x.id) === SOURCE_ID);
    if (!p) return NextResponse.json({ error: "Test product not found in active catalog" }, { status: 404 });

    const editorial = sprzedajemyEditorial(p);
    const mapping = sprzedajemyMapping(SOURCE_ID, p.price);
    const payload = {
      externalId: EXTERNAL_ID,
      title: editorial.title,
      description: editorial.description,
      categoryId: mapping.categoryId,
      attributes: mapping.attributes,
      pictureUrls: (p.images ?? []).map((x: any) => typeof x === "string" ? x : x.url).filter(Boolean),
    };

    const create = await fetch(`${API}/create-offer`, {
      method: "POST", headers, body: JSON.stringify(payload), cache: "no-store"
    });
    const body = await create.json().catch(async () => ({ raw: await create.text() }));
    if (!create.ok) return NextResponse.json({ created: false, apiStatus: create.status, apiResponse: body, payload: { ...payload, pictureUrls: payload.pictureUrls.length } }, { status: 502 });
    return NextResponse.json({ created: true, offer: body, externalId: EXTERNAL_ID });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
