import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";

// Owner-only. Global settings live in the site_content key/value table, so this
// mirrors the site-content API but gated to owners (Editors can edit page copy
// but not global settings).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) return NextResponse.json({ error: "Failed to load settings." }, { status: 502 });
  return NextResponse.json({ rows: data ?? [] });
}

export async function PATCH(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const updates = body.updates;
  if (typeof updates !== "object" || updates === null) {
    return NextResponse.json({ error: "updates object required." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rows = Object.entries(updates as Record<string, unknown>).map(([key, value]) => ({
    key, value: typeof value === "string" ? value : String(value ?? ""), updated_at: now, updated_by: user?.email ?? null,
  }));
  if (rows.length === 0) return NextResponse.json({ error: "No updates." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  if (error) return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
