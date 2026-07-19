import { NextResponse } from "next/server";
import { requireEntitledCompanionUser } from "@/lib/companionAuth";
import { listPlans, createPlan } from "@/lib/companion/planner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — list plans. POST { entry_id? } — create a new plan.
export async function GET() {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  return NextResponse.json({ plans: await listPlans(cu.user.id) });
}

export async function POST(request: Request) {
  const cu = await requireEntitledCompanionUser();
  if (cu instanceof NextResponse) return cu;
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* optional body */ }
  const id = await createPlan(cu.user.id, typeof body.entry_id === "string" ? body.entry_id : null);
  if (!id) return NextResponse.json({ error: "Failed." }, { status: 502 });
  return NextResponse.json({ id });
}
