import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only. Product-usage analytics ONLY — never private reflection content.
// Resilient (never throws, no-ops if the table is absent). Metadata is sanitized
// to ids/flags/short slugs so no journal text can leak in by accident.

const ALLOWED_META_KEYS = new Set(["experience_id", "slug", "status_key", "section_key", "entry_type", "source", "count", "neutral", "block_type"]);

function sanitize(meta: Record<string, unknown> = {}): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (!ALLOWED_META_KEYS.has(k)) continue;
    if (typeof v === "number" || typeof v === "boolean") out[k] = v;
    else if (typeof v === "string" && v.length <= 64) out[k] = v; // ids/slugs only
  }
  return out;
}

// Permitted events (usage, not content).
export type CompanionEvent =
  | "onboarding_completed" | "status_changed" | "experience_opened" | "experience_started"
  | "experience_completed" | "draft_resumed" | "planner_launched" | "blueprint_section_saved"
  | "resource_opened" | "entitlement_unlocked" | "install_prompt_shown" | "install_dismissed" | "install_completed";

export async function trackCompanionEvent(userId: string | null, event: CompanionEvent, metadata: Record<string, unknown> = {}): Promise<void> {
  try {
    const s = getSupabaseAdminClient();
    await s.from("companion_events").insert({ user_id: userId, event, metadata: sanitize(metadata) });
  } catch { /* analytics must never break a user action */ }
}
