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

// Reads the single ai_settings row. Resilient: falls back to defaults if the
// table/row is absent (migration not yet run).
export async function getAiSettings(): Promise<AiSettings> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("ai_settings").select("*").limit(1).maybeSingle();
    return data ? { ...DEFAULTS, ...(data as AiSettings) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
