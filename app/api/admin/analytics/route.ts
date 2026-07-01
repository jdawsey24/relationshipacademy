import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const supabase = getSupabaseAdminClient();
  const [sessionsRes, selRes, phasesRes, domainScoresRes, domainsRes, alignmentRes, riskRes, riskLevelsRes, siteLeadsRes] =
    await Promise.all([
      supabase.from("quiz_sessions").select("id, completed_at, started_at"),
      supabase.from("structural_phase_selection").select("session_id, structural_phase_id"),
      supabase.from("structural_phases").select("id, name, display_order"),
      supabase.from("domain_scores").select("domain_id, average_score"),
      supabase.from("domains").select("id, name, display_order"),
      supabase.from("alignment_results").select("alignment_status"),
      supabase.from("expiration_risk_results").select("risk_level_id"),
      supabase.from("risk_levels").select("id, risk_level"),
      supabase.from("site_leads").select("source"),
    ]);

  const err = sessionsRes.error || domainScoresRes.error;
  if (err) {
    return NextResponse.json({ error: "Failed to load analytics.", details: err.message }, { status: 502 });
  }

  const sessions = sessionsRes.data ?? [];

  // Completions over the last 8 weeks (by ISO week bucket, oldest first)
  const now = Date.now();
  const weekBuckets: { label: string; count: number }[] = [];
  for (let w = 7; w >= 0; w--) {
    const start = now - (w + 1) * 7 * 24 * 3600 * 1000;
    const end = now - w * 7 * 24 * 3600 * 1000;
    const startIso = new Date(start).toISOString();
    const endIso = new Date(end).toISOString();
    const count = sessions.filter((s) => {
      const t = s.completed_at ?? s.started_at ?? "";
      return t >= startIso && t < endIso;
    }).length;
    weekBuckets.push({ label: w === 0 ? "This week" : `${w}w ago`, count });
  }

  // Phase distribution
  const phaseInfo = new Map((phasesRes.data ?? []).map((p) => [p.id, p]));
  const selBySession = new Map((selRes.data ?? []).map((s) => [s.session_id, s.structural_phase_id]));
  const phaseCounts = new Map<string, number>();
  for (const s of sessions) {
    const pid = selBySession.get(s.id);
    const info = pid ? phaseInfo.get(pid) : undefined;
    if (info) phaseCounts.set(info.name, (phaseCounts.get(info.name) ?? 0) + 1);
  }
  const phaseDistribution = (phasesRes.data ?? [])
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((p) => ({ name: p.name, count: phaseCounts.get(p.name) ?? 0 }));

  // Domain averages
  const domainName = new Map((domainsRes.data ?? []).map((d) => [d.id, d]));
  const domainAgg = new Map<string, { sum: number; n: number }>();
  for (const d of domainScoresRes.data ?? []) {
    const a = domainAgg.get(d.domain_id) ?? { sum: 0, n: 0 };
    a.sum += d.average_score; a.n += 1;
    domainAgg.set(d.domain_id, a);
  }
  const domainAverages = (domainsRes.data ?? [])
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((d) => {
      const a = domainAgg.get(d.id);
      return { name: d.name, avg: a ? Math.round((a.sum / a.n) * 100) / 100 : 0 };
    });

  // Alignment
  const alignment = [
    { name: "Congruent", count: (alignmentRes.data ?? []).filter((a) => a.alignment_status === "Congruent").length },
    { name: "Incongruent", count: (alignmentRes.data ?? []).filter((a) => a.alignment_status === "Incongruent").length },
  ];

  // Risk distribution
  const riskName = new Map((riskLevelsRes.data ?? []).map((r) => [r.id, r.risk_level]));
  const riskCounts = new Map<string, number>();
  for (const r of riskRes.data ?? []) {
    const name = r.risk_level_id ? riskName.get(r.risk_level_id) : undefined;
    if (name) riskCounts.set(name, (riskCounts.get(name) ?? 0) + 1);
  }
  const riskDistribution = [...riskCounts.entries()].map(([name, count]) => ({ name, count }));

  // Lead sources
  const sourceCounts = new Map<string, number>();
  for (const l of siteLeadsRes.data ?? []) {
    sourceCounts.set(l.source, (sourceCounts.get(l.source) ?? 0) + 1);
  }
  const leadSources = [...sourceCounts.entries()].map(([name, count]) => ({ name, count }));

  return NextResponse.json({
    completionsOverTime: weekBuckets,
    phaseDistribution,
    domainAverages,
    alignment,
    riskDistribution,
    leadSources,
    totalSessions: sessions.length,
  });
}
