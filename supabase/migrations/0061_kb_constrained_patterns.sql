-- Knowledge Base narrative layer — constrained development patterns.
--
-- The Renewal narrative distinguishes two observable sets per domain:
--
--   "Development may include …"              → observable_patterns
--   "Constrained development may include …"  → constrained_patterns  (new)
--
-- These are not opposites and must not be stored as one list. "Participates
-- socially while remaining emotionally inaccessible" is not the negation of
-- "remains connected to personal emotion during interactions" — it is a
-- distinct, recognisable pattern that looks like progress from outside. Folding
-- them together would lose exactly the distinction that makes the constrained
-- set useful: it names the ways development can appear to be happening when it
-- is not.
--
-- Nullable and defaulted, so the Recovery records — which were authored without
-- a constrained set — stay valid rather than becoming retroactively incomplete.
--
-- Idempotent. Run in the Supabase SQL editor.

alter table public.kb_phase_domain_narratives
  add column if not exists constrained_patterns text[] not null default '{}';

comment on column public.kb_phase_domain_narratives.constrained_patterns is
  'Patterns indicating development is constrained. NOT the negation of observable_patterns — these are distinct behaviours that can resemble progress, e.g. participating socially while remaining emotionally inaccessible.';

comment on column public.kb_phase_domain_narratives.observable_patterns is
  'Patterns indicating development is occurring. Paired with constrained_patterns, which names how it can appear to occur without occurring.';
