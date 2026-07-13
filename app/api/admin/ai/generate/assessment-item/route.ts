import { NextResponse } from "next/server";
import { requireAiOwner, preflightGeneration } from "@/lib/ai/guard";
import { getAiSettings } from "@/lib/ai/settings";
import { audit } from "@/lib/audit";
import { generateAssessmentItemsStaged, AiError } from "@/lib/ai/generateItem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: generate assessment-item DRAFTS into ai_item_drafts (staging). Owner+MFA,
// kill-switch/rate/cost preflight. Drafts never enter the canonical bank here.
export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  const settings = await getAiSettings();
  const pre = await preflightGeneration(request, settings, "assessment_item");
  if (pre) return pre;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const competency_id = typeof body.competency_id === "string" ? body.competency_id.trim() : "";
  if (!competency_id) return NextResponse.json({ error: "Select a competency (grounding is required)." }, { status: 400 });

  try {
    const result = await generateAssessmentItemsStaged({
      actor: auth.user.email ?? null,
      competency_id,
      assessment_id: typeof body.assessment_id === "string" ? body.assessment_id : undefined,
      count: Number(body.count) || 8,
      parameters: typeof body.parameters === "object" && body.parameters ? (body.parameters as Record<string, unknown>) : {},
      includeIncomplete: body.includeIncomplete === true,
      includeApprovedItems: body.includeApprovedItems !== false,
      excludeSourceIds: Array.isArray(body.excludeSourceIds) ? (body.excludeSourceIds as string[]) : undefined,
    });
    await audit({ actor: auth.user.email ?? null, action: "ai.generate.assessment_item", target: competency_id, metadata: { request_id: result.request_id, drafts: result.draft_ids.length, validation: result.validation_status } });
    return NextResponse.json(result);
  } catch (e) {
    const err = e instanceof AiError ? e : new AiError("Generation failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
