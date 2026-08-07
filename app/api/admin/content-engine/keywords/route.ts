import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The keyword corpus, made visible.
//
// 270 scored keywords across seven platforms have been in the database since
// they were imported, with nothing that could display them. The whole point of
// the keyword system is to answer "what should I make something about" — and a
// topic-intake screen that cannot show it makes the operator guess, which is the
// problem the corpus exists to solve.

export async function GET(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const platform = url.searchParams.get("platform");
  const tier = url.searchParams.get("tier");
  const q = url.searchParams.get("q")?.trim();

  const s = getSupabaseAdminClient();

  let query = s.from("ce_platform_keywords")
    .select("id, platform, rank, primary_phrase, phrase_kind, signal_role, audience_doorway, " +
            "rlc_interpretation, opening_use, supporting_terms, best_format, cta_fit, " +
            "phase_raw, domain_raw, opportunity_score, priority_tier, status")
    .eq("status", "active");

  if (platform) query = query.eq("platform", platform);
  if (tier) query = query.eq("priority_tier", tier);
  if (q) query = query.ilike("primary_phrase", `%${q}%`);

  // Highest opportunity first — the ordering the scoring exists to produce.
  const { data, error } = await query
    .order("opportunity_score", { ascending: false })
    .order("rank", { ascending: true })
    .limit(300);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Facets, computed over the whole corpus rather than the filtered slice, so
  // the counts do not shift as you narrow the view.
  const { data: all } = await s.from("ce_platform_keywords")
    .select("platform, priority_tier").eq("status", "active");
  const platforms: Record<string, number> = {};
  const tiers: Record<string, number> = {};
  for (const r of (all ?? []) as { platform: string; priority_tier: string }[]) {
    platforms[r.platform] = (platforms[r.platform] ?? 0) + 1;
    tiers[r.priority_tier] = (tiers[r.priority_tier] ?? 0) + 1;
  }

  // Communities, so a phrase can carry where it was seen.
  const { data: communities } = await s.from("ce_communities")
    .select("id, platform, community_keyword, verified, usage_guidance")
    .order("platform");

  return NextResponse.json({
    keywords: data ?? [],
    platforms, tiers,
    communities: communities ?? [],
    total: (all ?? []).length,
  });
}
