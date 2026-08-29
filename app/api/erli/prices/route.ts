import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
const CACHE_SECONDS = 60 * 60;

type ErliInfo = { price: string; currency: string; url: string } | null;

function extractPublicBuyerPrice(html: string, basePrice: number): number | null {
  const candidates: number[] = [];
  const patterns = [
    /itemprop=["']price["'][^>]*content=["']([0-9]+(?:[.,][0-9]{1,2})?)["']/gi,
    /content=["']([0-9]+(?:[.,][0-9]{1,2})?)["'][^>]*itemprop=["']price["']/gi,
    /property=["']product:price:amount["'][^>]*content=["']([0-9]+(?:[.,][0-9]{1,2})?)["']/gi,
    /"price"\s*:\s*"?([0-9]+(?:[.,][0-9]{1,2})?)"?/gi,
    /"currentPrice"\s*:\s*"?([0-9]+(?:[.,][0-9]{1,2})?)"?/gi,
    /"salePrice"\s*:\s*"?([0-9]+(?:[.,][0-9]{1,2})?)"?/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const value = Number(match[1].replace(",", "."));
      if (Number.isFinite(value) && value > 0) candidates.push(value);
    }
  }

  const plausible = candidates
    .filter((value) => value >= basePrice * 0.5 && value <= basePrice)
    .sort((a, b) => b - a);

  const discounted = plausible.find((value) => value < basePrice - 0.005);
  return discounted ?? plausible[0] ?? null;
}

async function getErliProduct(externalId: string): Promise<ErliInfo> {
  const cacheKey = `erli:product:${externalId}:v2`;
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
    const url = `https://erli.pl/produkt/${encodeURIComponent(String(slug))}%2C${encodeURIComponent(String(marketplaceId))}`;
    let buyerPrice = basePrice;

    try {
      const publicResponse = await fetch(url, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "pl-PL,pl;q=0.9",
          "User-Agent": "Mozilla/5.0 (compatible; TrendEcoPriceCheck/1.0)",
        },
        cache: "no-store",
      });
      if (publicResponse.ok) {
        const html = await publicResponse.text();
        buyerPrice = extractPublicBuyerPrice(html, basePrice) ?? basePrice;
      }
    } catch {
      // If the public page cannot be read, keep the safe Shop API price.
    }

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
