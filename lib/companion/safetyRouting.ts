// Pure resource-routing helpers (no I/O) — how a classification maps to the
// resource KINDS to show, and how resources are filtered by category +
// jurisdiction with a defined fallback. Kept pure so the routing + the non-US
// fallback behavior are unit-testable independently of the DB.

import type { RiskCategory } from "@/lib/companion/safetyEngine";

export interface RoutableResource {
  id: string; name: string; description: string | null; contact: string | null;
  url: string | null; jurisdiction: string; hours: string | null;
  applies_to_categories: string[] | null; resource_kind: string | null; is_active?: boolean;
}

/** The resource kinds to surface for a classification. */
export function resourceKindsFor(
  categories: RiskCategory[], opts: { immediate?: boolean; undetermined?: boolean } = {}
): Set<string> {
  const kinds = new Set<string>();
  if (opts.immediate) kinds.add("emergency");
  for (const c of categories) {
    if (c === "self_harm") kinds.add("suicide_crisis");
    if (c === "ipv") kinds.add("ipv");
    if (c === "sexual_coercion") kinds.add("sexual_assault");
    if (c === "harm_to_others") { kinds.add("emergency"); kinds.add("suicide_crisis"); }
  }
  // An undetermined acute signal routes to general crisis + emergency support.
  if (opts.undetermined) { kinds.add("emergency"); kinds.add("suicide_crisis"); }
  return kinds;
}

/**
 * Filter resources by category/kind + jurisdiction. Jurisdiction fallback:
 * a resource matches if it is tagged for the caller's jurisdiction OR is GLOBAL.
 * For a non-US / unsupported jurisdiction this yields the GLOBAL resources only
 * (and an empty list if none are tagged GLOBAL) — the response copy still directs
 * the person to emergency services / someone they trust, so absence of a
 * jurisdiction-specific line never implies "no help".
 */
export function filterResources(
  rows: RoutableResource[], wantKinds: Set<string>, categories: string[], jurisdiction: string
): RoutableResource[] {
  return rows
    .filter((r) => r.is_active !== false)
    .filter((r) => r.jurisdiction === jurisdiction || r.jurisdiction === "GLOBAL")
    .filter((r) =>
      (r.resource_kind != null && wantKinds.has(r.resource_kind)) ||
      (r.applies_to_categories?.some((k) => categories.includes(k)) ?? false));
}
