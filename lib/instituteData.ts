import { getSupabaseAdminClient } from "@/lib/supabase";
import { getSiteContentMap, get } from "@/lib/siteContent";
import {
  DEFAULT_OFFERINGS,
  SECTION_COPY,
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

// Full props for a section page: editable copy (site_content overrides →
// defaults) plus its offerings. Feeds directly into <InstituteSection {...} />.
export async function getSectionContent(section: InstituteSectionKey) {
  const [offerings, map] = await Promise.all([getSectionOfferings(section), getSiteContentMap()]);
  const c = SECTION_COPY[section];
  return {
    eyebrow: get(map, `institute.${section}.eyebrow`, c.eyebrow),
    title: get(map, `institute.${section}.title`, c.title),
    intro: get(map, `institute.${section}.intro`, c.intro),
    note: get(map, `institute.${section}.note`, c.note),
    offerings,
  };
}
