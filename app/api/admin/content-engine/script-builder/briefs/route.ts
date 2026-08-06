import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import { createBrief } from "@/lib/contentEngine/scriptBuilder/workflow";
import { ScriptBuilderError } from "@/lib/contentEngine/scriptBuilder/generate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Content briefs — list, and create from an approved bridge.
//
// Creating a brief is the moment stages 1-5 stop being reviewable proposals and
// become the contract everything downstream is written against, so the guards
// live in createBrief() rather than here: bridge eligibility, a re-validated
// framework mapping, and a resolved public-use approval.

export async function GET() {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  const s = getSupabaseAdminClient();
  const { data, error } = await s
    .from("ce_content_briefs")
    .select("id, topic, platform, status, competency_id, phase_id, mapping_validated, " +
            "publication_eligible, target_runtime_seconds, created_at, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ briefs: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  let body: { bridge_id?: string; topic?: string; platform?: string; campaign_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.bridge_id) return NextResponse.json({ error: "bridge_id is required." }, { status: 400 });
  if (!body.topic?.trim()) return NextResponse.json({ error: "A topic is required." }, { status: 400 });

  const user = await getAdminUser();
  try {
    const { briefId, warnings } = await createBrief({
      bridgeId: body.bridge_id,
      topic: body.topic.trim(),
      platform: body.platform,
      campaignId: body.campaign_id ?? null,
      actor: user?.email ?? null,
    });

    await audit({
      actor: user?.email ?? null,
      action: "content_engine.brief.created",
      metadata: { brief_id: briefId, bridge_id: body.bridge_id, warnings: warnings.length },
    });

    return NextResponse.json({ brief_id: briefId, warnings }, { status: 201 });
  } catch (e) {
    if (e instanceof ScriptBuilderError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Could not create the brief." }, { status: 500 });
  }
}
