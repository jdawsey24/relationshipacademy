-- Relationship Snapshot — the 6-quiz / 22-question / 26-cluster "Experience
-- Clusters" system (replaces the 47-item Snapshot; built in parallel). All tables
-- are `snapshot_`-prefixed so the future Relationship Profile™ build won't collide.
-- Content tables are seeded from /data (see scripts/seedSnapshot.ts). Public quiz
-- endpoints use the service-role client, so no public RLS policies are needed.

-- 1. CLUSTERS (26)
create table if not exists public.snapshot_clusters (
  id                  smallint primary key,        -- 1-26
  name                text not null,
  core_challenge      text not null,
  description         text not null,
  unmet_need          text not null,
  underlying_fear     text not null,
  playbook_title      text not null,
  playbook_subtitle   text not null,
  alignment_paragraph text not null,               -- Primary's full report copy
  secondary_blurb     text not null,               -- Secondary's one-liner (no CTA)
  content_pillars     jsonb not null default '[]'::jsonb,  -- backend use
  is_assessable       boolean not null default true        -- false for 2 & 17
);

-- 2. ASSESSMENTS (6 phase quizzes)
create table if not exists public.snapshot_assessments (
  id             text primary key,                 -- exploration | exclusivity | expansion | expiration | recovery | renewal
  display_name   text not null,
  entry_prompt   text not null,                    -- picker copy
  question_count smallint not null default 22
);

-- which clusters are valid outcomes for which assessment
create table if not exists public.snapshot_assessment_clusters (
  assessment_id text references public.snapshot_assessments(id) on delete cascade,
  cluster_id    smallint references public.snapshot_clusters(id),
  primary key (assessment_id, cluster_id)
);

-- 3. QUIZ ITEMS — curated statement bank (216, 8-10 per cluster)
create table if not exists public.snapshot_quiz_items (
  id         uuid primary key default gen_random_uuid(),
  cluster_id smallint references public.snapshot_clusters(id) not null,
  statement  text not null
);

-- 4. QUIZ QUESTIONS — pre-built 22-question rounds (NOT regenerated per session)
create table if not exists public.snapshot_quiz_questions (
  id             uuid primary key default gen_random_uuid(),
  assessment_id  text references public.snapshot_assessments(id) not null,
  question_order smallint not null,                -- 1-22
  option_count   smallint not null,                -- 4 or 5
  unique (assessment_id, question_order)
);

-- Options carry cluster_id + statement inline (matches quiz_questions.json;
-- scoring only needs the selected option's cluster_id).
create table if not exists public.snapshot_quiz_question_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid references public.snapshot_quiz_questions(id) on delete cascade not null,
  cluster_id   smallint references public.snapshot_clusters(id) not null,
  statement    text not null,
  option_order smallint not null
);

-- 5. SESSIONS — one per test-taker. Email/user_id null until conversion (CTA click).
create table if not exists public.snapshot_quiz_sessions (
  id                  uuid primary key default gen_random_uuid(),
  assessment_id       text references public.snapshot_assessments(id) not null,
  contact_email       text,
  user_id             uuid references auth.users(id),
  started_at          timestamptz not null default now(),
  completed_at        timestamptz,
  primary_cluster_id  smallint references public.snapshot_clusters(id),
  secondary_cluster_id smallint references public.snapshot_clusters(id),
  is_tied             boolean not null default false,
  converted_at        timestamptz,
  pdf_storage_path    text,
  pdf_generated_at    timestamptz
);

create table if not exists public.snapshot_quiz_answers (
  session_id         uuid references public.snapshot_quiz_sessions(id) on delete cascade not null,
  question_id        uuid references public.snapshot_quiz_questions(id) not null,
  selected_option_id uuid references public.snapshot_quiz_question_options(id) not null,
  answered_at        timestamptz not null default now(),
  primary key (session_id, question_id)
);

-- RLS on (service-role only, like the rest of the public assessment path).
alter table public.snapshot_clusters                enable row level security;
alter table public.snapshot_assessments             enable row level security;
alter table public.snapshot_assessment_clusters     enable row level security;
alter table public.snapshot_quiz_items              enable row level security;
alter table public.snapshot_quiz_questions          enable row level security;
alter table public.snapshot_quiz_question_options   enable row level security;
alter table public.snapshot_quiz_sessions           enable row level security;
alter table public.snapshot_quiz_answers            enable row level security;

create index if not exists idx_snapshot_qq_assessment on public.snapshot_quiz_questions (assessment_id, question_order);
create index if not exists idx_snapshot_qqo_question on public.snapshot_quiz_question_options (question_id);
create index if not exists idx_snapshot_answers_session on public.snapshot_quiz_answers (session_id);

notify pgrst, 'reload schema';
