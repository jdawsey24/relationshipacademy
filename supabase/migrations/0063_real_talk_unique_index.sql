-- Content Engine — make the Real Talk brief_id index usable as a conflict target.
--
-- 0062 created a PARTIAL unique index:
--
--   create unique index ... on ce_real_talk_briefs (brief_id) where brief_id is not null;
--
-- Postgres cannot infer a partial index as an ON CONFLICT target unless the
-- statement repeats the predicate, which PostgREST cannot express — so an upsert
-- against it failed with "no unique or exclusion constraint matching the ON
-- CONFLICT specification". Found by the first live save.
--
-- The predicate was never needed. Postgres treats NULLs as distinct in a unique
-- index, so a plain unique index already permits any number of rows with a null
-- brief_id while still allowing only one row per brief.
--
-- Idempotent. Run in the Supabase SQL editor.

drop index if exists public.idx_ce_real_talk_brief;

create unique index if not exists idx_ce_real_talk_brief
  on public.ce_real_talk_briefs (brief_id);

comment on index public.idx_ce_real_talk_brief is
  'One Real Talk argument per content brief. Not partial: a partial index cannot be used as an ON CONFLICT target.';
