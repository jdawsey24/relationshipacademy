import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { updateTrigger, deleteTrigger, getTrigger, triggerReferencedByEvents, listTriggers } from "@/lib/companion/safetyCms";
import { validateTrigger, findConflicts, type ConflictRule } from "@/lib/companion/safetyValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const current = await getTrigger(id);
  if (!current) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const merged = { ...current, ...body } as Record<string, unknown>;

  // A rule can only go (or stay) ACTIVE if it is fully valid (guardrail 5).
  const activating = merged.is_active === true;
  const v = validateTrigger(merged, activating);
  if (!v.ok) return NextResponse.json({ error: v.errors.join(" ") }, { status: 400 });

  // Recompute overlap warnings when activating or changing the pattern/category.
  let warnings: string[] = [];
  if (activating || "pattern" in body || "risk_category" in body) {
    const existing = (await listTriggers()) as unknown as ConflictRule[];
    warnings = findConflicts({ id, risk_category: merged.risk_category as string, pattern: String(merged.pattern) }, existing);
  }

  try {
    await updateTrigger(id, body, user?.email ?? null);
    await audit({ actor: user?.email ?? null, action: "companion.safety.trigger.update", target: id, metadata: { fields: Object.keys(body) } });
    return NextResponse.json({ ok: true, warnings });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  // Never hard-delete a rule referenced by a historical safety event (guardrail 9).
  if (await triggerReferencedByEvents(id)) {
    return NextResponse.json({ error: "This rule is referenced by past safety events. Deactivate it instead of deleting." }, { status: 409 });
  }
  try {
    await deleteTrigger(id);
    await audit({ actor: user?.email ?? null, action: "companion.safety.trigger.delete", target: id });
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Failed." }, { status: 502 }); }
}
