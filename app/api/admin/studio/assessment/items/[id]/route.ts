import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { guardForBody, patchRow } from "@/lib/studioAssessmentApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WRITABLE = [
  "competency_id", "competency", "domain", "phase", "behavior_id", "behavioral_indicator",
  "item_family", "item_type", "candidate_number", "item_text", "consumer_item_text",
  "professional_item_text", "response_model", "reverse_scored", "evidence_strength",
  "face_validity_notes", "audience", "reading_level", "scoring_direction", "status",
] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const unauth = await guardForBody(body);
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  const res = await patchRow("studio_assessment_items", "item_id", id, body, WRITABLE, user?.email ?? null);
  if (res.ok) await audit({ actor: user?.email ?? null, action: "studio.item.update", target: id, metadata: { status: body.status } });
  return res;
}
