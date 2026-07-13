import { NextResponse } from "next/server";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { runAssembly, listAssemblies, getMembership, AssemblyError } from "@/lib/assemblyData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ?assessment_id= → recent assembly runs + the current membership set.
export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const assessment_id = new URL(request.url).searchParams.get("assessment_id")?.trim() ?? "";
  if (!assessment_id) return NextResponse.json({ error: "assessment_id is required." }, { status: 400 });
  const [runs, membership] = await Promise.all([listAssemblies(assessment_id), getMembership(assessment_id)]);
  return NextResponse.json({ runs, membership });
}

// POST { assessment_id } → run the deterministic assembly (needs an approved Model).
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const assessment_id = typeof body.assessment_id === "string" ? body.assessment_id.trim() : "";
  if (!assessment_id) return NextResponse.json({ error: "assessment_id is required." }, { status: 400 });
  try {
    const { run, result } = await runAssembly(assessment_id, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "studio.assembly.run", target: assessment_id, metadata: { fingerprint: run.inputs_fingerprint, selected: result.stats.items_selected, fulfilled: run.outcome_fulfilled } });
    return NextResponse.json({ run, result });
  } catch (e) {
    const err = e instanceof AssemblyError ? e : new AssemblyError("Assembly failed.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
