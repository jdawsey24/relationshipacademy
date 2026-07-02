-- site_content: key/value overrides for editable website copy + global bits
-- (announcement banner, page section copy). Pages fall back to their built-in
-- defaults when a key is absent, so the site works with or without any rows.
-- Safe to run more than once. Run in the Supabase SQL editor.

create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.site_content enable row level security;

-- Website copy is public; allow anyone to read. Writes go through the admin
-- API using the service role, which bypasses RLS (no anon write policy).
drop policy if exists "site_content public read" on public.site_content;
create policy "site_content public read"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Force PostgREST to reload its schema cache immediately so the API sees the
-- new table without waiting for the periodic reload.
notify pgrst, 'reload schema';
