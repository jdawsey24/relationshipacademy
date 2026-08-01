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
| C20 | Finding Yourself Again | finding-yourself-again | $29.99 | `playbook_onetime` |
| **C21** | Building a Shared Future | **building-a-shared-future + asking-better-questions** *(2 modules)* | $29.99 | `playbook_onetime` |
| C22 | Staying Yourself While Growing Together | staying-yourself | $29.99 | `playbook_onetime` |
| C23 | Making Confident Relationship Decisions | making-confident-decisions | $29.99 | `playbook_onetime` |
| C24 | Deciding Whether to Lean In or Let Go | lean-in-or-let-go | $29.99 | `playbook_onetime` |
| C25 | Building Healthy Relationships from the Ground Up | from-the-ground-up | $29.99 | `playbook_onetime` |
| C26 | Breaking the Cycle | a-different-legacy | $29.99 | `playbook_onetime` |
| C27 | Letting Go of the Armor | letting-go-of-the-armor | $29.99 | `playbook_onetime` |

**Not sellable via a cluster:** C2, C17 — non-assessable, no playbook by ruling. **C19** ("Staying Connected Through Parenthood") — *assessable but has no playbook*: a C19 Snapshot result would show "Coming soon." (Content gap, not a pricing item.)

## Add-ons — sold individually (owner ruling: no bundle)

The 5 add-ons — **losing-a-partner, caregiving, living-with-illness, dating-later, grieving-differently** — are **each their own product** for anyone in the Expansion phase (not tied to a Snapshot cluster; reached by signpost). Each lists at the **same $29.99** as a playbook; a **Stripe promotion code** applies any discount (compassion/positioning, not a lower list price).

| Add-on product | Price | SKU | Entitlement id |
|---|---|---|---|
| Losing a Partner | $29.99 | `playbook_onetime` | 901 |
| When Care Becomes the Relationship | $29.99 | `playbook_onetime` | 902 |
| When Your Body Changes the Relationship | $29.99 | `playbook_onetime` | 903 |
| Dating Later | $29.99 | `playbook_onetime` | 904 |
| When You Grieve Differently | $29.99 | `playbook_onetime` | 905 |

**Why this needs no schema change:** `playbook_entitlements.cluster_id` is a plain `integer` with **no foreign key**. Each add-on has its own reserved id (900-block); a purchase writes that id and unlocks *only* that add-on. `clusterIdForKey`/`keyForClusterId` resolve it; the shared `playbook_onetime` price + `allow_promotion_codes: true` (already in the checkout) handle price and coupon. Wired gated-off in `lib/playbook/keys.ts`.

**Build items before add-ons can sell:** (a) the live `playbook_onetime` Stripe price must exist (same one the clusters use); (b) a **coupon/promotion code** in Stripe for the discount; (c) a **place to present each add-on for sale** — they have no marketing card today (checkout itself already works if handed the reserved id).

## Pricing structure — options

| Option | Prices | Code | Notes |
|---|---|---|---|
| **A · Flat (recommended)** | 1 (`playbook_onetime` $29.99), all clusters | none | Every cluster one price; C12/C21 include both their modules. Matches current architecture. |
| B · Value tiers | +1–2 (e.g. `playbook_bundle` for C12/C21) | per-cluster price lookup | Only if the two-module clusters warrant more; needs a cluster→price map + extra Stripe prices. |

Add-ons list at the same $29.99 (`playbook_onetime`) with a **coupon code** for any discount — no separate price, no per-add-on Stripe SKU.

**Recommendation:** launch on **Option A** — all 24 clusters and the 5 add-ons at $29.99 (`playbook_onetime`), applying a Stripe promotion code to add-on purchases for the compassion discount. No new pricing code; all wired (gated off). Revisit cluster tiering after purchase data.

## If you keep flat pricing, the Stripe setup is already right

The checkout route already lists the `playbook_onetime` price by lookup key and passes `cluster_id` in metadata — it works for **all** clusters as-is once (a) the price exists in live Stripe and (b) the corpus flag is on. No per-SKU Stripe products needed for Option A.

## Code-ready catalog (only needed for Option B tiering)

Flat pricing (A) needs no catalog — the checkout already lists `playbook_onetime` and passes `cluster_id`. If cluster tiering (B) is chosen later, this constant belongs in `lib/playbook/skus.ts` and the checkout would look up `sku.priceLookupKey` by cluster:

```ts
export interface PlaybookSku { clusterId: number; product: string; grants: string[]; priceLookupKey: string; }
export const PLAYBOOK_SKUS: PlaybookSku[] = [
  { clusterId: 1,  product: "Moving Beyond Rejection", grants: ["moving-beyond-rejection"], priceLookupKey: "playbook_onetime" },
  // …one row per sellable cluster; C12/C21 list both modules…
  { clusterId: 12, product: "Letting Go and Moving Forward", grants: ["letting-go","moving-forward"], priceLookupKey: "playbook_onetime" },
  { clusterId: 20, product: "Finding Yourself Again", grants: ["finding-yourself-again"], priceLookupKey: "playbook_onetime" },
  { clusterId: 21, product: "Building a Shared Future", grants: ["building-a-shared-future","asking-better-questions"], priceLookupKey: "playbook_onetime" },
];
// Add-ons sell individually (ADDON_KEY_TO_CLUSTER in lib/playbook/keys.ts), each
// entitled via its own reserved 900-block id, at the flat playbook_onetime price
// with a coupon for the discount.
```

## Open items for the owner

1. **Cluster pricing:** flat (A, recommended) or tiers (B)?
2. **Add-on discount:** create the Stripe promotion/coupon code, and decide where each add-on is presented for sale (no marketing card today).
3. **C19 gap:** author a Parenthood playbook, or leave "Coming soon"?
4. On flip: sync `PLAYBOOK_SLUGS` (marketing URLs); confirm the live Stripe `playbook_onetime` price.
