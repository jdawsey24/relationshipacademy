import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: generation request history (provenance ledger).
export async function GET() {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("ai_generation_requests").select("*").order("created_at", { ascending: false }).limit(300);
  if (error) return NextResponse.json({ rows: [] });
  return NextResponse.json({ rows: data ?? [] });
}
