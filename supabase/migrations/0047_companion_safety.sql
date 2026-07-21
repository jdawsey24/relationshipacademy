-- Relationship Companion — V1 lightweight safety layer (educational product, NOT
-- a therapy / crisis-classification platform). A clinician authors the trigger
-- library + supportive language + verified resources; the runtime screens
-- free-text learner input, interrupts the educational flow on a match, presents
-- support + resources, and logs a METADATA-ONLY audit event.
--
-- Deliberately schema-forward: `level` and `risk_category` are present now
-- (V1 uses level='high_risk') so this expands into the full L0–L3 taxonomy from
-- docs/companion-safety-authoring-brief.md WITHOUT a schema change.
--
-- ALL clinical content (patterns, messages, resource numbers) is authored by the
-- clinician via the admin CMS — these tables ship EMPTY. Engineering authors none.
--
-- RLS: every table is service-role only (no public/authenticated policies).
-- Triggers/responses never reach the client directly; resources + the matched
-- response reach the learner only through server APIs using the service role.

-- 1) Trigger library — clinician-authored signals for obvious high-risk disclosures.
create table if not exists public.companion_safety_triggers (
  id            uuid primary key default gen_random_uuid(),
  pattern       text not null,                        -- the term/phrase to match (clinician-authored)
  match_type    text not null default 'keyword',      -- keyword | phrase | regex (future)
  level         text not null default 'high_risk',    -- V1: high_risk; future: L0..L3
  risk_category text,                                  -- future taxonomy (self_harm, ipv, ...); nullable in V1
  is_active     boolean not null default true,
  notes         text,
  created_by    text,                                  -- clinician actor
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_safety_triggers_active on public.companion_safety_triggers (is_active, level);

-- 2) Response language — supportive, non-diagnostic, non-directive (per level).
create table if not exists public.companion_safety_responses (
  level          text primary key default 'high_risk', -- one authored response per level
  heading        text,
  message        text not null,                         -- clinician-authored supportive language
  resource_intro text,                                  -- lead-in above the resource list
  is_active      boolean not null default true,
  updated_by     text,
  updated_at     timestamptz not null default now()
);

-- 3) Resource directory — verified crisis/professional resources (clinician + legal verify).
create table if not exists public.companion_safety_resources (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  contact           text,                               -- phone / SMS / chat (verified)
  url               text,
  jurisdiction      text not null default 'US',
  hours             text,
  applies_to_levels text[] not null default '{high_risk}',
  sort_order        integer not null default 0,
  is_active         boolean not null default true,
  verified_at       timestamptz,                        -- legal/clinical verification stamp
  verified_by       text,
  source            text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_safety_resources_active on public.companion_safety_resources (is_active, jurisdiction, sort_order);

-- 4) Audit log — METADATA ONLY. Never stores the learner's raw disclosure text.
-- on delete set null keeps the safety audit trail if an account is later deleted
-- (retention policy is a legal decision — see the account-delete flow).
create table if not exists public.companion_safety_events (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  trigger_id      uuid references public.companion_safety_triggers(id) on delete set null,
  matched_pattern text,                                 -- the clinician's pattern that fired (config, NOT user text)
  level           text not null default 'high_risk',
  context         text,                                 -- where it fired: experience | blueprint | journal | planner
  situation_ref   text,                                 -- situation/experience slug for context (no free text)
  action          text not null default 'interrupted',
  created_at      timestamptz not null default now()
);
create index if not exists idx_safety_events_created on public.companion_safety_events (created_at desc);

alter table public.companion_safety_triggers  enable row level security;
alter table public.companion_safety_responses enable row level security;
alter table public.companion_safety_resources enable row level security;
alter table public.companion_safety_events    enable row level security;
-- No policies: service-role (server) only. Learners reach content via server APIs.

notify pgrst, 'reload schema';
