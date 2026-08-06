-- Knowledge Base — narrative layer (owner-authored, 2026-08-06).
--
-- WHAT THIS IS. Two governed layers requested by the framework author: one master
-- narrative record per canonical phase, and one per phase-domain pair. Together
-- they are the PUBLIC-FACING NARRATIVE EXPRESSION of a phase — the consumer voice
-- of material that exists elsewhere only as framework constructs and clinician
-- notes.
--
-- WHY IT IS A SOURCE, NOT A DERIVATIVE. These records are authored by the
-- framework author and carry approved language. They are Knowledge Base source
-- material, which is why they live under `kb_` and not `ce_`: the Content Engine
-- reads them, and may never write them.
--
-- HOW IT RELATES TO THE OTHER STATUS COLUMNS. Same three-way split as 0056.
--   framework_status  is the CONSTRUCT canonical
--   record_status     is the RECORD editorially finished
--   publication        is governed ONLY by ce_source_use_approvals, using
--                      source_type 'phase_narrative' / 'phase_domain_narrative'
--                      and the record's own id.
--
-- WHAT IT DOES NOT DO. It does not supply competency-level narrative. The 44
-- Recovery and Renewal competencies still have no rows in kb_competencies, so
-- validateMapping() will keep refusing to source from them. This layer answers
-- "what is Recovery about, in consumer language"; it does not answer "what does
-- COM-RECV-001 say".
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Phase narrative — one master record per canonical phase
-- ---------------------------------------------------------------------------
create table if not exists public.kb_phase_narratives (
  id                        uuid primary key default gen_random_uuid(),

  -- Canonical anchors. `phase` must match fw_phases.name; developmental_task is
  -- stored so a narrative record that drifts from canon is detectable rather
  -- than merely wrong.
  phase                     text not null unique,
  developmental_task        text not null,
  primary_unit_of_analysis  text not null,   -- individual | dyad | system

  -- Consumer-facing frame
  consumer_phase_name       text not null,   -- e.g. "Getting Back to Yourself"
  core_human_question       text not null,
  lived_experience_summary  text,
  core_tension              text,
  developmental_explanation text,

  -- Transformation, held as two ordered lists rather than prose so that a
  -- script can cite a single movement without quoting the whole passage.
  transformation_from       text[] not null default '{}',
  transformation_toward     text[] not null default '{}',

  -- What every downstream artifact must preserve. These are invariants, not
  -- guidance: QC checks read this column directly.
  governing_narrative_truths text[] not null default '{}',

  common_misconceptions     text[] not null default '{}',
  signs_of_movement         text[] not null default '{}',
  signs_constrained         text[] not null default '{}',

  -- Safety and suitability. These are the fields that are 0/155 at competency
  -- level; authoring them here is what makes a phase usable in public content.
  safety_boundaries         text[] not null default '{}',
  public_or_clinical_boundary text,
  reading_level             text,
  approved_language         text[] not null default '{}',
  prohibited_reductions     text[] not null default '{}',

  -- Provenance
  source_provenance         text,
  source_version            text,
  source_hash               text,

  framework_status          text not null default 'canonical',
  record_status             text not null default 'draft',

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'kb_phase_narratives_framework_status_check') then
    alter table public.kb_phase_narratives add constraint kb_phase_narratives_framework_status_check
      check (framework_status in ('canonical', 'working', 'retired'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'kb_phase_narratives_record_status_check') then
    alter table public.kb_phase_narratives add constraint kb_phase_narratives_record_status_check
      check (record_status in ('draft', 'in_review', 'approved', 'retired'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'kb_phase_narratives_unit_check') then
    alter table public.kb_phase_narratives add constraint kb_phase_narratives_unit_check
      check (primary_unit_of_analysis in ('individual', 'dyad', 'system'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Phase-domain narrative — one record per (phase, domain)
-- ---------------------------------------------------------------------------
create table if not exists public.kb_phase_domain_narratives (
  id                        uuid primary key default gen_random_uuid(),

  phase                     text not null,
  domain                    text not null,

  domain_storyline          text not null,   -- e.g. "Finding words for what happened"
  consumer_problem_language text[] not null default '{}',
  internal_questions        text[] not null default '{}',
  emotional_experience      text,
  observable_patterns       text[] not null default '{}',
  developmental_interpretation text,

  -- IDS, NOT NAMES. Consistent with the Situation Registry ruling: a display
  -- name is never a join key. `competency_names_display` exists so a reviewer can
  -- read the record without a join, and is never resolved against.
  competency_ids            text[] not null default '{}',
  competency_names_display  text[] not null default '{}',

  healthy_narrative_movement      text,
  common_distorted_interpretation text,
  content_themes            text[] not null default '{}',
  next_step_language        text,

  -- Safety and suppression at storyline level. A rule here applies to every
  -- piece of content generated from this storyline.
  safety_rules              text[] not null default '{}',
  suppression_rules         text[] not null default '{}',

  source_provenance         text,
  record_status             text not null default 'draft',

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),

  unique (phase, domain)
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'kb_phase_domain_narratives_record_status_check') then
    alter table public.kb_phase_domain_narratives add constraint kb_phase_domain_narratives_record_status_check
      check (record_status in ('draft', 'in_review', 'approved', 'retired'));
  end if;
end $$;

create index if not exists idx_kb_phase_domain_narratives_phase
  on public.kb_phase_domain_narratives (phase);

-- ---------------------------------------------------------------------------
-- 3. RLS. Same posture as every other governed table: enabled with no policy,
--    so only the service-role admin client reads or writes.
-- ---------------------------------------------------------------------------
alter table public.kb_phase_narratives        enable row level security;
alter table public.kb_phase_domain_narratives enable row level security;

-- ---------------------------------------------------------------------------
-- 4. NOT DONE HERE, deliberately.
--
--    The legacy `domains` table still carries "Relational Functioning" while
--    fw_domains carries the corrected "Role Functioning". The narrative records
--    seeded against this migration use the corrected name, matching fw_domains
--    and the authored canon. Renaming the assessment-facing `domains` row is a
--    separate, owner-approved change with its own blast radius — it is NOT
--    bundled into this migration.
-- ---------------------------------------------------------------------------
