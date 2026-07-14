import { NextResponse } from "next/server";
import { isUuid } from "@/lib/apiSecurity";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { getAiSettings } from "@/lib/ai/settings";
import { getOrCreateStudioNarrative } from "@/lib/resultNarrativeStudio";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?attempt= → the personalized AI narrative for a studio attempt, or
// { narrative: null } when disabled / not ready / anything fails. ADDITIVE and
// RESILIENT: never 500s, never blocks the deterministic results page. Gated by
// "result_narrative" in AI Settings. The scoring path is untouched.
export async function GET(request: Request) {
  try {
    const attempt = new URL(request.url).searchParams.get("attempt") ?? "";
    if (!isUuid(attempt)) return NextResponse.json({ narrative: null });

    if (!(await rateLimit(request, { bucket: "assess-narrative", limit: 10, windowSeconds: 60 }))) {
      return tooManyRequests();
    }

    const settings = await getAiSettings();
    if (settings.kill_switch_active || !settings.enabled_generation_types.includes("result_narrative")) {
      return NextResponse.json({ narrative: null, enabled: false });
    }

    // Soft daily cost ceiling (shared AI budget); the generate-once cache is the
    // real cost bound.
    try {
      const s = getSupabaseAdminClient();
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data } = await s.from("ai_generation_requests").select("cost_usd").gte("created_at", since);
      const spent = (data ?? []).reduce((a, r) => a + (Number((r as { cost_usd: unknown }).cost_usd) || 0), 0);
      if (spent >= settings.daily_cost_limit_usd) return NextResponse.json({ narrative: null });
    } catch { /* resilient: allow */ }

    const res = await getOrCreateStudioNarrative(attempt);
    return NextResponse.json({ narrative: res?.sections ?? null });
  } catch {
    return NextResponse.json({ narrative: null });
  }
}
