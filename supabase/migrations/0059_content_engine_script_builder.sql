-- Content Engine — Script Builder (owner ruling 14 scope, 2026-08-06).
--
-- SCOPE. Manual intake · bridge and mapping review · content brief · angles ·
-- configuration · dual scripts · packaging · QC · versioned drafts · public-use
-- governance. Trend discovery, scheduling, performance learning and
-- Situation-Registry-driven mapping are deliberately NOT built.
--
-- THE BRIEF IS THE SPINE. Stages 1-5 already have homes: ce_trend_candidates
-- (topic), ce_claims (fact verification), ce_relational_bridges (bridge +
-- graded status + mapping validity). This migration adds what comes after the
-- owner gate: the brief, its angles, the two scripts, their comparison, and the
-- package. Nothing generates without a brief, and the brief records the mapping
-- that was approved rather than re-deriving it.
--
-- WHAT IS NOT STORED HERE. Approved language stays in the Knowledge Base.
-- Publication approval stays in ce_source_use_approvals. A brief records which
-- approved things it used; it is never itself an authority.
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Campaigns — defaults live in a row, not in code
-- ---------------------------------------------------------------------------
create table if not exists public.ce_campaigns (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null unique,
  target_audience     text,
  cta_destination     text,
  primary_keyword     text,
  transformation      text,
  notes               text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

insert into public.ce_campaigns (name, target_audience, cta_destination, primary_keyword, transformation, notes)
values (
  'Relationship Snapshot',
  'Black women',
  '/snapshot',
  'SNAPSHOT',
  'stop guessing, understand her patterns, trust what she sees, make clearer choices',
  'Owner-stated campaign defaults. Defaults, not universal rules — every field is overridable per brief.'
) on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Content brief — the contract for everything downstream
-- ---------------------------------------------------------------------------
create table if not exists public.ce_content_briefs (
  id                        uuid primary key default gen_random_uuid(),

  -- Source and context (stages 1-5, already decided and owner-approved)
  candidate_id              uuid references public.ce_trend_candidates(id) on delete set null,
  bridge_id                 uuid not null references public.ce_relational_bridges(id) on delete cascade,
  content_origin            text not null default 'manual',
  topic                     text not null,
  exact_phrase              text,
  verified_facts            text[] not null default '{}',
  claim_ids                 uuid[] not null default '{}',
  affected_population       text,
  relational_consequence    text,
  content_risk_level        text not null default 'standard',
  -- Kept apart on purpose: what is established vs what the framework reads into it.
  factual_basis             text,
  framework_interpretation  text,

  -- Framework alignment, copied from the APPROVED bridge at brief time so a
  -- later edit to the bridge cannot silently change what a script was built on.
  competency_id             text references public.fw_competencies(competency_id),
  phase_id                  text references public.fw_phases(phase_id),
  domain_id                 text references public.fw_domains(domain_id),
  developmental_task        text,
  source_record             text,
  source_status             text,
  mapping_rationale         text,
  observable_pattern        text,
  approved_public_interpretation text,
  mapping_validated         boolean not null default false,
  publication_eligible      boolean not null default false,

  -- Content strategy / configuration (stage 8)
  campaign_id               uuid references public.ce_campaigns(id),
  content_series_id         uuid references public.ce_content_series(id),
  audience_segment_id       uuid references public.ce_audience_segments(id),
  delivery_profile_id       uuid references public.ce_delivery_profiles(id),
  target_audience           text,
  platform                  text not null default 'instagram',
  script_format             text not null default 'talking_head',
  target_runtime_seconds    integer not null default 60,
  tone                      text,
  content_objective         text,
  cta_destination           text,
  primary_keyword           text,
  supporting_terms          text[] not null default '{}',
  community_keyword         text,
  expert_positioning_level  text not null default 'subtle',
  real_talk_intensity       text,

  -- Workflow
  status                    text not null default 'draft',
  selected_angle_id         uuid,
  created_by                text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_briefs_status_check') then
    alter table public.ce_content_briefs add constraint ce_briefs_status_check
      check (status in ('draft','angles_generated','angle_selected','scripts_generated',
                        'packaged','qc_complete','sent_to_review','abandoned'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ce_briefs_origin_check') then
    alter table public.ce_content_briefs add constraint ce_briefs_origin_check
      check (content_origin in ('manual','evergreen','audience_question','reactive_trend',
                                'predictable_trend','experience_cluster','situation_registry'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ce_briefs_positioning_check') then
    alter table public.ce_content_briefs add constraint ce_briefs_positioning_check
      check (expert_positioning_level in ('none','subtle','explicit','conversion_focused'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ce_briefs_intensity_check') then
    alter table public.ce_content_briefs add constraint ce_briefs_intensity_check
      check (real_talk_intensity is null or real_talk_intensity in ('light','direct','unfiltered'));
  end if;
  -- A brief may not leave 'draft' on an unvalidated mapping. The gate is here as
  -- well as in code because code can be bypassed and a check constraint cannot.
  if not exists (select 1 from pg_constraint where conname = 'ce_briefs_mapping_gate') then
    alter table public.ce_content_briefs add constraint ce_briefs_mapping_gate
      check (status = 'draft' or status = 'abandoned' or mapping_validated = true);
  end if;
end $$;

create index if not exists idx_ce_briefs_status on public.ce_content_briefs (status, updated_at desc);
create index if not exists idx_ce_briefs_bridge on public.ce_content_briefs (bridge_id);

-- ---------------------------------------------------------------------------
-- 3. Angles — 3 to 5 meaningfully different takes on one approved brief
-- ---------------------------------------------------------------------------
create table if not exists public.ce_angles (
  id                    uuid primary key default gen_random_uuid(),
  brief_id              uuid not null references public.ce_content_briefs(id) on delete cascade,
  label                 text not null,
  premise               text not null,
  hook                  text,
  audience_promise      text,
  why_different         text,
  risk_notes            text,
  is_selected           boolean not null default false,
  edited_by_owner       boolean not null default false,
  generation_request_id uuid references public.ai_generation_requests(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists idx_ce_angles_brief on public.ce_angles (brief_id, is_selected);

-- One selected angle per brief, enforced rather than assumed.
create unique index if not exists idx_ce_angles_one_selected
  on public.ce_angles (brief_id) where is_selected;

-- ---------------------------------------------------------------------------
-- 4. Scripts — the two reading levels, drafted INDEPENDENTLY (ruling 9)
-- ---------------------------------------------------------------------------
create table if not exists public.ce_scripts (
  id                       uuid primary key default gen_random_uuid(),
  brief_id                 uuid not null references public.ce_content_briefs(id) on delete cascade,
  angle_id                 uuid references public.ce_angles(id) on delete set null,
  reading_level            text not null,          -- grade5 | higher
  hook                     text,
  body                     text not null,
  cta                      text,
  word_count               integer not null default 0,
  estimated_runtime_seconds integer not null default 0,
  runtime_within_target    boolean not null default false,
  generation_request_id    uuid references public.ai_generation_requests(id) on delete set null,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_scripts_level_check') then
    alter table public.ce_scripts add constraint ce_scripts_level_check
      check (reading_level in ('grade5','higher'));
  end if;
end $$;
create unique index if not exists idx_ce_scripts_brief_level
  on public.ce_scripts (brief_id, reading_level);

-- ---------------------------------------------------------------------------
-- 5. Script comparison (ruling 9)
--    Two distinct questions. Lexical similarity asks "are these the same words";
--    conceptual equivalence asks "are these still the same lesson". A pair can
--    fail either independently, so both are recorded.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_script_comparisons (
  id                     uuid primary key default gen_random_uuid(),
  brief_id               uuid not null references public.ce_content_briefs(id) on delete cascade unique,
  lexical_similarity     numeric(4,3) not null default 0,
  similarity_threshold   numeric(4,3) not null default 0.800,
  similarity_exceeded    boolean not null default false,
  owner_override         boolean not null default false,
  override_reason        text,
  override_by            text,
  override_at            timestamptz,
  lesson_match           boolean,
  reward_match           boolean,
  hook_match             boolean,
  cta_match              boolean,
  equivalence_ok         boolean,
  equivalence_notes      text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

do $$
begin
  -- An exceeded similarity may only be cleared by an explicit, reasoned override.
  if not exists (select 1 from pg_constraint where conname = 'ce_comparisons_override_check') then
    alter table public.ce_script_comparisons add constraint ce_comparisons_override_check
      check (owner_override = false or (override_reason is not null and override_by is not null));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 6. Packaging (stage 10)
-- ---------------------------------------------------------------------------
create table if not exists public.ce_script_packages (
  id                    uuid primary key default gen_random_uuid(),
  brief_id              uuid not null references public.ce_content_briefs(id) on delete cascade unique,
  on_screen_caption     text,
  post_caption          text,
  keywords              text[] not null default '{}',
  hashtags              text[] not null default '{}',
  cta_text              text,
  cta_url               text,
  visual_notes          text[] not null default '{}',
  generation_request_id uuid references public.ai_generation_requests(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 7. RLS. Same posture as the rest of the engine: enabled with no policy, so
--    only the service-role admin client behind the owner+MFA gate can read or
--    write. There is no consumer-facing path to any of this.
-- ---------------------------------------------------------------------------
alter table public.ce_campaigns           enable row level security;
alter table public.ce_content_briefs      enable row level security;
alter table public.ce_angles              enable row level security;
alter table public.ce_scripts             enable row level security;
alter table public.ce_script_comparisons  enable row level security;
alter table public.ce_script_packages     enable row level security;
