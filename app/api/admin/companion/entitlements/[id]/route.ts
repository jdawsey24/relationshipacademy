import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { adminRevoke, adminRestore } from "@/lib/companion/entitlementLifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PATCH { action: "revoke" | "restore", reason } — owner-only manual entitlement
// override, audited (actor + reason + from/to state recorded). Users can never
// reach this — it is owner-gated and revocation/restoration are server-side only.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const action = String(body.action ?? "");
  const reason = String(body.reason ?? "").trim();
  if (action !== "revoke" && action !== "restore") return NextResponse.json({ error: "action must be revoke or restore." }, { status: 400 });
  if (!reason) return NextResponse.json({ error: "An audit reason is required." }, { status: 400 });
  const actor = user?.email ?? "unknown";
  const res = action === "revoke" ? await adminRevoke(id, actor, reason) : await adminRestore(id, actor, reason);
  if (!res.ok && res.result === "no_match") return NextResponse.json({ error: "Entitlement not found." }, { status: 404 });
  if (!res.ok) return NextResponse.json({ error: "Update failed." }, { status: 502 });
  return NextResponse.json({ ok: true, result: res.result });
}
