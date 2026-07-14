import { NextResponse } from "next/server";
import { isUuid } from "@/lib/apiSecurity";
import { rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { getAiSettings } from "@/lib/ai/settings";
import { getOrCreateLiveNarrative } from "@/lib/resultNarrativeLive";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?session_id= → the personalized AI narrative for a completed session, or
// { narrative: null } when disabled / not ready / anything fails. This endpoint is
// ADDITIVE and RESILIENT: it never 500s and never blocks the deterministic results
// page. Feature-flagged OFF by default (enable "result_narrative" in AI Settings).
// The deterministic scoring path (/api/results, /api/score, lib/scoring) is untouched.
export async function GET(request: Request) {
  try {
    const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
    if (!isUuid(sessionId)) return NextResponse.json({ narrative: null });

    if (!(await rateLimit(request, { bucket: "result-narrative", limit: 10, windowSeconds: 60 }))) {
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

    const res = await getOrCreateLiveNarrative(sessionId);
    return NextResponse.json({ narrative: res?.sections ?? null });
  } catch {
    return NextResponse.json({ narrative: null });
  }
}
