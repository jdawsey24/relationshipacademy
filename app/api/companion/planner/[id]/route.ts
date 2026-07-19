import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { getPlan, savePlan, deletePlan } from "@/lib/companion/planner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  const plan = await getPlan(cu.user.id, id);
  if (!plan) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ plan });
}

// PATCH { fields, status? } — autosave the planner.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const fields = (body.fields && typeof body.fields === "object") ? body.fields as Record<string, unknown> : {};
  const ok = await savePlan(cu.user.id, id, fields, typeof body.status === "string" ? body.status : undefined);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const { id } = await params;
  const ok = await deletePlan(cu.user.id, id);
  if (!ok) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
