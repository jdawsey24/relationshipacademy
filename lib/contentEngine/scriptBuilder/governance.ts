import { getSupabaseAdminClient } from "@/lib/supabase";

// Public-use governance (owner rulings 2, 3, 4).
//
// The ONLY thing that makes a source publishable is a recorded approval of THIS
// source, for THIS use, with THIS audience. Not the framework status of the
// construct, not the editorial status of the record, and never the presence of
// text in a field.
//
// This module answers one question — may we publish from this source — and
// deliberately holds no language of its own. Consumer Translation, Public or
// Clinical Boundary, Cautions, Contraindications, Reading Level and Suppression
// or Safety Logic live in the Knowledge Base and are read from there.

export type PermittedUse =
  | "public_script" | "public_caption" | "assessment" | "academy" | "clinical" | "internal";

export type Audience = "consumer" | "academy" | "institute" | "clinical";

export interface EligibilityInput {
  sourceType: string;
  sourceId: string;
  use: PermittedUse;
  audience: Audience;
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;
  approvalId: string | null;
  approvedVersion: string | null;
  restrictions: string | null;
  reviewer: string | null;
}

const NO_APPROVAL = (sourceType: string, sourceId: string): EligibilityResult => ({
  eligible: false,
  reason:
    `No public-use approval is recorded for ${sourceType} ${sourceId}. ` +
    `Absence of an approval is not an approval — a draft may be produced for review, but not published.`,
  approvalId: null, approvedVersion: null, restrictions: null, reviewer: null,
});

/**
 * Look up whether a specific source is approved for a specific use and audience.
 *
 * A missing row is a definitive "no", not an unknown. That asymmetry is the
 * whole point: the system's default answer must be refusal, because the fields
 * that would authorise public use are exactly the ones nobody has filled in yet.
 */
export async function checkPublicUse(input: EligibilityInput): Promise<EligibilityResult> {
  const s = getSupabaseAdminClient();

  const { data, error } = await s
    .from("ce_source_use_approvals")
    .select("id, approved_source_version, approved_source_hash, expires_at, permitted_use, audience, restrictions, reviewer, status")
    .eq("source_type", input.sourceType)
    .eq("source_id", input.sourceId)
    .eq("status", "approved");

  // A failed lookup is not permission. Fail closed and say why.
  if (error) {
    return {
      ...NO_APPROVAL(input.sourceType, input.sourceId),
      reason: `Could not read public-use approvals (${error.message}). Treating as not approved.`,
    };
  }

  const rows = (data ?? []) as {
    id: string; approved_source_version: string | null; approved_source_hash: string | null;
    expires_at: string | null; permitted_use: string[];
    audience: string[]; restrictions: string | null; reviewer: string | null;
  }[];

  if (!rows.length) return NO_APPROVAL(input.sourceType, input.sourceId);

  const match = rows.find(
    (r) => (r.permitted_use ?? []).includes(input.use) && (r.audience ?? []).includes(input.audience),
  );

  if (!match) {
    const uses = [...new Set(rows.flatMap((r) => r.permitted_use ?? []))];
    const auds = [...new Set(rows.flatMap((r) => r.audience ?? []))];
    return {
      eligible: false,
      reason:
        `${input.sourceType} ${input.sourceId} is approved, but not for "${input.use}" with a "${input.audience}" ` +
        `audience. Approved uses: ${uses.join(", ") || "none"}. Approved audiences: ${auds.join(", ") || "none"}.`,
      approvalId: null, approvedVersion: null, restrictions: null, reviewer: null,
    };
  }

  // An approval that outlives the version it approved is the failure this whole
  // mechanism exists to prevent. If the source has been edited since, the
  // approval describes content that no longer exists and cannot carry forward.
  if (match.approved_source_hash) {
    const fp = await sourceFingerprint(input.sourceType, input.sourceId);
    if (fp && fp.hash !== match.approved_source_hash) {
      return {
        eligible: false,
        reason:
          `${input.sourceType} ${input.sourceId} was approved for ${input.use}, but its content has changed ` +
          `since. The approval covers a version that no longer exists and must be re-recorded against the ` +
          `current one.`,
        approvalId: null, approvedVersion: match.approved_source_version, restrictions: null,
        reviewer: match.reviewer,
      };
    }
  }

  if (match.expires_at && new Date(match.expires_at) < new Date()) {
    return {
      eligible: false,
      reason: `The approval for ${input.sourceType} ${input.sourceId} expired on ${match.expires_at.slice(0, 10)} and needs re-review.`,
      approvalId: null, approvedVersion: match.approved_source_version, restrictions: null,
      reviewer: match.reviewer,
    };
  }

  return {
    eligible: true,
    reason: `Approved for ${input.use} with a ${input.audience} audience.`,
    approvalId: match.id,
    approvedVersion: match.approved_source_version,
    restrictions: match.restrictions,
    reviewer: match.reviewer,
  };
}

/**
 * The audience a platform reaches. Public platforms are consumer-facing, so a
 * source approved only for clinical or academy audiences cannot be published to
 * them regardless of how the brief is configured.
 */
export function audienceForPlatform(platform: string): Audience {
  switch (platform) {
    case "academy": return "academy";
    case "institute": return "institute";
    default: return "consumer";
  }
}

// ---------------------------------------------------------------------------
// Recording an approval
// ---------------------------------------------------------------------------

export const PERMITTED_USES: PermittedUse[] =
  ["public_script", "public_caption", "assessment", "academy", "clinical", "internal"];
export const AUDIENCES: Audience[] = ["consumer", "academy", "institute", "clinical"];

/**
 * A stable fingerprint of the source's approved consumer-facing content.
 *
 * This is what makes an approval mean something specific. Ruling 2 is that the
 * approvals table records WHICH APPROVED VERSION was approved, never the
 * language itself — so an approval has to be bound to a version, or it is a
 * blank cheque that survives any later edit to the thing it approved.
 *
 * Hashing only the consumer-facing fields is deliberate: an edit to clinical
 * notes should not invalidate a public-use approval, because those were never
 * part of what was approved.
 */
export async function sourceFingerprint(
  sourceType: string,
  sourceId: string,
): Promise<{ hash: string; version: string | null; snapshot: Record<string, unknown> } | null> {
  const s = getSupabaseAdminClient();
  const { createHash } = await import("node:crypto");

  let snapshot: Record<string, unknown> | null = null;
  let version: string | null = null;

  if (sourceType === "competency") {
    const [{ data: fw }, { data: kb }] = await Promise.all([
      s.from("fw_competencies")
        .select("competency_id, name, phase, domain, developmental_task, framework_status")
        .eq("competency_id", sourceId).maybeSingle(),
      s.from("kb_competencies").select("code, status, detail")
        .eq("code", sourceId).eq("kind", "competency").maybeSingle(),
    ]);
    if (!fw) return null;
    const { pickConsumerSafeDetail } = await import("@/lib/contentEngine/retrieval");
    snapshot = {
      ...(fw as unknown as Record<string, unknown>),
      source_status: (kb as { status?: string } | null)?.status ?? null,
      // Consumer-safe projection only — the same allowlist a brief reads.
      detail: pickConsumerSafeDetail((kb as { detail?: unknown } | null)?.detail),
    };
  } else if (sourceType === "phase" || sourceType === "phase_narrative") {
    const { data } = await s.from("kb_phase_narratives")
      .select("phase, consumer_phase_name, public_descriptor, core_human_question, core_tension, " +
              "governing_narrative_truths, safety_boundaries, public_or_clinical_boundary, " +
              "reading_level, approved_language, prohibited_reductions, record_status, source_version")
      .eq("phase", sourceId).maybeSingle();
    if (!data) return null;
    snapshot = data as unknown as Record<string, unknown>;
    version = (data as { source_version?: string | null }).source_version ?? null;
  } else {
    // Unknown source type: refuse rather than hash nothing and call it a version.
    return null;
  }

  const hash = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex").slice(0, 32);
  return { hash, version, snapshot };
}

export interface RecordApprovalInput {
  sourceType: string;
  sourceId: string;
  permittedUse: PermittedUse[];
  audience: Audience[];
  reviewer: string;
  restrictions?: string | null;
  notes?: string | null;
  /** Optional re-review date. */
  expiresAt?: string | null;
}

export class ApprovalError extends Error {
  constructor(message: string, public status = 400) { super(message); this.name = "ApprovalError"; }
}

/**
 * Record that a specific source is approved for specific uses with specific
 * audiences, as of its current content.
 *
 * The reviewer is required and stored. An approval with no named reviewer is not
 * an approval — it is an assertion that someone, at some point, probably looked.
 */
export async function recordPublicUseApproval(input: RecordApprovalInput) {
  const s = getSupabaseAdminClient();

  if (!input.reviewer?.trim()) throw new ApprovalError("An approval needs a named reviewer.");
  if (!input.permittedUse?.length) throw new ApprovalError("Choose at least one permitted use.");
  if (!input.audience?.length) throw new ApprovalError("Choose at least one audience.");

  const badUse = input.permittedUse.filter((u) => !PERMITTED_USES.includes(u));
  if (badUse.length) throw new ApprovalError(`Unknown permitted use: ${badUse.join(", ")}`);
  const badAud = input.audience.filter((a) => !AUDIENCES.includes(a));
  if (badAud.length) throw new ApprovalError(`Unknown audience: ${badAud.join(", ")}`);

  const fp = await sourceFingerprint(input.sourceType, input.sourceId);
  if (!fp) {
    throw new ApprovalError(
      `${input.sourceType} "${input.sourceId}" was not found, so there is nothing to approve.`, 404,
    );
  }

  // The unique index is (source_type, source_id, status), so re-approving a
  // source updates its single approved row rather than accumulating history in
  // a table that is meant to answer "is this approved right now".
  const row = {
    source_type: input.sourceType,
    source_id: input.sourceId,
    approved_source_version: fp.version,
    approved_source_hash: fp.hash,
    permitted_use: input.permittedUse,
    audience: input.audience,
    restrictions: input.restrictions?.trim() || null,
    reviewer: input.reviewer.trim(),
    reviewed_at: new Date().toISOString(),
    expires_at: input.expiresAt || null,
    status: "approved",
    provenance_snapshot: fp.snapshot,
    notes: input.notes?.trim() || null,
  };

  const { data, error } = await s.from("ce_source_use_approvals")
    .upsert(row, { onConflict: "source_type,source_id,status" })
    .select("id, approved_source_hash").maybeSingle();
  if (error) throw new ApprovalError(`Could not record the approval: ${error.message}`, 502);

  return { id: (data as { id: string }).id, hash: fp.hash };
}

/** Withdraw an approval. The source becomes unpublishable immediately. */
export async function revokePublicUseApproval(sourceType: string, sourceId: string, reviewer: string) {
  const s = getSupabaseAdminClient();
  // A prior revoked row would collide with the unique index; clear it first.
  await s.from("ce_source_use_approvals")
    .delete().eq("source_type", sourceType).eq("source_id", sourceId).eq("status", "revoked");

  const { data, error } = await s.from("ce_source_use_approvals")
    .update({ status: "revoked", reviewer, reviewed_at: new Date().toISOString() })
    .eq("source_type", sourceType).eq("source_id", sourceId).eq("status", "approved")
    .select("id").maybeSingle();
  if (error) throw new ApprovalError(`Could not revoke: ${error.message}`, 502);
  if (!data) throw new ApprovalError("There is no approval to revoke.", 404);
  return { id: (data as { id: string }).id };
}
