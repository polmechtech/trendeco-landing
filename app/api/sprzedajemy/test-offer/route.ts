import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const SOURCE_ID = "18550962217";
const EXTERNAL_ID = `trendeco_${SOURCE_ID}`;
const API = "https://sprzedajemy.pl/webapi/v1";

export async function POST() {
  try {
    const token = process.env.SPRZEDAJEMY_API_TOKEN;
    if (!token) return NextResponse.json({ error: "SPRZEDAJEMY_API_TOKEN missing" }, { status: 500 });
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    const existing = await fetch(`${API}/offer-details?external_id=${encodeURIComponent(EXTERNAL_ID)}`, { headers, cache: "no-store" });
    if (existing.ok) return NextResponse.json({ created: false, reason: "already_exists", offer: await existing.json() });

    const loc = await fetch(`${API}/get-location?q=${encodeURIComponent("Warszawa")}`, { headers, cache: "no-store" });
    if (!loc.ok) return NextResponse.json({ created: false, step: "location", apiStatus: loc.status, apiResponse: await loc.text() }, { status: 502 });
    const locations = await loc.json();
    const warsaw = (Array.isArray(locations) ? locations : []).find((x: any) => x.name === "Warszawa" && /mazowieck/i.test(x.parentName ?? ""));
    if (!warsaw?.locationId) return NextResponse.json({ created: false, step: "location", error: "Warszawa/mazowieckie locationId not found", locations }, { status: 502 });

    const catalog = await fetch("https://trendeco.eu/api/catalog", { cache: "no-store" });
    const data = await catalog.json();
    const products = Array.isArray(data) ? data : (data.products ?? []);
    const p = products.find((x: any) => String(x.id) === SOURCE_ID);
    if (!p) return NextResponse.json({ error: "Test product not found in active catalog" }, { status: 404 });

    const payload = {
      externalId: EXTERNAL_ID,
      title: "TrendEco Kółko tnące łożyskowane 22 mm do przecinarki ręcznej",
      description: [
        "Łożyskowane kółko tnące TrendEco do ręcznych przecinarek do glazury i płytek.",
        "Średnica kółka: 22 mm. Konstrukcja łożyskowana ułatwia płynne prowadzenie podczas nacinania płytki.",
        "Część zamienna przeznaczona do przecinarek wykorzystujących kółko o odpowiednich wymiarach. Przed zakupem należy porównać wymiary mocowania z posiadaną przecinarką.",
        "Produkt nowy. Sprzedaż i obsługa z Polski."
      ].join("\n\n"),
      categoryId: 19324,
      locationId: Number(warsaw.locationId),
      attributes: [
        { id: "price", value: Number(p.price) },
        { id: "condition", value: 1 },
        { id: "2692_marka", value: 212270 }
      ],
      pictureUrls: (p.images ?? []).map((x: any) => typeof x === "string" ? x : x.url).filter(Boolean)
    };

    const create = await fetch(`${API}/create-offer`, { method: "POST", headers, body: JSON.stringify(payload), cache: "no-store" });
    const raw = await create.text();
    let body: any; try { body = JSON.parse(raw); } catch { body = { raw }; }
    if (!create.ok) return NextResponse.json({ created: false, apiStatus: create.status, apiResponse: body, payload: { ...payload, pictureUrls: payload.pictureUrls.length } }, { status: 502 });
    return NextResponse.json({ created: true, offer: body, externalId: EXTERNAL_ID });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
