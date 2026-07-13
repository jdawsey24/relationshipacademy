import { NextResponse } from "next/server";
import { requireEditor, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { approveMapping, retireMapping, deleteDraftMapping, MapError } from "@/lib/questionMapData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { action: "approve" | "retire" } → owner-only transitions. Approving
// supersedes the prior current mapping (append-only; history preserved).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const { id } = await params;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const action = body.action;
  try {
    if (action === "approve") await approveMapping(id, user?.email ?? null);
    else if (action === "retire") await retireMapping(id, user?.email ?? null);
    else return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    await audit({ actor: user?.email ?? null, action: `studio.question_map.${action}`, target: id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof MapError ? e : new MapError("Transition failed.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}

// DELETE → draft mappings only (approved history is immutable). Editors may prune
// their own drafts.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const { id } = await params;
  const user = await getAdminUser();
  try {
    await deleteDraftMapping(id);
    await audit({ actor: user?.email ?? null, action: "studio.question_map.delete_draft", target: id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof MapError ? e : new MapError("Delete failed.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
