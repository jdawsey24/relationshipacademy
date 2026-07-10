-- Financial reporting layer. Stripe is the authoritative source of record; these
-- tables are a SYNCHRONIZED read model kept current by verified webhooks and
-- reconciled against Stripe via backfill. Money is stored in INTEGER MINOR UNITS
-- (bigint cents). Every Stripe-derived table carries `livemode` so test and live
-- data are permanently separated (never mixed, never cleared).
--
-- All tables: RLS enabled with NO anon/authenticated policy — financial data is
-- read only server-side via the service role inside owner+MFA-gated routes.
-- Additive only (no changes to existing tables). Safe to run more than once.

-- Webhook event log with a status machine (received/processing/processed/failed).
-- Idempotent + retry-safe: only `processed` events are skipped; failed/received
-- events remain eligible for reprocessing (never permanently dropped by id alone).
create table if not exists public.stripe_events (
  id text primary key,                       -- Stripe event id (evt_…)
  type text not null,
  status text not null default 'received',   -- received | processing | processed | failed
  attempts integer not null default 0,
  last_error text,
  api_version text,
  livemode boolean not null default false,
  created timestamptz,                        -- event creation time (Stripe)
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists stripe_events_status_idx on public.stripe_events (status);

-- Canonical money-movement ledger: one row per Stripe balance_transaction.
-- Revenue is counted here ONCE; invoice.*/charge.* events only enrich/link.
create table if not exists public.stripe_transactions (
  balance_transaction_id text primary key,   -- txn_…
  event_id text,
  object_type text,                          -- charge | refund | dispute | adjustment | ...
  object_id text,
  charge_id text,
  payment_intent_id text,
  refund_id text,
  invoice_id text,
  subscription_id text,
  dispute_id text,
  type text,                                 -- balance_transaction type/reporting_category
  amount_gross bigint not null default 0,    -- minor units
  fee bigint not null default 0,
  amount_net bigint not null default 0,
  currency text,
  billing_type text,                         -- recurring | one_time
  product_id text,
  price_id text,
  tier text,
  customer_id text,
  email text,
  available_on timestamptz,
  created timestamptz,
  livemode boolean not null default false,
  synced_at timestamptz not null default now()
);
create index if not exists stripe_transactions_created_idx on public.stripe_transactions (created);
create index if not exists stripe_transactions_livemode_idx on public.stripe_transactions (livemode);
create index if not exists stripe_transactions_type_idx on public.stripe_transactions (type);
create index if not exists stripe_transactions_sub_idx on public.stripe_transactions (subscription_id);

-- Current subscription state (drives MRR/ARR/active/by-tier/monthly-vs-annual).
create table if not exists public.stripe_subscriptions (
  id text primary key,                       -- sub_…
  customer_id text,
  user_id uuid,
  email text,
  product_id text,
  price_id text,
  tier text,
  interval text,                             -- month | year | week | day
  interval_count integer not null default 1,
  quantity integer not null default 1,
  currency text,
  unit_amount bigint not null default 0,     -- minor units
  effective_amount bigint not null default 0,-- after discount, per interval
  mrr_amount bigint not null default 0,      -- normalized monthly (minor units)
  status text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  cancel_at timestamptz,
  canceled_at timestamptz,
  cancel_at_period_end boolean not null default false,
  discount jsonb,
  latest_invoice_id text,
  livemode boolean not null default false,
  created_at timestamptz,
  updated_at timestamptz,
  synced_at timestamptz not null default now()
);
create index if not exists stripe_subscriptions_status_idx on public.stripe_subscriptions (status);
create index if not exists stripe_subscriptions_livemode_idx on public.stripe_subscriptions (livemode);
create index if not exists stripe_subscriptions_tier_idx on public.stripe_subscriptions (tier);

-- Subscription lifecycle log (new/cancel/upgrade/downgrade over time).
create table if not exists public.subscription_changes (
  id uuid primary key default gen_random_uuid(),
  subscription_id text,
  change_type text not null,                 -- new | canceled | upgrade | downgrade | reactivated | trial_started | trial_converted
  from_tier text,
  to_tier text,
  from_mrr bigint,
  to_mrr bigint,
  mrr_delta bigint,
  livemode boolean not null default false,
  created_at timestamptz not null default now(),
  event_id text
);
create index if not exists subscription_changes_created_idx on public.subscription_changes (created_at);

create table if not exists public.stripe_payouts (
  id text primary key,
  amount bigint not null default 0,
  currency text,
  status text,
  arrival_date timestamptz,
  created timestamptz,
  livemode boolean not null default false,
  synced_at timestamptz not null default now()
);

create table if not exists public.stripe_disputes (
  id text primary key,
  charge_id text,
  payment_intent_id text,
  amount bigint not null default 0,
  currency text,
  status text,
  reason text,
  evidence_due_by timestamptz,
  is_charge_refundable boolean,
  created timestamptz,
  livemode boolean not null default false,
  synced_at timestamptz not null default now()
);

create table if not exists public.finance_failed_payments (
  id text primary key,                       -- invoice id or payment_intent id
  invoice_id text,
  subscription_id text,
  customer_id text,
  email text,
  amount bigint not null default 0,
  currency text,
  attempt_count integer,
  next_payment_attempt timestamptz,
  status text,
  created timestamptz,
  livemode boolean not null default false,
  synced_at timestamptz not null default now()
);

create table if not exists public.finance_backfill_jobs (
  id uuid primary key default gen_random_uuid(),
  resource text not null,                    -- balance_transactions | subscriptions | payouts | disputes
  livemode boolean not null default false,
  status text not null default 'queued',     -- queued | running | paused | completed | failed
  cursor text,                               -- Stripe starting_after checkpoint
  processed_count integer not null default 0,
  dry_run boolean not null default false,
  reconciliation jsonb,
  started_by text,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_error text
);

-- RLS: enable everywhere, NO public policy (service-role only access).
alter table public.stripe_events           enable row level security;
alter table public.stripe_transactions     enable row level security;
alter table public.stripe_subscriptions    enable row level security;
alter table public.subscription_changes    enable row level security;
alter table public.stripe_payouts          enable row level security;
alter table public.stripe_disputes         enable row level security;
alter table public.finance_failed_payments enable row level security;
alter table public.finance_backfill_jobs   enable row level security;

notify pgrst, 'reload schema';
