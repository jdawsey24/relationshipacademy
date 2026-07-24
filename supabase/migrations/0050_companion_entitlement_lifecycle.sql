-- Relationship Companion — entitlement source lifecycle (refund / dispute
-- revocation + restoration + out-of-order reconciliation). Owner-approved policy.
--
-- Principle: separate PAYMENT status (Stripe/finance) from ENTITLEMENT-SOURCE
-- status (per-payment lifecycle, below) from EFFECTIVE ACCESS (any active source).
-- Revocation targets the exact payment; effective access = does ANY active source
-- remain. Manual grants have their own source and never inherit Stripe lifecycle.
--
-- OWNER-RUN. Additive + RLS-locked. No access is enabled by this migration.

-- 1) Precise join key: capture the payment_intent (+ charge) so a refund/dispute
--    (which carry payment_intent) can find the EXACT entitlement — never by
--    customer, so an unrelated user's grant can never be revoked.
alter table public.companion_entitlements
  add column if not exists payment_intent_id text,
  add column if not exists charge_id text;
create index if not exists idx_companion_entitlements_pi
  on public.companion_entitlements (payment_intent_id) where payment_intent_id is not null;

-- 2) Source-status vocabulary. Only 'active' grants effective access. Every other
--    state preserves the row + learner data + history but withholds access.
alter table public.companion_entitlements
  drop constraint if exists companion_entitlements_status_chk;
alter table public.companion_entitlements
  add constraint companion_entitlements_status_chk check (status in (
    'pending', 'active', 'dispute_suspended',
    'revoked_refund', 'revoked_dispute', 'revoked_admin',
    'failed', 'superseded', 'canceled', 'expired'
  ));

-- 3) Audit + idempotency ledger for every lifecycle transition (Stripe or admin).
--    unique stripe_event_id → a redelivered Stripe event is recorded once; admin
--    actions carry actor + reason. Full previous→resulting state is preserved.
create table if not exists public.companion_entitlement_events (
  id               uuid primary key default gen_random_uuid(),
  entitlement_id   uuid references public.companion_entitlements(id) on delete set null,
  payment_intent_id text,
  event_type       text not null,            -- grant | full_refund | partial_refund | dispute_open | dispute_won | dispute_lost | admin_grant | admin_revoke | admin_restore
  from_status      text,
  to_status        text,
  reason           text,
  amount_refunded  integer,                   -- minor units, for partial-refund audit (no card data)
  stripe_event_id  text,
  actor            text,                      -- admin email for manual actions; null for Stripe-driven
  livemode         boolean,
  created_at       timestamptz not null default now()
);
create unique index if not exists uq_companion_entitlement_events_stripe
  on public.companion_entitlement_events (stripe_event_id) where stripe_event_id is not null;
create index if not exists idx_companion_entitlement_events_ent
  on public.companion_entitlement_events (entitlement_id);

-- 4) Out-of-order guard: if a refund/dispute-loss arrives BEFORE the grant, the
--    payment is remembered as ineligible so the later grant is DENIED (never a
--    grant-then-revoke flicker). Keyed by payment_intent.
create table if not exists public.companion_ineligible_payments (
  payment_intent_id text primary key,
  reason            text not null,           -- refunded | dispute_lost
  stripe_event_id   text,
  livemode          boolean,
  created_at        timestamptz not null default now()
);

-- RLS: all three are service-role only (deny-all to clients). Users can never
-- read or influence entitlement lifecycle state.
alter table public.companion_entitlement_events   enable row level security;
alter table public.companion_ineligible_payments  enable row level security;

notify pgrst, 'reload schema';
