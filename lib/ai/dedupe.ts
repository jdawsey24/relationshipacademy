import { getSupabaseAdminClient } from "@/lib/supabase";
import type { DuplicateMatch } from "@/lib/ai/types";

// Duplicate detection: normalized token (Jaccard) similarity of a candidate item
// against APPROVED canonical items and other DRAFT items. Advisory only — the
// owner decides whether to continue, revise, or cancel; we never auto-reject.

const STOP = new Set(["the", "a", "an", "i", "to", "of", "and", "or", "my", "me", "is", "in", "on", "that", "with", "when", "we", "them", "they", "it"]);

function tokens(t: string): Set<string> {
  return new Set(
    (t || "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w))
  );
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

// Exposed for testing: normalized token (Jaccard) similarity of two texts, 0..1.
export function tokenSimilarity(a: string, b: string): number {
  return jaccard(tokens(a), tokens(b));
}

export async function findDuplicateItems(text: string, opts: { competencyId?: string; excludeDraftId?: string; threshold?: number } = {}): Promise<DuplicateMatch[]> {
  const threshold = opts.threshold ?? 0.5;
  const target = tokens(text);
  if (target.size === 0) return [];
  const s = getSupabaseAdminClient();
  const matches: DuplicateMatch[] = [];

  try {
    let aq = s.from("studio_assessment_items").select("item_id, item_text").limit(2000);
    if (opts.competencyId) aq = aq.eq("competency_id", opts.competencyId);
    const { data: approved } = await aq;
    for (const r of approved ?? []) {
      const x = r as { item_id: string; item_text: string | null };
      const sim = jaccard(target, tokens(x.item_text ?? ""));
      if (sim >= threshold) matches.push({ source: "approved", id: x.item_id, text: x.item_text ?? "", similarity: Number(sim.toFixed(2)) });
    }
    const { data: drafts } = await s
      .from("ai_item_drafts").select("id, item_text").in("status", ["draft", "in_review", "changes_requested"]).limit(2000);
    for (const r of drafts ?? []) {
      const x = r as { id: string; item_text: string | null };
      if (x.id === opts.excludeDraftId) continue;
      const sim = jaccard(target, tokens(x.item_text ?? ""));
      if (sim >= threshold) matches.push({ source: "draft", id: x.id, text: x.item_text ?? "", similarity: Number(sim.toFixed(2)) });
    }
  } catch {
    return [];
  }
  return matches.sort((a, b) => b.similarity - a.similarity).slice(0, 8);
}
