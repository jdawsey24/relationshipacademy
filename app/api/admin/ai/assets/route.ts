import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?target_type=&competency_id= → existing assets (id + label) for the Review
// Mode picker.
const MAP: Record<string, { table: string; pk: string; labelCol: string }> = {
  worksheet: { table: "studio_worksheets", pk: "worksheet_id", labelCol: "title" },
  lesson: { table: "studio_lessons", pk: "lesson_id", labelCol: "title" },
  practice: { table: "studio_practices", pk: "practice_id", labelCol: "name" },
  activity: { table: "studio_activities", pk: "activity_id", labelCol: "name" },
  conversation_guide: { table: "studio_conversation_guides", pk: "guide_id", labelCol: "title" },
  journal_prompt: { table: "studio_journal_prompts", pk: "prompt_id", labelCol: "title" },
  item: { table: "studio_assessment_items", pk: "item_id", labelCol: "item_text" },
};

export async function GET(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const u = new URL(request.url);
  const cfg = MAP[u.searchParams.get("target_type") ?? ""];
  if (!cfg) return NextResponse.json({ rows: [] });
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from(cfg.table).select(`${cfg.pk}, ${cfg.labelCol}`).order(cfg.pk).limit(200);
  if (error) return NextResponse.json({ rows: [] });
  const rows = ((data ?? []) as unknown[]).map((r) => { const x = r as Record<string, unknown>; return { id: String(x[cfg.pk]), label: String(x[cfg.labelCol] ?? "") }; });
  return NextResponse.json({ rows });
}
