import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getAdminRole } from "@/lib/adminApi";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import type { AiSettings } from "@/lib/ai/types";

// Owner + AAL2 (strongest MFA) gate for EVERY AI Studio route. Mirrors the
// finance guard: an owner without an MFA-verified session is blocked.
export async function requireAiOwner(): Promise<{ user: User } | NextResponse> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (getAdminRole(user) !== "owner") return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  try {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== "aal2") {
      return NextResponse.json({ error: "Multi-factor authentication is required for the AI Studio." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Could not verify MFA." }, { status: 403 });
  }
  return { user };
}

// Preflight before any provider call: kill switch, enabled type, rate limit,
// daily cost ceiling. Returns a response to short-circuit, or null to proceed.
export async function preflightGeneration(request: Request, settings: AiSettings, generationType: string): Promise<NextResponse | null> {
  if (settings.kill_switch_active) {
    return NextResponse.json({ error: "AI generation is paused (kill switch is on). Re-enable it in AI Settings." }, { status: 503 });
  }
  if (!settings.enabled_generation_types.includes(generationType)) {
    return NextResponse.json({ error: `Generation type "${generationType}" is disabled in AI Settings.` }, { status: 400 });
  }
  const ok = await rateLimit(request, { bucket: "ai-generate", limit: 20, windowSeconds: 60 });
  if (!ok) return tooManyRequests();

  // Daily cost ceiling (sum today's request costs).
  try {
    const s = getSupabaseAdminClient();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data } = await s.from("ai_generation_requests").select("cost_usd").gte("created_at", since);
    const spent = (data ?? []).reduce((a, r) => a + (Number((r as { cost_usd: number | null }).cost_usd) || 0), 0);
    if (spent >= settings.daily_cost_limit_usd) {
      return NextResponse.json({ error: `Daily AI cost limit ($${settings.daily_cost_limit_usd}) reached.` }, { status: 429 });
    }
  } catch {
    // cost table absent → allow (resilient)
  }
  return null;
}
