import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderTemplate } from "@/lib/ai/templates";
import { getProvider } from "@/lib/ai/provider";
import { estimateCost } from "@/lib/ai/types";
import { aiConfigured } from "@/lib/studioAi";
import { fkGrade } from "@/lib/readability";
import { domainLabel } from "@/lib/studioAssessment";

// AI-assisted CONSUMER item wording. The scoring engine only ever reads
// `item_text` + the response — this field is display-only (what a respondent
// reads in the public quiz). So the model PROPOSES drafts; nothing is written to
// the canonical bank until the owner applies each row through the governed item
// PATCH. Polarity/meaning preservation is a hard rule so reverse-scored or
// negatively-worded items are never flipped.

export const CONSUMER_ITEM_TEXT_TYPE = "consumer_item_text";

export interface ConsumerTarget {
  item_id: string;
  item_text: string;        // professional/research wording (read-only source)
  consumer_item_text: string | null;
  domain: string | null;
  phase: string | null;
  reverse_scored: boolean;
}

export interface ConsumerDraftItem extends ConsumerTarget {
  proposed: string;         // AI-drafted consumer wording
  flags: string[];          // quality/safety flags — surfaced, never auto-blocking
}

export interface ConsumerDraftResult {
  drafts: ConsumerDraftItem[];
  model: string;
  request_id: string | null;
}

export class ConsumerTextError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

const OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      items: {
        type: "object", additionalProperties: false,
        properties: { item_id: { type: "string" }, consumer_text: { type: "string" } },
        required: ["item_id", "consumer_text"],
      },
    },
  },
  required: ["items"],
};

// Governed voice + hard guardrails. Overridable by an approved
// `consumer_item_text` prompt template (Prompt Templates), else this default.
const DEFAULT_SYSTEM = `You rewrite relationship self-assessment items into warm, plain-language "consumer" wording — what a general audience reads while taking the assessment. Each item is a statement the person rates on how often it is true in their relationship (a Never → Always frequency scale).

HARD RULES (never violate):
- PRESERVE THE MEANING AND DIRECTION EXACTLY. Never flip a positively- or negatively-worded item. If the source describes a problem or a deficit, the consumer version describes that SAME problem — do not soften it into a neutral or positive statement. Reverse-scored items MUST keep their original polarity.
- Keep it a single first-person statement ("I…", "My partner…", "We…") that the person rates on "how often is this true" — NOT a question.
- Plain, everyday language. Reading level around grade 6. No jargon; no clinical, therapy, diagnostic, or labeling terms.
- Concrete and behavioral. One idea per item. Keep length close to the source. Do not add, drop, or merge ideas.

Return one consumer_text for every item_id provided, unchanged item_ids.`;

const BANNED: RegExp[] = [
  /\bdiagnos/i, /\bdisorder\b/i, /\btherap(y|ist)\b/i, /\bclinical\b/i, /\bpatholog/i,
  /\bnarcissis/i, /\bgaslight/i, /\babus(e|ive)\b/i,
];

export function flagsFor(source: string, proposed: string): string[] {
  const p = proposed.trim();
  if (!p) return ["empty draft"];
  const flags: string[] = [];
  for (const re of BANNED) if (re.test(p)) flags.push(`clinical term /${re.source}/`);
  const g = fkGrade(p);
  if (g > 8) flags.push(`reading grade ${g.toFixed(1)} > 8`);
  if (p.endsWith("?")) flags.push("phrased as a question");
  const ratio = p.length / Math.max(source.length, 1);
  if (ratio > 2.2 || ratio < 0.4) flags.push("length differs a lot from source");
  return flags;
}

// Approved assembled membership items for an instrument, in position order.
export async function loadConsumerTargets(assessmentId: string, opts?: { itemIds?: string[]; includeExisting?: boolean }): Promise<ConsumerTarget[]> {
  const s = getSupabaseAdminClient();
  const { data: mem } = await s.from("studio_assessment_membership")
    .select("item_id, position").eq("assessment_id", assessmentId).eq("status", "approved").eq("source", "assembled").order("position");
  const order = new Map((mem ?? []).map((r, i) => [String((r as Record<string, unknown>).item_id), ((r as Record<string, unknown>).position as number) ?? i]));
  let ids = [...order.keys()];
  if (opts?.itemIds?.length) ids = ids.filter((id) => opts.itemIds!.includes(id));
  if (!ids.length) return [];
  const { data } = await s.from("studio_assessment_items")
    .select("item_id, item_text, consumer_item_text, domain, phase, reverse_scored").in("item_id", ids);
  let rows = (data ?? []) as Record<string, unknown>[];
  if (!opts?.includeExisting) rows = rows.filter((r) => !String((r.consumer_item_text as string) ?? "").trim());
  return rows
    .map((r) => ({
      item_id: String(r.item_id),
      item_text: String((r.item_text as string) ?? ""),
      consumer_item_text: (r.consumer_item_text as string) ?? null,
      domain: (r.domain as string) ?? null,
      phase: (r.phase as string) ?? null,
      reverse_scored: !!r.reverse_scored,
    }))
    .sort((a, b) => (order.get(a.item_id) ?? 0) - (order.get(b.item_id) ?? 0));
}

const CHUNK = 8;

export async function generateConsumerItemDrafts(input: { assessmentId: string; actor: string | null; itemIds?: string[]; includeExisting?: boolean }): Promise<ConsumerDraftResult> {
  if (!aiConfigured()) throw new ConsumerTextError("AI is not configured. Set ANTHROPIC_API_KEY.", 503);
  const settings = await getAiSettings();
  if (settings.kill_switch_active) throw new ConsumerTextError("AI generation is paused (kill switch is on).", 503);

  const targets = await loadConsumerTargets(input.assessmentId, { itemIds: input.itemIds, includeExisting: input.includeExisting });
  if (!targets.length) throw new ConsumerTextError("No items need consumer text.", 400);

  const provider = getProvider(settings.provider);
  if (!provider.configured()) throw new ConsumerTextError("The AI provider isn't configured (missing API key).", 503);
  const tpl = await getActiveTemplate(CONSUMER_ITEM_TEXT_TYPE);
  const system = tpl?.system_instruction?.trim() || DEFAULT_SYSTEM;

  // Governance/cost row (resilient — skipped if the table is absent).
  const s = getSupabaseAdminClient();
  let requestId: string | null = null;
  try {
    const { data } = await s.from("ai_generation_requests").insert({
      user_id: input.actor, generation_type: CONSUMER_ITEM_TEXT_TYPE,
      target_entity_type: "assessment", target_entity_id: input.assessmentId,
      prompt_template_id: tpl?.id ?? null, prompt_template_version: tpl?.version ?? null,
      provider: settings.provider, model: settings.model,
      parameters: { item_count: targets.length, include_existing: !!input.includeExisting },
      status: "running",
    }).select("id").maybeSingle();
    requestId = (data as { id?: string } | null)?.id ?? null;
  } catch { /* table absent → proceed without cost tracking */ }

  const proposedById = new Map<string, string>();
  let model = settings.model;
  let inTok = 0, outTok = 0;
  try {
    for (let i = 0; i < targets.length; i += CHUNK) {
      const batch = targets.slice(i, i + CHUNK);
      const payload = batch.map((t) => ({ item_id: t.item_id, item_text: t.item_text, domain: t.domain ? domainLabel(t.domain) : null, reverse_scored: t.reverse_scored }));
      const groundingJson = JSON.stringify({ items: payload }, null, 2);
      const user = tpl?.user_template
        ? renderTemplate(tpl.user_template, { items: groundingJson })
        : `Rewrite each item into consumer wording. Preserve meaning and direction exactly.\n\n${groundingJson}\n\nReturn consumer_text for every item_id.`;
      const res = await provider.generate({ system, user, schema: OUTPUT_SCHEMA, model: settings.model, maxTokens: 1800, timeoutSeconds: settings.timeout_seconds });
      model = res.model; inTok += res.inputTokens ?? 0; outTok += res.outputTokens ?? 0;
      const arr = (res.output as { items?: { item_id?: unknown; consumer_text?: unknown }[] })?.items ?? [];
      for (const o of arr) {
        const id = String(o.item_id ?? "").trim();
        const t = String(o.consumer_text ?? "").trim();
        if (id && t) proposedById.set(id, t);
      }
    }
  } catch (e) {
    if (requestId) { try { await s.from("ai_generation_requests").update({ status: "failed", completed_at: new Date().toISOString(), error_message: e instanceof Error ? e.message.slice(0, 500) : "provider error" }).eq("id", requestId); } catch { /* noop */ } }
    throw new ConsumerTextError(e instanceof Error ? e.message : "Generation failed.", 502);
  }

  if (requestId) { try { await s.from("ai_generation_requests").update({ status: "completed", completed_at: new Date().toISOString(), input_tokens: inTok, output_tokens: outTok, cost_usd: estimateCost(inTok, outTok) }).eq("id", requestId); } catch { /* noop */ } }

  const drafts: ConsumerDraftItem[] = targets.map((t) => {
    const proposed = proposedById.get(t.item_id) ?? "";
    return { ...t, proposed, flags: flagsFor(t.item_text, proposed) };
  });
  return { drafts, model, request_id: requestId };
}
