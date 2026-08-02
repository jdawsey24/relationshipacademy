import { getSupabaseAdminClient } from "@/lib/supabase";

// Admin-facing list of Snapshot leads (converted sessions with a captured email).
// These live in snapshot_quiz_sessions + get pushed to GHL, but had NO in-app view;
// this is that view. Read-only, service-role. Ordered newest-first.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";

export interface SnapshotLead {
  sessionId: string;
  email: string;
  convertedAt: string | null;
  assessment: string;
  primaryCluster: string;
  secondaryCluster: string;
  lowConfidence: boolean;
  resultsUrl: string;
}

interface SessionRow {
  id: string;
  contact_email: string | null;
  converted_at: string | null;
  assessment_id: string;
  primary_cluster_id: number | null;
  secondary_cluster_id: number | null;
  is_low_confidence: boolean | null;
}

export async function getSnapshotLeads(limit = 1000): Promise<SnapshotLead[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_quiz_sessions")
    .select("id, contact_email, converted_at, assessment_id, primary_cluster_id, secondary_cluster_id, is_low_confidence")
    .not("contact_email", "is", null)
    .order("converted_at", { ascending: false })
    .limit(limit);
  const rows = (data ?? []) as SessionRow[];
  if (!rows.length) return [];

  const [{ data: asm }, { data: clusters }] = await Promise.all([
    s.from("snapshot_assessments").select("id, display_name"),
    s.from("snapshot_clusters").select("id, name"),
  ]);
  const asmName = new Map(((asm ?? []) as { id: string; display_name: string }[]).map((a) => [a.id, a.display_name]));
  const clusterName = new Map(((clusters ?? []) as { id: number; name: string }[]).map((c) => [c.id, c.name]));
  const cName = (id: number | null) => (id != null ? (clusterName.get(id) ?? `#${id}`) : "");

  return rows.map((r) => ({
    sessionId: r.id,
    email: r.contact_email ?? "",
    convertedAt: r.converted_at,
    assessment: asmName.get(r.assessment_id) ?? r.assessment_id,
    primaryCluster: cName(r.primary_cluster_id),
    secondaryCluster: cName(r.secondary_cluster_id),
    lowConfidence: !!r.is_low_confidence,
    resultsUrl: `${SITE}/snapshot/results/${r.id}`,
  }));
}
