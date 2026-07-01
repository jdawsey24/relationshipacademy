import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns all completed sessions, enriched with structural phase, alignment,
// and expiration-risk labels. Search/filter/sort/pagination/CSV are done
// client-side (volumes are modest for a lead-gen tool).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();

  const [sessionsRes, selRes, phasesRes, alignRes, riskResultRes, riskLevelsRes] =
    await Promise.all([
      supabase
        .from("quiz_sessions")
        .select("id, name, email, quiz_type, completed_at, started_at")
        .order("completed_at", { ascending: false, nullsFirst: false }),
      supabase.from("structural_phase_selection").select("session_id, structural_phase_id"),
      supabase.from("structural_phases").select("id, slug, name"),
      supabase.from("alignment_results").select("session_id, alignment_status"),
      supabase.from("expiration_risk_results").select("session_id, risk_level_id"),
      supabase.from("risk_levels").select("id, risk_level"),
    ]);

  const err =
    sessionsRes.error ||
    selRes.error ||
    phasesRes.error ||
    alignRes.error ||
    riskResultRes.error ||
    riskLevelsRes.error;
  if (err) {
    return NextResponse.json(
      { error: "Failed to load leads.", details: err.message },
      { status: 502 }
    );
  }

  const phaseById = new Map((phasesRes.data ?? []).map((p) => [p.id, p]));
  const selBySession = new Map((selRes.data ?? []).map((s) => [s.session_id, s]));
  const alignBySession = new Map((alignRes.data ?? []).map((a) => [a.session_id, a]));
  const riskLevelById = new Map((riskLevelsRes.data ?? []).map((r) => [r.id, r]));
  const riskBySession = new Map((riskResultRes.data ?? []).map((r) => [r.session_id, r]));

  const rows = (sessionsRes.data ?? []).map((s) => {
    const sel = selBySession.get(s.id);
    const phase = sel ? phaseById.get(sel.structural_phase_id) : undefined;
    const isExpiration = phase?.slug === "expiration";
    const align = alignBySession.get(s.id);
    const risk = riskBySession.get(s.id);
    const riskLevel = risk ? riskLevelById.get(risk.risk_level_id)?.risk_level : null;
    return {
      session_id: s.id,
      name: s.name ?? "",
      email: s.email ?? "",
      structural_phase: phase?.name ?? "—",
      quiz_type: s.quiz_type ?? "",
      alignment_status: isExpiration ? "N/A" : align?.alignment_status ?? "—",
      expiration_risk: riskLevel ?? "—",
      completed_at: s.completed_at ?? s.started_at ?? null,
    };
  });

  return NextResponse.json({ rows });
}
