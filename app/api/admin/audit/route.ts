import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: recent admin audit entries (owner-only). Resilient: returns an empty
// list if the audit_log table isn't set up yet (migration 0008).
export async function GET(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 300, 1000);

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("audit_log")
      .select("id, actor, action, target, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("[audit] read failed:", error.message);
      return NextResponse.json({ rows: [], ready: false });
    }
    return NextResponse.json({ rows: data ?? [], ready: true });
  } catch (e) {
    console.error("[audit] read error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ rows: [], ready: false });
  }
}
