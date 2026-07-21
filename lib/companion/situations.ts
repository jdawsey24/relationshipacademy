import { getSupabaseAdminClient } from "@/lib/supabase";

// Consumer-facing reads over the Relationship Situation Registry — the situation-
// FIRST navigation surface. Real users see only Published situations; staff preview
// the full Draft catalog (includeDraft). No framework vocabulary is ever exposed:
// only titles, needs, and consumer categories. Resilient (returns [] pre-registry).

export interface SituationCard {
  situation_id: string; title: string; short_title: string | null;
  user_need: string | null; category_id: string | null; publication_status: string;
}
export interface CategoryGroup { category_id: string; name: string; situations: SituationCard[] }

const toCard = (r: Record<string, unknown>): SituationCard => ({
  situation_id: r.situation_id as string,
  title: (r.official_title as string) ?? (r.short_title as string) ?? "",
  short_title: (r.short_title as string) ?? null,
  user_need: (r.user_need as string) ?? null,
  category_id: (r.primary_category_id as string) ?? null,
  publication_status: (r.publication_status as string) ?? "Draft",
});

/** The user's relationship-status key (single/dating/...), or null. */
export async function getUserStatusKey(userId: string): Promise<string | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data: prof } = await s.from("companion_profiles").select("current_status_id").eq("user_id", userId).maybeSingle();
    const sid = (prof as { current_status_id: string | null } | null)?.current_status_id;
    if (!sid) return null;
    const { data: st } = await s.from("structural_statuses").select("key").eq("id", sid).maybeSingle();
    return (st as { key?: string } | null)?.key ?? null;
  } catch { return null; }
}

const SELECT = "situation_id, official_title, short_title, user_need, primary_status_key, primary_category_id, publication_status";

/** Situations relevant to a status (primary or additional). For Home. */
export async function getSituationsForStatus(statusKey: string | null, includeDraft: boolean): Promise<SituationCard[]> {
  try {
    const s = getSupabaseAdminClient();
    let base = s.from("reg_situations").select(SELECT).order("situation_id");
    if (!includeDraft) base = base.eq("publication_status", "Published");
    const { data } = await base;
    let rows = (data ?? []) as Record<string, unknown>[];
    if (statusKey) {
      const { data: m2m } = await s.from("reg_situation_statuses").select("situation_id").eq("status_key", statusKey);
      const extra = new Set(((m2m ?? []) as { situation_id: string }[]).map((r) => r.situation_id));
      rows = rows.filter((r) => r.primary_status_key === statusKey || extra.has(r.situation_id as string));
    }
    return rows.map(toCard);
  } catch { return []; }
}

/** All situations grouped by consumer category. For Process. */
export async function getSituationCatalog(includeDraft: boolean): Promise<CategoryGroup[]> {
  try {
    const s = getSupabaseAdminClient();
    const [{ data: cats }, sits] = await Promise.all([
      s.from("reg_situation_categories").select("category_id, name, display_order").order("display_order"),
      (async () => {
        let q = s.from("reg_situations").select(SELECT).order("official_title");
        if (!includeDraft) q = q.eq("publication_status", "Published");
        return (await q).data ?? [];
      })(),
    ]);
    const byCat = new Map<string, SituationCard[]>();
    for (const r of sits as Record<string, unknown>[]) {
      const c = (r.primary_category_id as string) ?? "_none";
      (byCat.get(c) ?? byCat.set(c, []).get(c)!).push(toCard(r));
    }
    return ((cats ?? []) as { category_id: string; name: string }[])
      .map((c) => ({ category_id: c.category_id, name: c.name, situations: byCat.get(c.category_id) ?? [] }))
      .filter((g) => g.situations.length > 0);
  } catch { return []; }
}

/** Search situations by title + consumer search phrases. */
export async function searchSituations(q: string, includeDraft: boolean): Promise<SituationCard[]> {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  try {
    const s = getSupabaseAdminClient();
    let base = s.from("reg_situations").select(SELECT);
    if (!includeDraft) base = base.eq("publication_status", "Published");
    const { data } = await base;
    const rows = (data ?? []) as Record<string, unknown>[];
    const { data: terms } = await s.from("reg_search_terms").select("situation_id, search_text").ilike("search_text", `%${t}%`);
    const hitIds = new Set(((terms ?? []) as { situation_id: string }[]).map((r) => r.situation_id));
    return rows.filter((r) => (r.official_title as string).toLowerCase().includes(t) || hitIds.has(r.situation_id as string)).map(toCard);
  } catch { return []; }
}

export interface SituationDetail {
  situation_id: string; title: string; definition: string | null; user_need: string | null;
  category: string | null; publication_status: string;
  experience_slug: string | null;   // a linked PUBLISHED experience to run, if any
}

export async function getSituationDetail(situationId: string, includeDraft: boolean): Promise<SituationDetail | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data: sit } = await s.from("reg_situations")
      .select("situation_id, official_title, definition, user_need, primary_category_id, publication_status")
      .eq("situation_id", situationId).maybeSingle();
    const r = sit as Record<string, unknown> | null;
    if (!r) return null;
    if (!includeDraft && r.publication_status !== "Published") return null;
    const [{ data: cat }, { data: exp }] = await Promise.all([
      r.primary_category_id ? s.from("reg_situation_categories").select("name").eq("category_id", r.primary_category_id).maybeSingle() : Promise.resolve({ data: null }),
      s.from("companion_experiences").select("slug").eq("situation_id", situationId).eq("status", "published").limit(1).maybeSingle(),
    ]);
    return {
      situation_id: r.situation_id as string, title: r.official_title as string,
      definition: (r.definition as string) ?? null, user_need: (r.user_need as string) ?? null,
      category: ((cat as { name?: string } | null)?.name) ?? null, publication_status: r.publication_status as string,
      experience_slug: ((exp as { slug?: string } | null)?.slug) ?? null,
    };
  } catch { return null; }
}
