import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: item drafts. ?view=queue (open drafts) | history (all) | approved | rejected.
export async function GET(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const u = new URL(request.url);
  const view = u.searchParams.get("view") ?? "queue";
  const s = getSupabaseAdminClient();
  let q = s.from("ai_item_drafts").select("*").order("created_at", { ascending: false }).limit(500);
  if (view === "queue") q = q.in("status", ["draft", "in_review", "changes_requested"]);
  else if (view === "approved") q = q.eq("status", "approved");
  else if (view === "rejected") q = q.eq("status", "rejected");
  const status = u.searchParams.get("status");
  if (status) q = q.eq("status", status);
  const competency = u.searchParams.get("competency_id");
  if (competency) q = q.eq("competency_id", competency);
  const { data, error } = await q;
  if (error) return NextResponse.json({ rows: [] });
  return NextResponse.json({ rows: data ?? [] });
}
