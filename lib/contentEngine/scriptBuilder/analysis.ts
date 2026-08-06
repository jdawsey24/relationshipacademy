// Deliberately NOT lib/contentEngine/normalize's tokenOverlap.
//
// That helper runs its input through dedupeKey → canonicalName, which keeps only
// the FIRST CLAUSE and caps at 120 characters — correct for naming a trend,
// useless for comparing two scripts. Using it here meant similarity was computed
// from the opening sentence of each script (2 tokens against 7 in the first live
// run, scoring 0.000), so the 0.80 threshold could never fire and two
// near-identical scripts would have sailed through. Similarity needs the whole
// text, so it gets its own tokenizer.

/** Words too common to carry a signal about whether two scripts are the same. */
const NOISE = new Set([
  "the", "and", "but", "for", "not", "you", "your", "yours", "that", "this", "with",
  "was", "were", "are", "have", "has", "had", "what", "when", "then", "they", "them",
  "their", "there", "here", "from", "about", "into", "out", "just", "like", "than",
  "his", "her", "him", "she", "its", "it's", "can", "could", "would", "should",
  "one", "all", "any", "how", "why", "who", "get", "got", "does", "did", "done",
]);

// Pure analysis for the Script Builder: runtime, similarity, equivalence and
// severity grading. No I/O, so every rule here is testable without a database
// or a model call — which matters because these are the rules that decide
// whether a script may proceed.

// ---------------------------------------------------------------------------
// Runtime
// ---------------------------------------------------------------------------

/** Default speaking rate (owner ruling 12). Overridable per delivery profile. */
export const DEFAULT_WPM = 150;

/** How far a script may miss its target runtime before it is flagged. */
export const RUNTIME_TOLERANCE = 0.15;

export function wordCount(text: string): number {
  const t = (text ?? "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export function estimateRuntimeSeconds(words: number, wpm = DEFAULT_WPM): number {
  if (wpm <= 0) throw new Error("Words per minute must be positive.");
  return Math.round((words / wpm) * 60);
}

export interface RuntimeCheck {
  words: number;
  seconds: number;
  targetSeconds: number;
  withinTarget: boolean;
  deltaSeconds: number;
  /** Words to add (positive) or cut (negative) to hit the target exactly. */
  adjustWords: number;
}

export function checkRuntime(text: string, targetSeconds: number, wpm = DEFAULT_WPM): RuntimeCheck {
  const words = wordCount(text);
  const seconds = estimateRuntimeSeconds(words, wpm);
  const tolerance = Math.max(1, Math.round(targetSeconds * RUNTIME_TOLERANCE));
  const deltaSeconds = seconds - targetSeconds;
  return {
    words,
    seconds,
    targetSeconds,
    withinTarget: Math.abs(deltaSeconds) <= tolerance,
    deltaSeconds,
    adjustWords: Math.round(((targetSeconds - seconds) / 60) * wpm),
  };
}

// ---------------------------------------------------------------------------
// Script comparison (owner ruling 9)
// ---------------------------------------------------------------------------

/**
 * Owner-set threshold. Above this the two reading levels are too similar to be
 * two reading levels — but it WARNS rather than blocks, and the owner may
 * override with a reason.
 */
export const SIMILARITY_THRESHOLD = 0.8;

/** Content words across the WHOLE text — no truncation, no first-clause shortcut. */
export function contentTokens(text: string): Set<string> {
  return new Set(
    (text ?? "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !NOISE.has(t)),
  );
}

/**
 * Jaccard similarity over content words: shared / total distinct.
 *
 * Jaccard rather than an overlap coefficient, because overlap divides by the
 * SMALLER set and so scores a short script fully contained in a longer one as a
 * perfect match. Two reading levels legitimately differ in length, and treating
 * "the short one is a subset" as "these are the same script" is precisely the
 * false positive that would make the check untrustworthy.
 */
export function lexicalSimilarity(a: string, b: string): number {
  const A = contentTokens(a), B = contentTokens(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared++;
  const union = A.size + B.size - shared;
  return Number((shared / union).toFixed(3));
}

export interface EquivalenceInput {
  lessonMatch: boolean;
  rewardMatch: boolean;
  hookMatch: boolean;
  ctaMatch: boolean;
}

export interface ComparisonResult {
  lexicalSimilarity: number;
  threshold: number;
  similarityExceeded: boolean;
  equivalenceOk: boolean;
  divergences: string[];
  /** Both checks pass, or the similarity warning has been overridden. */
  acceptable: boolean;
  notes: string;
}

/**
 * Two independent questions, deliberately not collapsed into one score.
 *
 *   similarity   — are these the same WORDS? Too high means the "two reading
 *                  levels" are one script with cosmetic edits.
 *   equivalence  — are these the same LESSON? Independent drafting can drift
 *                  until the two scripts teach different things, which is a
 *                  worse failure and invisible to a similarity score.
 *
 * A pair can fail either alone. Low similarity plus failed equivalence is the
 * dangerous combination: genuinely different scripts saying different things.
 */
export function evaluateComparison(
  grade5: string,
  higher: string,
  equivalence: EquivalenceInput,
  opts: { threshold?: number; ownerOverride?: boolean } = {},
): ComparisonResult {
  const threshold = opts.threshold ?? SIMILARITY_THRESHOLD;
  const sim = lexicalSimilarity(grade5, higher);
  const exceeded = sim > threshold;

  const divergences: string[] = [];
  if (!equivalence.lessonMatch) divergences.push("lesson");
  if (!equivalence.rewardMatch) divergences.push("reward");
  if (!equivalence.hookMatch) divergences.push("hook");
  if (!equivalence.ctaMatch) divergences.push("cta");
  const equivalenceOk = divergences.length === 0;

  const notes = [
    exceeded
      ? `Lexical similarity ${sim} exceeds ${threshold} — these read as one script, not two reading levels.`
      : `Lexical similarity ${sim} is within ${threshold}.`,
    equivalenceOk
      ? "Both scripts carry the same lesson, reward, hook and call to action."
      : `The two scripts diverge on: ${divergences.join(", ")}. Independent drafting has changed what they teach.`,
  ].join(" ");

  return {
    lexicalSimilarity: sim,
    threshold,
    similarityExceeded: exceeded,
    equivalenceOk,
    divergences,
    // Equivalence failure is never overridable — an override says "these are
    // allowed to look alike", which says nothing about them teaching different
    // lessons.
    acceptable: equivalenceOk && (!exceeded || opts.ownerOverride === true),
    notes,
  };
}

// ---------------------------------------------------------------------------
// Category-sensitive severity grading (owner ruling 10)
// ---------------------------------------------------------------------------

export type Severity = "info" | "low" | "medium" | "high" | "critical";

const SEVERITY_ORDER: Severity[] = ["info", "low", "medium", "high", "critical"];

export function severityAtLeast(actual: Severity, minimum: Severity): boolean {
  return SEVERITY_ORDER.indexOf(actual) >= SEVERITY_ORDER.indexOf(minimum);
}

export interface BlockingRule {
  risk_category: string;
  min_severity: Severity;
  blocks_publication: boolean;
}

export interface GradableFinding {
  category: string;
  severity: Severity;
  message: string;
  field?: string;
}

export interface GradeResult {
  blocked: boolean;
  blocking: GradableFinding[];
  warnings: GradableFinding[];
  /** Categories with no rule — surfaced rather than silently ignored. */
  ungoverned: string[];
}

/**
 * Severity alone is not the gate. A HIGH finding in a safety category blocks
 * even though it is not labelled critical, while a critical voice finding does
 * not. The rules come from ce_qc_blocking_rules so the owner can change the
 * policy without a deploy.
 *
 * A finding in a category with no rule is reported as ungoverned rather than
 * dropped. Silence about an unrecognised risk category is the failure mode
 * worth avoiding here.
 */
export function gradeFindings(findings: GradableFinding[], rules: BlockingRule[]): GradeResult {
  const byCategory = new Map(rules.map((r) => [r.risk_category.toLowerCase(), r]));
  const blocking: GradableFinding[] = [];
  const warnings: GradableFinding[] = [];
  const ungoverned = new Set<string>();

  for (const f of findings) {
    const rule = byCategory.get(f.category.toLowerCase());
    if (!rule) {
      ungoverned.add(f.category);
      // Unknown category: treat critical as blocking, everything else as a
      // warning. Erring toward blocking only at the top severity keeps an
      // unmapped category from silently halting all work.
      (f.severity === "critical" ? blocking : warnings).push(f);
      continue;
    }
    const meets = severityAtLeast(f.severity, rule.min_severity);
    (meets && rule.blocks_publication ? blocking : warnings).push(f);
  }

  return {
    blocked: blocking.length > 0,
    blocking,
    warnings,
    ungoverned: [...ungoverned],
  };
}

// ---------------------------------------------------------------------------
// Ontology leakage (owner revision: contextual, not a word list)
// ---------------------------------------------------------------------------

/**
 * Internal framework vocabulary that should not appear in consumer copy. These
 * are not forbidden words — they are words that mean something specific inside
 * the framework and something vaguer outside it, so a script using them is
 * usually leaking internal structure rather than teaching.
 */
export const ONTOLOGY_TERMS = [
  "developmental task",
  "competency",
  "competencies",
  "behavioral indicator",
  "structural context",
  "domain score",
  "phase mapping",
  "relational life cycle framework",
  "observable expression",
  "consumer translation",
  "incomplete indicator",
] as const;

export interface LeakageFinding {
  term: string;
  excerpt: string;
}

/**
 * Contextual: a term only counts when it appears in the consumer-facing script
 * body. The same word inside a rationale or a mapping note is the system
 * describing itself, which is correct and must not be flagged.
 */
export function detectOntologyLeakage(consumerText: string): LeakageFinding[] {
  const out: LeakageFinding[] = [];
  const text = consumerText ?? "";
  for (const term of ONTOLOGY_TERMS) {
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    const m = re.exec(text);
    if (m) {
      const start = Math.max(0, m.index - 60);
      out.push({ term, excerpt: text.slice(start, m.index + term.length + 60).trim() });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Culture terms (owner ruling 11)
// ---------------------------------------------------------------------------

export interface CultureTerm {
  term: string;
  disposition: "blocked" | "allowed_public" | "internal_only";
}

export interface CultureFinding {
  term: string;
  disposition: string;
  excerpt: string;
}

/**
 * Blocked by default. Only terms the owner has explicitly marked
 * `allowed_public` may appear in consumer copy; `internal_only` and `blocked`
 * both fail, for different reasons that the message preserves.
 */
export function scanCultureTerms(consumerText: string, terms: CultureTerm[]): CultureFinding[] {
  const out: CultureFinding[] = [];
  const text = consumerText ?? "";
  for (const t of terms) {
    if (t.disposition === "allowed_public") continue;
    const re = new RegExp(`\\b${t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    const m = re.exec(text);
    if (m) {
      const start = Math.max(0, m.index - 50);
      out.push({
        term: t.term,
        disposition: t.disposition,
        excerpt: text.slice(start, m.index + t.term.length + 50).trim(),
      });
    }
  }
  return out;
}
