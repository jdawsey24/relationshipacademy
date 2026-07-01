import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const now = Date.now();
  const dayAgo = new Date(now - 24 * 3600 * 1000).toISOString();
  const weekAgo = new Date(now - 7 * 24 * 3600 * 1000).toISOString();

  const [
    sessionsRes,
    selRes,
    phasesRes,
    domainScoresRes,
    domainsRes,
    alignmentRes,
    siteLeadsRes,
  ] = await Promise.all([
    supabase.from("quiz_sessions").select("id, name, email, completed_at, started_at").order("completed_at", { ascending: false, nullsFirst: false }),
    supabase.from("structural_phase_selection").select("session_id, structural_phase_id"),
    supabase.from("structural_phases").select("id, name"),
    supabase.from("domain_scores").select("domain_id, average_score"),
    supabase.from("domains").select("id, name, display_order"),
    supabase.from("alignment_results").select("alignment_status"),
    supabase.from("site_leads").select("name, email, source, inquiry_type, message, created_at").order("created_at", { ascending: false }),
  ]);

  const err = sessionsRes.error || siteLeadsRes.error;
  if (err) {
    return NextResponse.json({ error: "Failed to load dashboard.", details: err.message }, { status: 502 });
  }

  const sessions = sessionsRes.data ?? [];
  const stamp = (s: { completed_at: string | null; started_at: string | null }) => s.completed_at ?? s.started_at;
  const completions = {
    today: sessions.filter((s) => (stamp(s) ?? "") >= dayAgo).length,
    week: sessions.filter((s) => (stamp(s) ?? "") >= weekAgo).length,
    all: sessions.length,
  };

  const siteLeads = siteLeadsRes.data ?? [];
  const newLeadsWeek = siteLeads.filter((l) => (l.created_at ?? "") >= weekAgo).length;
  const speakingWeek = siteLeads.filter((l) => l.source === "speaking_inquiry" && (l.created_at ?? "") >= weekAgo).length;
  const professionalTotal = siteLeads.filter((l) => l.source === "professional_interest").length;

  // Phase distribution
  const phaseName = new Map((phasesRes.data ?? []).map((p) => [p.id, p.name]));
  const selBySession = new Map((selRes.data ?? []).map((s) => [s.session_id, s.structural_phase_id]));
  const phaseCounts = new Map<string, number>();
  for (const s of sessions) {
    const pid = selBySession.get(s.id);
    const name = pid ? phaseName.get(pid) : undefined;
    if (name) phaseCounts.set(name, (phaseCounts.get(name) ?? 0) + 1);
  }
  const phaseDistribution = [...phaseCounts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  const topPhase = phaseDistribution[0] ?? null;

  // Lowest-scoring domain (most common growth area)
  const domainName = new Map((domainsRes.data ?? []).map((d) => [d.id, d.name]));
  const domainAgg = new Map<string, { sum: number; n: number }>();
  for (const d of domainScoresRes.data ?? []) {
    const a = domainAgg.get(d.domain_id) ?? { sum: 0, n: 0 };
    a.sum += d.average_score; a.n += 1;
    domainAgg.set(d.domain_id, a);
  }
  const domainAverages = [...domainAgg.entries()].map(([id, a]) => ({ name: domainName.get(id) ?? id, avg: a.sum / a.n }));
  const lowestDomain = domainAverages.length ? [...domainAverages].sort((a, b) => a.avg - b.avg)[0] : null;

  // Alignment distribution
  const congruent = (alignmentRes.data ?? []).filter((a) => a.alignment_status === "Congruent").length;
  const incongruent = (alignmentRes.data ?? []).filter((a) => a.alignment_status === "Incongruent").length;

  // Recent activity
  const recentCompletions = sessions.slice(0, 10).map((s) => ({
    name: s.name ?? "",
    email: s.email ?? "",
    phase: (() => { const pid = selBySession.get(s.id); return pid ? phaseName.get(pid) ?? "—" : "—"; })(),
    when: stamp(s),
  }));
  const recentContacts = siteLeads.filter((l) => l.source === "contact_form").slice(0, 5).map((l) => ({ name: l.name ?? "", email: l.email ?? "", inquiry_type: l.inquiry_type ?? "", when: l.created_at }));
  const recentSpeaking = siteLeads.filter((l) => l.source === "speaking_inquiry").slice(0, 5).map((l) => ({ name: l.name ?? "", email: l.email ?? "", when: l.created_at }));

  return NextResponse.json({
    completions,
    newLeadsWeek,
    speakingWeek,
    professionalTotal,
    insights: {
      topPhase,
      phaseDistribution,
      lowestDomain,
      alignment: { congruent, incongruent },
    },
    recent: { completions: recentCompletions, contacts: recentContacts, speaking: recentSpeaking },
  });
}
