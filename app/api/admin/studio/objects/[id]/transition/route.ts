import { NextResponse } from "next/server";
import { requireEditor, requireOwner, getAdminRole } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { transition, StudioError, type TransitionAction } from "@/lib/studioWorkflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER_ACTIONS: TransitionAction[] = ["approve", "request_changes", "publish", "unpublish", "retire"];
const ALL_ACTIONS: TransitionAction[] = ["submit_for_review", ...OWNER_ACTIONS];

// POST { action, notes } — the review/approval workflow. Editors may submit for
// review; only the OWNER may approve, request changes, publish, unpublish, or
// retire. The workflow re-reads the DB status and re-checks the role, so this
// route gating is defence-in-depth.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const action = body.action as TransitionAction;
  if (!ALL_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const unauth = OWNER_ACTIONS.includes(action) ? await requireOwner() : await requireEditor();
  if (unauth) return unauth;

  const user = await getAdminUser();
  const { id } = await params;
  try {
    const object = await transition(id, action, {
      actor: user?.email ?? null,
      role: getAdminRole(user),
      notes: typeof body.notes === "string" ? body.notes : null,
    });
    await audit({ actor: user?.email ?? null, action: `studio.${action}`, target: id, metadata: { status: object.status } });
    return NextResponse.json({ object });
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
