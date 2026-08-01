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
//   1. ENTITLEMENT IS PER-CLUSTER (playbook_entitlements.cluster_id). Two clusters
//      are a SINGLE product authored as multiple modules, so one purchase grants
//      both parts (intended — not a discount bundle):
//        • C12 → letting-go + moving-forward
//        • C21 → building-a-shared-future + asking-better-questions
//   2. keyForClusterId (Snapshot result → "open your Playbook") returns ONE key
//      per cluster. Primaries are set in CLUSTER_PRIMARY_KEY (the quiz-result
//      Playbook); companions are reached via cross-Playbook routing
//      (lib/playbook/crossPlaybookRoutes). Confirm the primaries.
//   3. ADD-ONS = the "Expansion Life-Situations Pack" (owner ruling 2026-07-31):
//      the 5 add-ons are a SEPARATE product for anyone in the Expansion phase, NOT
//      tied to a Snapshot cluster. They entitle via a reserved pseudo-cluster id
//      (EXPANSION_PACK_CLUSTER_ID) — playbook_entitlements.cluster_id has no FK, so
//      a purchase writes that id and unlocks all 5. Needs its own Stripe price
//      (EXPANSION_PACK_PRICE_LOOKUP) and a pack marketing/checkout surface (none yet).
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
  "letting-go": 12, // C12 primary
  "moving-forward": 12, // C12 companion (Renewal)
  "opening-your-heart-again": 13,
  "learning-to-say-no": 14,
  "feeling-seen": 15,
  "rebuilding-trust": 16,
  "staying-connected": 18,
  "finding-yourself-again": 20,
  "building-a-shared-future": 21, // C21 primary
  "asking-better-questions": 21, // C21 companion (still dating)
  "staying-yourself": 22,
  "making-confident-decisions": 23,
  "lean-in-or-let-go": 24,
  "from-the-ground-up": 25,
  "a-different-legacy": 26,
  "letting-go-of-the-armor": 27,
};

// EXPANSION LIFE-SITUATIONS PACK — a separate product for anyone in the Expansion
// phase (decision #3). The 5 add-ons entitle via a reserved pseudo-cluster id
// (NOT a Snapshot cluster; playbook_entitlements.cluster_id has no FK). One
// purchase of EXPANSION_PACK_PRICE_LOOKUP writes this id and unlocks all 5.
export const EXPANSION_PACK_CLUSTER_ID = 900;
export const EXPANSION_PACK_PRICE_LOOKUP = "playbook_pack_expansion";
export const EXPANSION_ADDON_KEYS = [
  "addon-losing-a-partner",
  "addon-caregiving",
  "addon-living-with-illness",
  "addon-dating-later",
  "addon-grieving-differently",
] as const;
const ADDON_KEY_TO_PACK: Record<string, number> = Object.fromEntries(
  EXPANSION_ADDON_KEYS.map((k) => [k, EXPANSION_PACK_CLUSTER_ID]),
);

// For clusters with more than one Playbook, the key a Snapshot result opens.
export const CLUSTER_PRIMARY_KEY: Record<number, string> = {
  12: "letting-go",
  21: "building-a-shared-future",
};

export const PLAYBOOK_KEY_TO_CLUSTER: Record<string, number> = CORPUS_ENABLED
  ? { ...FLAGSHIP_KEY_TO_CLUSTER, ...DRAFT_PLAYBOOK_KEY_TO_CLUSTER, ...ADDON_KEY_TO_PACK }
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
  ...EXPANSION_ADDON_KEYS,
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
