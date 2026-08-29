import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import erliPriceRatios from "@/lib/erli-price-ratios.json";

const redis = Redis.fromEnv();
const CACHE_SECONDS = 60 * 60;

type ErliInfo = { price: string; currency: string; url: string } | null;
type RatioMap = Record<string, number>;

const priceRatios = erliPriceRatios as RatioMap;

// Some Allegro offers were relisted after the ERLI export was created.
// Map the current Allegro offer ID to the ERLI externalId from that export.
const erliExternalIdAliases: Record<string, string> = {
  "18878600668": "18795916941",
};

async function getErliProduct(requestedId: string): Promise<ErliInfo> {
  const erliExternalId = erliExternalIdAliases[requestedId] ?? requestedId;
  const cacheKey = `erli:product:${requestedId}:v6`;
  const cached = await redis.get<ErliInfo>(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.ERLI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://erli.pl/svc/shop-api/products/${encodeURIComponent(erliExternalId)}`, {
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
    const ratio = priceRatios[erliExternalId];
    const buyerPrice = Number.isFinite(ratio)
      ? Math.round(basePrice * ratio * 100) / 100
      : basePrice;
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
