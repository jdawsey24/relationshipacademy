import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/adminApi";
import { getAdminUser } from "@/lib/supabaseServer";
import { audit } from "@/lib/audit";
import { generateAssessmentItems } from "@/lib/studioAiAuthor";
import { StudioError } from "@/lib/studioWorkflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { competency_id, count, instructions } → AI-drafted candidate items into
// the item bank. Always status='draft', provenance='ai_generated'.
export async function POST(request: Request) {
  const unauth = await requireEditor();
  if (unauth) return unauth;
  const user = await getAdminUser();
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const competency_id = typeof body.competency_id === "string" ? body.competency_id.trim() : "";
  if (!competency_id) return NextResponse.json({ error: "Select a competency." }, { status: 400 });
  try {
    const res = await generateAssessmentItems({
      competency_id,
      count: Number(body.count) || 8,
      instructions: typeof body.instructions === "string" ? body.instructions : undefined,
      actor: user?.email ?? null,
    });
    await audit({ actor: user?.email ?? null, action: "studio.item.ai_generate", target: competency_id, metadata: { count: res.count } });
    return NextResponse.json(res);
  } catch (e) {
    const err = e instanceof StudioError ? e : new StudioError("Generation failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
