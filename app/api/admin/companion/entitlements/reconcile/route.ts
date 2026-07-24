import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { reconcileCompanionEntitlements } from "@/lib/companion/entitlementReconcile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET  — READ-ONLY reconciliation report (paid-but-ungranted discrepancies).
// POST — repair: grant the missing entitlements. Owner-only, audited. Stripe stays
// authoritative for payment; this only repairs delivery, never manufactures a sale.

function windowHours(url: string): number {
  const h = Number(new URL(url).searchParams.get("hours"));
  return Number.isFinite(h) && h > 0 && h <= 720 ? h : 72;
}

export async function GET(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const report = await reconcileCompanionEntitlements({ windowHours: windowHours(request.url), repair: false });
  return NextResponse.json({ report });
}

export async function POST(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  const report = await reconcileCompanionEntitlements({ windowHours: windowHours(request.url), repair: true });
  await audit({ actor: user?.email ?? null, action: "companion.entitlement.reconcile", metadata: { repaired: report.repaired, still_failing: report.still_failing, discrepancies: report.discrepancies } });
  return NextResponse.json({ report });
}
