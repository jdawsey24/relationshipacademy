import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { listResultRecommendations } from "@/lib/studioAssetsData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  return NextResponse.json({ rows: await listResultRecommendations() });
}

// POST: create a recommendation rule (draft).
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const trigger_type = typeof body.trigger_type === "string" ? body.trigger_type.trim() : "";
  const trigger_value = typeof body.trigger_value === "string" ? body.trigger_value.trim() : "";
  if (!trigger_type || !trigger_value) return NextResponse.json({ error: "Trigger type and value are required." }, { status: 400 });
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("studio_result_recommendations").insert({
    trigger_type, trigger_value,
    recommendation_text: typeof body.recommendation_text === "string" ? body.recommendation_text : null,
    next_step: typeof body.next_step === "string" ? body.next_step : null,
    audience: typeof body.audience === "string" ? body.audience : "consumer",
    notes: typeof body.notes === "string" ? body.notes : null,
    status: "draft",
    created_by: user?.email ?? null,
    updated_by: user?.email ?? null,
  }).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to create." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.result_rec.create", target: (data as { id: string })?.id });
  return NextResponse.json({ id: (data as { id: string })?.id });
}
