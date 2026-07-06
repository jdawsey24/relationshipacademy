import { NextResponse } from "next/server";
import { getMember } from "@/lib/academyAuth";
import { tierLabel } from "@/lib/academy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight identity endpoint for the member portal chrome (nav).
export async function GET() {
  const member = await getMember();
  if (!member) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({
    authenticated: true,
    email: member.user.email,
    name: member.profile.full_name,
    tier: member.tier,
    tierLabel: tierLabel(member.tier),
    isStaff: member.isStaff,
  });
}
