import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Accept, reject, or edit a proposed bridge BEFORE anything is generated from it.
// This is the operator's veto over the framework mapping (acceptance criterion 8).
const DECISIONS = new Set(["accepted", "rejected", "edited"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  let body: { decision?: string; reject_reason?: string; competency_id?: string; angle?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.decision || !DECISIONS.has(body.decision)) {
    return NextResponse.json({ error: "decision must be accepted, rejected, or edited." }, { status: 400 });
  }
  if (body.decision === "rejected" && !body.reject_reason?.trim()) {
    // A reason is required so the rejects stay useful evidence rather than noise.
    return NextResponse.json({ error: "A reject_reason is required when rejecting." }, { status: 400 });
  }

  const s = getSupabaseAdminClient();
  const user = await getAdminUser();

  const patch: Record<string, unknown> = {
    decision: body.decision,
    reject_reason: body.reject_reason ?? null,
    decided_by: user?.email ?? null,
    decided_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  // An edited mapping still has to be canonical — the FK enforces that.
  if (body.competency_id) patch.competency_id = body.competency_id;
  if (body.angle) patch.angle = body.angle;

  const { data, error } = await s
    .from("ce_relational_bridges").update(patch).eq("id", id).select("*").maybeSingle();

  if (error) {
    const invalidFk = /foreign key|violates/i.test(error.message);
    return NextResponse.json(
      { error: invalidFk ? "That competency_id is not in the canonical set." : error.message },
      { status: invalidFk ? 400 : 500 },
    );
  }
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await audit({
    actor: user?.email ?? null,
    action: `content_engine.bridge.${body.decision}`,
    metadata: { bridge_id: id, competency_id: (data as { competency_id: string }).competency_id },
  });
  return NextResponse.json({ bridge: data });
}
