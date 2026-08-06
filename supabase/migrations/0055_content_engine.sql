-- Relationship Life Cycle™ Content Engine — Phase 1 (internal foundation).
--
-- An owner-only research → mapping → drafting layer that EXTENDS the existing
-- AI Studio. It deliberately creates NO new source of framework truth:
--
--   * competencies  -> FK to fw_competencies(competency_id)   [canonical core records]
--   * phases        -> FK to fw_phases(phase_id)
--   * domains       -> FK to fw_domains(domain_id)
--   * narrative     -> read at runtime from kb_competencies WHERE kind='competency'
--                      (the 22_Competency_Details equivalent). NOT copied here.
--
-- Generation, drafts, provenance, QC and approvals reuse the existing ai_* tables
-- from 0022 (ai_generation_requests / _outputs / _sources / ai_content_drafts /
-- ai_quality_checks / ai_approval_events / prompt_templates). The only change to
-- those is two columns on ai_content_drafts for versioned regeneration.
--
-- PHASE TAGS ARE PRESERVED. The keyword workbook carries compound tags such as
-- "Exploration / Exclusivity" and "Trust / Communication". Those strings are kept
-- verbatim in *_raw columns; the resolved id arrays are derived, never a lossy
-- single-value coercion.
--
-- RLS: enabled with NO policy on every table — service-role writes only, owner+MFA
-- enforced in the app (requireAiOwner). Same posture as 0022_ai_studio.sql.
--
-- Idempotent. Safe to re-run. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Platform keyword bank (from RLC_Cross_Platform_Keyword_System.xlsx)
--    ONE ROW PER PLATFORM. The seven sheets have genuinely different schemas
--    (Threads = conversation phrase; TikTok = spoken natural-language query;
--    YouTube = long-tail search title; LinkedIn = professional problem framing;
--    Pinterest = evergreen search). They are NOT collapsed into a generic list —
--    `primary_phrase` holds that platform's native phrasing and `phrase_kind`
--    records which kind it is.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_platform_keywords (
  id                  uuid primary key default gen_random_uuid(),
  platform            text not null,                 -- threads|instagram|tiktok|youtube|linkedin|x|pinterest
  rank                integer,
  primary_phrase      text not null,                 -- the platform-native phrase
  phrase_kind         text,                          -- conversation|spoken_query|search_title|professional|evergreen
  signal_role         text,                          -- e.g. 'Live-capable' (Threads)
  audience_doorway    text,
  rlc_interpretation  text,
  opening_use         text,
  supporting_terms    text[] not null default '{}',
  best_format         text,
  cta_fit             text,
  -- Framework tags: raw string preserved, resolved ids derived.
  phase_raw           text,
  phase_ids           text[] not null default '{}',  -- resolved fw_phases.phase_id values
  domain_raw          text,
  domain_ids          text[] not null default '{}',  -- resolved fw_domains.domain_id values
  -- Directional planning scores from the workbook. NOT platform search volume.
  score_audience      smallint,
  score_platform      smallint,
  score_rlc           smallint,
  score_conversion    smallint,
  score_momentum      smallint,
  opportunity_score   numeric,
  priority_tier       text,
  source_sheet        text,                          -- provenance back to the workbook
  source_row          integer,
  status              text not null default 'active',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (platform, primary_phrase)
);
create index if not exists idx_ce_keywords_platform on public.ce_platform_keywords (platform, rank);
create index if not exists idx_ce_keywords_tier     on public.ce_platform_keywords (priority_tier);

-- ---------------------------------------------------------------------------
-- 2. Communities — a DISTINCT ROUTING LAYER, not hashtags.
--    NOTE: the workbook supplies community keywords for THREADS ONLY (10 values)
--    and carries NONE of the attributes below. They are nullable on purpose and
--    are owner-authored in the UI. Nothing here is invented at import time.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_communities (
  id                uuid primary key default gen_random_uuid(),
  platform          text not null,
  community_keyword text not null,
  official_status   text not null default 'unknown', -- official|informal|unknown
  verified          boolean not null default false,
  audience_overlap  text,
  rlc_relevance     text,
  authority_fit     text,
  trend_potential   text,
  usage_guidance    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (platform, community_keyword)
);

create table if not exists public.ce_community_keywords (
  community_id uuid not null references public.ce_communities(id) on delete cascade,
  keyword_id   uuid not null references public.ce_platform_keywords(id) on delete cascade,
  primary key (community_id, keyword_id)
);

-- ---------------------------------------------------------------------------
-- 3. Trend candidates. Phase 1 populates these by MANUAL ENTRY only; the
--    provider columns exist so Phase 2 discovery slots in without a migration.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_trend_candidates (
  id                     uuid primary key default gen_random_uuid(),
  canonical_name         text not null,
  dedupe_key             text not null unique,       -- normalized; merges re-entry of the same topic
  entry_mode             text not null default 'manual',  -- manual|web_search|youtube|threads
  raw_input              text,                       -- EXACTLY what was pasted. Untrusted: treated as data, never instruction.
  community_seen         text,                       -- "the Community where I saw it"
  exact_phrase           text,
  related_phrases        text[] not null default '{}',
  affected_population    text,
  relational_consequence text,
  status                 text not null default 'new',-- new|researched|bridged|generated|skipped
  skip_reason            text,
  first_observed_at      timestamptz,
  last_validated_at      timestamptz,
  created_by             text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists idx_ce_trends_status on public.ce_trend_candidates (status, created_at desc);

-- One row per source sighting of a candidate. Phase 1 writes the manual one.
create table if not exists public.ce_trend_observations (
  id                uuid primary key default gen_random_uuid(),
  candidate_id      uuid not null references public.ce_trend_candidates(id) on delete cascade,
  source_name       text not null,
  platform          text,
  region            text,
  exact_phrase      text,
  related_phrases   text[] not null default '{}',
  metrics           jsonb not null default '{}'::jsonb,  -- only what the provider actually returns
  source_url        text,
  confidence        numeric,
  api_status        text,
  raw_response      jsonb,                            -- sanitized provider payload, for audit
  fetched_at        timestamptz not null default now(),
  cache_expires_at  timestamptz
);
create index if not exists idx_ce_obs_candidate on public.ce_trend_observations (candidate_id, fetched_at desc);

-- ---------------------------------------------------------------------------
-- 4. Relational bridges — the mapping layer, and the audit of WHY.
--    competency_id is a REAL FOREIGN KEY: an invented or mistyped competency
--    cannot be written, even by a bug. This is the structural enforcement of
--    "all generated content must be traceable to approved RLC records".
-- ---------------------------------------------------------------------------
create table if not exists public.ce_relational_bridges (
  id                     uuid primary key default gen_random_uuid(),
  candidate_id           uuid not null references public.ce_trend_candidates(id) on delete cascade,
  bridge_type            text not null,   -- direct|life_disruption|seasonal|controversy|collective|cultural
  affected_population    text,
  relational_consequence text,
  angle                  text,
  competency_id          text references public.fw_competencies(competency_id),
  phase_id               text references public.fw_phases(phase_id),
  domain_id              text references public.fw_domains(domain_id),
  rationale              text,            -- shown in the UI: why this mapping was selected
  is_forced              boolean not null default false,  -- engine's own "this is a stretch" flag
  decision               text not null default 'proposed', -- proposed|accepted|rejected|edited
  reject_reason          text,
  decided_by             text,
  decided_at             timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists idx_ce_bridges_candidate on public.ce_relational_bridges (candidate_id, decision);

-- ---------------------------------------------------------------------------
-- 5. Configurable scoring weights, seeded from the workbook's Scoring & Sources
--    sheet. Directional planning scores — never presented as search volume.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_scoring_weights (
  key        text primary key,
  weight     numeric not null,
  notes      text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 6. Performance log, shaped to the workbook's Performance Log sheet.
--    Phase 1 is manual entry; the service is designed so official platform
--    analytics can write the same rows later.
-- ---------------------------------------------------------------------------
create table if not exists public.ce_performance_records (
  id                  uuid primary key default gen_random_uuid(),
  draft_id            uuid references public.ai_content_drafts(id) on delete set null,
  keyword_id          uuid references public.ce_platform_keywords(id) on delete set null,
  community_id        uuid references public.ce_communities(id) on delete set null,
  platform            text not null,
  post_url            text,
  posted_at           date,
  views               integer,
  reach               integer,
  likes               integer,
  comments            integer,
  shares              integer,
  saves               integer,
  watch_time_seconds  integer,
  completion_rate     numeric,
  profile_visits      integer,
  link_clicks         integer,
  follows             integer,
  cta_conversions     integer,
  notes               text,
  entry_mode          text not null default 'manual',
  recorded_by         text,
  recorded_at         timestamptz not null default now()
);
create index if not exists idx_ce_perf_keyword  on public.ce_performance_records (keyword_id, posted_at desc);
create index if not exists idx_ce_perf_platform on public.ce_performance_records (platform, posted_at desc);

-- ---------------------------------------------------------------------------
-- 7. Versioned drafts on the EXISTING ai_content_drafts table.
--    Regenerating creates a new row (version = n+1, parent_draft_id = original)
--    so an approved draft is never overwritten.
-- ---------------------------------------------------------------------------
alter table public.ai_content_drafts
  add column if not exists version integer not null default 1;
alter table public.ai_content_drafts
  add column if not exists parent_draft_id uuid references public.ai_content_drafts(id) on delete set null;
create index if not exists idx_ai_drafts_parent on public.ai_content_drafts (parent_draft_id, version);

-- ---------------------------------------------------------------------------
-- 8. RLS — enabled, no policy. Service-role only; owner+MFA enforced in the app.
-- ---------------------------------------------------------------------------
alter table public.ce_platform_keywords    enable row level security;
alter table public.ce_communities          enable row level security;
alter table public.ce_community_keywords   enable row level security;
alter table public.ce_trend_candidates     enable row level security;
alter table public.ce_trend_observations   enable row level security;
alter table public.ce_relational_bridges   enable row level security;
alter table public.ce_scoring_weights      enable row level security;
alter table public.ce_performance_records  enable row level security;
