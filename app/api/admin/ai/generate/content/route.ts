import { NextResponse } from "next/server";
import { requireAiOwner, preflightGeneration } from "@/lib/ai/guard";
import { getAiSettings } from "@/lib/ai/settings";
import { audit } from "@/lib/audit";
import { generateContentDraft, type ContentAssetType } from "@/lib/ai/generateContent";
import { AiError } from "@/lib/ai/generateItem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: ContentAssetType[] = ["worksheet", "lesson"];

// POST { asset_type, competency_id, parameters } → a content DRAFT into
// ai_content_drafts (staging). Owner+MFA, kill-switch/rate/cost preflight.
export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const asset_type = body.asset_type as ContentAssetType;
  if (!TYPES.includes(asset_type)) return NextResponse.json({ error: "asset_type must be worksheet or lesson." }, { status: 400 });
  const competency_id = typeof body.competency_id === "string" ? body.competency_id.trim() : "";
  if (!competency_id) return NextResponse.json({ error: "Select a competency (grounding is required)." }, { status: 400 });

  const settings = await getAiSettings();
  const pre = await preflightGeneration(request, settings, asset_type);
  if (pre) return pre;

  try {
    const result = await generateContentDraft({
      actor: auth.user.email ?? null, asset_type, competency_id,
      parameters: typeof body.parameters === "object" && body.parameters ? (body.parameters as Record<string, unknown>) : {},
      includePractices: body.includePractices !== false,
      includeInterventions: body.includeInterventions === true,
    });
    await audit({ actor: auth.user.email ?? null, action: `ai.generate.${asset_type}`, target: competency_id, metadata: { request_id: result.request_id, draft_id: result.draft_id, validation: result.validation_status } });
    return NextResponse.json(result);
  } catch (e) {
    const err = e instanceof AiError ? e : new AiError("Generation failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
