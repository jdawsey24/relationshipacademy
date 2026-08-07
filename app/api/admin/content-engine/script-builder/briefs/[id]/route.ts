import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// One brief and everything hanging off it. The UI is four screens over this
// single payload, so a reviewer never sees a half-loaded package.

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;
  const s = getSupabaseAdminClient();

  const { data: brief, error } = await s
    .from("ce_content_briefs").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!brief) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [angles, scripts, pkg, comparison, conflicts, campaigns, series, realTalk] = await Promise.all([
    s.from("ce_angles").select("*").eq("brief_id", id).order("created_at"),
    s.from("ce_scripts").select("*").eq("brief_id", id).order("reading_level"),
    s.from("ce_script_packages").select("*").eq("brief_id", id).maybeSingle(),
    s.from("ce_script_comparisons").select("*").eq("brief_id", id).maybeSingle(),
    s.from("ce_generation_conflicts")
      .select("id, conflict_type, explanation, resolution, created_at")
      .eq("bridge_id", (brief as { bridge_id: string }).bridge_id)
      .eq("resolution", "unresolved"),
    s.from("ce_campaigns").select("id, name, target_audience, cta_destination, primary_keyword, transformation")
      .eq("is_active", true).order("name"),
    s.from("ce_content_series").select("id, slug, name, description").eq("active", true).order("name"),
    s.from("ce_real_talk_briefs").select("*").eq("brief_id", id).maybeSingle(),
  ]);

  return NextResponse.json({
    brief,
    angles: angles.data ?? [],
    scripts: scripts.data ?? [],
    package: pkg.data ?? null,
    comparison: comparison.data ?? null,
    // Surfaced with the brief: an unresolved conflict means a stage stopped and
    // is waiting on a decision, which the reviewer must see before anything else.
    conflicts: conflicts.data ?? [],
    // Campaigns travel with the brief so the audience framing is visible where
    // it takes effect. It reaches every angle, script and hashtag downstream,
    // and it was previously only discoverable by reading the generated output.
    campaigns: campaigns.data ?? [],
    series: series.data ?? [],
    // Real Talk is a series: its seven-part argument travels with the brief
    // because a script in that series cannot be written without it.
    realTalk: realTalk.data ?? null,
  });
}

// Configuration (stage 8). Only fields the owner actually sets — the framework
// mapping is copied at brief creation and is deliberately not editable here.
const CONFIGURABLE = new Set([
  "platform", "script_format", "target_runtime_seconds", "tone", "content_objective",
  "cta_destination", "primary_keyword", "supporting_terms", "community_keyword",
  "expert_positioning_level", "real_talk_intensity", "target_audience",
  "campaign_id", "content_series_id", "audience_segment_id", "delivery_profile_id",
  "content_risk_level", "factual_basis", "framework_interpretation", "topic",
]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  const rejected: string[] = [];
  for (const [k, v] of Object.entries(body)) {
    if (CONFIGURABLE.has(k)) patch[k] = v;
    else rejected.push(k);
  }
  if (!Object.keys(patch).length) {
    return NextResponse.json(
      { error: `No configurable fields supplied.${rejected.length ? ` Not configurable: ${rejected.join(", ")}.` : ""}` },
      { status: 400 },
    );
  }
  patch.updated_at = new Date().toISOString();

  const s = getSupabaseAdminClient();
  const { data, error } = await s
    .from("ce_content_briefs").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const user = await getAdminUser();
  await audit({
    actor: user?.email ?? null,
    action: "content_engine.brief.configured",
    metadata: { brief_id: id, fields: Object.keys(patch) },
  });

  // Rejected keys are reported rather than ignored: a silently dropped field
  // looks identical to a saved one from the client's side.
  return NextResponse.json({ brief: data, ignored: rejected });
}
