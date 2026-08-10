-- 0073 — Dating With Your Eyes Open: founding cohort seats.
--
-- Fifteen seats, sold once. Everything else on this site sells an unlimited
-- digital product, so nothing here had to count before.
--
-- THE RACE THIS EXISTS TO PREVENT. Checking "are there seats left?" when the
-- page renders is not enough: two people can both see seat fifteen, both open
-- Stripe, and both pay. Refunding one of them after she has told her friends
-- she got in is a bad day for everyone. So a seat is HELD when checkout opens
-- and only becomes hers when Stripe confirms payment. An abandoned checkout
-- releases the hold on its own, without anybody having to notice.

create table if not exists public.eyes_open_enrolments (
  id                 uuid primary key default gen_random_uuid(),
  cohort             text not null default 'founding-2026-09',

  email              text not null,
  name               text,

  -- pending  → a checkout is open and a seat is held until held_until
  -- paid     → Stripe confirmed; the seat is hers
  -- released → the hold expired or checkout was abandoned
  -- refunded → paid, then refunded; the seat goes back
  status             text not null default 'pending'
                     check (status in ('pending', 'paid', 'released', 'refunded')),

  -- How long an unpaid hold survives. Stripe Checkout sessions expire after 24
  -- hours; this is deliberately shorter so an abandoned cart frees the seat the
  -- same afternoon rather than the next day.
  held_until         timestamptz not null default now() + interval '30 minutes',

  stripe_session_id  text unique,
  stripe_customer_id text,
  stripe_payment_intent text,

  created_at         timestamptz not null default now(),
  paid_at            timestamptz,
  released_at        timestamptz
);

-- The seat count reads this constantly. Partial, because released and refunded
-- rows are history and must never be counted against the cap.
create index if not exists idx_eyes_open_live_seats
  on public.eyes_open_enrolments (cohort, status, held_until)
  where status in ('pending', 'paid');

create index if not exists idx_eyes_open_email
  on public.eyes_open_enrolments (lower(email));

comment on column public.eyes_open_enrolments.held_until is
  'A pending seat counts against the cap only until this passes. Expired holds are released by the count itself, so no cleanup job has to run for the page to be correct.';

alter table public.eyes_open_enrolments enable row level security;
