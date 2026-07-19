import { getSupabaseAdminClient } from "@/lib/supabase";
import { BLUEPRINT_SECTIONS, BLUEPRINT_SECTION_KEYS } from "@/lib/companion";

// Server-only. The living Blueprint: one row per section, autosaved, owner-scoped.
// Sensitive content — never logged. Optional archived revisions on demand.

export interface BlueprintSectionState { key: string; label: string; body: string; updated_at: string | null }

export async function getBlueprint(userId: string): Promise<BlueprintSectionState[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_blueprint_sections").select("section_key, body, updated_at").eq("user_id", userId);
  const byKey = new Map<string, { body: unknown; updated_at: string }>();
  for (const r of (data ?? []) as { section_key: string; body: unknown; updated_at: string }[]) byKey.set(r.section_key, { body: r.body, updated_at: r.updated_at });
  // Return every canonical section (filled or empty) so the UI is complete.
  return BLUEPRINT_SECTIONS.map((sec) => {
    const row = byKey.get(sec.key);
    const text = row && typeof (row.body as { text?: string })?.text === "string" ? (row.body as { text: string }).text : "";
    return { key: sec.key, label: sec.label, body: text, updated_at: row?.updated_at ?? null };
  });
}

export async function saveBlueprintSection(userId: string, key: string, text: string, archivePrior = false): Promise<boolean> {
  if (!BLUEPRINT_SECTION_KEYS.has(key)) return false;
  const s = getSupabaseAdminClient();
  if (archivePrior) {
    const { data: prior } = await s.from("companion_blueprint_sections").select("body").eq("user_id", userId).eq("section_key", key).maybeSingle();
    if (prior) await s.from("companion_blueprint_section_versions").insert({ user_id: userId, section_key: key, body: (prior as { body: unknown }).body });
  }
  const { error } = await s.from("companion_blueprint_sections")
    .upsert({ user_id: userId, section_key: key, body: { text }, updated_at: new Date().toISOString() }, { onConflict: "user_id,section_key" });
  return !error;
}
