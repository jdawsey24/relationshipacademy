import { cache } from "react";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { LEARNING_TABLES } from "@/lib/studioLibrary";
import { WORKSPACE_CONTENT_TYPES, type FrameworkTree, type RelatedAssets, type WorkspaceCounts } from "@/lib/studioFramework";
import type { KbCompetency } from "@/lib/studio";

// Server-only reads powering the Framework browser + Competency Workspace. Service
// role (Studio tables are RLS-locked) and RESILIENT: if the studio migrations
// haven't run, every function returns an empty result instead of throwing, so the
// pages render clean empty states rather than a 500 (same pattern as studioData.ts).

// A head-count on `table` filtered to a single competency. Lessons/courses key by
// competency_ids (plural array); everything else has a competency_id column. Extra
// equality filters + a "column is not null" filter are declared as data (no
// callbacks) so the query-builder types stay inferred, matching listItems().
interface CountOpts {
  competencyCol?: string | null; // column to match `code` against; null => competency_ids contains
  eq?: [string, string | number | boolean][];
  notNull?: string; // require this column to be non-null
}
async function countForCompetency(
  s: ReturnType<typeof getSupabaseAdminClient>,
  table: string,
  code: string,
  opts: CountOpts = {}
): Promise<number> {
  try {
    let q = s.from(table).select("*", { count: "exact", head: true });
    if (opts.competencyCol === null) q = q.contains("competency_ids", [code]);
    else q = q.eq(opts.competencyCol ?? "competency_id", code);
    for (const [col, val] of opts.eq ?? []) q = q.eq(col, val);
    if (opts.notNull) q = q.not(opts.notNull, "is", null);
    const { count } = await q;
    return count ?? 0;
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------------------
// Framework hierarchy
// ---------------------------------------------------------------------------

export const getFrameworkTree = cache(async (): Promise<FrameworkTree> => {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("kb_competencies")
      .select("code, kind, name, domain_slug, phase_slug, competency_phase_slug, status, sort_order")
      .order("sort_order", { ascending: true });
    if (error || !data) return { phases: [], domains: [], competencies: [] };
    const rows = data as Array<Record<string, unknown>>;
    const phases = rows
      .filter((r) => r.kind === "phase")
      .map((r) => ({ slug: String(r.phase_slug ?? ""), name: String(r.name ?? "") }))
      .filter((p) => p.slug);
    const domains = rows
      .filter((r) => r.kind === "domain")
      .map((r) => ({ slug: String(r.domain_slug ?? ""), name: String(r.name ?? "") }))
      .filter((d) => d.slug);
    const competencies = rows
      .filter((r) => r.kind === "competency")
      .map((r) => ({
        code: String(r.code ?? ""),
        name: String(r.name ?? ""),
        domain_slug: (r.domain_slug as string) ?? null,
        // Competencies carry their phase in phase_slug; competency_phase_slug is
        // unused (null) in the imported KB. Fall back just in case.
        phase_slug: (r.phase_slug as string) ?? (r.competency_phase_slug as string) ?? null,
        status: String(r.status ?? "active"),
      }))
      .filter((c) => c.code);
    return { phases, domains, competencies };
  } catch {
    return { phases: [], domains: [], competencies: [] };
  }
});

/** One competency's full record (62-field detail included). Keyed by business
 *  code (e.g. COM-EXPL-001), which is what content tables reference. Cached so a
 *  layout + its page share a single read per request. */
export const getCompetencyByCode = cache(async (code: string): Promise<KbCompetency | null> => {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s
      .from("kb_competencies")
      .select("*")
      .eq("kind", "competency")
      .eq("code", code)
      .maybeSingle();
    return (data as KbCompetency) ?? null;
  } catch {
    return null;
  }
});

// ---------------------------------------------------------------------------
// Workspace aggregates
// ---------------------------------------------------------------------------

/** Completeness counts for the Health tab + Framework/workspace badges. */
export const getWorkspaceCounts = cache(async (code: string): Promise<WorkspaceCounts> => {
  const empty: WorkspaceCounts = {
    items: { total: 0, approved: 0, draft: 0, reverse: 0, phaseAnchored: 0 },
    indicators: { behavioral: 0, incomplete: 0 },
    content: {},
    recommendations: 0,
    published: 0,
    lastUpdated: null,
  };
  try {
    const s = getSupabaseAdminClient();
    const [
      total, approved, draft, reverse, phaseAnchored, behavioral, incomplete, recommendations,
    ] = await Promise.all([
      countForCompetency(s, "studio_assessment_items", code),
      countForCompetency(s, "studio_assessment_items", code, { eq: [["status", "approved"]] }),
      countForCompetency(s, "studio_assessment_items", code, { eq: [["status", "draft"]] }),
      countForCompetency(s, "studio_assessment_items", code, { eq: [["reverse_scored", true]] }),
      countForCompetency(s, "studio_assessment_items", code, { notNull: "phase" }),
      countForCompetency(s, "studio_behavioral_indicators", code),
      countForCompetency(s, "studio_incomplete_indicators", code),
      countForCompetency(s, "studio_recommendation_mappings", code),
    ]);

    const content: Record<string, number> = {};
    await Promise.all(
      WORKSPACE_CONTENT_TYPES.map(async (t) => {
        const cfg = LEARNING_TABLES[t];
        content[t] = await countForCompetency(s, cfg.table, code, { competencyCol: cfg.competencyCol });
      })
    );

    // Published = distinct assets of this competency that have an active mapping.
    let published = 0;
    try {
      const { data: assets } = await s
        .from("studio_worksheets")
        .select("worksheet_id")
        .eq("competency_id", code)
        .in("status", ["approved", "published"])
        .limit(500);
      const ids = (assets ?? []).map((r) => String((r as Record<string, unknown>).worksheet_id));
      if (ids.length) {
        const { count } = await s
          .from("publication_mappings")
          .select("*", { count: "exact", head: true })
          .eq("source_type", "worksheet")
          .eq("status", "active")
          .in("source_id", ids);
        published = count ?? 0;
      }
    } catch { /* leave 0 */ }

    // Last updated across items + content for this competency.
    let lastUpdated: string | null = null;
    try {
      const { data: latest } = await s
        .from("studio_assessment_items")
        .select("updated_at")
        .eq("competency_id", code)
        .order("updated_at", { ascending: false })
        .limit(1);
      lastUpdated = (latest?.[0] as { updated_at?: string })?.updated_at ?? null;
    } catch { /* leave null */ }

    return {
      items: { total, approved, draft, reverse, phaseAnchored },
      indicators: { behavioral, incomplete },
      content,
      recommendations,
      published,
      lastUpdated,
    };
  } catch {
    return empty;
  }
});

/** Read-only ecosystem traceability for the Related Assets tab. */
export async function getRelatedAssets(code: string): Promise<RelatedAssets> {
  const empty: RelatedAssets = { assessments: [], content: {}, recommendations: 0, destinations: [] };
  try {
    const s = getSupabaseAdminClient();

    // Which assessments (Snapshot / Profile / …) use this competency's items.
    const assessments: RelatedAssets["assessments"] = [];
    try {
      const { data: items } = await s
        .from("studio_assessment_items")
        .select("assessment_id")
        .eq("competency_id", code)
        .not("assessment_id", "is", null)
        .limit(2000);
      const byAssessment = new Map<string, number>();
      for (const r of (items ?? []) as Array<Record<string, unknown>>) {
        const id = String(r.assessment_id ?? "");
        if (id) byAssessment.set(id, (byAssessment.get(id) ?? 0) + 1);
      }
      if (byAssessment.size) {
        const { data: names } = await s
          .from("studio_assessments")
          .select("assessment_id, name")
          .in("assessment_id", [...byAssessment.keys()]);
        const nameById = new Map<string, string>();
        for (const r of (names ?? []) as Array<Record<string, unknown>>) nameById.set(String(r.assessment_id), String(r.name ?? ""));
        for (const [id, itemCount] of byAssessment) assessments.push({ assessment_id: id, name: nameById.get(id) ?? id, itemCount });
        assessments.sort((a, b) => b.itemCount - a.itemCount);
      }
    } catch { /* skip */ }

    const counts = await getWorkspaceCounts(code);

    // Published destinations across this competency's content assets.
    const destinations: RelatedAssets["destinations"] = [];
    try {
      const SOURCES: Array<{ type: string; table: string; pk: string }> = [
        { type: "worksheet", table: "studio_worksheets", pk: "worksheet_id" },
        { type: "practice", table: "studio_practices", pk: "practice_id" },
        { type: "activity", table: "studio_activities", pk: "activity_id" },
        { type: "conversation_guide", table: "studio_conversation_guides", pk: "guide_id" },
        { type: "journal_prompt", table: "studio_journal_prompts", pk: "prompt_id" },
        { type: "video", table: "studio_videos", pk: "video_id" },
      ];
      const byDest = new Map<string, number>();
      await Promise.all(
        SOURCES.map(async (src) => {
          const { data } = await s.from(src.table).select(src.pk).eq("competency_id", code).in("status", ["approved", "published"]).limit(500);
          const rows = (data ?? []) as unknown as Array<Record<string, unknown>>;
          const ids = rows.map((r) => String(r[src.pk]));
          if (!ids.length) return;
          const { data: maps } = await s.from("publication_mappings").select("destination").eq("source_type", src.type).eq("status", "active").in("source_id", ids);
          for (const m of (maps ?? []) as Array<Record<string, unknown>>) {
            const d = String(m.destination ?? "");
            if (d) byDest.set(d, (byDest.get(d) ?? 0) + 1);
          }
        })
      );
      for (const [destination, count] of byDest) destinations.push({ destination, count });
    } catch { /* skip */ }

    return { assessments, content: counts.content, recommendations: counts.recommendations, destinations };
  } catch {
    return empty;
  }
}

/** This competency's publishable content assets + their active destinations, for
 *  the workspace Publishing tab (read view; management stays owner+MFA in the hub). */
export interface CompetencyPublishRow {
  source_type: string;
  id: string;
  label: string;
  status: string;
  destinations: string[];
}

export async function getCompetencyPublishing(code: string): Promise<CompetencyPublishRow[]> {
  try {
    const s = getSupabaseAdminClient();
    const SOURCES: Array<{ type: string; table: string; pk: string; labelCol: string }> = [
      { type: "worksheet", table: "studio_worksheets", pk: "worksheet_id", labelCol: "title" },
      { type: "practice", table: "studio_practices", pk: "practice_id", labelCol: "name" },
      { type: "activity", table: "studio_activities", pk: "activity_id", labelCol: "name" },
      { type: "conversation_guide", table: "studio_conversation_guides", pk: "guide_id", labelCol: "title" },
      { type: "journal_prompt", table: "studio_journal_prompts", pk: "prompt_id", labelCol: "title" },
      { type: "video", table: "studio_videos", pk: "video_id", labelCol: "title" },
    ];
    const out: CompetencyPublishRow[] = [];
    await Promise.all(
      SOURCES.map(async (src) => {
        const { data: rows } = await s
          .from(src.table)
          .select(`${src.pk}, ${src.labelCol}, status`)
          .eq("competency_id", code)
          .in("status", ["approved", "published"])
          .limit(200);
        const list = (rows ?? []) as unknown as Array<Record<string, unknown>>;
        if (!list.length) return;
        const ids = list.map((r) => String(r[src.pk]));
        const { data: maps } = await s
          .from("publication_mappings")
          .select("source_id, destination")
          .eq("source_type", src.type)
          .eq("status", "active")
          .in("source_id", ids);
        const byId = new Map<string, string[]>();
        for (const m of (maps ?? []) as Array<Record<string, unknown>>) {
          const id = String(m.source_id);
          byId.set(id, [...(byId.get(id) ?? []), String(m.destination)]);
        }
        for (const r of list) {
          const id = String(r[src.pk]);
          out.push({ source_type: src.type, id, label: String(r[src.labelCol] ?? ""), status: String(r.status ?? ""), destinations: byId.get(id) ?? [] });
        }
      })
    );
    return out;
  } catch {
    return [];
  }
}
