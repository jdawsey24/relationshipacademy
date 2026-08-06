import { getSupabaseAdminClient } from "@/lib/supabase";
import { canonicalName, dedupeKey, extractUrl, sanitizeUntrusted } from "@/lib/contentEngine/normalize";
import type { ManualTrendInput, TrendObservation, TrendProvider } from "@/lib/contentEngine/types";

// Trend intake.
//
// Phase 1 has exactly one provider: the operator pasting something from their own
// timeline. That is not a stopgap — no official API exposes a personalised For
// You feed or Threads' Trending Now, so manual entry is the only route to the
// thing the operator actually saw. Phase 2 adds discovery providers behind the
// same TrendProvider interface.

/** The manual provider. Always available, so the engine works with every API down. */
export const manualProvider: TrendProvider = {
  name: "manual",
  kind: "manual",
  configured: () => true,
  async observe({ raw }) {
    if (!raw) return [];
    const url = extractUrl(raw);
    const sanitized = sanitizeUntrusted(raw);
    const obs: TrendObservation = {
      source_name: "manual",
      platform: null,
      region: null,
      exact_phrase: url && raw.trim() === url ? null : sanitized.text.split(/[.!?\n]/)[0]?.slice(0, 200) ?? null,
      related_phrases: [],
      // Deliberately empty: a pasted post carries no measurable engagement, and
      // inventing a number here would turn an observation into a false metric.
      metrics: {},
      source_url: url,
      confidence: null,
      api_status: "ok",
      raw_response: null,
      fetched_at: new Date().toISOString(),
      cache_expires_at: null,
    };
    return [obs];
  },
};

export interface CreateTrendResult {
  id: string;
  canonical_name: string;
  created: boolean;
  /** True when an existing candidate matched — the operator entered it before. */
  merged: boolean;
  strippedInjection: boolean;
  removed: string[];
}

/**
 * Create (or merge into) a trend candidate from pasted input.
 *
 * Merging matters: the same story gets pasted more than once, worded differently
 * each time. Without a stable dedupe key the board fills with duplicates of one
 * topic and the operator loses the thread.
 */
export async function createManualTrend(
  input: ManualTrendInput,
  actor: string | null,
): Promise<CreateTrendResult> {
  const raw = (input.raw ?? "").trim();
  if (!raw) throw new Error("Nothing was entered.");
  if (raw.length > 20_000) throw new Error("That input is too long.");

  const s = getSupabaseAdminClient();
  const sanitized = sanitizeUntrusted(raw);
  const name = canonicalName(raw);
  const key = dedupeKey(raw);

  const { data: existing } = await s
    .from("ce_trend_candidates")
    .select("id, canonical_name")
    .eq("dedupe_key", key)
    .maybeSingle();

  const [observation] = await manualProvider.observe({ raw });

  if (existing) {
    const row = existing as { id: string; canonical_name: string };
    // Re-entry is a fresh sighting, not a new topic.
    await s.from("ce_trend_observations").insert({
      candidate_id: row.id,
      source_name: observation.source_name,
      platform: input.platform ?? null,
      exact_phrase: observation.exact_phrase,
      related_phrases: observation.related_phrases,
      metrics: observation.metrics,
      source_url: observation.source_url,
      api_status: observation.api_status,
      fetched_at: observation.fetched_at,
    });
    await s.from("ce_trend_candidates")
      .update({ last_validated_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", row.id);
    return {
      id: row.id, canonical_name: row.canonical_name, created: false, merged: true,
      strippedInjection: sanitized.strippedInjection, removed: sanitized.removed,
    };
  }

  const now = new Date().toISOString();
  const { data: created, error } = await s
    .from("ce_trend_candidates")
    .insert({
      canonical_name: name,
      dedupe_key: key,
      entry_mode: "manual",
      // Store the SANITIZED text. The engine never needs the raw bytes, and
      // keeping them would leave instruction-shaped content sitting in a column
      // that later features might read without thinking.
      raw_input: sanitized.text,
      community_seen: input.community_seen ?? null,
      exact_phrase: observation.exact_phrase,
      status: "new",
      first_observed_at: now,
      last_validated_at: now,
      created_by: actor,
    })
    .select("id, canonical_name")
    .single();
  if (error) throw new Error(error.message);

  const row = created as { id: string; canonical_name: string };
  await s.from("ce_trend_observations").insert({
    candidate_id: row.id,
    source_name: observation.source_name,
    platform: input.platform ?? null,
    exact_phrase: observation.exact_phrase,
    related_phrases: observation.related_phrases,
    metrics: observation.metrics,
    source_url: observation.source_url,
    api_status: observation.api_status,
    fetched_at: observation.fetched_at,
  });

  return {
    id: row.id, canonical_name: row.canonical_name, created: true, merged: false,
    strippedInjection: sanitized.strippedInjection, removed: sanitized.removed,
  };
}

export async function listTrends(limit = 50) {
  const s = getSupabaseAdminClient();
  const { data } = await s
    .from("ce_trend_candidates")
    .select("id, canonical_name, status, entry_mode, community_seen, exact_phrase, first_observed_at, last_validated_at")
    .order("last_validated_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getTrend(id: string) {
  const s = getSupabaseAdminClient();
  const { data: candidate } = await s.from("ce_trend_candidates").select("*").eq("id", id).maybeSingle();
  if (!candidate) return null;
  const [{ data: observations }, { data: bridges }] = await Promise.all([
    s.from("ce_trend_observations").select("*").eq("candidate_id", id).order("fetched_at", { ascending: false }),
    s.from("ce_relational_bridges").select("*").eq("candidate_id", id).order("created_at"),
  ]);
  return { candidate, observations: observations ?? [], bridges: bridges ?? [] };
}
