import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderPrompt, unresolvedPlaceholders } from "@/lib/ai/templates";
import { getProvider } from "@/lib/ai/provider";
import { estimateCost } from "@/lib/ai/types";
import { checkRuntime, DEFAULT_WPM } from "@/lib/contentEngine/scriptBuilder/analysis";

// Staged generation. Five to six model calls per package, never one.
//
// WHY STAGED. A single call that produces a whole package hides its reasoning:
// the framework mapping, the angle and the wording all collapse into one output
// that can only be accepted or rejected whole. Staging puts an owner gate after
// the mapping and after the angle, so by the time words are written the
// framework decisions are already settled and reviewed.
//
// TEMPLATE GOVERNANCE. Every stage resolves an APPROVED prompt template.
// getActiveTemplate returns only status='approved', so an unapproved template
// stops generation with a clear message rather than quietly using a draft.

export class ScriptBuilderError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = "ScriptBuilderError";
  }
}

export const STAGE_TEMPLATES = {
  angles: "ce_script_angles",
  script: "ce_script_draft",
  equivalence: "ce_script_equivalence",
  packaging: "ce_script_packaging",
} as const;

export type StageName = keyof typeof STAGE_TEMPLATES;

/** Angle count the brief stage asks for. Not schema-enforceable — see ANGLES_SCHEMA. */
export const ANGLE_MIN = 3;
export const ANGLE_MAX = 5;

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

// Every generation schema carries a conflict channel. When the model believes
// the approved mapping is wrong it must SAY SO and stop — it may never quietly
// write around the disagreement (owner revision: flag, never self-correct).
const CONFLICT = {
  type: "object",
  additionalProperties: false,
  properties: {
    detected: { type: "boolean" },
    conflict_type: { type: "string" },
    explanation: { type: "string" },
  },
  required: ["detected"],
} as const;

export const ANGLES_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    angles: {
      // Neither minItems above 1 nor maxItems is supported by provider
      // structured output; the 3-5 range is enforced in the prompt and checked
      // after the call.
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          premise: { type: "string" },
          hook: { type: "string" },
          audience_promise: { type: "string" },
          why_different: { type: "string" },
          risk_notes: { type: "string" },
        },
        required: ["label", "premise", "hook", "audience_promise", "why_different"],
      },
    },
    conflict: CONFLICT,
  },
  required: ["angles"],
} as const;

export const SCRIPT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    hook: { type: "string" },
    body: { type: "string" },
    cta: { type: "string" },
    conflict: CONFLICT,
  },
  required: ["hook", "body", "cta"],
} as const;

export const EQUIVALENCE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    lesson_match: { type: "boolean" },
    reward_match: { type: "boolean" },
    hook_match: { type: "boolean" },
    cta_match: { type: "boolean" },
    notes: { type: "string" },
  },
  required: ["lesson_match", "reward_match", "hook_match", "cta_match", "notes"],
} as const;

export const PACKAGING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    on_screen_caption: { type: "string" },
    post_caption: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
    hashtags: { type: "array", items: { type: "string" } },
    cta_text: { type: "string" },
    visual_notes: { type: "array", items: { type: "string" } },
    conflict: CONFLICT,
  },
  required: ["on_screen_caption", "post_caption", "cta_text"],
} as const;

// ---------------------------------------------------------------------------
// Stage runner
// ---------------------------------------------------------------------------

export interface StageResult<T> {
  output: T;
  requestId: string;
  costUsd: number;
}

interface RunStageOpts {
  stage: StageName;
  actor: string | null;
  briefId: string;
  competencyId: string | null;
  vars: Record<string, string>;
  schema: object;
}

/**
 * One stage: resolve an approved template, log a request, call the provider,
 * record the output, close the request. A provider failure marks the request
 * failed and throws — it never returns a partial result that a later stage
 * could mistake for success.
 */
export async function runStage<T>(opts: RunStageOpts): Promise<StageResult<T>> {
  const s = getSupabaseAdminClient();
  const settings = await getAiSettings();
  const generationType = STAGE_TEMPLATES[opts.stage];

  if (settings.kill_switch_active) {
    throw new ScriptBuilderError("AI generation is paused (kill switch is on).", 503);
  }

  const tpl = await getActiveTemplate(generationType);
  if (!tpl) {
    throw new ScriptBuilderError(
      `No APPROVED "${generationType}" prompt template exists. Seed and approve the templates before generating.`,
      412,
    );
  }

  const provider = getProvider(settings.provider);
  if (!provider.configured()) {
    throw new ScriptBuilderError("The AI provider is not configured (missing API key).", 503);
  }

  // BOTH halves are rendered — ce_script_draft carries its word and runtime
  // targets in the SYSTEM instruction, and an unrendered one silently drops them.
  const prompt = renderPrompt(tpl, opts.vars);

  // A leftover {{placeholder}} means the template asked for a variable this stage
  // does not supply. It would not throw — the model would read literal braces and
  // quietly lose whatever the instruction was worth. Fail before logging a
  // request, so this never reports as a provider failure it is not.
  const unresolved = [
    ...unresolvedPlaceholders(prompt.system),
    ...unresolvedPlaceholders(prompt.user),
  ];
  if (unresolved.length) {
    throw new ScriptBuilderError(
      `The "${generationType}" template references ${[...new Set(unresolved)].join(", ")}, ` +
      `which the ${opts.stage} stage does not supply. Fix the template or the stage before generating.`,
      500,
    );
  }

  const { data: reqRow } = await s.from("ai_generation_requests").insert({
    user_id: opts.actor,
    generation_type: generationType,
    target_entity_type: "content_brief",
    target_entity_id: opts.briefId,
    prompt_template_id: tpl.id,
    prompt_template_version: tpl.version,
    provider: settings.provider,
    model: settings.model,
    parameters: { brief_id: opts.briefId, competency_id: opts.competencyId, stage: opts.stage },
    status: "running",
  }).select("id").maybeSingle();

  if (!reqRow) throw new ScriptBuilderError("Could not create the generation request.", 502);
  const requestId = (reqRow as { id: string }).id;

  let output: T;
  let inTok = 0, outTok = 0;
  try {
    const res = await provider.generate({
      system: prompt.system,
      user: prompt.user,
      schema: opts.schema,
      model: settings.model,
      maxTokens: settings.output_limit,
      timeoutSeconds: settings.timeout_seconds,
    });
    output = res.output as T;
    inTok = res.inputTokens;
    outTok = res.outputTokens;
  } catch (e) {
    if (e instanceof ScriptBuilderError) throw e;
    await s.from("ai_generation_requests").update({
      status: "failed",
      completed_at: new Date().toISOString(),
      error_message: e instanceof Error ? e.message.slice(0, 500) : "provider error",
    }).eq("id", requestId);
    throw new ScriptBuilderError(`The ${opts.stage} stage failed at the provider. Nothing was saved.`, 502);
  }

  await s.from("ai_generation_outputs").insert({
    generation_request_id: requestId,
    output_type: generationType,
    structured_output: output as unknown as Record<string, unknown>,
    validation_status: "valid",
  });

  const costUsd = estimateCost(inTok, outTok);
  await s.from("ai_generation_requests").update({
    status: "completed", completed_at: new Date().toISOString(),
    input_tokens: inTok, output_tokens: outTok, cost_usd: costUsd,
  }).eq("id", requestId);

  return { output, requestId, costUsd };
}

// ---------------------------------------------------------------------------
// Conflict handling (owner revision: flag, never self-correct)
// ---------------------------------------------------------------------------

interface ConflictShape {
  conflict?: { detected?: boolean; conflict_type?: string; explanation?: string };
}

/** Every stage schema carries the conflict channel, but each stage's own result
 *  type describes only its payload — so narrow here rather than widening four
 *  unrelated generics to know about conflicts. */
function conflictOf(output: unknown): ConflictShape["conflict"] {
  return (output as ConflictShape | null)?.conflict;
}

/**
 * If a stage reports a conflict with the approved mapping, record it and stop.
 * The engine does not adjust the mapping, does not pick a different competency,
 * and does not proceed with a caveat — a disagreement about the framework is an
 * owner decision, and quietly resolving it is how confidently wrong content
 * gets made.
 */
export async function haltOnConflict(
  output: unknown,
  ctx: { requestId: string; bridgeId: string; approvedMapping: Record<string, unknown>; requested: string },
): Promise<void> {
  const c = conflictOf(output);
  if (!c?.detected) return;

  const s = getSupabaseAdminClient();
  await s.from("ce_generation_conflicts").insert({
    generation_request_id: ctx.requestId,
    bridge_id: ctx.bridgeId,
    conflict_type: c.conflict_type ?? "mapping_disagreement",
    detected_by: "model",
    approved_mapping: ctx.approvedMapping,
    requested_content: ctx.requested.slice(0, 2000),
    explanation: c.explanation ?? "The model reported a conflict without an explanation.",
    resolution: "unresolved",
  });

  throw new ScriptBuilderError(
    `Generation stopped: the model disagrees with the approved mapping. ` +
    `${c.explanation ?? ""} This is recorded for your decision — the engine will not resolve it on its own.`,
    409,
  );
}

// ---------------------------------------------------------------------------
// Script measurement
// ---------------------------------------------------------------------------

export function measureScript(
  script: { hook?: string | null; body: string; cta?: string | null },
  targetSeconds: number,
  wpm = DEFAULT_WPM,
) {
  const spoken = [script.hook, script.body, script.cta].filter(Boolean).join(" ");
  const r = checkRuntime(spoken, targetSeconds, wpm);
  return {
    word_count: r.words,
    estimated_runtime_seconds: r.seconds,
    runtime_within_target: r.withinTarget,
  };
}
