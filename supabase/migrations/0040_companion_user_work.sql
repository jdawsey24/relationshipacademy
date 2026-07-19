-- Relationship Companion — Phase 1 (4/5): private user-generated work.
-- All rows are owner-only (RLS auth.uid() = user_id). Sensitive: never logged,
-- never in URLs, never cached offline. A saved entry is pinned to the exact
-- published experience version AND the relationship status active at the time —
-- revisions never rewrite the past.

create table if not exists public.companion_user_entries (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  experience_id         uuid references public.companion_experiences(id),
  experience_version_id uuid references public.companion_experience_versions(id), -- immutable version used
  structural_status_id  uuid references public.structural_statuses(id),           -- frozen status at creation
  entry_type            text not null default 'guided',   -- guided | free | plan | milestone
  status                text not null default 'draft',    -- draft | complete | archived
  title                 text,
  started_at            timestamptz not null default now(),
  completed_at          timestamptz,
  updated_at            timestamptz not null default now()
);
create index if not exists idx_companion_entries_user on public.companion_user_entries (user_id, updated_at desc);

-- Per-block answers (sensitive free text / selections).
create table if not exists public.companion_user_entry_responses (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid not null references public.companion_user_entries(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,  -- denormalized for a direct RLS check
  block_ref  text not null,
  response   jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (entry_id, block_ref)
);

create table if not exists public.companion_user_entry_tags (
  entry_id uuid not null references public.companion_user_entries(id) on delete cascade,
  user_id  uuid not null references auth.users(id) on delete cascade,
  tag      text not null,
  primary key (entry_id, tag)
);

create table if not exists public.companion_user_entry_favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  entry_id   uuid not null references public.companion_user_entries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, entry_id)
);

-- Conversation Planner (standalone or entry-linked).
create table if not exists public.companion_conversation_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  entry_id   uuid references public.companion_user_entries(id) on delete set null,
  fields     jsonb not null default '{}'::jsonb,   -- planner answers (sensitive)
  status     text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_companion_plans_user on public.companion_conversation_plans (user_id, updated_at desc);

-- Living Blueprint — one row per section, autosaved.
create table if not exists public.companion_blueprint_sections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  section_key text not null,
  body        jsonb not null default '{}'::jsonb,   -- sensitive
  updated_at  timestamptz not null default now(),
  unique (user_id, section_key)
);

-- Optional archived Blueprint revisions (immutable).
create table if not exists public.companion_blueprint_section_versions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  section_key text not null,
  body        jsonb not null default '{}'::jsonb,
  archived_at timestamptz not null default now()
);

create table if not exists public.companion_user_milestones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  label       text,
  body        jsonb not null default '{}'::jsonb,
  occurred_at timestamptz,
  created_at  timestamptz not null default now()
);

-- RLS: strictly owner-only on every private table.
alter table public.companion_user_entries               enable row level security;
alter table public.companion_user_entry_responses       enable row level security;
alter table public.companion_user_entry_tags            enable row level security;
alter table public.companion_user_entry_favorites       enable row level security;
alter table public.companion_conversation_plans         enable row level security;
alter table public.companion_blueprint_sections         enable row level security;
alter table public.companion_blueprint_section_versions enable row level security;
alter table public.companion_user_milestones            enable row level security;

drop policy if exists "own entries all" on public.companion_user_entries;
create policy "own entries all" on public.companion_user_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own entry responses all" on public.companion_user_entry_responses;
create policy "own entry responses all" on public.companion_user_entry_responses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own entry tags all" on public.companion_user_entry_tags;
create policy "own entry tags all" on public.companion_user_entry_tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own entry favorites all" on public.companion_user_entry_favorites;
create policy "own entry favorites all" on public.companion_user_entry_favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own plans all" on public.companion_conversation_plans;
create policy "own plans all" on public.companion_conversation_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own blueprint all" on public.companion_blueprint_sections;
create policy "own blueprint all" on public.companion_blueprint_sections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own blueprint versions all" on public.companion_blueprint_section_versions;
create policy "own blueprint versions all" on public.companion_blueprint_section_versions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own milestones all" on public.companion_user_milestones;
create policy "own milestones all" on public.companion_user_milestones for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

notify pgrst, 'reload schema';
