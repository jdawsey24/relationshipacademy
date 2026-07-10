import { getSupabaseAdminClient } from "@/lib/supabase";
import { sortSessions, type LiveArea, type LiveSession } from "@/lib/live";

// Server-only reader for live sessions. Resilient: returns [] if migration 0015
// hasn't run. Gated content — always read server-side, never exposed to anon.
export async function getLiveSessions(area: LiveArea): Promise<LiveSession[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s.from("live_sessions").select("*").eq("area", area);
    if (error || !data) return [];
    return sortSessions(data as LiveSession[]);
  } catch {
    return [];
  }
}
