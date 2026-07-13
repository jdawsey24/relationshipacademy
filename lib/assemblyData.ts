import { getSupabaseAdminClient } from "@/lib/supabase";
import { getFrameworkTree } from "@/lib/studioFrameworkData";
import { deriveMeasurementModel, assemble } from "@/lib/assemblyEngine";
import {
  ENGINE_VERSION, OUTPUT_LABELS,
  type SpecificationInput, type FrameworkInput, type MeasurementModel, type EligibleItem, type AssemblyResult,
} from "@/lib/assembly";

// Server glue for the Assessment Assembly Engine. Service role (RLS-locked) +
// RESILIENT: if migration 0028 is absent, reads return empty and the pages show
// clean empty states. Governed (versioned, owner-approved, append-only). This
// module NEVER touches the live results/score request path.

export class AssemblyError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

// ---- Specification ----------------------------------------------------------

export interface SpecificationRow {
  assessment_id: string;
  name: string;
  structural_context: string | null;
  target_reading_level: string | null;
  target_completion_minutes: number | null;
  desired_outputs: string[];
  design_constraints: Record<string, unknown>;
}

export async function getSpecification(assessment_id: string): Promise<SpecificationRow | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("studio_assessments").select("*").eq("assessment_id", assessment_id).maybeSingle();
    if (!data) return null;
    const x = data as Record<string, unknown>;
    return {
      assessment_id, name: String(x.name ?? ""),
      structural_context: (x.structural_context as string) ?? null,
      target_reading_level: (x.target_reading_level as string) ?? null,
      target_completion_minutes: (x.target_completion_minutes as number) ?? null,
      desired_outputs: (x.desired_outputs as string[]) ?? [],
      design_constraints: (x.design_constraints as Record<string, unknown>) ?? {},
    };
  } catch {
    return null;
  }
}

function toSpecInput(spec: SpecificationRow): SpecificationInput {
  return {
    assessment_id: spec.assessment_id,
    structural_context: spec.structural_context,
    target_reading_level: spec.target_reading_level,
    target_completion_minutes: spec.target_completion_minutes,
    desired_outputs: spec.desired_outputs,
    design_constraints: spec.design_constraints,
  };
}

// ---- Framework --------------------------------------------------------------

async function loadFramework(): Promise<FrameworkInput> {
  const tree = await getFrameworkTree();
  const competencies = tree.competencies.map((c) => ({ code: c.code, domain_slug: c.domain_slug, phase_slug: c.phase_slug }));
  let indicators: FrameworkInput["indicators"] = [];
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("studio_behavioral_indicators").select("behavior_id, competency_id, domain, phase").eq("status", "active").limit(5000);
    indicators = (data ?? []).map((r) => {
      const x = r as Record<string, unknown>;
      return { behavior_id: String(x.behavior_id), competency_id: String(x.competency_id), domain: (x.domain as string) ?? null, phase: (x.phase as string) ?? null };
    });
  } catch { /* leave empty */ }
  return { competencies, indicators };
}

// ---- Measurement Model (governed) ------------------------------------------

export interface MeasurementModelRow extends MeasurementModel {
  id: string; assessment_id: string; version_no: number; status: string;
  effective_to: string | null; created_by: string | null; approved_by: string | null;
  derived_from_spec_at: string | null; created_at: string;
}

export async function getMeasurementModel(assessment_id: string): Promise<{ current: MeasurementModelRow | null; draft: MeasurementModelRow | null; history: number }> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("studio_assessment_measurement_models").select("*").eq("assessment_id", assessment_id).order("version_no", { ascending: false });
    const rows = (data ?? []) as unknown as MeasurementModelRow[];
    const current = rows.find((r) => r.status === "approved" && !r.effective_to) ?? null;
    const draft = rows.filter((r) => r.status === "draft").sort((a, b) => b.version_no - a.version_no)[0] ?? null;
    const history = rows.filter((r) => r.status === "superseded" || r.status === "retired").length;
    return { current, draft, history };
  } catch {
    return { current: null, draft: null, history: 0 };
  }
}

/** Derive a fresh DRAFT Measurement Model from the current Specification. */
export async function generateMeasurementModel(assessment_id: string, actor: string | null): Promise<MeasurementModelRow> {
  const spec = await getSpecification(assessment_id);
  if (!spec) throw new AssemblyError("Assessment not found.", 404);
  if (!spec.desired_outputs.length) throw new AssemblyError("Define at least one desired output in the Specification first.", 422);
  const framework = await loadFramework();
  const model = deriveMeasurementModel(toSpecInput(spec), framework);

  const s = getSupabaseAdminClient();
  const { data: existing } = await s.from("studio_assessment_measurement_models").select("version_no").eq("assessment_id", assessment_id).order("version_no", { ascending: false }).limit(1);
  const nextVersion = ((existing?.[0] as { version_no?: number } | undefined)?.version_no ?? 0) + 1;
  const row = {
    assessment_id, version_no: nextVersion, status: "draft", derived_from_spec_at: new Date().toISOString(),
    required_competencies: model.required_competencies,
    required_behavioral_indicators: model.required_behavioral_indicators,
    required_domains: model.required_domains,
    required_phases: model.required_phases,
    outcome_requirements: model.outcome_requirements,
    coverage_policy: model.coverage_policy,
    created_by: actor,
  };
  const { data, error } = await s.from("studio_assessment_measurement_models").insert(row).select("*").maybeSingle();
  if (error || !data) throw new AssemblyError(error?.message ?? "Could not save the Measurement Model.", 500);
  return data as unknown as MeasurementModelRow;
}

export async function approveModel(id: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: model } = await s.from("studio_assessment_measurement_models").select("id, assessment_id, status").eq("id", id).maybeSingle();
  const m = model as { assessment_id: string; status: string } | null;
  if (!m) throw new AssemblyError("Model not found.", 404);
  if (m.status !== "draft") throw new AssemblyError("Only a draft Measurement Model can be approved.", 409);
  const now = new Date().toISOString();
  await s.from("studio_assessment_measurement_models").update({ status: "superseded", effective_to: now, updated_at: now })
    .eq("assessment_id", m.assessment_id).eq("status", "approved").is("effective_to", null);
  const { error } = await s.from("studio_assessment_measurement_models").update({ status: "approved", approved_by: actor, effective_from: now, updated_at: now }).eq("id", id);
  if (error) throw new AssemblyError(error.message, 500);
}

// ---- Assembly (deterministic run + governed membership) --------------------

// The approved item bank can exceed PostgREST's 1,000-row response cap, so page
// through it explicitly — the engine must see EVERY eligible item or coverage
// (and reproducibility) would silently depend on truncation.
export async function loadApprovedItems(): Promise<EligibleItem[]> {
  try {
    const s = getSupabaseAdminClient();
    const cols = "item_id, competency_id, behavior_id, domain, phase, item_type, reverse_scored, evidence_strength, response_model, item_text, status";
    const pageSize = 1000;
    const out: EligibleItem[] = [];
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await s.from("studio_assessment_items").select(cols)
        .in("status", ["approved", "published"]).order("item_id").range(from, from + pageSize - 1);
      if (error) break;
      const rows = (data ?? []) as unknown as EligibleItem[];
      out.push(...rows);
      if (rows.length < pageSize) break;
    }
    return out;
  } catch {
    return [];
  }
}

function buildReport(result: AssemblyResult, modelVersion: number): string {
  const st = result.stats;
  const lines: string[] = [];
  lines.push(`## Assembly report`);
  lines.push("");
  lines.push(result.outcome_fulfilled
    ? `**✓ This instrument fully satisfies its Measurement Model.**`
    : `**⚠ This instrument does not yet satisfy its Measurement Model.**`);
  lines.push("");
  lines.push(`### Purpose fulfilment`);
  for (const o of result.outcomeFulfillment) {
    lines.push(o.fulfilled
      ? `- ✓ ${o.label} — supported`
      : `- ⚠ ${o.label} — needs evidence for: ${o.unmet_competencies.join(", ") || "(no required competencies in scope)"}`);
  }
  if (st.under_covered_competencies.length) lines.push("", `Under-represented competencies: ${st.under_covered_competencies.join(", ")}.`);
  if (st.missing_indicators.length) lines.push(`Missing behavioral indicators: ${st.missing_indicators.length}.`);
  lines.push("");
  lines.push(`### Technical summary`);
  lines.push(`- Searched ${st.items_searched} approved items; selected ${st.items_selected}.`);
  lines.push(`- Competencies covered: ${st.competencies_covered}/${st.competencies_required}. Behavioral indicators: ${st.indicators_covered}/${st.indicators_required}.`);
  lines.push(`- Domains: ${st.domains_covered.length}. Phases: ${st.phases_covered.length}.`);
  lines.push(`- Reverse-item balance: ${Math.round(st.reverse_pct * 100)}%. Phase-anchored: ${Math.round(st.phase_anchored_pct * 100)}%.`);
  lines.push(`- Mean reading grade: ${st.mean_reading_grade ?? "—"}. Estimated completion: ${st.estimated_minutes} min.`);
  lines.push(`- Duplicates removed: ${st.duplicates_removed}.`);
  lines.push(`- Engine ${ENGINE_VERSION} · model v${modelVersion} · fingerprint ${result.inputs_fingerprint}.`);
  return lines.join("\n");
}

export interface AssemblyRunRow {
  id: string; assessment_id: string; measurement_model_id: string | null; model_version: number | null;
  engine_version: string; inputs_fingerprint: string; outcome_fulfilled: boolean;
  stats: AssemblyResult["stats"]; report_markdown: string | null; status: string; created_by: string | null; created_at: string;
}

/** Run the deterministic assembly against the approved Measurement Model + bank,
 *  persisting an immutable run + a DRAFT membership set. */
export async function runAssembly(assessment_id: string, actor: string | null): Promise<{ run: AssemblyRunRow; result: AssemblyResult }> {
  const spec = await getSpecification(assessment_id);
  if (!spec) throw new AssemblyError("Assessment not found.", 404);
  const { current } = await getMeasurementModel(assessment_id);
  if (!current) throw new AssemblyError("Approve a Measurement Model before assembling.", 409);

  const approved = await loadApprovedItems();
  const model: MeasurementModel = {
    required_competencies: current.required_competencies,
    required_behavioral_indicators: current.required_behavioral_indicators,
    required_domains: current.required_domains,
    required_phases: current.required_phases,
    outcome_requirements: current.outcome_requirements,
    coverage_policy: current.coverage_policy,
  };
  const result = assemble(model, toSpecInput(spec), approved);
  const report_markdown = buildReport(result, current.version_no);

  const s = getSupabaseAdminClient();
  const { data: runData, error } = await s.from("studio_assessment_assemblies").insert({
    assessment_id, measurement_model_id: current.id, model_version: current.version_no,
    engine_version: ENGINE_VERSION, inputs_fingerprint: result.inputs_fingerprint,
    outcome_fulfilled: result.outcome_fulfilled, stats: result.stats, report_markdown,
    status: "draft", created_by: actor,
  }).select("*").maybeSingle();
  if (error || !runData) throw new AssemblyError(error?.message ?? "Could not persist the assembly run.", 500);
  const run = runData as unknown as AssemblyRunRow;

  // Replace any prior DRAFT membership for this assessment; keep approved history.
  await s.from("studio_assessment_membership").delete().eq("assessment_id", assessment_id).eq("status", "draft").eq("source", "assembled");
  if (result.selected.length) {
    await s.from("studio_assessment_membership").insert(result.selected.map((it) => ({
      assessment_id, item_id: it.item_id, measurement_model_id: current.id, assembly_id: run.id,
      position: it.position, source: "assembled", satisfies: { competency: it.satisfies_competency },
      selection_reason: it.selection_reason, status: "draft", created_by: actor,
    })));
  }
  return { run, result };
}

export async function approveAssembly(id: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: run } = await s.from("studio_assessment_assemblies").select("id, assessment_id, status").eq("id", id).maybeSingle();
  const r = run as { assessment_id: string; status: string } | null;
  if (!r) throw new AssemblyError("Assembly not found.", 404);
  if (r.status !== "draft") throw new AssemblyError("Only a draft assembly can be approved.", 409);
  // Supersede any prior approved membership, then approve this run's set.
  await s.from("studio_assessment_membership").update({ status: "superseded" }).eq("assessment_id", r.assessment_id).eq("status", "approved").eq("source", "assembled");
  await s.from("studio_assessment_membership").update({ status: "approved" }).eq("assembly_id", id).eq("status", "draft");
  const { error } = await s.from("studio_assessment_assemblies").update({ status: "approved" }).eq("id", id);
  if (error) throw new AssemblyError(error.message, 500);
}

export async function listAssemblies(assessment_id: string): Promise<AssemblyRunRow[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("studio_assessment_assemblies").select("*").eq("assessment_id", assessment_id).order("created_at", { ascending: false }).limit(20);
    return (data ?? []) as unknown as AssemblyRunRow[];
  } catch {
    return [];
  }
}

export interface MembershipRow { item_id: string; position: number; selection_reason: string | null; status: string; satisfies: Record<string, unknown>; item_text?: string | null }

export async function getMembership(assessment_id: string): Promise<MembershipRow[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("studio_assessment_membership").select("item_id, position, selection_reason, status, satisfies")
      .eq("assessment_id", assessment_id).in("status", ["draft", "approved"]).eq("source", "assembled").order("position");
    const all = (data ?? []) as unknown as MembershipRow[];
    // Prefer the pending draft proposal if one exists; otherwise the approved set.
    const drafts = all.filter((r) => r.status === "draft");
    const rows = drafts.length ? drafts : all.filter((r) => r.status === "approved");
    const ids = rows.map((r) => r.item_id);
    if (ids.length) {
      const { data: items } = await s.from("studio_assessment_items").select("item_id, item_text").in("item_id", ids);
      const textById = new Map((items ?? []).map((r) => [String((r as Record<string, unknown>).item_id), String((r as Record<string, unknown>).item_text ?? "")]));
      for (const r of rows) r.item_text = textById.get(r.item_id) ?? null;
    }
    return rows;
  } catch {
    return [];
  }
}

export const OUTPUT_LABEL_MAP = OUTPUT_LABELS;
