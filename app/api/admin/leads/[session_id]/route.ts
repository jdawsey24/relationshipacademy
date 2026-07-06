import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ session_id: string }> }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { session_id } = await params;
  const supabase = getSupabaseAdminClient();

  const [
    sessionRes,
    selRes,
    phasesRes,
    alignRes,
    riskRes,
    riskLevelsRes,
    domainScoresRes,
    competencyScoresRes,
    responsesRes,
    domainsRes,
    competencyPhasesRes,
    resultLevelsRes,
    questionsRes,
  ] = await Promise.all([
    supabase.from("quiz_sessions").select("*").eq("id", session_id).maybeSingle(),
    supabase.from("structural_phase_selection").select("structural_phase_id").eq("session_id", session_id).maybeSingle(),
    supabase.from("structural_phases").select("id, slug, name"),
    supabase.from("alignment_results").select("alignment_status, interpretation_text").eq("session_id", session_id).maybeSingle(),
    supabase.from("expiration_risk_results").select("average_score, risk_level_id").eq("session_id", session_id).maybeSingle(),
    supabase.from("risk_levels").select("id, risk_level, title"),
    supabase.from("domain_scores").select("domain_id, average_score, result_level_id").eq("session_id", session_id),
    supabase.from("competency_phase_scores").select("competency_phase_id, average_score, result_level_id").eq("session_id", session_id),
    supabase.from("quiz_responses").select("question_id, raw_response, scored_value").eq("session_id", session_id),
    supabase.from("domains").select("id, name, display_order"),
    supabase.from("competency_phases").select("id, name, display_order"),
    supabase.from("result_levels").select("id, level, title"),
    supabase.from("questions").select("id, question_text"),
  ]);

  if (sessionRes.error) {
    return NextResponse.json({ error: "Failed to load session." }, { status: 502 });
  }
  if (!sessionRes.data) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const phaseById = new Map((phasesRes.data ?? []).map((p) => [p.id, p]));
  const domainById = new Map((domainsRes.data ?? []).map((d) => [d.id, d]));
  const competencyById = new Map((competencyPhasesRes.data ?? []).map((c) => [c.id, c]));
  const resultLevelById = new Map((resultLevelsRes.data ?? []).map((r) => [r.id, r]));
  const riskLevelById = new Map((riskLevelsRes.data ?? []).map((r) => [r.id, r]));
  const questionText = new Map((questionsRes.data ?? []).map((q) => [q.id, q.question_text]));

  const s = sessionRes.data;
  const phase = selRes.data ? phaseById.get(selRes.data.structural_phase_id) : undefined;
  const risk = riskRes.data ? riskLevelById.get(riskRes.data.risk_level_id) : undefined;

  const domainScores = (domainScoresRes.data ?? [])
    .map((d) => ({
      domain: domainById.get(d.domain_id)?.name ?? d.domain_id,
      order: domainById.get(d.domain_id)?.display_order ?? 999,
      average_score: d.average_score,
      level: d.result_level_id ? resultLevelById.get(d.result_level_id)?.level ?? null : null,
    }))
    .sort((a, b) => a.order - b.order);

  const competencyScores = (competencyScoresRes.data ?? [])
    .map((c) => ({
      phase: competencyById.get(c.competency_phase_id)?.name ?? c.competency_phase_id,
      order: competencyById.get(c.competency_phase_id)?.display_order ?? 999,
      average_score: c.average_score,
      level: c.result_level_id ? resultLevelById.get(c.result_level_id)?.level ?? null : null,
    }))
    .sort((a, b) => a.order - b.order);

  const responses = (responsesRes.data ?? [])
    .map((r) => ({
      question_id: r.question_id,
      question_text: questionText.get(r.question_id) ?? "",
      raw_response: r.raw_response,
      scored_value: r.scored_value,
    }))
    .sort((a, b) => a.question_id.localeCompare(b.question_id));

  return NextResponse.json({
    respondent: {
      name: s.name ?? "",
      email: s.email ?? "",
      relationship_length: s.relationship_length ?? "",
      relationship_status_detail: s.relationship_status_detail ?? "",
      quiz_type: s.quiz_type ?? "",
      completed_at: s.completed_at ?? s.started_at ?? null,
    },
    structural_phase: phase?.name ?? "—",
    is_expiration: phase?.slug === "expiration",
    alignment: alignRes.data
      ? { status: alignRes.data.alignment_status, interpretation_text: alignRes.data.interpretation_text ?? null }
      : null,
    expiration_risk: riskRes.data
      ? { average_score: riskRes.data.average_score, risk_level: risk?.risk_level ?? null }
      : null,
    domain_scores: domainScores,
    competency_scores: competencyScores,
    responses,
  });
}
