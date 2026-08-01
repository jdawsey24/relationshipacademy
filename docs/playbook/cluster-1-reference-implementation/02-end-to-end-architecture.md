# 02 — End-to-End Product Architecture (Rev 3)

**Status:** AS BUILT (working tree; behind `PLAYBOOK_REV3_ENABLED`).
**Primary sources:** `components/playbook/ExperienceShell.tsx` (719 lines, the top-level orchestrator), `lib/playbook/processState.ts`, `lib/playbook/changePath.ts`, `docs/playbook-architecture-rev3.md`.

---

## 1. The eight layers

Rev 3 (flag ON) presents the full architecture, grouped for the reader into **three consumer buckets**. The internal layer names are *not* consumer-facing.

| Internal layer | Consumer label(s) | Bucket | What it is | Renderer |
|---|---|---|---|---|
| **Understand** | "Understand the Pattern" | Learn | Field Guide: cluster literature (Core Guides + Question Reads) | `FieldGuide.tsx` |
| **Experience** | "See It Play Out" | Learn | Simulation library → a deterministic authored graph (the "Experience"/signature) | `SimulationPlayer.tsx` + `SimulationSignatures.tsx` |
| **Play** | "Use a Tool" | Work on it | The rehearsable real-life tool (recognition gate → screens → executable output) | `PlaySequence.tsx` → `PlayContainer.tsx` |
| **Practice** | "Practice in Real Life" / "What I'm Practicing" | Work on it | Mission layer: take a Play into an authentic real-world context | `MissionCard.tsx` |
| **Integrate** | "Look at How It Went" / "Log a Real-Life Experience" | Work on it | Structured Use Review after a real attempt | `UseReviewFlow.tsx` |
| **Change Path** | *(never shown as a label)* "A useful next step" | (top card) | Internal orchestration → one plain next-step suggestion | `changePath.ts` + `ChangePathHome.tsx` |
| **My Plays** | "My Plays" | Keep & explore | Saved, portable Play outputs (five-field cards) | `ExperienceShell.tsx` (myplays view) |
| **Explore Another Area** | "Explore Another Area" | Keep & explore | Non-locking recognition-pathway picker | `ExperienceShell.tsx` (board view) |

**Consumer buckets** (`ChangePathHome.tsx`): **Learn · Work on it · Keep & explore**. The "A useful next step" card sits on top; below it the full architecture stays visibly available. **No layer is hidden merely because a state is empty** — presentation is state-dependent, not gated.

---

## 2. Consumer name registry (internal vs consumer)

| Internal term | Consumer term |
|---|---|
| simulation / Experience signature | "See It Play Out" scenario; header title from `SIGNATURE_TITLE` (e.g. "Holding both questions") |
| fidelity / `FidelityOutcome` | never surfaced as a score; expressed only as neutral mirror/recap copy |
| Mission | "Practice in Real Life" / "What I'm Practicing" |
| Use Review / Integrate | "Log a Real-Life Experience" / "Look at How It Went" |
| Change Path | "A useful next step" |
| Technique Fidelity / Transfer / process state | never surfaced to the reader as terms |

---

## 3. The process-state model (why "completed" ≠ "improved")

`lib/playbook/processState.ts` is a pure adjudication module that deliberately prevents the system from collapsing "did a Play" into "changed." Header (`:1-9`): "Product/process states — **NOT RLC constructs**."

```ts
type ProcessState = "exposure" | "attempt" | "technique_fidelity" | "transfer";   // :11
```
- **Exposure** — encountered/read/practiced in-app. *Never a change claim.*
- **Attempt** — tried to use the operation (in-sim and/or real world).
- **Technique Fidelity** — used the operation as intended, in-app (evidence-anchored, not "changed my mind").
- **Transfer** — **attempted to carry it into ≥1 authentic context beyond the rehearsal.**

`highestProcessState(signals)` (`:38-47`) is deliberately conservative:
- `transfer` requires `used_in_another_context` **or** `technique_fidelity_in_context` (or `progression_advanced && used_in_another_context`).
- **tool-review alone never reaches Transfer** (`tool_reviewed`/`tool_retained`/`tool_updated` are Change-Path inputs, not Transfer — `:16-18, 24-26`).
- `progression_advanced` counts toward Transfer **only when real-world enactment was also reported** (`:29-30, 42`).

`supportsDevelopmentalApplication(signals)` (`:51-53`) is true **only** with real-context Transfer evidence, never in-app Attempt/Fidelity alone.

> These invariants are enforced by `test/playbook-processstate.test.ts` (see `10-…`).

---

## 4. The end-to-end state flow

```
recognition            (RecognitionCard tapped → progress.recognized)
  → literature exposure (Understand / Field Guide read → literature_state.read)
  → simulation exposure (Experience walked → simulation_state.runs[simId].completed + fidelity)
  → Technique Fidelity  (in-app: fidelity computed at the sim's teach handoff)
  → Play attempt/output (Play run → StoredOutput + My Plays card; play_state → in_my_plays)
  → Mission selection   (Practice: currentMissionId, practice_state.missions[id].state = "selected")
  → authentic-context attempt (real world: report "attempted" → state "attempted", attemptCount++)
  → Use Review          (Integrate: structured signals → use_review_state.reviews[playId][])
  → possible Transfer evidence (attemptCount >= 2 / used_in_another_context → transferEvidence)
```

Orchestrated by `ExperienceShell.tsx` (view state machine) and `changePath.ts` (which of these to surface next). Each step writes a **separate, bounded** progress field (see `07-…`).

---

## 5. Explicit invariants (as built, test-enforced)

These are guarantees the implementation makes; each is verified by the test suite (`10-…`) and must hold for any future cluster:

1. **Completion is not mastery.** `processState.ts` never lets exposure/attempt imply improvement (`playbook-processstate.test.ts`).
2. **Review is not Transfer.** Tool-review signals are Change-Path inputs, never Transfer (`processState.ts:16-18`; `playbook-processstate.test.ts` "tool-review alone never reaches Transfer").
3. **Saving or editing a Play is not Transfer.** `recordOutput` sets `in_my_plays`/keeps `used`; it is not a real-world enactment.
4. **Transfer requires reported use in an authentic context beyond the original in-app rehearsal** (`processState.ts:9,27,49-53`; `changePath.ts` `transferEvidence = attemptCount >= 2`).
5. **Emotional discomfort is not failure.** A reader can stay sad/disappointed and still complete an operation (`playbook-guardrails.test.ts`; `emotionBeat` screens; DECISION-LOG #21 emotion handling).
6. **Relationship outcome never determines Technique Fidelity.** Fidelity is computed from the reader's *operational choices*, never from the (authored, independent) partner behavior or from "did they like it" (`playbook-guardrails.test.ts` "success is never defined by a relationship outcome"; `communicationRehearsal` "success never 'did they like it'", DECISION-LOG #26).
7. **The partner's behavior is authored, never a function of the reader's choice** (engine structure; `05-…` §1).
8. **Non-attempt is no-fault.** `no_opportunity` / `opportunity_not_taken` / `unsuitable` are factual, never a failure or inability claim (`changePath.ts` `nonAttemptRouting`; `playbook-missioncard.interaction.test.ts`).

---

## 6. Change Path is internal orchestration (not a treatment plan)

`changePath.ts` computes **one** next-step suggestion from separate, composable signals. It is:
- **internal orchestration** — surfaced only as the single "A useful next step" card;
- **deterministic** — frozen focus-priority tiers, content-order tie-breaking (`focusTier`, `05`/`06`);
- **non-diagnostic** — no diagnosis, no score, no trait/etiology inference;
- **not a clinical treatment plan** and **not a new RLC construct** (`processState.ts:3`, `changePath.ts` header; `playbook-changepath.test.ts` "never a clinical plan").
- **non-authoritative** — "Explore Another Area" is always available; recommendations never lock the reader (`playbook-changepath.test.ts`).

Detail in `06-…`.

---

## 7. Feature-flag isolation

`PLAYBOOK_REV3_ENABLED` (`rev3.ts:11`) gates the entire Rev 3 experience. With the flag **OFF**, the shell renders the v0 product (Plays only, the original opening, the v0 "I used this in real life" Keep/Update dialog) — **unchanged**. `ExperienceShell` takes a testable `rev3` prop so both modes are covered. Verified by `playbook-experience-rev3.interaction.test.ts` ("flag OFF, returning: v0 opening unchanged"; "flag OFF: no Practice affordance"; etc.). No Rev 3 behavior leaks into v0.
