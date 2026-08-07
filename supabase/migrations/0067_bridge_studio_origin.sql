-- 0067 — a mapping may originate from a Studio conversation, not only a trend.
--
-- THE PROBLEM. ce_relational_bridges.candidate_id is NOT NULL and references
-- ce_trend_candidates. That was correct when every piece of content began as a
-- detected trend. The Content Studio begins with the owner's own idea, which is
-- not a trend candidate and must never be recorded as one — writing a fake trend
-- row to satisfy a foreign key would falsify where the idea came from, and the
-- trend pipeline's scores would then describe something that was never detected.
--
-- Selecting a lens in the Studio therefore failed outright: null candidate_id
-- violates the constraint, and no honest value exists to put there.
--
-- THE FIX, AND WHY IT DOES NOT WEAKEN ANYTHING. candidate_id becomes nullable
-- and a conversation origin is added, but "a bridge must have an origin" is
-- preserved as a CHECK requiring EXACTLY ONE of the two. A bridge with no
-- provenance is still impossible, and a bridge claiming both origins — which
-- would make its provenance ambiguous — is newly impossible as well.
--
-- Existing rows are unaffected: every one of them has a candidate_id and no
-- conversation_id, which satisfies the new constraint.

alter table public.ce_relational_bridges
  alter column candidate_id drop not null;

alter table public.ce_relational_bridges
  add column if not exists conversation_id uuid
    references public.ci_conversations(id) on delete cascade;

-- Exactly one origin. Not zero, and not both.
alter table public.ce_relational_bridges
  drop constraint if exists ce_bridges_single_origin;
alter table public.ce_relational_bridges
  add constraint ce_bridges_single_origin check (
    (candidate_id is not null and conversation_id is null)
    or
    (candidate_id is null and conversation_id is not null)
  );

create index if not exists idx_ce_bridges_conversation
  on public.ce_relational_bridges (conversation_id)
  where conversation_id is not null;

comment on column public.ce_relational_bridges.conversation_id is
  'Set when the mapping came from a Content Studio conversation rather than a detected trend. Exactly one origin is required.';
