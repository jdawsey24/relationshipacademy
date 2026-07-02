import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET all content overrides (admin).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("site_content").select("key, value, updated_at, updated_by");
  if (error) {
    return NextResponse.json({ error: "Failed to load content.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ rows: data ?? [] });
}

// PATCH { updates: { key: value, ... } } — upsert content overrides.
export async function PATCH(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const user = await getAdminUser();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const updates = body.updates;
  if (typeof updates !== "object" || updates === null) {
    return NextResponse.json({ error: "updates object required." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rows = Object.entries(updates as Record<string, unknown>).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : String(value ?? ""),
    updated_at: now,
    updated_by: user?.email ?? null,
  }));
  if (rows.length === 0) {
    return NextResponse.json({ error: "No updates provided." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  if (error) {
    return NextResponse.json({ error: "Failed to save.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
