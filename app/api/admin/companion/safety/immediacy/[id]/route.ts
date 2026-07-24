import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { updateImmediacy, deleteImmediacy, getImmediacy } from "@/lib/companion/safetyCms";
import { validateImmediacyTerm } from "@/lib/companion/safetyValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const current = await getImmediacy(id);
  if (!current) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const merged = { ...current, ...body } as Record<string, unknown>;
  const v = validateImmediacyTerm(merged, merged.is_active === true);
  if (!v.ok) return NextResponse.json({ error: v.errors.join(" ") }, { status: 400 });

  try {
    await updateImmediacy(id, body, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "companion.safety.immediacy.update", target: id, metadata: { fields: Object.keys(body) } });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  try {
    await deleteImmediacy(id);
    await audit({ actor: user?.email ?? null, action: "companion.safety.immediacy.delete", target: id });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
