-- Email nurture sequence for the Relationship Snapshot funnel (Resend-backed).
-- Service-role only (PII); no public RLS policies. Additive; touches nothing else.

create table if not exists public.email_sequence_enrollments (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  first_name         text,
  attempt_id         text,                 -- studio_assessment_attempts.id (text)
  structural_context text,
  growth_areas       jsonb not null default '[]'::jsonb,  -- friendly domain names
  sequence_key       text not null default 'snapshot',
  current_step       int  not null default 0,   -- next step index to send
  status             text not null default 'active', -- active | completed | unsubscribed
  enrolled_at        timestamptz not null default now(),
  next_send_at       timestamptz,
  last_sent_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- One enrollment per attempt (idempotent enroll).
create unique index if not exists idx_email_seq_attempt
  on public.email_sequence_enrollments (attempt_id) where attempt_id is not null;
-- Cron scan: active + due.
create index if not exists idx_email_seq_due
  on public.email_sequence_enrollments (status, next_send_at);

alter table public.email_sequence_enrollments enable row level security;
-- (no policies → service-role only)

-- Per-email send log (audit + idempotency insight).
create table if not exists public.email_sends (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.email_sequence_enrollments(id) on delete cascade,
  step_key      text,
  provider_id   text,
  status        text,       -- sent | error
  created_at    timestamptz not null default now()
);
alter table public.email_sends enable row level security;

notify pgrst, 'reload schema';
