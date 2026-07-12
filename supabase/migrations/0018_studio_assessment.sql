-- RLC Studio — Phase B: Assessment authoring layer.
--
-- Adds Studio-governed tables that mirror the RLC assessment architecture (the
-- item bank, response models, scoring/interpretation/results/recommendation
-- blueprints) plus a richer Knowledge Base. This is an AUTHORING layer: the
-- owner finishes designing the instrument here. NOTHING published from these
-- tables touches the live scoring engine (questions/result_levels/risk_levels)
-- — that projection is a deliberate, separate future phase.
--
-- All tables RLS-locked with NO public policy (service-role reads only), like
-- 0017. Business IDs from the source workbook are the primary keys (RLC IDs
-- preserved). Idempotent + safe to run more than once. Run in Supabase SQL editor.

-- --- Knowledge Base: hold the full 62-field competency profile ----------------
alter table public.kb_competencies add column if not exists detail jsonb not null default '{}'::jsonb;
alter table public.kb_competencies add column if not exists purpose text;

-- --- Governance defaults shared by the assessment tables ----------------------
-- status: draft | in_review | approved | published | retired   (editors draft,
-- owner approves — enforced in the API layer).

-- 01_Assessment_Inventory -> the instrument definitions
create table if not exists public.studio_assessments (
  assessment_id text primary key,                -- e.g. ASM-SNAPSHOT-001
  name text not null,
  audience text,
  purpose text,
  delivery_mode text,
  estimated_items text,
  estimated_time text,
  primary_outputs text,
  scoring_level text,
  current_stage text,
  launch_priority text,
  requires_partner_data text,
  requires_clinician_data text,
  notes text,
  status text not null default 'draft',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.studio_assessments enable row level security;

-- 05_Response_Models
create table if not exists public.studio_response_models (
  response_model_id text primary key,            -- RM-FREQ-001
  name text not null,
  use_case text,
  response_options jsonb not null default '[]'::jsonb,
  numeric_coding jsonb not null default '[]'::jsonb,
  scoring_direction text,
  missing_handling text,
  consumer_labeling text,
  professional_notes text,
  status text not null default 'draft',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.studio_response_models enable row level security;

-- 04A_Item_Bank_Behavioral -> the candidate item bank (~1,665 rows)
create table if not exists public.studio_assessment_items (
  item_id text primary key,                      -- ASM-000001
  assessment_id text,
  competency_id text,
  competency text,
  domain text,                                   -- slug (role_functioning canonical)
  phase text,                                    -- slug
  behavior_id text,
  behavioral_indicator text,
  item_family text,
  item_type text,                                -- Behavioral | Reverse-Scored | ...
  candidate_number text,
  item_text text,
  consumer_item_text text,
  professional_item_text text,
  response_model text,                           -- RM-FREQ-001
  reverse_scored boolean not null default false,
  evidence_strength text,
  face_validity_notes text,
  audience text,
  reading_level text,
  scoring_direction text,
  status text not null default 'draft',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists studio_items_competency_idx on public.studio_assessment_items (competency_id);
create index if not exists studio_items_domain_idx on public.studio_assessment_items (domain);
create index if not exists studio_items_phase_idx on public.studio_assessment_items (phase);
create index if not exists studio_items_status_idx on public.studio_assessment_items (status);
alter table public.studio_assessment_items enable row level security;

-- 06_Scoring_Rules
create table if not exists public.studio_scoring_rules (
  scoring_rule_id text primary key,
  assessment_id text,
  score_name text,
  score_type text,
  level text,
  input_entity text,
  input_ids text,
  formula_logic text,
  min_valid_responses text,
  missing_data_rule text,
  direction text,
  display_to_consumer text,
  validation_status text,
  cut_points_status text,
  cut_points jsonb not null default '[]'::jsonb,  -- band definitions once established
  version text,
  notes text,
  status text not null default 'draft',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.studio_scoring_rules enable row level security;

-- 07_Interpretation_Rules
create table if not exists public.studio_interpretation_rules (
  interpretation_rule_id text primary key,
  assessment_id text,
  rule_name text,
  trigger_type text,
  trigger_inputs text,
  rule_logic text,
  interpretation_category text,
  consumer_interpretation text,
  professional_interpretation text,
  priority text,
  suppression_conditions text,
  safety_escalation text,
  validation_status text,
  notes text,
  status text not null default 'draft',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.studio_interpretation_rules enable row level security;

-- 09_Results_Templates
create table if not exists public.studio_results_templates (
  template_section_id text primary key,
  assessment_id text,
  section_order integer,
  section_name text,
  audience text,
  display_condition text,
  required_inputs text,
  consumer_heading text,
  consumer_copy_template text,
  professional_notes text,
  cta text,
  notes text,
  status text not null default 'draft',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.studio_results_templates enable row level security;

-- 08_Recommendation_Mappings (+ KB 16_Recommendation_Rules)
create table if not exists public.studio_recommendation_mappings (
  mapping_id text primary key,
  assessment_id text,
  trigger_type text,
  trigger_value text,
  competency_id text,
  structural_context text,
  phase_context text,
  priority text,
  recommendation_type text,
  recommendation_id text,
  recommendation_name text,
  consumer_rationale text,
  professional_rationale text,
  trigger_metric text,
  trigger_comparator text,
  trigger_threshold text,
  suppression_logic text,
  escalation_logic text,
  audience text,
  status text not null default 'draft',
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists studio_recmap_competency_idx on public.studio_recommendation_mappings (competency_id);
alter table public.studio_recommendation_mappings enable row level security;

-- Shared lookup / enum reference (from both workbooks' Lookups sheets)
create table if not exists public.studio_lookups (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  value text not null,
  code text,
  definition text,
  active boolean not null default true,
  sort_order integer not null default 0,
  unique (category, value)
);
create index if not exists studio_lookups_category_idx on public.studio_lookups (category);
alter table public.studio_lookups enable row level security;

-- No public RLS policies: all access is server-side via the service role,
-- owner/editor-gated in the app.

notify pgrst, 'reload schema';
