// Deterministic scoring service for the STUDIO-authored Relationship Snapshot™.
// PURE — no DB, no AI, no side effects. The API loads rows and calls these. Every
// derived result carries its inputs + rule_version for traceability. Thresholds
// are owner-authored and PROVISIONAL. AI cannot enter this path.

export const STRUCTURAL_MARKERS = ["Single", "Dating", "Committed Relationship", "Engaged", "Married"] as const;
export type StructuralMarker = (typeof STRUCTURAL_MARKERS)[number];

// Almost Never=1 … Almost Always=5.
export const FREQUENCY_SCALE = [
  { label: "Almost Never", value: 1 }, { label: "Rarely", value: 2 }, { label: "Sometimes", value: 3 },
  { label: "Often", value: 4 }, { label: "Almost Always", value: 5 },
] as const;

export interface Band { label: string; min: number; max: number; interpretation?: string; cta?: string; }

export interface ScoreItemDef {
  item_id: string; competency_id: string | null; domain: string | null; phase: string | null;
  reverse_scored: boolean; scale_max?: number;
}
export interface ScoringRuleDef {
  scoring_rule_id: string; score_name?: string | null; level?: string | null; // item|competency|domain|phase
  min_valid_responses?: number | string | null; cut_points?: Band[]; version?: string | null; direction?: string | null;
}

export interface ScoreResultRow {
  scoring_rule_id: string | null; score_name: string; score_level: string; entity_id: string;
  raw_score: number; transformed_score: number; valid_response_count: number;
  confidence_status: "ok" | "suppressed" | "insufficient"; rule_version: string | null;
  band: Band | null;
}
export interface FindingRow {
  finding_type: string; finding_key: string; priority: number;
  source_refs: { score_level: string; entity_id: string }[]; consumer_summary: string;
}
export interface IncongruenceRuleDef {
  id: string; structural_context: string | null; compared_phase: string | null;
  condition_config: { level?: string; entity?: string; comparator?: string; threshold?: number } | Record<string, unknown>;
  severity?: string | null; consumer_language?: string | null; version?: string | null;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const numOr = (v: unknown, d: number) => { const n = Number(v); return Number.isFinite(n) ? n : d; };

export function scoreItem(raw: number, reverse: boolean, scaleMax = 5): number {
  return reverse ? scaleMax + 1 - raw : raw;
}
export function resolveBand(score: number, bands?: Band[]): Band | null {
  if (!bands?.length) return null;
  const s = round2(score);
  return bands.find((b) => s >= b.min && s <= b.max) ?? null;
}

// EXPECTED developmental phase by structural context (PROVISIONAL).
const EXPECTED_PHASE: Record<string, string> = {
  Single: "exploration", Dating: "exploration", "Committed Relationship": "exclusivity",
  Engaged: "expansion", Married: "expansion",
};

/** The expected developmental phase slug for a structural context (or null). */
export function expectedPhaseFor(structuralContext: string | null): string | null {
  return structuralContext ? EXPECTED_PHASE[structuralContext] ?? null : null;
}

export interface ScoreInput {
  items: ScoreItemDef[];
  responses: Record<string, number>;
  competencyRule?: ScoringRuleDef;
  domainRule?: ScoringRuleDef;
  phaseRule?: ScoringRuleDef;
}

export interface ComputedScores {
  scoreResults: ScoreResultRow[];
  competencies: { id: string; score: number; domain: string | null; phase: string | null; confidence: string }[];
  domains: { id: string; score: number; band: Band | null; confidence: string }[];
  phases: { id: string; score: number; band: Band | null }[];
}

// item → competency → domain → phase, unweighted means; min-valid → confidence.
export function computeScores(input: ScoreInput): ComputedScores {
  const scoreResults: ScoreResultRow[] = [];
  const minValidComp = numOr(input.competencyRule?.min_valid_responses, 1);

  // Competency scores (raw = mean of responses; transformed = reverse-applied mean).
  const groups = new Map<string, { raws: number[]; scored: number[]; domain: string | null; phase: string | null }>();
  for (const it of input.items) {
    if (!it.competency_id) continue;
    const raw = input.responses[it.item_id];
    if (raw == null || Number.isNaN(raw)) continue;
    const g = groups.get(it.competency_id) ?? { raws: [], scored: [], domain: it.domain, phase: it.phase };
    g.raws.push(raw);
    g.scored.push(scoreItem(raw, it.reverse_scored, it.scale_max ?? 5));
    groups.set(it.competency_id, g);
  }
  const competencies: ComputedScores["competencies"] = [];
  for (const [cid, g] of groups) {
    const confidence = g.scored.length >= minValidComp ? "ok" : "insufficient";
    const score = round2(mean(g.scored));
    scoreResults.push({
      scoring_rule_id: input.competencyRule?.scoring_rule_id ?? null, score_name: "Competency Functioning",
      score_level: "competency", entity_id: cid, raw_score: round2(mean(g.raws)),
      transformed_score: score, valid_response_count: g.scored.length,
      confidence_status: confidence as ScoreResultRow["confidence_status"], rule_version: input.competencyRule?.version ?? null,
      band: resolveBand(score, input.competencyRule?.cut_points),
    });
    if (confidence === "ok") competencies.push({ id: cid, score, domain: g.domain, phase: g.phase, confidence });
  }

  // Domain scores (mean of competency scores).
  const minValidDom = numOr(input.domainRule?.min_valid_responses, 1);
  const domGroups = new Map<string, number[]>();
  const phaseGroups = new Map<string, number[]>();
  for (const c of competencies) {
    if (c.domain) domGroups.set(c.domain, [...(domGroups.get(c.domain) ?? []), c.score]);
    if (c.phase) phaseGroups.set(c.phase, [...(phaseGroups.get(c.phase) ?? []), c.score]);
  }
  const domains: ComputedScores["domains"] = [];
  for (const [dom, scores] of domGroups) {
    const confidence = scores.length >= minValidDom ? "ok" : "suppressed";
    const score = round2(mean(scores));
    const band = resolveBand(score, input.domainRule?.cut_points);
    scoreResults.push({
      scoring_rule_id: input.domainRule?.scoring_rule_id ?? null, score_name: "Domain Functioning",
      score_level: "domain", entity_id: dom, raw_score: score, transformed_score: score,
      valid_response_count: scores.length, confidence_status: confidence as ScoreResultRow["confidence_status"],
      rule_version: input.domainRule?.version ?? null, band,
    });
    if (confidence === "ok") domains.push({ id: dom, score, band, confidence });
  }
  const phases: ComputedScores["phases"] = [];
  for (const [ph, scores] of phaseGroups) {
    const score = round2(mean(scores));
    const band = resolveBand(score, input.phaseRule?.cut_points);
    scoreResults.push({
      scoring_rule_id: input.phaseRule?.scoring_rule_id ?? null, score_name: "Phase Functioning",
      score_level: "phase", entity_id: ph, raw_score: score, transformed_score: score,
      valid_response_count: scores.length, confidence_status: "ok", rule_version: input.phaseRule?.version ?? null, band,
    });
    phases.push({ id: ph, score, band });
  }
  return { scoreResults, competencies, domains, phases };
}

// Phase-anchored items: resolve a response option → canonical phase code +
// score value (explicit mapping; respects a structural-context condition).
export interface PhaseOptionMapping { item_id: string; response_option_id: string; phase_code: string; score_value?: number | null; structural_context_condition?: string | null; }
export function resolvePhaseOption(mappings: PhaseOptionMapping[], itemId: string, responseOptionId: string, structuralContext: string | null): { phase_code: string; score_value: number | null } | null {
  const m = mappings.find((x) => x.item_id === itemId && x.response_option_id === responseOptionId && (!x.structural_context_condition || x.structural_context_condition === "*" || x.structural_context_condition === structuralContext));
  return m ? { phase_code: m.phase_code, score_value: m.score_value ?? null } : null;
}

// Reassessment comparison: per-domain delta between two attempts.
export function compareDomains(prev: { id: string; score: number }[], next: { id: string; score: number }[]): { domain: string; prev: number | null; next: number | null; delta: number | null }[] {
  const ids = new Set([...prev.map((d) => d.id), ...next.map((d) => d.id)]);
  return [...ids].sort().map((id) => {
    const p = prev.find((d) => d.id === id)?.score ?? null;
    const n = next.find((d) => d.id === id)?.score ?? null;
    return { domain: id, prev: p, next: n, delta: p != null && n != null ? round2(n - p) : null };
  });
}

export interface FindingsInput {
  structuralContext: string | null;
  acknowledgedTransition?: string | null;
  scores: ComputedScores;
  incongruenceRules?: IncongruenceRuleDef[];
  expirationRiskThreshold?: number; // PROVISIONAL
}

export function deriveFindings(input: FindingsInput): FindingRow[] {
  const findings: FindingRow[] = [];
  const { domains, phases } = input.scores;

  // 1. Structural Context (echoed, never inferred).
  if (input.structuralContext) {
    findings.push({ finding_type: "structural_context", finding_key: input.structuralContext, priority: 1, source_refs: [], consumer_summary: `You told us your relationship is: ${input.structuralContext}.` });
  }

  // 2. Phase Alignment (relative to structural context; later phases NOT auto-healthier).
  if (phases.length) {
    const strongest = [...phases].sort((a, b) => b.score - a.score)[0];
    const expected = input.structuralContext ? EXPECTED_PHASE[input.structuralContext] : null;
    const aligned = expected ? strongest.id === expected : null;
    findings.push({ finding_type: "phase_alignment", finding_key: strongest.id, priority: 2, source_refs: [{ score_level: "phase", entity_id: strongest.id }], consumer_summary: `Your habits most reflect the ${strongest.id} phase${expected ? (aligned ? " — consistent with where you said you are." : `, while your stated context suggests ${expected}.`) : "."}` });
  }

  // 3. Domain Functioning + 6/7. Strengths + growth priority.
  const ranked = [...domains].sort((a, b) => b.score - a.score);
  for (const d of ranked) {
    findings.push({ finding_type: "domain_functioning", finding_key: d.id, priority: 3, source_refs: [{ score_level: "domain", entity_id: d.id }], consumer_summary: `${d.id}: ${d.band?.label ?? "score " + d.score}.` });
  }
  ranked.slice(0, 2).forEach((d, i) => findings.push({ finding_type: "strength", finding_key: d.id, priority: 10 + i, source_refs: [{ score_level: "domain", entity_id: d.id }], consumer_summary: `A current strength: ${d.id}.` }));
  const growth = ranked[ranked.length - 1];
  if (growth) findings.push({ finding_type: "growth_priority", finding_key: growth.id, priority: 20, source_refs: [{ score_level: "domain", entity_id: growth.id }], consumer_summary: `A helpful next area to strengthen: ${growth.id}.` });

  // 4. Developmental Incongruence (rule-based; descriptive).
  for (const rule of input.incongruenceRules ?? []) {
    if (rule.structural_context && rule.structural_context !== "*" && rule.structural_context !== input.structuralContext) continue;
    const cfg = rule.condition_config as { level?: string; entity?: string; comparator?: string; threshold?: number };
    const pool = cfg.level === "domain" ? domains : phases;
    const target = pool.find((x) => x.id === (cfg.entity ?? rule.compared_phase));
    if (!target) continue;
    const t = numOr(cfg.threshold, 0);
    const hit = cfg.comparator === ">=" ? target.score >= t : cfg.comparator === ">" ? target.score > t : cfg.comparator === "<=" ? target.score <= t : target.score < t;
    if (hit) findings.push({ finding_type: "incongruence", finding_key: rule.id, priority: 5, source_refs: [{ score_level: cfg.level ?? "phase", entity_id: target.id }], consumer_summary: rule.consumer_language ?? "A pattern worth noticing." });
  }

  // 5. Expiration Risk vs adaptive Expiration (separate direction; needs context).
  const exp = phases.find((p) => p.id === "expiration");
  if (exp) {
    const high = exp.score >= (input.expirationRiskThreshold ?? 4);
    if (high) {
      if (input.acknowledgedTransition) {
        findings.push({ finding_type: "expiration_risk", finding_key: "adaptive", priority: 4, source_refs: [{ score_level: "phase", entity_id: "expiration" }], consumer_summary: "Given the transition you described, these reflect healthy adaptation, not risk." });
      } else {
        findings.push({ finding_type: "expiration_risk", finding_key: "risk", priority: 4, source_refs: [{ score_level: "phase", entity_id: "expiration" }], consumer_summary: "Some patterns may signal strain in an ongoing relationship — worth attention." });
      }
    }
  }
  return findings;
}

// --- Recommendation selection (deterministic) ------------------------------
export interface RecMappingDef {
  mapping_id: string; trigger_type?: string | null; trigger_value?: string | null; competency_id?: string | null;
  structural_context?: string | null; phase_context?: string | null; priority?: string | number | null;
  recommendation_type?: string | null; recommendation_id?: string | null; suppression_logic?: string | null;
  audience?: string | null; status?: string | null;
}
export interface RecResultRow {
  finding_key: string; recommendation_mapping_id: string; asset_type: string | null; asset_id: string | null;
  rank: number; suppression_status: "active" | "suppressed"; suppression_reason: string | null;
}

// Finding → competency/domain → approved mapping → published asset. Respects
// structural context, status, publication (isPublished), and safety suppression.
export function selectRecommendations(args: {
  findings: FindingRow[];
  mappings: RecMappingDef[];
  isPublished: (assetType: string | null, assetId: string | null) => boolean;
  structuralContext: string | null;
}): { recommendations: RecResultRow[]; nextStep: FindingRow | null } {
  const growth = args.findings.find((f) => f.finding_type === "growth_priority");
  const recommendations: RecResultRow[] = [];
  let nextStep: FindingRow | null = null;
  if (!growth) return { recommendations, nextStep };

  const key = growth.finding_key; // a domain (or competency) id
  const candidates = args.mappings
    .filter((m) => (m.status ?? "").toLowerCase() === "approved" || (m.status ?? "").toLowerCase() === "published")
    .filter((m) => m.trigger_value === key || m.competency_id === key || (m.trigger_type ?? "").toLowerCase().includes("domain"))
    .filter((m) => !m.structural_context || m.structural_context === "*" || m.structural_context === args.structuralContext)
    .sort((a, b) => numOr(a.priority, 99) - numOr(b.priority, 99));

  let rank = 1;
  for (const m of candidates) {
    let suppression: "active" | "suppressed" = "active";
    let reason: string | null = null;
    if (m.suppression_logic && m.suppression_logic.trim()) { suppression = "suppressed"; reason = "safety suppression rule"; }
    else if (!args.isPublished(m.recommendation_type ?? null, m.recommendation_id ?? null)) { suppression = "suppressed"; reason = "asset not published"; }
    recommendations.push({ finding_key: key, recommendation_mapping_id: m.mapping_id, asset_type: m.recommendation_type ?? null, asset_id: m.recommendation_id ?? null, rank: rank++, suppression_status: suppression, suppression_reason: reason });
  }
  const top = recommendations.find((r) => r.suppression_status === "active");
  if (top) nextStep = { finding_type: "next_step", finding_key: top.asset_id ?? top.recommendation_mapping_id, priority: 30, source_refs: [{ score_level: "domain", entity_id: key }], consumer_summary: `Recommended next step: ${top.asset_id ?? "an approved resource"}.` };
  return { recommendations, nextStep };
}
