import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderPrompt, unresolvedPlaceholders } from "@/lib/ai/templates";
import { getProvider } from "@/lib/ai/provider";
import { estimateCost } from "@/lib/ai/types";
import { loadCompetencyChoices } from "@/lib/contentEngine/retrieval";
import { worthRaising } from "@/lib/contentIntelligence/language";
import { addMessage, checkCost, ownerMessageIds } from "@/lib/contentIntelligence/conversation";
import { inferField, readBrief, type BriefField } from "@/lib/contentIntelligence/brief";
import { recordSuggestions } from "@/lib/contentIntelligence/lenses";

// One turn of the conversation.
//
// WHAT THE MODEL DOES AND DOES NOT DECIDE.
//
// It reflects the argument back, asks at most one question, and proposes at
// most two lenses. It does NOT decide what is worth challenging in your language —
// that is computed deterministically before the call and handed to it, so the
// rule that "some women" is an audience reference rather than a group claim
// cannot be lost to prompt drift.
//
// It does not decide the thesis either. It proposes one; the brief's guard
// decides whether that may be stored, and refuses when it did not come from
// something you said.

export class TurnError extends Error {
  constructor(message: string, public status = 400) { super(message); this.name = "TurnError"; }
}

export const TURN_TEMPLATE = "ci_studio_turn";

/**
 * At most two directions reach the conversation.
 *
 * Enforced here rather than in the prompt because the prompt does not hold it.
 * Identical input produced three lenses on one run and two on the next; a limit
 * that survives only when the model happens to comply is not a limit. The model
 * still weighs the whole set — it just cannot surface more than two of them.
 *
 * Anthropic's structured output rejects maxItems, so the schema cannot say this.
 */
export const MAX_LENSES = 2;

/**
 * The visible reply. The model often ends the reflection with its question and
 * then repeats it in `question`, which reads as a stutter on screen. One copy.
 */
export function composeReply(reflection: string, question?: string): string {
  const r = (reflection ?? "").trim();
  const q = (question ?? "").trim();
  if (!q) return r;
  const norm = (x: string) => x.toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ?]/g, "");
  if (norm(r).includes(norm(q))) return r;
  return `${r}\n\n${q}`;
}

export const TURN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflection: { type: "string" },
    question: { type: "string" },
    thesis: { type: "string" },
    audience: { type: "string" },
    lenses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          competency_id: { type: "string" },
          plain_summary: { type: "string" },
          why_it_fits: { type: "string" },
          what_it_illuminates: { type: "string" },
          how_it_changes_the_lesson: { type: "string" },
          strength: { type: "string", enum: ["strong", "moderate", "weak", "forced"] },
          relation: { type: "string", enum: ["direct_application", "related_lens"] },
        },
        required: ["competency_id", "plain_summary", "why_it_fits", "strength", "relation"],
      },
    },
  },
  required: ["reflection"],
} as const;

interface TurnOutput {
  reflection: string;
  question?: string;
  thesis?: string;
  audience?: string;
  lenses?: {
    competency_id: string; plain_summary: string; why_it_fits: string;
    what_it_illuminates?: string; how_it_changes_the_lesson?: string;
    strength: string; relation: "direct_application" | "related_lens";
  }[];
}

/** Everything the model is allowed to see. Assembled explicitly. */
async function buildContext(conversationId: string) {
  const s = getSupabaseAdminClient();
  const [{ data: msgs }, brief] = await Promise.all([
    s.from("ci_messages").select("role, content").eq("conversation_id", conversationId).order("seq"),
    readBrief(conversationId),
  ]);
  const transcript = (msgs ?? [])
    .map((m) => `${(m as { role: string }).role === "owner" ? "OWNER" : "STUDIO"}: ${(m as { content: string }).content}`)
    .join("\n\n");
  const decided = brief.filter((b) => b.value).map((b) => `${b.field}: ${b.value}`).join("\n") || "(nothing yet)";
  return { transcript, decided };
}

/**
 * Competencies the model may choose from — the closed canonical set, with each
 * one's approval state attached so a suggestion resting on working material can
 * be labelled rather than silently treated as settled architecture.
 */
async function lensChoices(): Promise<string> {
  const s = getSupabaseAdminClient();
  const choices = await loadCompetencyChoices(200);
  const { data: kb } = await s.from("kb_competencies")
    .select("code, framework_approval_state").eq("kind", "competency");
  const state = new Map((kb ?? []).map((k) => [(k as { code: string }).code, (k as { framework_approval_state: string }).framework_approval_state]));
  return choices
    .map((c) => `${c.competency_id} | ${c.name} | ${c.phase} | ${c.domain}${
      state.get(c.competency_id) === "in_review" ? " | WORKING DRAFT, not approved" : ""}`)
    .join("\n");
}

export async function runTurn(input: {
  conversationId: string;
  content: string;
  actor: string | null;
}) {
  const s = getSupabaseAdminClient();

  // Cost first. A hard stop saves everything and explains what is unfinished.
  const cost = await checkCost(input.conversationId);
  if (!cost.mayProceed) {
    await addMessage({
      conversationId: input.conversationId, role: "owner", content: input.content,
    });
    return { blocked: true as const, notice: cost.notice };
  }

  const ownerMessageId = await addMessage({
    conversationId: input.conversationId, role: "owner", content: input.content,
  });

  // Deterministic, before the model. The audience rule lives here, not in a prompt.
  const raised = worthRaising(input.content);

  const settings = await getAiSettings();
  const tpl = await getActiveTemplate(TURN_TEMPLATE);
  if (!tpl) {
    throw new TurnError(
      `No approved "${TURN_TEMPLATE}" prompt template exists. Seed and approve it before the Studio can reply.`,
      412,
    );
  }
  const provider = getProvider(settings.provider);
  if (!provider.configured()) throw new TurnError("The AI provider is not configured.", 503);

  const { transcript, decided } = await buildContext(input.conversationId);
  const prompt = renderPrompt(tpl, {
    transcript,
    decided,
    competency_choices: await lensChoices(),
    // What the Studio may raise, already decided. Empty means raise nothing.
    language_notes: raised.length
      ? raised.map((r) => `- ${r.prompt} (in: "${r.excerpt.slice(0, 90)}")`).join("\n")
      : "(nothing to raise — do not invent a concern)",
  });

  const unresolved = [...unresolvedPlaceholders(prompt.system), ...unresolvedPlaceholders(prompt.user)];
  if (unresolved.length) {
    throw new TurnError(`The turn template references ${unresolved.join(", ")}, which this stage does not supply.`, 500);
  }

  const { data: req } = await s.from("ai_generation_requests").insert({
    user_id: input.actor, generation_type: TURN_TEMPLATE,
    target_entity_type: "ci_conversation", target_entity_id: input.conversationId,
    prompt_template_id: tpl.id, prompt_template_version: tpl.version,
    provider: settings.provider, model: settings.model,
    conversation_id: input.conversationId, stage_kind: "turn",
    parameters: {}, status: "running",
  }).select("id").maybeSingle();
  const requestId = (req as { id: string } | null)?.id ?? null;

  let out: TurnOutput;
  let usd = 0;
  try {
    const res = await provider.generate({
      system: prompt.system, user: prompt.user, schema: TURN_SCHEMA as unknown as object,
      model: settings.model, maxTokens: settings.output_limit, timeoutSeconds: settings.timeout_seconds,
    });
    out = res.output as TurnOutput;
    usd = estimateCost(res.inputTokens, res.outputTokens);
    if (requestId) {
      await s.from("ai_generation_requests").update({
        status: "completed", completed_at: new Date().toISOString(),
        input_tokens: res.inputTokens, output_tokens: res.outputTokens, cost_usd: usd,
      }).eq("id", requestId);
    }
  } catch (e) {
    if (requestId) {
      await s.from("ai_generation_requests").update({
        status: "failed", completed_at: new Date().toISOString(),
        error_message: e instanceof Error ? e.message.slice(0, 400) : "provider error",
      }).eq("id", requestId);
    }
    throw new TurnError("The reply failed. Your message is saved — try again.", 502);
  }

  const reply = composeReply(out.reflection, out.question);
  await addMessage({
    conversationId: input.conversationId, role: "assistant", content: reply,
    kind: out.question ? "question" : "reflection",
    costUsd: usd, generationRequestId: requestId,
  });

  // Brief inferences go through the guard, which may refuse or downgrade them
  // to suggestions. The model's proposal is never authoritative.
  const owners = await ownerMessageIds(input.conversationId);
  const inferred: Record<string, string> = {};
  for (const [field, value] of [["thesis", out.thesis], ["audience", out.audience]] as [BriefField, string | undefined][]) {
    if (!value?.trim()) continue;
    const r = await inferField({
      conversationId: input.conversationId, field, value,
      derivedFromMessageIds: [ownerMessageId], ownerMessageIds: owners,
      rationale: "From what you just said.",
    });
    inferred[field] = r.written ? "written" : r.suggested ? "suggested" : (r.rejected ?? "unchanged");
  }

  // Lenses are exploratory. Validation happens here; nothing reaches the bridge
  // table until one is selected.
  let lenses: unknown[] = [];
  if (out.lenses?.length) {
    lenses = await recordSuggestions(input.conversationId, out.lenses.slice(0, MAX_LENSES).map((l) => ({
      competency_id: l.competency_id, phase_id: null, domain_id: null,
      plain_summary: l.plain_summary, why_it_fits: l.why_it_fits,
      what_it_illuminates: l.what_it_illuminates, how_it_changes_the_lesson: l.how_it_changes_the_lesson,
      strength: l.strength, relation: l.relation,
    })));
  }

  return { blocked: false as const, reply, inferred, lenses, costUsd: usd };
}
