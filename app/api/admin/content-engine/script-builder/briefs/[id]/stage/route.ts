import { NextResponse } from "next/server";
import { requireAiOwner, preflightGeneration } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getAiSettings } from "@/lib/ai/settings";
import { audit } from "@/lib/audit";
import { ScriptBuilderError, STAGE_TEMPLATES } from "@/lib/contentEngine/scriptBuilder/generate";
import {
  compareScripts, generateAngles, generatePackage, generateScripts,
  overrideSimilarity, runQcAndDraft, selectAngle,
} from "@/lib/contentEngine/scriptBuilder/workflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One action endpoint for every stage after the brief exists.
//
// Stages are advanced explicitly, one request at a time. There is no "run the
// whole pipeline" call, because the two owner gates — approve the mapping,
// choose the angle — are the point of staging, and an endpoint that ran past
// them would quietly remove them.

type Stage = "angles" | "select_angle" | "scripts" | "compare" | "override" | "package" | "qc";

/** Stages that call the provider, and the settings key that can disable each. */
const GENERATIVE: Partial<Record<Stage, string>> = {
  angles: STAGE_TEMPLATES.angles,
  scripts: STAGE_TEMPLATES.script,
  compare: STAGE_TEMPLATES.equivalence,
  package: STAGE_TEMPLATES.packaging,
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  let body: { stage?: Stage; angle_id?: string; edits?: Record<string, string>; reason?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const stage = body.stage;
  if (!stage) return NextResponse.json({ error: "A stage is required." }, { status: 400 });

  // Cost ceiling, kill switch and rate limit apply to provider stages only.
  const generationType = GENERATIVE[stage];
  if (generationType) {
    const settings = await getAiSettings();
    const blocked = await preflightGeneration(request, settings, generationType);
    if (blocked) return blocked;
  }

  const user = await getAdminUser();
  const actor = user?.email ?? null;

  try {
    switch (stage) {
      case "angles": {
        const r = await generateAngles(id, actor);
        await audit({ actor, action: "content_engine.script.angles", metadata: { brief_id: id, count: r.angles.length } });
        return NextResponse.json(r);
      }
      case "select_angle": {
        if (!body.angle_id) return NextResponse.json({ error: "angle_id is required." }, { status: 400 });
        await selectAngle(id, body.angle_id, body.edits);
        await audit({ actor, action: "content_engine.script.angle_selected", metadata: { brief_id: id, angle_id: body.angle_id, edited: !!body.edits } });
        return NextResponse.json({ ok: true });
      }
      case "scripts": {
        const r = await generateScripts(id, actor);
        await audit({ actor, action: "content_engine.script.drafted", metadata: { brief_id: id } });
        return NextResponse.json(r);
      }
      case "compare": {
        const r = await compareScripts(id, actor);
        await audit({ actor, action: "content_engine.script.compared", metadata: { brief_id: id, similarity: r.comparison.lexicalSimilarity, equivalent: r.comparison.equivalenceOk } });
        return NextResponse.json(r);
      }
      case "override": {
        if (!body.reason?.trim()) {
          return NextResponse.json({ error: "An override requires a reason." }, { status: 400 });
        }
        await overrideSimilarity(id, body.reason, actor);
        await audit({ actor, action: "content_engine.script.similarity_override", metadata: { brief_id: id, reason: body.reason.slice(0, 200) } });
        return NextResponse.json({ ok: true });
      }
      case "package": {
        const r = await generatePackage(id, actor);
        await audit({ actor, action: "content_engine.script.packaged", metadata: { brief_id: id } });
        return NextResponse.json(r);
      }
      case "qc": {
        const r = await runQcAndDraft(id, actor);
        await audit({
          actor, action: "content_engine.script.qc",
          metadata: { brief_id: id, draft_id: r.draftId, version: r.version, blocked: r.qc.blocked, blocking: r.qc.blocking.length },
        });
        return NextResponse.json(r);
      }
      default:
        return NextResponse.json({ error: `Unknown stage "${stage}".` }, { status: 400 });
    }
  } catch (e) {
    if (e instanceof ScriptBuilderError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "The stage failed." },
      { status: 500 },
    );
  }
}
