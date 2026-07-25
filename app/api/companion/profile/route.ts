import { NextResponse } from "next/server";
import { getCompanionUser, ensureCompanionProfile } from "@/lib/companionAuth";
import { hasAcceptedCurrentDisclosure } from "@/lib/companion/disclosureAcceptance";
import { DISCLOSURE_VERSION } from "@/lib/companion/disclosures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — routing state for the app shell: is the user entitled, verified, onboarded,
// and has the current disclosure version been accepted?
export async function GET() {
  const cu = await getCompanionUser();
  if (!cu) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const [profile, disclosureAccepted] = await Promise.all([
    ensureCompanionProfile(cu.user.id),
    hasAcceptedCurrentDisclosure(cu.user.id),
  ]);
  return NextResponse.json({
    hasEntitlement: cu.hasEntitlement,
    emailVerified: cu.emailVerified,
    onboarded: !!profile.onboarding_completed_at,
    disclosure_accepted: disclosureAccepted,
    disclosure_version: DISCLOSURE_VERSION,
    current_status_id: profile.current_status_id,
    is_staff: cu.isStaff,
  });
}
