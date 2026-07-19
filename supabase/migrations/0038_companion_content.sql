-- Relationship Companion — Phase 1 (2/5): content governance spine.
-- Mirrors the Studio pattern: registry + immutable versions + append-only reviews,
-- with a status ladder and a per-type publisher (projects an approved draft's
-- blocks into an immutable version). Content tables are RLS-locked with NO public
-- policy — read server-side via the service role, gated in app code. Idempotent.

-- The authorable experience record (governance + optional internal RLC metadata).
create table if not exists public.companion_experiences (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  title              text not null,                 -- internal
  consumer_title     text,                          -- consumer-facing (placeholder ok)
  short_description  text,
  est_minutes        smallint,
  mode               text not null default 'guided',-- guided | free
  status             text not null default 'draft', -- draft|internal_review|theory_review|safety_review|approved|published|archived
  current_version    smallint not null default 1,
  published_version  smallint,
  owner              text,
  reviewer           text,
  -- Optional internal RLC metadata (governance/recommendation only; not shown to
  -- consumers unless a record explicitly permits). Status != phase.
  structural_context text,
  phase              text,
  developmental_task text,
  domain             text,
  competency         text,
  situation_category text,
  consumer_topic     text,
  playbook_connection text,
  academy_lesson_connection text,
  recommended_practice text,
  safety_classification text,
  reading_level      text,
  audience           text not null default 'public',-- public | professional
  canonical_source_ref text,
  decision_log_ref   text,
  internal_notes     text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Immutable published snapshots. blocks = ordered [{ type, payload, conditional_on }].
-- Never mutated; editing produces a new version.
create table if not exists public.companion_experience_versions (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  version_no    smallint not null,
  blocks        jsonb not null default '[]'::jsonb,
  authored_by   text,
  created_at    timestamptz not null default now(),
  unique (experience_id, version_no)
);

-- Editable draft blocks for an experience (snapshotted into a version at publish).
create table if not exists public.companion_experience_blocks (
  id             uuid primary key default gen_random_uuid(),
  experience_id  uuid not null references public.companion_experiences(id) on delete cascade,
  block_type     text not null,                     -- one of the 22 registered types
  block_order    smallint not null default 0,
  payload        jsonb not null default '{}'::jsonb,-- placeholder content until approved library supplied
  conditional_on jsonb,                             -- optional {block_ref, equals} display condition
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_companion_blocks_exp on public.companion_experience_blocks (experience_id, block_order);

-- Reusable block library (author drops a template into an experience).
create table if not exists public.companion_reusable_block_templates (
  id             uuid primary key default gen_random_uuid(),
  block_type     text not null,
  label          text not null,
  default_payload jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

-- Category / topic taxonomy (self-referencing for top-level vs sub).
create table if not exists public.companion_experience_categories (
  id            uuid primary key default gen_random_uuid(),
  key           text unique not null,
  label         text not null,
  parent_id     uuid references public.companion_experience_categories(id),
  display_order smallint not null default 0,
  created_at    timestamptz not null default now()
);

-- Append-only per-experience workflow / review log (mirrors studio_reviews).
create table if not exists public.companion_content_reviews (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.companion_experiences(id) on delete cascade,
  actor         text,
  action        text not null,                      -- submit_for_review|approve|request_changes|publish|unpublish|archive|save_draft
  from_status   text,
  to_status     text,
  note          text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_companion_reviews_exp on public.companion_content_reviews (experience_id, created_at desc);

-- RLS: content is service-role only (no public policy) — gated in app code.
alter table public.companion_experiences               enable row level security;
alter table public.companion_experience_versions       enable row level security;
alter table public.companion_experience_blocks         enable row level security;
alter table public.companion_reusable_block_templates  enable row level security;
alter table public.companion_experience_categories     enable row level security;
alter table public.companion_content_reviews           enable row level security;

notify pgrst, 'reload schema';
