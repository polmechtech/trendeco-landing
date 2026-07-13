import { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE = "allegro_oauth_state";

export async function GET(request: NextRequest) {
  const clientId = process.env.ALLEGRO_CLIENT_ID;
  const adminSecret = process.env.ADMIN_SECRET;
  const suppliedSecret = request.nextUrl.searchParams.get("key");

  if (!clientId) {
    return NextResponse.json(
      { error: "Brakuje ALLEG