// Server-side helpers for the interactive Playbook: entitlement gate + current-state
// progress load/save. Auth is enforced by the caller (requireMember); here we scope
// every query by user_id via the service-role client (RLS own-row is the backstop).
//
// R3: CURRENT-STATE persistence. As of Phase D this includes the Rev 3 separated state
// columns (literature/simulation/practice/use_review/change_path — migration 0053), sanitized
// on the way in. The append-only playbook_events log is designed but not built — saveProgress
// is the single write path where a future event emit would attach without reshaping this table.

import { getSupabaseAdminClient } from "@/lib/supabase";
import { clusterIdForKey } from "@/lib/playbook/keys";
import type { PlaybookProgress, PlaybookProgressRow } from "@/lib/playbook/types";
import { emptyProgress } from "@/lib/playbook/contentSchema";

/** True if the user owns the playbook (active entitlement for its numeric cluster). */
export async function ownsPlaybook(userId: string, playbookKey: string): Promise<boolean> {
  const clusterId = clusterIdForKey(playbookKey);
  if (clusterId == null) return false;
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("playbook_entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("cluster_id", clusterId)
    .eq("status", "active")
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

/** Load the user's current progress, or an empty shell if none yet. */
export async function loadProgress(
  userId: string,
  playbookKey: string,
  playbookVersion: number,
): Promise<PlaybookProgress> {
  const admin = getSupabaseAdminClient();
  const { data } = await admin
    .from("playbook_progress")
    .select("playbook_key, playbook_version, recognized, play_states, outputs, my_plays, literature_state, simulation_state, practice_state, use_review_state, change_path_state")
    .eq("user_id", userId)
    .eq("playbook_key", playbookKey)
    .maybeSingle();
  if (!data) return emptyProgress(playbookKey, playbookVersion);
  const row = data as PlaybookProgressRow;
  // Rev 3 state columns default to '{}' for v0 rows; read an empty object as "absent".
  const state = <T>(v: unknown): T | undefined => (v && typeof v === "object" && Object.keys(v).length > 0 ? (v as T) : undefined);
  return {
    playbook_key: row.playbook_key,
    playbook_version: row.playbook_version,
    recognized: Array.isArray(row.recognized) ? row.recognized : [],
    play_states: (row.play_states as PlaybookProgress["play_states"]) ?? {},
    outputs: (row.outputs as PlaybookProgress["outputs"]) ?? {},
    my_plays: Array.isArray(row.my_plays) ? row.my_plays : [],
    literature_state: state<PlaybookProgress["literature_state"]>(row.literature_state),
    simulation_state: state<PlaybookProgress["simulation_state"]>(row.simulation_state),
    practice_state: state<PlaybookProgress["practice_state"]>(row.practice_state),
    use_review_state: state<PlaybookProgress["use_review_state"]>(row.use_review_state),
    change_path_state: state<PlaybookProgress["change_path_state"]>(row.change_path_state),
  };
}

/** Upsert the user's current progress (functional data only). */
export async function saveProgress(
  userId: string,
  playbookKey: string,
  progress: PlaybookProgress,
): Promise<void> {
  const admin = getSupabaseAdminClient();
  await admin.from("playbook_progress").upsert(
    {
      user_id: userId,
      playbook_key: playbookKey,
      playbook_version: progress.playbook_version,
      recognized: progress.recognized,
      play_states: progress.play_states,
      outputs: progress.outputs,
      my_plays: progress.my_plays,
      // Rev 3 separated state (0053). NOT-NULL jsonb columns → write '{}' when absent.
      literature_state: progress.literature_state ?? {},
      simulation_state: progress.simulation_state ?? {},
      practice_state: progress.practice_state ?? {},
      use_review_state: progress.use_review_state ?? {},
      change_path_state: progress.change_path_state ?? {},
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,playbook_key" },
  );
  // R3 seam: a future append-only playbook_events emit would attach here.
}
