import { NextResponse } from "next/server";

const API_BASE = "https://sprzedajemy.pl/webapi/v1";

function token() {
  const value = process.env.SPRZEDAJEMY_API_TOKEN?.trim();
  if (!value) throw new Error("Brakuje SPRZEDAJEMY_API_TOKEN");
  return value;
}

export async function GET(request: Request) {
  try {
    const categoryId = new URL(request.url).searchParams.get("category_id");
    if (!categoryId || !/^\d+$/.test(categoryId)) {
      return NextResponse.json({ error: "category_id is required" }, { status: 400 });
    }
    const response = await fetch(
      `${API_BASE}/category-attributes?category_id=${encodeURIComponent(categoryId)}`,
      { headers: { Authorization: `Bearer ${token()}`, Accept: "application/json" }, cache: "no-store" }
    );
    const text = await response.text();
    let body: unknown = text;
    try { body = text ? JSON.parse(text) : null; } catch {}
    return NextResponse.json(body, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
