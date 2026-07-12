-- RLC Studio — Phase C: Learning Library authoring layer.
--
-- Imports + governs the rest of the RLC Knowledge Base workbook: the
-- competency-keyed learning content (interventions, practices, activities,
-- worksheets, conversation guides, journal prompts, videos, Academy lessons,
-- courses) plus the behavioral / incomplete developmental indicators.
--
-- AUTHORING layer only: nothing here publishes into the LIVE Academy tables
-- (courses/modules/lessons/workbooks that paying members see) — that projection
-- is a deliberate, separate future step. All tables RLS-locked with NO public
-- policy (service-role reads), business-ID PKs (RLC IDs preserved), a governance
-- `status`, and a `detail jsonb` holding the long tail of workbook columns.
-- Idempotent + safe to re-run. Run in the Supabase SQL editor.

-- Shared column shape (repeated per table): <pk> text primary key, plus
-- competency_id / phase / domain / audience / status / detail jsonb / updated_by
-- / created_at / updated_at, and a few typed content columns per type.

create table if not exists public.studio_interventions (
  intervention_id text primary key,
  name text, competency_id text, phase text, domain text, audience text,
  category text, delivery_format text, overview text, difficulty text,
  estimated_duration text, facilitator_instructions text, participant_instructions text,
  homework text, debrief_questions text, success_indicators text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_practices (
  practice_id text primary key,
  name text, competency_id text, phase text, domain text, audience text,
  practice_type text, instructions text, reflection_prompt text,
  estimated_duration text, recommended_frequency text, success_indicators text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_activities (
  activity_id text primary key,
  name text, competency_id text, phase text, domain text, audience text,
  activity_type text, materials_needed text, facilitator_instructions text,
  participant_instructions text, debrief_questions text, success_indicators text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_worksheets (
  worksheet_id text primary key,
  title text, competency_id text, phase text, domain text, audience text,
  purpose text, location text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_conversation_guides (
  guide_id text primary key,
  title text, competency_id text, phase text, domain text, audience text,
  purpose text, location text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_journal_prompts (
  prompt_id text primary key,
  title text, prompt text, competency_id text, phase text, domain text, audience text,
  use_case text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_videos (
  video_id text primary key,
  title text, competency_id text, phase text, domain text, audience text,
  video_type text, learning_objective text, location text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_lessons (
  lesson_id text primary key,
  title text, course_id text, competency_ids text, phase text, domain text, audience text,
  learning_objective text, content_type text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_courses (
  course_id text primary key,
  name text, domain text, phase text, description text, version text,
  status text not null default 'draft', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_behavioral_indicators (
  behavior_id text primary key,
  competency_id text, phase text, domain text, competency text,
  indicator text, evidence_level text, observable_notes text,
  status text not null default 'active', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.studio_incomplete_indicators (
  indicator_id text primary key,
  competency_id text, phase text, domain text, competency text,
  indicator text, notes text,
  status text not null default 'active', detail jsonb not null default '{}'::jsonb,
  updated_by text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- Indexes + RLS. status index + RLS on every table; competency_id index on the
-- competency-keyed tables only (studio_courses is keyed by domain/phase, not a
-- single competency).
do $$
declare t text;
begin
  foreach t in array array[
    'studio_interventions','studio_practices','studio_activities','studio_worksheets',
    'studio_conversation_guides','studio_journal_prompts','studio_videos','studio_lessons',
    'studio_courses','studio_behavioral_indicators','studio_incomplete_indicators'
  ] loop
    execute format('create index if not exists %I on public.%I (status)', t||'_status_idx', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
  -- competency_id index only on the single-competency tables. studio_courses is
  -- keyed by domain/phase; studio_lessons uses competency_ids (plural) — neither
  -- has a competency_id column.
  foreach t in array array[
    'studio_interventions','studio_practices','studio_activities','studio_worksheets',
    'studio_conversation_guides','studio_journal_prompts','studio_videos',
    'studio_behavioral_indicators','studio_incomplete_indicators'
  ] loop
    execute format('create index if not exists %I on public.%I (competency_id)', t||'_competency_idx', t);
  end loop;
end $$;

-- No public policies: all access server-side via the service role, owner/editor-gated.

notify pgrst, 'reload schema';
