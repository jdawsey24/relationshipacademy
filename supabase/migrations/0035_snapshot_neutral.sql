-- Relationship Snapshot v2: the "None of these fit" neutral answer. A respondent
-- can decline every statement on a question; that answer scores nothing and is a
-- confidence signal. Additive and safe: new column defaults false, session
-- counters default 0. (No results-page behavior is attached to is_low_confidence
-- here — that's an intentionally open decision.)

-- A neutral answer selects no statement. Non-neutral answers must have one.
alter table public.snapshot_quiz_answers
  add column if not exists is_neutral boolean not null default false;
alter table public.snapshot_quiz_answers
  drop constraint if exists snapshot_answer_neutral_or_item;
alter table public.snapshot_quiz_answers
  add constraint snapshot_answer_neutral_or_item
  check (is_neutral = true or selected_session_item_id is not null) not valid;

-- Per-session neutral tally + the derived low-confidence flag (set at scoring).
alter table public.snapshot_quiz_sessions
  add column if not exists neutral_answer_count smallint not null default 0,
  add column if not exists is_low_confidence boolean not null default false;

notify pgrst, 'reload schema';
