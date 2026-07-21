import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import {
  type ContentStatus, type ContentAction, canTransition, nextStatus, isEditable,
  BLOCK_TYPE_SET,
} from "@/lib/companion";

// Server-only. Governed authoring for Companion experiences — mirrors the Studio
// workflow (re-read DB status, re-check role, owner-only advance/publish, immutable
// versions, append-only review log + global audit). Owner CMS only.

export class CompanionCmsError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

interface ExperienceRow {
  id: string; slug: string; title: string; status: ContentStatus;
  current_version: number; published_version: number | null;
}

async function mustGet(id: string): Promise<ExperienceRow> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("companion_experiences").select("id, slug, title, status, current_version, published_version").eq("id", id).maybeSingle();
  if (!data) throw new CompanionCmsError("Experience not found.", 404);
  return data as ExperienceRow;
}

async function logReview(experienceId: string, action: string, from: string | null, to: string | null, actor: string | null, note?: string | null) {
  const s = getSupabaseAdminClient();
  await s.from("companion_content_reviews").insert({ experience_id: experienceId, actor, action, from_status: from, to_status: to, note: note ?? null });
}

// ---------------------------------------------------------------------------
// Create / edit metadata
// ---------------------------------------------------------------------------
export async function createExperience(input: { title: string; consumer_title?: string; mode?: string; actor: string | null }): Promise<ExperienceRow> {
  const s = getSupabaseAdminClient();
  const title = input.title.trim();
  if (!title) throw new CompanionCmsError("A title is required.");
  const { data, error } = await s.from("companion_experiences").insert({
    title, slug: slugify(title), consumer_title: input.consumer_title ?? null,
    mode: input.mode === "free" ? "free" : "guided", status: "draft", current_version: 1, owner: input.actor,
  }).select("id, slug, title, status, current_version, published_version").maybeSingle();
  if (error || !data) throw new CompanionCmsError("Failed to create the experience.", 502);
  await logReview((data as ExperienceRow).id, "create", null, "draft", input.actor);
  await audit({ actor: input.actor, action: "companion.experience.create", target: (data as ExperienceRow).id, metadata: { title } });
  return data as ExperienceRow;
}

const META_FIELDS = new Set([
  "title", "consumer_title", "short_description", "est_minutes", "mode", "structural_context", "phase",
  "developmental_task", "domain", "competency", "situation_category", "consumer_topic", "playbook_connection",
  "academy_lesson_connection", "recommended_practice", "safety_classification", "reading_level", "audience",
  "canonical_source_ref", "decision_log_ref", "internal_notes", "reviewer",
]);

export async function updateExperienceMeta(id: string, patch: Record<string, unknown>, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const obj = await mustGet(id);
  if (!isEditable(obj.status)) throw new CompanionCmsError(`This experience is ${obj.status.replace(/_/g, " ")} and can't be edited. Revise it first.`);
  const meta: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) if (META_FIELDS.has(k)) meta[k] = v;
  if ("title" in meta) meta.slug = slugify(String(meta.title));
  // Link to a registry situation (0046): derive experience_type_id from it.
  if ("situation_id" in patch) {
    const sid = patch.situation_id ? String(patch.situation_id) : null;
    meta.situation_id = sid;
    if (sid) {
      const { data: sit } = await s.from("reg_situations").select("primary_experience_type_id").eq("situation_id", sid).maybeSingle();
      meta.experience_type_id = (sit as { primary_experience_type_id?: string } | null)?.primary_experience_type_id ?? null;
    } else {
      meta.experience_type_id = null;
    }
  }
  const { error } = await s.from("companion_experiences").update(meta).eq("id", id);
  if (error) throw new CompanionCmsError("Failed to save.", 502);
  await audit({ actor, action: "companion.experience.update", target: id, metadata: { fields: Object.keys(meta) } });
}

// ---------------------------------------------------------------------------
// Block operations (editable only while Draft)
// ---------------------------------------------------------------------------
async function assertEditable(id: string) {
  const obj = await mustGet(id);
  if (!isEditable(obj.status)) throw new CompanionCmsError(`This experience is ${obj.status.replace(/_/g, " ")} and its blocks can't be edited. Revise it first.`);
  return obj;
}

export async function addBlock(experienceId: string, blockType: string, actor: string | null): Promise<void> {
  if (!BLOCK_TYPE_SET.has(blockType)) throw new CompanionCmsError("Unknown block type.");
  await assertEditable(experienceId);
  const s = getSupabaseAdminClient();
  const { data: last } = await s.from("companion_experience_blocks").select("block_order").eq("experience_id", experienceId).order("block_order", { ascending: false }).limit(1).maybeSingle();
  const order = ((last as { block_order?: number } | null)?.block_order ?? -1) + 1;
  // Payload is a labeled PLACEHOLDER — never final content.
  await s.from("companion_experience_blocks").insert({ experience_id: experienceId, block_type: blockType, block_order: order, payload: { placeholder: "[GUIDED REFLECTION PROMPT TO BE PROVIDED]" } });
  await audit({ actor, action: "companion.block.add", target: experienceId, metadata: { blockType } });
}

export async function updateBlock(blockId: string, patch: { payload?: unknown; conditional_on?: unknown }, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: blk } = await s.from("companion_experience_blocks").select("experience_id").eq("id", blockId).maybeSingle();
  if (!blk) throw new CompanionCmsError("Block not found.", 404);
  await assertEditable((blk as { experience_id: string }).experience_id);
  const meta: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.payload !== undefined) meta.payload = patch.payload;
  if (patch.conditional_on !== undefined) meta.conditional_on = patch.conditional_on;
  await s.from("companion_experience_blocks").update(meta).eq("id", blockId);
  await audit({ actor, action: "companion.block.update", target: blockId, metadata: {} });
}

export async function deleteBlock(blockId: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: blk } = await s.from("companion_experience_blocks").select("experience_id").eq("id", blockId).maybeSingle();
  if (!blk) throw new CompanionCmsError("Block not found.", 404);
  await assertEditable((blk as { experience_id: string }).experience_id);
  await s.from("companion_experience_blocks").delete().eq("id", blockId);
  await audit({ actor, action: "companion.block.delete", target: blockId, metadata: {} });
}

export async function duplicateBlock(blockId: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data: blk } = await s.from("companion_experience_blocks").select("*").eq("id", blockId).maybeSingle();
  if (!blk) throw new CompanionCmsError("Block not found.", 404);
  const b = blk as Record<string, unknown>;
  await assertEditable(b.experience_id as string);
  await s.from("companion_experience_blocks").insert({
    experience_id: b.experience_id, block_type: b.block_type, block_order: (b.block_order as number) + 1,
    payload: b.payload, conditional_on: b.conditional_on ?? null,
  });
  await audit({ actor, action: "companion.block.duplicate", target: blockId, metadata: {} });
}

export async function reorderBlocks(experienceId: string, orderedIds: string[], actor: string | null): Promise<void> {
  await assertEditable(experienceId);
  const s = getSupabaseAdminClient();
  await Promise.all(orderedIds.map((id, i) => s.from("companion_experience_blocks").update({ block_order: i }).eq("id", id).eq("experience_id", experienceId)));
  await audit({ actor, action: "companion.block.reorder", target: experienceId, metadata: { count: orderedIds.length } });
}

// ---------------------------------------------------------------------------
// Workflow transition (+ publish snapshots blocks into an immutable version)
// ---------------------------------------------------------------------------
export async function transitionExperience(id: string, action: ContentAction, opts: { actor: string | null; isOwner: boolean; note?: string | null }): Promise<ContentStatus> {
  const s = getSupabaseAdminClient();
  const obj = await mustGet(id); // re-read DB status; never trust client
  if (!canTransition(obj.status, action, opts.isOwner)) {
    throw new CompanionCmsError(`Can't ${action.replace(/_/g, " ")} from ${obj.status}.`, 403);
  }
  const to = nextStatus(obj.status, action)!;
  const update: Record<string, unknown> = { status: to, updated_at: new Date().toISOString() };

  if (action === "publish") {
    // Snapshot current draft blocks into a new immutable version.
    const { data: blocks } = await s.from("companion_experience_blocks").select("block_type, block_order, payload, conditional_on").eq("experience_id", id).order("block_order");
    const snapshot = ((blocks ?? []) as Record<string, unknown>[]).map((b) => ({
      type: b.block_type, order: b.block_order, payload: b.payload, conditional_on: b.conditional_on ?? null,
    }));
    const versionNo = (obj.published_version ?? 0) + 1;
    const { error: vErr } = await s.from("companion_experience_versions").insert({ experience_id: id, version_no: versionNo, blocks: snapshot, authored_by: opts.actor });
    if (vErr) throw new CompanionCmsError("Failed to snapshot the version.", 502);
    update.published_version = versionNo;
    update.current_version = versionNo + 1;
  }
  const { error } = await s.from("companion_experiences").update(update).eq("id", id);
  if (error) throw new CompanionCmsError("Transition failed.", 502);
  await logReview(id, action, obj.status, to, opts.actor, opts.note);
  await audit({ actor: opts.actor, action: `companion.experience.${action}`, target: id, metadata: { from: obj.status, to } });
  return to;
}
