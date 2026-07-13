-- RLC Relationship Snapshot™ — deterministic scoring system (build-only).
--
-- Executable scoring layer for the STUDIO-authored assessment. Extends the
-- existing rule authoring tables and adds the normalized runtime/result tables.
-- All thresholds are PROVISIONAL until the owner reviews the rules and approves
-- the simulation. RLS-locked (owner-only via service role). Nothing here scores
-- public users. The live 47-item Snapshot (lib/scoring.ts) is untouched.
-- Idempotent. Run in the Supabase SQL editor.

-- Extend the rule authoring tables (reuse — already wired to editors/AI review).
alter table public.studio_scoring_rules add column if not exists formula_type text;
alter table public.studio_scoring_rules add column if not exists formula_config jsonb not null default '{}'::jsonb;
alter table public.studio_interpretation_rules add column if not exists trigger_config jsonb not null default '{}'::jsonb;
alter table public.studio_interpretation_rules add column if not exists suppression_config jsonb not null default '{}'::jsonb;

-- Inputs that feed a scoring rule (items/indicators/competencies/domains + weights).
create table if not exists public.studio_scoring_rule_inputs (
  id uuid primary key default gen_random_uuid(),
  scoring_rule_id text not null,
  input_type text not null,                 -- item | behavioral_indicator | competency | domain
  input_id text not null,
  weight numeric not null default 1,
  reverse_scored boolean not null default false,  -- reverse only when explicitly approved here
  required boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists studio_sri_rule_idx on public.studio_scoring_rule_inputs (scoring_rule_id);
alter table public.studio_scoring_rule_inputs enable row level security;

-- Phase-anchored response-option → canonical phase-code mapping (explicit).
create table if not exists public.studio_phase_option_mappings (
  id uuid primary key default gen_random_uuid(),
  item_id text not null,
  response_option_id text not null,
  phase_code text not null,
  score_value numeric,
  structural_context_condition text,
  version text default 'v1',
  created_at timestamptz not null default now()
);
create index if not exists studio_pom_item_idx on public.studio_phase_option_mappings (item_id);
alter table public.studio_phase_option_mappings enable row level security;

-- Developmental incongruence rules (rule-based flags; descriptive, versioned).
create table if not exists public.studio_incongruence_rules (
  id uuid primary key default gen_random_uuid(),
  rule_name text,
  structural_context text,                  -- Single | Dating | Committed Relationship | Engaged | Married | *
  compared_phase text,
  condition_config jsonb not null default '{}'::jsonb,
  severity text,
  consumer_language text,
  professional_language text,
  version text default 'v1',
  status text not null default 'draft',
  validation_status text not null default 'provisional',
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.studio_incongruence_rules enable row level security;

-- Attempts — SIMULATION runs only (no public respondents). Structural context is
-- collected here, never inferred from responses.
create table if not exists public.studio_assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  assessment_id text,
  structural_context text,
  structural_history jsonb not null default '{}'::jsonb,
  acknowledged_transition text,
  responses jsonb not null default '{}'::jsonb,
  kind text not null default 'simulation',
  created_by text,
  created_at timestamptz not null default now()
);
alter table public.studio_assessment_attempts enable row level security;

-- Score results (traceable: rule_version + valid_response_count + confidence).
create table if not exists public.studio_score_results (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.studio_assessment_attempts(id) on delete cascade,
  scoring_rule_id text,
  score_name text,
  score_level text,                         -- item | competency | domain | phase
  entity_id text,
  raw_score numeric,
  transformed_score numeric,
  valid_response_count integer,
  confidence_status text,                   -- ok | suppressed | insufficient
  rule_version text,
  created_at timestamptz not null default now()
);
create index if not exists studio_score_results_attempt_idx on public.studio_score_results (attempt_id);
alter table public.studio_score_results enable row level security;

-- Findings (the primary outputs).
create table if not exists public.studio_assessment_findings (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.studio_assessment_attempts(id) on delete cascade,
  finding_type text not null,               -- structural_context | phase_alignment | domain_functioning | incongruence | expiration_risk | strength | growth_priority | next_step
  finding_key text,
  priority integer,
  source_score_ids jsonb not null default '[]'::jsonb,
  interpretation_rule_id text,
  consumer_summary text,
  created_at timestamptz not null default now()
);
create index if not exists studio_findings_attempt_idx on public.studio_assessment_findings (attempt_id);
alter table public.studio_assessment_findings enable row level security;

-- Recommendation results (Finding → mapping → approved published asset).
create table if not exists public.studio_recommendation_results (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.studio_assessment_attempts(id) on delete cascade,
  finding_id uuid,
  recommendation_mapping_id text,
  asset_type text,
  asset_id text,
  rank integer,
  suppression_status text,                  -- active | suppressed
  suppression_reason text,
  created_at timestamptz not null default now()
);
create index if not exists studio_rec_results_attempt_idx on public.studio_recommendation_results (attempt_id);
alter table public.studio_recommendation_results enable row level security;

notify pgrst, 'reload schema';
