import { getSupabaseAdminClient } from "@/lib/supabase";
import { ScriptBuilderError } from "@/lib/contentEngine/scriptBuilder/generate";

// Stage 2 — claim verification (owner ruling 7).
//
// Nothing verified a factual claim before a script asserted it. This is the
// stage that does, and it applies to EVERY content origin including evergreen:
// the rule is that the step cannot be skipped, not that every brief has claims.
// A brief that asserts nothing is a legitimate outcome of doing the review. A
// brief that asserts nothing because nobody looked is the failure, and the two
// are indistinguishable in the data unless the review itself is recorded.

export const CLAIM_TYPES = [
  "empirical", "statistical", "medical", "legal",
  "historical", "quoted", "current_event", "interpretation",
] as const;
export type ClaimType = (typeof CLAIM_TYPES)[number];

export const CLAIM_STATUSES = ["unverified", "verified", "disputed", "withdrawn"] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const RISK_LEVELS = ["low", "medium", "high"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

/**
 * Claim types that assert something about the world and therefore need a
 * source. `interpretation` is deliberately absent: a framework reading is
 * verified by being labelled as a reading, not by a citation, and requiring a
 * source for it would push authors to dress interpretation up as evidence.
 */
export const SOURCE_REQUIRED: ClaimType[] =
  ["empirical", "statistical", "medical", "legal", "historical", "quoted", "current_event"];

/** Types where being wrong is most costly, so an unverified one always blocks. */
export const ALWAYS_BLOCKING: ClaimType[] = ["medical", "legal", "statistical"];

export interface ClaimSource {
  title?: string;
  url?: string;
  publisher?: string;
  accessed_at?: string;
}

export interface ClaimRow {
  id: string;
  brief_id: string | null;
  claim_text: string;
  claim_type: ClaimType;
  verification_status: ClaimStatus;
  sources: ClaimSource[];
  verified_by: string | null;
  verified_at: string | null;
  event_date: string | null;
  risk_level: RiskLevel;
  recheck_at: string | null;
  correction_note: string | null;
}

export async function listClaims(briefId: string): Promise<ClaimRow[]> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("ce_claims").select("*").eq("brief_id", briefId).order("created_at");
  return (data ?? []) as unknown as ClaimRow[];
}

export interface UpsertClaimInput {
  briefId: string;
  claimId?: string;
  claimText: string;
  claimType: ClaimType;
  status?: ClaimStatus;
  sources?: ClaimSource[];
  riskLevel?: RiskLevel;
  eventDate?: string | null;
  recheckAt?: string | null;
  correctionNote?: string | null;
  actor: string | null;
}

export async function upsertClaim(input: UpsertClaimInput) {
  const s = getSupabaseAdminClient();

  if (!input.claimText?.trim()) throw new ScriptBuilderError("A claim needs its text.", 400);
  if (!CLAIM_TYPES.includes(input.claimType)) {
    throw new ScriptBuilderError(`Unknown claim type "${input.claimType}".`, 400);
  }
  const status = input.status ?? "unverified";
  const sources = (input.sources ?? []).filter((x) => x?.url?.trim() || x?.title?.trim());

  if (status === "verified" && SOURCE_REQUIRED.includes(input.claimType) && !sources.length) {
    throw new ScriptBuilderError(
      `A ${input.claimType} claim cannot be marked verified with no source. ` +
      `If it is a framework reading rather than an external fact, record it as an interpretation instead.`,
      400,
    );
  }

  const row: Record<string, unknown> = {
    brief_id: input.briefId,
    claim_text: input.claimText.trim(),
    claim_type: input.claimType,
    verification_status: status,
    sources,
    risk_level: input.riskLevel ?? "medium",
    event_date: input.eventDate || null,
    recheck_at: input.recheckAt || null,
    correction_note: input.correctionNote?.trim() || null,
    // Who verified it, recorded only when it is actually verified.
    verified_by: status === "verified" ? input.actor : null,
    verified_at: status === "verified" ? new Date().toISOString() : null,
  };

  const { error } = input.claimId
    ? await s.from("ce_claims").update(row).eq("id", input.claimId).eq("brief_id", input.briefId)
    : await s.from("ce_claims").insert(row);
  if (error) throw new ScriptBuilderError(`Could not save the claim: ${error.message}`, 502);

  // Any change to the claims invalidates a previous review of them.
  await s.from("ce_content_briefs")
    .update({ claims_reviewed_at: null, claims_reviewed_by: null, updated_at: new Date().toISOString() })
    .eq("id", input.briefId);
}

export async function deleteClaim(briefId: string, claimId: string) {
  const s = getSupabaseAdminClient();
  const { error } = await s.from("ce_claims").delete().eq("id", claimId).eq("brief_id", briefId);
  if (error) throw new ScriptBuilderError(`Could not delete the claim: ${error.message}`, 502);
  await s.from("ce_content_briefs")
    .update({ claims_reviewed_at: null, claims_reviewed_by: null }).eq("id", briefId);
}

// ---------------------------------------------------------------------------
// Readiness
// ---------------------------------------------------------------------------

export interface ClaimReadiness {
  ready: boolean;
  reviewed: boolean;
  reasons: string[];
  counts: { total: number; verified: number; unverified: number; disputed: number; withdrawn: number };
  stale: ClaimRow[];
}

const isPast = (d: string | null) => !!d && new Date(d) < new Date();

/**
 * Can this brief proceed to script generation, claim-wise?
 *
 * Two independent conditions, and both are needed:
 *
 *   the review happened   — claims_reviewed_at is set. Covers the zero-claim
 *                           case, which is otherwise indistinguishable from
 *                           nobody having looked.
 *   the claims still hold — computed live, because a claim can go stale after
 *                           the review. A stored "reviewed" flag alone would
 *                           certify a state that has since changed.
 */
export async function checkClaimReadiness(briefId: string): Promise<ClaimReadiness> {
  const s = getSupabaseAdminClient();
  const [{ data: brief }, claims] = await Promise.all([
    s.from("ce_content_briefs").select("claims_reviewed_at, content_origin").eq("id", briefId).maybeSingle(),
    listClaims(briefId),
  ]);
  const b = brief as { claims_reviewed_at: string | null; content_origin: string } | null;

  const counts = {
    total: claims.length,
    verified: claims.filter((c) => c.verification_status === "verified").length,
    unverified: claims.filter((c) => c.verification_status === "unverified").length,
    disputed: claims.filter((c) => c.verification_status === "disputed").length,
    withdrawn: claims.filter((c) => c.verification_status === "withdrawn").length,
  };

  const reasons: string[] = [];
  const reviewed = !!b?.claims_reviewed_at;

  if (!reviewed) {
    reasons.push(
      counts.total === 0
        ? "The claim review has not been recorded. A brief that asserts nothing still needs the review — " +
          "otherwise \"no claims\" and \"nobody checked\" look the same."
        : "The claim review has not been recorded since the claims last changed.",
    );
  }

  for (const c of claims) {
    if (c.verification_status === "unverified") {
      reasons.push(`Unverified ${c.claim_type} claim: “${c.claim_text.slice(0, 70)}”`);
    } else if (c.verification_status === "disputed") {
      reasons.push(`Disputed claim still attached: “${c.claim_text.slice(0, 70)}”`);
    }
  }

  const stale = claims.filter(
    (c) => c.verification_status === "verified" && isPast(c.recheck_at),
  );
  for (const c of stale) {
    reasons.push(`Verified claim is past its recheck date (${c.recheck_at}): “${c.claim_text.slice(0, 60)}”`);
  }

  return { ready: reasons.length === 0, reviewed, reasons, counts, stale };
}

/**
 * Record that the claims were reviewed. Refuses while anything is outstanding —
 * a review that can be recorded over unverified claims is a signature, not a
 * review.
 */
export async function markClaimsReviewed(briefId: string, actor: string | null) {
  const readiness = await checkClaimReadiness(briefId);
  const blocking = readiness.reasons.filter((r) => !r.startsWith("The claim review has not been recorded"));
  if (blocking.length) {
    throw new ScriptBuilderError(
      `Cannot record the review while claims are outstanding: ${blocking.join(" ")}`, 409,
    );
  }
  const s = getSupabaseAdminClient();
  const { error } = await s.from("ce_content_briefs")
    .update({
      claims_reviewed_at: new Date().toISOString(),
      claims_reviewed_by: actor,
      updated_at: new Date().toISOString(),
    }).eq("id", briefId);
  if (error) throw new ScriptBuilderError(`Could not record the review: ${error.message}`, 502);
  return { reviewed: true, claims: readiness.counts.total };
}

/**
 * Gate for script generation. Applies to every content origin — ruling 7 is
 * explicit that evergreen does not skip it.
 */
export async function requireClaimsVerified(briefId: string): Promise<void> {
  const r = await checkClaimReadiness(briefId);
  if (!r.ready) {
    throw new ScriptBuilderError(
      `Claim verification is not complete. ${r.reasons.slice(0, 3).join(" ")}` +
      (r.reasons.length > 3 ? ` (+${r.reasons.length - 3} more)` : ""),
      409,
    );
  }
}
