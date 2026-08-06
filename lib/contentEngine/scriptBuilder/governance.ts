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
    .select("id, approved_source_version, permitted_use, audience, restrictions, reviewer, status")
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
    id: string; approved_source_version: string | null; permitted_use: string[];
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
