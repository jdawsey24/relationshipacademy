-- Professional Institute offerings — the items shown under each Institute section
-- (CE Courses, Workshops, Certifications, Professional Resources, Research,
-- Events). Managed in the admin (Admin → Institute). Public pages read the
-- published rows; if none exist for a section, the app falls back to built-in
-- defaults so the pages are never empty.
-- Safe to run more than once. Run in the Supabase SQL editor.

create table if not exists public.institute_offerings (
  id uuid primary key default gen_random_uuid(),
  section text not null,               -- ce_courses | workshops | certifications | professional_resources | research | events
  title text not null,
  description text,
  status text not null default 'in_development',  -- draft (hidden) | in_development | available
  cta_label text,                      -- optional button label (e.g. "Register")
  cta_url text,                        -- optional link target
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create index if not exists institute_offerings_section_idx on public.institute_offerings (section);

alter table public.institute_offerings enable row level security;

-- Public reads see everything except drafts. Admin writes via the service role.
drop policy if exists "institute offerings public read" on public.institute_offerings;
create policy "institute offerings public read"
  on public.institute_offerings for select
  to anon, authenticated
  using (status <> 'draft');

notify pgrst, 'reload schema';
