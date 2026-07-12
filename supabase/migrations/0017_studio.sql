-- RLC Content & Assessment Studio — governance foundation (Phase A).
--
-- Adds a governance spine that sits ABOVE the existing live content tables
-- (courses/lessons/questions/articles/resources/institute_offerings). It does
-- not replace them: the Studio authors + versions + reviews content and, on
-- publish, projects into those canonical tables (preserving their IDs via
-- studio_objects.canonical_ref). Nothing here touches live data.
--
-- All tables are RLS-locked with NO public policy — read server-side via the
-- service role only (same model as live_sessions / the Academy content tables),
-- because Studio drafts and the Knowledge Base are owner/editor-only.
--
-- Idempotent + safe to run more than once. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- Knowledge Base — the RLC "source of truth". The ONLY material AI generation
-- is allowed to draft from, and only rows with status='active'. Curated by the
-- owner. Seeded below with the six phases + six domains from the framework so
-- the KB browser and AI have real source material on day one.
-- ---------------------------------------------------------------------------
create table if not exists public.kb_competencies (
  id uuid primary key default gen_random_uuid(),
  code text unique,                              -- preserves/echoes existing RLC IDs
  kind text not null default 'competency',       -- phase | domain | competency
  phase_slug text,                               -- exploration|exclusivity|expansion|expiration|recovery|renewal
  domain_slug text,                              -- communication|trust|emotional_intimacy|conflict_management|relational_functioning|physical_intimacy
  competency_phase_slug text,                    -- exploration|exclusivity|expansion|expiration_risk
  name text not null,
  definition text,
  developmental_task text,
  healthy_markers jsonb not null default '[]'::jsonb,
  common_challenges jsonb not null default '[]'::jsonb,
  growth_indicators jsonb not null default '[]'::jsonb,
  audiences text[] not null default '{}',        -- consumer|academy|institute|clinical|admin
  status text not null default 'active',         -- active | retired  (only 'active' is AI-eligible)
  source_ref text,
  notes text,
  sort_order integer not null default 0,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists kb_competencies_kind_idx on public.kb_competencies (kind);
create index if not exists kb_competencies_status_idx on public.kb_competencies (status);
alter table public.kb_competencies enable row level security;

-- ---------------------------------------------------------------------------
-- studio_objects — the registry / governance spine. One row per authorable
-- thing, regardless of which canonical table it eventually publishes into.
-- ---------------------------------------------------------------------------
create table if not exists public.studio_objects (
  id uuid primary key default gen_random_uuid(),
  object_type text not null,                     -- assessment|assessment_item|scoring_rule|result_template|recommendation_map|course|lesson|practice|worksheet|activity|article|resource
  audience text not null,                        -- consumer|academy|institute|clinical|admin
  title text not null,
  slug text,
  status text not null default 'draft',          -- draft|in_review|changes_requested|approved|published|retired
  provenance text not null default 'human',      -- human|ai_generated|ai_assisted
  current_version integer not null default 0,
  published_version integer,
  canonical_ref jsonb,                           -- {"table":"articles","id":"..."} of the live row it governs once published
  kb_refs uuid[] not null default '{}',          -- kb_competencies this derives from
  summary text,
  created_by text,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists studio_objects_type_idx on public.studio_objects (object_type);
create index if not exists studio_objects_status_idx on public.studio_objects (status);
create index if not exists studio_objects_audience_idx on public.studio_objects (audience);
alter table public.studio_objects enable row level security;

-- ---------------------------------------------------------------------------
-- studio_versions — immutable snapshots. One row per saved version; never
-- mutated. body holds the type-specific authorable payload (jsonb).
-- ---------------------------------------------------------------------------
create table if not exists public.studio_versions (
  id uuid primary key default gen_random_uuid(),
  object_id uuid not null references public.studio_objects(id) on delete cascade,
  version_no integer not null,
  body jsonb not null default '{}'::jsonb,
  provenance text not null default 'human',
  status_at text,                                -- object status when this snapshot was taken
  authored_by text,
  note text,
  created_at timestamptz not null default now(),
  unique (object_id, version_no)
);
create index if not exists studio_versions_object_idx on public.studio_versions (object_id);
alter table public.studio_versions enable row level security;

-- ---------------------------------------------------------------------------
-- studio_reviews — append-only workflow/approval log.
-- ---------------------------------------------------------------------------
create table if not exists public.studio_reviews (
  id uuid primary key default gen_random_uuid(),
  object_id uuid not null references public.studio_objects(id) on delete cascade,
  version_no integer,
  action text not null,                          -- create|update|submit_for_review|approve|request_changes|publish|unpublish|retire|ai_generate|restore|delete
  actor text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists studio_reviews_object_idx on public.studio_reviews (object_id);
alter table public.studio_reviews enable row level security;

-- No public RLS policies on any of the four tables: all reads/writes happen
-- server-side through the service role (owner/editor-gated in the app).

-- ---------------------------------------------------------------------------
-- Seed the Knowledge Base with the framework's six phases + six domains.
-- Idempotent via code + ON CONFLICT DO NOTHING (re-running never duplicates or
-- overwrites owner edits).
-- ---------------------------------------------------------------------------
insert into public.kb_competencies (code, kind, phase_slug, name, definition, developmental_task, audiences, sort_order, status)
values
  ('PHASE-EXPLORATION', 'phase', 'exploration', 'Exploration', 'The getting-to-know-you phase: partners discern compatibility and decide whether to invest further.', 'Discernment', array['consumer','academy','institute'], 10, 'active'),
  ('PHASE-EXCLUSIVITY', 'phase', 'exclusivity', 'Exclusivity', 'Partners choose each other intentionally and commit to building something together.', 'Intentional Investment', array['consumer','academy','institute'], 20, 'active'),
  ('PHASE-EXPANSION', 'phase', 'expansion', 'Expansion', 'Partners integrate their lives — merging routines, resources, and long-term plans.', 'Integration', array['consumer','academy','institute'], 30, 'active'),
  ('PHASE-EXPIRATION', 'phase', 'expiration', 'Expiration', 'The relationship faces hard truths about whether it can or should continue.', 'Acceptance', array['consumer','academy','institute','clinical'], 40, 'active'),
  ('PHASE-RECOVERY', 'phase', 'recovery', 'Recovery', 'Healing after loss or rupture, individually and (where applicable) together.', 'Healing', array['consumer','academy','institute','clinical'], 50, 'active'),
  ('PHASE-RENEWAL', 'phase', 'renewal', 'Renewal', 'Re-engaging with intention after healing — starting again on new terms.', 'Reengagement', array['consumer','academy','institute'], 60, 'active')
on conflict (code) do nothing;

insert into public.kb_competencies (code, kind, domain_slug, name, definition, audiences, sort_order, status)
values
  ('DOMAIN-COMMUNICATION', 'domain', 'communication', 'Communication', 'The primary mechanism through which partners exchange information, construct shared meaning, and navigate each developmental phase.', array['consumer','academy','institute'], 110, 'active'),
  ('DOMAIN-TRUST', 'domain', 'trust', 'Trust', 'The degree to which partners demonstrate reliability, honesty, accountability, and emotional safety over time.', array['consumer','academy','institute'], 120, 'active'),
  ('DOMAIN-EMOTIONAL-INTIMACY', 'domain', 'emotional_intimacy', 'Emotional Intimacy', 'The depth of emotional connection, vulnerability, and mutual understanding between partners.', array['consumer','academy','institute'], 130, 'active'),
  ('DOMAIN-CONFLICT-MANAGEMENT', 'domain', 'conflict_management', 'Conflict Management', 'The ability to navigate disagreement constructively, repair relational ruptures, and use conflict as a source of growth.', array['consumer','academy','institute'], 140, 'active'),
  ('DOMAIN-RELATIONAL-FUNCTIONING', 'domain', 'relational_functioning', 'Relational Functioning', 'How well partners coordinate shared responsibilities, expectations, and roles within the relationship.', array['consumer','academy','institute'], 150, 'active'),
  ('DOMAIN-PHYSICAL-INTIMACY', 'domain', 'physical_intimacy', 'Physical Intimacy', 'The presence, quality, and communication surrounding physical connection and affection.', array['consumer','academy','institute'], 160, 'active')
on conflict (code) do nothing;

notify pgrst, 'reload schema';
