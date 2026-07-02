-- articles: Knowledge Center (Learn) content. Public reads see only published
-- rows; the admin reads/writes via the service role (bypasses RLS). Safe to
-- run more than once. Run in the Supabase SQL editor.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  category text,
  summary text,
  content text,               -- markdown
  featured_image_url text,
  author text,
  publish_date date,
  status text not null default 'draft',   -- draft | published
  tags text,                  -- comma-separated
  related_phase_slug text,    -- phase slug (matches the pre-existing column name)
  cta_text text,
  cta_url text,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now(),
  updated_by text,
  created_at timestamptz not null default now()
);

alter table public.articles enable row level security;

drop policy if exists "articles public read published" on public.articles;
create policy "articles public read published"
  on public.articles for select
  to anon, authenticated
  using (status = 'published');

notify pgrst, 'reload schema';
