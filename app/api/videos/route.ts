import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();
const KEY_PREFIX = "product:videos:";

type VideoLinks = {
  youtube?: string;
  tiktok?: string;
};

function isAllowedVideoUrl(value: string, platform: "youtube" | "tiktok") {
  try {
    const url = new URL(value);
    if (platform === "youtube") {
      return ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(url.hostname);
    }
    return ["tiktok.com", "www.tiktok.com", "vm.tiktok.com", "m.tiktok.com"].includes(url.hostname);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const offerId = request.nextUrl.searchParams.get("offerId")?.trim();
  if (!offerId || !/^\d+$/.test(offerId)) {
    return NextResponse.json({ error: "Nieprawidłowy numer oferty" }, { status: 400 });
  }

  const videos = (await redis.get<VideoLinks>(`${KEY_PREFIX}${offerId}`)) ?? {};
  return NextResponse.json(videos, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
  });
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.VIDEO_ADMIN_TOKEN;
  const providedToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!expectedToken || providedToken !== expectedToken) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const offerId = String(body?.offerId ?? "").trim();
  const youtube = String(body?.youtube ?? "").trim();
  const tiktok = String(body?.tiktok ?? "").trim();

  if (!/^\d+$/.test(offerId)) {
    return NextResponse.json({ error: "Nieprawidłowy numer oferty" }, { status: 400 });
  }
  if (youtube && !isAllowedVideoUrl(youtube, "youtube")) {
    return NextResponse.json({ error: "Nieprawidłowy link YouTube" }, { status: 400 });
  }
  if (tiktok && !isAllowedVideoUrl(tiktok, "tiktok")) {
    return NextResponse.json({ error: "Nieprawidłowy link TikTok" }, { status: 400 });
  }

  const videos: VideoLinks = {
    ...(youtube ? { youtube } : {}),
    ...(tiktok ? { tiktok } : {}),
  };

  if (!youtube && !tiktok) {
    await redis.del(`${KEY_PREFIX}${offerId}`);
  } else {
    await redis.set(`${KEY_PREFIX}${offerId}`, videos);
  }

  return NextResponse.json({ ok: true, videos });
}
