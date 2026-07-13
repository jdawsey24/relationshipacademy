import { getSupabaseAdminClient } from "@/lib/supabase";
import { AiError } from "@/lib/ai/generateItem";

// Approval + promotion for staged content drafts (worksheets/lessons). On
// approval a permanent WS-######/LES-###### id is assigned and the asset enters
// the Content Library; the draft is preserved. Reject never enters the library.

type ContentDraftRow = {
  id: string; status: string; asset_type: string; competency_id: string | null;
  draft_content: Record<string, unknown>; permanent_id: string | null;
};

const dstr = (dc: Record<string, unknown>, k: string) => (typeof dc[k] === "string" ? (dc[k] as string) : null);
const darr = (dc: Record<string, unknown>, k: string) => (Array.isArray(dc[k]) ? (dc[k] as unknown[]) : []);

// Per-type promotion into the Content Library. `extra` returns the type-specific
// columns (incl. the competency link) beyond the common ones.
const TARGET: Record<string, { table: string; pk: string; prefix: string; labelCol: string; extra: (dc: Record<string, unknown>, comp: string | null) => Record<string, unknown> }> = {
  worksheet: { table: "studio_worksheets", pk: "worksheet_id", prefix: "WS", labelCol: "title", extra: (dc, comp) => ({ competency_id: comp, purpose: dstr(dc, "purpose") }) },
  lesson: { table: "studio_lessons", pk: "lesson_id", prefix: "LES", labelCol: "title", extra: (dc, comp) => ({ competency_ids: comp, learning_objective: darr(dc, "learning_objectives").map(String).join("; ") || dstr(dc, "overview"), content_type: "Lesson" }) },
  practice: { table: "studio_practices", pk: "practice_id", prefix: "PRA", labelCol: "name", extra: (dc, comp) => ({ competency_id: comp, practice_type: dstr(dc, "practice_type") || "Guided", instructions: dstr(dc, "instructions"), reflection_prompt: dstr(dc, "reflection_prompt") }) },
  conversation_guide: { table: "studio_conversation_guides", pk: "guide_id", prefix: "CG", labelCol: "title", extra: (dc, comp) => ({ competency_id: comp, purpose: dstr(dc, "purpose") }) },
  journal_prompt: { table: "studio_journal_prompts", pk: "prompt_id", prefix: "JP", labelCol: "title", extra: (dc, comp) => ({ competency_id: comp, prompt: dstr(dc, "prompt"), use_case: dstr(dc, "use_case") }) },
  activity: { table: "studio_activities", pk: "activity_id", prefix: "ACT", labelCol: "name", extra: (dc, comp) => ({ competency_id: comp, activity_type: dstr(dc, "activity_type") || "Experiential", participant_instructions: dstr(dc, "participant_instructions") }) },
  video_outline: { table: "studio_videos", pk: "video_id", prefix: "VID", labelCol: "title", extra: (dc, comp) => ({ competency_id: comp, video_type: dstr(dc, "video_type") || "Concept Lesson", learning_objective: dstr(dc, "learning_objective") }) },
};

async function getDraft(id: string): Promise<ContentDraftRow> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ai_content_drafts").select("*").eq("id", id).maybeSingle();
  if (!data) throw new AiError("Draft not found.", 404);
  return data as ContentDraftRow;
}

async function logEvent(draftId: string, action: string, actor: string | null, prior: string, next: string, notes: string | null) {
  const s = getSupabaseAdminClient();
  await s.from("ai_approval_events").insert({ draft_type: "content", draft_id: draftId, action, actor_id: actor, prior_status: prior, new_status: next, notes });
}

// Next permanent <PREFIX>-###### id (order desc + top numeric; PostgREST caps at
// 1000 rows, so never scan-all; exclude legacy *-AI-* ids).
async function nextCanonicalId(table: string, pk: string, prefix: string): Promise<string> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from(table).select(pk).like(pk, `${prefix}-%`).not(pk, "ilike", `${prefix}-AI-%`).order(pk, { ascending: false }).limit(50);
  const re = new RegExp(`^${prefix}-(\\d{6})$`);
  let max = 0;
  for (const r of (data ?? []) as unknown[]) { const m = re.exec(String((r as Record<string, unknown>)[pk])); if (m) { max = parseInt(m[1], 10); break; } }
  return `${prefix}-${String(max + 1).padStart(6, "0")}`;
}

export type ContentTransition = "submit_for_review" | "approve" | "reject" | "request_changes" | "retire";
const NEXT: Record<ContentTransition, string> = { submit_for_review: "in_review", approve: "approved", reject: "rejected", request_changes: "changes_requested", retire: "retired" };

export async function transitionContentDraft(draftId: string, action: ContentTransition, opts: { actor: string | null; notes?: string | null }): Promise<{ status: string; permanent_id?: string }> {
  const s = getSupabaseAdminClient();
  const draft = await getDraft(draftId);
  const prior = draft.status;
  if (["approved", "published", "rejected", "retired"].includes(prior) && action !== "retire") {
    throw new AiError(`This draft is ${prior.replace("_", " ")} and can't be ${action.replace(/_/g, " ")}.`);
  }
  if (action === "approve") {
    const id = await promoteContent(draft, opts.actor);
    await logEvent(draftId, action, opts.actor, prior, "approved", opts.notes ?? null);
    return { status: "approved", permanent_id: id };
  }
  const next = NEXT[action];
  await s.from("ai_content_drafts").update({ status: next, reviewer_id: opts.actor, reviewer_notes: opts.notes ?? null, updated_at: new Date().toISOString() }).eq("id", draftId);
  await logEvent(draftId, action, opts.actor, prior, next, opts.notes ?? null);
  return { status: next };
}

async function promoteContent(draft: ContentDraftRow, actor: string | null): Promise<string> {
  const s = getSupabaseAdminClient();
  if (draft.permanent_id) return draft.permanent_id;
  const cfg = TARGET[draft.asset_type];
  if (!cfg) throw new AiError(`Cannot promote asset type "${draft.asset_type}".`);
  const dc = draft.draft_content ?? {};

  let domain: string | null = null, phase: string | null = null;
  if (draft.competency_id) {
    const { data: c } = await s.from("kb_competencies").select("domain_slug, phase_slug").eq("code", draft.competency_id).maybeSingle();
    if (c) { domain = (c as { domain_slug: string }).domain_slug; phase = (c as { phase_slug: string }).phase_slug; }
  }
  const id = await nextCanonicalId(cfg.table, cfg.pk, cfg.prefix);
  const row: Record<string, unknown> = {
    [cfg.pk]: id, [cfg.labelCol]: dstr(dc, "title"), domain, phase,
    audience: dstr(dc, "audience") || "consumer", status: "approved", provenance: "ai_generated",
    detail: dc, updated_by: actor,
    ...cfg.extra(dc, draft.competency_id),
  };
  const { error } = await s.from(cfg.table).insert(row);
  if (error) { console.error("[ai.approveContent] insert failed:", error.message); throw new AiError(`Failed to add the approved ${draft.asset_type} to the Content Library: ${error.message}`, 502); }

  await s.from("ai_content_drafts").update({ status: "approved", permanent_id: id, approved_by: actor, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", draft.id);
  return id;
}
