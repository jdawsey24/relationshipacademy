import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: content drafts. ?view=queue|approved|rejected|history & ?asset_type=
export async function GET(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const u = new URL(request.url);
  const view = u.searchParams.get("view") ?? "queue";
  const s = getSupabaseAdminClient();
  let q = s.from("ai_content_drafts").select("*").order("created_at", { ascending: false }).limit(500);
  if (view === "queue") q = q.in("status", ["draft", "in_review", "changes_requested"]);
  else if (view === "approved") q = q.eq("status", "approved");
  else if (view === "rejected") q = q.eq("status", "rejected");
  const type = u.searchParams.get("asset_type");
  if (type) q = q.eq("asset_type", type);
  const { data, error } = await q;
  if (error) return NextResponse.json({ rows: [] });
  return NextResponse.json({ rows: data ?? [] });
}
