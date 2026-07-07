-- Certificates: issued when a member completes 100% of a course's published
-- lessons. One per (user, course). Name + course title are snapshotted at issue
-- time so the certificate stays accurate even if the profile/course changes.
-- Safe to run more than once. Run in the Supabase SQL editor.

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  serial text not null unique,          -- human-friendly certificate number
  recipient_name text,                  -- snapshot of the member's name at issue
  course_title text,                    -- snapshot of the course title at issue
  issued_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.certificates enable row level security;

-- A member can read their own certificates. Issuance happens server-side via the
-- service role.
drop policy if exists "own certificates select" on public.certificates;
create policy "own certificates select"
  on public.certificates for select
  using (auth.uid() = user_id);

notify pgrst, 'reload schema';
