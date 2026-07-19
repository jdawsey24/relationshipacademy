-- Relationship Companion — Phase 1 (1/5): consumer identity & preferences.
-- Reuses the shared Supabase Auth pool (auth.users). Additive, idempotent; run
-- once in the Supabase SQL editor. RPI / lib/scoring.ts / snapshot-legacy untouched.

-- Relationship-status lookup (consumer labels + internal structural context).
-- Status and developmental phase are SEPARATE constructs — no phase is stored here.
create table if not exists public.structural_statuses (
  id                 uuid primary key default gen_random_uuid(),
  key                text unique not null,          -- single | dating | committed | engaged | married
  label              text not null,                 -- consumer-facing
  structural_context text not null,                 -- internal only, never shown as "structural marker"
  display_order      smallint not null default 0,
  created_at         timestamptz not null default now()
);

insert into public.structural_statuses (key, label, structural_context, display_order) values
  ('single',    'Single',                'single',    1),
  ('dating',    'Dating',                'dating',    2),
  ('committed', 'Committed Relationship','committed', 3),
  ('engaged',   'Engaged',               'engaged',   4),
  ('married',   'Married',               'married',   5)
on conflict (key) do nothing;

-- One Companion profile per user (Companion-specific state only; auth identity
-- lives on auth.users, membership on profiles).
create table if not exists public.companion_profiles (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  current_status_id      uuid references public.structural_statuses(id),
  onboarding_completed_at timestamptz,
  install_state          text not null default 'not_shown',   -- not_shown | shown | dismissed | completed
  notification_prefs     jsonb not null default '{}'::jsonb,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Append-only status history — a status change never rewrites past entries.
create table if not exists public.user_structural_status_history (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  structural_status_id uuid not null references public.structural_statuses(id),
  changed_at         timestamptz not null default now()
);
create index if not exists idx_companion_status_history_user on public.user_structural_status_history (user_id, changed_at desc);

-- Onboarding topic preferences (filters only — never assessment results).
create table if not exists public.user_interest_preferences (
  user_id    uuid not null references auth.users(id) on delete cascade,
  topic      text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, topic)
);

-- RLS: reference data readable; personal rows owner-only. Service role bypasses.
alter table public.structural_statuses            enable row level security;
alter table public.companion_profiles             enable row level security;
alter table public.user_structural_status_history enable row level security;
alter table public.user_interest_preferences      enable row level security;

drop policy if exists "statuses readable" on public.structural_statuses;
create policy "statuses readable" on public.structural_statuses for select using (true);

drop policy if exists "own companion profile all" on public.companion_profiles;
create policy "own companion profile all" on public.companion_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own status history all" on public.user_structural_status_history;
create policy "own status history all" on public.user_structural_status_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own interests all" on public.user_interest_preferences;
create policy "own interests all" on public.user_interest_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
