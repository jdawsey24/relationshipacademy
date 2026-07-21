import { getSupabaseAdminClient } from "@/lib/supabase";

// GoHighLevel inbound-webhook push for converted Snapshot leads. Fires once at
// conversion with the lead's email + result (primary/secondary cluster, marker).
// Fully resilient: never blocks or fails conversion, and no-ops if the webhook
// URL isn't configured.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";

export function ghlConfigured(): boolean {
  return !!process.env.GHL_WEBHOOK_URL;
}

interface SessionRow {
  id: string;
  contact_email: string | null;
  assessment_id: string;
  primary_cluster_id: number | null;
  secondary_cluster_id: number | null;
  converted_at: string | null;
  is_low_confidence: boolean | null;
}

export async function pushLeadToGHL(sessionId: string): Promise<void> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return;
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("snapshot_quiz_sessions")
      .select("id, contact_email, assessment_id, primary_cluster_id, secondary_cluster_id, converted_at, is_low_confidence")
      .eq("id", sessionId).maybeSingle();
    const row = data as SessionRow | null;
    if (!row?.contact_email || !row.converted_at) return;

    const ids = [row.primary_cluster_id, row.secondary_cluster_id].filter((x): x is number => typeof x === "number");
    const [{ data: asm }, { data: clusters }] = await Promise.all([
      s.from("snapshot_assessments").select("display_name").eq("id", row.assessment_id).maybeSingle(),
      ids.length ? s.from("snapshot_clusters").select("id, name").in("id", ids) : Promise.resolve({ data: [] }),
    ]);
    const nameById = new Map(((clusters ?? []) as { id: number; name: string }[]).map((c) => [c.id, c.name]));

    const payload = {
      email: row.contact_email,
      source: "relationship_snapshot",
      session_id: row.id,
      assessment_id: row.assessment_id,
      assessment: ((asm as { display_name?: string } | null)?.display_name) ?? "",
      primary_cluster_id: row.primary_cluster_id ?? null,
      primary_cluster: row.primary_cluster_id != null ? (nameById.get(row.primary_cluster_id) ?? "") : "",
      secondary_cluster_id: row.secondary_cluster_id ?? null,
      secondary_cluster: row.secondary_cluster_id != null ? (nameById.get(row.secondary_cluster_id) ?? "") : "",
      is_low_confidence: !!row.is_low_confidence,
      results_url: `${SITE}/snapshot/results/${row.id}`,
    };
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  } catch { /* resilient — a CRM hiccup must never break conversion */ }
}
