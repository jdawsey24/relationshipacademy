import { getSupabaseAdminClient } from "@/lib/supabase";
import { PLAYBOOK_CLUSTERS } from "@/lib/snapshot/playbooks";
import { DRAFT_PLAYBOOK_KEY_TO_CLUSTER, CLUSTER_PRIMARY_KEY, PAIRED_KEY_TO_CLUSTER, PAIRED_KEYS } from "@/lib/playbook/keys";
import { getPlaybookContent } from "@/content/playbook";

// Marketing/sales data for the public Playbook pages. Grounded in the real
// per-cluster copy authored in snapshot_clusters (subtitle, why, takeaway,
// pattern). Public-safe fields only.

export const PLAYBOOK_PRICE_DISPLAY = "$29.99";

// Stable, SEO-friendly slug per playbook cluster (slug == playbook_key). Gated
// with the corpus flag so it stays in lockstep with PLAYBOOK_CLUSTERS:
//   • OFF (production today): only the pre-corpus set {1,3,4,5,6,24}.
//   • ON: every corpus Playbook, derived from the keys.ts source of truth so the
//     two can't drift. Paired modules (reserved 900+ ids) ARE slug-based standalone
//     products; their pages/cards are sourced from the content registry (no
//     snapshot_clusters row). Add-ons (900-block) are intentionally NOT slug-based —
//     they sell from the /playbooks index via AddonsForSale, not a detail page.
const CORPUS_ENABLED = process.env.NEXT_PUBLIC_PLAYBOOK_CORPUS === "true";
export const PLAYBOOK_SLUGS: Record<string, number> = CORPUS_ENABLED
  ? { "finding-love-that-feels-mutual": 1, ...DRAFT_PLAYBOOK_KEY_TO_CLUSTER, ...PAIRED_KEY_TO_CLUSTER }
  : {
      "finding-love-that-feels-mutual": 1,
      "how-to-let-someone-in": 3,
      "dating-without-losing-hope": 4,
      "trust-yourself-to-choose-better": 5,
      "the-relationship-overthinkers-playbook": 6,
      "is-this-going-somewhere": 24,
    };

// Reverse map id→slug. Each cluster now maps to a single slug (the C12/C21 paired modules
// split out to their own ids), so this is effectively first-wins; CLUSTER_PRIMARY_KEY
// is honored if any future cluster maps to more than one slug (mirrors keys.ts).
const CLUSTER_TO_SLUG = new Map<number, string>();
for (const [slug, id] of Object.entries(PLAYBOOK_SLUGS)) {
  const primary = CLUSTER_PRIMARY_KEY[id];
  if (primary) CLUSTER_TO_SLUG.set(id, primary);
  else if (!CLUSTER_TO_SLUG.has(id)) CLUSTER_TO_SLUG.set(id, slug);
}

export interface PlaybookMarketing {
  clusterId: number;
  slug: string;
  name: string;              // internal cluster name (the pattern)
  subtitle: string;          // playbook_subtitle — the consumer-facing playbook name
  corePattern: string | null;
  why: string | null;        // "this playbook will help you…"
  keyTakeaway: string | null;
  pillars: string[];
}

interface ClusterRow {
  id: number; name: string; playbook_subtitle: string | null; core_pattern: string | null;
  why_this_playbook: string | null; key_takeaway: string | null; content_pillars: unknown;
}

function toMarketing(c: ClusterRow): PlaybookMarketing | null {
  const slug = CLUSTER_TO_SLUG.get(c.id);
  if (!slug) return null;
  return {
    clusterId: c.id, slug, name: c.name,
    subtitle: c.playbook_subtitle || c.name,
    corePattern: c.core_pattern, why: c.why_this_playbook, keyTakeaway: c.key_takeaway,
    pillars: Array.isArray(c.content_pillars) ? (c.content_pillars as string[]) : [],
  };
}

// Paired modules have no snapshot_clusters row (their id is a reserved 900+ pseudo-id),
// so their marketing is sourced from the authored content registry. The optional
// marketing sections (pillars, keyTakeaway) simply don't render when absent.
function pairedMarketing(slug: string): PlaybookMarketing | null {
  const clusterId = PAIRED_KEY_TO_CLUSTER[slug];
  const c = getPlaybookContent(slug);
  if (clusterId == null || !c) return null;
  const body = c.opening?.body ?? [];
  return {
    clusterId,
    slug,
    name: c.displayName,
    subtitle: c.displayName,
    corePattern: c.opening?.title ?? null,
    why: body.length ? body.join(" ") : null,
    keyTakeaway: null,
    pillars: [],
  };
}

/** All published playbooks, ordered by cluster id. */
export async function getPlaybookMarketing(): Promise<PlaybookMarketing[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_clusters")
    .select("id, name, playbook_subtitle, core_pattern, why_this_playbook, key_takeaway, content_pillars")
    .in("id", [...PLAYBOOK_CLUSTERS]);
  const dbCards = ((data ?? []) as ClusterRow[]).map(toMarketing).filter((p): p is PlaybookMarketing => !!p);
  // Paired-module cards (only when slug-enabled, i.e. the corpus flag is on).
  const pairedCards = PAIRED_KEYS
    .filter((slug) => slug in PLAYBOOK_SLUGS)
    .map(pairedMarketing)
    .filter((p): p is PlaybookMarketing => !!p);
  return [...dbCards, ...pairedCards].sort((a, b) => a.clusterId - b.clusterId);
}

/** One playbook by its marketing slug, or null. */
export async function getPlaybookBySlug(slug: string): Promise<PlaybookMarketing | null> {
  const clusterId = PLAYBOOK_SLUGS[slug];
  if (!clusterId) return null;
  // Paired modules are content-sourced (no snapshot_clusters row).
  if (PAIRED_KEY_TO_CLUSTER[slug] != null) return pairedMarketing(slug);
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_clusters")
    .select("id, name, playbook_subtitle, core_pattern, why_this_playbook, key_takeaway, content_pillars")
    .eq("id", clusterId).maybeSingle();
  return data ? toMarketing(data as ClusterRow) : null;
}
