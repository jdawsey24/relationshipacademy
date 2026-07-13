import { NextResponse } from "next/server";
import { requireAiOwner, preflightGeneration } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { assembleItemContext } from "@/lib/ai/context";
import { runAiItemReview, persistChecks } from "@/lib/ai/quality";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: run the AI-assisted quality review on a draft (construct overlap, social
// desirability, unsafe assumptions, phase leakage). On-demand from the queue.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const settings = await getAiSettings();
  const pre = await preflightGeneration(request, settings, "item_review");
  if (pre) return pre;

  const { id } = await params;
  const s = getSupabaseAdminClient();
  const { data: draft } = await s.from("ai_item_drafts").select("id, item_text, competency_id, generation_request_id").eq("id", id).maybeSingle();
  if (!draft) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const d = draft as { item_text: string | null; competency_id: string | null; generation_request_id: string | null };
  if (!d.competency_id || !d.item_text) return NextResponse.json({ error: "Draft is missing grounding." }, { status: 400 });

  try {
    const { contextText } = await assembleItemContext({ competency_id: d.competency_id });
    const findings = await runAiItemReview(d.item_text, contextText);
    await persistChecks("item", id, d.generation_request_id, findings.map((f) => ({ ...f, check_type: `ai:${f.check_type}` })));
    await audit({ actor: auth.user.email ?? null, action: "ai.item.review", target: id, metadata: { findings: findings.length } });
    return NextResponse.json({ findings });
  } catch {
    return NextResponse.json({ error: "AI review failed." }, { status: 502 });
  }
}
