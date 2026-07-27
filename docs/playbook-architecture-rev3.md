# Phase 7 — Relationship Playbook™ Product Architecture (Rev 3)

**Status:** FOR FINAL ARCHITECTURE REVIEW — decisions frozen by owner; not yet implemented.
**Prototype cluster:** Cluster 1 "Difficulty Feeling Chosen" (consumer: *Moving Beyond Rejection*).
**Posture:** the deployed v0 two-Play Playbook stays intact. Rev 3 is built behind isolation (feature flag), reviewed, and **not deployed and running no new production migration without explicit owner approval.** Attorney review remains **outstanding**; nothing here is attorney-reviewed or attorney-approved; the existing **Owner Risk Acceptance** remains the posture.

> Nothing here changes Relationship Life Cycle™ theory. `Understand → Experience → Play → Practice → Integrate`, **Change Path**, and the `Exposure / Application / Fidelity / Integration` process states are **product-delivery concepts only.** The canonical framework is unchanged: **Phase → Developmental Task → Competencies → Developmental Application → Task Mastery.** The Playbook strengthens **Developmental Application** for the specific problem a cluster represents.

This document incorporates the owner's frozen decisions (ledger in §16) and expands two sections in depth per request: the **Change Path decision model** (§4) and the **simulation/content object model** (§6).

---

## 0. Core architectural move

The deployed model is **Play-centric and linear**: literature, the sort exercise, the own-turn, the rule builder, and real-world-use are all `Screen`s inside one `Play.screens[]`, walked in order by `PlayContainer`. Rev 3 **decomposes the monolithic Play into five composable product-delivery objects, bound by an internal orchestrator (Change Path)** — while keeping the intervention core (which works) reusable.

| Object | Type | Replaces / extends in v0 |
|---|---|---|
| **Understand** | `LiteratureEntry` (scope: cluster / play / jit) | the single `literature` screen kind |
| **Experience** | `Simulation` (deterministic scenario tree) | the static `scenarioSort` screen |
| **Play** | `Play` (intervention core, largely as-is) | reused; literature extracted; now *follows* a Simulation |
| **Practice** | `Mission` (+ authored progression) | the `realWorldUse` screen + the "I used this" flag |
| **Integrate** | `IntegrationReview` | the "How did it go / Keep / Update" dialog |
| *(orchestration, internal)* | **Change Path** | the board's "surface, never lock" logic |

The five objects are **composable, not a mandatory five-step funnel.** A user is never forced through all five every time; Change Path surfaces the *next useful* node, literature is always optional, and "Explore Another Area" is always available.

---

## 1. Process-state model — Exposure / Application / Fidelity / Integration

**This is the backbone of the whole architecture.** These are **product/process states, not RLC constructs.** They exist so the system never collapses *"completed a Play"* into *"improved,"* and so future product analytics and eventual RLC validation research can distinguish engagement from change.

| State | Definition | What legitimately signals it (first-party functional data) | What it is NOT |
|---|---|---|---|
| **Exposure** | The user encountered / read / practiced-in-app a thing. | literature opened; simulation viewed; Play explored; screen reached. | Not improvement. Not competency. Reading ≠ change. |
| **Application** | The user *attempted to use the operation* — in a simulation and/or the real world. | performed the Play operation; selected a mission; **reports** attempting/using the mission. | Not success. An attempt is not a correct use. |
| **Fidelity** | The user used the operation **as intended** (mechanism-true, per the Play's authored fidelity model). | in-simulation: updated interpretation when new evidence appeared; structured fidelity-review responses ("performed as intended? yes/partly/no"); Keep vs Update after real-world use. | Not relationship outcome. High fidelity with an uncomfortable outcome is still fidelity. |
| **Integration** | The user can **carry the operation forward or appropriately adjust it** across contexts. | applied across ≥1 new context/mission; Keep (still fits) or a *considered* Update; advances a mission progression when appropriate. | Not "done." Not mastery. Not a level. |

**Rules the system enforces:**
- **Exposure never advances a change claim.** Content engagement can *influence what is recommended next* but can never be treated as evidence a competency or application improved (owner decision 4).
- Each Change Path recommendation is tagged internally with the **highest process-state legitimately supported by the data** — and phrased about *that demonstrated/reported context*, never about the person (§4.2).
- These states map cleanly onto `playbook_events` (§10) so longitudinal, non-surveilling process signals accumulate for later validation.

---

## 2. Revised consumer experience — entry through integration

Composable, not a forced funnel. Walked end-to-end for **Read It, Then Decide**:

1. **Understand** *(optional, anytime).* Cluster literature ("what Difficulty Feeling Chosen actually is"; "wanting to be chosen vs. using selection as evidence of worth"; "seeing relational evidence vs. acting on what you know"). Play literature ("why dating uncertainty is hard, and what it can and can't tell you") is surfaced near the Play but never gates it. → **Exposure.**
2. **Experience.** The RD simulation *unfolds over time* (§6): strong first date → "they want to see you again" → texts shorten → **capture interpretation & temptation** → **reveal** new evidence (a concrete plan for next week) → **update** interpretation → **teach** the evidence-to-decision operation. Updating the interpretation when evidence arrives is a **Fidelity** signal. → **Application / Fidelity (in-app).**
3. **Play.** The RD intervention (saw-it / guessing / don't-know-yet + a decision rule), framed as *"here's the operation you just felt,"* flowing from the simulation, not a standalone worksheet. → **Application**, saved output = executable artifact.
4. **Practice.** A behaviorally specific real-world mission bound to the operation ("On your next date, name what you're learning about the other person before evaluating your own performance"). → **Application (real world)** when the user reports attempting.
5. **Integrate.** Structured return: did you separate what you saw from what you guessed? What became clearer? Where did you still get stuck? Does your saved Play still fit (Keep / Update)? → **Fidelity / Integration**, feeding Change Path.

**What It Actually Means** runs the same spine with a *different signature interaction* (§6.4): the simulation shows a bounded event *expanding* into unsupported conclusions (everyone / the future / identity / worth), and the intervention narrows it back to what the event establishes.

---

## 3. Information architecture — the Cluster 1 Playbook home

**Change Path is internal architecture, not a consumer-facing clinical plan.** The consumer home is organized around plain, non-clinical sections (labels are copy candidates, not frozen):

- **Understand This Pattern** — deeper reading + relevant questions (the field guide).
- **Where You Might Start** — recognition-based recommendations.
- **Practice This** — the relevant simulation + Play for the current focus.
- **What I'm Practicing** — the current real-world mission and its state.
- **Your Next Step** — the next useful application focus, generated *within the approved Change Path rules* (§4). One plain-language line. **No scores, %, levels, or "plan" framing.**
- **My Plays** — portable saved tools (preserved exactly as v0).
- **Explore Another Area** — always available; never hard-locked.

**Returning-user state is preserved:** a returning user lands on their current focus + what they're practicing + My Plays — **not** the onboarding/opening every time. (v0 always starts at `view="opening"`; Rev 3 resumes from persisted current-state.)

---

## 4. Change Path — decision model *(expanded — Section A)*

**What it is:** a pure, deterministic, **internal** orchestration function. Input = the user's functional interaction state. Output = a prioritized surface of next-useful experiences + one plain-language "Your Next Step" line. Recomputable from state; stores no psychological profile. **It is an orchestration system, not a hidden assessment.**

### 4.1 Inferential boundary (frozen — owner decision 4)

**May use — user-declared inputs:** recognition selections; explicit area/focus selections; user "this is what I want to work on" choices.

**May use — first-party functional interaction data:** simulation choices; whether an interpretation was updated when additional evidence was presented; Play operations performed; saved executable outputs; fidelity-review responses; real-world mission selected; whether the user reports attempting/using the mission; structured integration responses; Keep vs Update after real-world use; current and prior application focus; recency of relevant practice.

**May influence recommendations only (never a change claim):** content engagement — literature opened, saved, or revisited. **Reading something must never be treated as evidence a competency or application improved.**

**Must NOT infer from:** relationship outcomes; whether another person pursued/committed/rejected/replied; mood; emotional intensity; presumed attachment style; personality or stable traits; partner motives; diagnosis; etiology; unrestricted free-text interpretation; number of completions alone; time spent in app; reading completion alone.

### 4.2 Observation-not-trait rule (frozen)

Every conclusion describes **what the user demonstrated or reported in a specific context**, not what kind of person they are, and never overstates capability from a single interaction.

**Allowed** (context-bound, process-framed):
- "In your recent practice, you separated what you observed from what you were assuming. Your next step can focus on deciding what to do with that information."
- "You've practiced expressing a preference. A useful next stretch may be expressing a small need."
- Framing: "Based on what you practiced here…" / "A useful next area may be…"

**Not allowed** (trait/finding/etiology):
- "You are good at reading people." · "You have trouble trusting yourself." · "You're an overthinker." · "You fear abandonment." · "You tend to choose emotionally unavailable people."

### 4.3 Absence is not evidence
Not-yet-done ≠ can't-do. Absence surfaces an **invitation**, never a verdict. No user must complete every Play.

### 4.4 Success definition (unchanged)
Success = **reduced Functional Interference + stronger Developmental Application** — never whether the relationship produced the desired outcome. Discomfort may persist alongside correct use, and Change Path treats that as a success signal.

### 4.5 Three Cluster-1 walkthroughs

Each shows the path, the **exact data read at the recommendation point**, the **process state** reached, and the **observation-not-trait** output.

---

#### Pattern A — *Evidence-capable in-app, action-stuck in the real world* (RD track)

| Step | User action | Signals written |
|---|---|---|
| Recognition | taps "I can't always tell what someone's really doing…" | `recognized += rec-evidence` (declared input) |
| Understand | opens "seeing evidence vs. acting on what you know" | event `literature_opened {object_id: lit-see-vs-act}` → **Exposure only** |
| Experience | RD simulation; at the reveal, **updates** her interpretation from "losing interest" → "signal is ambiguous; the plan is real" | event `simulation_completed {updated_interpretation: true}` → **Fidelity (in-app)** |
| Play | performs RD operation; saves rule "If I see the plan actually happen → keep things the same for now" | `outputs[read-and-decide]` saved; `play_states.read-and-decide = in_my_plays` → **Application** |
| Practice | selects mission "name what you're learning about them before evaluating yourself"; later reports attempting | events `mission_selected`, `mission_attempt_reported` → **Application (real world)** |
| Integrate | structured review: performed-as-intended = **partly**; hardest part = **acting on it**; Keep/Update = **Keep** | event `integration_reviewed {performed: partly, hardest: acting}` → **Fidelity signal, Integration incomplete** |

**Recommendation point — data actually used:** `updated_interpretation=true` (in-app fidelity) **+** `hardest=acting` (reported) **+** `mission_attempt_reported=true` **+** recency of RD practice. The lit-open is present but **contributes nothing to the change claim** — only to what's surfaced.

**Next Step (output):** *"Based on your recent practice, you separated what you observed from what you were assuming — that part is working. Your next step can focus on deciding what to do with the information once you have it."* → surfaces the **acting-on-evidence** focus (the T2b decision operation) / a decision-under-ambiguity mission — **not** "repeat the same Play."

**Boundary check:** describes a demonstrated+reported context; no trait ("you're indecisive"), no outcome inference, no mastery claim.

---

#### Pattern B — *Bounded event globalizing to self-worth* (WM track)

| Step | User action | Signals written |
|---|---|---|
| Recognition | taps "when things don't work out, I wonder what's wrong with me" | `recognized += rec-self-meaning` |
| Understand | opens "rejection vs. a global verdict about yourself" | `literature_opened {lit-rejection-not-verdict}` → **Exposure** |
| Experience | WM simulation (expansion/contraction, §6.4); chooses the branch that expands "one no" → "no one will ever choose me," sees the teaching beat, then **narrows** it back | `simulation_completed {narrowed: true, expansion_branch: identity}` → **Fidelity (in-app)** |
| Play | performs WM operation; saves "smallest true thing: this one person didn't want to continue" | `outputs[what-it-actually-means]` saved → **Application** |
| Practice | mission "when a letdown starts to feel like a fact about you, name what it actually shows before deciding what it means"; reports attempting | `mission_attempt_reported` → **Application (real world)** |
| Integrate | structured review: performed-as-intended = **no**; hardest part = **the feeling / it still spiraled**; Keep/Update = **Update** | `integration_reviewed {performed: no, hardest: feeling}` → low real-world fidelity |

**Recommendation point — data used:** in-app `narrowed=true` (can do it in-app) **but** reported `performed=no` + `hardest=feeling` in the real world → an **exposure/application gap**, not a trait. Plus: does a *real repeating pattern* exist in her inputs? Only her declared inputs/simulation choices — never partner behavior.

**Next Step (output):** *"In the exercise you were able to bring a big conclusion back to what actually happened. In the moment it's still hard — a useful next practice may be a smaller, lower-pressure version before the full step."* → surfaces a **graded WM mission** + a targeted **just-in-time literature** entry on globalization ("everyone / forever / identity / worth"). If her own inputs indicate a genuine recurring pattern, offer the authored **route to Read It, Then Decide** (existing `Play.routing`) — *without inventing a cause.*

**Layer-B (not crisis):** persistent self-worth heaviness surfaces the WM **support signpost** ("if this is bigger than a dating moment… a mental health professional can help"). **General self-worth language is never escalated to a Layer-A crisis event.**

**Boundary check:** "in the exercise you were able to… in the moment it's still hard" is context-bound and process-framed; no "you have low self-esteem," no etiology, no diagnosis.

---

#### Pattern C — *Recognition-heavy, exploring, low application* (restraint pattern)

| Step | User action | Signals written |
|---|---|---|
| Recognition | taps several, incl. "I'm just tired of being alone" (validate) and "I'm worn out by dating" | `recognized += rec-loneliness, rec-fatigue` |
| Understand | opens "loneliness without pathologizing the desire for companionship"; revisits it once | `literature_opened` ×2 → **Exposure only** |
| Experience/Play | none yet | — |

**Recommendation point — data used:** declared recognition + **content engagement only.** There is **no** application or fidelity signal. Per the boundary, revisiting literature **cannot** be read as progress, and absence of a Play attempt **cannot** be read as inability.

**Next Step (output):** *"There's no rush, and wanting a partner isn't a problem to fix. When you're ready, a low-pressure place to start is a short exercise on reading early-dating signals — or you can keep exploring."* → offers an **invitation** (a low-stakes entry + Explore), never a verdict, never a push. If she later selects **"this is what I want to work on"** (declared input), Change Path surfaces the matching track.

**Boundary check:** no inference from absence; reading is not counted as improvement; the desire for companionship is normalized, not pathologized; the user is never hard-locked.

---

## 5. Literature content model + the 101-statement map

First-class, navigable content objects (not a screen kind). Git-versioned TS, authored like `Play`. Optional and non-sequential.

```ts
type LiteratureScope = "cluster" | "play" | "jit";

interface LiteratureEntry {
  id: string;                 // stable
  version: number;            // versioned content
  scope: LiteratureScope;
  title: string;              // often the lived-experience question ("Why do I feel like the backup option?")
  body: LiteratureBlock[];    // short field-guide prose; ~5th-grade readability, adult intelligent tone
  playId?: string;            // scope="play"
  anchor?: string;            // scope="jit": what surfaces it (a simulation beat, decision, use, or difficulty tag)
  related?: string[];         // navigable cross-links
}
```

- **Three levels:** cluster (the overall problem), play (education supporting an intervention), jit (short, surfaced after a specific moment/decision/use/difficulty).
- **Readability:** the ~5th-grade standard being handled in PR #68 applies, **while maintaining an adult, intelligent tone.** Plain language ≠ shallow content.
- **Boundary:** more literature does **not** turn the Playbook into the Academy. Every entry helps understand/change *this cluster.*
- **Read-state** is stored only where useful (avoid re-surfacing a JIT entry). It is **content engagement**, never a change signal (§4.1).

### 5.1 Formal 101-statement content map (frozen — owner decision 7)

The 101 cluster statements are a **phenomenological personalization asset, not 101 treatment targets.** A formal map assigns each statement one **or more** functions. This is a content deliverable with its own review gate.

```ts
type StatementFunction =
  | "recognition"         // becomes/《feeds》 a recognition card
  | "cluster_literature"  // deeper understanding of the whole problem
  | "faq_literature"      // question-led entry ("Why do I keep caring more?")
  | "play_literature"     // supports a specific Play
  | "jit_teaching"        // surfaced after a moment/decision/use/difficulty
  | "simulation_cue"      // seeds a scenario/moment
  | "play_routing"        // routes toward a Play
  | "support_signpost"    // Layer-B support (not crisis)
  | "context_normalization" // normalize/contextualize (e.g., loneliness)
  | "none";               // no further action

interface StatementMapping {
  statementId: string;
  text: string;
  functions: StatementFunction[];   // one or more
  targets?: string[];               // ids of the literature/play/simulation objects it feeds
}
```

Most statements resolve to recognition / literature / normalization; only some feed interventions. Authoring the full map is Step 3 of the sequence (§15).

---

## 6. Simulation / content object model *(expanded — Section B)*

Deterministic authored scenario trees. **No LLM at runtime.** The purpose is experiential rehearsal of Discernment — **not gamification and not relationship-outcome scoring.**

### 6.1 The non-scoring guarantee (design-enforced)

Branches carry **educational feedback keyed to the operation**, never a predicted relationship result and never a "correct answer." The only *signal* persisted from a branch is **process-level** — e.g., *did the user update their interpretation when new evidence arrived* — which is a Fidelity signal about the discernment operation, **not** a judgment of whether the user "got the relationship right." There is no score, no points, no branch marked correct.

### 6.2 Object structure

```ts
interface Simulation {
  id: string;
  version: number;                 // content version
  simulationSchemaVersion: number; // shape version (for stored refs)
  playId: string;                  // the Play this rehearses
  signature: InteractionKind;      // "evidenceTimeline" | "conclusionNarrowing" | …
  nodes: SimNode[];                // ordered, deterministic
}

type SimNode =
  | { id: string; kind: "moment";  body: string[] }                       // something happens (unfolds)
  | { id: string; kind: "capture"; prompt: string; field: CaptureField }  // interpretation / temptation
  | { id: string; kind: "decision"; prompt: string; options: SimOption[] }// a choice point (optional branches)
  | { id: string; kind: "reveal";  body: string[] }                       // NEW relational evidence
  | { id: string; kind: "update";  prompt: string; signals: ["updated_interpretation"] } // re-interpret
  | { id: string; kind: "teach";   body: string[]; toPlayId: string };    // intervention handoff

interface SimOption {
  id: string;
  label: string;                   // a plausible choice — never "the correct one"
  feedback: string[];              // EDUCATIONAL, mechanism-focused
  // NO outcome, NO score, NO isCorrect. Optionally a *process* tag only:
  processTag?: "held_uncertainty" | "jumped_to_conclusion" | "sought_evidence";
}

type CaptureField =
  | { kind: "choice"; options: string[] }     // bounded — preferred
  | { kind: "shortText"; maxLen: number; purpose: string }; // only where the intervention needs user-authored content
```

- **Moments unfold**: moment → capture → (decision) → reveal → update → teach. Not "completed scenario then quiz."
- **Reveals are state-driven and user-advanced** — never timed or animation-dependent (a11y, §6.5).
- **Optional branches** may surface different *educational* feedback; they never fork into a right/wrong relationship answer and never predict an outcome.
- **Intervention handoff:** the terminal `teach` node routes into `toPlayId`, so the Play reads as "the operation you just felt."

### 6.3 RD signature — `evidenceTimeline` (worked example)

Unfolding relational timeline; the user forms an interpretation on incomplete information, receives more evidence, and **practices updating before applying** the evidence-to-decision operation.

```
moment   "Great first date. Easy. They say they'd love to see you again."
moment   "Over four days, their texts get shorter."
capture  "What do you think the shorter texts mean?"      → choice: [losing interest | busy week | just how they text | not sure]
capture  "What are you tempted to do?"                    → choice: [pull back | double-text | wait and watch | end it]
reveal   "Day 5: they message to set up a concrete plan for next week."
update   "Given the plan, how do you read the shorter texts now?"   → signals updated_interpretation
teach    "The gap between your first read and the new evidence is exactly what this Play trains." → toPlayId: read-and-decide
```

Underlying interaction: unfolding beats on a timeline; interpretation captured per beat via bounded choices; evidence revealed; interpretation updatable. Reuses `SortEngine`'s accessible tap-first mechanic where sorting is involved.

### 6.4 WM signature — `conclusionNarrowing` (expansion/contraction)

A bounded event **expands** into unsupported global conclusions along four axes — **everyone / the future / identity / worth** — then the user **narrows** it back to what the event actually establishes.

```
moment    "After a few good dates: 'I had a great time, but I don't think we're a match.'"
capture   "What did that turn into in your head?"  → choice surfaces expansions (everyone / forever / who-I-am / worth)
decision  "Which of these does the event actually prove?"  → options tagged held_uncertainty | jumped_to_conclusion
reveal    "What the event establishes: this one person didn't want to continue. That's it."
update    "Narrow it back to the smallest true thing."   → signals updated_interpretation (narrowed)
teach     "Keeping the size of the story to the size of the facts is the operation." → toPlayId: what-it-actually-means
```

Underlying interaction is **visually distinct** from RD (expand→narrow, not a timeline) while running on the same universal engine via the interaction registry. Owner decision 6: *the engine is universal; the intervention experience is technique-specific.* Both reuse the accessible tap-first assignment underneath.

### 6.5 Accessibility fallback
- **Tap-first and keyboard-operable**; **no drag-only** interaction. The `evidenceTimeline` and `conclusionNarrowing` both degrade to tap/select + focus-managed corrections (the existing `SortEngine` `role="status"` pattern).
- **Reveals are user-advanced and state-driven**, not timed/animated; reduced-motion honored (existing `matchMedia`/`setReducedMotion`). New evidence announced via `aria-live` so screen-reader order matches the unfolding.
- Every control labeled; the existing jsdom `axe` harness extends to the new primitives (serious/critical = 0). jsdom axe is **not** proof of visual contrast — that's verified separately.

### 6.6 Persisted vs. ephemeral

| Persisted (functional, version-stamped) | Ephemeral (never stored) |
|---|---|
| that the simulation was completed (`simulation_completed` event + current-state ref) | intermediate per-node draft text |
| `updated_interpretation: true/false` (Fidelity signal) | which exact wording the user typed in a bounded capture, beyond what the intervention output needs |
| optional `processTag` from the decision node (aggregate process signal) | scratch/undo history within the simulation |
| the resulting Play handoff / saved output (if the Play is completed) | any relationship-event detail not required by the operation |
| `simulationSchemaVersion`, `object_version` on stored refs | — |

Persist the **minimum functional payload** needed to resume, to support fidelity, and to feed Change Path — nothing more (owner decisions 2 & 5).

---

## 7. Practice / mission model

Repeating a Play in-app is not behavior change. Missions carry the operation into the real world.

```ts
interface Mission {
  id: string;
  version: number;
  playId: string;                 // the operation it exercises
  instruction: string;            // behaviorally specific
  linkToOperation: string;        // explicit tie to the intervention
  suitability?: string;           // safety/appropriateness boundary where needed
  progression?: MissionRung[];    // progressive Developmental Application — authored, NOT levels
}
interface MissionRung { id: string; instruction: string; }  // e.g. preference → opinion → small need → reasonable boundary
type MissionState = "assigned" | "attempted" | "reviewed" | "advanced";
```

- Behaviorally specific; explicit relationship to the intervention; appropriate for self-guided use; safety/suitability boundaries where needed.
- **No levels, XP, streaks, ranks, badges, or completion percentages** (owner decision 8). Progression is **authored within the intervention design** and offered only when theoretically and safety appropriate (e.g., Authentic Presentation: preference → opinion → small need → reasonable boundary — a *future* Play, not built here).
- The system may recommend a next stretch from **demonstrated/reported application**, but must **not claim mastery** from completion.
- **Consumer copy:** "Try this next." / "Ready to stretch this a little further?" / "A useful next practice may be…" (internally: progressive Developmental Application).
- **No partner-surveillance** prompts (§15).

---

## 8. Integration / return model

Structured choices + **minimal, bounded, purpose-specific free text** — never journaling (owner decision 5).

```ts
interface IntegrationReview {
  id: string; version: number; playId: string;
  prompts: {
    didDifferently:     StructuredPrompt;   // bounded choices
    performedOperation: StructuredPrompt;   // yes / partly / no  (Fidelity)
    becameClearer:      StructuredPrompt;   // bounded
    stuckWhere:         StructuredPrompt;   // bounded (evidence / acting / the feeling / …)
    stillFits:          "keep" | "update";  // reuses v0 Keep/Update
  };
}
```

- Collects only what supports **fidelity, behavioral transfer, updating the saved Play, and selecting the next focus.**
- Free text only where the **intervention itself** requires user-authored content (e.g., the WM "smallest true thing"). No asking users to recount relationship events in detail to personalize the system.
- **Does not measure relationship outcome.** Correct use + remaining discomfort = still a success. The **Keep / Update** branch reuses `recordOutput(..., keepState=true)` + the narrow `OutputEditor`.

---

## 9. Technical component / schema changes

- **Content schema** (`lib/playbook/contentSchema.ts`, additive): add `LiteratureEntry`, `Simulation` (+ `SimNode`, `SimOption`, `CaptureField`), `Mission` (+ `MissionRung`), `IntegrationReview`, `Track`, `StatementMapping`, and an `InteractionKind` registry type. `PlaybookContent` gains `literature[]`, `simulations[]`, `missions[]`, `integrationReviews[]`, `tracks[]`, `statementMap[]`. `Play` keeps `screens[]`; its `literature` screen migrates to `LiteratureEntry`; `realWorldUse` graduates into `Mission`.
- **Interaction registry:** refactor `PlayContainer`'s `renderScreen` switch into a **component registry keyed by interaction kind**, consumed by the Play walker *and* the Simulation/Mission/Integration walkers. **Byte-parity regression for the two existing Plays.**
- **New views in `ExperienceShell`:** `understand`, `experience`, `practice`, `integrate`, and a Change-Path-driven home that **resumes** (§3). The v0 `opening → recognition → board → gate → play → myplays` machine is extended, not rewritten.
- **`lib/playbook/changePath.ts`** (new): pure `changePath(state) → { nextStep, surfaced[] }` implementing §4, fully unit-testable (incl. boundary tests: reading-not-progress, absence-not-inability, observation-not-trait).
- **New pure reducers** (in the `progressActions.ts` style) for literature-read, simulation completion, mission state, and integration signals — version-stamped, functional-only.
- **Process-state tagging** utility mapping signals → Exposure/Application/Fidelity/Integration (§1), used by both Change Path and the event writer.

---

## 10. Persistence & state objects (frozen — owner decisions 2 & 3)

Two stores, cleanly separated.

### 10.1 `playbook_progress` — current state / resume state (additive, **separated versioned state objects**, NOT one catch-all)
Extend with clearly separated, individually version-stamped jsonb objects:

```
literature_state    { version, … }   -- read-where-useful, saved
simulation_state    { version, … }   -- resume position, updated_interpretation flags
practice_state      { version, … }   -- mission assignment + MissionState
integration_state   { version, … }   -- last structured review signals
change_path_state   { version, … }   -- current + prior application focus
```
Each object is designed so it can **later be extracted into a sibling table without changing product identity or IDs** if scale/query needs justify normalization. Existing `recognized / play_states / outputs / my_plays` are unchanged.

### 10.2 `playbook_events` — append-only longitudinal functional-use history (own normalized table)
Supports future **process validation without becoming surveillance.** Store **only the minimum functional payload.** No unrestricted narratives, no partner-monitoring data, no raw sensitive disclosures. Fields (frozen list):

```
id            uuid pk
user_id       uuid  -> auth.users on delete cascade
playbook_key      text      -- stable
playbook_version  integer
object_type       text      -- 'literature' | 'simulation' | 'play' | 'mission' | 'integration'
object_id         text
object_version    integer
event_type        text      -- 'literature_opened' | 'simulation_completed' | 'operation_performed' | 'mission_selected' | 'mission_attempt_reported' | 'integration_reviewed' | 'focus_changed' | …
schema_version    integer   -- event payload shape version
payload           jsonb      -- MINIMUM functional payload only (e.g. { updated_interpretation: true })
created_at        timestamptz
```
RLS own-row **select + insert only**; **no update/delete** (append-only). Layer A still screens any bounded free text before an event is written; events carry metadata, not raw disclosures.

---

## 11. Reuse audit (grounded in the deployed code)

**Reused unchanged:** `playbook_progress` table + RLS + `unique(user_id, playbook_key)` (extended additively); `lib/playbook/keys.ts`; `lib/playbook/crisisSafety.ts` + Safety V2 (Layer A); entitlement/commerce (`ownsPlaybook`, `playbook_entitlements`, `/api/playbook/[key]/access`, `PlaybookCta`, RSC gating in `app/playbook/[key]/page.tsx`); `SortEngine.tsx` accessible tap-first mechanic; version-stamping (`StoredOutput`), `sanitize.ts`, `useProgress` autosave, `outputSummary.deriveUserLine`; **My Plays** (schema + UI) preserved.

**Generalized:** `PlayContainer` linear walker → interaction registry serving multiple walkers; `ExperienceShell` state machine → additional layer views + resuming Change-Path home; `Screen` union → intervention screens stay on `Play`, literature/real-world-use/integration graduate into their own objects; recognition cards retained, now routable to literature (not only Plays) and feeding Change Path inputs.

**New:** `LiteratureEntry` (+ read-state), `Simulation` engine, `Mission` engine (+ progression + states), `IntegrationReview`, `Track`, `StatementMapping`, `changePath.ts`, process-state tagger, interaction primitives (`evidenceTimeline`, `conclusionNarrowing`), `playbook_events` table.

---

## 12. What must change vs. must not

**Must change:** extract in-Play literature to `LiteratureEntry`; author Cluster-1 literature + the 101-statement map (content gate); add the Simulation layer *before* the Play; build the two signature interactions; add Missions (+ authored progression where supported); replace Keep/Update with structured `IntegrationReview`; add Change Path + the resuming home/IA; additive current-state objects + the `playbook_events` table; add the process-state model throughout.

**Must NOT change:** the two Plays' *intervention logic*; the remaining **four Cluster-1 Plays are not authored/implemented here** (they still require approved Phase 5/5B design); Snapshot/scoring; the RLC framework; entitlement/commerce; stable `playbook_key`/`play_id`; RLS; no-LLM-runtime; no gamification.

---

## 13. Database migration (described — NOT written, NOT run)

Eventual migration, **owner-run only after explicit approval:**
1. `playbook_progress` (additive): add nullable jsonb `literature_state`, `simulation_state`, `practice_state`, `integration_state`, `change_path_state`, each defaulting empty; no backfill; existing rows read as empty; compatible with deployed data.
2. `playbook_events` (new, append-only): the §10.2 shape; RLS own-row select/insert; no update/delete; `notify pgrst`.
3. **No changes** to `playbook_entitlements`, `quiz_*`, or any Snapshot/scoring table.

No migration is written or run in this pass.

---

## 14. Accessibility implications
Tap-first, keyboard-operable, focus-managed, `role="status"` corrections preserved in the new primitives; **no drag-only** interactions; unfolding is **user-advanced/state-driven**, reduced-motion honored, reveals via `aria-live`; missions and integration are labeled forms; the jsdom `axe` harness extends to every new component (serious/critical = 0); jsdom axe ≠ visual-contrast proof (checked separately); fully responsive/mobile.

---

## 15. Safety / privacy implications
Two-layer separation preserved: **Layer A (crisis)** stays the frozen, shared, metadata-only engine, extended to screen any bounded free text in simulations/missions/integration; **Layer B (per-Play/Simulation/Mission signposts)** stays content-driven. **General self-worth language never becomes a crisis event.** Data minimization: functional product state, structured selects, version-stamped outputs, minimal event payloads — **never** unrestricted emotional narratives or partner-surveillance data. Mission design avoids partner-monitoring. Change Path stores only a small functional focus record, recomputable from state, never a psychological profile. **Attorney review outstanding; nothing represented as attorney-approved; Owner Risk Acceptance is the posture.**

---

## 16. Implementation sequence (build only after approval; each step its own gate; behind a feature flag)

0. **Approved architecture (this document).**
1. Schema/type layer + separated current-state objects + author the `playbook_events` migration (owner-run) + process-state tagger; flag-isolated.
2. Interaction registry refactor — **byte-parity regression** for the two current Plays.
3. Understand: literature objects + navigable field guide + the **101-statement content map** *(content gate)*.
4. Experience: Simulation engine + RD `evidenceTimeline` + WM `conclusionNarrowing` *(content gate)*.
5. Play: wire the two Plays to follow their simulation; extract literature.
6. Practice: Mission engine + RD/WM missions + authored progression where supported.
7. Integrate: structured `IntegrationReview` replacing Keep/Update.
8. Change Path: orchestrator + resuming home/IA + boundary tests.
9. Full a11y + safety regression → owner walkthrough → **separate deploy decision**.

No production change and no deploy at any step without explicit owner approval.

---

## 17. Frozen decisions ledger

1. **Decompose into five composable objects** (Understand→Experience→Play→Practice→Integrate) — **APPROVED.**
2. **Create `playbook_events` now** (append-only longitudinal history; progress = current/resume state; minimum functional payload; stable IDs + version stamps: `playbook_key`, `playbook_version`, `object_type`, `object_id`, `object_version`, `event_type`, `schema_version`, timestamp) — **APPROVED.**
3. **Additive current state as separated versioned state objects; events in their own normalized table; no catch-all JSONB; extractable to sibling tables later without changing identity/IDs** — **APPROVED.**
4. **Change Path inputs + observation-not-trait rule** (exact allowed / content-influence-only / forbidden lists; context-bound process phrasing; no overstating from one interaction; orchestration not assessment) — **APPROVED.**
5. **Integration = structured choices + minimal bounded free text; not journaling; no relationship-event recounting** — **APPROVED.**
6. **Two signature interactions** (RD unfolding evidence timeline; WM expansion/contraction) — universal engine, technique-specific experience — **APPROVED.**
7. **Literature scope model + formal 101-statement content map** (multi-function; phenomenological asset, not 101 targets; ~5th-grade readability with adult, intelligent tone) — **APPROVED.**
8. **Mission progression = progressive Developmental Application** (no levels/XP/streaks/ranks/badges/%; authored; no mastery claim from completion; "try this next" copy) — **APPROVED.**
9. **IA / home** with Change Path as *internal* architecture; consumer sections Understand This Pattern · Where You Might Start · Practice This · What I'm Practicing · Your Next Step · My Plays · Explore Another Area; **preserve returning-user state** — **APPROVED (labels are copy candidates).**
10. **Deployment posture** — v0 intact; Rev 3 behind isolation; no deploy and no new production migration without explicit approval; attorney review outstanding; Owner Risk Acceptance posture — **APPROVED.**

**Additional architecture requirement — process-state model** (Exposure / Application / Fidelity / Integration; product/process states, not RLC constructs; never collapse "completed a Play" into "improved"; matters for analytics + eventual RLC validation) — **INCORPORATED (§1, and enforced throughout §4, §6, §8, §10).**

---

### Scope guardrails honored
Prototype is **Cluster 1 only**; the architecture is designed to *eventually* support the other Playbooks but does **not** generalize or implement all 27 clusters, and the remaining four Cluster-1 Plays are **not** authored here. No code, no migration, no production change, no deploy in this pass. Branch held local pending final architecture approval.
