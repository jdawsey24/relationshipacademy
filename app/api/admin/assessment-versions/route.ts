import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only view of assessment_versions (structural — not editable via UI).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("assessment_versions")
    .select("id, version_label, description, active_from, active_to, created_at")
    .order("active_from", { ascending: false });
  if (error) {
    return NextResponse.json({ error: "Failed to load versions.", details: error.message }, { status: 502 });
  }
  return NextResponse.json({ rows: data ?? [] });
}
