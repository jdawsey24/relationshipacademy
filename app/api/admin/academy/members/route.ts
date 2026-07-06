import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin, requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { isUuid } from "@/lib/apiSecurity";
import { TIER_RANK, type MembershipTier } from "@/lib/academy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Academy members — profiles joined with their auth email.
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const s = getSupabaseAdminClient();

  const { data: profiles, error } = await s
    .from("profiles")
    .select("id, full_name, membership_tier, skool_joined, created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Failed to load members." }, { status: 502 });

  // Map emails from auth.users (first page is plenty for Phase 1).
  const emails = new Map<string, string>();
  try {
    const { data: list } = await s.auth.admin.listUsers({ page: 1, perPage: 1000 });
    for (const u of list?.users ?? []) if (u.email) emails.set(u.id, u.email);
  } catch {
    /* email lookup is best-effort */
  }

  const rows = (profiles ?? []).map((p) => ({ ...p, email: emails.get(p.id) ?? null }));
  return NextResponse.json({ rows });
}

// PATCH: set a member's tier. Body: { id, membership_tier }
export async function PATCH(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!isUuid(body.id)) return NextResponse.json({ error: "Invalid member." }, { status: 400 });
  const tier = body.membership_tier as MembershipTier;
  if (!(tier in TIER_RANK)) return NextResponse.json({ error: "Invalid tier." }, { status: 400 });

  const s = getSupabaseAdminClient();
  const { error } = await s
    .from("profiles")
    .update({ membership_tier: tier, updated_at: new Date().toISOString() })
    .eq("id", body.id);
  if (error) return NextResponse.json({ error: "Failed to update." }, { status: 502 });
  await audit({ actor: user?.email ?? null, action: "member.tier_change", target: body.id as string, metadata: { tier } });
  return NextResponse.json({ ok: true });
}
