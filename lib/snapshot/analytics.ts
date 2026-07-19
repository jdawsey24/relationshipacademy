import { getSupabaseAdminClient } from "@/lib/supabase";

// Owner-facing analytics for the Relationship Snapshot. Read-only aggregates over
// completed sessions + answers. The headline signal is "thin-signal" data: neutral
// ("None of these fit") rate and the low-confidence share per marker, plus which
// questions get the most neutral answers — direct content-gap data. Service-role.

const MARKER_ORDER = ["single_but_dating", "in_a_relationship", "married_or_long_term", "recent_divorce_breakup", "single_contemplating_dating"];

export interface MarkerStat {
  id: string;
  display: string;
  completed: number;
  converted: number;
  avgNeutralPct: number;    // mean of (neutral answers / questions) across sessions
  lowConfidencePct: number; // share of completed sessions flagged low-confidence
  conversionPct: number;
  tiedPct: number;
}
export interface ClusterCount { clusterId: number; name: string; count: number }
export interface Hotspot { marker: string; markerDisplay: string; questionOrder: number; neutralPct: number; answers: number; clusters: string[] }

export interface SnapshotAnalytics {
  overall: { completed: number; converted: number; lowConfidencePct: number; conversionPct: number };
  perMarker: MarkerStat[];
  primaryClusters: ClusterCount[];
  hotspots: Hotspot[];
  hasData: boolean;
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

export async function getSnapshotAnalytics(): Promise<SnapshotAnalytics> {
  const s = getSupabaseAdminClient();
  const [asmRes, qRes, slotRes, clusterRes, sessRes, ansRes] = await Promise.all([
    s.from("snapshot_assessments").select("id, display_name"),
    s.from("snapshot_quiz_questions").select("id, assessment_id, question_order"),
    s.from("snapshot_quiz_question_slots").select("question_id, cluster_id"),
    s.from("snapshot_clusters").select("id, name"),
    s.from("snapshot_quiz_sessions").select("assessment_id, primary_cluster_id, neutral_answer_count, is_low_confidence, is_tied, converted_at, completed_at").not("completed_at", "is", null),
    s.from("snapshot_quiz_answers").select("question_id, is_neutral"),
  ]);

  const assessments = (asmRes.data ?? []) as { id: string; display_name: string }[];
  const questions = (qRes.data ?? []) as { id: string; assessment_id: string; question_order: number }[];
  const slots = (slotRes.data ?? []) as { question_id: string; cluster_id: number }[];
  const clusters = (clusterRes.data ?? []) as { id: number; name: string }[];
  const sessions = (sessRes.data ?? []) as { assessment_id: string; primary_cluster_id: number | null; neutral_answer_count: number | null; is_low_confidence: boolean | null; is_tied: boolean | null; converted_at: string | null }[];
  const answers = (ansRes.data ?? []) as { question_id: string; is_neutral: boolean | null }[];

  const clusterName = new Map(clusters.map((c) => [c.id, c.name]));
  const asmDisplay = new Map(assessments.map((a) => [a.id, a.display_name]));
  const qCountByMarker = new Map<string, number>();
  for (const q of questions) qCountByMarker.set(q.assessment_id, (qCountByMarker.get(q.assessment_id) ?? 0) + 1);

  // Per-marker aggregates.
  const perMarker: MarkerStat[] = assessments
    .map((a) => {
      const rows = sessions.filter((x) => x.assessment_id === a.id);
      const completed = rows.length;
      const converted = rows.filter((x) => x.converted_at).length;
      const lowConf = rows.filter((x) => x.is_low_confidence).length;
      const tied = rows.filter((x) => x.is_tied).length;
      const qCount = qCountByMarker.get(a.id) || 0;
      const neutralPctSum = qCount > 0 ? rows.reduce((acc, x) => acc + (x.neutral_answer_count ?? 0) / qCount, 0) : 0;
      return {
        id: a.id, display: a.display_name, completed, converted,
        avgNeutralPct: completed > 0 ? Math.round((neutralPctSum / completed) * 1000) / 10 : 0,
        lowConfidencePct: pct(lowConf, completed),
        conversionPct: pct(converted, completed),
        tiedPct: pct(tied, completed),
      };
    })
    .sort((a, b) => MARKER_ORDER.indexOf(a.id) - MARKER_ORDER.indexOf(b.id));

  // Overall.
  const completed = sessions.length;
  const converted = sessions.filter((x) => x.converted_at).length;
  const lowConf = sessions.filter((x) => x.is_low_confidence).length;

  // Primary-cluster distribution (which results people land on).
  const byCluster = new Map<number, number>();
  for (const x of sessions) if (x.primary_cluster_id != null) byCluster.set(x.primary_cluster_id, (byCluster.get(x.primary_cluster_id) ?? 0) + 1);
  const primaryClusters: ClusterCount[] = [...byCluster.entries()]
    .map(([clusterId, count]) => ({ clusterId, name: clusterName.get(clusterId) ?? `Cluster ${clusterId}`, count }))
    .sort((a, b) => b.count - a.count);

  // Neutral hotspots: per question, share of answers that were neutral. Question
  // structure is fixed per marker, so a high-neutral question = statements that
  // aren't landing for that slot's clusters (content gap).
  const qMeta = new Map(questions.map((q) => [q.id, q]));
  const clustersByQ = new Map<string, Set<number>>();
  for (const sl of slots) {
    const set = clustersByQ.get(sl.question_id) ?? new Set<number>();
    set.add(sl.cluster_id);
    clustersByQ.set(sl.question_id, set);
  }
  const tally = new Map<string, { total: number; neutral: number }>();
  for (const a of answers) {
    const t = tally.get(a.question_id) ?? { total: 0, neutral: 0 };
    t.total++;
    if (a.is_neutral) t.neutral++;
    tally.set(a.question_id, t);
  }
  const hotspots: Hotspot[] = [...tally.entries()]
    .map(([qid, t]) => {
      const q = qMeta.get(qid);
      if (!q || t.total < 5) return null; // need a minimum of answers to be meaningful
      return {
        marker: q.assessment_id,
        markerDisplay: asmDisplay.get(q.assessment_id) ?? q.assessment_id,
        questionOrder: q.question_order,
        neutralPct: pct(t.neutral, t.total),
        answers: t.total,
        clusters: [...(clustersByQ.get(qid) ?? new Set<number>())].sort((a, b) => a - b).map((c) => clusterName.get(c) ?? `Cluster ${c}`),
      } as Hotspot;
    })
    .filter((h): h is Hotspot => h !== null && h.neutralPct > 0)
    .sort((a, b) => b.neutralPct - a.neutralPct)
    .slice(0, 10);

  return {
    overall: { completed, converted, lowConfidencePct: pct(lowConf, completed), conversionPct: pct(converted, completed) },
    perMarker,
    primaryClusters,
    hotspots,
    hasData: completed > 0,
  };
}
