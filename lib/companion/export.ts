import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only. Build a full export of a user's OWN Companion data (portability).
// Owner-scoped; includes private content by design (it's their data, going to
// them). Never used for analytics or shared with anyone else.

export async function buildCompanionExport(userId: string): Promise<Record<string, unknown>> {
  const s = getSupabaseAdminClient();
  const [profile, statusHistory, interests, entries, responses, plans, blueprint, milestones, tags, favorites, entitlements] = await Promise.all([
    s.from("companion_profiles").select("*").eq("user_id", userId).maybeSingle(),
    s.from("user_structural_status_history").select("*").eq("user_id", userId).order("changed_at"),
    s.from("user_interest_preferences").select("topic").eq("user_id", userId),
    s.from("companion_user_entries").select("*").eq("user_id", userId).order("created_at"),
    s.from("companion_user_entry_responses").select("*").eq("user_id", userId),
    s.from("companion_conversation_plans").select("*").eq("user_id", userId).order("created_at"),
    s.from("companion_blueprint_sections").select("*").eq("user_id", userId),
    s.from("companion_user_milestones").select("*").eq("user_id", userId),
    s.from("companion_user_entry_tags").select("*").eq("user_id", userId),
    s.from("companion_user_entry_favorites").select("*").eq("user_id", userId),
    s.from("companion_entitlements").select("source, product_key, status, granted_at, expires_at").eq("user_id", userId),
  ]);
  return {
    exported_at: new Date().toISOString(),
    user_id: userId,
    profile: profile.data ?? null,
    relationship_status_history: statusHistory.data ?? [],
    interests: (interests.data ?? []).map((r) => (r as { topic: string }).topic),
    entries: entries.data ?? [],
    entry_responses: responses.data ?? [],
    entry_tags: tags.data ?? [],
    entry_favorites: favorites.data ?? [],
    conversation_plans: plans.data ?? [],
    blueprint: blueprint.data ?? [],
    milestones: milestones.data ?? [],
    entitlements: entitlements.data ?? [],
  };
}

/** Delete all of a user's OWN Companion data (not the auth account). Reauth-gated
 *  in the UI. Returns true on success. */
export async function deleteCompanionData(userId: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  try {
    // Entries cascade to responses/tags/favorites via FKs; delete the rest explicitly.
    await s.from("companion_user_entries").delete().eq("user_id", userId);
    await s.from("companion_conversation_plans").delete().eq("user_id", userId);
    await s.from("companion_blueprint_sections").delete().eq("user_id", userId);
    await s.from("companion_blueprint_section_versions").delete().eq("user_id", userId);
    await s.from("companion_user_milestones").delete().eq("user_id", userId);
    await s.from("user_interest_preferences").delete().eq("user_id", userId);
    await s.from("companion_profiles").update({ current_status_id: null, onboarding_completed_at: null }).eq("user_id", userId);
    return true;
  } catch { return false; }
}
