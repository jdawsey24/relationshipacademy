-- RLC Studio — Phase D: Asset Library + Recommendation Mapper.
--
-- Two additions:
--  1. studio_assets — a governed, taggable CATALOGUE over the existing "media"
--     Storage bucket (which until now had no DB index). Backfilled from the
--     bucket via an in-app sync; nothing about the bucket itself changes.
--  2. studio_result_recommendations — a governed authoring surface for what the
--     LIVE assessment results page recommends. It mirrors the live public
--     `recommendations` table (which has no admin UI today) + adds status/
--     audience. The owner authors here; a Publish action pushes approved rows to
--     the live `recommendations` table. The live table's schema is NOT changed.
--
-- RLS-locked (service-role reads), idempotent. Run in the Supabase SQL editor.

create table if not exists public.studio_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text unique,                 -- path within the "media" bucket
  file_name text,
  file_url text,                            -- public URL
  title text,
  asset_type text,                          -- image | pdf | document | video | audio | other
  description text,
  audience text,                            -- consumer | academy | institute | clinical | admin
  competency_id text,
  phase text,
  domain text,
  tags text[] not null default '{}',
  size_bytes bigint,
  source text,                              -- bucket_import | upload
  status text not null default 'draft',
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists studio_assets_type_idx on public.studio_assets (asset_type);
create index if not exists studio_assets_status_idx on public.studio_assets (status);
alter table public.studio_assets enable row level security;

create table if not exists public.studio_result_recommendations (
  id uuid primary key default gen_random_uuid(),
  trigger_type text not null,               -- Domain Low | Phase | Risk | ...
  trigger_value text not null,              -- domain name | phase slug | risk level
  recommendation_text text,
  next_step text,
  audience text not null default 'consumer',
  status text not null default 'draft',     -- draft|in_review|approved|published|retired
  notes text,
  sort_order integer not null default 0,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists studio_result_recs_trigger_idx on public.studio_result_recommendations (trigger_type);
create index if not exists studio_result_recs_status_idx on public.studio_result_recommendations (status);
alter table public.studio_result_recommendations enable row level security;

-- No public policies: server-side/service-role access, owner/editor-gated.

notify pgrst, 'reload schema';
