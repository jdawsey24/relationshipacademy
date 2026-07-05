import { getSupabaseAdminClient } from "@/lib/supabase";
import type { Resource } from "@/lib/resourceConstants";

// Server-only resource fetch helpers. Constants/types live in resourceConstants
// (client-safe); re-exported here for server callers' convenience.
export * from "@/lib/resourceConstants";

/** Published resources, ordered by sort_order then newest. Resilient: returns
 * [] if the table doesn't exist yet or the read fails. */
export async function getPublishedResources(): Promise<Resource[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as Resource[];
  } catch {
    return [];
  }
}
