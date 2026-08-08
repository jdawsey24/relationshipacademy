-- 0069 — the unit of output is a script, not a pile of parts.
--
-- The first build gave her eight hooks, then five bodies, then five endings,
-- and asked her to assemble. That is a good way to explore and a bad way to
-- read: eight opening lines with nothing attached to them are hard to judge,
-- because a hook is only good or bad relative to where it goes.
--
-- So a run now produces whole scripts that differ from each other, and she
-- picks one. The staged path is not removed — the hook, body, resolution and
-- cta stages still work through the API for when she wants to build a piece by
-- hand — it just is not what the screen leads with.

alter table public.ci_script_options
  drop constraint if exists ci_script_options_stage_check;

alter table public.ci_script_options
  add constraint ci_script_options_stage_check
  check (stage in ('hook', 'body', 'resolution', 'cta', 'variation'));

-- Roughly how long it runs, measured from the words rather than estimated by
-- the model, which put a hundred-and-eight-second script at seventy-eight.
alter table public.ci_script_options
  add column if not exists seconds_est integer;

comment on column public.ci_script_options.seconds_est is
  'Measured from word count at save time. Never taken from the model.';

-- A tightened script is a new row, so the longer original stays readable and
-- she can go back to it if the cut took something she wanted.
alter table public.ci_scripts
  add column if not exists tightened_from uuid references public.ci_scripts(id) on delete set null,
  add column if not exists cut_notes      text;

comment on column public.ci_scripts.cut_notes is
  'What the tightening pass removed, in its own words, so a cut can be argued with.';
