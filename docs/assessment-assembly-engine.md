# Assessment Assembly Engine — Phase 1 (Specification → Measurement Model → Assembly)

_Status: built on branch `assessment-assembly-engine`, build-only. Owner runs migration `0028`, then reviews. **Do not merge until approved.**_

## Why

This evolves the Assessment Studio from item *generation* to a **measurement system**: define the construct + intended outcomes, derive the required evidence, then **deterministically** assemble the smallest, highest-quality set of **approved** items that satisfies it. A clean separation of intent from implementation, in four governed layers. The live 47-item Snapshot consumer path is untouched.

## The four layers

1. **Assessment Specification** — *what the assessment must accomplish* (purpose, audience, expected outputs, reading level, completion time, design constraints). Structured, additive columns on `studio_assessments`; edited on the instrument's **Specification** tab. Does not pick items.
2. **Measurement Model** — *auto-derived from the Specification*. The required competencies / behavioral indicators / domains / phases + per-outcome evidence requirements. Governed (versioned, owner-approved, append-only). Table `studio_assessment_measurement_models`.
3. **Assembly** — **deterministic**: the smallest, highest-quality approved-item set that satisfies the Model within the Specification's constraints. Immutable run (`studio_assessment_assemblies`) + membership junction (`studio_assessment_membership`). Same inputs → identical instrument (proven by `inputs_fingerprint`).
4. **Human review** — owner approves the Model and the Assembly before anything is "assembled".

## Deterministic engine (`lib/assemblyEngine.ts`, PURE)

- `deriveMeasurementModel(spec, framework)` — an auditable OUTPUT→REQUIRED-CONSTRUCTS rule map (`lib/assembly.ts`) expands each desired output + structural context + in-scope domains/phases, via the Framework, into required constructs + per-outcome minimum evidence.
- `assemble(model, spec, approvedItems)` — coverage-first greedy: satisfy every required competency to its minimum, then balance (domain/phase, reverse %, phase-anchored %, response-model consistency), then quality/redundancy (`runDeterministicItemChecks`, `tokenSimilarity` dedup, `fkGrade` reading level), deterministic tie-break by `item_id`. Reports **coverage adequacy** (NOT a fabricated reliability α — true reliability needs response data, deferred to validation).
- No DB / AI / `Date` / `Math.random` → byte-reproducible. `ENGINE_VERSION` + `inputs_fingerprint` on every run. Covered by `test/assembly.test.ts` (reproducibility, scope derivation, coverage/fulfilment, exclusion of out-of-scope/draft/duplicates, empty-bank honesty).

## Assembly Report — outcome-fulfilment FIRST

Leads with **purpose validation**: for each desired output, is it supported by the assembled evidence? Names under-represented competencies/indicators and what's still required, before any technical stats (searched/selected, reverse %, reading grade, completion time, duplicates, fingerprint).

## AI's bounded role

This phase is **fully deterministic** — no AI call, no new AI cost surface. Coverage-gap generation is a link to the existing AI Assessment Builder (staged `generateAssessmentItemsStaged` → Review Queue → approve → bank). An optional "Explain with AI" narrative over the deterministic stats is a deferred enhancement.

## Migration `0028_assessment_assembly.sql` (owner-run, additive, isolated)

Additive columns on `studio_assessments` (`structural_context`, `target_reading_level`, `target_completion_minutes`, `desired_outputs`, `design_constraints`) + three RLS-locked governed tables. **No `ALTER` on `studio_assessment_items` or any live table.**

## Governance

Editors author drafts; **owner** approves the Measurement Model and the Assembly. Approving supersedes the prior current (history preserved, never deleted). Assembly runs are immutable audit records. Item→assessment membership is a junction (items reusable across instruments), each row tagged with the constructs it satisfies.

## The all-draft bank

All 1,665 items are currently `status='draft'` → 0 assembly-eligible. The engine reports this honestly ("0 approved items available" + unmet requirements). Approve items via the existing Item Bank bulk-approve to build the pool.

## Consumer path — UNCHANGED

No edits to `app/api/score`, `app/api/results`, `lib/scoring.ts`, `app/snapshot`. Membership/Model/Assembly are read only in the admin Studio.

## Files

**New:** `supabase/migrations/0028_assessment_assembly.sql`; `lib/assembly.ts`; `lib/assemblyEngine.ts`; `lib/assemblyData.ts`; `app/api/admin/studio/assessment/{measurement-model,assembly}/…`; `app/admin/studio/assessment/instruments/[id]/{measurement-model,assembly}/page.tsx`; `components/admin/InstrumentSubNav.tsx`; `test/assembly.test.ts`; this doc.
**Changed (additive):** `lib/studioAssessment.ts` (Specification fields on `Assessment`), instrument detail page (Specification section + sub-nav), assessments PATCH whitelist.

## Verification

- `tsc` clean; `npm run build` green (6 new routes); `npm test` **44 pass** (incl. reproducibility).
- Consumer path untouched (`git diff --stat`).
- Resilient pre-migration (pages show empty states; framework derivation verified against live data).
- Post-`0028` E2E (owner): Specification → generate + approve Model → run assembly (0 approved → honest unmet report; approve items → engine selects them; fingerprint stable on re-run) → approve assembly.

## Deferred phases

Sandbox (simulate an assembled set via a new multi-item loader) · dual Participant/Developer Preview · outcome-first Builder redesign · consumer "Developmental Alignment / Relationship Alignment" language · optional AI narrative · publish an assembled instrument to live.
