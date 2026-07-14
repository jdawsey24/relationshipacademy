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

## Phase 2 — deferred (touches the live path; separate branch + approval)

Wire the narrative into the report a real respondent receives, additively + resiliently:
- Resilient **public** `GET /api/results/narrative?session_id=` — valid completed session + `result_narrative` feature flag + kill-switch + per-IP/session rate limit + cost ceiling; returns a **cached** narrative or generates **once**.
- New `result_narratives` cache table (migration): keyed by `session_id` + `inputs_hash`; stores narrative + model + prompt version + safety status; RLS-locked.
- `app/snapshot/results/page.tsx` fetches it **separately** from `/api/results` (which stays byte-for-byte unchanged): deterministic report renders immediately; narrative appears when ready or **never, gracefully** (fallback = authored report). Add the consumer **disclosure** line.
- The live switch = enabling `result_narrative` in AI Settings (off by default).
