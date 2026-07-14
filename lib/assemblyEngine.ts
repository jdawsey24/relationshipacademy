// PURE, deterministic Assessment Assembly Engine. No DB, no AI, no Date/random —
// same inputs ALWAYS produce the same Measurement Model and the same assembled
// item set (proven by inputs_fingerprint). Reproducible + auditable + validation-
// ready. Reuses the shared readability + quality + dedupe utilities.

import { fkGrade } from "@/lib/readability";
import { tokenSimilarity } from "@/lib/ai/dedupe";
import { runDeterministicItemChecks } from "@/lib/ai/quality";
import {
  ENGINE_VERSION, SECONDS_PER_ITEM, DUP_THRESHOLD, DEFAULT_STRATEGY, parseTargetGrade, stableHash, nextPhase, OUTPUT_LABELS,
  type SpecificationInput, type FrameworkInput, type MeasurementModel, type OutcomeRequirement,
  type EligibleItem, type AssemblyResult, type SelectedItem, type OutcomeFulfillment, type CompetencyCoverage,
} from "@/lib/assembly";

const uniqSort = (xs: string[]): string[] => [...new Set(xs.filter(Boolean))].sort();

// ---------------------------------------------------------------------------
// 1) Specification → Measurement Model (intent → required evidence)
// ---------------------------------------------------------------------------
export function deriveMeasurementModel(spec: SpecificationInput, framework: FrameworkInput): MeasurementModel {
  const dc = spec.design_constraints ?? {};
  const outputs = spec.desired_outputs ?? [];

  // Scope of domains.
  const allDomains = uniqSort(framework.competencies.map((c) => c.domain_slug ?? ""));
  const scopeDomains = dc.scope_domains?.length ? uniqSort(dc.scope_domains) : allDomains;

  // Scope of phases: explicit override, else structural context (+ next phase if "readiness").
  let scopePhases: string[];
  if (dc.scope_phases?.length) {
    scopePhases = uniqSort(dc.scope_phases);
  } else if (spec.structural_context) {
    scopePhases = [spec.structural_context];
    if (outputs.includes("readiness")) { const n = nextPhase(spec.structural_context); if (n) scopePhases.push(n); }
    scopePhases = uniqSort(scopePhases);
  } else {
    scopePhases = uniqSort(framework.competencies.map((c) => c.phase_slug ?? ""));
  }

  const inScope = (c: { domain_slug: string | null; phase_slug: string | null }) =>
    scopeDomains.includes(c.domain_slug ?? "") && scopePhases.includes(c.phase_slug ?? "");

  const required_competencies = uniqSort(framework.competencies.filter(inScope).map((c) => c.code));
  const compSet = new Set(required_competencies);

  // Length: the owner specifies a TARGET TOTAL, which the engine distributes across
  // the required competencies (min 1 each). Falls back to an explicit per-competency
  // minimum when no target is given.
  const minItems = dc.target_total_items && required_competencies.length > 0
    ? Math.max(1, Math.round(dc.target_total_items / required_competencies.length))
    : Math.max(1, dc.min_items_per_competency ?? 1);
  const required_behavioral_indicators = uniqSort(
    framework.indicators.filter((i) => compSet.has(i.competency_id)).map((i) => i.behavior_id)
  );

  // Per-output required competencies (the outcome-fulfilment checklist).
  const compsForPhase = (phase: string | null) =>
    uniqSort(framework.competencies.filter((c) => inScope(c) && (!phase || c.phase_slug === phase)).map((c) => c.code));
  const outcome_requirements: OutcomeRequirement[] = outputs.map((output) => {
    let comps: string[];
    switch (output) {
      case "where_you_are":
      case "developmental_alignment":
        comps = spec.structural_context ? compsForPhase(spec.structural_context) : required_competencies; break;
      case "readiness": {
        const n = spec.structural_context ? nextPhase(spec.structural_context) : null;
        comps = n ? compsForPhase(n) : []; break;
      }
      default: // strengths | growth | recommendations | resources
        comps = required_competencies;
    }
    return { output, required_competencies: comps, min_items_per_competency: minItems };
  });

  return {
    required_competencies,
    required_behavioral_indicators,
    required_domains: scopeDomains,
    required_phases: scopePhases,
    outcome_requirements,
    coverage_policy: {
      measurement_strategy: dc.measurement_strategy ?? DEFAULT_STRATEGY,
      target_total_items: dc.target_total_items ?? null,
      min_items_per_competency: minItems,
      reverse_target_pct: dc.reverse_target_pct ?? null,
      phase_anchored_target_pct: dc.phase_anchored_target_pct ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// 2) Measurement Model + approved bank → deterministic assembly
// ---------------------------------------------------------------------------

// Higher = preferred. Deterministic quality penalty from the shared checks.
function qualityPenalty(it: EligibleItem): number {
  const findings = runDeterministicItemChecks({
    item_text: it.item_text ?? "",
    reverse_candidate: !!it.reverse_scored,
    behavioral_indicator_id: it.behavior_id ?? undefined,
    audience: it.item_type ?? undefined,
  });
  return findings.filter((f) => !f.passed && (f.severity === "high" || f.severity === "critical")).length;
}

const EVIDENCE_RANK: Record<string, number> = { mastery: 4, advanced: 3, developed: 2, emerging: 1 };
function evidenceRank(s: string | null): number { return EVIDENCE_RANK[(s ?? "").toLowerCase()] ?? 1; }

type Scored = { it: EligibleItem; penalty: number; ev: number; close: number };
const cellKey = (it: EligibleItem) => `${it.domain ?? ""}|${it.phase ?? ""}`;

export function assemble(model: MeasurementModel, spec: SpecificationInput, approvedItems: EligibleItem[]): AssemblyResult {
  const targetGrade = parseTargetGrade(spec.target_reading_level);
  const dc = spec.design_constraints ?? {};
  const strategy = model.coverage_policy.measurement_strategy ?? DEFAULT_STRATEGY;
  const minItems = model.coverage_policy.min_items_per_competency;
  const budget = model.coverage_policy.target_total_items;
  const reqComp = new Set(model.required_competencies);
  const reqDomain = new Set(model.required_domains);
  const reqPhase = new Set(model.required_phases);

  // Eligibility: approved/published + in Model scope.
  let eligibleItems = approvedItems.filter(
    (it) => (it.status === "approved" || it.status === "published")
      && it.competency_id && reqComp.has(it.competency_id)
      && (!it.domain || reqDomain.has(it.domain))
      && (!it.phase || reqPhase.has(it.phase))
  );
  if (dc.response_model_policy === "single") {
    const counts = new Map<string, number>();
    for (const it of eligibleItems) counts.set(it.response_model ?? "", (counts.get(it.response_model ?? "") ?? 0) + 1);
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
    if (best) eligibleItems = eligibleItems.filter((it) => (it.response_model ?? "") === best);
  }

  // Deterministic ranking (quality → evidence → reading closeness → id).
  const scored: Scored[] = eligibleItems.map((it) => ({ it, penalty: qualityPenalty(it), ev: evidenceRank(it.evidence_strength), close: targetGrade == null ? 0 : Math.abs(fkGrade(it.item_text ?? "") - targetGrade) }));
  const cmp = (a: Scored, b: Scored) => a.penalty - b.penalty || b.ev - a.ev || a.close - b.close || a.it.item_id.localeCompare(b.it.item_id);
  const byComp = new Map<string, Scored[]>();
  const byCell = new Map<string, Scored[]>();
  const byIndicator = new Map<string, Scored[]>();
  for (const sc of [...scored].sort(cmp)) {
    if (sc.it.competency_id) (byComp.get(sc.it.competency_id) ?? byComp.set(sc.it.competency_id, []).get(sc.it.competency_id)!).push(sc);
    (byCell.get(cellKey(sc.it)) ?? byCell.set(cellKey(sc.it), []).get(cellKey(sc.it))!).push(sc);
    if (sc.it.behavior_id) (byIndicator.get(sc.it.behavior_id) ?? byIndicator.set(sc.it.behavior_id, []).get(sc.it.behavior_id)!).push(sc);
  }

  // Selection state + helpers.
  const selected: SelectedItem[] = [];
  const selectedItems: EligibleItem[] = [];
  const selectedTexts: string[] = [];
  const used = new Set<string>();
  const coveredIndicators = new Set<string>();
  let duplicates_removed = 0;
  const isDup = (text: string) => selectedTexts.some((t) => tokenSimilarity(text, t) > DUP_THRESHOLD);
  const add = (sc: Scored, comp: string | null) => {
    selected.push({ item_id: sc.it.item_id, position: selected.length + 1, satisfies_competency: comp, selection_reason: `Covers ${comp ?? sc.it.competency_id ?? "?"}${sc.it.behavior_id ? ` (indicator ${sc.it.behavior_id})` : ""}` });
    selectedItems.push(sc.it); selectedTexts.push(sc.it.item_text ?? ""); used.add(sc.it.item_id);
    if (sc.it.behavior_id) coveredIndicators.add(sc.it.behavior_id);
  };
  // Next best unused, non-duplicate item from a candidate list; optionally prefer
  // one that covers a not-yet-covered behavioral indicator.
  const pick = (cands: Scored[] | undefined, preferNewIndicator: boolean): Scored | null => {
    if (!cands) return null;
    let fallback: Scored | null = null;
    for (const c of cands) {
      if (used.has(c.it.item_id)) continue;
      if (isDup(c.it.item_text ?? "")) { used.add(c.it.item_id); duplicates_removed++; continue; }
      if (preferNewIndicator && c.it.behavior_id && !coveredIndicators.has(c.it.behavior_id)) return c;
      if (!fallback) fallback = c;
      if (!preferNewIndicator) return c;
    }
    return fallback;
  };

  const cells = uniqSort([...byCell.keys()]);

  if (strategy === "comprehensive") {
    for (const comp of model.required_competencies) {
      for (let taken = 0; taken < minItems; taken++) {
        const c = pick(byComp.get(comp), true);
        if (!c) break;
        add(c, comp);
      }
    }
    // Exhaustive: cover any still-missing required indicator.
    for (const ind of model.required_behavioral_indicators) {
      if (coveredIndicators.has(ind)) continue;
      const c = pick(byIndicator.get(ind), false);
      if (c) add(c, c.it.competency_id);
    }
  } else if (strategy === "profile") {
    const cap = budget ?? model.required_competencies.length;
    for (let progress = true; progress && selected.length < cap; ) {
      progress = false;
      for (const comp of model.required_competencies) {
        if (selected.length >= cap) break;
        const c = pick(byComp.get(comp), true);
        if (c) { add(c, comp); progress = true; }
      }
    }
  } else { // screening — representative sampling across domain × phase cells
    const cap = budget ?? cells.length;
    for (let progress = true; progress && selected.length < cap; ) {
      progress = false;
      for (const cell of cells) {
        if (selected.length >= cap) break;
        const c = pick(byCell.get(cell), true);
        if (c) { add(c, c.it.competency_id); progress = true; }
      }
    }
  }

  // ---- Coverage stats (strategy-aware) ----
  const perComp = new Map<string, number>();
  for (const s of selected) if (s.satisfies_competency) perComp.set(s.satisfies_competency, (perComp.get(s.satisfies_competency) ?? 0) + 1);
  const compThreshold = strategy === "comprehensive" ? minItems : 1;
  const competency_coverage: CompetencyCoverage[] = model.required_competencies.map((c) => {
    const sel = perComp.get(c) ?? 0;
    return { competency_id: c, required: compThreshold, selected: sel, adequate: sel >= compThreshold };
  });
  const competencies_covered = competency_coverage.filter((c) => c.adequate).length;

  const coveredCells = new Set(selectedItems.map((it) => cellKey(it)));
  const cells_total = cells.length;
  const cells_covered = coveredCells.size;

  // Competency → cell (from eligible items) for screening fulfilment.
  const compCell = new Map<string, string>();
  for (const it of eligibleItems) if (it.competency_id && !compCell.has(it.competency_id)) compCell.set(it.competency_id, cellKey(it));
  const compSatisfied = (comp: string): boolean => {
    if (strategy === "screening") { const cell = compCell.get(comp); return !!cell && coveredCells.has(cell); }
    return (perComp.get(comp) ?? 0) >= compThreshold;
  };

  // Under-represented: screening → cells; else → competencies.
  const under_covered_competencies = strategy === "screening"
    ? [] // screening reports missing CELLS, not competencies
    : competency_coverage.filter((c) => !c.adequate).map((c) => c.competency_id);
  const missing_indicators = strategy === "comprehensive"
    ? model.required_behavioral_indicators.filter((b) => !coveredIndicators.has(b))
    : [];

  const reverseCount = selectedItems.filter((it) => it.reverse_scored).length;
  const anchored = spec.structural_context ? selectedItems.filter((it) => it.phase === spec.structural_context).length : 0;
  const grades = selectedItems.map((it) => fkGrade(it.item_text ?? "")).filter((g) => g > 0);
  const mean_reading_grade = grades.length ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10 : null;

  const stats = {
    strategy,
    items_searched: approvedItems.length,
    items_selected: selected.length,
    competencies_required: model.required_competencies.length,
    competencies_covered,
    indicators_required: model.required_behavioral_indicators.length,
    indicators_covered: model.required_behavioral_indicators.filter((b) => coveredIndicators.has(b)).length,
    cells_total, cells_covered,
    domains_covered: uniqSort(selectedItems.map((it) => it.domain ?? "")),
    phases_covered: uniqSort(selectedItems.map((it) => it.phase ?? "")),
    duplicates_removed,
    reverse_pct: selected.length ? Math.round((reverseCount / selected.length) * 100) / 100 : 0,
    phase_anchored_pct: selected.length ? Math.round((anchored / selected.length) * 100) / 100 : 0,
    mean_reading_grade,
    estimated_minutes: Math.round((selected.length * SECONDS_PER_ITEM) / 60),
    competency_coverage,
    under_covered_competencies,
    missing_indicators,
  };

  // ---- Outcome fulfilment (purpose validation, strategy-aware) ----
  const outcomeFulfillment: OutcomeFulfillment[] = model.outcome_requirements.map((r) => {
    const unmet = r.required_competencies.filter((c) => !compSatisfied(c));
    // An outcome with no derivable evidence requirements under this Specification
    // (e.g. "readiness" with an "Any" structural context → no next phase) has nothing
    // to satisfy — it's vacuously met, not a failure.
    return { output: r.output, label: OUTPUT_LABELS[r.output] ?? r.output, fulfilled: unmet.length === 0, unmet_competencies: unmet };
  });
  const indicatorsOk = strategy !== "comprehensive" || missing_indicators.length === 0;
  const outcome_fulfilled = selected.length > 0 && outcomeFulfillment.length > 0 && outcomeFulfillment.every((o) => o.fulfilled) && indicatorsOk;

  const inputs_fingerprint = stableHash({
    engine: ENGINE_VERSION,
    model,
    spec: { structural_context: spec.structural_context, target_reading_level: spec.target_reading_level, design_constraints: dc },
    eligible: eligibleItems.map((it) => it.item_id).sort(),
  });

  return { itemIds: selected.map((s) => s.item_id), selected, stats, outcomeFulfillment, outcome_fulfilled, inputs_fingerprint };
}
