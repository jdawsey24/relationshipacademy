// Relationship Playbooks — paid one-time products.
//
// Which clusters have a purchasable Playbook — the checkout gate (`hasPlaybook`).
// GATED with the corpus flag (see lib/playbook/keys.ts):
//   • OFF (production today): the pre-corpus set {1,3,4,5,6,24} sold as PDFs
//     (content/playbooks/cluster-{id}.pdf, ownership-gated download route).
//   • ON: every wired key's id from PLAYBOOK_KEY_TO_CLUSTER — the full interactive
//     corpus + the reserved add-on ids (900-block). Delivery is the interactive
//     /playbook/[key] path (keyForClusterId), not the legacy PDF download.
// Single source of truth for the ON set = keys.ts, so the flip stays one switch.
import { PLAYBOOK_KEY_TO_CLUSTER } from "@/lib/playbook/keys";

export const PLAYBOOK_CLUSTERS = new Set<number>(
  process.env.NEXT_PUBLIC_PLAYBOOK_CORPUS === "true"
    ? Object.values(PLAYBOOK_KEY_TO_CLUSTER)
    : [1, 3, 4, 5, 6, 24],
);

// Stripe: one shared Price for every playbook (same price for all). The specific
// playbook (cluster id) rides in checkout metadata. The owner creates a Price
// with this lookup_key (metadata product_key="playbook", billing_type="one_time").
// Checkout is inert until it exists.
export const PLAYBOOK_PRODUCT_KEY = "playbook";
export const PLAYBOOK_PRICE_LOOKUP_KEY = "playbook_onetime";

/** True if a purchasable Playbook exists for this cluster. */
export function hasPlaybook(clusterId: number | null | undefined): boolean {
  return clusterId != null && PLAYBOOK_CLUSTERS.has(clusterId);
}

/**
 * Ownership-gated download route for a cluster's Playbook, or null if none.
 * This is NOT a public file — the route authorizes the signed-in owner and
 * streams the PDF. Safe to expose to anyone (it 401/403s without ownership).
 */
export function playbookUrl(clusterId: number | null | undefined): string | null {
  if (!hasPlaybook(clusterId)) return null;
  return `/api/playbooks/${clusterId}/download`;
}
