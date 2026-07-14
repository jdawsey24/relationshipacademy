import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { audit } from "@/lib/audit";
import { generateResultNarrative, NarrativeError, type NarrativeInput } from "@/lib/ai/resultNarrative";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST → grounded AI expansion of a DETERMINISTIC result into a personalized
// narrative. Phase 1: OWNER + MFA only (Sandbox preview). No public exposure —
// the live consumer path is untouched. Kill-switch/cost are enforced inside the
// generator. AI never alters scores; it writes prose from the supplied results.
export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const input: NarrativeInput = {
    firstName: typeof body.firstName === "string" ? body.firstName : null,
    structuralContext: typeof body.structuralContext === "string" ? body.structuralContext : null,
    phaseAlignment: typeof body.phaseAlignment === "string" ? body.phaseAlignment : null,
    alignmentStatus: typeof body.alignmentStatus === "string" ? body.alignmentStatus : null,
    strengths: Array.isArray(body.strengths) ? body.strengths.map(String) : [],
    growthArea: typeof body.growthArea === "string" ? body.growthArea : null,
    authoredSections: Array.isArray(body.authoredSections)
      ? (body.authoredSections as unknown[]).map((s) => ({ heading: String((s as Record<string, unknown>).heading ?? ""), body: String((s as Record<string, unknown>).body ?? "") }))
      : [],
  };

  try {
    const res = await generateResultNarrative(input);
    await audit({ actor: auth.user.email ?? null, action: "ai.result_narrative.preview", target: input.structuralContext ?? "sandbox", metadata: { safety: res.safety_status, sections: res.sections.length } });
    return NextResponse.json(res);
  } catch (e) {
    const err = e instanceof NarrativeError ? e : new NarrativeError("Narrative generation failed.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
