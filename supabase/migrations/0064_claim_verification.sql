-- Content Engine — claim verification (owner ruling 7).
--
-- ce_claims existed from 0056 with no code path: nothing wrote to it, nothing
-- read it, and ce_content_briefs.verified_facts / claim_ids stayed empty. So
-- nothing verified a factual claim before a script asserted it.
--
-- WHAT "NEVER SKIPPED FOR EVERGREEN" MEANS. It does not mean every brief has
-- claims — an evergreen relational piece may make no factual assertion at all.
-- It means the STEP cannot be skipped. A brief with no claims is a legitimate
-- outcome of doing the review; a brief with no claims because nobody looked is
-- the failure. Those two states are identical in the data unless the review
-- itself is recorded, which is what claims_reviewed_at is for.
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Claims belong to a brief
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'ce_claims_brief_fk'
  ) then
    -- Orphaned rows would block the constraint; there are none, but be explicit.
    delete from public.ce_claims c
      where c.brief_id is not null
        and not exists (select 1 from public.ce_content_briefs b where b.id = c.brief_id);
    alter table public.ce_claims
      add constraint ce_claims_brief_fk
      foreign key (brief_id) references public.ce_content_briefs(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'ce_claims_status_check') then
    alter table public.ce_claims add constraint ce_claims_status_check
      check (verification_status in ('unverified', 'verified', 'disputed', 'withdrawn'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'ce_claims_risk_check') then
    alter table public.ce_claims add constraint ce_claims_risk_check
      check (risk_level in ('low', 'medium', 'high'));
  end if;

  -- A claim of external fact cannot be 'verified' with no source recorded.
  -- `interpretation` is exempt: a framework reading is verified by being
  -- labelled as a reading, not by a citation, and demanding a source for it
  -- would push authors to dress interpretation up as evidence.
  if not exists (select 1 from pg_constraint where conname = 'ce_claims_source_required') then
    alter table public.ce_claims add constraint ce_claims_source_required
      check (
        verification_status <> 'verified'
        or claim_type = 'interpretation'
        or jsonb_array_length(sources) > 0
      );
  end if;
end $$;

create index if not exists idx_ce_claims_brief on public.ce_claims (brief_id, verification_status);

-- ---------------------------------------------------------------------------
-- 2. Record that the review happened
--
--    Without this, "no claims" and "nobody looked" are the same row. The marker
--    is the difference between an evergreen brief that was reviewed and found to
--    assert nothing, and one that skipped the stage.
-- ---------------------------------------------------------------------------
alter table public.ce_content_briefs
  add column if not exists claims_reviewed_at timestamptz;
alter table public.ce_content_briefs
  add column if not exists claims_reviewed_by text;

comment on column public.ce_content_briefs.claims_reviewed_at is
  'When the claim review was performed. NOT a claim count — a brief with zero claims still needs this set, because "asserts nothing" and "nobody checked" are otherwise indistinguishable.';
