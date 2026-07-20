-- Relationship Situation Registry — FRAMEWORK LAYER (theory-owned, canonical).
-- Sourced from RLC Master Knowledge Base v2.1; names/IDs must match canon exactly.
-- Read-mostly: the Companion never edits these. Additive, idempotent, RLS-locked
-- (service-role only). Kept in its own tables — never combined with the
-- classification or instructional layers. Recovery/Renewal have no competencies or
-- phase codes yet (canonical gap) — represented as NULLs, not invented.

create table if not exists public.fw_phases (
  phase_id           text primary key,              -- PH-001..PH-006
  name               text not null unique,
  phase_code         text,                           -- EXPL/EXCL/EXPN/EXPR; NULL for Recovery/Renewal (TBD)
  developmental_task text not null,                  -- one per phase
  display_order      smallint not null default 0
);

create table if not exists public.fw_domains (
  domain_id text primary key,                        -- DOM-001..DOM-006
  name      text not null unique
);

create table if not exists public.fw_competencies (
  competency_id      text primary key,               -- e.g. COM-EXPL-001
  name               text not null,
  phase              text not null,
  domain             text not null,
  developmental_task text,
  unique (name, phase, domain)
);
create index if not exists idx_fw_competencies_phase_domain on public.fw_competencies (phase, domain);

create table if not exists public.fw_behavioral_indicators (
  behavior_id    text primary key,                   -- BI-000001..
  competency_id  text references public.fw_competencies(competency_id),
  phase          text,
  domain         text,
  indicator      text not null,
  evidence_level text
);
create index if not exists idx_fw_bi_competency on public.fw_behavioral_indicators (competency_id);

alter table public.fw_phases                enable row level security;
alter table public.fw_domains               enable row level security;
alter table public.fw_competencies          enable row level security;
alter table public.fw_behavioral_indicators enable row level security;

notify pgrst, 'reload schema';
