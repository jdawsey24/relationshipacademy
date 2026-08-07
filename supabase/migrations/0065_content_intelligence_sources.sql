-- RLC Content Intelligence — source governance (Phase A).
--
-- Three problems this fixes, all found by audit:
--
-- 1. NOTHING RECORDED WHAT A SOURCE GOVERNS. Tier alone cannot resolve a
--    conflict, because the Facilitator Manual and the Operations Manual are both
--    Tier 1 and govern different things. `authority_scope` says what each source
--    is authoritative ABOUT, so the system compares like with like and a richer
--    Knowledge Base record is not mistaken for disagreement with a thinner manual
--    entry. Detail is not conflict.
--
-- 2. `status='active'` MEANT TWO THINGS AT ONCE. On kb_competencies it meant
--    both "indexed and retrievable" and, by implication, "valid to map from" —
--    so importing v0.1 working material as `active` made it look governed. The
--    two are now separate columns and nothing infers approval from availability.
--
-- 3. NO VERSION HAD APPROVAL EVIDENCE. No Knowledge Base version has documented
--    approval. `approval_state` therefore defaults to 'unverified', and a check
--    constraint refuses to record 'approved' without evidence, or a supersession
--    without proof of it. v2.1 is NOT marked historical.
--
-- Idempotent. Run in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Source registry
-- ---------------------------------------------------------------------------
create table if not exists public.kb_source_registry (
  id                    uuid primary key default gen_random_uuid(),
  source_key            text not null unique,
  title                 text not null,
  source_type           text not null,   -- manual | knowledge_base | clusters
                                         -- | situation_registry | companion_workbook
  tier                  integer not null,               -- 1 governing · 2 implementation · 3 application
  authority_scope       text[] not null default '{}',   -- WHAT this source governs
  version               text,
  version_label         text,
  version_evidence      text,            -- where the version claim comes from
  approval_state        text not null default 'unverified',  -- approved|in_review|draft|unverified
  approval_evidence     text,            -- who, when, which document. NULL ⇒ not approved
  supersedes_id         uuid references public.kb_source_registry(id),
  supersession_evidence text,            -- NULL ⇒ no supersession may be asserted
  retrieval_scope       text not null default 'general', -- general|product_companion|on_request
  product_boundary      text,
  quarantine_note       text,
  indexed_at            timestamptz,
  record_count          integer,
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'kb_source_tier_check') then
    alter table public.kb_source_registry add constraint kb_source_tier_check
      check (tier in (1, 2, 3));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'kb_source_approval_check') then
    alter table public.kb_source_registry add constraint kb_source_approval_check
      check (approval_state in ('approved', 'in_review', 'draft', 'unverified'));
  end if;
  -- Approval requires evidence. This is the constraint that makes "approved"
  -- mean something rather than being an assertion anybody can type.
  if not exists (select 1 from pg_constraint where conname = 'kb_source_approval_evidence') then
    alter table public.kb_source_registry add constraint kb_source_approval_evidence
      check (approval_state <> 'approved' or approval_evidence is not null);
  end if;
  -- A supersession claim needs proof. Filenames are not proof.
  if not exists (select 1 from pg_constraint where conname = 'kb_source_supersession_evidence') then
    alter table public.kb_source_registry add constraint kb_source_supersession_evidence
      check (supersedes_id is null or supersession_evidence is not null);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'kb_source_retrieval_scope') then
    alter table public.kb_source_registry add constraint kb_source_retrieval_scope
      check (retrieval_scope in ('general', 'product_companion', 'on_request'));
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Record-level governance
--
--    A workbook's tabs do not share a governance status. The Situation
--    Registry's descriptions may be approved while its Framework Crosswalk is
--    quarantined, in the same file — so status lives on the section, not the
--    source.
-- ---------------------------------------------------------------------------
create table if not exists public.kb_source_records (
  id                 uuid primary key default gen_random_uuid(),
  source_id          uuid not null references public.kb_source_registry(id) on delete cascade,
  section            text not null,
  record_key         text,
  governance_status  text not null default 'draft',  -- approved|draft|quarantined|superseded
  retrieval_eligible boolean not null default false,
  note               text,
  created_at         timestamptz not null default now(),
  unique (source_id, section, record_key)
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'kb_source_records_status') then
    alter table public.kb_source_records add constraint kb_source_records_status
      check (governance_status in ('approved', 'draft', 'quarantined', 'superseded'));
  end if;
  -- Quarantined material can never be retrieval-eligible, whatever else is set.
  if not exists (select 1 from pg_constraint where conname = 'kb_source_records_quarantine') then
    alter table public.kb_source_records add constraint kb_source_records_quarantine
      check (governance_status <> 'quarantined' or retrieval_eligible = false);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Separate indexing from framework approval on the narrative layer
--
--    kb_competencies.status conflated the two. It is left in place so nothing
--    that reads it breaks; these two carry the real meaning from here on.
-- ---------------------------------------------------------------------------
alter table public.kb_competencies
  add column if not exists index_state text not null default 'indexed';
alter table public.kb_competencies
  add column if not exists framework_approval_state text not null default 'unverified';
alter table public.kb_competencies
  add column if not exists source_version_label text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'kb_comp_index_state') then
    alter table public.kb_competencies add constraint kb_comp_index_state
      check (index_state in ('indexed', 'excluded'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'kb_comp_framework_approval') then
    alter table public.kb_competencies add constraint kb_comp_framework_approval
      check (framework_approval_state in ('approved', 'in_review', 'draft', 'unverified'));
  end if;
end $$;

-- Refined Option C. The 44 Recovery and Renewal records stay indexed and
-- retrievable for exploration, and are marked in_review with their v0.1
-- provenance so nothing downstream can mistake them for approved architecture.
update public.kb_competencies
   set framework_approval_state = 'in_review',
       source_version_label = 'v0.1 (working; July 2026)'
 where kind = 'competency'
   and code ~ '-(RECV|RENW)-'
   and framework_approval_state <> 'in_review';

-- The original 111 carry the Knowledge Base's own recorded state, which is
-- Draft. Not approved — no version has documented approval evidence.
update public.kb_competencies
   set framework_approval_state = 'draft',
       source_version_label = coalesce(source_version_label, 'v1.0 (canonical)')
 where kind = 'competency'
   and code !~ '-(RECV|RENW)-'
   and framework_approval_state = 'unverified';

-- ---------------------------------------------------------------------------
-- 4. Bridge lifecycle — validation is not approval
--
--    `approved for reusable application` is a SEPARATE optional action, not the
--    final stage of every draft. Default is the least privileged value so no
--    existing row is silently promoted.
-- ---------------------------------------------------------------------------
alter table public.ce_relational_bridges
  add column if not exists lifecycle_state text not null default 'draft';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ce_bridges_lifecycle') then
    alter table public.ce_relational_bridges add constraint ce_bridges_lifecycle
      check (lifecycle_state in
        ('draft', 'validated_for_current_content', 'owner_approved', 'rejected', 'superseded'));
  end if;
end $$;

comment on column public.ce_relational_bridges.lifecycle_state is
  'draft → validated_for_current_content → (optionally) owner_approved. Only owner_approved may be reused as a general mapping. Validation for one draft never promotes a bridge.';

create index if not exists idx_ce_bridges_lifecycle
  on public.ce_relational_bridges (lifecycle_state);

-- ---------------------------------------------------------------------------
-- 5. Seed the registry — with evidence, or with none recorded
-- ---------------------------------------------------------------------------
insert into public.kb_source_registry
  (source_key, title, source_type, tier, authority_scope, version, version_label,
   version_evidence, approval_state, retrieval_scope, notes)
values
  ('facilitator_manual', 'Relationship Life Cycle Facilitator Manual', 'manual', 1,
   '{theoretical_meaning,phase_purpose,developmental_logic,conceptual_boundary}',
   null, null, null, 'unverified', 'general',
   'Governs theory. Not yet indexed — retrieval cannot cite it.'),

  ('operations_manual', 'RLC Operational Definitions / Operations Manual', 'manual', 1,
   '{terminology,construct_definition,competency_architecture,identifier,operational_rule}',
   null, null, null, 'unverified', 'general',
   'Governs terminology and architecture. Not yet indexed.'),

  ('knowledge_base', 'Current Knowledge Base implementation source, approval status unresolved',
   'knowledge_base', 2,
   '{approved_detail,indicators,applications,narrative}',
   null, 'mixed: v1.0 (canonical) ×111, v0.1 (working; July 2026) ×44',
   'Workbook 22_Competency_Details Version / Source Version / Status columns',
   'unverified', 'general',
   'No Knowledge Base version has documented approval evidence. Do not label any version approved until it does. v2.1 is not marked historical because no verified successor exists.'),

  ('experience_clusters', 'RLC Experience Clusters', 'clusters', 3,
   '{audience_language,situational_pattern}', null, null, null, 'unverified', 'general',
   'Interpretive only. A cluster''s proposed or questioned phase association may not override a governing manual or the Knowledge Base.'),

  ('situation_registry', 'Relationship Situation Registry', 'situation_registry', 3,
   '{situation_description,search_language}', null, null, null, 'unverified', 'general',
   'Framework Crosswalk is quarantined at record level. Descriptions and search language may be retrievable where approved.'),

  ('recovery_renewal_manual', 'Recovery and Renewal Competency Manual', 'manual', 3,
   '{application}', 'v0.1', 'v0.1 (working; July 2026)',
   'Workbook Source Version column on the 44 Recovery/Renewal rows',
   'in_review', 'general',
   'Working manual. Its competency material is retrievable for exploration but cannot become a validated mapping or reusable bridge while in review.'),

  ('companion_review_workbook', 'Companion Competency Review Workbook', 'companion_workbook', 3,
   '{product_application}', null, null, null, 'unverified', 'product_companion',
   'Retrieved only for Companion conversations, approved Companion campaigns, or on explicit request.'),

  ('companion_architecture_workbook', 'Relationship Companion Architecture Workbook', 'companion_workbook', 3,
   '{product_application}', null, null, null, 'unverified', 'product_companion',
   'Product boundary enforced in the retrieval query, not in prompt text.')
on conflict (source_key) do nothing;

update public.kb_source_registry
   set product_boundary = 'Relationship Companion'
 where retrieval_scope = 'product_companion' and product_boundary is null;

-- The Situation Registry crosswalk, quarantined at section level.
insert into public.kb_source_records (source_id, section, record_key, governance_status, retrieval_eligible, note)
select id, 'framework_crosswalk', null, 'quarantined', false,
       'Quarantined by owner ruling. Only 29 of 60 crosswalks resolved to the phase they claimed. Excluded from validated RLC retrieval until separately reviewed.'
  from public.kb_source_registry where source_key = 'situation_registry'
on conflict (source_id, section, record_key) do nothing;

alter table public.kb_source_registry enable row level security;
alter table public.kb_source_records  enable row level security;
