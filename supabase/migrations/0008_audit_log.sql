-- audit_log: append-only trail of administrator actions (user management,
-- settings changes, content publishes, etc.). Written by the service role via
-- lib/audit.ts. Private — no anon/authenticated access; admins read it through
-- a service-role API route. Safe to run more than once. Run in the SQL editor.

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor text,                       -- admin email (null if unknown)
  action text not null,             -- e.g. 'user.create', 'settings.update'
  target text,                      -- affected id/email/key
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);

alter table public.audit_log enable row level security;
-- RLS enabled with NO policy => default-deny for anon/authenticated. The
-- service role bypasses RLS, so writes (lib/audit.ts) and admin reads work.

notify pgrst, 'reload schema';
