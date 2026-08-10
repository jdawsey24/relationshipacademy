-- 0074 — Dating With Clarity: the priority waitlist.
--
-- A waitlist is not a lead capture. site_leads answers "who asked us something",
-- and its answer is a row somebody reads later. This list is a MAILING LIST with
-- a launch calendar attached: fourteen dated emails go out across three weeks,
-- some of them are held until a business decision is made, and anyone who buys a
-- seat has to stop receiving the rest that same minute. None of that fits in a
-- free-text message column.
--
-- WHY sent_steps IS AN ARRAY AND NOT A COUNTER. The sequence is calendar-dated,
-- not offset-from-signup, and several steps are held pending an owner decision.
-- A counter assumes the steps go out in order and that none of them are skipped.
-- Both assumptions are false here, and the failure mode of a counter is sending
-- somebody "enrollment closes tomorrow" a week after it closed.

create table if not exists public.dating_clarity_waitlist (
  id            uuid primary key default gen_random_uuid(),
  cohort        text not null default 'founding-2026-09',

  -- Stored already lower-cased by the endpoint so the unique constraint below
  -- is a plain one. A partial or expression index would work as a constraint but
  -- not as a straightforward upsert target.
  email         text not null,
  first_name    text,

  -- The four qualifying answers from the waitlist form. Kept as their own
  -- columns rather than folded into a message: they are the reason the form
  -- asks, and reading them is how the first class gets built.
  dating_status text,
  hardest_part  text,
  confidence_goal text,
  can_attend    text,

  -- active      → receiving the sequence
  -- enrolled    → bought a seat; every remaining sales email is suppressed
  -- unsubscribed→ asked to stop
  status        text not null default 'active'
                check (status in ('active', 'enrolled', 'unsubscribed')),

  -- Keys of the steps already sent to this person ('w1', 'p3', …).
  sent_steps    text[] not null default '{}',

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  last_sent_at  timestamptz,

  unique (cohort, email)
);

-- The sender scans by cohort and status every day.
create index if not exists idx_clarity_waitlist_sending
  on public.dating_clarity_waitlist (cohort, status);

comment on column public.dating_clarity_waitlist.sent_steps is
  'Step keys already delivered. The sequence is calendar-dated and some steps are held pending an owner decision, so delivery is not sequential and cannot be tracked by a counter.';

comment on column public.dating_clarity_waitlist.status is
  'enrolled is set by the Stripe webhook the moment a seat is paid for, which is what removes a buyer from the sales emails.';

-- Service-role only, like every other list on this site. The public endpoint
-- writes through the admin client after validating and rate-limiting.
alter table public.dating_clarity_waitlist enable row level security;
