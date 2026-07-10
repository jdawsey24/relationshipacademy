-- Institute professional access. Reuses the same Supabase Auth + profiles as the
-- Academy; a boolean flag marks accounts that have professional (Institute)
-- access. Set to true when someone signs up through the Institute.
-- Safe to run more than once. Run in the Supabase SQL editor.

alter table public.profiles
  add column if not exists is_professional boolean not null default false;

notify pgrst, 'reload schema';
