# Cluster 1 — Change Path + Home (Step 8)

**Status:** FOR REVIEW. Flag-gated; v0 unchanged. No deploy, no migration.
**Source of truth:** `lib/playbook/changePath.ts` (orchestrator) + `components/playbook/ChangePathHome.tsx` (home).

Change Path is the **internal** orchestrator that ties the five layers together. It reads only first-party functional state and returns a prioritized surface + one plain "Your Next Step" line. It is **not** a hidden assessment, and the consumer home presents it plainly — never as a clinical plan.

## Inferential boundary (enforced in code + tests)
- **Uses only:** recognition selections; declared focus; simulation completion + fidelity states; play operations performed (outputs/play_states); mission selection + reported attempt; structured Use-Review responses; Keep/Update/Save (tool review); current/prior focus.
- **Content engagement (literature read) is NOT read** — reading never advances a stage or a change claim (regression-tested: identical result with/without `literature_state.read`).
- **Never infers from** relationship outcomes, mood, emotional intensity, traits/personality/attachment, partner motives, diagnosis, etiology, free text, completions-alone, or time.
- **Observation-not-trait:** every next-step line describes what was demonstrated/reported in a specific context; a regression test rejects trait/etiology constructions and prescriptive verdicts. **Absence is an invitation, never inability/avoidance.** No mastery claims.

## Stages (derived only from functional state)
`unrecognized → recognized → in_progress → practiced_in_app → attempted → reviewed` — a play advances only as functional signals accrue (recognition → simulation completed / explored → operation performed in app → mission attempt reported → Use Review submitted).

## "Your Next Step" (exact lines)
- **recognized:** "A good place to start is “[Play].”" *(invitation)*
- **in_progress:** "You started “[Play].” Picking it back up is the next step."
- **practiced_in_app:** "You've worked through “[Play].” A useful next step is taking it into real life."
- **attempted:** "You tried this in real life. A quick, honest look at how it went is the next step."
- **reviewed + Pattern A (RD, partly, stuck-on-acting):** "In your recent practice, you separated what you observed from what you were assuming. A useful next step may be deciding what to do with that information."
- **reviewed (RD, other friction):** "In your recent practice, you were working the read. A useful next practice may be another round — separating what you saw from what you're guessing."
- **reviewed (WM, feeling-made-it-true):** "In your recent practice, you named the fact; the feeling made it loud. A useful next practice may be holding the fact while the feeling stays."
- **reviewed + performed=yes:** "You've been using “[Play]” in real life. When you're ready, a useful next area may be another pattern to work on — or keep this one going."
- **nothing done yet:** *null* (no verdict).

## Focus selection
The furthest-along **incomplete recognized** area is the focus; a **declared** focus wins if still active. `recordChangePathFocus` stores `current`/`prior` focus (moved to `change_path_state`) when the reader follows the CTA.

## Home / IA (resuming, non-clinical)
A returning reader (any functional state) **resumes on the home**, not the onboarding opening (first-time users still see the opening). The home shows:
- **Your next step** (the line above) + a single CTA into the surfaced experience.
- **What I'm practicing** — the one current mission (hidden once reviewed; one active focus at a time).
- Entry points: **Understand this pattern** (field guide, now surfaced), **Where you might start** (board), **My Plays**, **Explore another area** (always available; never locked).

Flag OFF → the v0 opening → recognition → board flow is completely unchanged (a test asserts a returning user in v0 still lands on the opening).

## Gates
No gamification, no mastery claim, no partner surveillance, no diagnosis/plan framing; no deploy; no migration; no Snapshot/scoring/commerce/framework changes; remaining four Plays not authored.
