// Relationship Playbooks — paid one-time products, one per Snapshot cluster.
//
// Which clusters have a real Playbook PDF (in /content/playbooks, OUTSIDE the
// public web root so the file is never directly downloadable — access is gated
// by ownership via /api/playbooks/[cluster]/download). As more Playbooks are
// added (content/playbooks/cluster-{id}.pdf), add the cluster id here.
export const PLAYBOOK_CLUSTERS = new Set<number>([1, 3, 4, 5, 6, 24]); // Exploration phase

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
