-- 0071 — rehearsal mode. Click every button, spend nothing.
--
-- The Studio costs about fifty cents a script, which is fine for writing and
-- absurd for checking that a button is in the right place. Rehearsal replays
-- output from earlier real runs instead of calling the provider, so the whole
-- screen can be exercised for nothing and what comes back is real writing
-- rather than lorem.
--
-- It is per project, not a global switch, because a global one gets left on and
-- the next real script silently comes back as somebody else's.

create table if not exists public.ai_rehearsal_samples (
  id              uuid primary key default gen_random_uuid(),
  generation_type text not null,
  label           text not null,
  -- A whole provider response, shaped exactly as the stage's schema. Replayed
  -- verbatim, so a sample that would fail validation would have failed live.
  output          jsonb not null,
  created_at      timestamptz not null default now()
);

create index if not exists idx_rehearsal_by_type
  on public.ai_rehearsal_samples (generation_type, created_at desc);

alter table public.ci_conversations
  add column if not exists rehearsal boolean not null default false;

comment on column public.ci_conversations.rehearsal is
  'Replay saved output instead of calling the provider. Per project so it cannot be left on globally.';

alter table public.ai_rehearsal_samples enable row level security;
