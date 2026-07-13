import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: content-draft workspace — draft + quality findings + source snapshots.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { data: draft } = await s.from("ai_content_drafts").select("*").eq("id", id).maybeSingle();
  if (!draft) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const d = draft as { generation_request_id: string | null };
  const [{ data: checks }, { data: sources }] = await Promise.all([
    s.from("ai_quality_checks").select("*").eq("draft_type", "content").eq("draft_id", id).order("created_at"),
    d.generation_request_id ? s.from("ai_generation_sources").select("*").eq("generation_request_id", d.generation_request_id) : Promise.resolve({ data: [] }),
  ]);
  return NextResponse.json({ draft, checks: checks ?? [], sources: sources ?? [] });
}
