import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { approveModel, AssemblyError } from "@/lib/assemblyData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { action: "approve" } → owner approves a draft Measurement Model
// (supersedes the prior current; append-only history).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const { id } = await params;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (body.action !== "approve") return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  try {
    await approveModel(id, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "studio.measurement_model.approve", target: id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof AssemblyError ? e : new AssemblyError("Approve failed.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
