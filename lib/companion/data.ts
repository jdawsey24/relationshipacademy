import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only reads for the Companion owner CMS. Resilient: every function returns
// an empty/default result if its table doesn't exist yet (migration pending), so
// the app never crashes pre-migration. Content tables are RLS-locked → service role.

export interface ExperienceListRow {
  id: string; title: string; consumer_title: string | null; slug: string;
  status: string; mode: string; published_version: number | null; updated_at: string;
}

export async function listExperiences(): Promise<ExperienceListRow[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("companion_experiences")
      .select("id, title, consumer_title, slug, status, mode, published_version, updated_at")
      .order("updated_at", { ascending: false });
    return (data ?? []) as ExperienceListRow[];
  } catch { return []; }
}

export async function getExperienceDetail(id: string) {
  try {
    const s = getSupabaseAdminClient();
    const [{ data: exp }, { data: blocks }, { data: versions }, { data: reviews }, { data: statusMaps }] = await Promise.all([
      s.from("companion_experiences").select("*").eq("id", id).maybeSingle(),
      s.from("companion_experience_blocks").select("*").eq("experience_id", id).order("block_order"),
      s.from("companion_experience_versions").select("id, version_no, created_at").eq("experience_id", id).order("version_no", { ascending: false }),
      s.from("companion_content_reviews").select("*").eq("experience_id", id).order("created_at", { ascending: false }),
      s.from("companion_experience_status_mappings").select("structural_status_id, mode").eq("experience_id", id),
    ]);
    if (!exp) return null;
    return {
      experience: exp as Record<string, unknown>,
      blocks: (blocks ?? []) as Record<string, unknown>[],
      versions: (versions ?? []) as Record<string, unknown>[],
      reviews: (reviews ?? []) as Record<string, unknown>[],
      statusMappings: (statusMaps ?? []) as Record<string, unknown>[],
    };
  } catch { return null; }
}

export async function listReusableTemplates() {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("companion_reusable_block_templates").select("*").order("label");
    return (data ?? []) as Record<string, unknown>[];
  } catch { return []; }
}

export async function listCategories() {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("companion_experience_categories").select("*").order("display_order");
    return (data ?? []) as Record<string, unknown>[];
  } catch { return []; }
}

export async function listStructuralStatuses() {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("structural_statuses").select("*").order("display_order");
    return (data ?? []) as Record<string, unknown>[];
  } catch { return []; }
}

export async function listSafetyRules() {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("companion_safety_rules").select("*").order("created_at");
    return (data ?? []) as Record<string, unknown>[];
  } catch { return []; }
}
