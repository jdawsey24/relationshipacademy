import { createHash } from "node:crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";

// Validated, versioned projection of the Knowledge Base narrative layer for the
// public site (owner cutover, 2026-08-06).
//
// WHY THIS EXISTS. lib/frameworkContent.ts used to be an independent authoring
// source for substantive framework narrative. Two consumer-facing descriptions of
// the same phase existed in two places with no relationship between them. This
// module makes the Knowledge Base the only source of phase definitions,
// developmental explanations, transformations, domain storylines, misconceptions
// and safety boundaries. frameworkContent.ts keeps route, order, colour and
// layout — presentation metadata only.
//
// THE NAMING DECISION IS STRUCTURAL HERE, NOT COSMETIC.
//
//   phase              "Recovery"                      canonical. Stored phase name,
//                                                      route identity, framework
//                                                      reference, mapping value.
//   developmentalTask  "Healing"                       canonical.
//   consumerTitle      "Getting Back to Yourself"      a TRANSLATION of Recovery.
//                                                      Never a phase name, never a
//                                                      route, never a mapping value.
//   publicDescriptor   "Healing after relational loss" optional short descriptor.
//
// NO SILENT FALLBACK. If a required narrative field is missing, the projection is
// not renderable and the caller must fail loudly. It must never reach back to the
// legacy hardcoded prose — that copy is stale by definition once a phase is cut
// over, and quietly serving it would recreate the exact problem this replaces.
//
// RENDERABLE IS NOT APPROVED. Two independent gates, deliberately separate:
//   renderable  — are the fields the page needs present?
//   approval    — has this source been approved for public use? That is
//                 ce_source_use_approvals, and a missing field can never be read
//                 as an approval.

/** Phases whose narrative has been cut over to the Knowledge Base. */
export const KB_SOURCED_PHASES = ["Recovery"] as const;

export function isKbSourced(phaseName: string): boolean {
  return (KB_SOURCED_PHASES as readonly string[])
    .some((p) => p.toLowerCase() === phaseName.toLowerCase());
}

// ---------------------------------------------------------------------------
// Raw record shapes (what the KB tables hold)
// ---------------------------------------------------------------------------

export interface PhaseNarrativeRecord {
  phase: string;
  developmental_task: string;
  primary_unit_of_analysis: string;
  consumer_phase_name: string;
  public_descriptor: string | null;
  core_human_question: string;
  lived_experience_summary: string | null;
  core_tension: string | null;
  developmental_explanation: string | null;
  transformation_from: string[];
  transformation_toward: string[];
  governing_narrative_truths: string[];
  common_misconceptions: string[];
  signs_of_movement: string[];
  signs_constrained: string[];
  safety_boundaries: string[];
  public_or_clinical_boundary: string | null;
  reading_level: string | null;
  approved_language: string[];
  prohibited_reductions: string[];
  source_provenance: string | null;
  source_version: string | null;
  record_status: string;
  updated_at: string | null;
}

export interface DomainNarrativeRecord {
  phase: string;
  domain: string;
  domain_storyline: string;
  consumer_problem_language: string[];
  internal_questions: string[];
  emotional_experience: string | null;
  observable_patterns: string[];
  developmental_interpretation: string | null;
  competency_ids: string[];
  competency_names_display: string[];
  healthy_narrative_movement: string | null;
  common_distorted_interpretation: string | null;
  content_themes: string[];
  next_step_language: string | null;
  safety_rules: string[];
  suppression_rules: string[];
  record_status: string;
  updated_at: string | null;
}

// ---------------------------------------------------------------------------
// Projection
// ---------------------------------------------------------------------------

export interface DomainStorylineProjection {
  domain: string;
  storyline: string;
  emotionalExperience: string | null;
  internalQuestions: string[];
  /** The reduction this storyline exists to prevent. Required. */
  distortionCorrection: string;
  competencyIds: string[];
  competencyNamesDisplay: string[];
}

export interface PhaseNarrativeProjection {
  // --- canonical identity (never the consumer title) ---
  phase: string;
  slug: string;
  developmentalTask: string;
  primaryUnitOfAnalysis: string;

  // --- consumer layer ---
  consumerTitle: string;
  publicDescriptor: string | null;
  /**
   * The one-sentence slot on a phase card. `publicDescriptor` fills the short
   * focus line above it, so this must NOT be the descriptor as well — that
   * renders the same string twice. Until a dedicated card sentence is authored
   * it is the core human question, which is authored consumer copy and reads as
   * a sentence.
   */
  cardDescription: string;
  /** Which authored KB field cardDescription came from. Never legacy copy. */
  cardDescriptionSource: "core_human_question";
  coreQuestion: string;
  coreTension: string;
  livedExperienceSummary: string | null;
  developmentalExplanation: string | null;
  transformationFrom: string[];
  transformationToward: string[];
  governingTruths: string[];
  commonMisconceptions: string[];
  /** What THIS phase prohibits being reduced to. Drives its QC rules. */
  prohibitedReductions: string[];
  storylines: DomainStorylineProjection[];

  // --- governance ---
  sourceVersion: string;
  recordStatus: string;
  provenance: string | null;
  renderable: boolean;
  missingRequiredFields: string[];
  /** Absent fields that block PUBLIC USE. Never interpretable as approved. */
  publicationBlockers: string[];
  approvalState: "not_approved";
}

/** Fields the public pages cannot render coherently without. */
export const REQUIRED_FOR_DISPLAY = [
  "phase",
  "developmental_task",
  "consumer_phase_name",
  "core_human_question",
  "core_tension",
  "transformation_from",
  "transformation_toward",
  "governing_narrative_truths",
] as const;

/** Fields that must be authored before a phase can be approved for public use. */
export const REQUIRED_FOR_PUBLIC_USE = [
  "safety_boundaries",
  "public_or_clinical_boundary",
  "reading_level",
  "approved_language",
  "prohibited_reductions",
] as const;

/** The six canonical domains. A phase narrative is incomplete without all six. */
export const REQUIRED_DOMAINS = [
  "Communication",
  "Trust",
  "Conflict Management",
  "Emotional Intimacy",
  "Role Functioning",
  "Physical Intimacy",
] as const;

const nonEmpty = (v: unknown): boolean =>
  Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v != null;

/**
 * Deterministic content version. Derived from the narrative content itself, so
 * three routes reading the same records necessarily compute the same version,
 * and any edit to the narrative changes it.
 */
export function computeSourceVersion(
  phase: PhaseNarrativeRecord,
  domains: DomainNarrativeRecord[],
): string {
  const canonical = JSON.stringify({
    phase: phase.phase,
    task: phase.developmental_task,
    consumer: phase.consumer_phase_name,
    descriptor: phase.public_descriptor,
    question: phase.core_human_question,
    tension: phase.core_tension,
    lived: phase.lived_experience_summary,
    explanation: phase.developmental_explanation,
    from: phase.transformation_from,
    toward: phase.transformation_toward,
    truths: phase.governing_narrative_truths,
    misconceptions: phase.common_misconceptions,
    status: phase.record_status,
    declared: phase.source_version,
    domains: [...domains]
      .sort((a, b) => a.domain.localeCompare(b.domain))
      .map((d) => ({
        domain: d.domain,
        storyline: d.domain_storyline,
        experience: d.emotional_experience,
        questions: d.internal_questions,
        distortion: d.common_distorted_interpretation,
        ids: [...d.competency_ids].sort(),
        status: d.record_status,
      })),
  });
  return createHash("sha256").update(canonical).digest("hex").slice(0, 16);
}

/**
 * Pure projector. Takes records, returns the projection — no I/O, so the
 * validation and versioning rules are testable without a database.
 */
export function projectPhaseNarrative(
  phase: PhaseNarrativeRecord,
  domains: DomainNarrativeRecord[],
): PhaseNarrativeProjection {
  const missing: string[] = [];
  for (const f of REQUIRED_FOR_DISPLAY) {
    if (!nonEmpty((phase as unknown as Record<string, unknown>)[f])) missing.push(f);
  }

  const byDomain = new Map(domains.map((d) => [d.domain.toLowerCase(), d]));
  const storylines: DomainStorylineProjection[] = [];

  for (const name of REQUIRED_DOMAINS) {
    const d = byDomain.get(name.toLowerCase());
    if (!d) { missing.push(`domain:${name}`); continue; }
    if (!nonEmpty(d.domain_storyline)) missing.push(`domain:${name}.domain_storyline`);
    // A storyline with no stated distortion cannot be defended by QC, so its
    // absence blocks rendering rather than merely warning.
    if (!nonEmpty(d.common_distorted_interpretation)) {
      missing.push(`domain:${name}.common_distorted_interpretation`);
    }
    storylines.push({
      domain: d.domain,
      storyline: d.domain_storyline,
      emotionalExperience: d.emotional_experience,
      internalQuestions: d.internal_questions ?? [],
      distortionCorrection: d.common_distorted_interpretation ?? "",
      competencyIds: d.competency_ids ?? [],
      competencyNamesDisplay: d.competency_names_display ?? [],
    });
  }

  // Publication gate, evaluated independently of display.
  const publicationBlockers: string[] = [];
  for (const f of REQUIRED_FOR_PUBLIC_USE) {
    if (!nonEmpty((phase as unknown as Record<string, unknown>)[f])) publicationBlockers.push(f);
  }
  if (phase.record_status !== "approved") {
    publicationBlockers.push(`record_status:${phase.record_status}`);
  }

  return {
    phase: phase.phase,
    slug: phase.phase.toLowerCase().replace(/\s+/g, "-"),
    developmentalTask: phase.developmental_task,
    primaryUnitOfAnalysis: phase.primary_unit_of_analysis,

    consumerTitle: phase.consumer_phase_name,
    publicDescriptor: phase.public_descriptor,
    // Never the descriptor — that already fills the focus line above it.
    cardDescription: phase.core_human_question,
    cardDescriptionSource: "core_human_question",
    coreQuestion: phase.core_human_question,
    coreTension: phase.core_tension ?? "",
    livedExperienceSummary: phase.lived_experience_summary,
    developmentalExplanation: phase.developmental_explanation,
    transformationFrom: phase.transformation_from ?? [],
    transformationToward: phase.transformation_toward ?? [],
    governingTruths: phase.governing_narrative_truths ?? [],
    commonMisconceptions: phase.common_misconceptions ?? [],
    prohibitedReductions: phase.prohibited_reductions ?? [],
    storylines,

    sourceVersion: computeSourceVersion(phase, domains),
    recordStatus: phase.record_status,
    provenance: phase.source_provenance,
    renderable: missing.length === 0,
    missingRequiredFields: missing,
    publicationBlockers,
    // Structurally constant. There is no code path that derives "approved" from
    // the absence of a field, because the type admits no other value.
    approvalState: "not_approved",
  };
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

const PHASE_COLS =
  "phase, developmental_task, primary_unit_of_analysis, consumer_phase_name, public_descriptor, " +
  "core_human_question, lived_experience_summary, core_tension, developmental_explanation, " +
  "transformation_from, transformation_toward, governing_narrative_truths, common_misconceptions, " +
  "signs_of_movement, signs_constrained, safety_boundaries, public_or_clinical_boundary, " +
  "reading_level, approved_language, prohibited_reductions, source_provenance, source_version, " +
  "record_status, updated_at";

/**
 * The single entry point for public pages. /framework, /[phase] and /learn/[slug]
 * all resolve through here, so all three necessarily see the same records and the
 * same sourceVersion.
 *
 * Returns null only when the phase has no Knowledge Base record at all — that is
 * "not cut over yet", which is different from "cut over and broken". A phase that
 * IS cut over but fails validation returns a projection with renderable=false so
 * the caller can fail loudly rather than serve something stale.
 */
export async function getPhaseNarrative(
  phaseOrSlug: string,
): Promise<PhaseNarrativeProjection | null> {
  const s = getSupabaseAdminClient();
  const wanted = phaseOrSlug.trim().toLowerCase().replace(/-/g, " ");

  const { data: phases, error: phaseErr } = await s
    .from("kb_phase_narratives").select(PHASE_COLS);

  // A failed query and an absent record are completely different problems, and
  // conflating them turns "the database rejected this" into the far more
  // alarming "this phase has no narrative". Surface the real cause.
  if (phaseErr) {
    throw new Error(`kb_phase_narratives query failed: ${phaseErr.message}`);
  }

  const phase = ((phases ?? []) as unknown as PhaseNarrativeRecord[])
    .find((p) => p.phase.toLowerCase() === wanted);
  if (!phase) return null;

  const { data: domains, error: domainErr } = await s
    .from("kb_phase_domain_narratives")
    .select(
      "phase, domain, domain_storyline, consumer_problem_language, internal_questions, " +
        "emotional_experience, observable_patterns, developmental_interpretation, competency_ids, " +
        "competency_names_display, healthy_narrative_movement, common_distorted_interpretation, " +
        "content_themes, next_step_language, safety_rules, suppression_rules, record_status, updated_at",
    )
    .eq("phase", phase.phase);

  if (domainErr) {
    throw new Error(`kb_phase_domain_narratives query failed: ${domainErr.message}`);
  }

  return projectPhaseNarrative(phase, (domains ?? []) as unknown as DomainNarrativeRecord[]);
}
