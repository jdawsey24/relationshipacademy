import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only. Journey — the user's saved work over time. Owner-scoped. Never
// generates psychological conclusions from entries (spec); it only organizes them.

export interface JourneyFilters { q?: string; type?: string; status?: string; favorite?: boolean }
export interface JourneyEntry { id: string; title: string | null; status: string; entry_type: string; updated_at: string; favorite: boolean; tags: string[] }

export async function listJourney(userId: string, f: JourneyFilters = {}): Promise<JourneyEntry[]> {
  const s = getSupabaseAdminClient();
  let query = s.from("companion_user_entries").select("id, title, status, entry_type, updated_at").eq("user_id", userId).order("updated_at", { ascending: false });
  if (f.type) query = query.eq("entry_type", f.type);
  if (f.status) query = query.eq("status", f.status);
  const { data } = await query;
  let rows = (data ?? []) as { id: string; title: string | null; status: string; entry_type: string; updated_at: string }[];
  if (f.q) { const t = f.q.toLowerCase(); rows = rows.filter((r) => (r.title ?? "").toLowerCase().includes(t)); }
  const ids = rows.map((r) => r.id);
  const [{ data: favs }, { data: tags }] = await Promise.all([
    ids.length ? s.from("companion_user_entry_favorites").select("entry_id").eq("user_id", userId).in("entry_id", ids) : Promise.resolve({ data: [] }),
    ids.length ? s.from("companion_user_entry_tags").select("entry_id, tag").eq("user_id", userId).in("entry_id", ids) : Promise.resolve({ data: [] }),
  ]);
  const favSet = new Set(((favs ?? []) as { entry_id: string }[]).map((x) => x.entry_id));
  const tagMap = new Map<string, string[]>();
  for (const t of (tags ?? []) as { entry_id: string; tag: string }[]) { const a = tagMap.get(t.entry_id) ?? []; a.push(t.tag); tagMap.set(t.entry_id, a); }
  let out: JourneyEntry[] = rows.map((r) => ({ ...r, favorite: favSet.has(r.id), tags: tagMap.get(r.id) ?? [] }));
  if (f.favorite) out = out.filter((r) => r.favorite);
  return out;
}

export async function getJourneyEntry(userId: string, entryId: string) {
  const s = getSupabaseAdminClient();
  const { data: entry } = await s.from("companion_user_entries").select("*").eq("id", entryId).eq("user_id", userId).maybeSingle();
  if (!entry) return null;
  const e = entry as Record<string, unknown>;
  const [{ data: resp }, { data: exp }, { data: favs }, { data: tags }] = await Promise.all([
    s.from("companion_user_entry_responses").select("block_ref, response").eq("entry_id", entryId).eq("user_id", userId),
    e.experience_id ? s.from("companion_experiences").select("consumer_title, title").eq("id", e.experience_id).maybeSingle() : Promise.resolve({ data: null }),
    s.from("companion_user_entry_favorites").select("entry_id").eq("user_id", userId).eq("entry_id", entryId),
    s.from("companion_user_entry_tags").select("tag").eq("user_id", userId).eq("entry_id", entryId),
  ]);
  const ex = exp as { consumer_title: string | null; title: string } | null;
  return {
    entry: e,
    experienceTitle: ex ? (ex.consumer_title || ex.title) : null,
    responses: (resp ?? []) as { block_ref: string; response: unknown }[],
    favorite: ((favs ?? []) as unknown[]).length > 0,
    tags: ((tags ?? []) as { tag: string }[]).map((t) => t.tag),
  };
}

export async function updateJourneyEntry(userId: string, entryId: string, patch: { title?: string }): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const meta: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) meta.title = patch.title;
  const { error, count } = await s.from("companion_user_entries").update(meta, { count: "exact" }).eq("id", entryId).eq("user_id", userId);
  return !error && (count ?? 0) > 0;
}

export async function setFavorite(userId: string, entryId: string, on: boolean): Promise<boolean> {
  const s = getSupabaseAdminClient();
  if (on) { const { error } = await s.from("companion_user_entry_favorites").upsert({ user_id: userId, entry_id: entryId }, { onConflict: "user_id,entry_id" }); return !error; }
  const { error } = await s.from("companion_user_entry_favorites").delete().eq("user_id", userId).eq("entry_id", entryId); return !error;
}

export async function addTag(userId: string, entryId: string, tag: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_user_entry_tags").upsert({ user_id: userId, entry_id: entryId, tag: tag.trim().slice(0, 40) }, { onConflict: "entry_id,tag" });
  return !error;
}
export async function removeTag(userId: string, entryId: string, tag: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_user_entry_tags").delete().eq("user_id", userId).eq("entry_id", entryId).eq("tag", tag);
  return !error;
}

export async function archiveEntry(userId: string, entryId: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { error, count } = await s.from("companion_user_entries").update({ status: "archived", updated_at: new Date().toISOString() }, { count: "exact" }).eq("id", entryId).eq("user_id", userId);
  return !error && (count ?? 0) > 0;
}

export async function deleteEntry(userId: string, entryId: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_user_entries").delete().eq("id", entryId).eq("user_id", userId);
  return !error;
}
