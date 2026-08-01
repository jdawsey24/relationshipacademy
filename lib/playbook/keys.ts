// R1: stable `playbook_key` ↔ numeric `cluster_id` registry.
//
// The numeric cluster_id is used ONLY for entitlement/commerce (playbook_entitlements,
// Stripe). Everything else — content, routing, progress, analytics — keys on the
// stable string `playbook_key`, which equals the public marketing slug so the
// interactive experience and the marketing/checkout page agree (see lib/playbookMarketing).
//
// cluster_id 1 = Snapshot "Difficulty Feeling Chosen"; its consumer playbook is
// branded "Moving Beyond Rejection" (slug/key below).
//
// ─── PUBLISH-WIRING DRAFT (GATED OFF) ─────────────────────────────────────────
// The full content corpus (25 Playbooks + 5 add-ons, in content/playbook/) is
// authored, validated and reachable in /playbook-preview, but is NOT served or
// sold. Setting NEXT_PUBLIC_PLAYBOOK_CORPUS=true merges the DRAFT_* maps below
// into the live registry. Default OFF → only the flagship is served/sold, exactly
// as today (production behaviour unchanged; the scaffold tests stay green).
//
// ⚠ BEFORE ENABLING — owner decisions (all do-not-revert once money/URLs move):
//   1. ENTITLEMENT IS PER-MODULE (owner ruling 2026-08-01, REVERSES the earlier
//      "per-cluster / one purchase grants both" decision). C12 and C21 each had two
//      modules sharing one cluster id; the companions now entitle via their OWN
//      reserved ids (COMPANION_KEY_TO_CLUSTER) so buying one module does NOT unlock
//      the other. Each of the four is bought and owned independently:
//        • C12: letting-go (12) — companion moving-forward → 912
//        • C21: building-a-shared-future (21) — companion asking-better-questions → 921
//   2. keyForClusterId (Snapshot result → "open your Playbook") returns the module
//      for the assessed cluster (letting-go for C12, building-a-shared-future for
//      C21 — they're the sole DRAFT key for their cluster now). The companions are
//      standalone products, not quiz-detectable, reached via cross-Playbook routing
//      (lib/playbook/crossPlaybookRoutes) and the /playbooks catalog.
//      ⚠ DB COPY FOLLOW-UP: the C12/C21 snapshot_clusters result_title /
//      playbook_subtitle may read as combined (e.g. "Letting Go and Moving Forward").
//      Rename to the single module so it no longer implies buying both.
//   3. ADD-ONS — sold INDIVIDUALLY (owner ruling 2026-07-31: no bundle). Each is
//      its own product for anyone in the Expansion phase, at the flat
//      playbook_onetime price ($29.99); a Stripe PROMOTION CODE applies any discount
//      (checkout already sets allow_promotion_codes: true — no code change). Not
//      quiz-detectable and not a Snapshot cluster, so each entitles via its OWN
//      reserved pseudo-cluster id in the 900-block (playbook_entitlements.cluster_id
//      has no FK) — buy one, own one.
//   4. COVERAGE GAP: cluster 19 ("Staying Connected Through Parenthood") is
//      assessable but has NO Playbook in the corpus — a C19 result would show
//      "Coming soon". Clusters 2 and 17 are non-assessable (no Playbook by ruling).
//   5. Sync lib/playbookMarketing.ts PLAYBOOK_SLUGS (marketing/checkout URLs, also
//      do-not-revert) with these keys, and create a Stripe price per sellable SKU.

const CORPUS_ENABLED = process.env.NEXT_PUBLIC_PLAYBOOK_CORPUS === "true";

// Flagship — always wired (the deployed C1 experience).
const FLAGSHIP_KEY_TO_CLUSTER: Record<string, number> = {
  "moving-beyond-rejection": 1,
};

// DRAFT: every corpus Playbook → its Snapshot cluster. Inert until the flag is on.
// (Add-ons are NOT here — they are the Expansion pack; see below.)
export const DRAFT_PLAYBOOK_KEY_TO_CLUSTER: Record<string, number> = {
  "letting-someone-in": 3,
  "dating-without-losing-hope": 4,
  "trusting-what-you-see": 5,
  "finding-security": 6,
  "breaking-the-cycle": 7,
  "finding-your-way-back": 8,
  "rebuilding-physical-connection": 9,
  "building-a-true-partnership": 10,
  "accepting-what-is": 11,
  "letting-go": 12, // companion moving-forward split out → COMPANION_KEY_TO_CLUSTER
  "opening-your-heart-again": 13,
  "learning-to-say-no": 14,
  "feeling-seen": 15,
  "rebuilding-trust": 16,
  "staying-connected": 18,
  "finding-yourself-again": 20,
  "building-a-shared-future": 21, // companion asking-better-questions split out → COMPANION_KEY_TO_CLUSTER
  "staying-yourself": 22,
  "making-confident-decisions": 23,
  "lean-in-or-let-go": 24,
  "from-the-ground-up": 25,
  "a-different-legacy": 26,
  "letting-go-of-the-armor": 27,
};

// ADD-ONS — sold individually (decision #3: no bundle). Each is its own product
// at the flat playbook_onetime price; a Stripe promotion code applies any discount.
// Not quiz-detectable / not a Snapshot cluster, so each entitles via its OWN
// reserved pseudo-cluster id in the 900-block (playbook_entitlements.cluster_id has
// no FK). Distinct id per add-on = buy one, own one.
export const ADDON_KEY_TO_CLUSTER: Record<string, number> = {
  "addon-losing-a-partner": 901,
  "addon-caregiving": 902,
  "addon-living-with-illness": 903,
  "addon-dating-later": 904,
  "addon-grieving-differently": 905,
};
export const ADDON_KEYS = Object.keys(ADDON_KEY_TO_CLUSTER);
const ADDON_ENTITLEMENT_IDS = new Set<number>(Object.values(ADDON_KEY_TO_CLUSTER));

// COMPANIONS — the second module of the two formerly-combined clusters, now sold
// SEPARATELY (owner ruling 2026-08-01; see header #1). Each entitles via its OWN
// reserved id (parent cluster + 900, so buying the primary does NOT unlock these,
// and vice-versa). NOT add-ons — full-price standalone playbooks, no coupon; not
// quiz-detectable, reached via cross-Playbook routing + the /playbooks catalog.
// Their marketing pages are sourced from the content registry (no snapshot_clusters
// row) — see lib/playbookMarketing.ts.
export const COMPANION_KEY_TO_CLUSTER: Record<string, number> = {
  "moving-forward": 912,          // companion of C12 (letting-go)
  "asking-better-questions": 921, // companion of C21 (building-a-shared-future)
};
export const COMPANION_KEYS = Object.keys(COMPANION_KEY_TO_CLUSTER);

/** True if this entitlement id is an add-on (900-block) rather than a Snapshot
 *  cluster. Used by checkout to auto-apply the add-on coupon on the back end. */
export function isAddonEntitlementId(id: number | null | undefined): boolean {
  return id != null && ADDON_ENTITLEMENT_IDS.has(id);
}

// For clusters that map to more than one Snapshot-result Playbook, the key a result
// opens. Empty since the C12/C21 split (each cluster now has a single result key);
// the reverse map below falls back to first-wins. Kept for any future multi-key cluster.
export const CLUSTER_PRIMARY_KEY: Record<number, string> = {};

export const PLAYBOOK_KEY_TO_CLUSTER: Record<string, number> = CORPUS_ENABLED
  ? { ...FLAGSHIP_KEY_TO_CLUSTER, ...DRAFT_PLAYBOOK_KEY_TO_CLUSTER, ...COMPANION_KEY_TO_CLUSTER, ...ADDON_KEY_TO_CLUSTER }
  : { ...FLAGSHIP_KEY_TO_CLUSTER };

// Reverse map: cluster → its PRIMARY playbook_key (explicit for multi-Playbook
// clusters; first-wins for the rest).
const CLUSTER_TO_PLAYBOOK_KEY = new Map<number, string>();
for (const [key, cluster] of Object.entries(PLAYBOOK_KEY_TO_CLUSTER)) {
  const primary = CLUSTER_PRIMARY_KEY[cluster];
  if (primary) CLUSTER_TO_PLAYBOOK_KEY.set(cluster, primary);
  else if (!CLUSTER_TO_PLAYBOOK_KEY.has(cluster)) CLUSTER_TO_PLAYBOOK_KEY.set(cluster, key);
}

// DRAFT: every Playbook + add-on the app serves at /playbook/[key] when enabled.
const ALL_INTERACTIVE_KEYS: string[] = [
  "moving-beyond-rejection",
  ...Object.keys(DRAFT_PLAYBOOK_KEY_TO_CLUSTER),
  ...COMPANION_KEYS,
  ...ADDON_KEYS,
];

/** Keys with a shipped INTERACTIVE experience. Gated: flagship-only until the corpus flag is on. */
export const INTERACTIVE_PLAYBOOK_KEYS = new Set<string>(
  CORPUS_ENABLED ? ALL_INTERACTIVE_KEYS : ["moving-beyond-rejection"],
);

export function isPlaybookKey(key: string | null | undefined): key is string {
  return typeof key === "string" && key in PLAYBOOK_KEY_TO_CLUSTER;
}

export function clusterIdForKey(key: string | null | undefined): number | null {
  if (!isPlaybookKey(key)) return null;
  return PLAYBOOK_KEY_TO_CLUSTER[key];
}

export function keyForClusterId(clusterId: number | null | undefined): string | null {
  if (clusterId == null) return null;
  return CLUSTER_TO_PLAYBOOK_KEY.get(clusterId) ?? null;
}

/** True if this key has an interactive experience the app can serve. */
export function hasInteractivePlaybook(key: string | null | undefined): boolean {
  return isPlaybookKey(key) && INTERACTIVE_PLAYBOOK_KEYS.has(key);
}
