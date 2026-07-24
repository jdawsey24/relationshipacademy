# Companion Refund / Dispute Revocation — Design Proposal

**Status:** DESIGN ONLY — nothing implemented. For owner approval before build.
**Scope:** purchase → entitlement revocation/restoration for the Companion. No new
policy is enacted here; recommendations are marked, and the decisions you must make
are listed explicitly. **Feature flag stays OFF.**

## 0. Current model (audit)

- The Companion is a **one-time, perpetual** purchase (`mode: payment`, `billing_type: one_time`, `expires_at` null, `source: one_time_purchase`). **There is no Companion subscription** — the `source` enum *reserves* `subscription` but no such SKU exists. So there is exactly **one access model today: lifetime/perpetual**.
- A grant = one `companion_entitlements` row, keyed by **`stripe_ref` = checkout *session* id** + `stripe_customer_id`. **`payment_intent` and `charge` are NOT captured.**
- Access check (`resolveEntitlement`) counts a user as entitled iff they have a row with **`status='active'`** and (null or future) `expires_at`. So *any* non-active status already removes access — the read path is revocation-ready.
- The webhook already **receives** `charge.refunded` and `charge.dispute.*`, but only the **finance ledger** consumes them; **entitlements are never touched**. `revokeByStripeRef()` exists but is **uncalled**, and it keys on the session id — which refund/dispute events do **not** carry.

**The gap:** a refund/dispute event identifies a *payment_intent/charge*, but an entitlement is identified by a *session id*. There is no reliable link, so revocation cannot currently target the exact entitlement.

## 1. Reference architecture (the join key)

Capture the payment identifiers **at grant time** (they're on `checkout.session.completed`) so any later refund/dispute can find the exact entitlement:

```
checkout.session.completed
   session.id            → companion_entitlements.stripe_ref           (existing)
   session.payment_intent → companion_entitlements.payment_intent_id    (NEW — the join key)
   session.customer       → companion_entitlements.stripe_customer_id   (existing)

charge.refunded         → charge.payment_intent  ─┐
charge.dispute.created  → dispute.payment_intent ─┼─► match ONE entitlement by payment_intent_id
charge.dispute.closed   → dispute.payment_intent ─┘
```

- **Precise + safe:** `payment_intent` is unique per purchase, so a match affects exactly one entitlement — it **cannot revoke an unrelated user's** row (never match by customer id, which can span purchases). Manual grants have a **null** `payment_intent_id`, so no refund/dispute event can ever match them.
- Also store the **`charge_id`** when available (belt-and-suspenders; refund events carry it) but treat `payment_intent_id` as the primary key.

## 2. Policy matrix

For each scenario: **(1)** what Stripe reports · **(2)** what the system does today · **(3)** my recommendation · **(4)** your decision.

| Scenario | (1) Stripe reports | (2) Today | (3) Recommend | (4) Your decision |
|---|---|---|---|---|
| **Full refund** | `charge.refunded`, `amount_refunded == amount` | keeps access | **Revoke immediately** | Confirm revoke + timing (immediate vs grace) |
| **Partial refund** | `charge.refunded`, `amount_refunded < amount` | keeps access | **Remain active** (single indivisible SKU; partial = goodwill), optional flag for manual review | Keep-active vs manual-review? |
| **Customer-requested refund** | *same event as above* — Stripe does **not** distinguish requester | keeps access | Treat by **amount** (full→revoke, partial→keep), not by requester | Confirm requester is irrelevant |
| **Dispute / chargeback opened** | `charge.dispute.created`, status `needs_response`; funds withdrawn | keeps access | **Suspend pending resolution** (reversible; conservative) | Suspend-pending **vs** keep-active-until-lost |
| **Dispute won** | `charge.dispute.closed`, status `won`; funds returned | keeps access | **Restore** (if suspended); else no change | Confirm restore-on-win |
| **Dispute lost** | `charge.dispute.closed`, status `lost`; funds gone | keeps access | **Revoke immediately** | Confirm revoke-on-lost |
| **Canceled payment** | `checkout.session.expired` / PI `canceled`; no charge | no grant ever | **No action** (nothing was granted) | Confirm (no-op) |
| **Duplicate / erroneous payment** | two sessions/PIs → two paid events | two active rows (both grant access) | **Remain active**; refund the extra charge → precise revoke of only that row via its PI → access retained via the other | One-row-per-payment (recommended) vs per-user single entitlement? |
| **Manual / admin-issued access** | none (no Stripe event) | active, perpetual, `payment_intent` null | **Remain active**; exempt from auto-revocation; admin-only revoke/restore | Confirm exemption + need an admin revoke control |
| **Lifetime vs subscription** | Companion has **no** subscription | perpetual only | Matrix applies to **perpetual one-time**; if a subscription SKU is ever added, add period-end revocation (separate design) | Confirm no Companion subscription today |

## 3. Revocation / restoration state machine

Entitlement `status`, extended (currently `active | canceled | expired`):

```
                 full refund / dispute lost / admin revoke
   ┌───────────────────────────────────────────────► revoked ──┐
   │                                                            │  admin restore (error / refund reversed)
 active ──dispute created (if policy=suspend)──► suspended      │
   ▲                                              │   │         │
   │            dispute won (restore)             │   │ dispute lost → revoked
   └──────────────────────────────────────────────┘   └─────────────────►
   (partial refund → stays active)                (expired: time-boxed grants only)
```

- **Read path unchanged:** `resolveEntitlement` counts only `active` → `suspended`/`revoked` lose access automatically; restoring = set back to `active`.
- **Transitions are guarded** (only from expected prior states) so a stale/out-of-order event can't, e.g., revoke an already-restored grant.
- **Every transition is logged** (see §4) with reason + Stripe event id + actor.

## 4. Data / reference changes (proposed migration `0050`, owner-run — NOT built)

1. `companion_entitlements` **+ columns**: `payment_intent_id text` (indexed — the join key), `charge_id text`. Backfill existing rows by mapping session→PI from Stripe (via a one-off reconcile).
2. `companion_entitlements.status` **check constraint** extended to `active | suspended | revoked | expired | canceled`.
3. **New** `companion_entitlement_events` (audit + idempotency + reversibility): `id`, `entitlement_id`, `event_type` (refund/dispute_opened/dispute_won/dispute_lost/admin_revoke/admin_restore), `from_status`, `to_status`, `reason`, `stripe_event_id` **unique** (dedup), `actor`, `livemode`, `created_at`. RLS deny-all (service-role only).
4. Grant path: capture `session.payment_intent` (+ charge when present) into the new columns.

## 5. Stripe events involved

- `charge.refunded` — full (`amount_refunded == amount`) vs partial. *(already received; finance-only today)*
- `charge.dispute.created` — dispute opened. *(already received)*
- `charge.dispute.closed` — outcome via `status` (`won` | `lost`). *(already received)*
- `charge.dispute.updated` — status progression (mostly informational).
- `checkout.session.expired` / `payment_intent.canceled` — no grant → no-op.
- New handlers would sit **beside** `applyCompanionGrant` (same pattern: idempotent, livemode-guarded, match by `payment_intent_id`), and finance handling is unchanged.

## 6. Safety properties (all preserved)

- **Idempotent / duplicate-event-safe:** transitions are set-status (re-applying is a no-op) **and** deduped by `stripe_event_id` in the events log.
- **Retry-safe:** a revocation-branch failure signals Stripe to retry (same `mustRetry` pattern as the grant); retries re-apply the same terminal state.
- **Cannot revoke an unrelated user:** match by the purchase's unique `payment_intent_id`, never by customer.
- **Test/live separated:** livemode guard on every revocation, same as grants.
- **Auditable + reversible:** `companion_entitlement_events` history; `revoked/suspended → active` restore path for dispute-won and revocation-in-error.

## 7. Edge cases

- **Refund/dispute arrives before the grant landed** (out-of-order): no entitlement to match → record a **pending revocation** keyed by `payment_intent_id`; the grant path (and reconciliation) checks for one and revokes on arrival. (Alternative: flag for manual review.)
- **Partial-then-full refund:** decide on **cumulative** `amount_refunded == amount`, not a single refund event.
- **Duplicate payment refunded:** precise PI match revokes only the refunded purchase; the other entitlement keeps access.
- **Re-purchase after revoke:** new session/PI → new row (unique index is per session), independent of the revoked one.
- **Dispute won after an erroneous revoke:** restore path returns access.
- **Manual grant (null PI):** never matched by any refund/dispute event.

## 8. E2E tests required (when implemented)

full refund → revoked/no-access · partial refund → active (or manual-review per decision) · dispute opened → suspended/paused · dispute won → restored/access-returns · dispute lost → revoked/no-access · **refund of a duplicate payment → only that entitlement revoked, other stays active** · manual grant unaffected by refund/dispute · **redelivered refund/dispute event → idempotent (event-id dedup)** · **refund for another user's payment_intent → this user untouched** · test-mode refund → no live revocation · revocation-in-error → admin restore returns access · out-of-order refund-before-grant → pending revocation applied.

## 9. Decisions I need from you (before build)

1. **Full refund** → revoke immediately? (rec: yes) — and any grace period? (rec: immediate)
2. **Partial refund** → keep active (rec) or manual review?
3. **Dispute opened** → **suspend pending** (rec) or keep active until lost?
4. **Dispute won** → restore (confirm).
5. **Dispute lost** → revoke immediately (confirm).
6. **Duplicate payments** → one-row-per-payment (rec) or per-user single entitlement?
7. **Manual grants** → exempt from auto-revocation (rec) + add an admin revoke/restore control?
8. **Restoration authority** → admin-only manual restore for errors (rec)?
9. **Out-of-order refund-before-grant** → pending-revocation (rec) or manual-review?

Once you approve the matrix + these decisions, I'll build migration `0050`, the revocation/restoration handlers, the admin revoke/restore control, and the E2E tests — then verify, and fold it into the final launch-readiness review. **No implementation until then.**
