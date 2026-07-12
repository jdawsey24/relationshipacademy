import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { guardForBody, patchRow } from "@/lib/studioAssessmentApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "name", "audience", "purpose", "delivery_mode", "estimated_items", "estimated_time",
  "primary_outputs", "scoring_level", "current_stage", "launch_priority",
  "requires_partner_data", "requires_clinician_data", "notes", "status",
] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const unauth = await guardForBody(body);
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const res = await patchRow("studio_assessments", "assessment_id", id, body, WRITABLE, user?.email ?? null);
  if (res.ok) await audit({ actor: user?.email ?? null, action: "studio.assessment.update", target: id, metadata: { status: body.status } });
  return res;
}
