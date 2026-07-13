-- RLC — Governed Question → Behavioral Indicator → Competency mapping layer
-- (build-only, traceability + descriptive analysis; NOT validated scoring).
--
-- Canonical assessment architecture: maps each LIVE 47-item Snapshot question to
-- the observable behavioral indicator it reflects, from which competency/domain/
-- phase are DERIVED. Append-only + governed (versioned, approved, dated,
-- attributed). This does NOT alter `questions` or any live scoring table, and
-- nothing here scores public users — the live 47-item Snapshot (lib/scoring.ts,
-- app/api/score, app/api/results) is untouched. Formal competency scoring/
-- interpretation/recommendations are out of scope (Assessment System build).
-- RLS-locked (owner/editor via service role). Idempotent. Run in the Supabase SQL editor.

create table if not exists public.live_question_map (
  id uuid primary key default gen_random_uuid(),
  question_id      text not null,                              -- live questions.id (e.g. "C002")
  behavior_id      text,                                       -- preferred target: studio_behavioral_indicators.behavior_id
  competency_id    text,                                       -- derived from the indicator, or direct (with exception); = kb_competencies.code
  mapping_kind     text not null default 'indicator',          -- 'indicator' | 'competency_direct'
  exception_reason text,                                       -- REQUIRED when mapping_kind='competency_direct'
  scoring_eligible boolean not null default true,              -- false for competency_direct (excluded from future validated scoring)
  weight           numeric not null default 1.0,               -- future weighting; V1 = 1.0
  rationale        text,                                       -- why this question reflects this indicator
  confidence_level text,                                       -- 'high' | 'moderate' | 'low' | 'tentative'
  assessment_version_id uuid,                                  -- live assessment_versions active at mapping time
  status           text not null default 'draft',              -- 'draft' | 'approved' | 'superseded' | 'retired'
  version_no       int not null default 1,                     -- immutable per (question_id) lineage
  effective_from   timestamptz,                                -- set on approval
  effective_to     timestamptz,                                -- set on supersede/retire (approved history is never deleted)
  created_by       text,
  reviewed_by      text,
  approved_by      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint live_question_map_target    check (behavior_id is not null or competency_id is not null),
  constraint live_question_map_exception check (mapping_kind <> 'competency_direct' or exception_reason is not null)
);

create index if not exists live_question_map_question_idx   on public.live_question_map (question_id);
create index if not exists live_question_map_competency_idx on public.live_question_map (competency_id);
create index if not exists live_question_map_status_idx     on public.live_question_map (status);

-- At most one CURRENT approved mapping per (question, target). Superseded/retired
-- history rows (effective_to not null) are excluded so history accumulates freely.
create unique index if not exists live_question_map_current_uniq
  on public.live_question_map (question_id, coalesce(behavior_id, competency_id))
  where status = 'approved' and effective_to is null;

-- No public policies: service-role/admin only (owner approves; editors draft).
alter table public.live_question_map enable row level security;

notify pgrst, 'reload schema';
