import { getSupabaseAdminClient } from "@/lib/supabase";
import { isBlocked, type QcFinding } from "@/lib/contentEngine/types";
import { tokenOverlap } from "@/lib/contentEngine/normalize";

// Quality control for generated consumer content.
//
// Deterministic checks only — no second model call decides whether content is
// safe. Everything here is a rule that can be read, tested, and argued with.
//
// Owner ruling 2026-08-06: only `critical` blocks. `high` is surfaced but the
// owner decides. That keeps the gate honest: if everything blocked, the gate
// would be routed around within a week.

/** Framework vocabulary that must not appear in consumer-facing copy. */
const INTERNAL_VOCABULARY = [
  "developmental incongruence", "incongruence", "shadow phase", "technical phase",
  "competency id", "competency_id", "domain score", "scoring band",
  "developmental task", "behavioral indicator", "incomplete indicator",
  "phase code", "construct", "operational definition",
];

/** Diagnosis language, which is never acceptable about a person in the news. */
const DIAGNOSIS_TERMS = [
  "narcissist", "narcissistic personality", "sociopath", "psychopath", "borderline",
  "bipolar", "npd", "bpd", "ptsd", "attachment disorder", "personality disorder",
  "clinically", "diagnosed with", "suffers from", "is mentally ill",
];

/** Voice rules from the owner's copy direction. */
const BANNED_PHRASES = [
  "i don't know who needs to hear this", "i dont know who needs to hear this",
  "as a therapist, i can tell you", "trust me as a professional",
  "men are", "women are", "all men", "all women",
  "this is why women", "this is why men",
];

const HEDGE_REQUIRED = [
  "always", "never", "everyone", "no one", "guaranteed", "will definitely", "proves that",
];

export interface QcInput {
  text: string;
  competency_id: string | null;
  phase_id: string | null;
  domain_id: string | null;
  /** Facts asserted in the draft must be traceable to a cited observation. */
  citations: string[];
  /** Provenance rows written for this generation. */
  sourceCount: number;
  primaryKeyword?: string | null;
  recentTitles?: string[];
}

/** Deterministic checks that need no database. Exported for direct testing. */
export function runDeterministicChecks(input: QcInput): QcFinding[] {
  const out: QcFinding[] = [];
  const lower = input.text.toLowerCase();

  const push = (
    check_type: string, passed: boolean,
    severity: QcFinding["severity"], finding: string, recommendation?: string,
  ) => out.push({ check_type, passed, severity, finding, recommendation });

  // --- Provenance -----------------------------------------------------------
  push("source_traceability", input.sourceCount > 0, "critical",
    input.sourceCount > 0
      ? `${input.sourceCount} approved source record(s) snapshotted.`
      : "No approved RLC source records were recorded for this draft.",
    "Regenerate — a draft with no provenance cannot be traced back to canon.");

  push("competency_mapping", !!input.competency_id, "critical",
    input.competency_id
      ? `Mapped to ${input.competency_id}.`
      : "No competency mapping on the accepted bridge.",
    "Accept a bridge with a valid competency before generating.");

  // --- Consumer safety ------------------------------------------------------
  const diagnosis = DIAGNOSIS_TERMS.filter((t) => lower.includes(t));
  push("no_diagnosis", diagnosis.length === 0, "critical",
    diagnosis.length ? `Diagnostic language present: ${diagnosis.join(", ")}.` : "No diagnostic language.",
    "Describe observable behaviour instead of naming a condition.");

  const internal = INTERNAL_VOCABULARY.filter((t) => lower.includes(t));
  push("no_internal_vocabulary", internal.length === 0, "high",
    internal.length ? `Internal framework vocabulary in consumer copy: ${internal.join(", ")}.` : "No internal vocabulary.",
    "Translate to plain consumer language; the framework should inform, not appear.");

  const banned = BANNED_PHRASES.filter((t) => lower.includes(t));
  push("voice_compliance", banned.length === 0, "high",
    banned.length ? `Banned phrasing: ${banned.join(", ")}.` : "No banned phrasing.",
    "Rewrite in the approved voice.");

  // Em dashes are explicitly out per the copy direction.
  const emDashes = (input.text.match(/—/g) ?? []).length;
  push("no_em_dashes", emDashes === 0, "medium",
    emDashes ? `${emDashes} em dash(es) present.` : "No em dashes.",
    "Use a comma, a full stop, or a rewrite.");

  // --- Certainty and evidence ----------------------------------------------
  const absolutes = HEDGE_REQUIRED.filter((t) => new RegExp(`\\b${t}\\b`, "i").test(input.text));
  push("appropriate_uncertainty", absolutes.length === 0, "medium",
    absolutes.length ? `Absolute claims: ${absolutes.join(", ")}.` : "Claims are appropriately hedged.",
    "Use 'often', 'can', or 'your responses suggest'.");

  // A draft that names a real person or event should carry a citation.
  const namesEntity = /\b(said|announced|reported|confirmed|according to)\b/i.test(input.text);
  push("facts_cited", !namesEntity || input.citations.length > 0, "high",
    namesEntity && input.citations.length === 0
      ? "The draft asserts reported facts but carries no citation."
      : "Factual claims are cited or absent.",
    "Attach the verified source, or remove the factual claim.");

  // --- Keyword placement ----------------------------------------------------
  if (input.primaryKeyword) {
    const opening = input.text.slice(0, 200).toLowerCase();
    push("keyword_placement", opening.includes(input.primaryKeyword.toLowerCase()), "low",
      opening.includes(input.primaryKeyword.toLowerCase())
        ? "Primary keyword appears in the opening."
        : `Primary keyword "${input.primaryKeyword}" is missing from the opening.`,
      "Place the exact live phrase in the first line.");
  }

  // --- Duplication ----------------------------------------------------------
  if (input.recentTitles?.length) {
    const dupe = input.recentTitles.find((t) => tokenOverlap(t, input.text.slice(0, 200)) > 0.7);
    push("recent_duplication", !dupe, "medium",
      dupe ? `Close to a recent draft: "${dupe}".` : "No close duplicate in recent drafts.",
      "Pick a different angle or a different trend.");
  }

  return out;
}

/**
 * Validate the framework mapping against the DATABASE — the closed set. This is
 * what makes "no invented framework concepts" true rather than aspirational.
 * The FK on ce_relational_bridges already prevents an invalid competency being
 * stored; this catches a draft whose mapping drifted from the accepted bridge.
 */
export async function validateFrameworkMapping(input: QcInput): Promise<QcFinding[]> {
  const out: QcFinding[] = [];
  const s = getSupabaseAdminClient();

  if (input.competency_id) {
    const { data } = await s.from("fw_competencies")
      .select("competency_id").eq("competency_id", input.competency_id).maybeSingle();
    out.push({
      check_type: "competency_exists", passed: !!data,
      severity: "critical",
      finding: data ? `${input.competency_id} exists in fw_competencies.`
                    : `${input.competency_id} is NOT a canonical competency.`,
      recommendation: data ? undefined : "Reject this bridge — the mapping was invented.",
    });
  }
  if (input.phase_id) {
    const { data } = await s.from("fw_phases").select("phase_id").eq("phase_id", input.phase_id).maybeSingle();
    out.push({
      check_type: "phase_exists", passed: !!data, severity: "critical",
      finding: data ? `${input.phase_id} exists.` : `${input.phase_id} is not a canonical phase.`,
    });
  }
  if (input.domain_id) {
    const { data } = await s.from("fw_domains").select("domain_id").eq("domain_id", input.domain_id).maybeSingle();
    out.push({
      check_type: "domain_exists", passed: !!data, severity: "critical",
      finding: data ? `${input.domain_id} exists.` : `${input.domain_id} is not a canonical domain.`,
    });
  }
  return out;
}

export interface QcResult {
  findings: QcFinding[];
  blocked: boolean;
  status: "passed" | "flagged" | "blocked";
}

export async function runQc(input: QcInput): Promise<QcResult> {
  const findings = [...runDeterministicChecks(input), ...(await validateFrameworkMapping(input))];
  const blocked = isBlocked(findings);
  const anyFailed = findings.some((f) => !f.passed);
  return { findings, blocked, status: blocked ? "blocked" : anyFailed ? "flagged" : "passed" };
}

/** Persist findings against a draft, mirroring lib/ai/quality.ts. */
export async function persistQc(
  generationRequestId: string | null, draftId: string, findings: QcFinding[],
): Promise<void> {
  if (!findings.length) return;
  const s = getSupabaseAdminClient();
  try {
    await s.from("ai_quality_checks").insert(findings.map((f) => ({
      generation_request_id: generationRequestId,
      draft_type: "content",
      draft_id: draftId,
      check_type: f.check_type,
      severity: f.severity,
      passed: f.passed,
      finding: f.finding,
      recommendation: f.recommendation ?? null,
    })));
  } catch {
    /* QC logging must never break a generation run */
  }
}
