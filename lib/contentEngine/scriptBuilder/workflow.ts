import { getSupabaseAdminClient } from "@/lib/supabase";
import { validateMapping } from "@/lib/contentEngine/mappingValidation";
import { pickConsumerSafeDetail } from "@/lib/contentEngine/retrieval";
import { audienceForPlatform, checkPublicUse } from "@/lib/contentEngine/scriptBuilder/governance";
import {
  ANGLE_MAX, ANGLE_MIN, ANGLES_SCHEMA, EQUIVALENCE_SCHEMA, PACKAGING_SCHEMA, SCRIPT_SCHEMA,
  ScriptBuilderError, haltOnConflict, measureScript, runStage,
} from "@/lib/contentEngine/scriptBuilder/generate";
import { evaluateComparison, DEFAULT_WPM } from "@/lib/contentEngine/scriptBuilder/analysis";
import { persistScriptQc, runScriptQc } from "@/lib/contentEngine/scriptBuilder/qc";

// The Script Builder workflow, stages 6 through 12.
//
// Stages 1-5 (topic, claims, population, bridge, retrieval) already have homes
// and end at an owner gate. This module picks up from an APPROVED bridge and
// carries it to a versioned draft.
//
// The brief COPIES the approved mapping rather than joining to it. If the bridge
// is later edited, a script built earlier still records what was actually
// approved when it was written — provenance has to be a snapshot, or it is just
// a pointer at whatever the data says today.

export interface BriefRow {
  id: string;
  bridge_id: string;
  competency_id: string | null;
  phase_id: string | null;
  domain_id: string | null;
  topic: string;
  platform: string;
  target_runtime_seconds: number;
  delivery_profile_id: string | null;
  mapping_validated: boolean;
  publication_eligible: boolean;
  status: string;
  selected_angle_id: string | null;
  [k: string]: unknown;
}

async function loadBrief(briefId: string): Promise<BriefRow> {
  const s = getSupabaseAdminClient();
  const { data, error } = await s.from("ce_content_briefs").select("*").eq("id", briefId).maybeSingle();
  if (error) throw new ScriptBuilderError(`Could not read the brief: ${error.message}`, 502);
  if (!data) throw new ScriptBuilderError("Brief not found.", 404);
  return data as unknown as BriefRow;
}

async function wpmFor(deliveryProfileId: string | null): Promise<number> {
  if (!deliveryProfileId) return DEFAULT_WPM;
  const s = getSupabaseAdminClient();
  const { data } = await s
    .from("ce_delivery_profiles").select("words_per_minute").eq("id", deliveryProfileId).maybeSingle();
  return (data as { words_per_minute: number } | null)?.words_per_minute ?? DEFAULT_WPM;
}

// ---------------------------------------------------------------------------
// Stage 6 — content brief
// ---------------------------------------------------------------------------

export interface CreateBriefInput {
  bridgeId: string;
  topic: string;
  actor: string | null;
  platform?: string;
  campaignId?: string | null;
}

/**
 * Build the brief from an approved bridge.
 *
 * Three gates, all of which must pass before a brief exists at all: the bridge
 * must be eligible for generation, the full framework relationship must
 * re-validate now (not merely have validated once), and the competency's
 * public-use approval is resolved and recorded.
 *
 * Publication eligibility does NOT block brief creation. A draft may be built
 * from an unapproved source — it just cannot be published, and the brief says so.
 */
export async function createBrief(input: CreateBriefInput): Promise<{ briefId: string; warnings: string[] }> {
  const s = getSupabaseAdminClient();
  const warnings: string[] = [];

  const { data: bridgeRow } = await s
    .from("ce_relational_bridges")
    .select("id, candidate_id, competency_id, phase_id, domain_id, status, eligible_for_generation, " +
            "rationale, affected_population, relational_consequence, angle")
    .eq("id", input.bridgeId).maybeSingle();

  if (!bridgeRow) throw new ScriptBuilderError("Bridge not found.", 404);
  const bridge = bridgeRow as unknown as {
    id: string; candidate_id: string; competency_id: string | null; phase_id: string | null;
    domain_id: string | null; status: string; eligible_for_generation: boolean;
    rationale: string | null; affected_population: string | null;
    relational_consequence: string | null; angle: string | null;
  };

  if (!bridge.eligible_for_generation) {
    throw new ScriptBuilderError(
      `This bridge is "${bridge.status}" and not eligible for generation. ` +
      `Only strong or moderate bridges with a validated mapping may produce content.`,
      409,
    );
  }
  if (!bridge.competency_id) {
    throw new ScriptBuilderError("The bridge has no competency. A brief cannot be built without one.", 409);
  }

  // Re-validate rather than trusting the stored flag: the competency table has
  // changed under us before, and a mapping approved last week may not hold now.
  const mapping = await validateMapping({
    competency_id: bridge.competency_id,
    phase_id: bridge.phase_id,
    domain_id: bridge.domain_id,
  });
  if (!mapping.valid) {
    throw new ScriptBuilderError(
      `The framework mapping no longer validates: ${mapping.errors.join(" ")}`,
      409,
    );
  }

  const platform = input.platform ?? "instagram";
  const approval = await checkPublicUse({
    sourceType: "competency",
    sourceId: bridge.competency_id,
    use: "public_script",
    audience: audienceForPlatform(platform),
  });
  if (!approval.eligible) warnings.push(approval.reason);

  // Consumer-safe projection only. Clinical Applications and Facilitation Notes
  // are populated for every competency and must never reach a script.
  const { data: detailRow } = await s
    .from("kb_competencies").select("detail").eq("code", bridge.competency_id).eq("kind", "competency").maybeSingle();
  const safe = pickConsumerSafeDetail((detailRow as { detail: unknown } | null)?.detail);

  const { data: campaign } = input.campaignId
    ? await s.from("ce_campaigns").select("*").eq("id", input.campaignId).maybeSingle()
    : await s.from("ce_campaigns").select("*").eq("is_active", true).limit(1).maybeSingle();
  const c = campaign as Record<string, string | null> | null;

  const { data: created, error } = await s.from("ce_content_briefs").insert({
    candidate_id: bridge.candidate_id,
    bridge_id: bridge.id,
    content_origin: "manual",
    topic: input.topic,
    affected_population: bridge.affected_population,
    relational_consequence: bridge.relational_consequence,
    competency_id: bridge.competency_id,
    phase_id: mapping.resolved.phase_id,
    domain_id: mapping.resolved.domain_id,
    developmental_task: mapping.resolved.developmental_task,
    source_record: mapping.resolved.source_record,
    source_status: mapping.resolved.source_status,
    mapping_rationale: bridge.rationale,
    observable_pattern: safe["Observable Expressions"] ?? null,
    approved_public_interpretation: safe["Consumer Translation"] ?? null,
    mapping_validated: true,
    publication_eligible: approval.eligible,
    platform,
    campaign_id: c?.id ?? null,
    target_audience: c?.target_audience ?? null,
    cta_destination: c?.cta_destination ?? null,
    primary_keyword: c?.primary_keyword ?? null,
    status: "draft",
    created_by: input.actor,
  }).select("id").maybeSingle();

  if (error || !created) throw new ScriptBuilderError(`Could not create the brief: ${error?.message}`, 502);

  if (!safe["Consumer Translation"]) {
    warnings.push(
      "This competency has no Consumer Translation authored, so there is no approved public interpretation " +
      "to write from. Scripts will be drafted from the framework definition and must be read closely.",
    );
  }

  return { briefId: (created as { id: string }).id, warnings };
}

// ---------------------------------------------------------------------------
// Stage 7 — angles
// ---------------------------------------------------------------------------

function briefContext(b: BriefRow): string {
  // Only approved, consumer-safe material. Assembled explicitly rather than by
  // spreading the row, so a column added later cannot silently reach a prompt.
  return JSON.stringify({
    topic: b.topic,
    affected_population: b.affected_population,
    relational_consequence: b.relational_consequence,
    phase: b.phase_id,
    developmental_task: b.developmental_task,
    domain: b.domain_id,
    competency: b.competency_id,
    observable_pattern: b.observable_pattern,
    approved_public_interpretation: b.approved_public_interpretation,
    mapping_rationale: b.mapping_rationale,
    target_audience: b.target_audience,
    platform: b.platform,
    content_objective: b.content_objective,
    cta_destination: b.cta_destination,
    primary_keyword: b.primary_keyword,
    expert_positioning_level: b.expert_positioning_level,
    real_talk_intensity: b.real_talk_intensity,
  }, null, 2);
}

export async function generateAngles(briefId: string, actor: string | null) {
  const s = getSupabaseAdminClient();
  const brief = await loadBrief(briefId);
  if (!brief.mapping_validated) {
    throw new ScriptBuilderError("The mapping is not validated. Angles cannot be generated.", 409);
  }

  const res = await runStage<{ angles: Record<string, string>[] }>({
    stage: "angles", actor, briefId, competencyId: brief.competency_id,
    vars: { brief: briefContext(brief) }, schema: ANGLES_SCHEMA,
  });

  await haltOnConflict(res.output, {
    requestId: res.requestId, bridgeId: brief.bridge_id,
    approvedMapping: { competency_id: brief.competency_id, phase_id: brief.phase_id, domain_id: brief.domain_id },
    requested: brief.topic,
  });

  await s.from("ce_angles").delete().eq("brief_id", briefId).eq("is_selected", false);
  const { data: rows } = await s.from("ce_angles").insert(
    res.output.angles.map((a) => ({
      brief_id: briefId,
      label: a.label, premise: a.premise, hook: a.hook ?? null,
      audience_promise: a.audience_promise ?? null, why_different: a.why_different ?? null,
      risk_notes: a.risk_notes ?? null, generation_request_id: res.requestId,
    })),
  ).select("id, label, premise, hook, audience_promise, why_different, risk_notes");

  await s.from("ce_content_briefs")
    .update({ status: "angles_generated", updated_at: new Date().toISOString() }).eq("id", briefId);

  // The 3-5 range cannot be a schema constraint (provider structured output
  // accepts minItems 0 or 1 only), so it is checked here. Reported rather than
  // thrown: the angles are already generated and paid for, and fewer than three
  // is a weak result, not an invalid one.
  const warnings: string[] = [];
  const count = res.output.angles.length;
  if (count < ANGLE_MIN || count > ANGLE_MAX) {
    warnings.push(`The model returned ${count} angles; ${ANGLE_MIN}-${ANGLE_MAX} were requested. ` +
      `${count < ANGLE_MIN ? "That is not much of a choice — consider regenerating." : ""}`.trim());
  }

  return { angles: rows ?? [], costUsd: res.costUsd, warnings };
}

export async function selectAngle(briefId: string, angleId: string, edits?: Record<string, string>) {
  const s = getSupabaseAdminClient();
  await s.from("ce_angles").update({ is_selected: false }).eq("brief_id", briefId);
  const patch: Record<string, unknown> = { is_selected: true, updated_at: new Date().toISOString() };
  if (edits && Object.keys(edits).length) {
    Object.assign(patch, edits, { edited_by_owner: true });
  }
  const { error } = await s.from("ce_angles").update(patch).eq("id", angleId).eq("brief_id", briefId);
  if (error) throw new ScriptBuilderError(`Could not select the angle: ${error.message}`, 502);
  await s.from("ce_content_briefs")
    .update({ selected_angle_id: angleId, status: "angle_selected", updated_at: new Date().toISOString() })
    .eq("id", briefId);
}

// ---------------------------------------------------------------------------
// Stage 9 — the two scripts, drafted independently (ruling 9)
// ---------------------------------------------------------------------------

export async function generateScripts(briefId: string, actor: string | null) {
  const s = getSupabaseAdminClient();
  const brief = await loadBrief(briefId);
  if (!brief.selected_angle_id) {
    throw new ScriptBuilderError("No angle is selected. Scripts are written from an approved angle.", 409);
  }

  const { data: angleRow } = await s.from("ce_angles").select("*").eq("id", brief.selected_angle_id).maybeSingle();
  if (!angleRow) throw new ScriptBuilderError("The selected angle no longer exists.", 409);
  const angle = JSON.stringify(angleRow, null, 2);
  const wpm = await wpmFor(brief.delivery_profile_id);
  const context = briefContext(brief);

  // Both start from the same approved brief and angle and never see each other.
  // A "simplify this" pass would produce one script wearing two reading levels,
  // which is exactly what the comparison stage exists to detect.
  const levels: ("grade5" | "higher")[] = ["grade5", "higher"];
  const results = await Promise.all(levels.map((level) =>
    runStage<{ hook: string; body: string; cta: string }>({
      stage: "script", actor, briefId, competencyId: brief.competency_id,
      vars: {
        brief: context, angle, reading_level: level,
        target_runtime: String(brief.target_runtime_seconds),
        words_per_minute: String(wpm),
        target_words: String(Math.round((brief.target_runtime_seconds / 60) * wpm)),
        script_format: String(brief.script_format ?? "talking_head"),
        tone: String(brief.tone ?? ""),
      },
      schema: SCRIPT_SCHEMA,
    }).then((r) => ({ level, ...r })),
  ));

  for (const r of results) {
    await haltOnConflict(r.output, {
      requestId: r.requestId, bridgeId: brief.bridge_id,
      approvedMapping: { competency_id: brief.competency_id, phase_id: brief.phase_id, domain_id: brief.domain_id },
      requested: `${r.level} script`,
    });
  }

  for (const r of results) {
    const measured = measureScript(r.output, brief.target_runtime_seconds, wpm);
    await s.from("ce_scripts").upsert({
      brief_id: briefId, angle_id: brief.selected_angle_id, reading_level: r.level,
      hook: r.output.hook, body: r.output.body, cta: r.output.cta,
      ...measured, generation_request_id: r.requestId, updated_at: new Date().toISOString(),
    }, { onConflict: "brief_id,reading_level" });
  }

  await s.from("ce_content_briefs")
    .update({ status: "scripts_generated", updated_at: new Date().toISOString() }).eq("id", briefId);

  return { costUsd: results.reduce((a, r) => a + r.costUsd, 0) };
}

/**
 * Compare the two scripts. Lexical similarity is computed here; conceptual
 * equivalence is a separate model call, because "do these still teach the same
 * lesson" is a judgement no string metric can make.
 */
export async function compareScripts(briefId: string, actor: string | null) {
  const s = getSupabaseAdminClient();
  const brief = await loadBrief(briefId);
  const { data: scriptRows } = await s
    .from("ce_scripts").select("reading_level, hook, body, cta").eq("brief_id", briefId);
  const scripts = (scriptRows ?? []) as { reading_level: string; hook: string; body: string; cta: string }[];
  const g5 = scripts.find((x) => x.reading_level === "grade5");
  const hi = scripts.find((x) => x.reading_level === "higher");
  if (!g5 || !hi) throw new ScriptBuilderError("Both scripts must exist before they can be compared.", 409);

  const eq = await runStage<{
    lesson_match: boolean; reward_match: boolean; hook_match: boolean; cta_match: boolean; notes: string;
  }>({
    stage: "equivalence", actor, briefId, competencyId: brief.competency_id,
    vars: {
      grade5: JSON.stringify(g5, null, 2),
      higher: JSON.stringify(hi, null, 2),
    },
    schema: EQUIVALENCE_SCHEMA,
  });

  const comparison = evaluateComparison(g5.body, hi.body, {
    lessonMatch: eq.output.lesson_match, rewardMatch: eq.output.reward_match,
    hookMatch: eq.output.hook_match, ctaMatch: eq.output.cta_match,
  });

  await s.from("ce_script_comparisons").upsert({
    brief_id: briefId,
    lexical_similarity: comparison.lexicalSimilarity,
    similarity_threshold: comparison.threshold,
    similarity_exceeded: comparison.similarityExceeded,
    lesson_match: eq.output.lesson_match, reward_match: eq.output.reward_match,
    hook_match: eq.output.hook_match, cta_match: eq.output.cta_match,
    equivalence_ok: comparison.equivalenceOk,
    equivalence_notes: eq.output.notes,
    updated_at: new Date().toISOString(),
  }, { onConflict: "brief_id" });

  return { comparison, costUsd: eq.costUsd };
}

export async function overrideSimilarity(briefId: string, reason: string, actor: string | null) {
  if (!reason?.trim()) {
    throw new ScriptBuilderError("An override needs a reason. That is the entire point of it.", 400);
  }
  const s = getSupabaseAdminClient();
  const { error } = await s.from("ce_script_comparisons").update({
    owner_override: true, override_reason: reason.trim(),
    override_by: actor, override_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  }).eq("brief_id", briefId);
  if (error) throw new ScriptBuilderError(`Could not record the override: ${error.message}`, 502);
}

// ---------------------------------------------------------------------------
// Stage 10 — packaging
// ---------------------------------------------------------------------------

export async function generatePackage(briefId: string, actor: string | null) {
  const s = getSupabaseAdminClient();
  const brief = await loadBrief(briefId);
  const { data: scriptRows } = await s
    .from("ce_scripts").select("reading_level, hook, body, cta").eq("brief_id", briefId);
  if (!(scriptRows ?? []).length) {
    throw new ScriptBuilderError("Packaging needs a script. Generate the scripts first.", 409);
  }

  const res = await runStage<{
    on_screen_caption: string; post_caption: string; keywords?: string[];
    hashtags?: string[]; cta_text: string; visual_notes?: string[];
  }>({
    stage: "packaging", actor, briefId, competencyId: brief.competency_id,
    vars: {
      brief: briefContext(brief),
      scripts: JSON.stringify(scriptRows, null, 2),
      primary_keyword: String(brief.primary_keyword ?? ""),
      supporting_terms: JSON.stringify(brief.supporting_terms ?? []),
      community_keyword: String(brief.community_keyword ?? ""),
      cta_destination: String(brief.cta_destination ?? ""),
    },
    schema: PACKAGING_SCHEMA,
  });

  await haltOnConflict(res.output, {
    requestId: res.requestId, bridgeId: brief.bridge_id,
    approvedMapping: { competency_id: brief.competency_id },
    requested: "packaging",
  });

  await s.from("ce_script_packages").upsert({
    brief_id: briefId,
    on_screen_caption: res.output.on_screen_caption,
    post_caption: res.output.post_caption,
    keywords: res.output.keywords ?? [],
    hashtags: res.output.hashtags ?? [],
    cta_text: res.output.cta_text,
    cta_url: brief.cta_destination ?? null,
    visual_notes: res.output.visual_notes ?? [],
    generation_request_id: res.requestId,
    updated_at: new Date().toISOString(),
  }, { onConflict: "brief_id" });

  await s.from("ce_content_briefs")
    .update({ status: "packaged", updated_at: new Date().toISOString() }).eq("id", briefId);

  return { costUsd: res.costUsd };
}

// ---------------------------------------------------------------------------
// Stages 11 and 12 — QC, then a versioned draft
// ---------------------------------------------------------------------------

export async function runQcAndDraft(briefId: string, actor: string | null) {
  const s = getSupabaseAdminClient();
  const brief = await loadBrief(briefId);

  const [{ data: scriptRows }, { data: pkg }, { data: cmp }, { data: phase }] = await Promise.all([
    s.from("ce_scripts").select("reading_level, hook, body, cta").eq("brief_id", briefId),
    s.from("ce_script_packages").select("*").eq("brief_id", briefId).maybeSingle(),
    s.from("ce_script_comparisons").select("*").eq("brief_id", briefId).maybeSingle(),
    brief.phase_id
      ? s.from("fw_phases").select("name").eq("phase_id", brief.phase_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const comparison = cmp as Record<string, boolean | number | null> | null;
  const qc = await runScriptQc({
    briefId,
    phaseId: brief.phase_id,
    phaseName: (phase as { name: string } | null)?.name ?? null,
    competencyId: brief.competency_id,
    mappingValidated: brief.mapping_validated,
    publicationEligible: brief.publication_eligible,
    targetRuntimeSeconds: brief.target_runtime_seconds,
    wordsPerMinute: await wpmFor(brief.delivery_profile_id),
    scripts: (scriptRows ?? []) as { reading_level: "grade5" | "higher"; hook: string; body: string; cta: string }[],
    packageText: (pkg ?? undefined) as { on_screen_caption?: string; post_caption?: string; cta_text?: string } | undefined,
    equivalence: comparison ? {
      lessonMatch: comparison.lesson_match !== false,
      rewardMatch: comparison.reward_match !== false,
      hookMatch: comparison.hook_match !== false,
      ctaMatch: comparison.cta_match !== false,
    } : undefined,
    similarityThreshold: comparison ? Number(comparison.similarity_threshold) : undefined,
    comparisonStale: comparison?.stale === true,
    ownerOverride: comparison?.owner_override === true,
  });

  // Version the draft rather than overwrite it, so a regenerated package does
  // not erase what the previous review looked at.
  const { data: prior } = await s
    .from("ai_content_drafts").select("id, version")
    .eq("asset_type", "ce_video_script").eq("competency_id", brief.competency_id)
    .contains("draft_content", { brief_id: briefId })
    .order("version", { ascending: false }).limit(1).maybeSingle();
  const previous = prior as { id: string; version: number } | null;

  const { data: draft, error } = await s.from("ai_content_drafts").insert({
    asset_type: "ce_video_script",
    competency_id: brief.competency_id,
    temporary_title: brief.topic,
    draft_content: {
      brief_id: briefId,
      brief: { topic: brief.topic, platform: brief.platform, target_runtime_seconds: brief.target_runtime_seconds },
      mapping: { competency_id: brief.competency_id, phase_id: brief.phase_id, domain_id: brief.domain_id },
      scripts: scriptRows ?? [],
      packaging: pkg ?? null,
      comparison: comparison ?? null,
      qc: { blocked: qc.blocked, blocking: qc.blocking, warnings: qc.warnings, ungoverned: qc.ungoverned },
    },
    source_ids: [brief.competency_id].filter(Boolean),
    status: "draft",
    quality_status: qc.blocked ? "failed" : "passed",
    version: (previous?.version ?? 0) + 1,
    parent_draft_id: previous?.id ?? null,
    reviewer_id: actor,
  }).select("id, version").maybeSingle();

  if (error || !draft) throw new ScriptBuilderError(`Could not save the draft: ${error?.message}`, 502);
  const created = draft as { id: string; version: number };

  await persistScriptQc(null, created.id, qc);
  await s.from("ce_content_briefs")
    .update({ status: "qc_complete", updated_at: new Date().toISOString() }).eq("id", briefId);

  return { draftId: created.id, version: created.version, qc };
}

// ---------------------------------------------------------------------------
// Owner edits to a generated script
// ---------------------------------------------------------------------------

export interface EditScriptInput {
  briefId: string;
  readingLevel: "grade5" | "higher";
  hook?: string;
  body?: string;
  cta?: string;
  actor: string | null;
}

/**
 * Apply an owner's edit to one generated script.
 *
 * Three things happen together, and all three matter:
 *
 *   1. The model's original text is captured the FIRST time a script is edited,
 *      so the thing QC actually assessed is still recoverable. Subsequent edits
 *      do not overwrite it — the baseline is the generated text, not the
 *      previous edit.
 *   2. Word count and runtime are recomputed. An edit that fixes the wording and
 *      leaves a stale 54-second estimate behind is worse than no estimate.
 *   3. The comparison is marked stale. It was computed against text that no
 *      longer exists, and a result that describes the previous draft must never
 *      be read as describing this one.
 */
export async function editScript(input: EditScriptInput) {
  const s = getSupabaseAdminClient();
  const brief = await loadBrief(input.briefId);

  const { data: existing } = await s.from("ce_scripts")
    .select("id, hook, body, cta, generated_body, edited_by_owner")
    .eq("brief_id", input.briefId).eq("reading_level", input.readingLevel).maybeSingle();
  if (!existing) throw new ScriptBuilderError(`No ${input.readingLevel} script to edit.`, 404);

  const cur = existing as {
    id: string; hook: string | null; body: string; cta: string | null;
    generated_body: string | null; edited_by_owner: boolean;
  };

  const next = {
    hook: input.hook ?? cur.hook,
    body: input.body ?? cur.body,
    cta: input.cta ?? cur.cta,
  };
  if (!next.body?.trim()) {
    throw new ScriptBuilderError("A script cannot be emptied. Regenerate it instead.", 400);
  }

  const unchanged = next.hook === cur.hook && next.body === cur.body && next.cta === cur.cta;
  if (unchanged) return { changed: false };

  const measured = measureScript(next, brief.target_runtime_seconds, await wpmFor(brief.delivery_profile_id));

  const patch: Record<string, unknown> = {
    ...next, ...measured,
    edited_by_owner: true,
    edited_by: input.actor,
    edited_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  // Capture the generated original once, on the first edit only.
  if (!cur.generated_body) {
    patch.generated_hook = cur.hook;
    patch.generated_body = cur.body;
    patch.generated_cta = cur.cta;
  }

  const { error } = await s.from("ce_scripts").update(patch).eq("id", cur.id);
  if (error) throw new ScriptBuilderError(`Could not save the edit: ${error.message}`, 502);

  await s.from("ce_script_comparisons")
    .update({ stale: true, updated_at: new Date().toISOString() })
    .eq("brief_id", input.briefId);

  return { changed: true, ...measured };
}

/** Restore a script to exactly what the model produced. */
export async function revertScript(briefId: string, readingLevel: "grade5" | "higher") {
  const s = getSupabaseAdminClient();
  const brief = await loadBrief(briefId);
  const { data } = await s.from("ce_scripts")
    .select("id, generated_hook, generated_body, generated_cta")
    .eq("brief_id", briefId).eq("reading_level", readingLevel).maybeSingle();
  const g = data as { id: string; generated_hook: string | null; generated_body: string | null; generated_cta: string | null } | null;
  if (!g?.generated_body) {
    throw new ScriptBuilderError("This script has not been edited, so there is nothing to revert to.", 409);
  }
  const restored = { hook: g.generated_hook, body: g.generated_body, cta: g.generated_cta };
  const measured = measureScript(restored, brief.target_runtime_seconds, await wpmFor(brief.delivery_profile_id));

  await s.from("ce_scripts").update({
    ...restored, ...measured,
    edited_by_owner: false, edited_by: null, edited_at: null,
    generated_hook: null, generated_body: null, generated_cta: null,
    updated_at: new Date().toISOString(),
  }).eq("id", g.id);

  await s.from("ce_script_comparisons")
    .update({ stale: true, updated_at: new Date().toISOString() }).eq("brief_id", briefId);

  return measured;
}
