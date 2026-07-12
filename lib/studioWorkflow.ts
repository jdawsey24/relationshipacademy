import { getSupabaseAdminClient } from "@/lib/supabase";
import {
  canTransition,
  isEditable,
  nextStatus,
  slugify,
  type Audience,
  type ObjectType,
  type Provenance,
  type StudioObject,
  type StudioRole,
  type StudioStatus,
} from "@/lib/studio";

// Server-only lifecycle engine for the Studio. Every state change flows through
// here so versioning, the review log, and (on publish) the projection into the
// live canonical tables stay consistent. Throws StudioError on any rule
// violation; API routes translate that into an HTTP response.

export class StudioError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Per-type PUBLISHERS. A publisher projects an approved version's body into its
// live canonical table, preserving the row id via canonical_ref so existing RLC
// IDs/relationships are never duplicated. Phase A ships the article publisher;
// other types are authored/versioned/reviewed now and gain publishers in later
// phases (keep PUBLISHABLE_TYPES in lib/studio.ts in sync).
// ---------------------------------------------------------------------------
type Publisher = {
  publish: (object: StudioObject, body: Record<string, unknown>, actor: string | null) => Promise<{ table: string; id: string }>;
  unpublish: (object: StudioObject, actor: string | null) => Promise<void>;
};

function str(body: Record<string, unknown>, key: string): string | null {
  const v = body[key];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

const articlePublisher: Publisher = {
  async publish(object, body, actor) {
    const s = getSupabaseAdminClient();
    const content = str(body, "content");
    if (!content) throw new StudioError("An article needs body content before it can be published.");
    const row: Record<string, unknown> = {
      title: object.title,
      slug: object.slug || slugify(object.title),
      summary: object.summary,
      content,
      category: str(body, "category"),
      featured_image_url: str(body, "featured_image_url"),
      author: str(body, "author"),
      tags: str(body, "tags"),
      related_phase_slug: str(body, "related_phase_slug"),
      cta_text: str(body, "cta_text"),
      cta_url: str(body, "cta_url"),
      seo_title: str(body, "seo_title"),
      seo_description: str(body, "seo_description"),
      status: "published",
      publish_date: str(body, "publish_date") || new Date().toISOString().slice(0, 10),
      updated_by: actor,
    };
    const ref = object.canonical_ref;
    if (ref?.table === "articles" && ref.id) {
      const { error } = await s.from("articles").update(row).eq("id", ref.id);
      if (error) throw new StudioError(mapDbError(error.message), 502);
      return { table: "articles", id: ref.id };
    }
    const { data, error } = await s
      .from("articles")
      .insert({ ...row, created_by: actor })
      .select("id")
      .maybeSingle();
    if (error) throw new StudioError(mapDbError(error.message), 502);
    return { table: "articles", id: (data as { id: string }).id };
  },
  async unpublish(object, actor) {
    const ref = object.canonical_ref;
    if (ref?.table === "articles" && ref.id) {
      const s = getSupabaseAdminClient();
      // Take it off the public surface without deleting the row (IDs preserved).
      await s.from("articles").update({ status: "draft", updated_by: actor }).eq("id", ref.id);
    }
  },
};

const PUBLISHERS: Partial<Record<ObjectType, Publisher>> = {
  article: articlePublisher,
};

function mapDbError(message: string): string {
  if (message.includes("duplicate")) return "That slug is already in use by another item.";
  return "The database rejected the change.";
}

// ---------------------------------------------------------------------------
// Create / edit
// ---------------------------------------------------------------------------
export interface CreateInput {
  object_type: ObjectType;
  audience: Audience;
  title: string;
  slug?: string;
  summary?: string;
  provenance?: Provenance;
  kb_refs?: string[];
  body?: Record<string, unknown>;
  actor: string | null;
  note?: string;
}

export async function createObject(input: CreateInput): Promise<StudioObject> {
  const s = getSupabaseAdminClient();
  const title = input.title.trim();
  if (!title) throw new StudioError("A title is required.");
  const provenance = input.provenance ?? "human";
  const { data: object, error } = await s
    .from("studio_objects")
    .insert({
      object_type: input.object_type,
      audience: input.audience,
      title,
      slug: input.slug ? slugify(input.slug) : slugify(title),
      status: "draft", // ALWAYS draft on create — AI generation uses this path too.
      provenance,
      current_version: 1,
      kb_refs: input.kb_refs ?? [],
      summary: input.summary ?? null,
      created_by: input.actor,
      updated_by: input.actor,
    })
    .select("*")
    .maybeSingle();
  if (error || !object) throw new StudioError("Failed to create the draft.", 502);
  const obj = object as StudioObject;

  await s.from("studio_versions").insert({
    object_id: obj.id,
    version_no: 1,
    body: input.body ?? {},
    provenance,
    status_at: "draft",
    authored_by: input.actor,
    note: input.note ?? null,
  });
  await logReview(obj.id, 1, provenance === "human" ? "create" : "ai_generate", input.actor, input.note ?? null);
  return obj;
}

export interface SaveDraftInput {
  title?: string;
  slug?: string;
  summary?: string;
  audience?: Audience;
  kb_refs?: string[];
  body?: Record<string, unknown>;
  actor: string | null;
  note?: string;
}

export async function saveDraft(objectId: string, input: SaveDraftInput): Promise<StudioObject> {
  const s = getSupabaseAdminClient();
  const object = await mustGet(objectId);
  if (!isEditable(object.status)) {
    throw new StudioError(`This item is ${object.status.replace("_", " ")} and can't be edited. Request changes or restore a version first.`);
  }

  const nextVersion = object.current_version + 1;
  const meta: Record<string, unknown> = { updated_by: input.actor, current_version: nextVersion };
  if (input.title !== undefined) meta.title = input.title.trim();
  if (input.slug !== undefined) meta.slug = slugify(input.slug);
  if (input.summary !== undefined) meta.summary = input.summary;
  if (input.audience !== undefined) meta.audience = input.audience;
  if (input.kb_refs !== undefined) meta.kb_refs = input.kb_refs;

  // Snapshot the new version (carry forward the prior body if none supplied).
  let body = input.body;
  if (body === undefined) {
    const { data } = await s
      .from("studio_versions")
      .select("body")
      .eq("object_id", objectId)
      .eq("version_no", object.current_version)
      .maybeSingle();
    body = (data as { body: Record<string, unknown> } | null)?.body ?? {};
  }
  await s.from("studio_versions").insert({
    object_id: objectId,
    version_no: nextVersion,
    body,
    provenance: object.provenance === "ai_generated" ? "ai_assisted" : object.provenance,
    status_at: object.status,
    authored_by: input.actor,
    note: input.note ?? null,
  });
  const { data: updated, error } = await s
    .from("studio_objects")
    .update(meta)
    .eq("id", objectId)
    .select("*")
    .maybeSingle();
  if (error || !updated) throw new StudioError("Failed to save the draft.", 502);
  await logReview(objectId, nextVersion, "update", input.actor, input.note ?? null);
  return updated as StudioObject;
}

// ---------------------------------------------------------------------------
// Workflow transitions — submit / approve / request changes / publish / etc.
// ---------------------------------------------------------------------------
export type TransitionAction =
  | "submit_for_review"
  | "request_changes"
  | "approve"
  | "publish"
  | "unpublish"
  | "retire";

export async function transition(
  objectId: string,
  action: TransitionAction,
  opts: { actor: string | null; role: StudioRole; notes?: string | null }
): Promise<StudioObject> {
  const s = getSupabaseAdminClient();
  const object = await mustGet(objectId); // re-read DB status — never trust the client
  if (!canTransition(action, object.status, opts.role)) {
    throw new StudioError(
      `You can't ${action.replace(/_/g, " ")} an item that is ${object.status.replace("_", " ")}.`,
      403
    );
  }

  const target: StudioStatus = nextStatus(action);
  const patch: Record<string, unknown> = { status: target, updated_by: opts.actor };

  if (action === "publish") {
    const publisher = PUBLISHERS[object.object_type];
    if (!publisher) {
      throw new StudioError(
        `Publishing for “${object.object_type}” isn't wired up yet — it arrives in a later Studio phase. You can still draft, review, and approve it now.`
      );
    }
    const body = await currentBody(objectId, object.current_version);
    const ref = await publisher.publish(object, body, opts.actor);
    patch.canonical_ref = ref;
    patch.published_version = object.current_version;
  } else if (action === "unpublish" || action === "retire") {
    // Pull it off the live surface if it was published (never deletes the row).
    if (object.status === "published") {
      const publisher = PUBLISHERS[object.object_type];
      if (publisher) await publisher.unpublish(object, opts.actor);
    }
  }

  const { data: updated, error } = await s
    .from("studio_objects")
    .update(patch)
    .eq("id", objectId)
    .select("*")
    .maybeSingle();
  if (error || !updated) throw new StudioError("Failed to update status.", 502);
  await logReview(objectId, object.current_version, action, opts.actor, opts.notes ?? null);
  return updated as StudioObject;
}

// ---------------------------------------------------------------------------
// Restore an earlier version's body into a fresh draft version.
// ---------------------------------------------------------------------------
export async function restoreVersion(objectId: string, versionNo: number, actor: string | null): Promise<StudioObject> {
  const s = getSupabaseAdminClient();
  const object = await mustGet(objectId);
  if (!isEditable(object.status)) {
    throw new StudioError("Restore is only available while the item is a draft or has changes requested.");
  }
  const { data: src } = await s
    .from("studio_versions")
    .select("body")
    .eq("object_id", objectId)
    .eq("version_no", versionNo)
    .maybeSingle();
  if (!src) throw new StudioError("That version doesn't exist.", 404);
  const nextVersion = object.current_version + 1;
  await s.from("studio_versions").insert({
    object_id: objectId,
    version_no: nextVersion,
    body: (src as { body: Record<string, unknown> }).body,
    provenance: object.provenance,
    status_at: object.status,
    authored_by: actor,
    note: `Restored from v${versionNo}`,
  });
  const { data: updated, error } = await s
    .from("studio_objects")
    .update({ current_version: nextVersion, updated_by: actor })
    .eq("id", objectId)
    .select("*")
    .maybeSingle();
  if (error || !updated) throw new StudioError("Failed to restore.", 502);
  await logReview(objectId, nextVersion, "restore", actor, `from v${versionNo}`);
  return updated as StudioObject;
}

export async function deleteObject(objectId: string, actor: string | null): Promise<void> {
  const s = getSupabaseAdminClient();
  const object = await mustGet(objectId);
  if (object.status !== "draft" && object.status !== "retired") {
    throw new StudioError("Only draft or retired items can be deleted. Retire it first.");
  }
  await logReview(objectId, object.current_version, "delete", actor, null);
  const { error } = await s.from("studio_objects").delete().eq("id", objectId); // cascades versions + reviews
  if (error) throw new StudioError("Failed to delete.", 502);
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
async function mustGet(objectId: string): Promise<StudioObject> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("studio_objects").select("*").eq("id", objectId).maybeSingle();
  if (!data) throw new StudioError("Item not found.", 404);
  return data as StudioObject;
}

async function currentBody(objectId: string, versionNo: number): Promise<Record<string, unknown>> {
  const s = getSupabaseAdminClient();
  const { data } = await s
    .from("studio_versions")
    .select("body")
    .eq("object_id", objectId)
    .eq("version_no", versionNo)
    .maybeSingle();
  return (data as { body: Record<string, unknown> } | null)?.body ?? {};
}

async function logReview(
  objectId: string,
  versionNo: number | null,
  action: string,
  actor: string | null,
  notes: string | null
): Promise<void> {
  const s = getSupabaseAdminClient();
  await s.from("studio_reviews").insert({ object_id: objectId, version_no: versionNo, action, actor, notes });
}
