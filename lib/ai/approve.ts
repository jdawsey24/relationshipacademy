import { getSupabaseAdminClient } from "@/lib/supabase";
import { AiError } from "@/lib/ai/generateItem";

// Approval + promotion for staged item drafts. On approval an item receives its
// PERMANENT ASM-###### id and enters the canonical Item Bank; the draft is
// preserved. Rejected/other transitions never enter the bank. Every change is
// logged to ai_approval_events.

type ItemDraftRow = {
  id: string; status: string; competency_id: string | null; behavioral_indicator_id: string | null;
  item_type: string | null; item_text: string | null; response_model_id: string | null;
  reverse_candidate: boolean; reading_level: string | null; face_validity_rationale: string | null;
  permanent_item_id: string | null;
};

async function getDraft(id: string): Promise<ItemDraftRow> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ai_item_drafts").select("*").eq("id", id).maybeSingle();
  if (!data) throw new AiError("Draft not found.", 404);
  return data as ItemDraftRow;
}

async function logEvent(draftId: string, action: string, actor: string | null, prior: string, next: string, notes: string | null) {
  const s = getSupabaseAdminClient();
  await s.from("ai_approval_events").insert({ draft_type: "item", draft_id: draftId, action, actor_id: actor, prior_status: prior, new_status: next, notes });
}

// Next permanent ASM-###### id (max numeric ASM id + 1).
async function nextItemId(): Promise<string> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("studio_assessment_items").select("item_id").ilike("item_id", "ASM-%").limit(5000);
  let max = 0;
  for (const r of data ?? []) {
    const m = /^ASM-(\d{6})$/.exec((r as { item_id: string }).item_id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `ASM-${String(max + 1).padStart(6, "0")}`;
}

export type ItemTransition = "submit_for_review" | "approve" | "reject" | "request_changes" | "retire";

const NEXT: Record<ItemTransition, string> = {
  submit_for_review: "in_review", approve: "approved", reject: "rejected", request_changes: "changes_requested", retire: "retired",
};

export async function transitionItemDraft(draftId: string, action: ItemTransition, opts: { actor: string | null; notes?: string | null }): Promise<{ status: string; permanent_item_id?: string }> {
  const s = getSupabaseAdminClient();
  const draft = await getDraft(draftId);
  const prior = draft.status;
  if (["approved", "published", "rejected", "retired"].includes(prior) && action !== "retire") {
    throw new AiError(`This draft is ${prior.replace("_", " ")} and can't be ${action.replace(/_/g, " ")}.`);
  }

  if (action === "approve") {
    const promoted = await promoteToBank(draft, opts.actor);
    await logEvent(draftId, action, opts.actor, prior, "approved", opts.notes ?? null);
    return { status: "approved", permanent_item_id: promoted };
  }

  const next = NEXT[action];
  await s.from("ai_item_drafts").update({ status: next, reviewer_id: opts.actor, reviewer_notes: opts.notes ?? null, updated_at: new Date().toISOString() }).eq("id", draftId);
  await logEvent(draftId, action, opts.actor, prior, next, opts.notes ?? null);
  return { status: next };
}

async function promoteToBank(draft: ItemDraftRow, actor: string | null): Promise<string> {
  const s = getSupabaseAdminClient();
  if (draft.permanent_item_id) return draft.permanent_item_id; // idempotent
  if (!draft.item_text) throw new AiError("Draft has no item text.");

  // Competency context for domain/phase/name.
  let competency: string | null = null, domain: string | null = null, phase: string | null = null;
  if (draft.competency_id) {
    const { data: c } = await s.from("kb_competencies").select("name, domain_slug, phase_slug").eq("code", draft.competency_id).maybeSingle();
    if (c) { competency = (c as { name: string }).name; domain = (c as { domain_slug: string }).domain_slug; phase = (c as { phase_slug: string }).phase_slug; }
  }

  const itemId = await nextItemId();
  const { error } = await s.from("studio_assessment_items").insert({
    item_id: itemId,
    competency_id: draft.competency_id,
    competency,
    domain,
    phase,
    behavior_id: draft.behavioral_indicator_id,
    item_text: draft.item_text,
    item_type: draft.item_type,
    reverse_scored: draft.reverse_candidate,
    scoring_direction: draft.reverse_candidate ? "reverse" : "forward",
    response_model: draft.response_model_id,
    reading_level: draft.reading_level,
    audience: "consumer",
    face_validity_notes: draft.face_validity_rationale,
    status: "approved",
    provenance: "ai_generated",
    updated_by: actor,
  });
  if (error) throw new AiError("Failed to add the approved item to the Item Bank.", 502);

  await s.from("ai_item_drafts").update({
    status: "approved", permanent_item_id: itemId, approved_by: actor, approved_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  }).eq("id", draft.id);
  return itemId;
}
