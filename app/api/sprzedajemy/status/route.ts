import { NextResponse } from "next/server";

const API_BASE = "https://sprzedajemy.pl/webapi/v1";

function getToken() {
  const token = process.env.SPRZEDAJEMY_API_TOKEN?.trim();
  if (!token) throw new Error("Brakuje SPRZEDAJEMY_API_TOKEN");
  return token;
}

async function sprzedajemy(path: string) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();
  let body: unknown = text;
  try { body = text ? JSON.parse(text) : null; } catch {}

  return { ok: response.ok, status: response.status, body };
}

export async function GET() {
  try {
    const api = await sprzedajemy("/");
    return NextResponse.json(
      {
        configured: true,
        apiOk: api.ok,
        apiStatus: api.status,
        api: api.body,
      },
      { status: api.ok ? 200 : 502, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
