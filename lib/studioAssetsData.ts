import { getSupabaseAdminClient } from "@/lib/supabase";
import type { Asset, ResultRecommendation } from "@/lib/studioAssets";

// Server-only reads for the Asset Library + Recommendation Mapper. Service role
// (RLS-locked) + RESILIENT: empty if migration 0020 hasn't run.

export interface AssetFilters {
  asset_type?: string;
  audience?: string;
  status?: string;
  search?: string;
}

export async function listAssets(f: AssetFilters = {}): Promise<Asset[]> {
  try {
    const s = getSupabaseAdminClient();
    let q = s.from("studio_assets").select("*").order("updated_at", { ascending: false });
    if (f.asset_type) q = q.eq("asset_type", f.asset_type);
    if (f.audience) q = q.eq("audience", f.audience);
    if (f.status) q = q.eq("status", f.status);
    if (f.search) q = q.ilike("title", `%${f.search}%`);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as Asset[];
  } catch {
    return [];
  }
}

export async function listResultRecommendations(): Promise<ResultRecommendation[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("studio_result_recommendations")
      .select("*")
      .order("trigger_type")
      .order("sort_order");
    if (error || !data) return [];
    return data as ResultRecommendation[];
  } catch {
    return [];
  }
}
