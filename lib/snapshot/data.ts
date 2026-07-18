import { randomUUID } from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { scoreClusters } from "@/lib/snapshot/scoring";
import { contextFor, shuffle } from "@/lib/snapshot/statements";
import { playbookUrl } from "@/lib/snapshot/playbooks";

// v2 data layer: 5 structural markers, slot-based questions whose statements are
// resolved once at session start (sampled without replacement per cluster, cluster
// 24 context-filtered by marker). Service-role only.

export interface PickerAssessment { id: string; display_name: string; entry_prompt: string }
export interface QuizOption { id: string; statement: string }   // id = session_item id
export interface QuizQuestion { id: string; question_order: number; options: QuizOption[] }
export interface StartResult { session_id: string; questions: QuizQuestion[] }

// Picker order = the intentional situation order, not alphabetical.
const MARKER_ORDER = ["single_but_dating", "in_a_relationship", "married_or_long_term", "recent_divorce_breakup", "single_contemplating_dating"];

export async function listAssessments(): Promise<PickerAssessment[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_assessments").select("id, display_name, entry_prompt");
  return ((data ?? []) as PickerAssessment[]).sort((a, b) => MARKER_ORDER.indexOf(a.id) - MARKER_ORDER.indexOf(b.id));
}

// Start a session: resolve each slot to a unique statement from its cluster's pool
// (without replacement), persist, and return the quiz with resolved statements.
export async function startSession(markerId: string): Promise<StartResult | null> {
  const s = getSupabaseAdminClient();
  const { data: asm } = await s.from("snapshot_assessments").select("id").eq("id", markerId).maybeSingle();
  if (!asm) return null;

  const { data: qData } = await s.from("snapshot_quiz_questions").select("id, question_order").eq("assessment_id", markerId).order("question_order");
  const questions = (qData ?? []) as { id: string; question_order: number }[];
  if (!questions.length) return null;
  const qIds = questions.map((q) => q.id);
  const { data: slotData } = await s.from("snapshot_quiz_question_slots").select("question_id, slot_order, cluster_id, tier").in("question_id", qIds);
  const slots = (slotData ?? []) as { question_id: string; slot_order: number; cluster_id: number; tier: string }[];

  // Item pools per cluster (context-filtered for cluster 24), shuffled once.
  const clusterIds = [...new Set(slots.map((sl) => sl.cluster_id))];
  const { data: itemData } = await s.from("snapshot_quiz_items").select("cluster_id, statement, context").in("cluster_id", clusterIds);
  const items = (itemData ?? []) as { cluster_id: number; statement: string; context: string | null }[];
  const pools = new Map<number, string[]>();
  for (const cid of clusterIds) {
    const ctx = contextFor(markerId, cid);
    const pool = items.filter((i) => i.cluster_id === cid && (ctx === null || i.context === ctx)).map((i) => i.statement);
    pools.set(cid, shuffle(pool));
  }

  // Assign without replacement — unique per cluster AND unique across the whole
  // session (a few statements legitimately live in two clusters; the no-repeat rule
  // is about the sentence, so dedup session-wide, advancing past any already used).
  const cursor = new Map<number, number>();
  const used = new Set<string>();
  const sessionId = randomUUID();
  const sessionItems = slots.map((sl) => {
    const pool = pools.get(sl.cluster_id) ?? [];
    let idx = cursor.get(sl.cluster_id) ?? 0;
    let statement: string | undefined;
    while (idx < pool.length) {
      const cand = pool[idx];
      idx++;
      if (!used.has(cand)) { statement = cand; break; }
    }
    cursor.set(sl.cluster_id, idx);
    if (!statement) statement = pool[Math.max(0, pool.length - 1)] ?? "This resonates most for me."; // feasibility guaranteed offline; fallback only
    used.add(statement);
    return { id: randomUUID(), session_id: sessionId, question_id: sl.question_id, slot_order: sl.slot_order, cluster_id: sl.cluster_id, tier: sl.tier, statement };
  });

  const { error: sErr } = await s.from("snapshot_quiz_sessions").insert({ id: sessionId, assessment_id: markerId });
  if (sErr) return null;
  const { error: iErr } = await s.from("snapshot_quiz_session_items").insert(sessionItems);
  if (iErr) return null;

  const byQ = new Map<string, { id: string; slot_order: number; statement: string }[]>();
  for (const si of sessionItems) {
    const arr = byQ.get(si.question_id) ?? [];
    arr.push({ id: si.id, slot_order: si.slot_order, statement: si.statement });
    byQ.set(si.question_id, arr);
  }
  const outQuestions: QuizQuestion[] = questions.map((q) => ({
    id: q.id, question_order: q.question_order,
    options: (byQ.get(q.id) ?? []).sort((a, b) => a.slot_order - b.slot_order).map((o) => ({ id: o.id, statement: o.statement })),
  }));
  return { session_id: sessionId, questions: outQuestions };
}

async function clusterNames(ids: number[]): Promise<Map<number, string>> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_clusters").select("id, name").in("id", ids);
  return new Map((data ?? []).map((c) => [(c as { id: number }).id, (c as { name: string }).name]));
}

async function oneStatement(markerId: string, clusterId: number): Promise<string> {
  const s = getSupabaseAdminClient();
  const ctx = contextFor(markerId, clusterId);
  let q = s.from("snapshot_quiz_items").select("statement").eq("cluster_id", clusterId);
  if (ctx !== null) q = q.eq("context", ctx);
  const { data } = await q.limit(1).maybeSingle();
  return ((data as { statement?: string } | null)?.statement) ?? "This resonates most for me.";
}

export interface ScoreOutcome {
  session_id: string;
  tied: boolean;
  tiebreak?: { cluster_id: number; name: string; statement: string }[];
}

// A neutral answer ("None of these fit") selects no statement; option_id is null.
const LOW_CONFIDENCE_RATIO = 0.4; // >40% neutral flags the session as low-confidence

// Score a started session from its answers (each = a chosen session_item id, or a
// neutral answer that scores nothing). Neutral answers are tallied and, past a
// threshold, flag the session as low-confidence.
export async function scoreSession(input: { sessionId: string; answers: { question_id: string; option_id: string | null; is_neutral?: boolean }[] }): Promise<ScoreOutcome | null> {
  const s = getSupabaseAdminClient();
  const { data: sess } = await s.from("snapshot_quiz_sessions").select("id, assessment_id").eq("id", input.sessionId).maybeSingle();
  if (!sess) return null;
  const markerId = (sess as { assessment_id: string }).assessment_id;

  const answerRows = input.answers.map((a) => ({
    session_id: input.sessionId, question_id: a.question_id,
    selected_session_item_id: a.is_neutral ? null : a.option_id, is_neutral: !!a.is_neutral,
  }));
  if (answerRows.length) await s.from("snapshot_quiz_answers").upsert(answerRows, { onConflict: "session_id,question_id" });

  const neutralCount = input.answers.filter((a) => a.is_neutral).length;
  const isLowConfidence = input.answers.length > 0 && neutralCount / input.answers.length > LOW_CONFIDENCE_RATIO;

  const pickedIds = input.answers.filter((a) => !a.is_neutral && a.option_id).map((a) => a.option_id as string);
  const { data: sis } = pickedIds.length ? await s.from("snapshot_quiz_session_items").select("cluster_id").in("id", pickedIds) : { data: [] };
  const clusterIds = (sis ?? []).map((x) => (x as { cluster_id: number }).cluster_id);
  const result = scoreClusters(clusterIds);

  if (result.isTied) {
    await s.from("snapshot_quiz_sessions").update({ is_tied: true, neutral_answer_count: neutralCount, is_low_confidence: isLowConfidence }).eq("id", input.sessionId);
    const names = await clusterNames(result.tiedClusterIds);
    const tiebreak = await Promise.all(result.tiedClusterIds.map(async (cid) => ({ cluster_id: cid, name: names.get(cid) ?? `Cluster ${cid}`, statement: await oneStatement(markerId, cid) })));
    return { session_id: input.sessionId, tied: true, tiebreak };
  }
  await s.from("snapshot_quiz_sessions").update({
    completed_at: new Date().toISOString(),
    primary_cluster_id: result.primary?.clusterId ?? null,
    secondary_cluster_id: result.secondary?.clusterId ?? null,
    neutral_answer_count: neutralCount, is_low_confidence: isLowConfidence,
  }).eq("id", input.sessionId);
  return { session_id: input.sessionId, tied: false };
}

export async function resolveTiebreak(sessionId: string, winnerClusterId: number): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { data: sess } = await s.from("snapshot_quiz_sessions").select("id").eq("id", sessionId).maybeSingle();
  if (!sess) return false;
  const { data: ans } = await s.from("snapshot_quiz_answers").select("selected_session_item_id").eq("session_id", sessionId);
  const selIds = (ans ?? []).map((a) => (a as { selected_session_item_id: string | null }).selected_session_item_id).filter((x): x is string => !!x);
  const { data: sis } = await s.from("snapshot_quiz_session_items").select("cluster_id").in("id", selIds);
  const clusterIds = (sis ?? []).map((x) => (x as { cluster_id: number }).cluster_id);
  const { tiedClusterIds } = scoreClusters(clusterIds);
  if (!tiedClusterIds.includes(winnerClusterId)) return false;
  const secondary = tiedClusterIds.find((c) => c !== winnerClusterId) ?? null;
  const { error } = await s.from("snapshot_quiz_sessions")
    .update({ completed_at: new Date().toISOString(), primary_cluster_id: winnerClusterId, secondary_cluster_id: secondary }).eq("id", sessionId);
  return !error;
}

export async function convertSession(sessionId: string, email: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("snapshot_quiz_sessions")
    .update({ contact_email: email, converted_at: new Date().toISOString() }).eq("id", sessionId);
  return !error;
}

export interface SnapshotResults {
  assessment_display: string;
  primary: { id: number; name: string; playbook_title: string; playbook_subtitle: string; alignment_paragraph: string } | null;
  secondary: { id: number; name: string; secondary_blurb: string } | null;
  playbook_url: string | null;
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
    playbook_url: playbookUrl(row.primary_cluster_id),
  };
}
