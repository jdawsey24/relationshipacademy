import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderTemplate } from "@/lib/ai/templates";
import { getProvider } from "@/lib/ai/provider";
import { assembleContentContext } from "@/lib/ai/context";
import { estimateCost } from "@/lib/ai/types";
import { AiError } from "@/lib/ai/generateItem";

// Review Mode — reviews an EXISTING content/asset record across the spec's review
// categories and stores findings in ai_content_reviews. It NEVER edits or applies
// revisions; it only reports. Grounded in the asset's competency context.

interface ReviewFinding {
  category: string; severity: string; finding: string; evidence: string;
  recommended_revision: string; requires_owner_decision: boolean; requires_theoretical_review: boolean;
}

const TARGETS: Record<string, { table: string; pk: string; labelCol: string; competencyCol: string }> = {
  worksheet: { table: "studio_worksheets", pk: "worksheet_id", labelCol: "title", competencyCol: "competency_id" },
  lesson: { table: "studio_lessons", pk: "lesson_id", labelCol: "title", competencyCol: "competency_ids" },
  practice: { table: "studio_practices", pk: "practice_id", labelCol: "name", competencyCol: "competency_id" },
  activity: { table: "studio_activities", pk: "activity_id", labelCol: "name", competencyCol: "competency_id" },
  conversation_guide: { table: "studio_conversation_guides", pk: "guide_id", labelCol: "title", competencyCol: "competency_id" },
  journal_prompt: { table: "studio_journal_prompts", pk: "prompt_id", labelCol: "title", competencyCol: "competency_id" },
  item: { table: "studio_assessment_items", pk: "item_id", labelCol: "item_text", competencyCol: "competency_id" },
};

export function isReviewTarget(t: string): boolean { return t in TARGETS; }

export async function reviewExistingAsset(input: { target_type: string; target_id: string; actor: string | null }): Promise<{ review_id: string; findings: ReviewFinding[] }> {
  const cfg = TARGETS[input.target_type];
  if (!cfg) throw new AiError("Unknown review target type.");
  const s = getSupabaseAdminClient();
  const settings = await getAiSettings();
  const tpl = await getActiveTemplate("review_existing");
  if (!tpl) throw new AiError("No approved review template is configured.", 500);
  const provider = getProvider(settings.provider);
  if (!provider.configured()) throw new AiError("The AI provider isn't configured.", 503);

  const { data: row } = await s.from(cfg.table).select("*").eq(cfg.pk, input.target_id).maybeSingle();
  if (!row) throw new AiError("Asset not found.", 404);
  const r = row as Record<string, unknown>;
  const label = String(r[cfg.labelCol] ?? "");
  const content = input.target_type === "item" ? label : `${label}\n${JSON.stringify(r.detail ?? {}).slice(0, 5000)}`;
  const compRaw = String(r[cfg.competencyCol] ?? "");
  const competencyId = compRaw.split(/[;,\s]+/).filter(Boolean)[0] ?? "";

  let contextText = "";
  const sources: { source_entity_id: string | null }[] = [];
  if (competencyId) {
    try { const ctx = await assembleContentContext({ competency_id: competencyId }); contextText = ctx.contextText; sources.push(...ctx.sources); } catch { /* competency retired/missing → review without context */ }
  }

  const { data: reqRow } = await s.from("ai_generation_requests").insert({
    user_id: input.actor, generation_type: "review_existing", target_entity_type: input.target_type, target_entity_id: input.target_id,
    prompt_template_id: tpl.id, prompt_template_version: tpl.version, provider: settings.provider, model: settings.model, status: "running",
  }).select("id").maybeSingle();
  const requestId = (reqRow as { id: string } | null)?.id ?? null;

  let findings: ReviewFinding[] = [];
  let inTok = 0, outTok = 0;
  try {
    const user = renderTemplate(tpl.user_template, { target_type: input.target_type, target_id: input.target_id, content, context: contextText });
    const res = await provider.generate({ system: tpl.system_instruction, user, schema: tpl.output_schema as object, model: settings.model, maxTokens: 4000, timeoutSeconds: settings.timeout_seconds });
    findings = ((res.output as { findings?: ReviewFinding[] }).findings) ?? [];
    inTok = res.inputTokens; outTok = res.outputTokens;
  } catch (e) {
    if (requestId) await s.from("ai_generation_requests").update({ status: "failed", completed_at: new Date().toISOString(), error_message: e instanceof Error ? e.message.slice(0, 500) : "review error" }).eq("id", requestId);
    throw new AiError("The review call failed.", 502);
  }

  const { data: review } = await s.from("ai_content_reviews").insert({
    generation_request_id: requestId, target_type: input.target_type, target_id: input.target_id, findings, reviewer_id: input.actor,
  }).select("id").maybeSingle();

  if (requestId) await s.from("ai_generation_requests").update({ status: "completed", completed_at: new Date().toISOString(), input_tokens: inTok, output_tokens: outTok, cost_usd: estimateCost(inTok, outTok) }).eq("id", requestId);
  return { review_id: (review as { id: string } | null)?.id ?? "", findings };
}
