import { NextResponse } from "next/server";

const API_BASE = "https://sprzedajemy.pl/webapi/v1";

function token() {
  const value = process.env.SPRZEDAJEMY_API_TOKEN?.trim();
  if (!value) throw new Error("Brakuje SPRZEDAJEMY_API_TOKEN");
  return value;
}

async function get(path: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token()}`, Accept: "application/json" },
    cache: "no-store",
  });
  const text = await response.text();
  let body: unknown = text;
  try { body = text ? JSON.parse(text) : null; } catch {}
  return { ok: response.ok, status: response.status, body };
}

export async function GET(request: Request) {
  try {
    const parentId = new URL(request.url).searchParams.get("parent_id");
    const path = parentId
      ? `/category-list?parent_id=${encodeURIComponent(parentId)}`
      : "/category-list";
    const result = await get(path);
    return NextResponse.json(result.body, {
      status: result.ok ? 200 : result.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
