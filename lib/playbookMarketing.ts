import { getSupabaseAdminClient } from "@/lib/supabase";
import { PLAYBOOK_CLUSTERS } from "@/lib/snapshot/playbooks";

// Marketing/sales data for the public Playbook pages. Grounded in the real
// per-cluster copy authored in snapshot_clusters (subtitle, why, takeaway,
// pattern). Public-safe fields only.

export const PLAYBOOK_PRICE_DISPLAY = "$29.99";

// Stable, SEO-friendly slug per playbook cluster. Keep in sync with PLAYBOOK_CLUSTERS.
export const PLAYBOOK_SLUGS: Record<string, number> = {
  "moving-beyond-rejection": 1,
  "letting-someone-in": 3,
  "dating-without-losing-hope": 4,
  "trusting-your-judgment": 5,
  "finding-security": 6,
  "lean-in-or-let-go": 24,
};
const CLUSTER_TO_SLUG = new Map(Object.entries(PLAYBOOK_SLUGS).map(([slug, id]) => [id, slug]));

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

/** All published playbooks, ordered by cluster id. */
export async function getPlaybookMarketing(): Promise<PlaybookMarketing[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_clusters")
    .select("id, name, playbook_subtitle, core_pattern, why_this_playbook, key_takeaway, content_pillars")
    .in("id", [...PLAYBOOK_CLUSTERS]);
  return ((data ?? []) as ClusterRow[]).map(toMarketing).filter((p): p is PlaybookMarketing => !!p).sort((a, b) => a.clusterId - b.clusterId);
}

/** One playbook by its marketing slug, or null. */
export async function getPlaybookBySlug(slug: string): Promise<PlaybookMarketing | null> {
  const clusterId = PLAYBOOK_SLUGS[slug];
  if (!clusterId) return null;
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_clusters")
    .select("id, name, playbook_subtitle, core_pattern, why_this_playbook, key_takeaway, content_pillars")
    .eq("id", clusterId).maybeSingle();
  return data ? toMarketing(data as ClusterRow) : null;
}
