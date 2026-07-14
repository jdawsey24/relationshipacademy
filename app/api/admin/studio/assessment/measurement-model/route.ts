import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { getMeasurementModel, generateMeasurementModel, getSpecification, AssemblyError } from "@/lib/assemblyData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?assessment_id= → the current/draft Measurement Model + the Specification.
export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const assessment_id = new URL(request.url).searchParams.get("assessment_id")?.trim() ?? "";
  if (!assessment_id) return NextResponse.json({ error: "assessment_id is required." }, { status: 400 });
  const [model, spec] = await Promise.all([getMeasurementModel(assessment_id), getSpecification(assessment_id)]);
  return NextResponse.json({ model, spec });
}

// POST { assessment_id } → derive a fresh DRAFT Measurement Model from the Spec.
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const assessment_id = typeof body.assessment_id === "string" ? body.assessment_id.trim() : "";
  if (!assessment_id) return NextResponse.json({ error: "assessment_id is required." }, { status: 400 });
  try {
    const row = await generateMeasurementModel(assessment_id, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "studio.measurement_model.derive", target: assessment_id, metadata: { version: row.version_no } });
    return NextResponse.json({ model: row });
  } catch (e) {
    const err = e instanceof AssemblyError ? e : new AssemblyError("Could not derive the Measurement Model.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
