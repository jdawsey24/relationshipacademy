-- Per-cluster Resend nurture for the Snapshot funnel. A converted session (email
-- captured at the Playbook CTA) is enrolled and drips a short cluster-personalized
-- sequence. Tracking lives on snapshot_quiz_sessions (no new table). Service-role
-- only; PII already lives here.

alter table public.snapshot_quiz_sessions
  add column if not exists nurture_status     text not null default 'active',  -- active | completed | unsubscribed
  add column if not exists nurture_step        int  not null default 0,         -- next step index to send
  add column if not exists nurture_next_at      timestamptz,
  add column if not exists nurture_last_sent_at timestamptz;

-- Cron scan: converted, active, due.
create index if not exists idx_snapshot_nurture_due
  on public.snapshot_quiz_sessions (nurture_status, nurture_next_at)
  where converted_at is not null;

notify pgrst, 'reload schema';
