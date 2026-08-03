import { getSupabaseAdminClient } from "@/lib/supabase";

// Admin-facing list of Snapshot leads (converted sessions with a captured email).
// These live in snapshot_quiz_sessions + get pushed to GHL, but had NO in-app view;
// this is that view. Read-only, service-role. Ordered newest-first.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";

export interface SnapshotLead {
  sessionId: string;
  email: string;
  name: string;
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
  contact_name: string | null;
  converted_at: string | null;
  assessment_id: string;
  primary_cluster_id: number | null;
  secondary_cluster_id: number | null;
  is_low_confidence: boolean | null;
}

export async function getSnapshotLeads(limit = 1000): Promise<SnapshotLead[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_quiz_sessions")
    .select("id, contact_email, contact_name, converted_at, assessment_id, primary_cluster_id, secondary_cluster_id, is_low_confidence")
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
    name: r.contact_name ?? "",
    convertedAt: r.converted_at,
    assessment: asmName.get(r.assessment_id) ?? r.assessment_id,
    primaryCluster: cName(r.primary_cluster_id),
    secondaryCluster: cName(r.secondary_cluster_id),
    lowConfidence: !!r.is_low_confidence,
    resultsUrl: `${SITE}/snapshot/results/${r.id}`,
  }));
}

// ── Per-respondent drill-down: exactly how one person answered ────────────────

export interface SessionAnswer {
  questionOrder: number;
  isNeutral: boolean;   // "None of these fit"
  statement: string;    // the option they picked ("" if neutral)
  cluster: string;      // the pattern that option counts toward ("" if neutral)
}
export interface SessionDetail {
  sessionId: string;
  email: string | null;
  name: string | null;
  assessment: string;
  convertedAt: string | null;
  completed: boolean;
  tied: boolean;
  lowConfidence: boolean;
  primaryCluster: string;
  secondaryCluster: string;
  resultsUrl: string;
  answers: SessionAnswer[];
}

interface DetailSessionRow {
  id: string; contact_email: string | null; contact_name: string | null; converted_at: string | null; completed_at: string | null;
  assessment_id: string; primary_cluster_id: number | null; secondary_cluster_id: number | null;
  is_low_confidence: boolean | null; is_tied: boolean | null;
}

export async function getSessionDetail(sessionId: string): Promise<SessionDetail | null> {
  const s = getSupabaseAdminClient();
  const { data: sessData } = await s.from("snapshot_quiz_sessions")
    .select("id, contact_email, contact_name, converted_at, completed_at, assessment_id, primary_cluster_id, secondary_cluster_id, is_low_confidence, is_tied")
    .eq("id", sessionId).maybeSingle();
  const sess = sessData as DetailSessionRow | null;
  if (!sess) return null;

  const [{ data: asm }, { data: clusters }, { data: qs }, { data: ans }, { data: items }] = await Promise.all([
    s.from("snapshot_assessments").select("id, display_name"),
    s.from("snapshot_clusters").select("id, name"),
    s.from("snapshot_quiz_questions").select("id, question_order").eq("assessment_id", sess.assessment_id),
    s.from("snapshot_quiz_answers").select("question_id, selected_session_item_id, is_neutral").eq("session_id", sessionId),
    s.from("snapshot_quiz_session_items").select("id, cluster_id, statement").eq("session_id", sessionId),
  ]);
  const asmName = new Map(((asm ?? []) as { id: string; display_name: string }[]).map((a) => [a.id, a.display_name]));
  const clusterName = new Map(((clusters ?? []) as { id: number; name: string }[]).map((c) => [c.id, c.name]));
  const qOrder = new Map(((qs ?? []) as { id: string; question_order: number }[]).map((q) => [q.id, q.question_order]));
  const itemById = new Map(((items ?? []) as { id: string; cluster_id: number; statement: string }[]).map((i) => [i.id, i]));
  const cName = (id: number | null) => (id != null ? (clusterName.get(id) ?? `#${id}`) : "");

  const answers: SessionAnswer[] = ((ans ?? []) as { question_id: string; selected_session_item_id: string | null; is_neutral: boolean | null }[])
    .map((a) => {
      const order = qOrder.get(a.question_id) ?? 0;
      if (a.is_neutral || !a.selected_session_item_id) return { questionOrder: order, isNeutral: true, statement: "", cluster: "" };
      const item = itemById.get(a.selected_session_item_id);
      return { questionOrder: order, isNeutral: false, statement: item?.statement ?? "(statement unavailable)", cluster: item ? cName(item.cluster_id) : "" };
    })
    .sort((x, y) => x.questionOrder - y.questionOrder);

  return {
    sessionId: sess.id,
    email: sess.contact_email,
    name: sess.contact_name,
    assessment: asmName.get(sess.assessment_id) ?? sess.assessment_id,
    convertedAt: sess.converted_at,
    completed: !!sess.completed_at,
    tied: !!sess.is_tied,
    lowConfidence: !!sess.is_low_confidence,
    primaryCluster: cName(sess.primary_cluster_id),
    secondaryCluster: cName(sess.secondary_cluster_id),
    resultsUrl: `${SITE}/snapshot/results/${sess.id}`,
    answers,
  };
}
