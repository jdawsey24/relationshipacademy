// Content Engine — shared types.
//
// The TrendProvider interface is defined now, in Phase 1, even though the only
// implementation is manual entry. Phase 2 (web search, YouTube, Threads) then
// slots in behind the same shape without touching the engine, and a provider
// outage degrades to "that source returned nothing" rather than breaking a run.

/** The six relational bridges. A trend is only usable if one of these is honest. */
export const BRIDGE_TYPES = [
  "direct",           // dating, commitment, marriage, separation, healing
  "life_disruption",  // what changed in communication, trust, conflict, roles, intimacy
  "seasonal",         // a predictable transition someone should prepare for
  "controversy",      // what the argument reveals about accountability, values, trust, shame
  "collective",       // what it did to couples, families, teams, communities
  "cultural",         // a relational pattern being acted out, debated, or misread
] as const;
export type BridgeType = (typeof BRIDGE_TYPES)[number];

export const PLATFORMS = [
  "threads", "instagram", "tiktok", "youtube", "linkedin", "x", "pinterest",
] as const;
export type Platform = (typeof PLATFORMS)[number];

/** What every trend source must return, whatever it is underneath. */
export interface TrendObservation {
  source_name: string;
  platform: string | null;
  region: string | null;
  exact_phrase: string | null;
  related_phrases: string[];
  /** Only what the provider genuinely returns. Threads, for example, has no engagement metrics. */
  metrics: Record<string, unknown>;
  source_url: string | null;
  confidence: number | null;
  api_status: string;
  raw_response: unknown;
  fetched_at: string;
  cache_expires_at: string | null;
}

export interface TrendProvider {
  name: string;
  /** Discovery finds topics we didn't know to look for; validation only measures a known phrase. */
  kind: "discovery" | "validation" | "manual";
  configured(): boolean;
  /** Must resolve, never throw — a dead provider returns [] so the engine keeps working. */
  observe(input: { query?: string; raw?: string; region?: string }): Promise<TrendObservation[]>;
}

export interface ManualTrendInput {
  /** A phrase, a post URL, pasted post text, or a description of what you saw. */
  raw: string;
  community_seen?: string | null;
  platform?: string | null;
  notes?: string | null;
}

export interface BridgeCandidate {
  bridge_type: BridgeType;
  affected_population: string;
  relational_consequence: string;
  angle: string;
  competency_id: string;
  phase_id: string | null;
  domain_id: string | null;
  rationale: string;
  is_forced: boolean;
}

export type QcSeverity = "info" | "low" | "medium" | "high" | "critical";

export interface QcFinding {
  check_type: string;
  severity: QcSeverity;
  passed: boolean;
  finding: string;
  recommendation?: string;
}

/**
 * Owner ruling 2026-08-06: only `critical` blocks a draft from being usable.
 * `high` is surfaced prominently but does not gate — the owner decides.
 */
export const BLOCKING_SEVERITIES: QcSeverity[] = ["critical"];

export function isBlocked(findings: QcFinding[]): boolean {
  return findings.some((f) => !f.passed && BLOCKING_SEVERITIES.includes(f.severity));
}

/** Owner ruling 2026-08-06: 3 minimum, 5 maximum bridges per trend. */
export const BRIDGE_MIN = 3;
export const BRIDGE_MAX = 5;
