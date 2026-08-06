// Trend normalization and de-duplication.
//
// Two jobs, both pure and both testable without a database:
//
//  1. SANITIZE. `raw_input` is whatever was pasted — a URL, a phrase, or the body
//     of someone else's post. It is UNTRUSTED. Post text is the most likely
//     prompt-injection vector in the whole engine, because the engine's job is to
//     read strangers' words and then talk to a model about them. Everything here
//     treats that text as data.
//
//  2. DEDUPE. The same topic gets entered more than once, spelled differently
//     each time ("the Fauci thing", "Fauci COVID interview", "fauci"). A stable
//     dedupe_key merges those into one candidate instead of three.

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "has",
  "he", "in", "is", "it", "its", "of", "on", "or", "she", "that", "the", "they",
  "this", "to", "was", "were", "will", "with", "about", "into", "over", "after",
  "thing", "stuff", "just", "really", "very",
]);

/**
 * Instruction-shaped patterns that must never survive into a prompt.
 *
 * This is defence in depth, not the primary control: retrieved text is passed to
 * the model inside a delimited data block and the system prompt says to treat it
 * as reported content. Stripping the obvious imperatives as well means a single
 * mistake downstream is not sufficient for an injection to land.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /\bignore\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)\b/gi,
  /\bdisregard\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier)\b/gi,
  /\b(you\s+are\s+now|from\s+now\s+on|act\s+as|pretend\s+to\s+be|roleplay\s+as)\b/gi,
  /\b(system|assistant|developer)\s*(prompt|message|instruction)s?\s*:/gi,
  /\b(new|updated|revised)\s+(instructions?|system\s+prompt)\b/gi,
  /\boverride\s+(your\s+)?(instructions?|guidelines?|rules?|safety)\b/gi,
  /\breveal\s+(your\s+)?(system\s+prompt|instructions?|rules?)\b/gi,
  /<\/?(system|assistant|user|instructions?)>/gi,
];

export interface SanitizeResult {
  text: string;
  /** True when something instruction-shaped was removed — surfaced in the UI, and worth a look. */
  strippedInjection: boolean;
  removed: string[];
}

/** Strip instruction-shaped content and control characters from untrusted input. */
export function sanitizeUntrusted(raw: string, maxLength = 8000): SanitizeResult {
  const removed: string[] = [];
  // eslint-disable-next-line no-control-regex
  let text = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ");

  for (const rx of INJECTION_PATTERNS) {
    text = text.replace(rx, (m) => {
      removed.push(m.trim());
      return "[removed]";
    });
  }

  // Collapse the whitespace runs that let text smuggle visual structure.
  text = text.replace(/\s{3,}/g, "  ").replace(/\n{3,}/g, "\n\n").trim();
  if (text.length > maxLength) text = text.slice(0, maxLength) + "…";

  return { text, strippedInjection: removed.length > 0, removed };
}

/** Pull a URL out of pasted input, if there is one. */
export function extractUrl(raw: string): string | null {
  const m = raw.match(/https?:\/\/[^\s<>"')]+/);
  return m ? m[0] : null;
}

/**
 * Human-readable name for a candidate. A pasted URL becomes its slug; pasted
 * prose becomes its first meaningful clause — never the whole post.
 */
export function canonicalName(raw: string): string {
  const url = extractUrl(raw);
  const source = url && raw.trim() === url
    ? decodeURIComponent(url.split("?")[0].split("/").filter(Boolean).slice(-1)[0] ?? url)
        .replace(/[-_]+/g, " ")
        .replace(/\.\w{2,4}$/, "")
    : raw;

  const firstClause = source.split(/[.!?\n]/)[0] ?? source;
  const cleaned = firstClause.replace(/\s+/g, " ").trim();
  if (!cleaned) return "untitled trend";
  return cleaned.length > 120 ? cleaned.slice(0, 117).trimEnd() + "…" : cleaned;
}

/**
 * Stable key so the same topic entered twice merges rather than duplicating.
 * Lowercased, punctuation-stripped, stop-worded, sorted — so word order and
 * filler words don't create a second candidate.
 */
export function dedupeKey(raw: string): string {
  const url = extractUrl(raw);
  if (url && raw.trim() === url) {
    // A URL is its own identity — strip query/fragment so tracking params don't split it.
    try {
      const u = new URL(url);
      return `url:${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
    } catch {
      /* fall through to text handling */
    }
  }

  const tokens = canonicalName(raw)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t && t.length > 2 && !STOP_WORDS.has(t));

  const unique = [...new Set(tokens)].sort();
  return unique.length ? unique.join("-") : `raw:${raw.trim().toLowerCase().slice(0, 60)}`;
}

/** Loose similarity for "have we covered this recently?" checks. */
export function tokenOverlap(a: string, b: string): number {
  const set = (s: string) => new Set(dedupeKey(s).split("-").filter(Boolean));
  const A = set(a), B = set(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared++;
  return shared / Math.min(A.size, B.size);
}
