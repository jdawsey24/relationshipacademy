-- Content Engine — Real Talk as a Content Series (owner decision, 2026-08-06).
--
-- Real Talk shipped as a configuration field: an intensity string on the brief,
-- passed to the script prompt. ce_real_talk_briefs, ce_content_series and
-- ce_audience_segments existed from 0056 with no code path at all — the seven-
-- part briefing structure the owner specified was never built, and intensity
-- alone carried none of it.
--
-- A series is not a setting. "Real Talk" changes what has to be established
-- BEFORE a script is written: the uncomfortable truth, who it is for, what is
-- commonly misunderstood, the nuance that keeps it honest, the relational
-- mechanism, the consequence, and the practical takeaway. Those are the parts of
-- the argument. An intensity dial with no argument behind it produces something
-- that sounds unflinching and establishes nothing.
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. The series
-- ---------------------------------------------------------------------------
insert into public.ce_content_series (slug, name, description, active) values
  ('standard', 'Standard',
   'Ordinary framework-faithful content. No additional briefing structure required.', true),
  ('real_talk', 'Real Talk',
   'Names something uncomfortable and true. Requires a seven-part brief before any script is written: uncomfortable truth, audience, common misunderstanding, necessary nuance, relational mechanism, consequence, practical takeaway.', true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Tie a Real Talk brief to the CONTENT BRIEF, not just the bridge
--
--    0056 keyed it on bridge_id. One bridge can produce several briefs, so a
--    bridge key cannot say which brief a given Real Talk argument belongs to.
--    The content brief is the unit a script is written from, so it is the unit
--    the briefing structure attaches to.
-- ---------------------------------------------------------------------------
alter table public.ce_real_talk_briefs
  add column if not exists brief_id uuid references public.ce_content_briefs(id) on delete cascade;

create unique index if not exists idx_ce_real_talk_brief
  on public.ce_real_talk_briefs (brief_id) where brief_id is not null;

-- `complete` is the owner's assertion that the argument is finished. The column
-- is added BEFORE the constraint that reads it, or the constraint cannot be
-- created on a fresh database.
alter table public.ce_real_talk_briefs
  add column if not exists complete boolean not null default false;

-- The seven parts are what make it Real Talk. A row marked complete while
-- missing any of them is a draft of a brief, not a brief — enforced here so a
-- partially-filled structure cannot reach script generation through a code path
-- that forgot to check.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_real_talk_seven_parts') then
    alter table public.ce_real_talk_briefs add constraint ce_real_talk_seven_parts
      check (
        complete = false
        or (uncomfortable_truth is not null and audience_description is not null
            and common_misunderstanding is not null and necessary_nuance is not null
            and relational_mechanism is not null and consequence is not null
            and practical_takeaway is not null)
      );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Intensity belongs to the Real Talk brief, which is where its two risk
--    checks live. The brief-level column stays as the REQUEST — what the owner
--    asked for when configuring — and the Real Talk record holds what was
--    actually established.
-- ---------------------------------------------------------------------------
comment on column public.ce_content_briefs.real_talk_intensity is
  'Requested intensity at configuration time. The authoritative value is ce_real_talk_briefs.intensity, which is constrained to carry both risk checks when unfiltered.';
