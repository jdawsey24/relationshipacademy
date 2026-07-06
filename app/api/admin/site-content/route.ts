import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET all content overrides (admin).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  let { data, error } = await supabase.from("site_content").select("key, value, draft_value, updated_at, updated_by");
  // Resilient: if the draft/publish migration (0005) hasn't run yet, the
  // draft_value column is absent — fall back so the editors still load.
  if (error) {
    ({ data, error } = await supabase.from("site_content").select("key, value, updated_at, updated_by"));
  }
  if (error) {
    return NextResponse.json({ error: "Failed to load content." }, { status: 502 });
  }
  return NextResponse.json({ rows: data ?? [] });
}

// PATCH content overrides. Body is one of:
//   { drafts:  { key: value } }  — stage edits (writes draft_value, value untouched)
//   { publish: { key: value } }  — go live (writes value, clears draft_value)
//   { updates: { key: value } }  — legacy immediate publish (value, clears draft)
export async function PATCH(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const isDraft = body.drafts !== undefined;
  const map = (body.drafts ?? body.publish ?? body.updates) as Record<string, unknown> | undefined;
  if (typeof map !== "object" || map === null) {
    return NextResponse.json({ error: "drafts, publish, or updates object required." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const rows = Object.entries(map).map(([key, value]) => {
    const str = typeof value === "string" ? value : String(value ?? "");
    // Draft: stage into draft_value, leave the published value alone.
    // Publish/legacy: write the live value and clear any staged draft.
    return isDraft
      ? { key, draft_value: str, updated_at: now, updated_by: user?.email ?? null }
      : { key, value: str, draft_value: null, updated_at: now, updated_by: user?.email ?? null };
  });
  if (rows.length === 0) {
    return NextResponse.json({ error: "No updates provided." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  if (error) {
    return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
