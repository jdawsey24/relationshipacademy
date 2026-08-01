# 06 — Play, Practice, Use Review & Change Path

**Status:** AS BUILT (working tree).
**Primary sources:** `components/playbook/{PlayContainer,PlaySequence,OutputEditor,MissionCard,UseReviewFlow}.tsx`, `lib/playbook/{progressActions,mission,rev3Flow,changePath}.ts`.

This document covers everything *after* the Experience: how the Play runs, how a real-world Mission works, how the Use Review captures functional signals, and how Change Path orchestrates the single next step.

---

## 1. The five distinct concepts (never conflate)

| Concept | What it is | Where |
|---|---|---|
| **Experience rehearsal** | Walking the deterministic simulation graph (in-app). | `SimulationPlayer` (see `05-…`) |
| **Play operation** | Running the real-life tool (gate → screens → executable output). | `PlayContainer` / `PlaySequence` |
| **Saved Play output** | The version-stamped payload the Play produced. | `progress.outputs[playId]` (`StoredOutput`) |
| **My Plays** | The portable five-field card derived from a saved output. | `progress.my_plays[]` (`SavedPlayCard`) |
| **Mission** | Committing to take the Play into a real, authentic context. | `practice_state.missions[id]` |
| **Use Review** | The structured functional signals reported *after* a real attempt. | `use_review_state.reviews[playId][]` |

---

## 2. Play architecture

### The common Play contract (schema in `03-…`)
`recognitionGate.prompt` → `screens: Screen[]` (must include an `output` screen) → `portable[]` → `myPlaysTemplate` (five fields) → `fidelity` (correct/misuse/notMeaning) → optional `supportSignposts`, `routing`, `outputEditor`.

### Rendering — `PlayContainer.tsx`
A universal slotted walker. `SCREEN_REGISTRY` (`:109-228`) maps every screen `kind` to a renderer (shift, learn, emotionBeat, literature, scenarioSort, ownTurn, sufficiency, ruleBuilder, sentenceBuilder, output, portable, realWorldUse). Unknown kinds are skipped defensively (`renderScreen`, `:231-234`). Free-text screens (`ownTurn` `:358-388`) screen input via `onScreenText` on blur (Layer A crisis screening). The `output` screen saves the draft via `ctx.onSaveOutput` (`:195`).

### Play-follows-simulation — `PlaySequence.tsx`
Under Rev 3, a Play is preceded by its simulation: `PlaySequence` runs the sim first, then renders the Play (the in-Play `literature` screen is dropped by `rev3Play`). Verified by `playbook-playsequence.interaction.test.ts` ("the Play FOLLOWS its simulation"; "resume: sim already completed → straight to the Play").

### The six Plays' output/editor behavior (as built)

| Play | Core output screen(s) | `outputEditor` | Editable fields |
|---|---|---|---|
| `read-and-decide` | ruleBuilder → output ("Your Read & Decide") | ✅ | `evidence` (text), `rule` (rule: `RD_ACTIONS`+`RD_CONTROL_CHECK`) |
| `what-it-actually-means` | sentenceBuilder → output ("Your Bounded Conclusion") | ✅ | `narrowest_true_thing` (text) |
| `is-this-right-for-you` | sentenceBuilder → output ("Your Two Questions") | ❌ **none** | — (DECISION-LOG #30/#31) |
| `rest-or-giving-up` | ownTurn(stance) → output ("Your Stance, For Now") | ✅ | `stance` (text), `reentry` (text, optional) |
| `how-much-to-put-in` | ruleBuilder (core) → output ("Your Evidence & Move") | ✅ | `evidence` (text), `rule` (rule: `HMP_ACTIONS`+`HMP_CONTROL_CHECK`) |
| `say-the-real-thing` | sentenceBuilder → output ("Your Real Thing") | ✅ | `sentence` (text) |

### `OutputEditor.tsx` (as built — **modal**, DECISION-LOG #53)
A narrow corrective editor that reopens **only** a Play's saved output, prefilled (`:18-50`); `complete` gating requires all fields (a rule needs a condition + action); saves `onSave({ ...initial, ...draft })`. In `ExperienceShell` it renders **modally** — while `isEditing`, all other views are hidden (no navigation to strand it). Reached from the review "Update it" path and from My Plays "Edit this Play" (for the 5 Plays with an editor). `recordOutput(..., keepState=true)` preserves a `used` state.

### Reducers — `progressActions.ts`
- `recordOutput(p, play, payload, keepState=false)` (`:137-160`): version-stamps output, upserts the My Plays card (`cardFor` `:117-130` via `deriveUserLine`); `keepState` preserves a terminal state (`used`), else sets `in_my_plays`.
- `markExplored` (`:13-17`): sets `explored`; **never downgrades** `in_my_plays`/`used`. `markUsed` (`:19-21`): sets `used`.

---

## 3. Practice (Mission) layer

### Structure (schema `Mission` in `03-…`)
`{ id, playId, title, instruction, linkToOperation, attemptMeaning?, suitability?, progression?: MissionRung[] }`. Cluster 1 has **two** missions (RD, WM); each has one progression rung.

### What counts as an attempt (`MissionReport`)
`"attempted" | "no_opportunity" | "opportunity_not_taken" | "unsuitable"`:
- **`attempted`** — "I tried this in real life" → state → `attempted`, `attemptCount++` (`recordMissionReport:64`). This is the only report that advances state or increments the count.
- **`no_opportunity`** — no real occasion arose (factual, no-fault).
- **`opportunity_not_taken`** — an occasion came but wasn't taken (factual, no-fault).
- **`unsuitable`** — offered only when `mission.suitability` is set; the situation didn't fit (factual, no-fault).

Non-attempt reports **do not** advance state and **do not** increment `attemptCount` (`recordMissionReport:61,64`). `MissionCard.tsx` renders these as "not a miss," never a failure (`:63-67`).

### Active-mission behavior
- `recordMissionSelected` (`:38-45`): sets `selected` (no downgrade from attempted/reviewed), sets `currentMissionId` — **one** active real-world focus at a time.
- A **selected** (not-yet-attempted, not-reviewed) mission is the "active mission" that Change Path surfaces as "What I'm Practicing".
- `nextRung(mission, rungId?)` (`mission.ts:16-22`) is **content ordering only** — "what is the next stretch," explicitly **not** a readiness/recommendation. `currentInstruction` (`:8-11`) resolves the rung's instruction.
- **Transfer signal:** reporting `attempted` a second time (from the `reviewed` state, "I used this again in another situation") is the authentic-context-beyond-rehearsal signal; `attemptCount >= 2` → `transferEvidence` (`changePath.ts:79`).

**No gamification** anywhere (verified `playbook-mission.test.ts`, `playbook-missioncard.interaction.test.ts`). **No partner surveillance/monitoring** in mission content.

---

## 4. Integrate (Use Review) layer — `UseReviewFlow.tsx`

The structured return after a real attempt. **Bounded selects plus one optional free-text note** (DECISION-LOG #50):
- **`experience` (optional free text)** — "What was the experience? (optional)"; `<textarea maxLength=2000>`; **crisis-screened** on blur via `onScreenText` (Layer A) only when non-empty (`:99-110, 104`). This is the single free-text exception to "no journaling," owner-requested.
- **`didDifferently`** (multi) → what the reader did differently.
- **`performedOperation`** (single) → **Technique Fidelity** signal, mapped `PERFORMED_MAP`: "Pretty closely"→`yes`, "Some of it"→`partly`, "Not really this time"→`no` (`:21-25`).
- **`becameClearer`** (multi) → what got clearer.
- **`stuckWhere`** (single) → the one prioritized friction point.

**Tool decision** (`:117-135`): if a saved output exists → **Keep it** (`kept:true`) / **Update it** (`updated:true`, opens editor); else → **Save this Play** (`saved:true`) / **Not right now** (`none`). None of these independently constitutes Transfer.

### Persistence & multi-log (DECISION-LOG #47, #51)
`recordUseReview(p, playId, signals, at?, experience?)` (`progressActions.ts:108-115`) **appends** a `UseReviewEntry` to a chronological list per Play (never overwrites); `experience` trimmed + capped 2000 chars; list capped at `MAX_REVIEW_ENTRIES = 50`. `reviewEntries` (`:97-102`) tolerates absent / legacy-single-object / list shapes. The board / Home / My Plays surfaces show a running count, the latest note, and a **read-only "View all" history** (newest-first). **Only the bounded selects feed Change Path (via the latest entry); the free text never does.**

### Event emit
On submit, a minimal `use_reviewed` event is built (`buildPlaybookEvent`) with only `{performed, stuck, kept, updated, saved}` — **the free text is never in the event payload** (`ExperienceShell` review `onComplete`; see `07-…`).

---

## 5. Change Path orchestration — `changePath.ts`

Deterministic, non-diagnostic, composable. Computes **one** next-step from separate signals.

### Signals — `operationSignals()` (`:64-94`), all fail-soft
`recognized`, `simulationExposed` (sim run `.completed`), `savedOutput`, `inAppOperationAttempted` (`explored|in_my_plays|used|savedOutput`), `missionSelected`, `missionAttempted`, `missionReviewed`, `techniqueFidelity` (latest review `.performed`), **`transferEvidence` (`attemptCount >= 2`)**, `reviewStuck`, `lastMissionReport`.

### Frozen focus-priority tiers — `focusTier()` (`:97-105`)
`engaged = recognized || simulationExposed || inAppOperationAttempted || savedOutput || missionSelected || missionReviewed`.

| Tier | Condition | FocusReason |
|---|---|---|
| **5** | `declared === playId && engaged` (explicit user focus) | `declared` |
| **4** | `missionSelected && !attempted && !reviewed` | `active_mission` |
| **3** | `missionAttempted && !reviewed` | `pending_review` |
| **2** | `inAppOperationAttempted || savedOutput || simulationExposed || missionReviewed` | `recent_exploration` |
| **1** | `recognized` | `recognition` |
| **0** | else | *(null)* |

`changePath()` (`:193-226`): highest tier with `t>0` wins; **ties keep content order**. `declared` = `change_path_state.currentFocus`. If nothing engaged, the next-step is only an invitation (when `recognized.length`), and surfaced items are `[explore, understand]`. Otherwise `routeForOp` picks the CTA; surfaced = `[primary, understand, explore]`.

### Routing precedence — `routeForOp()` (`:168-181`)
1. selected-but-not-attempted mission with a non-attempt `lastReport` → `nonAttemptRouting` (`:110-121`, switches on the report; `unsuitable` → explore another area; never a generic-failure branch).
2. `missionReviewed` → `reviewedRouting` (`:125-165`, routes from **Use-Review contents**).
3. `missionAttempted` → review CTA "Look at how it went".
4. `missionSelected` → "Open my practice".
5. `savedOutput || inAppOperationAttempted` → practice-in-real-life.
6. `simulationExposed` → experience "Continue".
7. `recognized` → experience "Start".

### `reviewedRouting` — the key clinical guardrails (`:125-165`)
- Routes from the **contents** of the latest Use Review, not from a score.
- **Remaining discomfort never routes backward when fidelity was shown** (`:136-139`): a `stuck` value like "The feeling got loud"/"…made it feel true" does **not** send a fidelity-demonstrated reader back to re-learn.
- `fidelityShown && transferEvidence` → a stretch / other-pattern CTA (`:152-156`).
- `read-and-decide` special-case: `reviewStuck === "Acting on what I already saw"` (`:132`) — the one cluster-1-specific coupling.

### Literature surfacing — `surfacedLiterature()` (`:185-191`)
Reads **only** `literature_state.read`; surfaces play-scope entries for the focus first, then cluster-scope; returns the first unread. **Never advances process state** (literature engagement changes *surfacing* only, never the next-step claim — `playbook-changepath.test.ts`).

### Home rendering — `ChangePathHome.tsx`
The "A useful next step" card renders only when `cp.nextStep`; its primary CTA calls `onSurfaced(primary)`. Below it, the three buckets (Learn / Work on it / Keep & explore) keep the full architecture visible. The "Log a Real-Life Experience" row appears for any loggable Play (explored+ with a Use Review), suppressed if that Play is already prompting via a pending review; a "View all →" link appears once ≥1 experience is logged (`:69-76, 138-153`).
