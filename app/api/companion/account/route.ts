import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { deleteCompanionData } from "@/lib/companion/export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// DELETE — erase all of the user's OWN Companion data (entries, plans, Blueprint,
// milestones, interests; profile reset). Does NOT delete the auth account. The UI
// reauthenticates the user (re-enter password) before calling this — a sensitive,
// irreversible action.
export async function DELETE() {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  const ok = await deleteCompanionData(cu.user.id);
  if (!ok) return NextResponse.json({ error: "Could not delete your data." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
