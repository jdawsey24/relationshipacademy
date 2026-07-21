import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only CRUD for the Companion safety CMS (clinician-authored). All writes
// go through the owner admin routes (requireEditor). Content = triggers,
// response language, verified resources; plus a read-only metadata event log.

const now = () => new Date().toISOString();

// ---- Triggers ----
export async function listTriggers() {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_triggers").select("*").order("created_at", { ascending: false });
  return data ?? [];
}
export async function createTrigger(p: { pattern: string; match_type?: string; level?: string; risk_category?: string | null; notes?: string | null; actor?: string | null }) {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("companion_safety_triggers").insert({
    pattern: p.pattern.trim(), match_type: p.match_type ?? "keyword", level: p.level ?? "high_risk",
    risk_category: p.risk_category ?? null, notes: p.notes ?? null, created_by: p.actor ?? null,
  }).select("*").maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
export async function updateTrigger(id: string, patch: Record<string, unknown>) {
  const s = getSupabaseAdminClient();
  const allowed = ["pattern", "match_type", "level", "risk_category", "is_active", "notes"];
  const clean: Record<string, unknown> = { updated_at: now() };
  for (const k of allowed) if (k in patch) clean[k] = patch[k];
  const { error } = await s.from("companion_safety_triggers").update(clean).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function deleteTrigger(id: string) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_safety_triggers").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---- Response language (one per level) ----
export async function listResponses() {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_responses").select("*").order("level");
  return data ?? [];
}
export async function upsertResponse(p: { level: string; heading?: string | null; message: string; resource_intro?: string | null; is_active?: boolean; actor?: string | null }) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_safety_responses").upsert({
    level: p.level, heading: p.heading ?? null, message: p.message, resource_intro: p.resource_intro ?? null,
    is_active: p.is_active ?? true, updated_by: p.actor ?? null, updated_at: now(),
  }, { onConflict: "level" });
  if (error) throw new Error(error.message);
}

// ---- Resources ----
export async function listResources() {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_resources").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}
export async function createResource(p: Record<string, unknown>) {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("companion_safety_resources").insert({
    name: String(p.name ?? "").trim(), description: p.description ?? null, contact: p.contact ?? null, url: p.url ?? null,
    jurisdiction: p.jurisdiction ?? "US", hours: p.hours ?? null,
    applies_to_levels: (p.applies_to_levels as string[] | undefined) ?? ["high_risk"],
    sort_order: Number(p.sort_order ?? 0), source: p.source ?? null,
    verified_at: p.verified_at ?? null, verified_by: p.verified_by ?? null,
  }).select("*").maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
export async function updateResource(id: string, patch: Record<string, unknown>) {
  const s = getSupabaseAdminClient();
  const allowed = ["name", "description", "contact", "url", "jurisdiction", "hours", "applies_to_levels", "sort_order", "is_active", "verified_at", "verified_by", "source"];
  const clean: Record<string, unknown> = { updated_at: now() };
  for (const k of allowed) if (k in patch) clean[k] = patch[k];
  const { error } = await s.from("companion_safety_resources").update(clean).eq("id", id);
  if (error) throw new Error(error.message);
}
export async function deleteResource(id: string) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_safety_resources").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---- Audit events (read-only, metadata only) ----
export async function listSafetyEvents(limit = 100) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_safety_events")
    .select("id, matched_pattern, level, context, situation_ref, action, created_at")
    .order("created_at", { ascending: false }).limit(limit);
  return data ?? [];
}
