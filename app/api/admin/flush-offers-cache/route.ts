import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const redis = Redis.fromEnv();
  await redis.del("allegro:offers_cache:v6");
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
