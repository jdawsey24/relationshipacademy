import { getSupabaseAdminClient } from "@/lib/supabase";

// Where the piece is going, and what that changes.
//
// The keyword sheet is already in ce_platform_keywords: 270 phrases across seven
// platforms, each with the phrase people actually type, the doorway sentence,
// how to use it in the opening, supporting terms, the format that performs, and
// the call to action that fits.
//
// The part that matters most is not the keywords. It is that FOUR OF THE SEVEN
// ARE NOT VIDEO. Threads wants an observation or a mini-thread, X wants a post
// or a short thread, LinkedIn wants an insight post, Pinterest wants a pin.
// Writing a spoken script to camera for those is writing the wrong artefact, and
// every rule about breathing points and line breaks belongs to the spoken ones.

export type Delivery = "spoken" | "written";

export interface Platform {
  value: string;
  label: string;
  delivery: Delivery;
  /** One line, so the screen says what changes rather than only the name. */
  note: string;
}

export const PLATFORMS: Platform[] = [
  { value: "tiktok", label: "TikTok", delivery: "spoken", note: "Said to camera, or a stitch" },
  { value: "instagram", label: "Instagram", delivery: "spoken", note: "Reel, sometimes with a carousel after" },
  { value: "youtube", label: "YouTube", delivery: "spoken", note: "Short, said to camera" },
  { value: "threads", label: "Threads", delivery: "written", note: "Written. An observation or a short thread" },
  { value: "x", label: "X", delivery: "written", note: "Written. A post or a short thread" },
  { value: "linkedin", label: "LinkedIn", delivery: "written", note: "Written. An insight post" },
  { value: "pinterest", label: "Pinterest", delivery: "written", note: "Written. A pin that gets saved" },
];

export const platformFor = (value?: string | null) =>
  PLATFORMS.find((p) => p.value === value) ?? null;

export const isValidPlatform = (value: string) => !value || PLATFORMS.some((p) => p.value === value);

export interface Keyword {
  primary_phrase: string;
  audience_doorway: string | null;
  rlc_interpretation: string | null;
  opening_use: string | null;
  supporting_terms: string[] | null;
  best_format: string | null;
  cta_fit: string | null;
  priority_tier: string | null;
  opportunity_score: number | null;
  rank: number | null;
}

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "to", "of", "in", "on", "for", "with", "is",
  "it", "that", "this", "i", "you", "he", "she", "they", "we", "my", "your", "his",
  "her", "them", "about", "want", "just", "so", "do", "does", "how", "why", "what",
  "be", "been", "was", "were", "are", "not", "no", "if", "at", "as", "by", "from",
]);

const words = (s: string) =>
  (s ?? "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

/**
 * How well a phrase fits what she wrote.
 *
 * Weighted rather than a flat overlap: the phrase itself is what people type
 * into a search box and matters most, the doorway sentence is how they describe
 * the feeling, the supporting terms are context. Ties break on the sheet's own
 * opportunity score, so an even match prefers the phrase her research already
 * ranked higher.
 */
export function scoreKeyword(idea: string, k: Keyword): number {
  const want = new Set(words(idea));
  if (!want.size) return (k.opportunity_score ?? 0) / 1000;

  const hits = (text: string) => {
    const has = words(text).filter((w) => want.has(w)).length;
    return has / Math.max(1, new Set(words(text)).size);
  };

  const score =
    hits(k.primary_phrase) * 3 +
    hits(k.audience_doorway ?? "") * 2 +
    hits((k.supporting_terms ?? []).join(" ")) * 1;

  return score + (k.opportunity_score ?? 0) / 1000;
}

/** The phrases worth showing her for this platform, best fit first. */
export async function matchKeywords(platform: string, idea: string, limit = 5): Promise<Keyword[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ce_platform_keywords")
    .select("primary_phrase, audience_doorway, rlc_interpretation, opening_use, supporting_terms, best_format, cta_fit, priority_tier, opportunity_score, rank")
    .eq("platform", platform);
  const rows = (data ?? []) as unknown as Keyword[];
  return rows
    .map((k) => ({ k, score: scoreKeyword(idea, k) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.k);
}

/**
 * What the writing stages are told about the destination.
 *
 * Includes the chosen phrase's own opening guidance when there is one, because
 * "use this in the first sentence" is the whole point of having the sheet.
 */
export function platformBrief(platform: Platform | null, keywords: Keyword[], chosen?: string | null): string {
  if (!platform) {
    return "Not decided. Write it as a spoken script to camera, which is the safe default.";
  }

  const lines = [
    `${platform.label}. ${platform.note}.`,
    platform.delivery === "spoken"
      ? "This is spoken out loud. Line breaks are breathing points."
      : "This is READ, not spoken. No stage directions, no shoot instructions, and no " +
        "\"stitch this clip\". It is a written post, and it has to work in silence on a screen.",
  ];

  const pick = keywords.find((k) => k.primary_phrase === chosen) ?? keywords[0];
  if (pick) {
    lines.push("");
    lines.push(`Phrase to land: "${pick.primary_phrase}"`);
    if (pick.opening_use) lines.push(`How it is meant to be used: ${pick.opening_use}`);
    if (pick.audience_doorway) lines.push(`How she would say it herself: ${pick.audience_doorway}`);
    if (pick.supporting_terms?.length) lines.push(`Worth working in: ${pick.supporting_terms.join(", ")}`);
    if (pick.best_format) lines.push(`Format that works here: ${pick.best_format}`);
    if (pick.cta_fit) lines.push(`What usually closes this one: ${pick.cta_fit}`);
    lines.push("");
    lines.push(
      "Use the phrase because it is how people describe this, not because it is a keyword. " +
      "If it will not sit naturally in her voice, leave it out and say so.",
    );
  }
  return lines.join("\n");
}
