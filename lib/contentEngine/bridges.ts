import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";
import { getActiveTemplate, renderPrompt, unresolvedPlaceholders } from "@/lib/ai/templates";
import { computeEligibility, validateMapping } from "@/lib/contentEngine/mappingValidation";
import { getProvider } from "@/lib/ai/provider";
import { estimateCost } from "@/lib/ai/types";
import { loadCompetencyChoices, untrustedTrendBlock } from "@/lib/contentEngine/retrieval";
import { BRIDGE_MAX, BRIDGE_MIN, BRIDGE_TYPES, type BridgeCandidate } from "@/lib/contentEngine/types";

// Relational bridge generation.
//
// The reasoning sequence the owner specified:
//   trending subject -> affected population -> relational consequence
//   -> legitimate RLC connection -> useful content angle
//
// The model proposes; it does NOT decide the framework. It must pick a
// competency_id from a closed set fetched from canon, and the FK on
// ce_relational_bridges rejects anything outside that set even if the model
// ignores the instruction. A bridge it judges to be a stretch must be marked
// is_forced rather than quietly dropped — the owner wants to see the rejects and
// why, not just the survivors.

export class BridgeError extends Error {
  constructor(message: string, readonly status = 500) { super(message); }
}

const BRIDGE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["bridges"],
  properties: {
    bridges: {
      type: "array",
      // The provider's structured output supports neither minItems above 1 nor
      // maxItems at all, so the 3-5 range cannot be a schema constraint. It is
      // stated in the prompt and checked after the call — the schema guarantees
      // SHAPE, the prompt and code guarantee COUNT.
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "bridge_type", "affected_population", "relational_consequence",
          "angle", "competency_id", "rationale", "is_forced", "status",
        ],
        properties: {
          bridge_type: { type: "string", enum: [...BRIDGE_TYPES] },
          affected_population: { type: "string" },
          relational_consequence: { type: "string" },
          angle: { type: "string" },
          competency_id: { type: "string" },
          rationale: { type: "string" },
          is_forced: { type: "boolean" },
          // Graded, not binary. A weak or forced bridge stays visible for review
          // and is never eligible for drafting — "visible" and "accepted for
          // use" are different states, and collapsing them is how a stretch
          // becomes content.
          status: { type: "string", enum: ["strong", "moderate", "weak", "forced", "rejected"] },
        },
      },
    },
  },
} as const;

export interface GenerateBridgesInput {
  candidateId: string;
  actor: string | null;
}

export interface GenerateBridgesResult {
  request_id: string;
  bridges: BridgeCandidate[];
  rejected: { candidate: Partial<BridgeCandidate>; reason: string }[];
  strippedInjection: boolean;
}

export async function generateBridges(input: GenerateBridgesInput): Promise<GenerateBridgesResult> {
  const s = getSupabaseAdminClient();

  const { data: cand } = await s
    .from("ce_trend_candidates")
    .select("id, canonical_name, raw_input, exact_phrase, community_seen")
    .eq("id", input.candidateId)
    .maybeSingle();
  if (!cand) throw new BridgeError("Trend candidate not found.", 404);

  const { data: obs } = await s
    .from("ce_trend_observations")
    .select("source_url")
    .eq("candidate_id", input.candidateId);
  const citations = (obs ?? [])
    .map((o) => (o as { source_url: string | null }).source_url)
    .filter((u): u is string => !!u);

  const settings = await getAiSettings();
  const tpl = await getActiveTemplate("ce_bridges");
  if (!tpl) throw new BridgeError("No approved 'ce_bridges' prompt template is configured.", 503);
  const provider = getProvider(settings.provider);
  if (!provider.configured()) throw new BridgeError("The AI provider isn't configured.", 503);

  const c = cand as { canonical_name: string; raw_input: string | null; exact_phrase: string | null; community_seen: string | null };
  const trend = untrustedTrendBlock({
    canonical_name: c.canonical_name,
    raw_input: c.raw_input,
    exact_phrase: c.exact_phrase,
    citations,
  });

  // The closed set. The model chooses FROM this; it cannot add to it.
  const choices = await loadCompetencyChoices();
  const choiceLines = choices
    .map((x) => `${x.competency_id} | ${x.name} | ${x.phase} | ${x.domain}`)
    .join("\n");

  // BOTH halves are rendered. The system instruction used to go to the provider
  // raw, so any placeholder in it reached the model literally.
  const prompt = renderPrompt(tpl, {
    trend_block: trend.text,
    community_seen: c.community_seen ?? "(none given)",
    competency_choices: choiceLines,
    bridge_min: String(BRIDGE_MIN),
    bridge_max: String(BRIDGE_MAX),
    bridge_types: BRIDGE_TYPES.join(", "),
  });

  // An unfilled {{placeholder}} would reach the model as literal braces and
  // silently drop whatever it was carrying. Refuse before spending a call.
  const unresolved = [
    ...unresolvedPlaceholders(prompt.system),
    ...unresolvedPlaceholders(prompt.user),
  ];
  if (unresolved.length) {
    throw new BridgeError(
      `The ce_bridges template references ${[...new Set(unresolved)].join(", ")}, which this stage does not supply.`,
      500,
    );
  }

  const { data: req } = await s
    .from("ai_generation_requests")
    .insert({
      user_id: input.actor,
      generation_type: "ce_bridges",
      target_entity_type: "ce_trend_candidate",
      target_entity_id: input.candidateId,
      prompt_template_id: tpl.id,
      prompt_template_version: tpl.version,
      provider: provider.name,
      model: settings.model,
      parameters: { candidate_id: input.candidateId },
      status: "running",
    })
    .select("id")
    .single();
  const requestId = (req as { id: string }).id;

  let output: unknown;
  try {
    const res = await provider.generate({
      system: prompt.system,
      user: prompt.user,
      schema: BRIDGE_SCHEMA as unknown as object,
      model: settings.model,
      maxTokens: settings.output_limit,
      timeoutSeconds: 120,
    });
    output = res.output;
    // cost_usd must be recorded: preflightGeneration sums THIS column to enforce
    // the daily ceiling, so a call that leaves it null is a call that never
    // counts against the limit.
    await s.from("ai_generation_requests").update({
      status: "completed", completed_at: new Date().toISOString(),
      input_tokens: res.inputTokens, output_tokens: res.outputTokens,
      cost_usd: estimateCost(res.inputTokens, res.outputTokens),
    }).eq("id", requestId);
    await s.from("ai_generation_outputs").insert({
      generation_request_id: requestId,
      output_type: "ce_bridges",
      structured_output: output as Record<string, unknown>,
      validation_status: "valid",
    });
  } catch (e) {
    await s.from("ai_generation_requests").update({
      status: "failed", completed_at: new Date().toISOString(),
      error_message: e instanceof Error ? e.message.slice(0, 400) : "generation failed",
    }).eq("id", requestId);
    throw new BridgeError(e instanceof Error ? e.message : "Bridge generation failed.", 502);
  }

  // --- Validate against canon BEFORE writing ---------------------------------
  const valid = new Map(choices.map((x) => [x.competency_id, x]));
  const proposed = ((output as { bridges?: BridgeCandidate[] }).bridges ?? []);
  const accepted: BridgeCandidate[] = [];
  const rejected: GenerateBridgesResult["rejected"] = [];

  for (const b of proposed) {
    const match = valid.get(b.competency_id);
    if (!match) {
      // The model invented or mistyped a competency. Recorded, not silently dropped.
      rejected.push({ candidate: b, reason: `competency_id "${b.competency_id}" is not in the canonical set` });
      continue;
    }
    accepted.push({ ...b, phase_id: null, domain_id: null });
  }

  // Resolve phase/domain ids from the competency's own canonical row, so the
  // mapping cannot drift from the competency the model actually chose.
  const phaseByName = new Map<string, string>();
  const domainByName = new Map<string, string>();
  const [{ data: phases }, { data: domains }] = await Promise.all([
    s.from("fw_phases").select("phase_id, name"),
    s.from("fw_domains").select("domain_id, name"),
  ]);
  for (const p of phases ?? []) phaseByName.set(String((p as { name: string }).name).toLowerCase(), (p as { phase_id: string }).phase_id);
  for (const d of domains ?? []) domainByName.set(String((d as { name: string }).name).toLowerCase(), (d as { domain_id: string }).domain_id);

  // Grade and validate BEFORE writing (migration 0056 + owner revision).
  //
  // The model grades its own bridge strength, but grading alone cannot make a
  // bridge eligible: the full framework relationship has to validate too. Both
  // are recorded, so a rejected bridge shows WHY — a weak angle and a broken
  // mapping are different problems with different fixes.
  const rows = await Promise.all(accepted.map(async (b) => {
    const comp = valid.get(b.competency_id)!;
    const phase_id = phaseByName.get(comp.phase.toLowerCase()) ?? null;
    const domain_id = domainByName.get(comp.domain.toLowerCase()) ?? null;

    const mapping = await validateMapping({ competency_id: b.competency_id, phase_id, domain_id });
    const status = (b as { status?: string }).status ?? "weak";
    const { eligible } = computeEligibility(status, mapping.valid);

    return {
      candidate_id: input.candidateId,
      bridge_type: b.bridge_type,
      affected_population: b.affected_population,
      relational_consequence: b.relational_consequence,
      angle: b.angle,
      competency_id: b.competency_id,
      phase_id,
      domain_id,
      rationale: b.rationale,
      // A bridge the model graded 'forced' is forced regardless of the flag.
      is_forced: !!b.is_forced || status === "forced",
      status,
      mapping_valid: mapping.valid,
      mapping_errors: mapping.errors,
      // Proposed, never auto-accepted. Eligibility says the bridge COULD be
      // used; the owner decision on ce_relational_bridges says whether it is.
      eligible_for_generation: eligible,
      decision: "proposed",
    };
  }));

  if (proposed.length < BRIDGE_MIN || proposed.length > BRIDGE_MAX) {
    // Not fatal — the output is still worth keeping — but the owner should know
    // the model did not return the range it was asked for.
    console.warn(
      `[ce_bridges] model returned ${proposed.length} bridges, expected ${BRIDGE_MIN}-${BRIDGE_MAX}.`,
    );
  }

  if (rows.length) {
    const { error } = await s.from("ce_relational_bridges").insert(rows);
    // The FK is the last line of defence — if it fires, the model got past the
    // in-process check somehow and we want to know rather than swallow it.
    if (error) throw new BridgeError(`Bridge write rejected by the database: ${error.message}`, 500);
  }

  await s.from("ce_trend_candidates")
    .update({ status: "bridged", updated_at: new Date().toISOString() })
    .eq("id", input.candidateId);

  return { request_id: requestId, bridges: accepted, rejected, strippedInjection: trend.strippedInjection };
}
