import { getSupabaseAdminClient } from "@/lib/supabase";
import type { PromptTemplate } from "@/lib/ai/types";

// Resolve the active (approved, highest-version) prompt template for a
// generation type. Approved templates are immutable — edits create a new version
// via the templates API.
export async function getActiveTemplate(generationType: string): Promise<PromptTemplate | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s
      .from("prompt_templates")
      .select("*")
      .eq("generation_type", generationType)
      .eq("status", "approved")
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as PromptTemplate) ?? null;
  } catch {
    return null;
  }
}

// Fill {{key}} placeholders in a template string with values.
export function renderTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : `{{${k}}}`));
}
