import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { addBlock, reorderBlocks, CompanionCmsError } from "@/lib/companion/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { blockType } — append a block. PATCH { orderedIds } — reorder.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  try {
    await addBlock(id, String(body.blockType ?? ""), user?.email ?? null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const orderedIds = Array.isArray(body.orderedIds) ? body.orderedIds.map(String) : [];
  try {
    await reorderBlocks(id, orderedIds, user?.email ?? null);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e instanceof CompanionCmsError ? e : new CompanionCmsError("Failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
