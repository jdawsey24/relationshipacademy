import { getSupabaseAdminClient } from "@/lib/supabase";
import type { KbCompetency, StudioObject, StudioReview, StudioVersion } from "@/lib/studio";

// Server-only Studio reads. All go through the service role (Studio tables are
// RLS-locked, not world-readable) and are RESILIENT: if migration 0017 hasn't
// been run yet, every function returns an empty result instead of throwing, so
// the /admin/studio pages render an empty state rather than a 500 (same pattern
// as lib/academyData.ts).

export interface ObjectFilters {
  object_type?: string;
  audience?: string;
  status?: string;
  includeOwnerOnly?: boolean; // false => hide clinical/admin audiences (non-owners)
}

const OWNER_ONLY = ["clinical", "admin"];

export async function listObjects(filters: ObjectFilters = {}): Promise<StudioObject[]> {
  try {
    const s = getSupabaseAdminClient();
    let q = s.from("studio_objects").select("*").order("updated_at", { ascending: false });
    if (filters.object_type) q = q.eq("object_type", filters.object_type);
    if (filters.audience) q = q.eq("audience", filters.audience);
    if (filters.status) q = q.eq("status", filters.status);
    if (!filters.includeOwnerOnly) q = q.not("audience", "in", `(${OWNER_ONLY.join(",")})`);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as StudioObject[];
  } catch {
    return [];
  }
}

export interface ObjectDetail {
  object: StudioObject;
  versions: StudioVersion[];
  reviews: StudioReview[];
  currentBody: Record<string, unknown>;
}

export async function getObject(id: string): Promise<ObjectDetail | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data: object } = await s.from("studio_objects").select("*").eq("id", id).maybeSingle();
    if (!object) return null;
    const [{ data: versions }, { data: reviews }] = await Promise.all([
      s.from("studio_versions").select("*").eq("object_id", id).order("version_no", { ascending: false }),
      s.from("studio_reviews").select("*").eq("object_id", id).order("created_at", { ascending: false }),
    ]);
    const vs = (versions as StudioVersion[]) ?? [];
    const current = vs.find((v) => v.version_no === (object as StudioObject).current_version);
    return {
      object: object as StudioObject,
      versions: vs,
      reviews: (reviews as StudioReview[]) ?? [],
      currentBody: current?.body ?? {},
    };
  } catch {
    return null;
  }
}

export interface KbFilters {
  kind?: string;
  status?: string;
  audience?: string;
  activeOnly?: boolean;
}

export async function listKb(filters: KbFilters = {}): Promise<KbCompetency[]> {
  try {
    const s = getSupabaseAdminClient();
    let q = s.from("kb_competencies").select("*").order("sort_order", { ascending: true });
    if (filters.kind) q = q.eq("kind", filters.kind);
    if (filters.status) q = q.eq("status", filters.status);
    if (filters.activeOnly) q = q.eq("status", "active");
    if (filters.audience) q = q.contains("audiences", [filters.audience]);
    const { data, error } = await q;
    if (error || !data) return [];
    return data as KbCompetency[];
  } catch {
    return [];
  }
}

export async function getKb(id: string): Promise<KbCompetency | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("kb_competencies").select("*").eq("id", id).maybeSingle();
    return (data as KbCompetency) ?? null;
  } catch {
    return null;
  }
}

/** Fetch only APPROVED (status='active') KB records by id — the AI source gate. */
export async function getActiveKbByIds(ids: string[]): Promise<KbCompetency[]> {
  if (ids.length === 0) return [];
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("kb_competencies")
      .select("*")
      .in("id", ids)
      .eq("status", "active");
    if (error || !data) return [];
    return data as KbCompetency[];
  } catch {
    return [];
  }
}
