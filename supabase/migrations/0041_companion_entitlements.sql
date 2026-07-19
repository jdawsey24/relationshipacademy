-- Relationship Companion — Phase 1 (5/5): user access grants.
-- V1 = one-time standalone purchase -> perpetual access. Independent of the
-- Academy membership_tier ladder. Extensible: `source` opens with one_time_purchase
-- and reserves bundle | academy_inclusion | promotional | manual_grant | subscription
-- so future access models add a ROW, not a schema change. expires_at nullable
-- (null = perpetual) so time-boxed promos/bundles work later without restructuring.

create table if not exists public.companion_entitlements (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  source             text not null default 'one_time_purchase',
  product_key        text not null default 'companion',
  stripe_customer_id text,
  stripe_ref         text,                          -- checkout session / charge / subscription id
  status             text not null default 'active',-- active | canceled | expired
  granted_at         timestamptz not null default now(),
  expires_at         timestamptz,                   -- null = perpetual (one-time purchase)
  granted_by         text,                          -- for manual grants (admin actor)
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_companion_entitlements_user on public.companion_entitlements (user_id, status);
create index if not exists idx_companion_entitlements_customer on public.companion_entitlements (stripe_customer_id);

-- RLS: a user may READ their own grants (to see access state); grants are only
-- WRITTEN by the Stripe webhook / admin via the service role (no user write policy).
alter table public.companion_entitlements enable row level security;
drop policy if exists "own entitlements select" on public.companion_entitlements;
create policy "own entitlements select" on public.companion_entitlements for select using (auth.uid() = user_id);

notify pgrst, 'reload schema';
