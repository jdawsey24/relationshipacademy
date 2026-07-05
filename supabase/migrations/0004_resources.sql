-- resources: downloadable Knowledge Center files (guides, PDFs, worksheets).
-- Files themselves live in the public "media" Storage bucket; this table holds
-- the metadata + the file's public URL. Public reads see only published rows;
-- the admin reads/writes via the service role (bypasses RLS). Safe to run more
-- than once. Run in the Supabase SQL editor.

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,          -- public URL in the "media" bucket
  file_name text,                  -- original/display filename
  file_type text,                  -- e.g. "pdf", "docx" (for the badge)
  category text,
  status text not null default 'published',   -- draft | published
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by text,
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

drop policy if exists "resources public read published" on public.resources;
create policy "resources public read published"
  on public.resources for select
  to anon, authenticated
  using (status = 'published');

notify pgrst, 'reload schema';
