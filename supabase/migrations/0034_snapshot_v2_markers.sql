-- Relationship Snapshot v2: structural-marker quizzes with a primary/shadow tier
-- model and session-time statement resolution. Additive (safe to run before the
-- swap): new columns are nullable, new tables are empty. The v2 seed then does the
-- content swap (5 markers, 27 clusters, slot-based questions).

-- Markers carry the phase pair (reference).
alter table public.snapshot_assessments
  add column if not exists primary_phase text,
  add column if not exists shadow_phase  text;

-- Each valid cluster is primary or shadow FOR THIS MARKER (a cluster can be
-- primary for one marker and shadow for another).
alter table public.snapshot_assessment_clusters
  add column if not exists tier text;   -- 'primary' | 'shadow'

-- Cluster 24's pool is context-split (pre_definition / post_definition); null for
-- every other cluster.
alter table public.snapshot_quiz_items
  add column if not exists context text;

-- The FIXED question structure: one row per slot, locked to a cluster + tier.
-- (Replaces the v1 options-with-inline-statement model; the statement is resolved
-- per session instead.)
create table if not exists public.snapshot_quiz_question_slots (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid references public.snapshot_quiz_questions(id) on delete cascade not null,
  slot_order  smallint not null,
  cluster_id  smallint references public.snapshot_clusters(id) not null,
  tier        text not null,            -- 'primary' | 'shadow'
  unique (question_id, slot_order)
);
create index if not exists idx_snapshot_slots_question on public.snapshot_quiz_question_slots (question_id);

-- The statement resolved for each slot AT SESSION START (sampled without
-- replacement per cluster, so no statement repeats within a session).
create table if not exists public.snapshot_quiz_session_items (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references public.snapshot_quiz_sessions(id) on delete cascade not null,
  question_id uuid references public.snapshot_quiz_questions(id) not null,
  slot_order  smallint not null,
  cluster_id  smallint references public.snapshot_clusters(id) not null,
  tier        text not null,
  statement   text not null,
  unique (session_id, question_id, slot_order)
);
create index if not exists idx_snapshot_session_items on public.snapshot_quiz_session_items (session_id, question_id);

-- Answers now reference the chosen resolved statement (session_item), not a
-- pre-baked option. Keep the old column for v1 rollback; make it nullable.
alter table public.snapshot_quiz_answers
  add column if not exists selected_session_item_id uuid references public.snapshot_quiz_session_items(id);
alter table public.snapshot_quiz_answers
  alter column selected_option_id drop not null;

notify pgrst, 'reload schema';
