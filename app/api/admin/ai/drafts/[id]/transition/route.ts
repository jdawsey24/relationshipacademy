import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { audit } from "@/lib/audit";
import { transitionItemDraft, type ItemTransition } from "@/lib/ai/approve";
import { AiError } from "@/lib/ai/generateItem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIONS: ItemTransition[] = ["submit_for_review", "approve", "reject", "request_changes", "retire"];

// POST { action, notes } — approve (→ permanent Item ID + Item Bank), reject,
// request changes, retire, submit. Owner+MFA only (requireAiOwner).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const action = body.action as ItemTransition;
  if (!ACTIONS.includes(action)) return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  try {
    const res = await transitionItemDraft(id, action, { actor: auth.user.email ?? null, notes: typeof body.notes === "string" ? body.notes : null });
    await audit({ actor: auth.user.email ?? null, action: `ai.item.${action}`, target: id, metadata: { permanent_item_id: res.permanent_item_id ?? null } });
    return NextResponse.json(res);
  } catch (e) {
    const err = e instanceof AiError ? e : new AiError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
