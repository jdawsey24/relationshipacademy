-- 0072 — the Studio reads the idea back before it starts writing.
--
-- The flow put every control on screen at once: paste box, shape, tone,
-- opening, and a button that writes three scripts. That asks her to specify a
-- piece before anything has established what the piece is about, and the
-- controls are meaningless until the idea has been understood.
--
-- So there is a step in front of it. The Studio says what it thinks she is
-- saying and offers three genuinely different takes on it. Nothing about shape,
-- tone, opening or platform appears until she has picked one, because until
-- then there is nothing for them to modify.

alter table public.ci_script_options
  drop constraint if exists ci_script_options_stage_check;

alter table public.ci_script_options
  add constraint ci_script_options_stage_check
  check (stage in ('hook', 'body', 'resolution', 'cta', 'variation', 'direction'));

-- What the Studio believes she is saying, in her own terms. Editable, because
-- being told what you meant and not being able to correct it is worse than not
-- being told.
alter table public.ci_conversations
  add column if not exists readback text;

comment on column public.ci_conversations.readback is
  'The Studio''s understanding of the idea, shown before any writing controls appear. Owner-editable.';
