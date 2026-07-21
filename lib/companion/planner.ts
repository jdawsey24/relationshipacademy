import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only. Conversation Planner — standalone or entry-linked. Owner-scoped;
// fields are sensitive (never logged). Fields stored as a jsonb map keyed by
// PLANNER_FIELDS keys.

export interface PlanSummary { id: string; title: string; status: string; updated_at: string }

function titleFrom(fields: Record<string, unknown>): string {
  const d = fields?.discuss;
  return typeof d === "string" && d.trim() ? d.trim().slice(0, 60) : "Untitled conversation";
}

export async function listPlans(userId: string): Promise<PlanSummary[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_conversation_plans").select("id, fields, status, updated_at").eq("user_id", userId).order("updated_at", { ascending: false });
  return ((data ?? []) as { id: string; fields: Record<string, unknown>; status: string; updated_at: string }[])
    .map((p) => ({ id: p.id, title: titleFrom(p.fields ?? {}), status: p.status, updated_at: p.updated_at }));
}

export async function getPlan(userId: string, id: string): Promise<{ id: string; fields: Record<string, unknown>; status: string } | null> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_conversation_plans").select("id, fields, status").eq("id", id).eq("user_id", userId).maybeSingle();
  return data ? (data as { id: string; fields: Record<string, unknown>; status: string }) : null;
}

export async function createPlan(userId: string, entryId: string | null): Promise<string | null> {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("companion_conversation_plans").insert({ user_id: userId, entry_id: entryId, fields: {}, status: "draft" }).select("id").maybeSingle();
  if (error || !data) return null;
  return (data as { id: string }).id;
}

export async function savePlan(userId: string, id: string, fields: Record<string, unknown>, status?: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const patch: Record<string, unknown> = { fields, updated_at: new Date().toISOString() };
  if (status) patch.status = status;
  const { error, count } = await s.from("companion_conversation_plans").update(patch, { count: "exact" }).eq("id", id).eq("user_id", userId);
  return !error && (count ?? 0) > 0;
}

export async function deletePlan(userId: string, id: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("companion_conversation_plans").delete().eq("id", id).eq("user_id", userId);
  return !error;
}
