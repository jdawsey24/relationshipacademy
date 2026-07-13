import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderTemplate } from "@/lib/ai/templates";
import { getProvider } from "@/lib/ai/provider";
import { assembleItemContext } from "@/lib/ai/context";
import { persistChecks, runDeterministicItemChecks } from "@/lib/ai/quality";
import { estimateCost } from "@/lib/ai/types";

export class AiError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

export interface GenerateItemsInput {
  actor: string | null;
  competency_id: string;
  assessment_id?: string;
  count: number;
  parameters: Record<string, unknown>; // audience/phase/domain/item_type/response_model/perspective/time_frame/reading_level/reverse_allowed/phase_anchored_allowed/structural_context
  includeIncomplete?: boolean;
  includeApprovedItems?: boolean;
  excludeSourceIds?: string[];
}

export interface GenerateItemsResult {
  request_id: string;
  draft_ids: string[];
  validation_status: "valid" | "failed";
}

interface GenItem {
  item_text?: string;
  reverse_candidate?: boolean;
  behavioral_indicator_id?: string;
  face_validity_rationale?: string;
  evidence_strength?: string;
}

// Orchestrator: request → approved context (+ snapshots) → provider → validate →
// ai_item_drafts (staging) → deterministic quality checks. Never touches the
// canonical bank; a JSON-invalid response produces NO draft rows.
export async function generateAssessmentItemsStaged(input: GenerateItemsInput): Promise<GenerateItemsResult> {
  const s = getSupabaseAdminClient();
  const settings = await getAiSettings();
  const tpl = await getActiveTemplate("assessment_item");
  if (!tpl) throw new AiError("No approved assessment-item prompt template is configured.", 500);
  const provider = getProvider(settings.provider);
  if (!provider.configured()) throw new AiError("The AI provider isn't configured (missing API key).", 503);

  const { contextText, sources } = await assembleItemContext({
    competency_id: input.competency_id,
    includeIncomplete: input.includeIncomplete,
    includeApprovedItems: input.includeApprovedItems,
    excludeSourceIds: input.excludeSourceIds,
  });

  // Create the request row + attach immutable source snapshots.
  const { data: reqRow, error: reqErr } = await s.from("ai_generation_requests").insert({
    user_id: input.actor, generation_type: "assessment_item",
    target_entity_type: "competency", target_entity_id: input.competency_id,
    prompt_template_id: tpl.id, prompt_template_version: tpl.version,
    provider: settings.provider, model: settings.model,
    parameters: { ...input.parameters, count: input.count, assessment_id: input.assessment_id ?? null },
    status: "running",
  }).select("id").maybeSingle();
  if (reqErr || !reqRow) throw new AiError("Could not create generation request.", 502);
  const requestId = (reqRow as { id: string }).id;
  if (sources.length) {
    await s.from("ai_generation_sources").insert(sources.map((src) => ({ generation_request_id: requestId, ...src })));
  }

  // Provider call.
  const n = Math.min(20, Math.max(1, input.count || 8));
  const user = renderTemplate(tpl.user_template, { count: String(n), parameters: JSON.stringify(input.parameters), context: contextText });
  let output: unknown;
  let inTok = 0, outTok = 0;
  try {
    const res = await provider.generate({
      system: tpl.system_instruction, user, schema: tpl.output_schema as object,
      model: settings.model, maxTokens: settings.output_limit, timeoutSeconds: settings.timeout_seconds,
    });
    output = res.output; inTok = res.inputTokens; outTok = res.outputTokens;
  } catch (e) {
    await s.from("ai_generation_requests").update({ status: "failed", completed_at: new Date().toISOString(), error_message: e instanceof Error ? e.message.slice(0, 500) : "provider error" }).eq("id", requestId);
    throw new AiError("The AI provider call failed. No draft was created.", 502);
  }

  // Validate + record raw output. Invalid → NO drafts.
  const items = (output as { items?: unknown }).items;
  const valid = Array.isArray(items) && items.every((it) => it && typeof (it as GenItem).item_text === "string" && (it as GenItem).item_text!.trim().length > 0);
  await s.from("ai_generation_outputs").insert({
    generation_request_id: requestId, output_type: "assessment_item",
    structured_output: output as object, validation_status: valid ? "valid" : "failed",
    validation_errors: valid ? null : { message: "Response did not match the item schema." },
  });
  const cost = estimateCost(inTok, outTok);
  if (!valid) {
    await s.from("ai_generation_requests").update({ status: "completed", completed_at: new Date().toISOString(), input_tokens: inTok, output_tokens: outTok, cost_usd: cost }).eq("id", requestId);
    return { request_id: requestId, draft_ids: [], validation_status: "failed" };
  }

  // Stage drafts.
  const reverseAllowed = input.parameters.reverse_allowed !== false;
  const params = input.parameters;
  const rows = (items as GenItem[]).slice(0, n).map((it) => {
    const isReverse = !!it.reverse_candidate && reverseAllowed;
    return {
      generation_request_id: requestId,
      assessment_id: input.assessment_id ?? null,
      competency_id: input.competency_id,
      behavioral_indicator_id: it.behavioral_indicator_id ?? null,
      item_type: isReverse ? "Reverse-scored candidate" : (typeof params.item_type === "string" ? params.item_type : "Direct behavior-frequency"),
      item_text: it.item_text!.trim(),
      response_model_id: typeof params.response_model === "string" ? params.response_model : "RM-FREQ-001",
      perspective: typeof params.perspective === "string" ? params.perspective : "Self",
      time_frame: typeof params.time_frame === "string" ? params.time_frame : "General",
      reverse_candidate: isReverse,
      phase_mapping: params.phase_anchored_allowed && typeof params.phase === "string" ? params.phase : null,
      structural_context_filter: typeof params.structural_context === "string" ? params.structural_context : null,
      reading_level: typeof params.reading_level === "string" ? params.reading_level : "Grade 5",
      face_validity_rationale: it.face_validity_rationale ?? null,
      evidence_strength: it.evidence_strength ?? null,
      source_ids: sources.map((src) => src.source_entity_id).filter(Boolean),
      provider: settings.provider, model: settings.model,
      status: "draft", quality_status: "pending",
    };
  });
  const { data: inserted, error: insErr } = await s.from("ai_item_drafts").insert(rows).select("id, item_text, reverse_candidate, behavioral_indicator_id");
  if (insErr || !inserted) throw new AiError("Failed to save drafts.", 502);

  // Deterministic quality checks per draft.
  for (const r of inserted as { id: string; item_text: string; reverse_candidate: boolean; behavioral_indicator_id: string | null }[]) {
    const findings = runDeterministicItemChecks({ item_text: r.item_text, reverse_candidate: r.reverse_candidate, behavioral_indicator_id: r.behavioral_indicator_id, audience: typeof params.audience === "string" ? params.audience : null });
    await persistChecks("item", r.id, requestId, findings);
  }

  await s.from("ai_generation_requests").update({ status: "completed", completed_at: new Date().toISOString(), input_tokens: inTok, output_tokens: outTok, cost_usd: cost }).eq("id", requestId);
  return { request_id: requestId, draft_ids: (inserted as { id: string }[]).map((r) => r.id), validation_status: "valid" };
}
