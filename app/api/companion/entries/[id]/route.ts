import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { saveResponse, completeEntry } from "@/lib/companion/entries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { block_ref, response } — save one block (autosave). Ownership verified.
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
  return NextResponse.json({ ok: true });
}

// POST { action:"complete" } — finish an entry.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  const ok = await completeEntry(cu.user.id, id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
