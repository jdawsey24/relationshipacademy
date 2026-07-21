-- Relationship Playbooks — paid one-time products. Records which playbooks a
-- user owns so (1) the gated PDF download route can authorize access and
-- (2) the Companion returning-customer discount can detect ownership.
--
-- Mirrors companion_entitlements: own-row read via RLS, all writes via the
-- service role (Stripe webhook / admin). One active grant per (user, cluster);
-- a playbook is identified by its Snapshot cluster id (see lib/snapshot/playbooks.ts).
-- `source` opens with one_time_purchase and reserves promotional | manual_grant
-- so future access models add a ROW, not a schema change.

create table if not exists public.playbook_entitlements (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  cluster_id         integer not null,                 -- which playbook (Snapshot cluster)
  source             text not null default 'one_time_purchase',
  stripe_customer_id text,
  stripe_ref         text,                             -- checkout session / charge id (idempotency)
  status             text not null default 'active',   -- active | canceled | expired
  granted_at         timestamptz not null default now(),
  granted_by         text,                             -- for manual grants (admin actor)
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (user_id, cluster_id)                         -- one ownership row per playbook per user
);
create index if not exists idx_playbook_entitlements_user on public.playbook_entitlements (user_id, status);
create index if not exists idx_playbook_entitlements_customer on public.playbook_entitlements (stripe_customer_id);

-- RLS: a user may READ their own grants (to see owned state); grants are only
-- WRITTEN by the Stripe webhook / admin via the service role (no user write policy).
alter table public.playbook_entitlements enable row level security;
drop policy if exists "own playbook entitlements select" on public.playbook_entitlements;
create policy "own playbook entitlements select" on public.playbook_entitlements for select using (auth.uid() = user_id);

notify pgrst, 'reload schema';
