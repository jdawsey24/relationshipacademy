import { NextResponse } from "next/server";
import { requireCompanionUser } from "@/lib/companionAuth";
import { getActiveResources } from "@/lib/companion/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — active verified crisis/professional resources for the persistent
// "Get help now" screen. Signed-in Companion users only. Triggers/response
// language are never exposed here — resources only.
export async function GET() {
  const cu = await requireCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const resources = await getActiveResources("high_risk");
  return NextResponse.json({ resources });
}
