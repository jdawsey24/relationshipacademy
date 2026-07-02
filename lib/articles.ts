import { getSupabaseAdminClient } from "@/lib/supabase";
import type { Article } from "@/lib/articleConstants";

// Server-only article fetch helpers. Constants/types live in articleConstants
// (client-safe); re-exported here for server callers' convenience.
export * from "@/lib/articleConstants";

const LIST_COLS =
  "id, title, slug, category, summary, featured_image_url, author, publish_date, status, related_phase_slug";

/** Published articles, newest first. Resilient: returns [] if table absent. */
export async function getPublishedArticles(): Promise<Article[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select(LIST_COLS)
      .eq("status", "published")
      .order("publish_date", { ascending: false, nullsFirst: false });
    if (error || !data) return [];
    return data as Article[];
  } catch {
    return [];
  }
}

/** One published article by slug, or null. */
export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data) return null;
    return data as Article;
  } catch {
    return null;
  }
}
