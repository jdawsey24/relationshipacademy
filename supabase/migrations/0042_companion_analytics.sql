-- Relationship Companion — Phase 4: product-usage analytics, kept STRICTLY
-- separate from private reflection content. Only event names + non-sensitive
-- metadata are ever stored here — never journal/Blueprint/plan text. Additive,
-- idempotent. RLS-locked with no public policy: written server-side (service
-- role), read by the owner analytics tooling only.

create table if not exists public.companion_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  event      text not null,                         -- e.g. onboarding_completed, experience_started
  metadata   jsonb not null default '{}'::jsonb,    -- ids/flags only, never content
  created_at timestamptz not null default now()
);
create index if not exists idx_companion_events_event on public.companion_events (event, created_at desc);
create index if not exists idx_companion_events_user on public.companion_events (user_id, created_at desc);

alter table public.companion_events enable row level security;

notify pgrst, 'reload schema';
