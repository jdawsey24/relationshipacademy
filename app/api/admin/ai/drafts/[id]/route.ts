import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { findDuplicateItems } from "@/lib/ai/dedupe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: full draft workspace — draft + quality findings + source snapshots + likely duplicates.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { data: draft } = await s.from("ai_item_drafts").select("*").eq("id", id).maybeSingle();
  if (!draft) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const d = draft as { item_text: string | null; competency_id: string | null; generation_request_id: string | null };
  const [{ data: checks }, { data: sources }, duplicates] = await Promise.all([
    s.from("ai_quality_checks").select("*").eq("draft_type", "item").eq("draft_id", id).order("created_at"),
    d.generation_request_id ? s.from("ai_generation_sources").select("*").eq("generation_request_id", d.generation_request_id) : Promise.resolve({ data: [] }),
    findDuplicateItems(d.item_text ?? "", { competencyId: d.competency_id ?? undefined, excludeDraftId: id }),
  ]);
  return NextResponse.json({ draft, checks: checks ?? [], sources: sources ?? [], duplicates });
}
