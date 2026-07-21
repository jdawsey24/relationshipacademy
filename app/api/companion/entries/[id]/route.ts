import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { saveResponse, completeEntry } from "@/lib/companion/entries";
import { trackCompanionEvent } from "@/lib/companion/analytics";
import { screenText } from "@/lib/companion/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { block_ref, response } — save one block (autosave). Ownership verified.
// V1 safety layer: the learner's free-text is screened; on a high-risk trigger
// the response is still saved (it's their private entry) but the API returns a
// `safety` interrupt so the client halts the experience and shows support +
// resources instead of continuing.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const blockRef = String(body.block_ref ?? "");
  if (!blockRef) return NextResponse.json({ error: "Missing block." }, { status: 400 });
  const ok = await saveResponse(cu.user.id, id, blockRef, body.response ?? null);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const safety = await screenText(body.response, { userId: cu.user.id, context: "experience", situationRef: id });
  return NextResponse.json(safety ? { ok: true, safety } : { ok: true });
}

// POST { action:"complete" } — finish an entry.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  const ok = await completeEntry(cu.user.id, id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await trackCompanionEvent(cu.user.id, "experience_completed", {});
  return NextResponse.json({ ok: true });
}
