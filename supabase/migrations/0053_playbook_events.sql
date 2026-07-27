-- Phase 7 Rev 3 — Playbook longitudinal functional-use history + separated current-state.
--
-- ⚠️ AUTHORED, NOT RUN. Owner-run only, AFTER explicit approval. Additive and
-- RLS-locked; touches nothing in Snapshot/scoring or commerce. See
-- docs/playbook-architecture-rev3.md §10, §13.
--
-- Two cleanly separated stores:
--   playbook_progress  = CURRENT / resume state  (extended additively below)
--   playbook_events    = append-only LONGITUDINAL functional-use history (new)
--
-- Boundaries enforced here:
--   * events are SERVER-WRITTEN and SCHEMA-VALIDATED (no client insert policy).
--   * events are APPEND-ONLY (no update/delete policy).
--   * IDEMPOTENT from day one: unique(user_id, action_id) collapses retried
--     deliveries of the same logical action to a single event.
--   * MINIMUM functional payload only — no narratives, no partner-monitoring data,
--     no raw sensitive disclosures.

-- 1) playbook_progress — separated, individually-versioned current-state objects.
--    Additive; existing rows read these as empty. NOT one catch-all JSONB.
alter table public.playbook_progress
  add column if not exists literature_state   jsonb not null default '{}'::jsonb, -- read-where-useful
  add column if not exists simulation_state   jsonb not null default '{}'::jsonb, -- resume + fidelity signals
  add column if not exists practice_state     jsonb not null default '{}'::jsonb, -- mission assignment + state
  add column if not exists use_review_state   jsonb not null default '{}'::jsonb, -- last structured review + keep/update
  add column if not exists change_path_state  jsonb not null default '{}'::jsonb; -- current + prior application focus

-- 2) playbook_events — append-only, server-written, schema-validated history.
create table if not exists public.playbook_events (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  action_id          text not null,                 -- idempotency key for one logical product action
  playbook_key       text not null,                 -- R1 stable key
  playbook_version   integer not null,
  object_type        text not null,                 -- registry-constrained: literature|simulation|play|mission|use_review
  object_id          text not null,
  object_version     integer not null,
  event_type         text not null,                 -- registry-constrained (see lib/playbook/events.ts)
  schema_version     integer not null,              -- event payload shape version (from the registry)
  payload            jsonb not null default '{}'::jsonb, -- MINIMUM functional payload, schema-validated by the writer
  created_at         timestamptz not null default now(),
  unique (user_id, action_id)                       -- idempotency: one logical action -> one event
);

create index if not exists idx_playbook_events_user
  on public.playbook_events (user_id, playbook_key, created_at);

alter table public.playbook_events enable row level security;

-- Own-row SELECT only. NO insert/update/delete policy: inserts are performed by
-- the validated server route via the service-role client (which bypasses RLS);
-- the stream is append-only and never updated or deleted.
drop policy if exists "own events select" on public.playbook_events;
create policy "own events select" on public.playbook_events
  for select using (auth.uid() = user_id);

notify pgrst, 'reload schema';
