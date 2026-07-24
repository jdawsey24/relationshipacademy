import { NextResponse } from "next/server";
import { requireAdmin, requireOwner } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { adminGrant } from "@/lib/companion/entitlementLifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — list entitlements (owner console). POST — manual grant (owner, audited).
export async function GET(request: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();
  const userId = new URL(request.url).searchParams.get("user_id");
  let q = s.from("companion_entitlements")
    .select("id, user_id, source, status, stripe_ref, payment_intent_id, granted_at, granted_by, notes, updated_at")
    .order("granted_at", { ascending: false }).limit(200);
  if (userId) q = q.eq("user_id", userId);
  const { data } = await q;
  return NextResponse.json({ entitlements: data ?? [] });
}

export async function POST(request: Request) {
  const unauth = await requireOwner();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const userId = String(body.user_id ?? "").trim();
  const reason = String(body.reason ?? "").trim();
  if (!userId) return NextResponse.json({ error: "user_id required." }, { status: 400 });
  if (!reason) return NextResponse.json({ error: "An audit reason is required." }, { status: 400 });
  const res = await adminGrant(userId, user?.email ?? "unknown", reason);
  return NextResponse.json({ ok: res.ok, result: res.result });
}
