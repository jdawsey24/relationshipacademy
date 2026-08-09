import { getSupabaseAdminClient } from "@/lib/supabase";
import type { AiSettings } from "@/lib/ai/types";

const DEFAULTS: AiSettings = {
  id: "00000000-0000-0000-0000-0000000000a1",
  provider: "anthropic",
  model: "claude-opus-4-8",
  enabled_generation_types: ["assessment_item", "item_review"],
  output_limit: 8000,
  timeout_seconds: 120,
  retry_limit: 1,
  daily_cost_limit_usd: 25,
  monthly_cost_limit_usd: 300,
  kill_switch_active: false,
  updated_by: null,
  updated_at: "",
};

/**
 * Reads the global ai_settings row, then lays a surface's overrides on top.
 *
 * One row was governing assessment generation, result narratives, the Framework
 * Studio, the Content Engine and the Content Studio, which want different
 * answers about spend, model and pausing. A surface may override any field;
 * null means inherit, so a surface with no row behaves exactly as before.
 *
 * The kill switch does not work that way. A surface can stop itself, and it
 * cannot start itself — global off means off. An emergency stop a product could
 * opt out of would not be one.
 *
 * Resilient throughout: a missing table or row falls back rather than throwing,
 * because a settings lookup should not be able to take generation down.
 */
export async function getAiSettings(surface?: string): Promise<AiSettings> {
  let base = DEFAULTS;
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("ai_settings").select("*").limit(1).maybeSingle();
    if (data) base = { ...DEFAULTS, ...(data as AiSettings) };
  } catch {
    return DEFAULTS;
  }
  if (!surface) return base;

  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("ai_surface_settings")
      .select("*").eq("surface", surface).maybeSingle();
    const o = data as Record<string, unknown> | null;
    if (!o) return base;

    const over: Partial<AiSettings> = {};
    for (const key of ["model", "output_limit", "timeout_seconds", "daily_cost_limit_usd",
                       "monthly_cost_limit_usd", "enabled_generation_types",
                       "conversation_soft_limit_usd", "conversation_hard_limit_usd"] as const) {
      const v = o[key];
      if (v !== null && v !== undefined) (over as Record<string, unknown>)[key] = v;
    }
    return {
      ...base,
      ...over,
      // Either switch stops it. Only the global one can allow it.
      kill_switch_active: base.kill_switch_active || o.kill_switch_active === true,
      surface_prefixes: (o.generation_type_prefixes as string[]) ?? [],
    } as AiSettings;
  } catch {
    return base;
  }
}
