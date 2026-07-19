import { NextResponse } from "next/server";
import { getCompanionUser, ensureCompanionProfile } from "@/lib/companionAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — routing state for the app shell: is the user entitled, verified, onboarded?
export async function GET() {
  const cu = await getCompanionUser();
  if (!cu) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const profile = await ensureCompanionProfile(cu.user.id);
  return NextResponse.json({
    hasEntitlement: cu.hasEntitlement,
    emailVerified: cu.emailVerified,
    onboarded: !!profile.onboarding_completed_at,
    current_status_id: profile.current_status_id,
    is_staff: cu.isStaff,
  });
}
