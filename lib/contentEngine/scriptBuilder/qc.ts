import { getSupabaseAdminClient } from "@/lib/supabase";
import { checkReductions } from "@/lib/framework/narrativeQc";
import { getPhaseNarrative } from "@/lib/framework/phaseNarrative";
import {
  checkRuntime, detectOntologyLeakage, evaluateComparison, gradeFindings,
  scanCultureTerms, DEFAULT_WPM,
  type BlockingRule, type CultureTerm, type GradableFinding, type GradeResult, type Severity,
} from "@/lib/contentEngine/scriptBuilder/analysis";

// Stage 11 — quality control over a finished package.
//
// Deterministic first, and deterministic only. Every check here is a rule with
// a stated reason, not a model judging its own output: a model that generated a
// script is the last thing that should decide whether the script is safe.
//
// Blocking is category-sensitive (ruling 10) and driven by ce_qc_blocking_rules,
// so the owner changes policy by editing a row rather than shipping a deploy.

export interface ScriptQcInput {
  briefId: string;
  phaseId?: string | null;
  phaseName?: string | null;
  competencyId?: string | null;
  mappingValidated: boolean;
  publicationEligible: boolean;
  targetRuntimeSeconds: number;
  wordsPerMinute?: number;
  scripts: { reading_level: "grade5" | "higher"; hook?: string | null; body: string; cta?: string | null }[];
  packageText?: { on_screen_caption?: string | null; post_caption?: string | null; cta_text?: string | null };
  equivalence?: { lessonMatch: boolean; rewardMatch: boolean; hookMatch: boolean; ctaMatch: boolean };
  similarityThreshold?: number;
  ownerOverride?: boolean;
}

export interface ScriptQcResult extends GradeResult {
  findings: GradableFinding[];
  runtime: { reading_level: string; seconds: number; withinTarget: boolean; adjustWords: number }[];
  comparison: ReturnType<typeof evaluateComparison> | null;
}

const finding = (
  category: string, severity: Severity, message: string, field?: string,
): GradableFinding => ({ category, severity, message, field });

/** Everything a viewer would actually see or hear. */
function consumerSurface(input: ScriptQcInput): string {
  const parts: string[] = [];
  for (const s of input.scripts) {
    parts.push(s.hook ?? "", s.body, s.cta ?? "");
  }
  parts.push(
    input.packageText?.on_screen_caption ?? "",
    input.packageText?.post_caption ?? "",
    input.packageText?.cta_text ?? "",
  );
  return parts.filter(Boolean).join("\n\n");
}

export async function runScriptQc(input: ScriptQcInput): Promise<ScriptQcResult> {
  const s = getSupabaseAdminClient();
  const findings: GradableFinding[] = [];

  // --- 1. Framework gates --------------------------------------------------
  if (!input.mappingValidated) {
    findings.push(finding("framework", "critical",
      "The framework mapping is not validated. A script cannot be built on an unverified competency, phase and domain.",
      "mapping_validated"));
  }
  if (!input.publicationEligible) {
    findings.push(finding("framework", "high",
      "No approved public use is recorded for this source. The draft may be reviewed but not published.",
      "publication_eligible"));
  }
  if (!input.competencyId) {
    findings.push(finding("framework", "critical", "No competency is attached to this brief.", "competency_id"));
  }

  // --- 2. Runtime ----------------------------------------------------------
  const wpm = input.wordsPerMinute ?? DEFAULT_WPM;
  const runtime = input.scripts.map((sc) => {
    const spoken = [sc.hook, sc.body, sc.cta].filter(Boolean).join(" ");
    const r = checkRuntime(spoken, input.targetRuntimeSeconds, wpm);
    if (!r.withinTarget) {
      findings.push(finding("runtime", "medium",
        `The ${sc.reading_level} script runs ${r.seconds}s against a ${r.targetSeconds}s target ` +
        `(${r.adjustWords > 0 ? `add ~${r.adjustWords}` : `cut ~${Math.abs(r.adjustWords)}`} words).`,
        `script:${sc.reading_level}`));
    }
    return { reading_level: sc.reading_level, seconds: r.seconds, withinTarget: r.withinTarget, adjustWords: r.adjustWords };
  });

  // --- 3. The two reading levels -------------------------------------------
  const g5 = input.scripts.find((x) => x.reading_level === "grade5");
  const hi = input.scripts.find((x) => x.reading_level === "higher");
  let comparison: ScriptQcResult["comparison"] = null;

  if (!g5 || !hi) {
    findings.push(finding("completeness", "critical",
      "Both reading levels are required. Only one script was produced.", "scripts"));
  } else {
    comparison = evaluateComparison(g5.body, hi.body, input.equivalence ?? {
      lessonMatch: true, rewardMatch: true, hookMatch: true, ctaMatch: true,
    }, { threshold: input.similarityThreshold, ownerOverride: input.ownerOverride });

    if (comparison.similarityExceeded && !input.ownerOverride) {
      findings.push(finding("duplication", "high",
        `Lexical similarity ${comparison.lexicalSimilarity} exceeds ${comparison.threshold}. ` +
        `These read as one script rather than two reading levels. Owner may override with a reason.`,
        "scripts"));
    }
    if (!comparison.equivalenceOk) {
      // Not overridable: an override permits sameness, and this is difference.
      findings.push(finding("framework", "critical",
        `Independent drafting diverged on: ${comparison.divergences.join(", ")}. ` +
        `The two reading levels no longer teach the same thing.`, "scripts"));
    }
  }

  // --- 4. Consumer-surface language ----------------------------------------
  const surface = consumerSurface(input);

  for (const leak of detectOntologyLeakage(surface)) {
    findings.push(finding("voice", "medium",
      `Internal framework vocabulary in consumer copy: "${leak.term}". …${leak.excerpt}…`, "consumer_text"));
  }

  const { data: cultureRows } = await s
    .from("ce_culture_terms").select("term, disposition");
  for (const hit of scanCultureTerms(surface, (cultureRows ?? []) as CultureTerm[])) {
    findings.push(finding("voice", hit.disposition === "blocked" ? "high" : "medium",
      `Culture term "${hit.term}" is ${hit.disposition.replace("_", " ")} and appears in consumer copy. …${hit.excerpt}…`,
      "consumer_text"));
  }

  // --- 5. Phase reductions -------------------------------------------------
  // If the brief's phase has an authored Knowledge Base narrative, the script is
  // held to that phase's governing truths. This is the same check the public
  // pages are held to, applied to generated copy.
  if (input.phaseName) {
    try {
      const narrative = await getPhaseNarrative(input.phaseName);
      if (narrative) {
        for (const f of checkReductions(surface, "consumer_text")) {
          findings.push(finding("clinical", "high",
            `${f.message} (${input.phaseName} governing truth.) …${f.excerpt ?? ""}…`, "consumer_text"));
        }
      }
    } catch {
      // A narrative lookup failure must not silently pass the script. Say so.
      findings.push(finding("framework", "medium",
        `Could not load the ${input.phaseName} narrative, so its governing truths were not checked.`,
        "phase_narrative"));
    }
  }

  // --- 6. Grade against owner policy ---------------------------------------
  const { data: ruleRows } = await s
    .from("ce_qc_blocking_rules").select("risk_category, min_severity, blocks_publication");
  const graded = gradeFindings(findings, (ruleRows ?? []) as BlockingRule[]);

  return { ...graded, findings, runtime, comparison };
}

/** Persist findings to the existing ai_quality_checks audit table. */
export async function persistScriptQc(
  generationRequestId: string | null,
  draftId: string | null,
  result: ScriptQcResult,
): Promise<void> {
  const s = getSupabaseAdminClient();
  if (!result.findings.length) return;
  await s.from("ai_quality_checks").insert(
    result.findings.map((f) => ({
      generation_request_id: generationRequestId,
      draft_id: draftId,
      check_type: f.category,
      severity: f.severity,
      message: f.message,
      field: f.field ?? null,
      blocking: result.blocking.includes(f),
    })),
  );
}
