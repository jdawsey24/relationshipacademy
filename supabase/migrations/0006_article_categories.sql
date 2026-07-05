-- article_categories: admin-managed Knowledge Center categories (replaces the
-- hard-coded list). articles.category stores the category NAME as free text, so
-- deleting a category here does not alter existing articles. Public reads are
-- allowed (used for the /learn topic list); writes go through the service role.
-- Seeded with the previous built-in list. Safe to run more than once.

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.article_categories enable row level security;

drop policy if exists "article_categories public read" on public.article_categories;
create policy "article_categories public read"
  on public.article_categories for select
  to anon, authenticated
  using (true);

insert into public.article_categories (name, sort_order) values
  ('Dating', 10), ('Commitment', 20), ('Marriage', 30), ('Conflict', 40),
  ('Breakups', 50), ('Divorce', 60), ('Healing', 70),
  ('Relationship Development', 80), ('Communication', 90), ('Emotional Wellness', 100)
on conflict (name) do nothing;

notify pgrst, 'reload schema';
