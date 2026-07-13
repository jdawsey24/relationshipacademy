import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getAiSettings } from "@/lib/ai/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: usage + cost summary + draft pipeline counts for the AI Studio dashboard.
export async function GET() {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const s = getSupabaseAdminClient();
  const settings = await getAiSettings();

  const { data: reqs } = await s.from("ai_generation_requests").select("generation_type, status, cost_usd, input_tokens, output_tokens, created_at").order("created_at", { ascending: false }).limit(1000);
  const rows = reqs ?? [];
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const num = (v: unknown) => Number(v) || 0;
  const spentToday = rows.filter((r) => new Date((r as { created_at: string }).created_at).getTime() >= since).reduce((a, r) => a + num((r as { cost_usd: unknown }).cost_usd), 0);
  const byType: Record<string, number> = {};
  for (const r of rows) { const t = (r as { generation_type: string }).generation_type; byType[t] = (byType[t] ?? 0) + 1; }

  const { data: drafts } = await s.from("ai_item_drafts").select("status");
  const pipeline: Record<string, number> = {};
  for (const r of drafts ?? []) { const st = (r as { status: string }).status; pipeline[st] = (pipeline[st] ?? 0) + 1; }

  return NextResponse.json({
    totals: {
      requests: rows.length,
      cost_all: Number(rows.reduce((a, r) => a + num((r as { cost_usd: unknown }).cost_usd), 0).toFixed(2)),
      cost_today: Number(spentToday.toFixed(2)),
      tokens: rows.reduce((a, r) => a + num((r as { input_tokens: unknown }).input_tokens) + num((r as { output_tokens: unknown }).output_tokens), 0),
    },
    byType, pipeline,
    limits: { daily: settings.daily_cost_limit_usd, monthly: settings.monthly_cost_limit_usd, kill_switch: settings.kill_switch_active },
    recent: rows.slice(0, 15),
  });
}
