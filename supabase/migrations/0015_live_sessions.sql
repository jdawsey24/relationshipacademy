-- Live sessions — scheduled/live/replay video sessions for the Academy (gated by
-- membership tier) and the Institute (gated to professionals). The video itself
-- is hosted by a provider (YouTube Live / Vimeo embed, or a Zoom join link);
-- this table holds the metadata + URLs. RLS-locked: read server-side via the
-- service role with access gating in application code (gated content).
-- Safe to run more than once. Run in the Supabase SQL editor.

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  area text not null,                          -- academy | institute
  title text not null,
  description text,
  embed_url text,                              -- YouTube/Vimeo embed (iframe)
  join_url text,                               -- external join link (e.g. Zoom)
  replay_url text,                             -- recording after the session
  scheduled_at timestamptz,
  status text not null default 'scheduled',    -- scheduled | live | ended
  min_tier text not null default 'academy_plus', -- Academy gating (Institute uses is_professional)
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists live_sessions_area_idx on public.live_sessions (area);

alter table public.live_sessions enable row level security;
-- No public policy on purpose: gated content read via the service role in app code.

notify pgrst, 'reload schema';
