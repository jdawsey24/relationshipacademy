import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { updateBlock, deleteBlock, duplicateBlock, CompanionCmsError } from "@/lib/companion/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { payload?, conditional_on? } — edit a block. POST { action:"duplicate" }.
// DELETE — remove. All enforce Draft-only editability in cms.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  try {
    await updateBlock(id, { payload: body.payload, conditional_on: body.conditional_on }, user?.email ?? null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  try {
    await duplicateBlock(id, user?.email ?? null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  try {
    await deleteBlock(id, user?.email ?? null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
