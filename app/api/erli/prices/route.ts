import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
const CACHE_SECONDS = 60 * 60;

// ERLI public buyer price observed on the marketplace:
// 5998.00 PLN seller/base price -> 5741.80 PLN public ERLI price.
// Until ERLI exposes the final buyer price in Shop API, apply the same ratio automatically.
const ERLI_BUYER_PRICE_RATIO = 5741.8 / 5998;

type ErliInfo = { price: string; currency: string; url: string } | null;

async function getErliProduct(externalId: string): Promise<ErliInfo> {
  const cacheKey = `erli:product:${externalId}:v3`;
  const cached = await redis.get<ErliInfo>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.ERLI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://erli.pl/svc/shop-api/products/${encodeURIComponent(externalId)}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "User-Agent": "TrendEco/1.0",
      },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const body = await response.json();
    const rawPrice = Number(body?.price);
    const marketplaceId = body?.marketplaceId;
    const slug = body?.slug;
    if (!Number.isFinite(rawPrice) || !marketplaceId || !slug) return null;

    const basePrice = rawPrice / 100;
    const buyerPrice = Math.round(basePrice * ERLI_BUYER_PRICE_RATIO * 100) / 100;
    const url = `https://erli.pl/produkt/${encodeURIComponent(String(slug))}%2C${encodeURIComponent(String(marketplaceId))}`;

    const info = {
      price: buyerPrice.toFixed(2),
      currency: "PLN",
      url,
    };

    await redis.set(cacheKey, info, { ex: CACHE_SECONDS });
    return info;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const ids = (request.nextUrl.searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^\d+$/.test(id))
    .slice(0, 100);

  if (ids.length === 0) return NextResponse.json({});

  const entries = await Promise.all(ids.map(async (id) => [id, await getErliProduct(id)] as const));
  return NextResponse.json(Object.fromEntries(entries.filter(([, value]) => value)), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
