import { getSupabaseAdminClient } from "@/lib/supabase";
import { validateMapping } from "@/lib/contentEngine/mappingValidation";

// Lenses — the framework, described in a sentence.
//
// THE LIFECYCLE, and where approved data begins:
//
//   candidate → suggested → selected → validated for this content
//             → draft-specific bridge → final mapping snapshot
//
//   approved for reusable application   ← SEPARATE, OPTIONAL. Not the end of the
//                                         line. Most draft bridges never take it
//                                         and none needs to.
//
// Stages 1–3 live in ci_lens_options and cost nothing to undo.
// ce_relational_bridges is not touched until a lens is selected AND validates,
// and the bridge it creates is `draft` — usable for this piece of content only.

export const LIFECYCLE = [
  "candidate", "suggested", "selected",
  "validated_for_this_content", "draft_specific_bridge", "final_mapping_snapshot",
] as const;

/** Deliberately not in LIFECYCLE. It is a branch, not a stage. */
export const OPTIONAL_GOVERNANCE_ACTION = "approved_for_reusable_application";

export interface LensOption {
  id: string;
  competency_id: string | null;
  plain_summary: string;
  status: string;
  strength: string | null;
  relation: string | null;
  mapping_valid: boolean;
  source_approval_state: string | null;
  source_version_label: string | null;
}

/**
 * Record proposed lenses. Nothing here is approved mapping data — the bridge
 * table is untouched.
 *
 * Each option carries the approval state of the narrative record behind it, so
 * the conversation can mention provisional material once, when it matters,
 * rather than badging every message.
 */
export async function recordSuggestions(
  conversationId: string,
  options: {
    competency_id: string;
    phase_id: string | null;
    domain_id: string | null;
    plain_summary: string;
    why_it_fits?: string;
    what_it_illuminates?: string;
    how_it_changes_the_lesson?: string;
    strength?: string;
    relation?: "direct_application" | "related_lens";
  }[],
) {
  const s = getSupabaseAdminClient();
  const rows = [];

  for (const o of options) {
    const mapping = await validateMapping({
      competency_id: o.competency_id, phase_id: o.phase_id, domain_id: o.domain_id,
    });
    const { data: kb } = await s.from("kb_competencies")
      .select("framework_approval_state, source_version_label")
      .eq("code", o.competency_id).eq("kind", "competency").maybeSingle();
    const src = kb as { framework_approval_state: string; source_version_label: string | null } | null;

    rows.push({
      conversation_id: conversationId,
      competency_id: o.competency_id,
      phase_id: mapping.resolved.phase_id, domain_id: mapping.resolved.domain_id,
      status: "suggested",
      strength: o.strength ?? null,
      relation: o.relation ?? null,
      plain_summary: o.plain_summary,
      why_it_fits: o.why_it_fits ?? null,
      what_it_illuminates: o.what_it_illuminates ?? null,
      how_it_changes_the_lesson: o.how_it_changes_the_lesson ?? null,
      mapping_valid: mapping.valid,
      mapping_errors: mapping.errors,
      source_approval_state: src?.framework_approval_state ?? "unverified",
      source_version_label: src?.source_version_label ?? null,
    });
  }

  const { data } = await s.from("ci_lens_options").insert(rows).select("*");
  return (data ?? []) as unknown as LensOption[];
}

export class LensError extends Error {
  constructor(message: string, public status = 400) { super(message); this.name = "LensError"; }
}

/**
 * Select a lens and, if it validates, create the DRAFT-SPECIFIC bridge.
 *
 * The bridge is `lifecycle_state='draft'`. It is not reusable, and validating it
 * for this piece of content does not promote it. Reusable approval is a separate
 * action the owner takes deliberately, and most bridges never take it.
 *
 * A rejection needs no reason. One is stored when given.
 */
export async function selectLens(input: {
  conversationId: string;
  lensId: string;
  candidateId?: string | null;
  actor: string | null;
}) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ci_lens_options").select("*")
    .eq("id", input.lensId).eq("conversation_id", input.conversationId).maybeSingle();
  const lens = data as Record<string, unknown> | null;
  if (!lens) throw new LensError("That option is no longer available.", 404);

  await s.from("ci_lens_options").update({ status: "selected", updated_at: new Date().toISOString() })
    .eq("id", input.lensId);

  if (lens.mapping_valid !== true) {
    // Selected but not validated. No bridge, and the conversation says why in
    // plain language rather than showing an error.
    return { selected: true, validated: false, bridgeId: null as string | null,
             reason: (lens.mapping_errors as string[] ?? []).join(" ") };
  }

  // Provisional material may be explored, but it cannot become a validated
  // mapping. Refined Option C, enforced here rather than only in the interface.
  if (lens.source_approval_state !== "approved" && lens.source_approval_state !== "draft") {
    return {
      selected: true, validated: false, bridgeId: null,
      reason:
        "That material is still a working draft that hasn't been approved, so it can't become a " +
        "framework mapping yet. We can keep using it to think with.",
    };
  }

  const { data: bridge, error } = await s.from("ce_relational_bridges").insert({
    candidate_id: input.candidateId ?? null,
    bridge_type: "direct",
    competency_id: lens.competency_id,
    phase_id: lens.phase_id,
    domain_id: lens.domain_id,
    rationale: lens.why_it_fits ?? lens.plain_summary,
    angle: lens.how_it_changes_the_lesson ?? null,
    status: (lens.strength as string) ?? "moderate",
    mapping_valid: true,
    eligible_for_generation: true,
    // Draft-specific. Validation for one piece of content is not approval.
    lifecycle_state: "validated_for_current_content",
    decision: "accepted",
  }).select("id").maybeSingle();

  if (error) throw new LensError(`Could not record the mapping: ${error.message}`, 502);
  const bridgeId = (bridge as { id: string }).id;

  await s.from("ci_lens_options")
    .update({ promoted_bridge_id: bridgeId }).eq("id", input.lensId);

  return { selected: true, validated: true, bridgeId, reason: null as string | null };
}

/** Rejection. No reason required — one is kept if offered. */
export async function rejectLens(conversationId: string, lensId: string, reason?: string) {
  const s = getSupabaseAdminClient();
  await s.from("ci_lens_options").update({
    status: "rejected",
    owner_reason: reason?.trim() || null,
    updated_at: new Date().toISOString(),
  }).eq("id", lensId).eq("conversation_id", conversationId);
}

/**
 * Promote a draft bridge to reusable. Separate, optional, deliberate — and
 * refused for anything resting on unapproved source material.
 */
export async function approveForReuse(bridgeId: string, actor: string) {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ce_relational_bridges")
    .select("id, competency_id, lifecycle_state, mapping_valid").eq("id", bridgeId).maybeSingle();
  const b = data as { competency_id: string; lifecycle_state: string; mapping_valid: boolean } | null;
  if (!b) throw new LensError("No such mapping.", 404);
  if (!b.mapping_valid) throw new LensError("An unvalidated mapping cannot be approved for reuse.", 409);

  const { data: kb } = await s.from("kb_competencies")
    .select("framework_approval_state").eq("code", b.competency_id).eq("kind", "competency").maybeSingle();
  const state = (kb as { framework_approval_state: string } | null)?.framework_approval_state;
  if (state !== "approved" && state !== "draft") {
    throw new LensError(
      "This rests on source material that is still in review, so it cannot become a reusable mapping.",
      409,
    );
  }

  await s.from("ce_relational_bridges")
    .update({ lifecycle_state: "owner_approved", decided_by: actor, decided_at: new Date().toISOString() })
    .eq("id", bridgeId);
  await s.from("ai_approval_events").insert({
    draft_type: "relational_bridge", draft_id: bridgeId, action: "approve", actor_id: actor,
    prior_status: b.lifecycle_state, new_status: "owner_approved",
    notes: "Approved for reusable application. Separate from validation for a single piece of content.",
  });
}

/**
 * One plain-language notice, only when the chosen direction materially depends
 * on working material. Not a badge on every message.
 */
export function provisionalNotice(lens: LensOption): string | null {
  if (lens.source_approval_state === "approved" || lens.source_approval_state === "draft") return null;
  return (
    "Worth knowing: this material is still a working draft you haven't approved. " +
    "Good for thinking with — I wouldn't publish a framework claim on it yet."
  );
}
