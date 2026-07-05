import { getSupabaseAdminClient } from "@/lib/supabase";
import { ARTICLE_CATEGORIES } from "@/lib/articleConstants";

// Server-only Knowledge Center category helpers. Resilient: fall back to the
// built-in ARTICLE_CATEGORIES list if the table is absent or empty.

export interface ArticleCategory {
  id: string;
  name: string;
  sort_order: number;
  created_at?: string;
}

export async function getArticleCategoryRows(): Promise<ArticleCategory[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("article_categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error || !data) return [];
    return data as ArticleCategory[];
  } catch {
    return [];
  }
}

/** Ordered category names for dropdowns / the /learn topic list. Falls back to
 * the built-in list when nothing is configured yet. */
export async function getArticleCategoryNames(): Promise<string[]> {
  const rows = await getArticleCategoryRows();
  return rows.length ? rows.map((r) => r.name) : [...ARTICLE_CATEGORIES];
}
