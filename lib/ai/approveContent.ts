import { getSupabaseAdminClient } from "@/lib/supabase";
import { AiError } from "@/lib/ai/generateItem";

// Approval + promotion for staged content drafts (worksheets/lessons). On
// approval a permanent WS-######/LES-###### id is assigned and the asset enters
// the Content Library; the draft is preserved. Reject never enters the library.

type ContentDraftRow = {
  id: string; status: string; asset_type: string; competency_id: string | null;
  draft_content: Record<string, unknown>; permanent_id: string | null;
};

const TARGET: Record<string, { table: string; pk: string; prefix: string }> = {
  worksheet: { table: "studio_worksheets", pk: "worksheet_id", prefix: "WS" },
  lesson: { table: "studio_lessons", pk: "lesson_id", prefix: "LES" },
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
  const str = (k: string) => (typeof dc[k] === "string" ? (dc[k] as string) : null);
  const arr = (k: string) => (Array.isArray(dc[k]) ? (dc[k] as unknown[]) : []);

  let domain: string | null = null, phase: string | null = null;
  if (draft.competency_id) {
    const { data: c } = await s.from("kb_competencies").select("domain_slug, phase_slug").eq("code", draft.competency_id).maybeSingle();
    if (c) { domain = (c as { domain_slug: string }).domain_slug; phase = (c as { phase_slug: string }).phase_slug; }
  }
  const id = await nextCanonicalId(cfg.table, cfg.pk, cfg.prefix);
  const base: Record<string, unknown> = {
    [cfg.pk]: id, competency_id: undefined, title: str("title"), domain, phase,
    audience: str("audience") || "consumer", status: "approved", provenance: "ai_generated",
    detail: dc, updated_by: actor,
  };
  if (draft.asset_type === "worksheet") {
    base.competency_id = draft.competency_id;
    base.purpose = str("purpose");
  } else {
    delete base.competency_id;
    base.competency_ids = draft.competency_id;
    base.learning_objective = arr("learning_objectives").map((x) => String(x)).join("; ") || str("overview");
    base.content_type = "Lesson";
  }
  const { error } = await s.from(cfg.table).insert(base);
  if (error) { console.error("[ai.approveContent] insert failed:", error.message); throw new AiError(`Failed to add the approved ${draft.asset_type} to the Content Library: ${error.message}`, 502); }

  await s.from("ai_content_drafts").update({ status: "approved", permanent_id: id, approved_by: actor, approved_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", draft.id);
  return id;
}
