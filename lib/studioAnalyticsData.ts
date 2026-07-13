import { getSupabaseAdminClient } from "@/lib/supabase";
import { getWorkspaceCounts } from "@/lib/studioFrameworkData";
import type { KbCompetency } from "@/lib/studio";

// Server-only per-competency Analytics reads (V1 architecture scaffold). Strict
// separation: competency-specific data (inventory, owner simulations) is kept
// apart from broader phase/domain context (shared, NOT this competency). All
// live↔studio mappings are DETERMINISTIC (stable slugs), never label matching.
// Every block carries its own provenance. RESILIENT — missing tables/mappings
// return null/0, never throw. This module NEVER touches the live results/score
// request path.

export interface Provenance {
  source: string;              // where the metric comes from
  version: string | null;      // scoring rule / assessment version
  validation: string;          // e.g. "Provisional (owner test data)" | "Validated live"
  updatedAt: string | null;    // ISO timestamp of the freshest input
}

export interface InventorySummary {
  items: number;
  approvedItems: number;
  content: number;             // total content assets across types
  indicators: number;
  recommendations: number;
  prov: Provenance;
}

export interface SimulationStats {
  attempts: number;            // simulation score-result rows for this competency
  avgScore: number | null;     // mean transformed_score (1–5), null if none
  confidence: { ok: number; insufficient: number; suppressed: number };
  prov: Provenance;
}

export interface ContextStat {
  label: string;               // phase/domain display name
  avg: number | null;          // mean respondent average_score
  count: number;               // contributing score rows
  prov: Provenance;
}

export interface CompetencyAnalytics {
  inventory: InventorySummary;
  simulation: SimulationStats;
  phaseContext: ContextStat | null;
  domainContext: ContextStat | null;
}

function mean(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
}

// The active live assessment version label + freshest completed session — shared
// provenance for the broader-context (live) blocks.
async function liveProvenanceBase(s: ReturnType<typeof getSupabaseAdminClient>): Promise<{ version: string | null; asOf: string | null }> {
  let version: string | null = null;
  let asOf: string | null = null;
  try {
    const { data } = await s.from("assessment_versions").select("version_label").is("active_to", null).limit(1);
    version = (data?.[0] as { version_label?: string } | undefined)?.version_label ?? null;
  } catch { /* leave null */ }
  try {
    const { data } = await s.from("quiz_sessions").select("completed_at").not("completed_at", "is", null).order("completed_at", { ascending: false }).limit(1);
    asOf = (data?.[0] as { completed_at?: string } | undefined)?.completed_at ?? null;
  } catch { /* leave null */ }
  return { version, asOf };
}

export async function getCompetencyAnalytics(code: string, competency: KbCompetency): Promise<CompetencyAnalytics> {
  const counts = await getWorkspaceCounts(code);
  const contentTotal = Object.values(counts.content).reduce((a, b) => a + b, 0);

  const inventory: InventorySummary = {
    items: counts.items.total,
    approvedItems: counts.items.approved,
    content: contentTotal,
    indicators: counts.indicators.behavioral,
    recommendations: counts.recommendations,
    prov: { source: "Studio authoring tables", version: null, validation: "Live inventory", updatedAt: counts.lastUpdated },
  };

  // ---- Simulation (competency-specific, provisional owner test data) ----
  const simulation: SimulationStats = {
    attempts: 0, avgScore: null, confidence: { ok: 0, insufficient: 0, suppressed: 0 },
    prov: { source: "Studio scoring simulations", version: null, validation: "Provisional (owner test data)", updatedAt: null },
  };
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s
      .from("studio_score_results")
      .select("attempt_id, transformed_score, confidence_status, rule_version")
      .eq("score_level", "competency")
      .eq("entity_id", code)
      .limit(2000);
    const rows = (data ?? []) as Array<Record<string, unknown>>;
    if (rows.length) {
      simulation.attempts = rows.length;
      simulation.avgScore = mean(rows.map((r) => Number(r.transformed_score)).filter((n) => !Number.isNaN(n)));
      for (const r of rows) {
        const c = String(r.confidence_status ?? "");
        if (c === "ok") simulation.confidence.ok++;
        else if (c === "insufficient") simulation.confidence.insufficient++;
        else if (c === "suppressed") simulation.confidence.suppressed++;
      }
      // Most recent rule_version seen (stable ordering not guaranteed; take last non-empty).
      simulation.prov.version = (rows.map((r) => String(r.rule_version ?? "")).filter(Boolean).pop()) ?? null;
      // Freshest contributing attempt time.
      const attemptIds = [...new Set(rows.map((r) => String(r.attempt_id)).filter(Boolean))];
      if (attemptIds.length) {
        const { data: att } = await s.from("studio_assessment_attempts").select("created_at").in("id", attemptIds).order("created_at", { ascending: false }).limit(1);
        simulation.prov.updatedAt = (att?.[0] as { created_at?: string } | undefined)?.created_at ?? null;
      }
    }
  } catch { /* leave empty */ }

  // ---- Broader context: phase & domain (shared, NOT this competency) ----
  let phaseContext: ContextStat | null = null;
  let domainContext: ContextStat | null = null;
  try {
    const s = getSupabaseAdminClient();
    const { version, asOf } = await liveProvenanceBase(s);
    const liveProv = (): Provenance => ({ source: "Live Snapshot respondents", version, validation: "Validated live", updatedAt: asOf });

    // Phase — deterministic slug match (competency_phases.slug == phase_slug).
    const phaseSlug = competency.phase_slug;
    if (phaseSlug) {
      const { data: cp } = await s.from("competency_phases").select("id, name").eq("slug", phaseSlug).eq("measure_type", "competency").limit(1);
      const row = cp?.[0] as { id: string; name: string } | undefined;
      if (row) {
        const { data: scores } = await s.from("competency_phase_scores").select("average_score").eq("competency_phase_id", row.id).limit(5000);
        const vals = (scores ?? []).map((r) => Number((r as { average_score: unknown }).average_score)).filter((n) => !Number.isNaN(n));
        phaseContext = { label: row.name, avg: mean(vals), count: vals.length, prov: liveProv() };
      }
    }

    // Domain — deterministic slug match (domains.slug == domain_slug). No name matching.
    const domainSlug = competency.domain_slug;
    if (domainSlug) {
      const { data: dm } = await s.from("domains").select("id, name").eq("slug", domainSlug).limit(1);
      const row = dm?.[0] as { id: string; name: string } | undefined;
      if (row) {
        const { data: scores } = await s.from("domain_scores").select("average_score").eq("domain_id", row.id).limit(5000);
        const vals = (scores ?? []).map((r) => Number((r as { average_score: unknown }).average_score)).filter((n) => !Number.isNaN(n));
        domainContext = { label: row.name, avg: mean(vals), count: vals.length, prov: liveProv() };
      }
    }
  } catch { /* leave null */ }

  return { inventory, simulation, phaseContext, domainContext };
}
