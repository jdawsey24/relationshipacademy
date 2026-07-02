import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabaseServer";
import { getAdminRole, requireAdmin } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Current admin's email + role (drives nav gating).
export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;
  const user = await getAdminUser();
  return NextResponse.json({ email: user?.email ?? null, role: getAdminRole(user) });
}
