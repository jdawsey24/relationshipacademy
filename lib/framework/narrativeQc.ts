import type { PhaseNarrativeProjection } from "@/lib/framework/phaseNarrative";
import { REQUIRED_DOMAINS } from "@/lib/framework/phaseNarrative";

// Narrative QC for the six-domain Knowledge Base layer (owner requirement,
// 2026-08-06).
//
// WHAT IT DEFENDS. Recovery must not be reduced to dating, reconciliation,
// forgiveness, sexual readiness, total independence, or the absence of grief.
// Each of those is a specific, common, and confidently-stated wrong answer, and
// each contradicts a governing narrative truth.
//
// WHY IT IS FIELD-AWARE, NOT A KEYWORD SCAN. The authored distortion corrections
// STATE the reduction in order to correct it:
//
//   "Recovery is demonstrated by becoming physically or sexually available
//    again, or by permanently avoiding affection, touch, and intimacy. No
//    particular level of physical or sexual participation proves healing."
//
// The first sentence is a textbook violation read in isolation; the second is
// what makes the first legitimate. A scanner that flagged it would flag the
// canon itself and teach everyone to ignore it. So:
//
//   common_distorted_interpretation  exempt from the reduction check, and
//                                    subject to a STRICTER one: it must contain
//                                    an actual correction, not just a restatement
//   every other narrative field      may not assert a reduction at all
//
// The reduction check also requires a PRESCRIPTIVE construction with no negation
// in the sentence — "healing means forgiving" is a finding, "healing is not
// forgiveness" is the framework working as intended.

export type ReductionKey =
  | "dating"
  | "reconciliation"
  | "forgiveness"
  | "sexual_readiness"
  | "total_independence"
  | "absence_of_grief";

interface Reduction {
  key: ReductionKey;
  label: string;
  /** Narrow: the reduction being asserted. Drives violations. */
  violation: RegExp;
  /** Broad: the topic being discussed at all. Drives coverage. */
  coverage: RegExp;
  /** The governing truth this reduction contradicts. */
  governingTruth: string;
}

export const REDUCTIONS: Reduction[] = [
  {
    key: "dating",
    label: "Recovery reduced to dating again",
    violation: /\b(dating|dates?|a new (relationship|partner)|seeing someone)\b/i,
    coverage: /\bdat(e|es|ing)\b|\bnew (relationship|partner)\b/i,
    governingTruth: "Healing is not proven by dating again.",
  },
  {
    key: "reconciliation",
    label: "Recovery reduced to reconciliation",
    violation: /\b(reconcil\w*|getting back together|reuniting|winning (them|him|her) back)\b/i,
    coverage: /\breconcil\w*|getting back together\b/i,
    governingTruth: "Healing is not reconciliation.",
  },
  {
    key: "forgiveness",
    label: "Recovery reduced to forgiveness",
    violation: /\bforgiv\w*/i,
    coverage: /\bforgiv\w*/i,
    governingTruth: "Healing is not forgiveness.",
  },
  {
    key: "sexual_readiness",
    label: "Recovery reduced to sexual or physical readiness",
    violation:
      /\b(sexual(ly)?\s+(ready|readiness|available|active)|ready for sex|physically available|sleeping with someone)\b/i,
    coverage: /\bsexual\w*|\bphysically available\b|\bintimacy\b/i,
    governingTruth:
      "No particular level of physical or sexual participation proves healing.",
  },
  {
    key: "total_independence",
    label: "Recovery reduced to total independence",
    violation:
      /\b((complete|total|full|entire)(ly)?\s+(independen\w*|self-sufficien\w*|alone)|doing everything alone|not needing anyone|never needing help)\b/i,
    coverage: /\bindependen\w*|self-sufficien\w*|\balone\b/i,
    governingTruth:
      "Healing does not require doing everything alone or erasing the identity that existed during the relationship.",
  },
  {
    key: "absence_of_grief",
    label: "Recovery reduced to the absence of grief",
    violation:
      /\b((absence|end|lack) of (grief|grieving)|no longer griev\w*|stopped? griev\w*|done griev\w*|past the grief|free (from|of) grief)\b/i,
    coverage: /\bgrief\b|\bgriev\w*/i,
    governingTruth: "Healing is not the absence of grief.",
  },
];

const SUBJECT = /\b(recovery|recovering|healing|heals?|healed)\b/i;
const PRESCRIPTIVE =
  /\b(is|are|means?|requires?|proven by|demonstrated by|shown by|looks like|equals?|comes when|happens when|begins when|starts when|only when)\b/i;
const NEGATION =
  /\b(not|never|no|none|without|nor|rather than|instead of|cannot|can't|doesn't|don't|isn't|aren't|beyond)\b|n['’]t\b/i;
/** Language that turns a stated distortion into a correction. */
const CORRECTIVE =
  /\b(not|never|no|does not|doesn['’]t|is not|isn['’]t|nor|without|rather than|instead of|neither)\b|n['’]t\b/i;

export interface NarrativeFinding {
  severity: "critical" | "high" | "medium";
  category: "reduction" | "completeness" | "coverage" | "approval";
  field: string;
  message: string;
  reduction?: ReductionKey;
  excerpt?: string;
}

const sentences = (text: string): string[] =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Flag sentences that ASSERT a reduction. A sentence must name recovery or
 * healing, use a prescriptive construction, name the reduction, and carry no
 * negation. All four, or it is not a finding.
 */
export function checkReductions(text: string, field: string): NarrativeFinding[] {
  const out: NarrativeFinding[] = [];
  if (!text?.trim()) return out;

  for (const s of sentences(text)) {
    if (!SUBJECT.test(s) || !PRESCRIPTIVE.test(s)) continue;
    if (NEGATION.test(s)) continue; // the framework denying the reduction
    for (const r of REDUCTIONS) {
      if (r.violation.test(s)) {
        out.push({
          severity: "critical",
          category: "reduction",
          field,
          reduction: r.key,
          message: `Asserts a reduction (${r.label}). Contradicts: “${r.governingTruth}”`,
          excerpt: s.length > 180 ? s.slice(0, 177) + "…" : s,
        });
      }
    }
  }
  return out;
}

/**
 * A distortion correction must do two things: name the distortion, and correct
 * it. One without the other is worse than nothing — a bare restatement teaches
 * the reduction it was written to prevent.
 */
export function checkDistortionCorrection(text: string, field: string): NarrativeFinding[] {
  const out: NarrativeFinding[] = [];
  if (!text?.trim()) {
    out.push({
      severity: "critical", category: "completeness", field,
      message: "No distortion correction. Every storyline must state the reduction it prevents.",
    });
    return out;
  }
  if (!CORRECTIVE.test(text)) {
    out.push({
      severity: "critical", category: "reduction", field,
      message:
        "States a distortion with no corrective clause. As written this asserts the reduction rather than refuting it.",
      excerpt: text.slice(0, 177),
    });
  }
  return out;
}

export interface NarrativeQcResult {
  passed: boolean;
  findings: NarrativeFinding[];
  reductionsCovered: Record<ReductionKey, boolean>;
  domainsPresent: number;
  distortionCorrections: number;
}

/**
 * Full QC pass over a phase narrative projection.
 *
 * Covers: all six domains present · each with a distortion correction · no field
 * asserts a reduction · every reduction is explicitly addressed somewhere in the
 * authored canon · and a projection with publication blockers is never reported
 * as approved.
 */
export function runPhaseNarrativeQc(p: PhaseNarrativeProjection): NarrativeQcResult {
  const findings: NarrativeFinding[] = [];

  // --- 1. completeness ------------------------------------------------------
  const present = new Set(p.storylines.map((s) => s.domain.toLowerCase()));
  for (const d of REQUIRED_DOMAINS) {
    if (!present.has(d.toLowerCase())) {
      findings.push({
        severity: "critical", category: "completeness", field: `domain:${d}`,
        message: `Missing the ${d} storyline. All six domains are required.`,
      });
    }
  }

  // --- 2. reduction assertions in ordinary narrative fields -----------------
  const scanned: [string, string][] = [
    ["core_human_question", p.coreQuestion],
    ["core_tension", p.coreTension],
    ["lived_experience_summary", p.livedExperienceSummary ?? ""],
    ["developmental_explanation", p.developmentalExplanation ?? ""],
    ...p.transformationFrom.map((t, i) => [`transformation_from[${i}]`, t] as [string, string]),
    ...p.transformationToward.map((t, i) => [`transformation_toward[${i}]`, t] as [string, string]),
    ...p.governingTruths.map((t, i) => [`governing_narrative_truths[${i}]`, t] as [string, string]),
    ...p.commonMisconceptions.map((t, i) => [`common_misconceptions[${i}]`, t] as [string, string]),
  ];
  for (const s of p.storylines) {
    scanned.push([`${s.domain}.domain_storyline`, s.storyline]);
    scanned.push([`${s.domain}.emotional_experience`, s.emotionalExperience ?? ""]);
    s.internalQuestions.forEach((q, i) =>
      scanned.push([`${s.domain}.internal_questions[${i}]`, q]));
    // NOT distortionCorrection — checked separately and more strictly below.
  }
  for (const [field, text] of scanned) findings.push(...checkReductions(text, field));

  // --- 3. distortion corrections -------------------------------------------
  let corrections = 0;
  for (const s of p.storylines) {
    const f = checkDistortionCorrection(s.distortionCorrection, `${s.domain}.common_distorted_interpretation`);
    findings.push(...f);
    if (!f.length) corrections++;
  }

  // --- 4. every reduction must be addressed somewhere -----------------------
  // A framework that never mentions a reduction has not refuted it.
  const corpus = [
    ...p.governingTruths,
    ...p.commonMisconceptions,
    ...p.storylines.map((s) => s.distortionCorrection),
  ].join(" \n ");

  const reductionsCovered = {} as Record<ReductionKey, boolean>;
  for (const r of REDUCTIONS) {
    const covered = r.coverage.test(corpus);
    reductionsCovered[r.key] = covered;
    if (!covered) {
      findings.push({
        severity: "high", category: "coverage", field: "governing_narrative_truths",
        reduction: r.key,
        message: `Nothing in the authored canon addresses "${r.label}". Expected something equivalent to: “${r.governingTruth}”`,
      });
    }
  }

  // --- 5. approval can never be inferred ------------------------------------
  if (p.publicationBlockers.length && p.approvalState !== "not_approved") {
    findings.push({
      severity: "critical", category: "approval", field: "approvalState",
      message: "Publication blockers present but the projection is not marked not_approved.",
    });
  }

  return {
    passed: findings.every((f) => f.severity !== "critical"),
    findings,
    reductionsCovered,
    domainsPresent: p.storylines.length,
    distortionCorrections: corrections,
  };
}
