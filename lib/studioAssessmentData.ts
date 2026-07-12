import { getSupabaseAdminClient } from "@/lib/supabase";
import type {
  Assessment,
  AssessmentItem,
  InterpretationRule,
  RecommendationMapping,
  ResponseModel,
  ResultsTemplate,
  ScoringRule,
} from "@/lib/studioAssessment";

// Server-only Assessment Studio reads. Service role (RLS-locked tables) and
// RESILIENT: if migration 0018 hasn't run yet, everything returns empty instead
// of throwing (same pattern as lib/studioData.ts) so the pages render empty
// states rather than 500.

export async function listAssessments(): Promise<Assessment[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s.from("studio_assessments").select("*").order("assessment_id");
    if (error || !data) return [];
    return data as Assessment[];
  } catch {
    return [];
  }
}

export interface ItemFilters {
  assessment_id?: string;
  competency_id?: string;
  domain?: string;
  phase?: string;
  item_type?: string;
  reverse_scored?: boolean;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ItemPage {
  rows: AssessmentItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function listItems(f: ItemFilters = {}): Promise<ItemPage> {
  const page = Math.max(1, f.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, f.pageSize ?? 50));
  try {
    const s = getSupabaseAdminClient();
    let q = s.from("studio_assessment_items").select("*", { count: "exact" });
    if (f.assessment_id) q = q.eq("assessment_id", f.assessment_id);
    if (f.competency_id) q = q.eq("competency_id", f.competency_id);
    if (f.domain) q = q.eq("domain", f.domain);
    if (f.phase) q = q.eq("phase", f.phase);
    if (f.item_type) q = q.eq("item_type", f.item_type);
    if (typeof f.reverse_scored === "boolean") q = q.eq("reverse_scored", f.reverse_scored);
    if (f.status) q = q.eq("status", f.status);
    if (f.search) q = q.ilike("item_text", `%${f.search}%`);
    const from = (page - 1) * pageSize;
    q = q.order("item_id").range(from, from + pageSize - 1);
    const { data, count, error } = await q;
    if (error) return { rows: [], total: 0, page, pageSize };
    return { rows: (data as AssessmentItem[]) ?? [], total: count ?? 0, page, pageSize };
  } catch {
    return { rows: [], total: 0, page, pageSize };
  }
}

async function listTable<T>(table: string, orderCol: string): Promise<T[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s.from(table).select("*").order(orderCol);
    if (error || !data) return [];
    return data as T[];
  } catch {
    return [];
  }
}

export const listResponseModels = () => listTable<ResponseModel>("studio_response_models", "response_model_id");
export const listScoringRules = () => listTable<ScoringRule>("studio_scoring_rules", "scoring_rule_id");
export const listInterpretationRules = () => listTable<InterpretationRule>("studio_interpretation_rules", "interpretation_rule_id");
export const listResultsTemplates = () => listTable<ResultsTemplate>("studio_results_templates", "section_order");
export const listRecommendationMappings = () => listTable<RecommendationMapping>("studio_recommendation_mappings", "mapping_id");

/** Distinct competency options for filter dropdowns (id + name). */
export async function competencyOptions(): Promise<{ id: string; name: string }[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("kb_competencies")
      .select("code, name")
      .eq("kind", "competency")
      .order("code");
    if (error || !data) return [];
    return (data as { code: string; name: string }[]).map((r) => ({ id: r.code, name: r.name }));
  } catch {
    return [];
  }
}
