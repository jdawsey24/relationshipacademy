import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/site-leads?source=speaking_inquiry  (source optional)
// Returns site_leads rows, newest first, optionally filtered by source.
export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  const supabase = getSupabaseAdminClient();
  let query = supabase
    .from("site_leads")
    .select("id, name, email, source, inquiry_type, message, organization, event_type, status, notes, created_at")
    .order("created_at", { ascending: false });
  if (source) query = query.eq("source", source);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Failed to load leads.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ rows: data ?? [] });
}

const VALID_STATUS = new Set(["new", "contacted", "converted", "archived"]);

// PATCH { id, status?, notes? } — update a lead's status / notes.
export async function PATCH(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  const update: Record<string, unknown> = {};
  if (typeof body.status === "string") {
    if (!VALID_STATUS.has(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    update.status = body.status;
  }
  if (typeof body.notes === "string") update.notes = body.notes;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("site_leads").update(update).eq("id", body.id).select().maybeSingle();
  if (error) {
    return NextResponse.json({ error: "Failed to save.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ row: data });
}
