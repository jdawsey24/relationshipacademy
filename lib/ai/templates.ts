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
//
// An unknown key is left as {{key}} rather than blanked, so a missing variable
// is visible in the output instead of silently becoming an empty string.
export function renderTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : `{{${k}}}`));
}

/**
 * Render BOTH halves of a template.
 *
 * The system instruction was previously passed to the provider raw while only
 * the user template was rendered, so any placeholder an author put in the system
 * half reached the model literally — `ce_script_draft` was shipping
 * "aim for {{target_words}} words", losing its length target entirely. Nothing
 * threw; the output just quietly stopped meeting a constraint no one could see.
 *
 * Every caller should use this rather than rendering one half by hand.
 */
export function renderPrompt(
  tpl: { system_instruction: string; user_template: string },
  vars: Record<string, string>,
): { system: string; user: string } {
  return {
    system: renderTemplate(tpl.system_instruction, vars),
    user: renderTemplate(tpl.user_template, vars),
  };
}

/** Placeholders left unfilled after rendering. Empty means fully resolved. */
export function unresolvedPlaceholders(rendered: string): string[] {
  return [...new Set(rendered.match(/\{\{\w+\}\}/g) ?? [])];
}
