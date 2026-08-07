// Language classification for the Content Studio.
//
// The distinction this module exists to make, and that the previous design got
// wrong: NAMING YOUR AUDIENCE IS NOT A GROUP CLAIM.
//
//   "Some women don't want to accept what the inconsistency means"
//        ^^^^ ^^^^^                    ^^^^^^^^^^^^^^^^^^^^^^^^^^
//        quantified audience reference — fine    the actual claim, worth testing
//
// A previous version flagged "women" and pushed the owner to remove the
// audience. That is backwards: the audience is who the content is for, and
// "some" already disclaims universality. What deserves a question is the
// psychological attribution, because that is the part that could be wrong.

export type LanguageKind =
  | "audience_reference"      // names who this is for. Not a claim about all of them.
  | "universal_generalization" // "always", "all", "every" — a claim the evidence must carry
  | "empirical_claim"          // asserts a fact about the world
  | "motive_attribution"       // asserts why people do something
  | "professional_interpretation"; // a reading, offered as a reading

export interface LanguageFinding {
  kind: LanguageKind;
  excerpt: string;
  /** What the Studio would actually say. Plain language, never a category name. */
  prompt: string;
  /** True when this should be raised in conversation. Audience references never are. */
  raise: boolean;
}

/** Quantifiers that explicitly limit scope. Their presence is the disclaimer. */
const LIMITERS = /\b(some|many|a lot of|certain|often|sometimes|plenty of|most of the)\b/i;

/** Words that claim universality. These are what an overgeneralisation check is for. */
const UNIVERSALS = /\b(all|every|always|never|everyone|nobody|no one|any\s+\w+\s+will)\b/i;

/** Words naming a group the content may be addressed to. */
const AUDIENCE_NOUNS =
  /\b(women|men|people|clients|couples|singles|daters|partners|mothers|fathers|wives|husbands)\b/i;

/** Verbs that attribute an internal state or motive to someone else. */
const MOTIVE =
  /\b(don'?t want to|do not want to|refuse to|are afraid to|aren'?t (really|truly)|are not (really|truly)|secretly|deep down|really (just|only))\b/i;

/** Constructions that assert a fact about frequency, timing, or measurable reality. */
const EMPIRICAL =
  /\b(\d+\s*(%|percent)|studies show|research (shows|says)|statistics|on average|most people (know|do|report)|within (the first )?\w+ (days?|weeks?|months?|years?))\b/i;

/** Hedges that mark something as a reading rather than a fact. */
const INTERPRETIVE =
  /\b(in my experience|one way to read|i(?:'| a)?m reading|it looks like|what i see|on a framework reading|tends to)\b/i;

const sentences = (t: string) =>
  (t ?? "").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

/**
 * Classify a sentence. Order matters: an interpretive hedge or an explicit
 * limiter changes what the same words mean.
 */
export function classifySentence(sentence: string): LanguageFinding[] {
  const out: LanguageFinding[] = [];
  const s = sentence.trim();
  if (!s) return out;

  const limited = LIMITERS.test(s);
  const universal = UNIVERSALS.test(s);
  const namesGroup = AUDIENCE_NOUNS.test(s);
  const hedged = INTERPRETIVE.test(s);

  // 1. Audience reference — recorded, never raised.
  if (namesGroup && limited && !universal) {
    out.push({
      kind: "audience_reference",
      excerpt: s,
      prompt: "Names who this is for. Not a claim about all of them.",
      raise: false,
    });
  }

  // 2. Universal generalisation — this IS worth raising.
  if (universal && namesGroup) {
    out.push({
      kind: "universal_generalization",
      excerpt: s,
      prompt:
        "This says it holds for everyone. The insight usually survives without the universal, " +
        "and it stops the sentence being quoted back at you.",
      raise: true,
    });
  }

  // 3. Empirical claim — needs a source, unless hedged into a reading.
  if (EMPIRICAL.test(s) && !hedged) {
    out.push({
      kind: "empirical_claim",
      excerpt: s,
      prompt: "This reads as a fact about how common something is. It needs a source, or it can become your observation.",
      raise: true,
    });
  }

  // 4. Motive attribution — worth a question, not a correction. This is the
  //    part of "some women aren't truly confused" that is actually arguable.
  if (MOTIVE.test(s) && !hedged) {
    out.push({
      kind: "motive_attribution",
      excerpt: s,
      prompt: "This says why they're doing it. What have you seen that makes you read it that way?",
      raise: true,
    });
  }

  if (hedged) {
    out.push({
      kind: "professional_interpretation",
      excerpt: s,
      prompt: "Offered as a reading, which is the right frame for it.",
      raise: false,
    });
  }

  return out;
}

export function classifyText(text: string): LanguageFinding[] {
  return sentences(text).flatMap(classifySentence);
}

/** Only what the Studio should actually say something about. */
export function worthRaising(text: string): LanguageFinding[] {
  return classifyText(text).filter((f) => f.raise);
}
