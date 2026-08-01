# 11 — Reuse vs Cluster-Specific Matrix

**Purpose:** tell a future cluster exactly what to reuse verbatim, what to reuse only when the mechanism authentically fits, and what must be independently derived (never copied).

**The governing principle:** Cluster 1 is a **reference implementation, not a universal intervention template**. Product infrastructure is reusable; behavioral/intervention logic must be independently derived for each cluster from the RLC framework.

---

## 1. Shared and reusable (reuse verbatim)

These are cluster-agnostic mechanisms. A new cluster plugs content into them without modification.

| Item | File(s) | Why reusable |
|---|---|---|
| Feature-flag shell | `rev3.ts` (`PLAYBOOK_REV3_ENABLED`); `ExperienceShell` `rev3` prop | Cluster-agnostic gate; v0 isolation is generic. |
| Field Guide renderer | `FieldGuide.tsx` | Renders any `LiteratureEntry[]`; JIT "Previously surfaced" logic is content-agnostic. |
| `SimulationPlayer` (graph walker) | `SimulationPlayer.tsx` | Walks any valid `Simulation`; focus/live-region/JIT/resume are generic. |
| Node primitives + walker | `contentSchema.ts` `SimNode`; `simulation.ts` `successors`/`validateSimulation` | The 7 node kinds + validator are the reusable graph substrate. |
| Extended `reveal` node + resolver registry | `contentSchema.ts:344-383`; `simulation.ts:171-216` (`REVEAL_RESOLVERS`, `resolveRevealContent`) | `body`/`computedSummary`/`recap`/`reactions` are generic; the registry accepts new resolver keys. |
| Content registry | `content/playbook/index.ts`; `keys.ts` | `Record<key, PlaybookContent>` + key↔cluster map; add a row for a new cluster. |
| Progress model + reducers | `contentSchema.ts` `PlaybookProgress`; `progressActions.ts` | The whole progress shape + all reducers are cluster-agnostic. |
| Persistence + sanitization | `progress.ts`, `sanitize.ts` | Load/save + the enum/cap sanitizers are generic (extend allow-lists only for genuinely new fields — an owner-gated schema change). |
| Event registry + writer | `events.ts`, `clientEvents.ts` | Validators + minimal-payload writer; add per-signature fields only when a new signature is approved. |
| Mission UI + helpers | `MissionCard.tsx`, `mission.ts` | Renders any `Mission`; report semantics generic. |
| Use Review UI + reducers | `UseReviewFlow.tsx`, `progressActions.recordUseReview/reviewEntries` | Bounded-select + optional-note flow is generic. |
| Change Path orchestration | `changePath.ts`, `processState.ts` | Frozen priority + process-state adjudication are cluster-agnostic (minus the one RD special-case to remove/parameterize). |
| My Plays shell | `ExperienceShell.tsx` (myplays/history views) + `SavedPlayCard` | Renders any Play's saved output. |
| Play container + output editor | `PlayContainer.tsx`, `PlaySequence.tsx`, `OutputEditor.tsx`, `SortEngine.tsx` | Slotted screen registry renders any `Screen`; modal editor is generic. |
| Accessibility patterns | keyboard/aria/focus in the above + `playbook-a11y.test.ts` | Reuse the patterns; re-run a11y tests per cluster. |
| Content validation | `contentValidate.ts` (Plays + recognition) | Reuse; note the coverage gap (no sim/mission/review/lit validation) — `03-…` §8. |
| Safety Layer A | `crisisSafety.ts` + frozen Safety V2 engine | Content-agnostic, identical in any cluster. |

---

## 2. Reusable only when the mechanism authentically fits

These are **options, not mandatory categories.** A new cluster may reuse them **iff** its independently-derived intervention operation genuinely matches the mechanism. **Do not force a new operation into an existing signature for convenience.**

| Item | Where | Reuse condition |
|---|---|---|
| The six interaction **signatures** | `InteractionKind`; `simulation.ts` aggregators | Reuse a signature only if the new operation's fidelity truly maps to that signature's fields (e.g. reuse `communicationRehearsal` only for a genuine "state a preference clearly across moments" operation). Otherwise derive a new signature (owner-gated schema change). |
| Reveal **resolvers** | `REVEAL_RESOLVERS` (`dualAttentionFocus`, `decisionRoomStance`, `communicationRehearsalRecap`) | Reuse a resolver only if the reveal semantics match; else author a new resolver key (a code change, but not a schema change). |
| **Fidelity aggregation patterns** | `selectedSignals` / `selectedSignalCounts` | Reuse the *pattern* (authored `signal` tags → aggregation). The *signal names and rules* are cluster/operation-specific and must be re-derived. |
| Play **screen sequences** | the 12 `Screen` kinds | Reuse the kinds; the specific sequence per Play is content, chosen to fit the operation. |
| **Output builders** | `ruleBuilder`, `sentenceBuilder`, `ownTurn`, `scenarioSort` | Reuse the mechanism where the operation's output shape fits; the content is cluster-specific. |

---

## 3. Cluster-1-specific — DO NOT copy by default (derive independently)

Everything here is Cluster 1's *behavioral/intervention content*. A future cluster must derive its own from the RLC framework, not clone these.

| Item | Where (Cluster 1) | Why cluster-specific |
|---|---|---|
| **Problem Expressions** (the recognized pattern) | Snapshot cluster 1 "Difficulty Feeling Chosen" | Each cluster expresses a different developmental problem. |
| **Change Targets** | encoded in each Play's operation/positioning | The specific behavioral change targets are cluster-derived. |
| **Intervention mechanisms** | each Play's operation + `fidelity.correct` | The mechanism of change is per-problem; never generic. |
| **Consumer statements** | `recognitionCards` (`rec-*`) + `statementMap` | Routing/personalization assets specific to this cluster's language. |
| **Simulation scenarios** | the six sims (`sim-*`) | Authored dating scenarios specific to this cluster. |
| **Fidelity field names** | `FidelityOutcome` per-signature fields | Named to describe *this* cluster's operations' observable states; a new operation gets new names (one canonical name each — DECISION-LOG #30). |
| **Literature** | all `lit-*` (core, question, play, JIT) | Cluster education content. |
| **Plays** | the six `Play` objects | Cluster-specific tools. |
| **Missions** | `mission-rd-*`, `mission-wm-*` | Cluster-specific real-world practice. |
| **Use Reviews** | the six `review-*` | Cluster-specific structured reflection. |
| **Change Path routing content** | `reviewedRouting`/`nonAttemptRouting` copy + the RD special-case (`changePath.ts:132`) | The CTA copy and the RD `reviewStuck` hardcode are cluster-specific; parameterize or re-derive. |

---

## 4. The three rules that keep reuse honest

1. **Existing signatures are options, not mandatory categories.** If none authentically fit the new operation, derive a new signature — and that requires owner approval (a shared-schema change).
2. **Code convenience must never redefine the framework.** If the mechanism doesn't fit, the answer is new content/derivation, not bending the operation to reuse a mechanism.
3. **New shared primitives require a demonstrated unmet need + owner approval.** (This is exactly how the extended `reveal` node came to be — DECISION-LOG #28, the reserved "genuine unmet need" from #17.)
