import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getJourneyEntry, updateJourneyEntry, setFavorite, addTag, removeTag, archiveEntry, deleteEntry } from "@/lib/companion/journey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  const detail = await getJourneyEntry(cu.user.id, id);
  if (!detail) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(detail);
}

// PATCH { title?, favorite?, addTag?, removeTag?, archive? }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  const uid = cu.user.id;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (typeof body.title === "string") { if (!(await updateJourneyEntry(uid, id, { title: body.title }))) return NextResponse.json({ error: "Not found." }, { status: 404 }); }
  if (typeof body.favorite === "boolean") await setFavorite(uid, id, body.favorite);
  if (typeof body.addTag === "string" && body.addTag.trim()) await addTag(uid, id, body.addTag);
  if (typeof body.removeTag === "string") await removeTag(uid, id, body.removeTag);
  if (body.archive === true) await archiveEntry(uid, id);
  return NextResponse.json({ ok: true });
}

// DELETE — explicit confirmation is enforced client-side; irreversible.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  const ok = await deleteEntry(cu.user.id, id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
