# AI Result Narrative

AI expansion of a respondent's **deterministic** result into a warm, personalized narrative. The scores are never touched — AI writes prose only, strictly grounded in the computed results + the owner's authored consumer copy.

## Phase 1 — built (owner-only, off the live path)

- **`lib/ai/resultNarrative.ts`** `generateResultNarrative({ firstName, structuralContext, phaseAlignment, alignmentStatus, strengths, growthArea, authoredSections })` → `{ sections, model, safety_status, safety_notes }`.
  - **Input = deterministic results + first name only** — never email, never raw responses.
  - Reuses `getProvider()` (`lib/ai/provider.ts`) with a JSON-schema structured output (`additionalProperties:false` required by the Anthropic API).
  - **Governed voice:** `getActiveTemplate("result_narrative")` `system_instruction` if an approved template exists (owner-versionable in Prompt Templates), else `DEFAULT_SYSTEM`.
  - **Hard guardrails (system prompt):** use only supplied results; never invent scores/diagnoses/claims; educational not therapy; encouraging, non-alarming; 2nd person; ~grade-6; mirror + expand the authored voice.
  - **Deterministic safety check:** banned-term list (diagnostic/clinical/harm) + reading-grade cap + min length → `safety_status = ok|flagged`.
  - **Kill-switch** honored; not-configured → clear error.
- **API `app/api/admin/studio/ai/result-narrative`** — `requireAiOwner` (owner + MFA), audited. No public route.
- **Sandbox → Participant view → "✨ Expand with AI"** renders the AI narrative *below* the authored report, labeled a provisional preview with model + safety status. Owner-only.
- **Feature flag:** `result_narrative` is in `GENERATION_TYPES` but **not** in `ai_settings.enabled_generation_types` by default → live generation is OFF; the Sandbox preview is owner-only.
- **Live path untouched:** no changes to `app/api/results`, `app/api/score`, `lib/scoring.ts`, `app/snapshot`. Verified: grounded 5-section narrative, `safety=ok`, no invented scores.

## Phase 2 — built (build-only; ships OFF; touches the live results page additively)

The narrative now reaches the **live results page**, additive + resilient. **The scoring path is untouched** (`app/api/results`, `app/api/score`, `lib/scoring.ts`).

- **Migration `0029_result_narratives.sql`** (owner-run): `result_narratives` cache — one narrative per `session_id`; RLS-locked, service-role only.
- **`lib/resultNarrativeLive.ts`** — `buildNarrativeGrounding(session_id)` **independently** re-queries the session's stored results (`quiz_sessions`, `structural_phase_selection`→`structural_phases`, `domain_scores`→`domains`, `alignment_results`) → `{ firstName, structuralContext, strengths(top-2 domains), growthArea(lowest), phaseAlignment, alignmentStatus }` (never email/raw responses). `getOrCreateLiveNarrative` is **cache-first**; a missing cache table (pre-`0029`) or a **safety-flagged/errored** result returns null and generates/caches nothing.
- **`GET /api/results/narrative?session_id=`** — resilient, never 500s: `isUuid` + rate limit (`result-narrative`, 10/60s) + **feature flag** (`result_narrative` enabled) + kill-switch + soft daily cost ceiling. Returns `{ narrative: sections | null }`. Generate-once cache bounds cost.
- **`app/snapshot/results/page.tsx`** — a **separate** fetch renders a "Your Personalized Summary" section after the Structural Phase banner **only when present**, with a consumer disclosure line. Deterministic report unchanged.
- **Go-live is the owner's:** ships OFF (`result_narrative` not in `enabled_generation_types`). **Run `0029` first, then enable `result_narrative` in AI Settings.** Instant off = disable it or the kill switch. Voice = author a `result_narrative` Prompt Template.
- Verified: scoring path untouched (git diff); default OFF → `{ enabled:false }`; live grounding from a real session → grounded 5-section narrative, `safety=ok`; resilient pre-migration (null, no generation); 47 tests pass.
