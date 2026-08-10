// Cross-Playbook routing — the product's mapping layer for "this Playbook may not
// be the right fit; another one covers your situation better." Kept here, decoupled
// from the authored content modules (which carry the same intent as prose in their
// signpost cards). Source: the handoff README "Cross-Playbook routing" table.
//
// Endpoints are playbook_keys (REGISTRY keys in content/playbook/index.ts).

export interface CrossPlaybookRoute {
  /** Source playbook_key. */
  from: string;
  /** Target playbook_key a reader here may belong in instead. */
  to: string;
  /** Why — shown to the reader as the reason to consider the other Playbook. */
  reason: string;
}

export const CROSS_PLAYBOOK_ROUTES: CrossPlaybookRoute[] = [
  { from: "letting-go-without-losing-what-it-meant", to: "addon-losing-a-partner", reason: "If your person died — the tools here assume someone chose to leave." },
  { from: "finding-yourself-after-everything-changed", to: "addon-losing-a-partner", reason: "If your person died — the tools here assume someone chose to leave." },
  { from: "letting-go-without-losing-what-it-meant", to: "moving-forward", reason: "If you're ready to think about dating again." },
  { from: "moving-forward", to: "letting-go-without-losing-what-it-meant", reason: "If you're not there yet — still letting go of the last one." },
  { from: "moving-forward", to: "starting-again-without-starting-from-scratch", reason: "“Doing it differently this time” is covered more fully there." },
  { from: "moving-forward", to: "trust-yourself-to-choose-better", reason: "“Doing it differently this time” is covered more fully there." },
  { from: "loved-not-just-needed", to: "is-this-going-somewhere", reason: "If this is early-stage chasing rather than long-term resentment." },
  { from: "the-intimacy-reset", to: "from-roommates-back-to-partners", reason: "If the emotional connection has to come first." },
  { from: "do-we-want-the-same-future", to: "asking-better-questions", reason: "If you're still dating rather than already together." },
  { from: "asking-better-questions", to: "do-we-want-the-same-future", reason: "If you're already together rather than still dating." },
  { from: "how-to-make-a-relationship-decision-you-can-trust", to: "what-nobody-taught-you-about-healthy-relationships", reason: "If it's disillusionment about what relationships require." },
  { from: "addon-caregiving", to: "addon-living-with-illness", reason: "The same situation from the other side." },
  { from: "addon-living-with-illness", to: "addon-caregiving", reason: "The same situation from the other side." },
];

/** Routes leaving a given playbook_key, in declared order. */
export function routesFrom(key: string): CrossPlaybookRoute[] {
  return CROSS_PLAYBOOK_ROUTES.filter((r) => r.from === key);
}

/** Distinct target keys a playbook routes to. */
export function relatedPlaybookKeys(key: string): string[] {
  return [...new Set(routesFrom(key).map((r) => r.to))];
}

/** Validate every route endpoint resolves to a registered playbook_key, and no
 *  route points at itself. Pass listPlaybookKeys(). Returns readable errors ([] = ok). */
export function validateCrossPlaybookRoutes(registeredKeys: readonly string[]): string[] {
  const set = new Set(registeredKeys);
  const errs: string[] = [];
  for (const r of CROSS_PLAYBOOK_ROUTES) {
    if (!set.has(r.from)) errs.push(`route from unknown key "${r.from}"`);
    if (!set.has(r.to)) errs.push(`route to unknown key "${r.to}" (from "${r.from}")`);
    if (r.from === r.to) errs.push(`route points to itself: "${r.from}"`);
    if (!r.reason.trim()) errs.push(`route ${r.from} → ${r.to} has no reason`);
  }
  return errs;
}
