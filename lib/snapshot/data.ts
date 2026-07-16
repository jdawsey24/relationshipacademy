import { getSupabaseAdminClient } from "@/lib/supabase";
import { scoreClusters } from "@/lib/snapshot/scoring";

// Data layer for the Relationship Snapshot cluster quizzes. Service-role only
// (public API routes call these). Option→cluster mapping is never sent to the
// client — scoring happens here.

export interface PickerAssessment { id: string; display_name: string; entry_prompt: string }
export interface QuizOption { id: string; statement: string }
export interface QuizQuestion { id: string; question_order: number; options: QuizOption[] }
export interface Quiz { assessment: { id: string; display_name: string }; questions: QuizQuestion[] }

export async function listAssessments(): Promise<PickerAssessment[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_assessments").select("id, display_name, entry_prompt").order("id");
  // Keep the phase order intentional, not alphabetical.
  const order = ["exploration", "exclusivity", "expansion", "expiration", "recovery", "renewal"];
  return ((data ?? []) as PickerAssessment[]).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

export async function getQuiz(assessmentId: string): Promise<Quiz | null> {
  const s = getSupabaseAdminClient();
  const { data: asm } = await s.from("snapshot_assessments").select("id, display_name").eq("id", assessmentId).maybeSingle();
  if (!asm) return null;
  const { data: qs } = await s.from("snapshot_quiz_questions")
    .select("id, question_order").eq("assessment_id", assessmentId).order("question_order");
  const questionIds = (qs ?? []).map((q) => (q as { id: string }).id);
  if (!questionIds.length) return null;
  const { data: opts } = await s.from("snapshot_quiz_question_options")
    .select("id, question_id, statement, option_order").in("question_id", questionIds).order("option_order");
  const optsByQ = new Map<string, QuizOption[]>();
  for (const o of (opts ?? []) as { id: string; question_id: string; statement: string }[]) {
    (optsByQ.get(o.question_id) ?? optsByQ.set(o.question_id, []).get(o.question_id)!).push({ id: o.id, statement: o.statement });
  }
  const questions: QuizQuestion[] = (qs ?? []).map((q) => {
    const qq = q as { id: string; question_order: number };
    return { id: qq.id, question_order: qq.question_order, options: optsByQ.get(qq.id) ?? [] };
  });
  return { assessment: { id: (asm as { id: string }).id, display_name: (asm as { display_name: string }).display_name }, questions };
}

// Load the cluster_id for a set of selected option ids.
async function clustersForOptions(optionIds: string[]): Promise<number[]> {
  if (!optionIds.length) return [];
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_quiz_question_options").select("id, cluster_id").in("id", optionIds);
  const byId = new Map((data ?? []).map((o) => [(o as { id: string }).id, (o as { cluster_id: number }).cluster_id]));
  return optionIds.map((id) => byId.get(id)).filter((c): c is number => typeof c === "number");
}

async function oneStatementForCluster(clusterId: number): Promise<string> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_quiz_items").select("statement").eq("cluster_id", clusterId).limit(1).maybeSingle();
  return ((data as { statement?: string } | null)?.statement) ?? "This resonates with me most.";
}

export interface ScoreOutcome {
  session_id: string;
  tied: boolean;
  tiebreak?: { cluster_id: number; name: string; statement: string }[];
}

// Create the session, persist answers, score. If a first-place tie, leave the
// session unfinalized and return the head-to-head options; else finalize.
export async function scoreAndCreateSession(input: {
  assessmentId: string;
  answers: { question_id: string; option_id: string }[];
}): Promise<ScoreOutcome | null> {
  const s = getSupabaseAdminClient();
  const { data: asm } = await s.from("snapshot_assessments").select("id").eq("id", input.assessmentId).maybeSingle();
  if (!asm) return null;

  const { data: sess } = await s.from("snapshot_quiz_sessions")
    .insert({ assessment_id: input.assessmentId, completed_at: new Date().toISOString() }).select("id").single();
  const sessionId = (sess as { id: string } | null)?.id;
  if (!sessionId) return null;

  const answerRows = input.answers.map((a) => ({ session_id: sessionId, question_id: a.question_id, selected_option_id: a.option_id }));
  if (answerRows.length) await s.from("snapshot_quiz_answers").insert(answerRows);

  const clusterIds = await clustersForOptions(input.answers.map((a) => a.option_id));
  const result = scoreClusters(clusterIds);

  if (result.isTied) {
    await s.from("snapshot_quiz_sessions").update({ is_tied: true }).eq("id", sessionId);
    const names = await clusterNames(result.tiedClusterIds);
    const tiebreak = await Promise.all(result.tiedClusterIds.map(async (cid) => ({
      cluster_id: cid, name: names.get(cid) ?? `Cluster ${cid}`, statement: await oneStatementForCluster(cid),
    })));
    return { session_id: sessionId, tied: true, tiebreak };
  }

  await s.from("snapshot_quiz_sessions").update({
    primary_cluster_id: result.primary?.clusterId ?? null,
    secondary_cluster_id: result.secondary?.clusterId ?? null,
  }).eq("id", sessionId);
  return { session_id: sessionId, tied: false };
}

// Resolve a tie: the picked cluster becomes Primary, another tied cluster Secondary.
export async function resolveTiebreak(sessionId: string, winnerClusterId: number): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { data: sess } = await s.from("snapshot_quiz_sessions").select("id, is_tied").eq("id", sessionId).maybeSingle();
  if (!sess) return false;
  // Recompute the tied set from the session's answers.
  const { data: ans } = await s.from("snapshot_quiz_answers").select("selected_option_id").eq("session_id", sessionId);
  const clusterIds = await clustersForOptions((ans ?? []).map((a) => (a as { selected_option_id: string }).selected_option_id));
  const { tiedClusterIds } = scoreClusters(clusterIds);
  if (!tiedClusterIds.includes(winnerClusterId)) return false;
  const secondary = tiedClusterIds.find((c) => c !== winnerClusterId) ?? null;
  const { error } = await s.from("snapshot_quiz_sessions")
    .update({ primary_cluster_id: winnerClusterId, secondary_cluster_id: secondary }).eq("id", sessionId);
  return !error;
}

// Conversion: the CTA click captures email + timestamps converted_at. This is the
// event the GHL nurture / ad conversion pixels hang off. Playbook delivery (PDF)
// is a later phase.
export async function convertSession(sessionId: string, email: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("snapshot_quiz_sessions")
    .update({ contact_email: email, converted_at: new Date().toISOString() }).eq("id", sessionId);
  return !error;
}

async function clusterNames(ids: number[]): Promise<Map<number, string>> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_clusters").select("id, name").in("id", ids);
  return new Map((data ?? []).map((c) => [(c as { id: number }).id, (c as { name: string }).name]));
}

export interface SnapshotResults {
  assessment_display: string;
  primary: { id: number; name: string; playbook_title: string; playbook_subtitle: string; alignment_paragraph: string } | null;
  secondary: { id: number; name: string; secondary_blurb: string } | null;
}

export async function getResults(sessionId: string): Promise<SnapshotResults | null> {
  const s = getSupabaseAdminClient();
  const { data: sess } = await s.from("snapshot_quiz_sessions")
    .select("assessment_id, primary_cluster_id, secondary_cluster_id").eq("id", sessionId).maybeSingle();
  if (!sess) return null;
  const row = sess as { assessment_id: string; primary_cluster_id: number | null; secondary_cluster_id: number | null };
  const ids = [row.primary_cluster_id, row.secondary_cluster_id].filter((x): x is number => typeof x === "number");
  const [{ data: asm }, { data: clusters }] = await Promise.all([
    s.from("snapshot_assessments").select("display_name").eq("id", row.assessment_id).maybeSingle(),
    ids.length ? s.from("snapshot_clusters").select("id, name, playbook_title, playbook_subtitle, alignment_paragraph, secondary_blurb").in("id", ids) : Promise.resolve({ data: [] }),
  ]);
  const byId = new Map(((clusters ?? []) as Record<string, unknown>[]).map((c) => [c.id as number, c]));
  const p = row.primary_cluster_id != null ? byId.get(row.primary_cluster_id) : null;
  const sec = row.secondary_cluster_id != null ? byId.get(row.secondary_cluster_id) : null;
  return {
    assessment_display: ((asm as { display_name?: string } | null)?.display_name) ?? "",
    primary: p ? { id: p.id as number, name: p.name as string, playbook_title: p.playbook_title as string, playbook_subtitle: p.playbook_subtitle as string, alignment_paragraph: p.alignment_paragraph as string } : null,
    secondary: sec ? { id: sec.id as number, name: sec.name as string, secondary_blurb: sec.secondary_blurb as string } : null,
  };
}
