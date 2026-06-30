import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { DOMAINS } from "@/lib/domains";
import type {
  AlignmentStatus,
  CompetencyResult,
  DomainResult,
  RecommendationView,
  ResultsResponse,
} from "@/types/assessment";

// Result rows hold respondent PII-adjacent data, so they are read here with the
// service-role key and returned only for the requested session_id — never read
// directly from the browser.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Resolve a level/risk band row id -> its descriptive fields. */
type LevelRow = {
  id: string;
  level?: string;
  risk_level?: string;
  title: string;
  interpretation: string | null;
  recommendation: string | null;
  cta: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing 'session_id'." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server misconfigured: Supabase credentials missing." },
      { status: 500 }
    );
  }

  const [
    sessionRes,
    structuralSelRes,
    domainScoresRes,
    competencyScoresRes,
    expirationRes,
    alignmentRes,
    domainsRes,
    competencyPhasesRes,
    structuralPhasesRes,
    resultLevelsRes,
    riskLevelsRes,
    recommendationsRes,
  ] = await Promise.all([
    supabase.from("quiz_sessions").select("id, name").eq("id", sessionId).maybeSingle(),
    supabase
      .from("structural_phase_selection")
      .select("structural_phase_id")
      .eq("session_id", sessionId)
      .maybeSingle(),
    supabase.from("domain_scores").select("domain_id, average_score, result_level_id").eq("session_id", sessionId),
    supabase
      .from("competency_phase_scores")
      .select("competency_phase_id, average_score, result_level_id")
      .eq("session_id", sessionId),
    supabase
      .from("expiration_risk_results")
      .select("average_score, risk_level_id")
      .eq("session_id", sessionId)
      .maybeSingle(),
    supabase
      .from("alignment_results")
      .select("alignment_status, interpretation_text")
      .eq("session_id", sessionId)
      .maybeSingle(),
    supabase.from("domains").select("id, slug, name, display_order"),
    supabase.from("competency_phases").select("id, slug, consumer_name, display_order"),
    supabase.from("structural_phases").select("id, slug, name, defining_feature"),
    supabase.from("result_levels").select("id, level, title, interpretation, recommendation, cta"),
    supabase.from("risk_levels").select("id, risk_level, title, interpretation, recommendation, cta"),
    supabase.from("recommendations").select("trigger_type, trigger_value, recommendation_text, next_step"),
  ]);

  if (sessionRes.error) {
    return NextResponse.json(
      { error: "Failed to load session.", details: sessionRes.error.message },
      { status: 502 }
    );
  }
  if (!sessionRes.data) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const anyRefError =
    domainsRes.error ||
    competencyPhasesRes.error ||
    structuralPhasesRes.error ||
    resultLevelsRes.error ||
    riskLevelsRes.error ||
    recommendationsRes.error ||
    domainScoresRes.error ||
    competencyScoresRes.error;
  if (anyRefError) {
    return NextResponse.json(
      { error: "Failed to load result data.", details: anyRefError.message },
      { status: 502 }
    );
  }

  // --- Lookups -------------------------------------------------------------
  const domainsById = new Map(
    (domainsRes.data ?? []).map((d) => [d.id, d as { id: string; slug: string; name: string; display_order: number }])
  );
  const competencyById = new Map(
    (competencyPhasesRes.data ?? []).map((c) => [
      c.id,
      c as { id: string; slug: string; consumer_name: string | null; display_order: number },
    ])
  );
  const resultLevelById = new Map(
    (resultLevelsRes.data ?? []).map((r) => [r.id, r as LevelRow])
  );
  const riskLevelById = new Map((riskLevelsRes.data ?? []).map((r) => [r.id, r as LevelRow]));

  // --- Structural phase ----------------------------------------------------
  const structuralPhaseId = structuralSelRes.data?.structural_phase_id ?? null;
  const structuralPhases = (structuralPhasesRes.data ?? []) as {
    id: string;
    slug: string;
    name: string;
    defining_feature: string | null;
  }[];
  const structuralPhase =
    structuralPhases.find((p) => p.id === structuralPhaseId) ?? null;
  const structuralSlug = structuralPhase?.slug ?? "";
  const isExpiration = structuralSlug === "expiration";

  // Consumer name: matching competency phase by slug (expiration -> expiration_risk).
  const competencySlugForStructural = isExpiration ? "expiration_risk" : structuralSlug;
  const consumerName =
    (competencyPhasesRes.data ?? []).find((c) => c.slug === competencySlugForStructural)
      ?.consumer_name ?? null;

  // --- Domain results (ordered by DOMAINS presentation order) --------------
  const domainScoreByDomainId = new Map(
    (domainScoresRes.data ?? []).map((d) => [d.domain_id, d])
  );
  const domains: DomainResult[] = [];
  for (const meta of DOMAINS) {
    const domainRow = (domainsRes.data ?? []).find((d) => d.slug === meta.dbSlug);
    if (!domainRow) continue;
    const score = domainScoreByDomainId.get(domainRow.id);
    if (!score) continue;
    const lvl = score.result_level_id ? resultLevelById.get(score.result_level_id) : undefined;
    domains.push({
      slug: meta.routeSlug,
      name: meta.name,
      average_score: score.average_score,
      level: lvl?.level ?? null,
      title: lvl?.title ?? null,
      interpretation: lvl?.interpretation ?? null,
      recommendation: lvl?.recommendation ?? null,
      cta: lvl?.cta ?? null,
    });
  }

  // --- Competency phase results (Exploration, Exclusivity, Expansion) ------
  const competencyOrder = ["exploration", "exclusivity", "expansion"];
  const competency_phases: CompetencyResult[] = (competencyScoresRes.data ?? [])
    .map((c) => {
      const phase = competencyById.get(c.competency_phase_id);
      const lvl = c.result_level_id ? resultLevelById.get(c.result_level_id) : undefined;
      return phase
        ? {
            slug: phase.slug,
            consumer_name: phase.consumer_name ?? phase.slug,
            average_score: c.average_score,
            level: lvl?.level ?? null,
            title: lvl?.title ?? null,
          }
        : null;
    })
    .filter((x): x is CompetencyResult => x !== null)
    .sort(
      (a, b) => competencyOrder.indexOf(a.slug) - competencyOrder.indexOf(b.slug)
    );

  // --- Expiration risk -----------------------------------------------------
  let expiration_risk = null;
  if (expirationRes.data) {
    const rl = expirationRes.data.risk_level_id
      ? riskLevelById.get(expirationRes.data.risk_level_id)
      : undefined;
    expiration_risk = {
      average_score: expirationRes.data.average_score,
      risk_level: rl?.risk_level ?? null,
      title: rl?.title ?? null,
      interpretation: rl?.interpretation ?? null,
    };
  }

  // --- Alignment -----------------------------------------------------------
  const alignment = alignmentRes.data
    ? {
        status: alignmentRes.data.alignment_status as AlignmentStatus,
        interpretation_text: alignmentRes.data.interpretation_text ?? null,
      }
    : null;

  // --- Recommendations for the lowest-scoring domains ----------------------
  const sortedByScore = [...domains].sort((a, b) => a.average_score - b.average_score);
  const lowest = sortedByScore.slice(0, 2); // bottom two domains
  const recsByDomainName = new Map<string, { recommendation_text: string; next_step: string }>();
  for (const rec of recommendationsRes.data ?? []) {
    if (rec.trigger_type === "Domain Low") {
      recsByDomainName.set(rec.trigger_value, {
        recommendation_text: rec.recommendation_text,
        next_step: rec.next_step,
      });
    }
  }
  const recommendations: RecommendationView[] = lowest
    .map((d) => {
      const rec = recsByDomainName.get(d.name);
      return rec
        ? { domain: d.name, recommendation_text: rec.recommendation_text, next_step: rec.next_step }
        : null;
    })
    .filter((x): x is RecommendationView => x !== null);

  const body: ResultsResponse = {
    session_id: sessionId,
    name: sessionRes.data.name ?? "",
    structural_phase: {
      slug: structuralSlug,
      name: structuralPhase?.name ?? "",
      consumer_name: consumerName,
      defining_feature: structuralPhase?.defining_feature ?? null,
    },
    is_expiration: isExpiration,
    alignment,
    expiration_risk,
    domains,
    competency_phases,
    recommendations,
  };
  return NextResponse.json(body, { status: 200 });
}
