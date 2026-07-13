import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { getAiSettings } from "@/lib/ai/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = ["provider", "model", "enabled_generation_types", "output_limit", "timeout_seconds", "retry_limit", "daily_cost_limit_usd", "monthly_cost_limit_usd", "kill_switch_active"] as const;

export async function GET() {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({ settings: await getAiSettings() });
}

export async function PATCH(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const update: Record<string, unknown> = { updated_at: new Date().toISOString(), updated_by: auth.user.email ?? null };
  for (const k of WRITABLE) if (k in body) update[k] = body[k];
  const s = getSupabaseAdminClient();
  const current = await getAiSettings();
  const { error } = await s.from("ai_settings").update(update).eq("id", current.id);
  if (error) return NextResponse.json({ error: "Failed to save settings." }, { status: 502 });
  await audit({ actor: auth.user.email ?? null, action: "ai.settings.update", target: "ai_settings", metadata: { kill_switch: body.kill_switch_active } });
  return NextResponse.json({ ok: true });
}
