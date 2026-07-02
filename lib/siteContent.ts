import { getSupabaseAdminClient } from "@/lib/supabase";

// Editable-content system. Public pages render `get(map, key, default)` so they
// always work — DB overrides win, otherwise the built-in default shows.

export interface ContentField {
  key: string;
  label: string;
  type: "text" | "textarea" | "toggle";
  default: string;
}

// --- Announcement banner (global) ------------------------------------------
export const ANNOUNCEMENT_FIELDS: ContentField[] = [
  { key: "announcement.enabled", label: "Show banner", type: "toggle", default: "false" },
  { key: "announcement.text", label: "Banner text", type: "text", default: "" },
  { key: "announcement.link", label: "Link URL (optional)", type: "text", default: "" },
];

// --- Per-page editable copy (extend page by page) --------------------------
export const HOME_FIELDS: ContentField[] = [
  { key: "home.hero.eyebrow", label: "Hero eyebrow", type: "text", default: "The Relationship Life Cycle™" },
  { key: "home.hero.headline", label: "Hero headline", type: "text", default: "Every relationship has a season." },
  { key: "home.hero.subhead", label: "Hero subhead", type: "textarea", default: "Every relationship has different needs at different points in its journey. The first step is understanding where you are." },
];

export const PAGE_MANIFESTS: Record<string, { label: string; fields: ContentField[] }> = {
  home: { label: "Home", fields: HOME_FIELDS },
};

/** Read all content overrides into a Map. Resilient: returns an empty Map if
 * the table doesn't exist yet or the read fails, so callers use defaults. */
export async function getSiteContentMap(): Promise<Map<string, string>> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return new Map();
    return new Map(data.map((r) => [r.key, r.value ?? ""]));
  } catch {
    return new Map();
  }
}

/** Override value if present and non-empty, else the provided default. */
export function get(map: Map<string, string>, key: string, fallback: string): string {
  const v = map.get(key);
  return v !== undefined && v !== "" ? v : fallback;
}
