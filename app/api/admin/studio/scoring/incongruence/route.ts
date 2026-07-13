import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();
  const { data } = await s.from("studio_incongruence_rules").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ rows: data ?? [] });
}

export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("studio_incongruence_rules").insert({
    rule_name: typeof body.rule_name === "string" ? body.rule_name : null,
    structural_context: typeof body.structural_context === "string" ? body.structural_context : null,
    compared_phase: typeof body.compared_phase === "string" ? body.compared_phase : null,
    condition_config: typeof body.condition_config === "object" && body.condition_config ? body.condition_config : {},
    severity: typeof body.severity === "string" ? body.severity : null,
    consumer_language: typeof body.consumer_language === "string" ? body.consumer_language : null,
    professional_language: typeof body.professional_language === "string" ? body.professional_language : null,
    version: "v1", status: "draft", validation_status: "provisional", created_by: user?.email ?? null,
  }).select("id").maybeSingle();
  if (error) return NextResponse.json({ error: "Failed to create." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "studio.incongruence.create", target: (data as { id: string })?.id });
  return NextResponse.json({ id: (data as { id: string })?.id });
}
