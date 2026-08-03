-- First name captured at the Snapshot results email gate (owner request 2026-08-02:
-- the CRM contact needs a name, and the nurture emails greet by it — "Hi {name},"
-- with the existing "Hi there," fallback when absent). Nullable: sessions converted
-- before this ship have no name; nothing breaks.

alter table public.snapshot_quiz_sessions
  add column if not exists contact_name text;

notify pgrst, 'reload schema';
