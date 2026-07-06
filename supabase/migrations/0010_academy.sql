-- Academy portal: the protected member learning environment.
--
-- Two independent axes of access (kept separate on purpose):
--   1. Staff role  -> auth app_metadata.role (owner/editor/viewer) — governs /admin. UNCHANGED here.
--   2. Membership tier -> profiles.membership_tier — governs Academy CONTENT.
--
-- Personal tables (profiles, lesson_progress, journal_entries) are RLS-locked so a
-- member can only ever touch their OWN rows. Content tables (courses/modules/lessons/
-- workbooks/announcements) have RLS enabled with NO public policy: they are NOT
-- world-readable (this is paid content), and are read server-side via the service
-- role with tier gating enforced in application code (lib/academyAuth.ts).
--
-- Safe to run more than once. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- profiles: one row per Academy member, keyed to auth.users.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  membership_tier text not null default 'free',   -- free | academy | academy_plus | professional
  skool_joined boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- courses / modules / lessons
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  audience text,
  learning_objectives jsonb not null default '[]'::jsonb,
  estimated_minutes integer,
  min_tier text not null default 'academy',     -- lowest tier that unlocks the course
  cover_image_url text,
  sort_order integer not null default 0,
  status text not null default 'draft',          -- draft | published
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  summary text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  video_url text,
  content text,                                  -- markdown lesson body
  key_takeaways text,                            -- markdown / newline list
  reflection_questions jsonb not null default '[]'::jsonb,
  homework text,
  workbook_url text,
  skool_url text,
  min_tier text not null default 'academy',
  is_preview boolean not null default false,     -- free users can view regardless of tier
  estimated_minutes integer,
  sort_order integer not null default 0,
  status text not null default 'draft',          -- draft | published
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text,
  unique (course_id, slug)
);

-- ---------------------------------------------------------------------------
-- lesson_progress: per-user, per-lesson. Powers Continue Learning / % / last viewed.
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'started',        -- started | completed
  last_viewed_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- journal_entries: private reflections, optionally tied to a lesson/course.
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  title text,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- workbooks: downloadable PDFs/worksheets. Files live in the "media" bucket.
-- ---------------------------------------------------------------------------
create table if not exists public.workbooks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  description text,
  file_url text,                                 -- public URL in the "media" bucket (null = placeholder)
  min_tier text not null default 'academy',
  sort_order integer not null default 0,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- announcements: shown on the dashboard, tier-scoped.
-- ---------------------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  min_tier text not null default 'free',
  status text not null default 'published',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles         enable row level security;
alter table public.courses          enable row level security;
alter table public.modules          enable row level security;
alter table public.lessons          enable row level security;
alter table public.lesson_progress  enable row level security;
alter table public.journal_entries  enable row level security;
alter table public.workbooks        enable row level security;
alter table public.announcements    enable row level security;

-- Personal data: a member can only see/change their own rows. Service role bypasses.
drop policy if exists "own profile select" on public.profiles;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own progress all" on public.lesson_progress;
create policy "own progress all" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own journal all" on public.journal_entries;
create policy "own journal all" on public.journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Content tables: NO anon/authenticated policy on purpose. Reads happen server-side
-- via the service role with tier gating in application code, so paid content is
-- never exposed directly to the browser.

-- ---------------------------------------------------------------------------
-- Auto-provision a profile row when a new auth user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
exception
  -- A trigger on auth.users must NEVER be able to break signup. If the profile
  -- insert fails for any reason, swallow it — the app also creates the profile
  -- lazily on first login (ensureProfile in lib/academyAuth.ts).
  when others then
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Seed: sample course "Date With Intention™" (published) with Module 1 + 4 lessons.
-- Fixed UUIDs so re-running is idempotent (on conflict do nothing).
-- ---------------------------------------------------------------------------
insert into public.courses (id, slug, title, subtitle, description, audience, learning_objectives, estimated_minutes, min_tier, sort_order, status)
values (
  'a0000000-0000-4000-a000-000000000001',
  'date-with-intention',
  'Date With Intention™',
  'A developmental approach to dating with clarity, confidence, and discernment.',
  'Most people were never taught how to date. This course reframes dating as a developmental skill — a way of gathering information about yourself and others — so you can move through the early stages with clarity instead of anxiety.',
  'Singles and people in the early dating stage.',
  '["Understand dating as a learnable, developmental skill","Get clear on what you are actually looking for","Treat dating as information-gathering rather than performance","Move from trying to be chosen to choosing with discernment"]'::jsonb,
  45,
  'academy',
  0,
  'published'
) on conflict (id) do nothing;

insert into public.modules (id, course_id, title, summary, sort_order)
values (
  'b0000000-0000-4000-a000-000000000001',
  'a0000000-0000-4000-a000-000000000001',
  'Why Are You Dating?',
  'Before the how, the why. This module reframes what dating is actually for.',
  0
) on conflict (id) do nothing;

insert into public.lessons (id, module_id, course_id, slug, title, content, key_takeaways, reflection_questions, homework, is_preview, min_tier, sort_order, status, estimated_minutes)
values
  ('c0000000-0000-4000-a000-000000000001','b0000000-0000-4000-a000-000000000001','a0000000-0000-4000-a000-000000000001',
   'most-people-were-never-taught-how-to-date','Most People Were Never Taught How to Date',
   '_Video and full lesson content coming soon._

Most of us learned to date by absorbing scripts — from movies, from friends, from our families — that were never really examined. This lesson names that gap and reframes dating as a skill that can be learned rather than a personality trait you either have or don''t.',
   E'Dating is a learnable skill, not an innate trait.\nThe scripts you inherited were never examined.\nNaming the gap is the first step to dating differently.',
   '["What did you learn about dating growing up — and from whom?","Which of those lessons still runs in the background today?"]'::jsonb,
   'Write down three "rules" about dating you absorbed without choosing. Note where each one came from.',
   true, 'free', 0, 'published', 10),

  ('c0000000-0000-4000-a000-000000000002','b0000000-0000-4000-a000-000000000001','a0000000-0000-4000-a000-000000000001',
   'what-are-you-actually-looking-for','What Are You Actually Looking For?',
   '_Video and full lesson content coming soon._

Attraction is easy to feel and hard to explain. This lesson separates what you''ve been told to want from what actually helps you thrive, and gives you language for the difference.',
   E'Wanting and thriving are not the same thing.\nClarity beats a longer checklist.\nName the qualities behind the qualities.',
   '["When you imagine a good relationship, what are you actually picturing?","What do you tend to prioritize in the moment vs. what serves you long-term?"]'::jsonb,
   'Draft a short "what I''m actually looking for" statement — no more than three sentences.',
   false, 'academy', 1, 'published', 12),

  ('c0000000-0000-4000-a000-000000000003','b0000000-0000-4000-a000-000000000001','a0000000-0000-4000-a000-000000000001',
   'dating-is-gathering-information','Dating Is Gathering Information',
   '_Video and full lesson content coming soon._

A date is not an audition — it''s a chance to learn. This lesson reframes each interaction as information-gathering, which lowers the pressure and sharpens your discernment.',
   E'A date is data, not a verdict.\nCuriosity outperforms performance.\nYou are also the one deciding.',
   '["What would change if a date were about learning instead of being liked?","What information do you tend to overlook when you like someone?"]'::jsonb,
   'On your next interaction (real or imagined), notice one piece of information you''d normally skip past.',
   false, 'academy', 2, 'published', 11),

  ('c0000000-0000-4000-a000-000000000004','b0000000-0000-4000-a000-000000000001','a0000000-0000-4000-a000-000000000001',
   'stop-trying-to-be-chosen','Stop Trying to Be Chosen',
   '_Video and full lesson content coming soon._

When the goal is to be chosen, you audition. When the goal is to choose well, you evaluate. This lesson moves you from performance to discernment.',
   E'Being chosen is a passive goal; choosing is an active one.\nDiscernment is a form of self-respect.\nYou set the standard you''re willing to meet.',
   '["Where do you catch yourself performing to be chosen?","What would choosing with discernment look like for you this week?"]'::jsonb,
   'Name one standard you''re no longer willing to abandon to be chosen.',
   false, 'academy', 3, 'published', 12)
on conflict (id) do nothing;

insert into public.workbooks (id, course_id, lesson_id, title, description, file_url, min_tier, sort_order, status)
values (
  'd0000000-0000-4000-a000-000000000001',
  'a0000000-0000-4000-a000-000000000001',
  null,
  'Date With Intention™ Workbook',
  'The companion workbook for the course — reflection prompts and worksheets for each lesson.',
  null,
  'academy',
  0,
  'published'
) on conflict (id) do nothing;

insert into public.announcements (id, title, body, min_tier, status)
values (
  'e0000000-0000-4000-a000-000000000001',
  'Welcome to the Academy',
  'This is your private learning home for the Relationship Life Cycle™. Start with Date With Intention™, and head to the Community tab to join the conversation on Skool.',
  'free',
  'published'
) on conflict (id) do nothing;

notify pgrst, 'reload schema';
