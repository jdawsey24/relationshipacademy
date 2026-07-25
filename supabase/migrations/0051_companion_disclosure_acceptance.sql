-- Relationship Companion — electronic disclosure acceptance / version logging.
-- Implements Terms §32: record the document + version accepted, the date/time,
-- the user/account identifier, and minimal technical info. Versioned so a future
-- disclosure revision re-prompts (a user accepts each version once, idempotently).
--
-- OWNER-RUN. Additive + RLS-locked.

create table if not exists public.companion_disclosure_acceptances (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  disclosure_key     text not null,                       -- e.g. 'companion_informed_use'
  disclosure_version text not null,                       -- the exact version accepted
  event              text not null default 'i_understand_continue',
  user_agent         text,                                -- minimal technical context (no IP)
  accepted_at        timestamptz not null default now()   -- server-side timestamp
);

-- One acceptance per (user, document, version) → idempotent; re-accepting the same
-- version is a no-op, and a version bump requires a fresh acceptance.
create unique index if not exists uq_companion_disclosure_acceptance
  on public.companion_disclosure_acceptances (user_id, disclosure_key, disclosure_version);
create index if not exists idx_companion_disclosure_acceptance_user
  on public.companion_disclosure_acceptances (user_id);

-- RLS: a user may READ their own acceptance records (transparency); acceptances are
-- only WRITTEN server-side via the service role (a user can never forge an
-- acceptance on another account, and cannot insert directly).
alter table public.companion_disclosure_acceptances enable row level security;
drop policy if exists "own disclosure acceptances select" on public.companion_disclosure_acceptances;
create policy "own disclosure acceptances select"
  on public.companion_disclosure_acceptances for select using (auth.uid() = user_id);

notify pgrst, 'reload schema';
