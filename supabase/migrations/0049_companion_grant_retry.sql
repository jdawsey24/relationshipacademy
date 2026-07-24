-- Relationship Companion — purchase → entitlement reliability (grant-retry).
-- Scoped to grant idempotency + retryability + reconciliation. No new entitlement
-- POLICY (perpetual one-time grant is unchanged); this only hardens delivery.
--
-- OWNER-RUN. Additive + RLS-locked.

-- 1) DB-level idempotency: a Stripe object (checkout session) grants AT MOST ONE
--    entitlement, even under concurrent / duplicate webhook delivery. Partial
--    unique (stripe_ref may be null for manual grants, which are not deduped here).
create unique index if not exists uq_companion_entitlements_stripe_ref
  on public.companion_entitlements (stripe_ref)
  where stripe_ref is not null;

-- 2) Grant-attempt ledger — the state machine for a grant, separate from the
--    entitlement row (which only exists once a grant SUCCEEDS). Lets us distinguish
--    payment-received / processing / succeeded / failed(retryable), count attempts,
--    keep the last error (NO card/payment data), and drive reconciliation +
--    operational visibility. One row per Stripe object (checkout session id).
create table if not exists public.companion_grant_attempts (
  stripe_ref     text primary key,                 -- checkout session id (idempotency key)
  user_id        uuid references auth.users(id) on delete set null,
  product_key    text not null default 'companion',
  status         text not null default 'pending'   -- pending | processing | succeeded | failed
                 check (status in ('pending','processing','succeeded','failed')),
  attempts       integer not null default 0,
  last_error     text,                              -- short reason only; never payment data
  livemode       boolean,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_companion_grant_attempts_status
  on public.companion_grant_attempts (status);

-- RLS: service-role only (deny-all to clients). Never user-writable — a user can
-- never influence grant state; grants originate from the signature-verified webhook.
alter table public.companion_grant_attempts enable row level security;

notify pgrst, 'reload schema';
