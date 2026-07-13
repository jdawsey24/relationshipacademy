import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminApi";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: scoring rules (for the band/inputs editor).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("studio_scoring_rules").select("*").order("scoring_rule_id");
  if (error) return NextResponse.json({ rows: [] });
  return NextResponse.json({ rows: data ?? [] });
}
