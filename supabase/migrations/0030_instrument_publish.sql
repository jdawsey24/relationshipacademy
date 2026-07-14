-- RLC — Publish an assembled instrument to live (parallel consumer assessment).
--
-- Adds the minimum to serve a Studio-assembled instrument to REAL respondents as
-- a SECOND public assessment, running on the studio scoring stack. The live 47-item
-- Snapshot (lib/scoring.ts, app/api/score, app/api/results, questions/quiz_* tables)
-- is UNTOUCHED. Publishing is readiness-gated (cut-points + consumer text authored)
-- and each instrument's live_enabled flag is the switch (off by default). Additive,
-- RLS-locked (service-role only). Idempotent. Run in the Supabase SQL editor.

-- Instrument-level publish state on the registry.
alter table public.studio_assessments add column if not exists public_slug text;
alter table public.studio_assessments add column if not exists live_enabled boolean not null default false;
alter table public.studio_assessments add column if not exists published_at timestamptz;
alter table public.studio_assessments add column if not exists intro_copy jsonb not null default '{}'::jsonb;
create unique index if not exists studio_assessments_public_slug_uniq on public.studio_assessments (public_slug) where public_slug is not null;

-- Respondent identity on attempts (anonymous today). PII — service-role only; the
-- attempts table already has RLS enabled with no public policy.
alter table public.studio_assessment_attempts add column if not exists respondent_name text;
alter table public.studio_assessment_attempts add column if not exists respondent_email text;
-- kind is free text (default 'simulation') and already holds 'live' — no change.

notify pgrst, 'reload schema';
