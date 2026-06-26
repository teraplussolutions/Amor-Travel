import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const ts = new Date().toISOString();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, ts, error: "Supabase env not configured" },
      { status: 503 },
    );
  }

  const admin = tryCreateAdminClient();
  if (admin) {
    const { error } = await admin.from("agencies").select("id").limit(1);
    if (error) {
      return NextResponse.json(
        { ok: false, ts, error: error.message },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, ts });
  }

  const res = await fetch(`${url}/rest/v1/agencies?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, ts, error: `HTTP ${res.status}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, ts });
}
