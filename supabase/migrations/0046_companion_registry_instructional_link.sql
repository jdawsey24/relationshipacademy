-- Relationship Situation Registry — INSTRUCTIONAL-LAYER integration. Links the
-- existing Companion experiences (built in 0038) to the situation catalog:
-- one situation -> many experiences over time. Adds the permanent experience ref
-- (EXP-{TYPE}-###) and experience-type FK. Additive; the live product is untouched.

alter table public.companion_experiences
  add column if not exists situation_id       text references public.reg_situations(situation_id),
  add column if not exists experience_ref      text,   -- permanent EXP-{TYPE}-### (distinct from the situation's RS-####)
  add column if not exists experience_type_id  text references public.reg_experience_types(experience_type_id);
create index if not exists idx_companion_experiences_situation on public.companion_experiences (situation_id);

notify pgrst, 'reload schema';
