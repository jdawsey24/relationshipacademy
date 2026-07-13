# RLC Relationship Snapshot™ — deterministic scoring system (build-only)

**Status: BUILD-ONLY on branch `studio-scoring`. Not merged, not deployed, not activated for public.** Per the spec, nothing activates for public users until the owner reviews the rules and approves the simulation. All thresholds are **provisional**.

## 1. Architecture summary

A pure, deterministic scoring service for the **Studio-authored** Snapshot (separate from the live 47-item quiz in `lib/scoring.ts`, which is untouched). The owner authors rules + provisional cut-points; the engine computes; **AI never enters this path** (it may later only rephrase approved copy). Flow:

`structural context (given) + responses → item scoring (reverse only when approved) → competency → domain → phase means (min-valid → confidence) → banded results → findings (structural context, phase alignment, domain functioning, incongruence, expiration risk vs adaptive, top-2 strengths, priority growth) → recommendation selection (Finding → approved mapping → published asset, respecting suppression/boundary) → next developmental step`

Every score result carries `valid_response_count`, `confidence_status`, and `rule_version`; findings link to their source `score_result` ids; recommendations link to their mapping — full traceability.

## 2. Files
- **Migration** `supabase/migrations/0026_studio_scoring.sql` — extends `studio_scoring_rules` (`formula_type`, `formula_config`) + `studio_interpretation_rules` (`trigger_config`, `suppression_config`); adds `studio_scoring_rule_inputs`, `studio_phase_option_mappings`, `studio_incongruence_rules`, `studio_assessment_attempts`, `studio_score_results`, `studio_assessment_findings`, `studio_recommendation_results`. RLS-locked; provisional defaults; additive.
- **Deterministic service** `lib/studioScoring.ts` (pure) — `scoreItem`, `resolveBand`, `computeScores`, `deriveFindings`, `selectRecommendations`, `resolvePhaseOption`, `compareDomains`. Server integration `lib/studioScoringData.ts` (`runSimulation`, `getAttemptTrace`).
- **APIs** `app/api/admin/studio/scoring/*` — `simulate`, `attempts/[id]`, `scope-items`, `rules` (+`[id]/inputs`), `incongruence` (+`[id]`), `phase-mappings`. requireEditor writes / requireOwner deletes; audited.
- **UI** Studio → Assessment → **Scoring** (`/admin/studio/assessment/scoring`): tabs — **Simulation** (scope + structural context + responses → 8 outputs + traceability table + recommendation results), **Rules & Bands** (provisional band + input editor), **Incongruence** (rule editor), **Phase Mapping** (response-option → phase-code editor). Every surface flagged PROVISIONAL — not active for public.
- **Tests** `test/studio-scoring.test.ts` (`npm test`, 39 total pass).

## 3. RLS policies
Every new table has RLS enabled, no public policy — all access via the service role inside owner/editor-gated routes. No public scoring surface exists.

## 4. E2E checklist (owner runs after applying 0026, then approves the simulation)
1. Apply `0026`. Confirm Studio → Assessment → **Scoring** loads (owner).
2. **Rules & Bands:** author provisional cut-points for the Competency + Domain rules (e.g. Low 1–2.99, High 3–5); optionally add explicit inputs.
3. **Incongruence:** add a rule (e.g. Married + phase exploration ≥ 4 → descriptive flag).
4. **Publishing/Recommendation:** ensure one approved recommendation mapping (Studio → Assessment → Rec Mappings) points at a **published** asset (AI Studio → Publishing).
5. **Simulation:** pick a competency/domain scope + structural context → fill responses → Run. Verify the 8 outputs, the traceability table (raw/transformed/confidence/rule_version), and recommendation results (suppressed when unpublished / safety).
6. Confirm reverse scoring only applies to items flagged reverse; missing/under-answered → suppressed/insufficient.
7. **Approve the simulation results** (owner) before any public activation is even considered.

Automated (green now via `npm test`): raw/reverse Likert, missing/suppression, domain aggregation, phase-option mapping, structural-context interpretation, expiration vs adaptive, top-2 strengths, growth priority, incongruence execution, recommendation mapping + publication + safety suppression, rule-version preservation, reassessment compare, determinism (AI-cannot-alter).

## 5. Decision-log entry
> **DEC — Snapshot deterministic scoring (build-only).** Executable scoring layer for the Studio-authored Snapshot. Reused + extended `studio_scoring_rules`/`studio_interpretation_rules`/`studio_recommendation_mappings`; added the normalized runtime/result tables. Engine is pure/deterministic — AI excluded from scoring. Structural context is collected, never inferred. Expiration uses separate direction with structural + transition context. All thresholds provisional; no public activation until owner approves the simulation.

## 6. Rollback plan
Additive and reversible; the live 47-item Snapshot is unaffected.
```sql
drop table if exists public.studio_recommendation_results, public.studio_assessment_findings,
  public.studio_score_results, public.studio_assessment_attempts, public.studio_incongruence_rules,
  public.studio_phase_option_mappings, public.studio_scoring_rule_inputs cascade;
alter table public.studio_scoring_rules drop column if exists formula_type, drop column if exists formula_config;
alter table public.studio_interpretation_rules drop column if exists trigger_config, drop column if exists suppression_config;
notify pgrst, 'reload schema';
```

## NOT in this build
Activating scoring for public users / wiring a live quiz (deferred until the owner finalizes non-provisional cut scores and approves the simulation).
