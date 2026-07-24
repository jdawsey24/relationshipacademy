// Server-side validation + conflict detection for the Safety V2 registry CMS.
// PURE (no I/O) so it is unit-testable and can run identically in the API routes.
// The UI may mirror these checks, but these are the AUTHORITATIVE ones — never
// trust the client (guardrail 4). Invalid or malformed rules can never be saved
// active (guardrail 5).

export const RISK_CATEGORIES = ["self_harm", "ipv", "sexual_coercion", "harm_to_others"] as const;
export const MATCH_TYPES = ["keyword", "phrase", "regex"] as const;
export const IMMEDIACY_KINDS = ["intent", "active_act", "weapon", "confinement", "escalation", "temporal"] as const;
export const SEVERITIES = [1, 2, 3] as const;
export const RESPONSE_LEVELS = ["1", "2", "3", "immediate_danger", "digital_safety"] as const;

export type RiskCategory = (typeof RISK_CATEGORIES)[number];
export type MatchType = (typeof MATCH_TYPES)[number];
export type ImmediacyKind = (typeof IMMEDIACY_KINDS)[number];

export interface ValidationResult { ok: boolean; errors: string[] }

/** Does this regex compile? (Used to block activating malformed patterns.) */
export function compileRegexOk(pattern: string): boolean {
  try { new RegExp(pattern, "i"); return true; } catch { return false; }
}

function isBool(v: unknown): boolean { return typeof v === "boolean"; }

export interface TriggerInput {
  pattern?: unknown; risk_category?: unknown; canonical_concept?: unknown;
  match_type?: unknown; severity?: unknown; context_required?: unknown;
  negation_sensitive?: unknown;
}

/** Validate a trigger rule. `full` requires the authoring fields (create/activate). */
export function validateTrigger(input: TriggerInput, full = true): ValidationResult {
  const errors: string[] = [];
  const pattern = typeof input.pattern === "string" ? input.pattern.trim() : "";
  if (!pattern) errors.push("Pattern is required.");

  if (input.match_type !== undefined && !MATCH_TYPES.includes(input.match_type as MatchType)) {
    errors.push(`Match type must be one of: ${MATCH_TYPES.join(", ")}.`);
  }
  if (input.match_type === "regex" && pattern && !compileRegexOk(pattern)) {
    errors.push("Regex pattern does not compile.");
  }
  if (input.risk_category !== undefined && !RISK_CATEGORIES.includes(input.risk_category as RiskCategory)) {
    errors.push(`Risk category must be one of: ${RISK_CATEGORIES.join(", ")}.`);
  }
  if (input.severity !== undefined && !SEVERITIES.includes(Number(input.severity) as 1 | 2 | 3)) {
    errors.push("Severity must be 1, 2, or 3.");
  }
  if (input.context_required !== undefined && !isBool(input.context_required)) errors.push("context_required must be true/false.");
  if (input.negation_sensitive !== undefined && !isBool(input.negation_sensitive)) errors.push("negation_sensitive must be true/false.");

  if (full) {
    if (input.risk_category === undefined) errors.push("Risk category is required.");
    if (typeof input.canonical_concept !== "string" || !input.canonical_concept.trim()) errors.push("Canonical concept is required.");
    if (input.severity === undefined) errors.push("Severity is required.");
  }
  return { ok: errors.length === 0, errors };
}

export interface ImmediacyInput { pattern?: unknown; match_type?: unknown; kind?: unknown; implies_category?: unknown }

export function validateImmediacyTerm(input: ImmediacyInput, full = true): ValidationResult {
  const errors: string[] = [];
  const pattern = typeof input.pattern === "string" ? input.pattern.trim() : "";
  if (!pattern) errors.push("Pattern is required.");
  if (input.match_type !== undefined && !MATCH_TYPES.includes(input.match_type as MatchType)) errors.push(`Match type must be one of: ${MATCH_TYPES.join(", ")}.`);
  if (input.match_type === "regex" && pattern && !compileRegexOk(pattern)) errors.push("Regex pattern does not compile.");
  if (input.kind !== undefined && !IMMEDIACY_KINDS.includes(input.kind as ImmediacyKind)) errors.push(`Kind must be one of: ${IMMEDIACY_KINDS.join(", ")}.`);
  if (input.implies_category !== undefined && input.implies_category !== null && input.implies_category !== "" &&
      !RISK_CATEGORIES.includes(input.implies_category as RiskCategory)) {
    errors.push(`Implied category must be blank or one of: ${RISK_CATEGORIES.join(", ")}.`);
  }
  if (full && input.kind === undefined) errors.push("Kind is required.");
  return { ok: errors.length === 0, errors };
}

/** A resource is only "verified" if it carries full verification metadata (11). */
export function isResourceVerified(r: { verified_at?: unknown; verified_by?: unknown; source?: unknown }): boolean {
  return !!(r.verified_at && typeof r.verified_by === "string" && r.verified_by.trim() && typeof r.source === "string" && r.source.trim());
}

/**
 * A verification DATE may not be stamped without a verifier + source (guardrail 11):
 * prevents a resource being represented as verified on partial metadata. Returns an
 * error string, or null if OK.
 */
export function verificationError(body: { verified_at?: unknown; verified_by?: unknown; source?: unknown }): string | null {
  const hasDate = !!body.verified_at;
  const hasBy = typeof body.verified_by === "string" && body.verified_by.trim();
  const hasSrc = typeof body.source === "string" && body.source.trim();
  if (hasDate && (!hasBy || !hasSrc)) return "A verified resource requires both a verifier (verified_by) and a source.";
  return null;
}

export interface ConflictRule { id: string; risk_category: string | null; pattern: string; is_active: boolean; canonical_concept?: string | null }

/**
 * Warn (do NOT block — guardrail 6) when a candidate materially overlaps an
 * existing ACTIVE rule in the same category: an identical pattern (duplicate) or
 * one pattern contained in the other (overlap). Self is excluded by id.
 */
export function findConflicts(
  candidate: { id?: string; risk_category?: string | null; pattern?: string },
  existing: ConflictRule[]
): string[] {
  const warnings: string[] = [];
  const pat = (candidate.pattern ?? "").trim().toLowerCase();
  if (!pat) return warnings;
  for (const e of existing) {
    if (!e.is_active) continue;
    if (candidate.id && e.id === candidate.id) continue;
    if ((e.risk_category ?? "") !== (candidate.risk_category ?? "")) continue;
    const ep = (e.pattern ?? "").trim().toLowerCase();
    if (!ep) continue;
    if (ep === pat) warnings.push(`Duplicate of an active rule "${e.pattern}"${e.canonical_concept ? ` (${e.canonical_concept})` : ""}.`);
    else if (ep.includes(pat) || pat.includes(ep)) warnings.push(`Overlaps an active rule "${e.pattern}" in the same category.`);
  }
  return warnings;
}
