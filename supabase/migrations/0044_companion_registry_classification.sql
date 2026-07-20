-- Relationship Situation Registry — CLASSIFICATION LAYER (Companion-owned: how
-- users find content) + the instructional-layer Experience Type lookup it
-- references. Situation IDs are PERMANENT (RS-####), never reused. Separate tables
-- from the framework layer — the two meet only in the crosswalk (0045). Additive,
-- idempotent, RLS-locked (service-role; content is gated in app code).

-- Instructional-layer lookup (kept its own table; referenced by situations).
create table if not exists public.reg_experience_types (
  experience_type_id text primary key,               -- ET-001..ET-005 (Prepare/Process/Decide/Build/Celebrate)
  name               text not null,
  definition         text
);

-- 5 canonical Companion relationship statuses (map onto framework Structural
-- Markers; Separation is framework-only, not a Companion status).
create table if not exists public.reg_relationship_statuses (
  status_key    text primary key,                    -- single|dating|committed|engaged|married
  name          text not null,
  display_order smallint not null default 0
);

-- 14 consumer-facing situation categories (classification layer — NOT framework
-- domains, even where names resemble them).
create table if not exists public.reg_situation_categories (
  category_id   text primary key,                    -- CAT-001..CAT-014
  name          text not null,
  display_order smallint not null default 0
);

create table if not exists public.reg_situations (
  id                        uuid primary key default gen_random_uuid(),
  situation_id              text unique not null,     -- PERMANENT RS-####, never reused
  official_title            text not null,
  short_title               text,
  definition                text,
  user_need                 text,
  primary_status_key        text references public.reg_relationship_statuses(status_key),
  current_focus             text,                     -- e.g. 'considering_dating' under Single (consumer branch, not a status)
  primary_category_id       text references public.reg_situation_categories(category_id),
  primary_experience_type_id text references public.reg_experience_types(experience_type_id),
  publication_status        text not null default 'Draft',
  version                   text,
  record_owner              text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Additional applicable statuses (M2M).
create table if not exists public.reg_situation_statuses (
  situation_id text not null references public.reg_situations(situation_id) on delete cascade,
  status_key   text not null references public.reg_relationship_statuses(status_key),
  primary key (situation_id, status_key)
);

-- Optional secondary categories (M2M).
create table if not exists public.reg_situation_categories_map (
  situation_id text not null references public.reg_situations(situation_id) on delete cascade,
  category_id  text not null references public.reg_situation_categories(category_id),
  is_primary   boolean not null default false,
  primary key (situation_id, category_id)
);

-- Immutable version history (permanent RS-#### retained across title/field edits).
create table if not exists public.reg_situation_versions (
  id              uuid primary key default gen_random_uuid(),
  situation_id    text not null references public.reg_situations(situation_id) on delete cascade,
  version         text,
  effective_date  text,
  summary         text,
  approved_by     text,
  resulting_status text,
  created_at      timestamptz not null default now()
);

alter table public.reg_experience_types        enable row level security;
alter table public.reg_relationship_statuses   enable row level security;
alter table public.reg_situation_categories    enable row level security;
alter table public.reg_situations              enable row level security;
alter table public.reg_situation_statuses      enable row level security;
alter table public.reg_situation_categories_map enable row level security;
alter table public.reg_situation_versions      enable row level security;

notify pgrst, 'reload schema';
