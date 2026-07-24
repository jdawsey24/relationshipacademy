import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { saveResponse, completeEntry } from "@/lib/companion/entries";
import { trackCompanionEvent } from "@/lib/companion/analytics";
import { screenText } from "@/lib/companion/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { block_ref, response } — save one block (autosave). Ownership verified.
// Safety Layer V2: the learner's free-text is CLASSIFIED BEFORE it flows into
// normal processing (item 3). The response is still persisted (it's their private
// entry — authorized primary content), but on an actionable classification the
// API returns a `safety` interrupt so the client halts the experience and shows
// support + resources instead of continuing.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const blockRef = String(body.block_ref ?? "");
  if (!blockRef) return NextResponse.json({ error: "Missing block." }, { status: 400 });
  // 1) Safety classification precedes persistence/processing.
  const safety = await screenText(body.response, { userId: cu.user.id, context: "experience", situationRef: id });
  // 2) Authorized persistence of the learner's own entry.
  const ok = await saveResponse(cu.user.id, id, blockRef, body.response ?? null);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
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
