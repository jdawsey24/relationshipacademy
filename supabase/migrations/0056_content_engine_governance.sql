-- Content Engine — governance layer (owner rulings 2026-08-06, revisions 1-14).
--
-- REPLACES the earlier unrun draft of 0056. Nothing from that draft was applied.
--
-- THE CENTRAL DISTINCTION (revision 1). Three different things were being
-- conflated, and collapsing them is what made "nothing can publish" look true:
--
--   framework_status    Is the CONSTRUCT canonical? The original 111 competencies
--                       are canonical framework constructs. Recovery and Renewal
--                       have stable canonical IDs. This is about the framework.
--   record_status       Is the competency-DETAIL RECORD finished? Draft (111) or
--                       In Review (44). This is editorial workflow, not framework
--                       authority, and a Draft record does not make the construct
--                       provisional.
--   public_use_approval May THIS source be used for THIS purpose with THIS
--                       audience? Recorded per source, per use. This is the only
--                       one that gates publication.
--
-- Revision 2: the approval table does NOT hold approved language. Consumer
-- Translation, Public or Clinical Boundary, Cautions, Contraindications, Reading
-- Level and Suppression or Safety Logic live in the Master Knowledge Base and
-- nowhere else. This table records WHICH APPROVED VERSION was approved, for what,
-- by whom. A provenance snapshot is retained for audit; it is never read as the
-- source of truth.
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Framework vs record status (revision 1)
-- ---------------------------------------------------------------------------
alter table public.fw_competencies
  add column if not exists framework_status text not null default 'canonical';
alter table public.fw_competencies
  add column if not exists record_status text not null default 'draft';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'fw_competencies_framework_status_check') then
    alter table public.fw_competencies add constraint fw_competencies_framework_status_check
      check (framework_status in ('canonical', 'working', 'retired'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'fw_competencies_record_status_check') then
    alter table public.fw_competencies add constraint fw_competencies_record_status_check
      check (record_status in ('draft', 'in_review', 'approved', 'retired'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Source USE approvals (revisions 2, 3, 4)
--    Broadened beyond competencies: any retrieved source type. Per-source and
--    per-use, so a single competency can be publication-eligible for one
--    audience and not another, and Recovery/Renewal can be released one
--    competency at a time rather than a phase at a time.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_source_use_approvals (
  id                    uuid primary key default gen_random_uuid(),
  source_type           text not null,   -- competency | behavioral_indicator | incomplete_indicator
                                         -- | practice | activity | worksheet | situation | domain | phase
  source_id             text not null,   -- the canonical id, e.g. COM-RECV-001
  -- WHICH approved version was approved. Not the language itself.
  approved_source_version text,
  approved_source_hash  text,            -- hash of the approved KB fields at approval time
  permitted_use         text[] not null default '{}',  -- public_script | public_caption | assessment
                                                        -- | academy | clinical | internal_only
  audience              text[] not null default '{}',  -- consumer | academy | institute | clinical
  restrictions          text,            -- free text: what may NOT be done with it
  reviewer              text not null,
  reviewed_at           timestamptz not null default now(),
  expires_at            timestamptz,     -- optional re-review date
  status                text not null default 'approved',  -- approved | restricted | revoked
  -- Audit only. The Master Knowledge Base remains authoritative for all language.
  provenance_snapshot   jsonb not null default '{}'::jsonb,
  notes                 text,
  created_at            timestamptz not null default now(),
  unique (source_type, source_id, status)
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_source_use_status_check') then
    alter table public.ce_source_use_approvals add constraint ce_source_use_status_check
      check (status in ('approved', 'restricted', 'revoked'));
  end if;
end $$;

create index if not exists idx_ce_source_use on public.ce_source_use_approvals (source_type, source_id, status);

-- ---------------------------------------------------------------------------
-- 3. Taxonomies kept OUT of the framework (revisions 6)
--    Content series is not a phase. Audience segment is not a phase.
--    `ce_life_stages` is deliberately NOT created — "life stage" is not yet
--    operationally distinguished from Structural Context, relationship status,
--    audience segment, or situational tags. Creating it now would bake in the
--    ambiguity. Owner decision pending.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_content_series (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.ce_audience_segments (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. Bridge grading and eligibility (unchanged from the earlier draft)
-- ---------------------------------------------------------------------------
alter table public.ce_relational_bridges
  add column if not exists status text not null default 'weak';
alter table public.ce_relational_bridges
  add column if not exists eligible_for_generation boolean not null default false;
alter table public.ce_relational_bridges
  add column if not exists mapping_valid boolean not null default false;
alter table public.ce_relational_bridges
  add column if not exists mapping_errors text[] not null default '{}';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_bridges_status_check') then
    alter table public.ce_relational_bridges add constraint ce_bridges_status_check
      check (status in ('strong', 'moderate', 'weak', 'forced', 'rejected'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ce_bridges_eligibility_check') then
    alter table public.ce_relational_bridges add constraint ce_bridges_eligibility_check
      check (eligible_for_generation = false
             or (status in ('strong', 'moderate') and mapping_valid = true));
  end if;
end $$;

create index if not exists idx_ce_bridges_eligible
  on public.ce_relational_bridges (candidate_id, eligible_for_generation, status);

-- ---------------------------------------------------------------------------
-- 5. Situation Registry quarantine (revision 5)
--    Competency NAME becomes a display field, never a join key. Only 29 of 60
--    crosswalks resolve to a competency in the phase they claim; 12 names are
--    ambiguous across phases since v2.4. Situations stay usable as raw topic
--    sources; their mappings do not drive anything until re-mapped to IDs.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_situation_crosswalks (
  id                       uuid primary key default gen_random_uuid(),
  framework_map_id         text not null unique,   -- FM-0001
  situation_id             text not null,          -- RS-0001
  claimed_phase_id         text,                   -- as stored in the registry
  claimed_domain_id        text,
  competency_name_display  text,                   -- DISPLAY ONLY. Never a join key.
  resolved_competency_id   text references public.fw_competencies(competency_id),
  quarantine_status        text not null default 'quarantined',
  quarantine_reason        text,
  reviewed_by              text,
  reviewed_at              timestamptz,
  created_at               timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_situation_quarantine_check') then
    alter table public.ce_situation_crosswalks add constraint ce_situation_quarantine_check
      check (quarantine_status in ('quarantined', 'remapped', 'rejected'));
  end if;
  -- A crosswalk may only leave quarantine with a real competency id attached.
  if not exists (select 1 from pg_constraint where conname = 'ce_situation_remap_check') then
    alter table public.ce_situation_crosswalks add constraint ce_situation_remap_check
      check (quarantine_status <> 'remapped' or resolved_competency_id is not null);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 6. Claim-level verification (revision 7)
--    Claim-based, never skipped because a topic is "evergreen". An evergreen
--    script asserting a statistic still asserts a statistic.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_claims (
  id                 uuid primary key default gen_random_uuid(),
  brief_id           uuid,
  claim_text         text not null,
  claim_type         text not null,   -- empirical | statistical | medical | legal
                                      -- | historical | quoted | current_event | interpretation
  verification_status text not null default 'unverified', -- unverified | verified | disputed | withdrawn
  sources            jsonb not null default '[]'::jsonb,
  verified_by        text,
  verified_at        timestamptz,
  event_date         date,
  risk_level         text not null default 'medium',      -- low | medium | high
  recheck_at         date,
  correction_note    text,
  created_at         timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_claims_type_check') then
    alter table public.ce_claims add constraint ce_claims_type_check
      check (claim_type in ('empirical','statistical','medical','legal','historical',
                            'quoted','current_event','interpretation'));
  end if;
end $$;

create index if not exists idx_ce_claims_recheck on public.ce_claims (recheck_at, verification_status);

-- ---------------------------------------------------------------------------
-- 7. Category-sensitive QC blocking (revision 10)
--    Severity alone is not the gate. A HIGH finding in a safety category blocks
--    publication even though it is not labelled critical.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_qc_blocking_rules (
  id             uuid primary key default gen_random_uuid(),
  risk_category  text not null,   -- physical_safety | abuse | coercion | consent | clinical
                                  -- | legal | medical | framework | voice | seo | duplication
  min_severity   text not null,   -- the severity at which this category blocks
  blocks_publication boolean not null default true,
  notes          text,
  unique (risk_category)
);

insert into public.ce_qc_blocking_rules (risk_category, min_severity, blocks_publication, notes) values
  ('physical_safety', 'high',     true,  'Owner ruling: safety categories block at high, not only critical.'),
  ('abuse',           'high',     true,  'Includes coercive control and retaliation risk.'),
  ('coercion',        'high',     true,  null),
  ('consent',         'high',     true,  null),
  ('clinical',        'high',     true,  'Clinician-only material or clinical guidance in consumer copy.'),
  ('legal',           'high',     true,  null),
  ('medical',         'high',     true,  null),
  ('framework',       'critical', true,  'Invalid or invented mapping.'),
  ('voice',           'critical', false, 'Surfaced prominently; owner decides.'),
  ('seo',             'critical', false, null),
  ('duplication',     'critical', false, null)
on conflict (risk_category) do nothing;

-- ---------------------------------------------------------------------------
-- 8. Culture Terms — blocked by default, allowlist by owner approval (rev 11)
-- ---------------------------------------------------------------------------
create table if not exists public.ce_culture_terms (
  id            uuid primary key default gen_random_uuid(),
  term          text not null unique,
  disposition   text not null default 'blocked',  -- blocked | allowed_public | internal_only
  rationale     text,
  approved_by   text,
  approved_at   timestamptz,
  created_at    timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_culture_terms_disposition_check') then
    alter table public.ce_culture_terms add constraint ce_culture_terms_disposition_check
      check (disposition in ('blocked', 'allowed_public', 'internal_only'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 9. Delivery profiles (revision 12) — 150 wpm default, configurable
-- ---------------------------------------------------------------------------
create table if not exists public.ce_delivery_profiles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  words_per_minute integer not null default 150,
  notes         text,
  is_default    boolean not null default false
);

insert into public.ce_delivery_profiles (slug, name, words_per_minute, is_default, notes) values
  ('standard', 'Standard delivery', 150, true,  'Default speaking rate.'),
  ('measured', 'Measured / emphatic', 130, false, 'Slower, for heavier subject matter.'),
  ('brisk',    'Brisk / energetic',   170, false, 'Faster, for quick takes and reactions.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 10. Generation conflicts — stop, never self-correct
-- ---------------------------------------------------------------------------
create table if not exists public.ce_generation_conflicts (
  id                     uuid primary key default gen_random_uuid(),
  generation_request_id  uuid references public.ai_generation_requests(id) on delete set null,
  bridge_id              uuid references public.ce_relational_bridges(id) on delete cascade,
  conflict_type          text not null,
  detected_by            text not null default 'model',
  approved_mapping       jsonb not null default '{}'::jsonb,
  requested_content      text,
  explanation            text not null,
  resolution             text not null default 'unresolved',
  resolved_by            text,
  resolved_at            timestamptz,
  created_at             timestamptz not null default now()
);
create index if not exists idx_ce_conflicts_bridge on public.ce_generation_conflicts (bridge_id, resolution);

-- ---------------------------------------------------------------------------
-- 11. Real Talk — a Content Series with a separate intensity control
-- ---------------------------------------------------------------------------
create table if not exists public.ce_real_talk_briefs (
  id                      uuid primary key default gen_random_uuid(),
  bridge_id               uuid references public.ce_relational_bridges(id) on delete cascade,
  content_series_id       uuid references public.ce_content_series(id),
  audience_segment_id     uuid references public.ce_audience_segments(id),
  intensity               text not null default 'direct',   -- light | direct | unfiltered
  uncomfortable_truth     text,
  audience_description    text,
  common_misunderstanding text,
  necessary_nuance        text,
  relational_mechanism    text,
  consequence             text,
  practical_takeaway      text,
  overgeneralization_risk text,
  rlc_foundation          text,
  -- `unfiltered` additionally requires this check to be recorded.
  reputational_risk_check text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_real_talk_intensity_check') then
    alter table public.ce_real_talk_briefs add constraint ce_real_talk_intensity_check
      check (intensity in ('light', 'direct', 'unfiltered'));
  end if;
  -- Unfiltered cannot be saved without its overgeneralization + reputational check.
  if not exists (select 1 from pg_constraint where conname = 'ce_real_talk_unfiltered_check') then
    alter table public.ce_real_talk_briefs add constraint ce_real_talk_unfiltered_check
      check (intensity <> 'unfiltered'
             or (overgeneralization_risk is not null and reputational_risk_check is not null));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 12. Voice Calibration Library — structure now, content authored by the owner.
--     Owner edits may SUGGEST future voice rules; they never mutate permanent
--     instructions automatically.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_voice_examples (
  id             uuid primary key default gen_random_uuid(),
  facet          text not null,    -- humour | warmth | directness | nuance | authority | cta
  disposition    text not null default 'approved',  -- approved | rejected
  intensity      text,
  platform       text,
  example_text   text not null,
  why_it_works   text,
  owner_edit_of  uuid references public.ce_voice_examples(id),
  edit_rationale text,
  -- A suggestion is inert until a human promotes it into a prompt module.
  promoted_to_rule boolean not null default false,
  approved_by    text,
  approved_at    timestamptz,
  status         text not null default 'draft',
  created_at     timestamptz not null default now()
);
create index if not exists idx_ce_voice_facet on public.ce_voice_examples (facet, disposition, status);

-- ---------------------------------------------------------------------------
-- 13. RLS — enabled, no policy (service-role only; owner+MFA in the app).
-- ---------------------------------------------------------------------------
alter table public.ce_source_use_approvals  enable row level security;
alter table public.ce_content_series        enable row level security;
alter table public.ce_audience_segments     enable row level security;
alter table public.ce_situation_crosswalks  enable row level security;
alter table public.ce_claims                enable row level security;
alter table public.ce_qc_blocking_rules     enable row level security;
alter table public.ce_culture_terms         enable row level security;
alter table public.ce_delivery_profiles     enable row level security;
alter table public.ce_generation_conflicts  enable row level security;
alter table public.ce_real_talk_briefs      enable row level security;
alter table public.ce_voice_examples        enable row level security;

-- ---------------------------------------------------------------------------
-- 14. Import backups — the rollback plan for the v2.4 re-import (revision 13).
--     The pre-import state of every touched row is written here BEFORE any
--     write, so an import can be reversed without a database restore.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_import_backups (
  id            uuid primary key default gen_random_uuid(),
  source        text not null,
  table_name    text not null,
  row_count     integer not null,
  payload       jsonb not null,
  payload_hash  text,
  created_at    timestamptz not null default now()
);
alter table public.ce_import_backups enable row level security;
