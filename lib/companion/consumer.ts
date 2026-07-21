import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only consumer reads for the Companion app. Content tables are RLS-locked
// → service role. These return only PUBLISHED experiences and never expose draft
// or private content. Status prioritizes/filters; it never assigns a phase.

export interface ExperienceCard {
  id: string; slug: string; title: string; short_description: string | null;
  est_minutes: number | null; mode: string; universal: boolean;
}

interface PubRow {
  id: string; slug: string; title: string; consumer_title: string | null;
  short_description: string | null; est_minutes: number | null; mode: string;
}

const toCard = (r: PubRow, universal: boolean): ExperienceCard => ({
  id: r.id, slug: r.slug, title: r.consumer_title || r.title,
  short_description: r.short_description, est_minutes: r.est_minutes, mode: r.mode, universal,
});

/** All published experiences visible for a status, with include/exclude applied. */
export async function getPublishedExperiences(statusId: string | null): Promise<ExperienceCard[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data: pub } = await s.from("companion_experiences")
      .select("id, slug, title, consumer_title, short_description, est_minutes, mode")
      .eq("status", "published");
    const rows = (pub ?? []) as PubRow[];
    if (!rows.length) return [];
    const ids = rows.map((r) => r.id);
    const { data: maps } = await s.from("companion_experience_status_mappings")
      .select("experience_id, structural_status_id, mode").in("experience_id", ids);
    const byExp = new Map<string, { include: Set<string>; exclude: Set<string> }>();
    for (const m of (maps ?? []) as { experience_id: string; structural_status_id: string; mode: string }[]) {
      const e = byExp.get(m.experience_id) ?? { include: new Set(), exclude: new Set() };
      (m.mode === "exclude" ? e.exclude : e.include).add(m.structural_status_id);
      byExp.set(m.experience_id, e);
    }
    const out: ExperienceCard[] = [];
    for (const r of rows) {
      const m = byExp.get(r.id);
      const universal = !m || m.include.size === 0;
      if (statusId && m?.exclude.has(statusId)) continue;                 // suppressed for this status
      if (statusId && !universal && !m!.include.has(statusId)) continue;  // status-specific, not this status
      out.push(toCard(r, universal));
    }
    return out;
  } catch { return []; }
}

/** Home selection: status/universal experiences + featured first. */
export async function getHomeSelection(statusId: string | null): Promise<{ featured: ExperienceCard[]; cards: ExperienceCard[] }> {
  const cards = await getPublishedExperiences(statusId);
  try {
    const s = getSupabaseAdminClient();
    const now = new Date().toISOString();
    const { data: feat } = await s.from("companion_experience_featured")
      .select("experience_id, display_order, starts_at, ends_at").order("display_order");
    const active = new Set(((feat ?? []) as { experience_id: string; starts_at: string | null; ends_at: string | null }[])
      .filter((f) => (!f.starts_at || f.starts_at <= now) && (!f.ends_at || f.ends_at >= now))
      .map((f) => f.experience_id));
    const featured = cards.filter((c) => active.has(c.id));
    return { featured, cards };
  } catch { return { featured: [], cards }; }
}

export interface SessionExperience {
  id: string; slug: string; title: string; mode: string;
  version_id: string; version_no: number;
  blocks: { type: string; order: number; payload: unknown; conditional_on: unknown }[];
}

/** Resolve a published experience's live version for rendering a session. */
export async function getExperienceForSession(slug: string): Promise<SessionExperience | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data: exp } = await s.from("companion_experiences")
      .select("id, slug, title, consumer_title, mode, status, published_version")
      .eq("slug", slug).maybeSingle();
    const e = exp as (PubRow & { status: string; published_version: number | null }) | null;
    if (!e || e.status !== "published" || e.published_version == null) return null;
    const { data: ver } = await s.from("companion_experience_versions")
      .select("id, version_no, blocks").eq("experience_id", e.id).eq("version_no", e.published_version).maybeSingle();
    const v = ver as { id: string; version_no: number; blocks: SessionExperience["blocks"] } | null;
    if (!v) return null;
    return {
      id: e.id, slug: e.slug, title: e.consumer_title || e.title, mode: e.mode,
      version_id: v.id, version_no: v.version_no,
      blocks: [...(v.blocks ?? [])].sort((a, b) => a.order - b.order),
    };
  } catch { return null; }
}
