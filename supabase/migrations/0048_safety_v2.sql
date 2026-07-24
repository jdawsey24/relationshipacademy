-- Relationship Companion — Safety Layer V2 (application-level safety system AROUND
-- the RLC framework; it does NOT touch RLC constructs, competencies, developmental
-- tasks, domains, phases, or assessment scoring).
--
-- V2 upgrades the V1 keyword matcher into a deterministic, context-aware detection
-- engine (lib/companion/safetyEngine.ts) driven by a centralized, VERSIONED
-- registry. This migration EXTENDS the V1 tables (0047) — additive columns + one
-- new table + a small in-place remap of the single seeded V1 row. No data is
-- destroyed. All clinical content (patterns, response copy, resources) remains
-- clinician-authored; engineering seeds none of the vocabulary here.
--
-- RLS: every table stays service-role only (no public/authenticated policies) —
-- exactly as 0047. Triggers/terms/responses never reach the client directly.
--
-- OWNER-RUN. Do not run in production until reviewed.

-- ---------------------------------------------------------------------------
-- 1) Trigger registry — add the V2 fields (item 5). trigger_pattern stays the
--    existing `pattern`; `active` stays the existing `is_active`.
-- ---------------------------------------------------------------------------
alter table public.companion_safety_triggers
  add column if not exists canonical_concept  text,                          -- groups phrasings ("suicidal_intent")
  add column if not exists severity           smallint,                      -- 1 possible | 2 clear | 3 acute/high-risk
  add column if not exists context_required   boolean not null default true, -- apply subject (media/hypothetical/3p) checks
  add column if not exists negation_sensitive boolean not null default true, -- apply per-clause negation suppression
  add column if not exists self_directed_act  boolean not null default false,-- concept is itself an act (rare)
  add column if not exists registry_version   text not null default '2.0.0',
  add column if not exists response_protocol  text;                          -- optional override of level→response routing

-- severity is authored from the BEHAVIOR, never auto-3 from a bare word. Backfill
-- the single V1 self-harm phrase (level='high_risk') to severity 3; leave the rest
-- for clinician authoring. Enforce the 1..3 range once values exist.
update public.companion_safety_triggers set severity = 3 where severity is null and level = 'high_risk';
alter table public.companion_safety_triggers
  drop constraint if exists companion_safety_triggers_severity_chk;
alter table public.companion_safety_triggers
  add constraint companion_safety_triggers_severity_chk
  check (severity is null or severity between 1 and 3);

-- risk_category vocabulary (kept as text for extensibility; validated by app +
-- this soft check). self_harm | ipv | sexual_coercion | harm_to_others.
alter table public.companion_safety_triggers
  drop constraint if exists companion_safety_triggers_category_chk;
alter table public.companion_safety_triggers
  add constraint companion_safety_triggers_category_chk
  check (risk_category is null or risk_category in
    ('self_harm','ipv','sexual_coercion','harm_to_others'));

-- ---------------------------------------------------------------------------
-- 2) Immediacy terms — cross-category present-danger signals (item 3). Separate
--    from triggers because immediacy is orthogonal to category, and a term may
--    be evaluated against text that matched ANY category (or none, for the
--    self-standing acts). kind drives the combination rule in the engine.
-- ---------------------------------------------------------------------------
create table if not exists public.companion_safety_immediacy_terms (
  id               uuid primary key default gen_random_uuid(),
  pattern          text not null,
  match_type       text not null default 'phrase',   -- keyword | phrase | regex
  kind             text not null,                     -- intent | active_act | weapon | confinement | escalation | temporal
  implies_category text,                              -- optional: category when the term stands as its own act
  is_active        boolean not null default true,
  registry_version text not null default '2.0.0',
  notes            text,
  created_by       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint companion_safety_immediacy_kind_chk
    check (kind in ('intent','active_act','weapon','confinement','escalation','temporal')),
  constraint companion_safety_immediacy_category_chk
    check (implies_category is null or implies_category in
      ('self_harm','ipv','sexual_coercion','harm_to_others'))
);

-- ---------------------------------------------------------------------------
-- 3) Responses — re-key from V1 'high_risk' to the L1/L2/L3 protocol + an
--    immediate-danger variant (item 8). The single V1 row becomes level '3'.
--    Copy is authored by the clinician (pending her review) — NOT seeded here.
-- ---------------------------------------------------------------------------
update public.companion_safety_responses set level = '3' where level = 'high_risk';
-- category-scoped digital-safety flag: IPV responses must not auto-open external
-- resources / expose the disclosure (item 11). Governs UX behavior, not copy.
alter table public.companion_safety_responses
  add column if not exists discreet_mode boolean not null default false;

-- ---------------------------------------------------------------------------
-- 4) Resources — route by category + jurisdiction (item 13), and require a real
--    verification record before a resource is treated as verified. Never trust
--    seed presence as verification.
-- ---------------------------------------------------------------------------
alter table public.companion_safety_resources
  add column if not exists applies_to_categories text[] not null default '{}',
  add column if not exists resource_kind text;   -- suicide_crisis | ipv | sexual_assault | emergency (routing hint)
-- verified_at / verified_by / source already exist (0047). Backfill the one known
-- V1 seed (988 Suicide & Crisis Lifeline) to the self_harm category if present.
update public.companion_safety_resources
  set applies_to_categories = array['self_harm'], resource_kind = 'suicide_crisis'
  where applies_to_categories = '{}'
    and (lower(name) like '%988%' or lower(name) like '%suicide%' or lower(name) like '%crisis lifeline%');

-- Remap the legacy applies_to_levels default so existing rows keep routing.
-- (V1 used '{high_risk}'; treat that as level '3'.)
update public.companion_safety_resources
  set applies_to_levels = array['3']
  where applies_to_levels = array['high_risk'];

-- ---------------------------------------------------------------------------
-- 5) Events — richer STRUCTURED classification for audit + false-pos/neg review.
--    NEVER stores raw learner text (item 10). Every event stamps the engine +
--    registry version that produced it (item 10). findings_meta is a JSONB array
--    of per-finding metadata (ruleId, category, concept, severity, subject,
--    negated, temporality) — structured classifications, not raw disclosure.
-- ---------------------------------------------------------------------------
alter table public.companion_safety_events
  add column if not exists action_level          smallint,        -- 0..3
  add column if not exists immediate_danger       boolean not null default false,
  add column if not exists categories             text[] not null default '{}',
  add column if not exists immediacy_kinds         text[] not null default '{}',
  add column if not exists findings_meta          jsonb not null default '[]'::jsonb,
  add column if not exists safety_engine_version  text,
  add column if not exists registry_version       text;
alter table public.companion_safety_events
  drop constraint if exists companion_safety_events_action_level_chk;
alter table public.companion_safety_events
  add constraint companion_safety_events_action_level_chk
  check (action_level is null or action_level between 0 and 3);

-- ---------------------------------------------------------------------------
-- RLS + PostgREST reload
-- ---------------------------------------------------------------------------
alter table public.companion_safety_immediacy_terms enable row level security;

notify pgrst, 'reload schema';
