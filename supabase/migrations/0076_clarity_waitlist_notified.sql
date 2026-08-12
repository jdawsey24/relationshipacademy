-- 0076 — mark a waitlist signup once the owner has been told about it.
--
-- The digest could have been "everyone who joined in the last 24 hours", and
-- that is the version that quietly goes wrong: the cron runs twice a day, so a
-- fixed window either sends the same person twice or, if the window is tightened
-- to match, drops anyone who arrives in the gap when a run is missed or retried.
--
-- Per-row instead. The digest reports rows where this is null and stamps them,
-- so it reports each person exactly once, a failed send leaves them for the next
-- run rather than losing them, and someone who signs up mid-send simply lands in
-- the next one. No time arithmetic anywhere.

alter table public.dating_clarity_waitlist
  add column if not exists notified_at timestamptz;

comment on column public.dating_clarity_waitlist.notified_at is
  'When this signup was included in an owner digest. Null means not yet reported. Per-row rather than a time window so nobody is reported twice or missed when a cron run is retried.';

-- The digest scans for the unreported ones and there will rarely be many, so a
-- partial index keeps it to exactly the rows that matter.
create index if not exists idx_clarity_waitlist_unnotified
  on public.dating_clarity_waitlist (cohort, created_at)
  where notified_at is null;
