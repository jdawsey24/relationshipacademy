// Client-safe, pure readability utilities. Single source of truth for the
// Flesch-Kincaid reading-level math so the server quality engine
// (lib/ai/quality.ts) and the Studio Assistant panel never drift. No imports —
// safe in both server and client code.

/** Lowercased word tokens (letters + apostrophes only). */
export function words(t: string): string[] {
  return t.toLowerCase().replace(/[^a-z'\s]/g, " ").split(/\s+/).filter(Boolean);
}

/** Rough syllable count for a single word (min 1). */
export function syllables(w: string): number {
  const m = w.toLowerCase().replace(/[^a-z]/g, "").replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, m ? m.length : 1);
}

/** Sentence count (min 1) — terminal punctuation runs. */
export function sentenceCount(t: string): number {
  return Math.max(1, (t.match(/[.!?]+/g) || []).length);
}

/** Flesch-Kincaid grade level. Identical formula to the prior inline version in
 *  lib/ai/quality.ts. Returns 0 for empty text. */
export function fkGrade(t: string): number {
  const ws = words(t);
  if (ws.length === 0) return 0;
  const syl = ws.reduce((a, w) => a + syllables(w), 0);
  const sentences = sentenceCount(t);
  return 0.39 * (ws.length / sentences) + 11.8 * (syl / ws.length) - 15.59;
}

/** Plain-language reading-ease band for a FK grade. */
export function easeLabel(grade: number): string {
  if (grade <= 3) return "Very easy";
  if (grade <= 5) return "Easy";
  if (grade <= 8) return "Fairly easy";
  if (grade <= 12) return "Moderate";
  return "Difficult";
}

export interface ReadabilityStats {
  words: number;
  sentences: number;
  syllables: number;
  fkGrade: number; // rounded to 1 decimal
  easeLabel: string;
  reliable: boolean; // false when the sample is too short to trust
}

const MIN_RELIABLE_WORDS = 50;

/** Full readability summary for a text sample, used by the Studio Assistant's
 *  reading-level helper. Deterministic — no AI, no network. */
export function readabilityStats(text: string): ReadabilityStats {
  const ws = words(text);
  const wordCount = ws.length;
  const sentences = sentenceCount(text);
  const syl = ws.reduce((a, w) => a + syllables(w), 0);
  const grade = Math.round(fkGrade(text) * 10) / 10;
  return {
    words: wordCount,
    sentences,
    syllables: syl,
    fkGrade: grade,
    easeLabel: easeLabel(grade),
    reliable: wordCount >= MIN_RELIABLE_WORDS,
  };
}

export const READABILITY_MIN_WORDS = MIN_RELIABLE_WORDS;
