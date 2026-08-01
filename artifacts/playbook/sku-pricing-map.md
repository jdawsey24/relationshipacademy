# Playbook SKU / Pricing Map — draft

**Date:** 2026-07-31 · **Status:** draft for owner pricing decision · publish-held.

Companion to the gated-off publish-wiring (`lib/playbook/keys.ts`, flag `NEXT_PUBLIC_PLAYBOOK_CORPUS`). This maps each **sellable product** to its cluster, the playbook(s) it grants, and a proposed price/SKU. Prices are the owner's call — this structures the catalog and surfaces the one real decision.

## Current commerce model (what exists today)

- **Flat pricing.** One Stripe price, lookup key `playbook_onetime`, **$29.99** (`PLAYBOOK_PRICE_DISPLAY`). Every playbook uses the *same* price; the specific product is the `cluster_id` in checkout metadata (`app/api/playbooks/checkout/route.ts`).
- **Entitlement is per-cluster.** `playbook_entitlements` — one row per user + `cluster_id`. Owning any playbook also discounts the Companion.
- Only the flagship (C1) is live today. Everything below is gated off.

## The catalog — 24 sellable products

Each **cluster** is one product (named by its `playbook_subtitle`). Three clusters were authored as **multiple modules** — these are *one product with several parts*, not a discount bundle:

| Cluster | Product | Grants (playbook keys) | Price (flat) | SKU |
|---|---|---|---|---|
| C1 | Moving Beyond Rejection *(live)* | moving-beyond-rejection | $29.99 | `playbook_onetime` |
| C3 | Letting Someone In | letting-someone-in | $29.99 | `playbook_onetime` |
| C4 | Learning to Date Without Losing Hope | dating-without-losing-hope | $29.99 | `playbook_onetime` |
| C5 | Trusting Your Judgment | trusting-what-you-see | $29.99 | `playbook_onetime` |
| C6 | Finding Security Without Constant Reassurance | finding-security | $29.99 | `playbook_onetime` |
| C7 | Breaking the Cycle of the Same Arguments | breaking-the-cycle | $29.99 | `playbook_onetime` |
| C8 | Finding Your Way Back to Each Other | finding-your-way-back | $29.99 | `playbook_onetime` |
| C9 | Rebuilding Physical Connection | rebuilding-physical-connection | $29.99 | `playbook_onetime` |
| C10 | Building a True Partnership | building-a-true-partnership | $29.99 | `playbook_onetime` |
| C11 | Accepting What Is | accepting-what-is | $29.99 | `playbook_onetime` |
| **C12** | Letting Go and Moving Forward | **letting-go + moving-forward** *(2 modules)* | $29.99 | `playbook_onetime` |
| C13 | Opening Your Heart Again | opening-your-heart-again | $29.99 | `playbook_onetime` |
| C14 | Learning to Say No Without Guilt | learning-to-say-no | $29.99 | `playbook_onetime` |
| C15 | Feeling Seen and Appreciated | feeling-seen | $29.99 | `playbook_onetime` |
| C16 | Rebuilding Trust After Betrayal | rebuilding-trust | $29.99 | `playbook_onetime` |
| C18 | Staying Connected Through Life's Pressures | staying-connected | $29.99 | `playbook_onetime` |
| **C20** | Finding Yourself Again | **finding-yourself-again + 5 add-ons** *(see decision)* | $29.99 | `playbook_onetime` |
| **C21** | Building a Shared Future | **building-a-shared-future + asking-better-questions** *(2 modules)* | $29.99 | `playbook_onetime` |
| C22 | Staying Yourself While Growing Together | staying-yourself | $29.99 | `playbook_onetime` |
| C23 | Making Confident Relationship Decisions | making-confident-decisions | $29.99 | `playbook_onetime` |
| C24 | Deciding Whether to Lean In or Let Go | lean-in-or-let-go | $29.99 | `playbook_onetime` |
| C25 | Building Healthy Relationships from the Ground Up | from-the-ground-up | $29.99 | `playbook_onetime` |
| C26 | Breaking the Cycle | a-different-legacy | $29.99 | `playbook_onetime` |
| C27 | Letting Go of the Armor | letting-go-of-the-armor | $29.99 | `playbook_onetime` |

**Not sellable:** C2, C17 — non-assessable, no playbook by ruling. **C19** ("Staying Connected Through Parenthood") — *assessable but has no playbook*: a C19 Snapshot result would show "Coming soon." (Content gap, not a pricing item.)

## The one real decision — C20's add-ons

C12 and C21 are genuinely single products (two developmental-stage / context modules each) — flat per-cluster pricing fits them with no question.

C20 is different: **"Finding Yourself Again" + 5 life-situation add-ons** (losing-a-partner, caregiving, living-with-illness, dating-later, grieving-differently). These aren't quiz-detectable — a Snapshot never routes to them; they're reached by signpost. So:

- **Option 1 — bundle into C20 (recommended for launch).** The add-ons ride the C20 purchase as supplementary reads for specific situations within the post-relationship journey. Coherent, generous, **no code change** (matches the current per-cluster model + the publish-wiring draft). One caveat to accept: someone who wants only "Dating Later" must buy the C20 product.
- **Option 2 — sell add-ons separately.** Requires **per-key entitlement** (the current model is per-cluster only) — a schema + checkout change, plus a Stripe price per add-on and a place to surface them for sale (they have no marketing card today).

## Pricing structure — options

| Option | Prices | Code | Notes |
|---|---|---|---|
| **A · Flat (recommended)** | 1 (`playbook_onetime` $29.99) | none | Ship simplest; every cluster one price; revisit after data. Matches current architecture exactly. |
| B · Value tiers | 2–3 (add e.g. `playbook_bundle` for the multi-module clusters) | per-cluster price lookup | Only worthwhile if you feel C12/C20/C21 warrant more; needs a cluster→price map + extra Stripe prices. |
| C · Per-key à la carte | 1 per sellable key | per-key entitlement (schema change) | Most flexible, most work; only if add-ons must sell separately. |

**Recommendation:** launch on **Option A + C20 Option 1** — no new code, one Stripe price, the whole corpus sellable at $29.99/product with the C20 add-ons included. Revisit tiering once there's purchase data.

## If you keep flat pricing, the Stripe setup is already right

The checkout route already lists the `playbook_onetime` price by lookup key and passes `cluster_id` in metadata — it works for **all** clusters as-is once (a) the price exists in live Stripe and (b) the corpus flag is on. No per-SKU Stripe products needed for Option A.

## Code-ready catalog (only needed for Option B/C)

If tiering is chosen, this constant belongs in `lib/playbook/skus.ts` and the checkout would look up `sku.priceLookupKey` by cluster instead of the single shared key:

```ts
// Only required for tiered/per-key pricing (Option B/C). Flat pricing (A) needs none.
export interface PlaybookSku { clusterId: number; product: string; grants: string[]; priceLookupKey: string; }
export const PLAYBOOK_SKUS: PlaybookSku[] = [
  { clusterId: 1,  product: "Moving Beyond Rejection", grants: ["moving-beyond-rejection"], priceLookupKey: "playbook_onetime" },
  // …one row per sellable cluster; multi-module clusters list all grants…
  { clusterId: 12, product: "Letting Go and Moving Forward", grants: ["letting-go","moving-forward"], priceLookupKey: "playbook_onetime" },
  { clusterId: 20, product: "Finding Yourself Again", grants: ["finding-yourself-again","addon-losing-a-partner","addon-caregiving","addon-living-with-illness","addon-dating-later","addon-grieving-differently"], priceLookupKey: "playbook_onetime" },
  { clusterId: 21, product: "Building a Shared Future", grants: ["building-a-shared-future","asking-better-questions"], priceLookupKey: "playbook_onetime" },
];
```

## Open items for the owner

1. **C20 add-ons:** bundle (Option 1) or sell separately (Option 2)?
2. **Pricing structure:** flat (A), tiers (B), or à la carte (C)?
3. **C19 gap:** author a Parenthood playbook, or leave "Coming soon"?
4. On flip: sync `PLAYBOOK_SLUGS` (marketing URLs) and confirm the live Stripe `playbook_onetime` price.
