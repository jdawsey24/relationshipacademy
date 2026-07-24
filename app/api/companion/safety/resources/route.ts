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
  // Persistent "Get help" screen shows all active verified resources for the
  // jurisdiction (default US; jurisdiction-aware routing lands with geo/prefs).
  const resources = await getActiveResources("US");
  return NextResponse.json({ resources });
}
