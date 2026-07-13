-- RLC — Assessment Assembly Engine (build-only): Specification → Measurement
-- Model → deterministic Assembly. Canonical measurement architecture: define the
-- construct + intended outcomes, DERIVE the required evidence, then deterministically
-- assemble the smallest highest-quality set of APPROVED items that satisfies it.
--
-- Additive + governed (versioned/approved/append-only). NO alter of the item bank
-- content and NOTHING here touches the live 47-item Snapshot consumer path
-- (lib/scoring.ts, app/api/score, app/api/results). RLS-locked (owner/editor via
-- service role). Idempotent. Run in the Supabase SQL editor.

-- 1) Structured Specification carried on the existing instrument registry (additive).
alter table public.studio_assessments add column if not exists structural_context text;
alter table public.studio_assessments add column if not exists target_reading_level text;
alter table public.studio_assessments add column if not exists target_completion_minutes numeric;
alter table public.studio_assessments add column if not exists desired_outputs text[] not null default '{}';
alter table public.studio_assessments add column if not exists design_constraints jsonb not null default '{}'::jsonb;

-- 2) Measurement Model — the derived scientific blueprint (evidence requirements).
create table if not exists public.studio_assessment_measurement_models (
  id uuid primary key default gen_random_uuid(),
  assessment_id  text not null,
  version_no     int not null default 1,
  status         text not null default 'draft',          -- draft|approved|superseded|retired
  derived_from_spec_at timestamptz,
  required_competencies         text[] not null default '{}',
  required_behavioral_indicators text[] not null default '{}',
  required_domains              text[] not null default '{}',
  required_phases               text[] not null default '{}',
  outcome_requirements jsonb not null default '[]'::jsonb, -- per desired output → constructs + min evidence
  coverage_policy      jsonb not null default '{}'::jsonb, -- min items/competency, reverse/phase-anchored targets
  rationale     text,
  effective_from timestamptz,
  effective_to   timestamptz,
  created_by text, approved_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sa_measurement_models_assessment_idx on public.studio_assessment_measurement_models (assessment_id);
create index if not exists sa_measurement_models_status_idx     on public.studio_assessment_measurement_models (status);
create unique index if not exists sa_measurement_models_current_uniq
  on public.studio_assessment_measurement_models (assessment_id)
  where status = 'approved' and effective_to is null;
alter table public.studio_assessment_measurement_models enable row level security;

-- 3) Assembly run — immutable audit record (reproducibility + report).
create table if not exists public.studio_assessment_assemblies (
  id uuid primary key default gen_random_uuid(),
  assessment_id       text not null,
  measurement_model_id uuid,
  model_version       int,
  engine_version      text not null,
  inputs_fingerprint  text not null,        -- stable hash of Model + sorted eligible items → same inputs, same instrument
  outcome_fulfilled   boolean not null default false,
  stats               jsonb not null default '{}'::jsonb,
  report_markdown     text,
  status              text not null default 'draft',
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists sa_assemblies_assessment_idx on public.studio_assessment_assemblies (assessment_id);
alter table public.studio_assessment_assemblies enable row level security;

-- 4) Membership — the selected item set (junction; items reusable across instruments).
create table if not exists public.studio_assessment_membership (
  id uuid primary key default gen_random_uuid(),
  assessment_id  text not null,
  item_id        text not null,             -- → approved studio_assessment_items.item_id
  measurement_model_id uuid,
  assembly_id    uuid,
  position       int not null default 0,
  source         text not null default 'assembled',   -- assembled|manual
  satisfies      jsonb not null default '{}'::jsonb,   -- required constructs this item covers
  selection_reason text,
  status         text not null default 'draft',
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists sa_membership_assessment_idx on public.studio_assessment_membership (assessment_id);
create index if not exists sa_membership_item_idx        on public.studio_assessment_membership (item_id);
-- One approved membership per (assessment, item). A pending draft proposal may
-- coexist with the current approved set during review, so the index is
-- approved-only (drafts are replaced wholesale on each run).
create unique index if not exists sa_membership_approved_uniq
  on public.studio_assessment_membership (assessment_id, item_id)
  where status = 'approved' and source = 'assembled';
alter table public.studio_assessment_membership enable row level security;

-- No public policies on any table: service-role/admin only (owner approves; editors draft).

notify pgrst, 'reload schema';
