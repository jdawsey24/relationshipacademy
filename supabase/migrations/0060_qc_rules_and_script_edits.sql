-- Content Engine — govern the remaining QC categories, and record script edits.
--
-- Found by the first live pipeline run (2026-08-06).
--
-- 1. TWO CATEGORIES WERE UNGOVERNED. runScriptQc emits `runtime` and
--    `completeness` findings, but ce_qc_blocking_rules had no row for either, so
--    they were reported as "ungoverned" — visible, but with no stated policy.
--    `completeness` happened to behave correctly (unknown categories block at
--    critical, and it is only ever emitted at critical), but by accident rather
--    than by decision. Both now have explicit rules.
--
-- 2. SCRIPTS WERE READ-ONLY. The engine's whole premise is that a human reviews
--    every draft, but a reviewer could not change a word — the only options were
--    accept as generated or regenerate the pair and lose the good one. Editing
--    needs to be recorded, not just permitted: an edited script is a different
--    artifact from a generated one and the difference must survive.
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Rules for the categories QC actually emits
-- ---------------------------------------------------------------------------
insert into public.ce_qc_blocking_rules (risk_category, min_severity, blocks_publication, notes) values
  ('completeness', 'critical', true,
   'A package missing a reading level or a required storyline is incomplete, not merely flawed.'),
  ('runtime',      'critical', false,
   'A script over or under its target is a craft note, not a safety issue. Surfaced on the review screen; never blocks.')
on conflict (risk_category) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Owner edits to a generated script
--
--    edited_by_owner separates "the model wrote this" from "a person wrote
--    this", which matters when reading back why a package says what it says.
--    generated_body keeps the original so an edit can be compared or undone —
--    without it, an edit silently erases the thing QC actually assessed.
-- ---------------------------------------------------------------------------
alter table public.ce_scripts
  add column if not exists edited_by_owner boolean not null default false;
alter table public.ce_scripts
  add column if not exists edited_by text;
alter table public.ce_scripts
  add column if not exists edited_at timestamptz;
alter table public.ce_scripts
  add column if not exists generated_hook text;
alter table public.ce_scripts
  add column if not exists generated_body text;
alter table public.ce_scripts
  add column if not exists generated_cta text;

comment on column public.ce_scripts.generated_body is
  'The model''s original body, captured the first time an owner edits. Null means the script is still exactly as generated.';

-- ---------------------------------------------------------------------------
-- 3. An edit invalidates the comparison that was run against the old text.
--    Nullable rather than deleted, so the review screen can say "this needs
--    re-checking" instead of silently showing nothing.
-- ---------------------------------------------------------------------------
alter table public.ce_script_comparisons
  add column if not exists stale boolean not null default false;

comment on column public.ce_script_comparisons.stale is
  'True when a script changed after this comparison ran. A stale comparison must not be read as a current result.';
