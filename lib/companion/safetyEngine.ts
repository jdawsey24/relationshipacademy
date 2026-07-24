// Deterministic safety-detection engine (V2) — PURE. No DB, no I/O, no network.
// Given free text + a rule set, it returns a structured classification. Because it
// is pure it is exhaustively unit-testable (see test/safety.test.ts) and it never
// sends a learner's raw disclosure anywhere. The server wrapper (lib/companion/
// safety.ts) loads the rule set from the versioned registry, calls classify(),
// logs METADATA-ONLY events, and builds the user-facing response.
//
// Design principles (owner-directed):
//  - Context-aware, NOT naive keyword match: subject, negation, temporality, and
//    immediacy are evaluated per matched CLAUSE, not across the whole text.
//  - Multiple categories may fire at once — findings are an array, not one winner.
//  - immediate_danger requires an actionable disclosure AND a strong present-danger
//    signal; an immediacy WORD alone ("right now", "tonight") never escalates.
//  - Suppression (negation / media / hypothetical) is conservative — a genuine
//    disclosure in a later clause is never discarded because an earlier clause
//    was negated or referenced media.
//  - Absence of a trigger is NOT a finding of safety. action_level 0 means
//    "no_safety_signal_detected", never "safe".

export const SAFETY_ENGINE_VERSION = "2.0.0";

export type RiskCategory = "self_harm" | "ipv" | "sexual_coercion" | "harm_to_others";
export type Subject = "user" | "third_party" | "media" | "hypothetical";
export type Temporality = "current" | "recent" | "historical" | "unknown";
export type Severity = 1 | 2 | 3;
export type ActionLevel = 0 | 1 | 2 | 3;

// Strong immediacy kinds indicate present danger on their own (combined with an
// actionable disclosure). "temporal" (right now / tonight) is deliberately weak:
// it only sharpens temporality and never, by itself, produces immediate_danger.
export type ImmediacyKind =
  | "intent"       // "about to do it", "going to do it tonight"
  | "active_act"   // "already took the pills"
  | "weapon"       // "he has a gun", "I have the gun with me"
  | "confinement"  // "won't let me leave", "hiding from him"
  | "escalation"   // "threatening me right now", "afraid he's going to kill me"
  | "temporal";    // "right now", "tonight" — WEAK, never escalates alone

export interface SafetyRule {
  id: string;
  risk_category: RiskCategory;
  canonical_concept: string;   // groups phrasings, e.g. "suicidal_intent"
  pattern: string;
  match_type: "phrase" | "keyword" | "regex";
  severity: Severity;          // authored from behavior, not from a bare word
  context_required: boolean;   // apply subject (media/hypothetical/3p) suppression
  negation_sensitive: boolean; // apply per-clause negation suppression
  // If this concept, when it appears with a strong immediacy signal, should be
  // treated as itself an act (e.g. an overdose disclosure). Optional.
  self_directed_act?: boolean;
}

export interface ImmediacyTerm {
  id: string;
  pattern: string;
  match_type: "phrase" | "keyword" | "regex";
  kind: ImmediacyKind;
  // Optional category this term implies when it stands as its own disclosure
  // (e.g. "already took the pills" → self_harm). Used only for strong kinds.
  implies_category?: RiskCategory;
}

export interface RuleSet {
  rules: SafetyRule[];
  immediacyTerms: ImmediacyTerm[];
  registry_version: string;
}

// "unknown" = an acute signal (e.g. a weapon + anaphoric intent) with no
// determinable category. It stays UNDETERMINED rather than defaulting to any
// category — routing then uses emergency + general crisis support.
export type FindingCategory = RiskCategory | "unknown";

export interface Finding {
  ruleId: string;
  risk_category: FindingCategory;
  canonical_concept: string;
  severity: Severity;
  subject: Subject;
  negated: boolean;         // matched but suppressed by negation (kept for audit)
  temporality: Temporality;
  actionable: boolean;      // survived suppression → contributes to routing
}

export interface Classification {
  findings: Finding[];
  categories: RiskCategory[];      // distinct actionable categories (excludes "unknown")
  category_undetermined: boolean;  // an actionable acute signal had no category
  immediate_danger: boolean;
  action_level: ActionLevel;       // 0 = no_safety_signal_detected
  immediacy_kinds: ImmediacyKind[];
  engine_version: string;
  registry_version: string;
}

// ---------------------------------------------------------------------------
// Lexicons (structural language cues, NOT clinical trigger content). These are
// grammar, not the risk vocabulary — the risk vocabulary lives in the registry.
// ---------------------------------------------------------------------------

const NEGATION = /\b(?:not|never|no|none|nobody|nothing|without|hardly|barely|didn'?t|doesn'?t|don'?t|wasn'?t|weren'?t|isn'?t|aren'?t|hasn'?t|haven'?t|hadn'?t|won'?t|wouldn'?t|can'?t|cannot|couldn'?t|shouldn'?t|ain'?t)\b/gi;

// Contrastive reversal that can UN-negate a prior clause: "...never hit me, but
// he actually did." Requires a reversal cue + an affirmation verb.
const REVERSAL_CUE = /\b(?:but|however|actually|really|truth is|in reality|turns out|realized|realised|finally admitted)\b/i;
const AFFIRMATION = /\b(?:did|does|do|was|were|is|are|has|had|have)\b/i;

const MEDIA = /\b(?:movie|movies|film|films|tv|television|show|shows|series|episode|book|books|novel|article|news|documentary|character|characters|on screen|scene|read about|saw (?:it|someone|a)\b|watched)\b/i;
const HYPOTHETICAL = /\b(?:what if|imagine|suppose|hypothetically|would it be|if (?:someone|a person|he|she|they) (?:were|was)|in theory)\b/i;
const THIRD_PARTY = /\b(?:my friend|a friend|my (?:co-?worker|coworker|neighbou?r|sister|brother|mom|mother|dad|father|cousin|client)|someone i know|a woman i know|a man i know)\b/i;

// Personalization: even amid a media/3p clause, these mark it as the user's own
// situation ("...does the same thing to me", "my husband does that to me").
const PERSONAL = /\b(?:to me|happening to me|does (?:the same|that|this) to me|my (?:husband|wife|partner|boyfriend|girlfriend|spouse|ex)\b|he does (?:it|that|the same) to me|the same thing to me)\b/i;

const TEMPORAL_CURRENT = /\b(?:right now|currently|as we speak|at this moment|tonight|today|this (?:morning|afternoon|evening)|these days|is here now|here right now)\b/i;
const TEMPORAL_RECENT = /\b(?:last night|yesterday|this week|last week|recently|the other (?:day|night)|a few days ago|just now|earlier)\b/i;
const TEMPORAL_HISTORICAL = /\b(?:used to|years ago|a long time ago|back then|when i was (?:younger|a (?:kid|child|teenager))|in the past|growing up|my ex\b|former (?:partner|husband|wife))\b/i;

// ---------------------------------------------------------------------------
// Matching
// ---------------------------------------------------------------------------

function escapeRe(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

// Normalize typographic apostrophes/quotes so "won't" (curly) matches "won't".
function normApostrophes(s: string): string { return s.replace(/[‘’ʼ`´]/g, "'"); }

/** Does a pattern occur in this clause? Returns the match index or -1. */
function findMatch(clause: string, pattern: string, matchType: string): number {
  const norm = normApostrophes(clause);
  const hay = norm.toLowerCase();
  const needle = normApostrophes(pattern).toLowerCase().trim();
  if (!needle) return -1;
  if (matchType === "regex") {
    try { const m = new RegExp(normApostrophes(pattern), "i").exec(norm); return m ? m.index : -1; } catch { return -1; }
  }
  if (matchType === "phrase") return hay.indexOf(needle);
  // keyword: whole-word
  const m = new RegExp(`(?:^|[^a-z0-9])${escapeRe(needle)}(?:[^a-z0-9]|$)`, "i").exec(hay);
  return m ? m.index : -1;
}

// ---------------------------------------------------------------------------
// Clause segmentation — split only on sentence enders / semicolons / newlines.
// We deliberately DO NOT split on "and" (so co-disclosures like "threatened me
// and forced me" both fire) NOR on "but" — splitting on "but" would break
// multi-clause patterns such as "I said no but they kept going". Instead, "but"
// (and other contrastive cues) reset the NEGATION scope locally (see below), so
// "…wasn't abusing me, but he was hitting me" still classifies the affirmative
// clause without discarding a genuine disclosure.
// ---------------------------------------------------------------------------

export interface Clause { text: string; index: number }

// Contrastive boundary — negation before it does not reach a match after it.
const CONTRAST = /\b(?:but|however|yet|although|though)\b/gi;

export function splitClauses(text: string): Clause[] {
  const parts: Clause[] = [];
  const regex = /[.!?;\n]+/g;
  let last = 0; let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const seg = text.slice(last, m.index);
    if (seg.trim()) parts.push({ text: seg, index: last });
    last = m.index + m[0].length;
  }
  const tail = text.slice(last);
  if (tail.trim()) parts.push({ text: tail, index: last });
  return parts.length ? parts : [{ text, index: 0 }];
}

// ---------------------------------------------------------------------------
// Per-clause context analysis
// ---------------------------------------------------------------------------

/**
 * Negation before the match, scoped LOCALLY. A contrastive cue ("but"/"however")
 * between a negation and the match cancels it — so "he wasn't abusing me, but he
 * was hitting me" does NOT read "hitting me" as negated. Only cues within ~7
 * words of the match count, to avoid a stray far-off "not" suppressing an act.
 */
function isNegated(clause: string, matchIndex: number): boolean {
  // Restrict the search window to after the last contrastive boundary.
  let scopeStart = 0;
  CONTRAST.lastIndex = 0;
  let c: RegExpExecArray | null;
  while ((c = CONTRAST.exec(clause)) !== null) {
    if (c.index < matchIndex) scopeStart = c.index + c[0].length; else break;
  }
  const before = clause.slice(scopeStart, matchIndex);
  NEGATION.lastIndex = 0;
  let m: RegExpExecArray | null; let negged = false;
  while ((m = NEGATION.exec(before)) !== null) {
    const between = before.slice(m.index).split(/\s+/).length;
    if (between <= 7) negged = true;
  }
  return negged;
}

function subjectOf(clause: string): Subject {
  const personal = PERSONAL.test(clause);
  // Personalization wins: "saw it on TV and realized my husband does that to me".
  if (personal) return "user";
  if (HYPOTHETICAL.test(clause)) return "hypothetical";
  if (MEDIA.test(clause)) return "media";
  if (THIRD_PARTY.test(clause)) return "third_party";
  return "user"; // default: first-person disclosure
}

function temporalityOf(clause: string): Temporality {
  if (TEMPORAL_CURRENT.test(clause)) return "current";
  if (TEMPORAL_RECENT.test(clause)) return "recent";
  if (TEMPORAL_HISTORICAL.test(clause)) return "historical";
  return "unknown";
}

// ---------------------------------------------------------------------------
// Immediacy detection — evaluated across the whole text but classified by kind.
// ---------------------------------------------------------------------------

function detectImmediacy(text: string, terms: ImmediacyTerm[]): { kind: ImmediacyKind; term: ImmediacyTerm }[] {
  const hits: { kind: ImmediacyKind; term: ImmediacyTerm }[] = [];
  for (const t of terms) {
    if (findMatch(text, t.pattern, t.match_type) >= 0) hits.push({ kind: t.kind, term: t });
  }
  return hits;
}

// Kinds that indicate present danger on their OWN (combined with an actionable
// disclosure). confinement is deliberately excluded — per owner guidance an
// "inability to leave" disclosure escalates to immediate_danger only ALONGSIDE a
// present-tense cue (a "temporal" term or a current temporal marker), not by
// itself (so a described ongoing pattern is not treated as a present emergency).
const INHERENT_IMMEDIACY: ImmediacyKind[] = ["intent", "active_act", "weapon", "escalation"];
// Kinds that ARE their own acute disclosure (an act/means/stated intent) and so
// can stand as an actionable finding even when the risk itself is anaphoric
// ("I have the gun with me and I'm going to do it").
const SELF_STANDING_IMMEDIACY: ImmediacyKind[] = ["intent", "active_act", "weapon"];

// ---------------------------------------------------------------------------
// classify — the entry point
// ---------------------------------------------------------------------------

export function classify(text: string, ruleSet: RuleSet): Classification {
  const base: Classification = {
    findings: [], categories: [], category_undetermined: false,
    immediate_danger: false, action_level: 0, immediacy_kinds: [],
    engine_version: SAFETY_ENGINE_VERSION, registry_version: ruleSet.registry_version,
  };
  if (!text || !text.trim()) return base;

  const clauses = splitClauses(text);
  const findings: Finding[] = [];

  clauses.forEach((clause, ci) => {
    for (const rule of ruleSet.rules) {
      const idx = findMatch(clause.text, rule.pattern, rule.match_type);
      if (idx < 0) continue;

      const subject = rule.context_required ? subjectOf(clause.text) : "user";
      const negated = rule.negation_sensitive ? isNegated(clause.text, idx) : false;
      const temporality = temporalityOf(clause.text);

      // Suppressed if this clause negates it, or (context_required) it is clearly
      // about media/a hypothetical/a third party rather than the user.
      const subjectSuppressed = rule.context_required && subject !== "user";
      let actionable = !negated && !subjectSuppressed;

      // Reversal recovery: a negated match is re-activated if a contrastive cue
      // affirms it — either later in the SAME clause ("…he never hit me, but he
      // actually did") or in a subsequent clause.
      if (negated) {
        const restOfClause = clause.text.slice(idx);
        const affirms = (t: string) => REVERSAL_CUE.test(t) && AFFIRMATION.test(t);
        if (affirms(restOfClause) || clauses.slice(ci + 1).some((c) => affirms(c.text))) {
          actionable = !subjectSuppressed;
        }
      }

      findings.push({
        ruleId: rule.id, risk_category: rule.risk_category,
        canonical_concept: rule.canonical_concept, severity: rule.severity,
        subject, negated: negated && !actionable, temporality, actionable,
      });
    }
  });

  // Immediacy signals across the whole disclosure.
  const immediacy = detectImmediacy(text, ruleSet.immediacyTerms);
  const immediacyKinds = Array.from(new Set(immediacy.map((h) => h.kind)));
  // A present-tense cue: an explicit "temporal" immediacy term ("right now",
  // "tonight", "here right now") or a current temporal marker in the text.
  const hasPresentCue = immediacy.some((h) => h.kind === "temporal") || TEMPORAL_CURRENT.test(text);
  const hasStrongImmediacy =
    immediacy.some((h) => INHERENT_IMMEDIACY.includes(h.kind)) ||
    (immediacy.some((h) => h.kind === "confinement") && hasPresentCue);

  // A self-standing immediacy term (an act / means / stated intent) stands as its
  // own actionable finding even when no risk PATTERN matched. Its category is the
  // AUTHORED implies_category if present (e.g. an overdose → self_harm); a
  // category-neutral term (a weapon) with no co-occurring finding stays
  // "unknown" (UNDETERMINED) — it is never defaulted to a specific category.
  for (const h of immediacy) {
    if (!SELF_STANDING_IMMEDIACY.includes(h.kind)) continue;
    if (h.term.implies_category) {
      if (!findings.some((f) => f.actionable && f.risk_category === h.term.implies_category)) {
        findings.push(acuteFinding(h.term.id, h.term.implies_category, `immediacy:${h.kind}`, text));
      }
    }
  }
  // If a category-neutral acute signal is present with no actionable finding at
  // all, record an UNDETERMINED acute finding so routing still engages.
  if (hasStrongImmediacy && !findings.some((f) => f.actionable)) {
    const neutral = immediacy.find((h) => SELF_STANDING_IMMEDIACY.includes(h.kind) && !h.term.implies_category);
    if (neutral) findings.push(acuteFinding(neutral.term.id, "unknown", `immediacy:${neutral.kind}`, text));
  }

  const actionable = findings.filter((f) => f.actionable);

  // immediate_danger: an actionable disclosure AND a STRONG present-danger signal.
  // A weak temporal marker alone ("right now", "tonight") never qualifies.
  const immediate_danger = actionable.length > 0 && hasStrongImmediacy;

  const categories = Array.from(new Set(
    actionable.map((f) => f.risk_category).filter((c): c is RiskCategory => c !== "unknown")
  ));
  const category_undetermined = actionable.some((f) => f.risk_category === "unknown");
  const maxSeverity = actionable.reduce<ActionLevel>((mx, f) => (f.severity > mx ? f.severity : mx), 0);
  const action_level: ActionLevel = actionable.length === 0 ? 0 : (immediate_danger ? 3 : maxSeverity);

  return {
    ...base,
    findings, categories, category_undetermined, immediate_danger, action_level,
    immediacy_kinds: immediacyKinds,
  };
}

function acuteFinding(ruleId: string, cat: FindingCategory, concept: string, text: string): Finding {
  return {
    ruleId, risk_category: cat, canonical_concept: concept, severity: 3,
    subject: "user", negated: false, temporality: temporalityOf(text), actionable: true,
  };
}
