import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  projectPhaseNarrative,
  computeSourceVersion,
  isKbSourced,
  REQUIRED_DOMAINS,
  REQUIRED_FOR_DISPLAY,
  REQUIRED_FOR_PUBLIC_USE,
  type PhaseNarrativeRecord,
  type DomainNarrativeRecord,
} from "@/lib/framework/phaseNarrative";
import { runPhaseNarrativeQc, checkReductions, checkDistortionCorrection, REDUCTIONS } from "@/lib/framework/narrativeQc";
import { PHASES, getPhase } from "@/lib/frameworkContent";
import { PHASE_NARRATIVE, DOMAIN_NARRATIVES } from "@/scripts/recoveryNarrativePayload";

// Knowledge Base source-of-truth cutover (owner directive, 2026-08-06).
//
// The payload module is the single transcription of the framework author's
// document and is what the seeder writes to the database, so building fixtures
// from it tests the same content the public pages serve. Live database
// verification is scripts/verifyRecoveryNarrative.ts.

const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

function phaseRecord(over: Partial<PhaseNarrativeRecord> = {}): PhaseNarrativeRecord {
  return {
    ...PHASE_NARRATIVE,
    lived_experience_summary: null,
    developmental_explanation: null,
    common_misconceptions: [],
    signs_of_movement: [],
    signs_constrained: [],
    safety_boundaries: [],
    public_or_clinical_boundary: null,
    reading_level: null,
    approved_language: [],
    prohibited_reductions: [],
    source_version: null,
    updated_at: null,
    ...over,
  } as PhaseNarrativeRecord;
}

function domainRecords(): DomainNarrativeRecord[] {
  return DOMAIN_NARRATIVES.map((d) => ({
    phase: "Recovery",
    domain: d.domain,
    domain_storyline: d.domain_storyline,
    consumer_problem_language: [],
    internal_questions: d.internal_questions,
    emotional_experience: d.emotional_experience,
    observable_patterns: [],
    developmental_interpretation: null,
    competency_ids: d.competency_names_display.map((_, i) => `XXX-RECV-00${i + 1}`),
    competency_names_display: d.competency_names_display,
    healthy_narrative_movement: null,
    common_distorted_interpretation: d.common_distorted_interpretation,
    content_themes: [],
    next_step_language: null,
    safety_rules: [],
    suppression_rules: [],
    record_status: "draft",
    updated_at: null,
  }));
}

const projection = () => projectPhaseNarrative(phaseRecord(), domainRecords());

// ---------------------------------------------------------------------------
// 1. All three public routes resolve to the same KB narrative version
// ---------------------------------------------------------------------------

test("source version is deterministic — identical records yield an identical version", () => {
  const a = computeSourceVersion(phaseRecord(), domainRecords());
  const b = computeSourceVersion(phaseRecord(), domainRecords());
  assert.equal(a, b);
  assert.match(a, /^[0-9a-f]{16}$/);
});

test("source version changes when any narrative field changes", () => {
  const base = computeSourceVersion(phaseRecord(), domainRecords());

  const editedPhase = computeSourceVersion(
    phaseRecord({ core_human_question: "Something else entirely?" }),
    domainRecords(),
  );
  assert.notEqual(base, editedPhase, "editing the phase record must change the version");

  const domains = domainRecords();
  domains[0].common_distorted_interpretation = "Rewritten. It does not mean that.";
  const editedDomain = computeSourceVersion(phaseRecord(), domains);
  assert.notEqual(base, editedDomain, "editing a storyline must change the version");
});

test("domain ordering does not affect the version — all routes agree regardless of query order", () => {
  const forward = computeSourceVersion(phaseRecord(), domainRecords());
  const reversed = computeSourceVersion(phaseRecord(), [...domainRecords()].reverse());
  assert.equal(forward, reversed);
});

test("all three public routes read through the single Knowledge Base entry point", () => {
  const phaseRoute = read("app/(site)/[phase]/page.tsx");
  const learnRoute = read("app/(site)/learn/[slug]/page.tsx");
  const frameworkRoute = read("app/(site)/framework/page.tsx");
  const cards = read("lib/framework/phaseCards.ts");

  // /[phase] and /learn/[slug] call getPhaseNarrative directly.
  assert.match(phaseRoute, /getPhaseNarrative/, "/[phase] must resolve through getPhaseNarrative");
  assert.match(learnRoute, /getPhaseNarrative/, "/learn/[slug] must resolve through getPhaseNarrative");
  // /framework goes through resolvePhaseCards, which itself uses getPhaseNarrative.
  assert.match(frameworkRoute, /resolvePhaseCards/, "/framework must resolve through resolvePhaseCards");
  assert.match(cards, /getPhaseNarrative/, "resolvePhaseCards must resolve through getPhaseNarrative");

  // Because there is exactly one fetch path, the three routes cannot diverge.
  const lib = read("lib/framework/phaseNarrative.ts");
  const exportedFetchers = lib.match(/export async function \w+/g) ?? [];
  assert.deepEqual(
    exportedFetchers,
    ["export async function getPhaseNarrative"],
    "there must be exactly one Knowledge Base fetch entry point",
  );
});

// ---------------------------------------------------------------------------
// 2. "Recovery" remains the canonical phase identity
// ---------------------------------------------------------------------------

test("Recovery is the canonical phase name, route identity and mapping value", () => {
  const p = projection();
  assert.equal(p.phase, "Recovery");
  assert.equal(p.slug, "recovery");
  assert.equal(p.developmentalTask, "Healing");

  const entry = getPhase("recovery");
  assert.ok(entry, "the /recovery route must still exist");
  assert.equal(entry.name, "Recovery", "route identity must remain the canonical name");
  assert.equal(entry.narrativeSource, "knowledge_base");
  assert.ok(isKbSourced("Recovery"));
});

test("the consumer title is never used as phase name, slug or route", () => {
  const p = projection();
  assert.notEqual(p.phase, p.consumerTitle);
  assert.notEqual(p.slug, "getting-back-to-yourself");
  assert.ok(!PHASES.some((x) => x.name === p.consumerTitle), "no phase may be named by the consumer title");
  assert.ok(!PHASES.some((x) => x.slug === "getting-back-to-yourself"));
});

test("the phase page renders the canonical name as its heading", () => {
  const src = read("app/(site)/[phase]/page.tsx");
  assert.match(src, /<h1[^>]*>\{phase\.name\}<\/h1>/, "the H1 must be the canonical phase name");
  // The consumer title appears, but subordinate to it.
  assert.match(src, /kb\?\.consumerTitle/);
});

// ---------------------------------------------------------------------------
// 3. "Getting Back to Yourself" is treated as the consumer narrative title
// ---------------------------------------------------------------------------

test("the consumer narrative title and public descriptor are carried distinctly", () => {
  const p = projection();
  assert.equal(p.consumerTitle, "Getting Back to Yourself");
  assert.equal(p.publicDescriptor, "Healing after relational loss");
  // Distinct fields, not aliases of each other or of the phase name.
  assert.notEqual(p.consumerTitle, p.publicDescriptor);
  assert.notEqual(p.consumerTitle, p.phase);
});

test("the card's focus line and sentence are different strings", () => {
  // The descriptor fills the short focus line; using it for the sentence too
  // renders the same text twice on the card.
  const p = projection();
  assert.notEqual(
    p.cardDescription,
    p.publicDescriptor,
    "card sentence must not repeat the public descriptor",
  );
  assert.equal(p.cardDescriptionSource, "core_human_question");
});

// ---------------------------------------------------------------------------
// 4. No independent Recovery narrative copy remains in frameworkContent.ts
// ---------------------------------------------------------------------------

test("frameworkContent.ts carries no Recovery narrative fields", () => {
  const recovery = PHASES.find((p) => p.slug === "recovery");
  assert.ok(recovery);
  assert.equal(recovery.narrativeSource, "knowledge_base");

  for (const field of ["task", "primaryFocus", "cardDescription", "intro", "sections", "fullyPopulated"] as const) {
    assert.equal(
      recovery[field],
      undefined,
      `Recovery must not carry "${field}" — that is Knowledge Base territory now`,
    );
  }
});

test("the retired Recovery prose is gone from the source file", () => {
  const src = read("lib/frameworkContent.ts");
  // Distinctive fragments of the copy that used to live here.
  const retired = [
    "The phase of restoration",
    "processing the end of a relationship and rebuilding emotional wellbeing",
    "If Expiration is the phase of accepting",
    "Healthy recovery is about learning how to carry the experience",
    "Healing is not the removal of the wound",
    "Healing after loss",
  ];
  for (const fragment of retired) {
    assert.ok(!src.includes(fragment), `retired Recovery prose still present: "${fragment}"`);
  }
});

test("the site content editor offers no override fields for cut-over phases", async () => {
  const { PHASE_FIELDS } = await import("@/lib/siteContent");
  const keys = PHASE_FIELDS.map((f) => f.key);
  assert.ok(
    !keys.some((k) => k.startsWith("phase.recovery.")),
    "a CMS override for Recovery would be a second authoring source",
  );
  // Legacy phases are still editable.
  assert.ok(keys.some((k) => k.startsWith("phase.exploration.")));
});

test("applyPhaseOverrides is gone — every phase-card surface uses the resolver", async () => {
  const siteContent = await import("@/lib/siteContent");
  assert.equal(
    (siteContent as Record<string, unknown>).applyPhaseOverrides,
    undefined,
    "the pre-cutover resolver could not see Knowledge Base phases",
  );
  for (const route of ["app/(site)/page.tsx", "app/(site)/framework/page.tsx"]) {
    assert.match(read(route), /resolvePhaseCards/, `${route} must use the phase-card resolver`);
  }
});

// ---------------------------------------------------------------------------
// 5. All six Recovery domain records contain a distortion correction
// ---------------------------------------------------------------------------

test("all six Recovery storylines are present with a distortion correction", () => {
  const p = projection();
  assert.equal(p.storylines.length, 6);
  assert.deepEqual(
    [...p.storylines.map((s) => s.domain)].sort(),
    [...REQUIRED_DOMAINS].sort(),
  );
  for (const s of p.storylines) {
    assert.ok(
      s.distortionCorrection.trim().length > 0,
      `${s.domain} has no distortion correction`,
    );
  }
  const qc = runPhaseNarrativeQc(p);
  assert.equal(qc.distortionCorrections, 6);
});

test("a storyline missing its distortion correction is not renderable", () => {
  const domains = domainRecords();
  domains[2].common_distorted_interpretation = "";
  const p = projectPhaseNarrative(phaseRecord(), domains);
  assert.equal(p.renderable, false);
  assert.ok(
    p.missingRequiredFields.some((f) => f.includes("common_distorted_interpretation")),
  );
});

test("a distortion correction that only restates the reduction is rejected", () => {
  // No corrective clause — this teaches the reduction instead of refuting it.
  const bare = checkDistortionCorrection(
    "Recovery is proven by complete independence and constant productivity.",
    "Role Functioning.common_distorted_interpretation",
  );
  assert.equal(bare.length, 1);
  assert.equal(bare[0].severity, "critical");

  // The authored version states the distortion AND corrects it.
  const authored = DOMAIN_NARRATIVES.find((d) => d.domain === "Role Functioning");
  assert.ok(authored);
  assert.deepEqual(checkDistortionCorrection(authored.common_distorted_interpretation, "f"), []);
});

// ---------------------------------------------------------------------------
// 6. Missing required narrative fields cannot be interpreted as approved
// ---------------------------------------------------------------------------

test("a complete-for-display projection is still not approved for public use", () => {
  const p = projection();
  assert.equal(p.renderable, true, "the authored content renders");
  assert.equal(p.approvalState, "not_approved", "renderable is not approved");
  assert.ok(p.publicationBlockers.length > 0, "unauthored suitability fields must block publication");
  // Every unauthored public-use field is named as a blocker.
  for (const f of REQUIRED_FOR_PUBLIC_USE) {
    assert.ok(p.publicationBlockers.includes(f), `${f} must be listed as a publication blocker`);
  }
  assert.ok(p.publicationBlockers.some((b) => b.startsWith("record_status:")));
});

test("blank fields never become approval — filling display fields does not approve", () => {
  const p = projectPhaseNarrative(
    phaseRecord({ lived_experience_summary: "Something authored.", developmental_explanation: "More." }),
    domainRecords(),
  );
  assert.equal(p.approvalState, "not_approved");
  assert.ok(p.publicationBlockers.length > 0);
});

test("a record with every public-use field authored is still not auto-approved", () => {
  const p = projectPhaseNarrative(
    phaseRecord({
      safety_boundaries: ["No competency requires unsafe contact."],
      public_or_clinical_boundary: "Public.",
      reading_level: "Grade 5",
      approved_language: ["healing"],
      prohibited_reductions: ["closure from the former partner"],
      record_status: "approved",
    }),
    domainRecords(),
  );
  // Publication blockers clear, but approval is still recorded elsewhere —
  // ce_source_use_approvals — and never inferred from field presence.
  assert.deepEqual(p.publicationBlockers, []);
  assert.equal(p.approvalState, "not_approved");
});

test("every display-required field is individually enforced", () => {
  for (const field of REQUIRED_FOR_DISPLAY) {
    if (field === "phase" || field === "developmental_task") continue; // identity, always present
    const blanked = Array.isArray((phaseRecord() as unknown as Record<string, unknown>)[field]) ? [] : "";
    const p = projectPhaseNarrative(
      phaseRecord({ [field]: blanked } as Partial<PhaseNarrativeRecord>),
      domainRecords(),
    );
    assert.equal(p.renderable, false, `${field} must be required for display`);
    assert.ok(p.missingRequiredFields.includes(field));
  }
});

test("the routes refuse to fall back to legacy copy", () => {
  const src = read("app/(site)/[phase]/page.tsx");
  assert.match(src, /Refusing|is missing required fields|no kb_phase_narratives record/);
  assert.match(read("lib/framework/phaseCards.ts"), /Refusing to fall back to legacy copy/);
});

// ---------------------------------------------------------------------------
// 7. Recovery is not reduced to dating, reconciliation, forgiveness,
//    sexual readiness, total independence, or the absence of grief
// ---------------------------------------------------------------------------

test("the authored Recovery narrative passes QC with no critical findings", () => {
  const qc = runPhaseNarrativeQc(projection());
  const critical = qc.findings.filter((f) => f.severity === "critical");
  assert.deepEqual(critical, [], `unexpected critical findings: ${JSON.stringify(critical, null, 2)}`);
  assert.equal(qc.passed, true);
  assert.equal(qc.domainsPresent, 6);
});

test("every one of the six reductions is explicitly addressed by the canon", () => {
  const qc = runPhaseNarrativeQc(projection());
  for (const r of REDUCTIONS) {
    assert.equal(qc.reductionsCovered[r.key], true, `${r.key} is not addressed anywhere in the canon`);
  }
});

test("asserting a reduction is a critical finding", () => {
  const cases: [string, string][] = [
    ["dating", "Recovery is proven when you start dating again."],
    ["reconciliation", "Healing means reconciling with your former partner."],
    ["forgiveness", "Recovery requires forgiveness."],
    ["sexual_readiness", "Healing is demonstrated when you are sexually available again."],
    ["total_independence", "Recovery means complete independence from everyone."],
    ["absence_of_grief", "Healing is the absence of grief."],
  ];
  for (const [key, text] of cases) {
    const findings = checkReductions(text, "test");
    assert.ok(findings.length > 0, `"${text}" should be flagged`);
    assert.ok(
      findings.some((f) => f.reduction === key),
      `"${text}" should be flagged as ${key}, got ${findings.map((f) => f.reduction).join(", ")}`,
    );
    assert.equal(findings[0].severity, "critical");
  }
});

test("the framework denying a reduction is not flagged", () => {
  const denials = [
    "Healing is not forgiveness.",
    "Healing is not reconciliation.",
    "Healing is not the absence of grief.",
    "Healing is not proven by dating again.",
    "Recovery does not require reconciliation or forgiveness.",
    "No particular level of physical or sexual participation proves healing.",
    "Healing does not require doing everything alone.",
  ];
  for (const d of denials) {
    assert.deepEqual(checkReductions(d, "test"), [], `wrongly flagged the framework's own denial: "${d}"`);
  }
});

test("a governing truth removed from the canon is caught as a coverage gap", () => {
  const stripped = phaseRecord({
    governing_narrative_truths: PHASE_NARRATIVE.governing_narrative_truths.filter(
      (t) => !/forgiv/i.test(t),
    ),
  });
  // Also remove the storyline text that mentions forgiveness, if any.
  const qc = runPhaseNarrativeQc(projectPhaseNarrative(stripped, domainRecords()));
  assert.equal(qc.reductionsCovered.forgiveness, false);
  assert.ok(qc.findings.some((f) => f.category === "coverage" && f.reduction === "forgiveness"));
});
