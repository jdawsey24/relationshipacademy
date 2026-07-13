// PURE, deterministic Assessment Assembly Engine. No DB, no AI, no Date/random —
// same inputs ALWAYS produce the same Measurement Model and the same assembled
// item set (proven by inputs_fingerprint). Reproducible + auditable + validation-
// ready. Reuses the shared readability + quality + dedupe utilities.

import { fkGrade } from "@/lib/readability";
import { tokenSimilarity } from "@/lib/ai/dedupe";
import { runDeterministicItemChecks } from "@/lib/ai/quality";
import {
  ENGINE_VERSION, SECONDS_PER_ITEM, DUP_THRESHOLD, parseTargetGrade, stableHash, nextPhase, OUTPUT_LABELS,
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

export function assemble(model: MeasurementModel, spec: SpecificationInput, approvedItems: EligibleItem[]): AssemblyResult {
  const targetGrade = parseTargetGrade(spec.target_reading_level);
  const dc = spec.design_constraints ?? {};
  const reqComp = new Set(model.required_competencies);
  const reqDomain = new Set(model.required_domains);
  const reqPhase = new Set(model.required_phases);

  // Eligibility: approved/published + in Model scope.
  let eligible = approvedItems.filter(
    (it) => (it.status === "approved" || it.status === "published")
      && it.competency_id && reqComp.has(it.competency_id)
      && (!it.domain || reqDomain.has(it.domain))
      && (!it.phase || reqPhase.has(it.phase))
  );

  // Response-model consistency: policy "single" restricts to the most common model
  // (deterministic tie-break by model id).
  if (dc.response_model_policy === "single") {
    const counts = new Map<string, number>();
    for (const it of eligible) counts.set(it.response_model ?? "", (counts.get(it.response_model ?? "") ?? 0) + 1);
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
    if (best) eligible = eligible.filter((it) => (it.response_model ?? "") === best);
  }

  const minItems = model.coverage_policy.min_items_per_competency;
  const selected: SelectedItem[] = [];
  const selectedItems: EligibleItem[] = [];
  const selectedTexts: string[] = [];
  let duplicates_removed = 0;

  // Coverage-first greedy, competencies in stable order.
  for (const comp of model.required_competencies) {
    const candidates = eligible
      .filter((it) => it.competency_id === comp)
      .map((it) => ({ it, penalty: qualityPenalty(it), ev: evidenceRank(it.evidence_strength), close: targetGrade == null ? 0 : Math.abs(fkGrade(it.item_text ?? "") - targetGrade) }))
      .sort((a, b) => a.penalty - b.penalty || b.ev - a.ev || a.close - b.close || a.it.item_id.localeCompare(b.it.item_id));

    let taken = 0;
    for (const c of candidates) {
      if (taken >= minItems) break;
      const text = c.it.item_text ?? "";
      const isDup = selectedTexts.some((t) => tokenSimilarity(text, t) > DUP_THRESHOLD);
      if (isDup) { duplicates_removed++; continue; }
      selected.push({
        item_id: c.it.item_id, position: selected.length + 1, satisfies_competency: comp,
        selection_reason: `Covers ${comp}${c.it.behavior_id ? ` (indicator ${c.it.behavior_id})` : ""}`,
      });
      selectedItems.push(c.it); selectedTexts.push(text); taken++;
    }
  }

  // Coverage stats.
  const perComp = new Map<string, number>();
  for (const s of selected) if (s.satisfies_competency) perComp.set(s.satisfies_competency, (perComp.get(s.satisfies_competency) ?? 0) + 1);
  const competency_coverage: CompetencyCoverage[] = model.required_competencies.map((c) => {
    const sel = perComp.get(c) ?? 0;
    return { competency_id: c, required: minItems, selected: sel, adequate: sel >= minItems };
  });
  const under_covered_competencies = competency_coverage.filter((c) => !c.adequate).map((c) => c.competency_id);
  const competencies_covered = competency_coverage.filter((c) => c.adequate).length;

  const coveredIndicators = new Set(selectedItems.map((it) => it.behavior_id).filter(Boolean) as string[]);
  const missing_indicators = model.required_behavioral_indicators.filter((b) => !coveredIndicators.has(b));

  const reverseCount = selectedItems.filter((it) => it.reverse_scored).length;
  const anchored = spec.structural_context ? selectedItems.filter((it) => it.phase === spec.structural_context).length : 0;
  const grades = selectedItems.map((it) => fkGrade(it.item_text ?? "")).filter((g) => g > 0);
  const mean_reading_grade = grades.length ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10 : null;

  const stats = {
    items_searched: approvedItems.length,
    items_selected: selected.length,
    competencies_required: model.required_competencies.length,
    competencies_covered,
    indicators_required: model.required_behavioral_indicators.length,
    indicators_covered: model.required_behavioral_indicators.filter((b) => coveredIndicators.has(b)).length,
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

  // Outcome fulfilment (purpose validation).
  const adequate = new Set(competency_coverage.filter((c) => c.adequate).map((c) => c.competency_id));
  const outcomeFulfillment: OutcomeFulfillment[] = model.outcome_requirements.map((r) => {
    const unmet = r.required_competencies.filter((c) => !adequate.has(c));
    return { output: r.output, label: OUTPUT_LABELS[r.output] ?? r.output, fulfilled: unmet.length === 0 && r.required_competencies.length > 0, unmet_competencies: unmet };
  });
  const outcome_fulfilled = selected.length > 0 && outcomeFulfillment.length > 0 && outcomeFulfillment.every((o) => o.fulfilled);

  // Fingerprint over the INPUTS (engine + model + relevant spec + sorted eligible ids)
  // → identical inputs prove identical output.
  const inputs_fingerprint = stableHash({
    engine: ENGINE_VERSION,
    model,
    spec: { structural_context: spec.structural_context, target_reading_level: spec.target_reading_level, design_constraints: dc },
    eligible: eligible.map((it) => it.item_id).sort(),
  });

  return { itemIds: selected.map((s) => s.item_id), selected, stats, outcomeFulfillment, outcome_fulfilled, inputs_fingerprint };
}
