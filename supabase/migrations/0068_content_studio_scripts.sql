-- 0068 — the Studio writes scripts.
--
-- The Studio began as an open conversation. What the owner actually needs is a
-- short pipeline: she pastes what she saw, picks a hook, picks a body, and gets
-- a script. The conversation tables stay — a script project is still a
-- ci_conversation, so cost governance, messages and the brief keep working —
-- and this adds only what a script needs on top.
--
-- WHY OPTIONS ARE ROWS RATHER THAN JSON ON THE CONVERSATION. She selects,
-- rejects, and combines across stages, and she regenerates one stage without
-- losing the others. That is a table.

-- What she saw. The trend the script hangs on.
alter table public.ci_conversations
  add column if not exists source_text text,
  add column if not exists source_url  text,
  add column if not exists topic       text,
  -- The working brief: audience, phase, task, core lesson. Written once at the
  -- hook stage and carried forward, so later stages cannot quietly re-decide
  -- what the video is about.
  add column if not exists brief       jsonb not null default '{}'::jsonb;

comment on column public.ci_conversations.source_text is
  'The clip, quote, story or comment the owner pasted in. The model has no live awareness of what is trending, so this is where the trend enters the system.';

create table if not exists public.ci_script_options (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  stage           text not null check (stage in ('hook', 'body', 'resolution', 'cta')),
  idx             integer not null default 0,
  -- Which way in this option used. Recorded so a run can be read back, never
  -- shown on screen and never a closed list: the families are a palette.
  technique       text,
  -- Hooks only: to_camera | stitch | cold_open | flash_forward | anticipation.
  format          text,
  content         text not null,
  -- Hooks only: what makes somebody stop or argue.
  why             text,
  selected        boolean not null default false,
  -- The owner rewrote it. Her wording wins and is never regenerated over.
  edited_by_owner boolean not null default false,
  created_at      timestamptz not null default now()
);

create index if not exists idx_ci_script_options_stage
  on public.ci_script_options (conversation_id, stage, idx);

-- One selected option per stage. Enforced rather than trusted, because
-- "assemble the script" is meaningless with two hooks chosen.
create unique index if not exists idx_ci_script_selected_one
  on public.ci_script_options (conversation_id, stage)
  where selected;

create table if not exists public.ci_scripts (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ci_conversations(id) on delete cascade,
  script          text not null,
  -- Hook format carried through: "stitch this clip" and "say this to camera"
  -- are different videos, and the script alone does not say which.
  hook_format     text,
  seconds_est     integer,
  review          jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_ci_scripts_conversation
  on public.ci_scripts (conversation_id, created_at desc);

alter table public.ci_script_options enable row level security;
alter table public.ci_scripts        enable row level security;
