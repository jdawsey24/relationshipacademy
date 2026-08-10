-- Interactive Relationship Playbook™ — per-user functional progress.
--
-- A NEW DELIVERY MODE for an EXISTING entitlement: access is gated by
-- playbook_entitlements (migration 0042, keyed by numeric Snapshot cluster_id).
-- This table stores only FUNCTIONAL data — the user's play states, executable
-- outputs, and saved "My Plays". No emotional journaling, mood, or partner data.
--
-- Rev 2 architecture:
--   R1  keyed by stable `playbook_key` (e.g. 'finding-love-that-feels-mutual'), NOT the
--       numeric cluster_id (which stays commerce-only in playbook_entitlements).
--   R2  version-stamped: playbook_version on the row; every stored output carries
--       { output_schema_version, play_version, payload }.
--   R3  CURRENT-STATE persistence only. The append-only process-event log
--       (playbook_events) is DESIGNED (see docs) but intentionally NOT created here.
--
-- RLS: own-row read + write (authenticated user data; mirrors companion_user_entries,
-- not the service-role public path). The server API also scopes by user_id.

create table if not exists public.playbook_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  playbook_key       text not null,                 -- R1 stable key (marketing slug), NOT cluster_id
  playbook_version   integer not null default 1,    -- R2 content-module version this row was produced under
  recognized         jsonb not null default '[]'::jsonb,  -- recognition card ids the user tapped
  play_states        jsonb not null default '{}'::jsonb,  -- { play_id: 'available'|'explored'|'in_my_plays'|'used' }
  outputs            jsonb not null default '{}'::jsonb,  -- { play_id: { output_schema_version, play_version, payload } }
  my_plays           jsonb not null default '[]'::jsonb,  -- ordered saved plays (each: play_id + versions + 5 fields)
  updated_at         timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  unique (user_id, playbook_key)
);

create index if not exists idx_playbook_progress_user
  on public.playbook_progress (user_id, playbook_key);

alter table public.playbook_progress enable row level security;

drop policy if exists "own progress select" on public.playbook_progress;
create policy "own progress select" on public.playbook_progress
  for select using (auth.uid() = user_id);

drop policy if exists "own progress insert" on public.playbook_progress;
create policy "own progress insert" on public.playbook_progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "own progress update" on public.playbook_progress;
create policy "own progress update" on public.playbook_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
