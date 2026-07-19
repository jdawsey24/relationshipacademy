import { getSupabaseAdminClient } from "@/lib/supabase";
import { getExperienceForSession, type SessionExperience } from "@/lib/companion/consumer";

// Server-only. Private user entries. Every call is scoped to the authenticated
// user_id (passed by the route after requireEntitledCompanionUser). RLS is the
// backstop; app code is the gate. A saved entry is pinned to the exact published
// version + the relationship status active at creation.

export interface StartedEntry {
  entry_id: string;
  experience: SessionExperience;
  responses: Record<string, unknown>;
}

/** Start (or resume the newest draft of) an experience for a user. */
export async function startEntry(userId: string, slug: string): Promise<StartedEntry | null> {
  const experience = await getExperienceForSession(slug);
  if (!experience) return null;
  const s = getSupabaseAdminClient();

  // Resume an existing draft for this exact version if one exists.
  const { data: existing } = await s.from("companion_user_entries")
    .select("id").eq("user_id", userId).eq("experience_version_id", experience.version_id).eq("status", "draft")
    .order("updated_at", { ascending: false }).limit(1).maybeSingle();

  let entryId = (existing as { id: string } | null)?.id ?? null;
  if (!entryId) {
    const { data: prof } = await s.from("companion_profiles").select("current_status_id").eq("user_id", userId).maybeSingle();
    const statusId = (prof as { current_status_id: string | null } | null)?.current_status_id ?? null;
    const { data: created, error } = await s.from("companion_user_entries").insert({
      user_id: userId, experience_id: experience.id, experience_version_id: experience.version_id,
      structural_status_id: statusId, entry_type: experience.mode === "free" ? "free" : "guided", status: "draft",
    }).select("id").maybeSingle();
    if (error || !created) return null;
    entryId = (created as { id: string }).id;
  }

  const { data: resp } = await s.from("companion_user_entry_responses").select("block_ref, response").eq("entry_id", entryId);
  const responses: Record<string, unknown> = {};
  for (const r of (resp ?? []) as { block_ref: string; response: unknown }[]) responses[r.block_ref] = r.response;
  return { entry_id: entryId, experience, responses };
}

async function ownsEntry(userId: string, entryId: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_user_entries").select("id").eq("id", entryId).eq("user_id", userId).maybeSingle();
  return !!data;
}

/** Upsert one block's response (autosave). Verifies ownership first. */
export async function saveResponse(userId: string, entryId: string, blockRef: string, response: unknown): Promise<boolean> {
  if (!(await ownsEntry(userId, entryId))) return false;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_user_entry_responses")
    .upsert({ entry_id: entryId, user_id: userId, block_ref: blockRef, response, updated_at: new Date().toISOString() }, { onConflict: "entry_id,block_ref" });
  if (error) return false;
  await s.from("companion_user_entries").update({ updated_at: new Date().toISOString() }).eq("id", entryId);
  return true;
}

export async function completeEntry(userId: string, entryId: string): Promise<boolean> {
  if (!(await ownsEntry(userId, entryId))) return false;
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_user_entries")
    .update({ status: "complete", completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", entryId).eq("user_id", userId);
  return !error;
}

export interface EntrySummary { id: string; title: string | null; status: string; entry_type: string; updated_at: string; experience_id: string | null }

/** Recent entries for Home / basic Journey (full Journey is Phase 3). */
export async function listRecentEntries(userId: string, limit = 10): Promise<EntrySummary[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_user_entries")
    .select("id, title, status, entry_type, updated_at, experience_id")
    .eq("user_id", userId).order("updated_at", { ascending: false }).limit(limit);
  return (data ?? []) as EntrySummary[];
}
