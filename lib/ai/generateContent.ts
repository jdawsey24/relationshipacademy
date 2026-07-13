import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderTemplate } from "@/lib/ai/templates";
import { getProvider } from "@/lib/ai/provider";
import { assembleContentContext } from "@/lib/ai/context";
import { persistChecks, runDeterministicContentChecks } from "@/lib/ai/quality";
import { estimateCost } from "@/lib/ai/types";
import { AiError } from "@/lib/ai/generateItem";
import type { ContentAssetType } from "@/lib/ai/contentTypes";

export type { ContentAssetType } from "@/lib/ai/contentTypes";

export interface GenerateContentInput {
  actor: string | null;
  asset_type: ContentAssetType;
  competency_id: string;
  parameters: Record<string, unknown>;
  includePractices?: boolean;
  includeInterventions?: boolean;
}

export interface GenerateContentResult {
  request_id: string;
  draft_id: string | null;
  validation_status: "valid" | "failed";
}

// Orchestrator for content (worksheet/lesson): request → approved context (+
// snapshots) → provider → validate → ai_content_drafts (staging) → quality
// checks. Never touches the Content Library; JSON-invalid → no draft row.
export async function generateContentDraft(input: GenerateContentInput): Promise<GenerateContentResult> {
  const s = getSupabaseAdminClient();
  const settings = await getAiSettings();
  const tpl = await getActiveTemplate(input.asset_type);
  if (!tpl) throw new AiError(`No approved ${input.asset_type} prompt template is configured.`, 500);
  const provider = getProvider(settings.provider);
  if (!provider.configured()) throw new AiError("The AI provider isn't configured (missing API key).", 503);

  const { contextText, sources } = await assembleContentContext({
    competency_id: input.competency_id,
    includePractices: input.includePractices,
    includeInterventions: input.includeInterventions,
  });

  const { data: reqRow, error: reqErr } = await s.from("ai_generation_requests").insert({
    user_id: input.actor, generation_type: input.asset_type,
    target_entity_type: "competency", target_entity_id: input.competency_id,
    prompt_template_id: tpl.id, prompt_template_version: tpl.version,
    provider: settings.provider, model: settings.model, parameters: input.parameters, status: "running",
  }).select("id").maybeSingle();
  if (reqErr || !reqRow) throw new AiError("Could not create generation request.", 502);
  const requestId = (reqRow as { id: string }).id;
  if (sources.length) await s.from("ai_generation_sources").insert(sources.map((src) => ({ generation_request_id: requestId, ...src })));

  const user = renderTemplate(tpl.user_template, { parameters: JSON.stringify(input.parameters), context: contextText });
  let output: Record<string, unknown>;
  let inTok = 0, outTok = 0;
  try {
    const res = await provider.generate({ system: tpl.system_instruction, user, schema: tpl.output_schema as object, model: settings.model, maxTokens: settings.output_limit, timeoutSeconds: settings.timeout_seconds });
    output = res.output as Record<string, unknown>; inTok = res.inputTokens; outTok = res.outputTokens;
  } catch (e) {
    await s.from("ai_generation_requests").update({ status: "failed", completed_at: new Date().toISOString(), error_message: e instanceof Error ? e.message.slice(0, 500) : "provider error" }).eq("id", requestId);
    throw new AiError("The AI provider call failed. No draft was created.", 502);
  }

  const valid = typeof output.title === "string" && (output.title as string).trim().length > 0;
  await s.from("ai_generation_outputs").insert({
    generation_request_id: requestId, output_type: input.asset_type, structured_output: output,
    validation_status: valid ? "valid" : "failed", validation_errors: valid ? null : { message: "Response did not match the content schema." },
  });
  const cost = estimateCost(inTok, outTok);
  if (!valid) {
    await s.from("ai_generation_requests").update({ status: "completed", completed_at: new Date().toISOString(), input_tokens: inTok, output_tokens: outTok, cost_usd: cost }).eq("id", requestId);
    return { request_id: requestId, draft_id: null, validation_status: "failed" };
  }

  const { data: draft, error: insErr } = await s.from("ai_content_drafts").insert({
    generation_request_id: requestId, asset_type: input.asset_type, competency_id: input.competency_id,
    temporary_title: output.title, draft_content: output, source_ids: sources.map((src) => src.source_entity_id).filter(Boolean),
    provider: settings.provider, model: settings.model, status: "draft", quality_status: "pending",
  }).select("id").maybeSingle();
  if (insErr || !draft) throw new AiError("Failed to save the draft.", 502);
  const draftId = (draft as { id: string }).id;

  const findings = runDeterministicContentChecks(input.asset_type, output, sources.length > 0);
  await persistChecks("content", draftId, requestId, findings);

  await s.from("ai_generation_requests").update({ status: "completed", completed_at: new Date().toISOString(), input_tokens: inTok, output_tokens: outTok, cost_usd: cost }).eq("id", requestId);
  return { request_id: requestId, draft_id: draftId, validation_status: "valid" };
}
