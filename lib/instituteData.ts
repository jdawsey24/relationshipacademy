import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  DEFAULT_OFFERINGS,
  type InstituteOffering,
  type InstituteSectionKey,
} from "@/lib/institute";

// Server-only reader for Institute offerings. Resilient: if migration 0013 hasn't
// run OR a section has no published rows, falls back to the built-in defaults so
// the public pages are never empty.
export async function getSectionOfferings(
  section: InstituteSectionKey
): Promise<InstituteOffering[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("institute_offerings")
      .select("*")
      .eq("section", section)
      .neq("status", "draft")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return DEFAULT_OFFERINGS[section];
    return data as InstituteOffering[];
  } catch {
    return DEFAULT_OFFERINGS[section];
  }
}
