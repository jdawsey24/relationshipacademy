# Phase 7 — Relationship Playbook™ Product Architecture (Rev 3, final)

**Status:** FINAL ARCHITECTURE FOR APPROVAL — direction approved; owner adjudications (Rev 3.0 → 3.1) incorporated. Not yet implemented.
**Prototype cluster:** Cluster 1 "Difficulty Feeling Chosen" (consumer: *Moving Beyond Rejection*).
**Posture:** the deployed v0 two-Play Playbook stays intact. Rev 3 is built behind a feature flag, reviewed, and **not deployed, and runs no new production migration, without explicit owner approval.** Attorney review remains **outstanding**; nothing here is attorney-reviewed or attorney-approved; the existing **Owner Risk Acceptance** remains the posture.

> Nothing here changes Relationship Life Cycle™ theory. The consumer product functions `Understand → Experience → Play → Practice → Integrate`, the internal orchestrator **Change Path**, and the internal process states `Exposure → Attempt → Technique Fidelity → Transfer` are **product-delivery concepts only.** The canonical framework is unchanged: **Phase → Developmental Task → Competencies → Developmental Application → Task Mastery.** The Playbook strengthens **Developmental Application** for the specific problem a cluster represents.

This document incorporates the owner's frozen decisions (§17) and the six adjudications + two document-wide requirements (§18) with the two expanded sections requested earlier: the **Change Path decision model** (§4) and the **simulation/content object model** (§6).

---

## 0. Core architectural move

The deployed model is **Play-centric and linear**: literature, the sort exercise, the own-turn, the rule builder, and real-world-use are all `Screen`s inside one `Play.screens[]`, walked in order by `PlayContainer`. Rev 3 **decomposes the monolithic Play into five composable consumer product objects, bound by their operation and orchestrated internally by Change Path** — while keeping the intervention core (which works) reusable.

| Consumer object | Type | Replaces / extends in v0 |
|---|---|---|
| **Understand** | `LiteratureEntry` (scope: cluster / play / jit) | the single `literature` screen kind |
| **Experience** | `Simulation` (deterministic scenario tree) | the static `scenarioSort` screen |
| **Play** | `Play` (intervention core, largely as-is) | reused; literature extracted; now *follows* a Simulation |
| **Practice** | `Mission` (+ authored progression) | the `realWorldUse` screen + the "I used this" flag |
| **Integrate** | `UseReview` (`IntegrationReview` object) | the "How did it go / Keep / Update" dialog |
| *(orchestration, internal)* | **Change Path** | the board's "surface, never lock" logic |

The five objects are **composable, not a mandatory five-step funnel.** A user is never forced through all five every time; Change Path surfaces the *next useful* node, literature is always optional, and "Explore Another Area" is always available.

> **Terminology note (adjudication 1):** the consumer function keeps the name **Integrate**, but the *internal* process state and persistence use non-conflicting terms — `Transfer` for the process state and `use_review_state` for the persisted current-state object — so nothing internal collides with the canonical Developmental Task **Integration** (of Expansion) or the canonical construct **Developmental Application**.

---

## 1. Process-state model — Exposure → Attempt → Technique Fidelity → Transfer

**This is the backbone of the architecture.** These are **product/process states, not RLC constructs.** They exist so the system never collapses *"completed a Play"* into *"improved,"* and so product-process analysis and future research design can distinguish engagement from enactment.

| State | Definition | Legitimate signals (first-party functional data) | What it is NOT |
|---|---|---|---|
| **Exposure** | Encountered / read / practiced-in-app a thing. | literature opened; simulation viewed; Play explored; screen reached. | Not improvement, competency, or change. Reading ≠ change. |
| **Attempt** | Tried to use the operation — in a simulation and/or the real world. | performed the Play operation; selected a mission; **reports** attempting/using the mission. | Not success. An attempt is not a correct use. |
| **Technique Fidelity** | Used the operation **as intended** (mechanism-true, per the Play's authored fidelity model). | in-sim: `evidence_reconsidered`, and where the authored interaction supports it `interpretation_revised_when_warranted`; structured fidelity-review responses (performed-as-intended? yes/partly/no). | Not relationship outcome. **Not change-of-mind, reversal, or optimism itself** (§2/§6.1). |
| **Transfer** | Carried the operation forward — used it in **another context** and/or appropriately adjusted it. | evidence of use in ≥1 new context; a *considered* retain/revise of the saved tool; advancing an authored progression when appropriate. | Not "done," mastery, or a level. **Accumulating evidence of transfer — never proof of stable integration.** |

**Rules the system enforces:**
- **Exposure never advances a change claim.** Content engagement (literature opened/saved/revisited) may *influence what is recommended next* but is never evidence a competency or enactment improved.
- **Technique Fidelity is not "changed my mind."** It is reconsidering an interpretation **in light of evidence** and revising it **when warranted**. The system does not reward reversal, optimism, or change itself (adjudication 2).
- **Keep/Update is not Transfer by itself** (adjudication 4). It is evidence the user *reviewed* the saved tool against experience and *retained or revised* it. Transfer additionally requires **evidence of use in another context.** These are tracked as **separate signals** (see below) and may inform Change Path differently.
- **Developmental Application (canonical RLC) is not a product state.** It retains its canonical meaning and is interpreted **only where evidence legitimately supports authentic-context enactment** — which, in product terms, requires real-context Transfer evidence, not in-app Attempt/Fidelity alone.
- Each Change Path recommendation is tagged internally with the **highest process-state legitimately supported by the data** and phrased about *that demonstrated/reported context*, never about the person (§4.2).

**Separately tracked signals (never conflated):**
`attempt` · `technique_fidelity` · `tool_reviewed` · `tool_retained_or_updated` · `used_in_another_context`.

### 1.1 Research boundary (required)

> Playbook telemetry may support **product-process analysis, feasibility work, hypothesis generation, and future research design**, but is **not by itself evidence validating the RLC Framework.** Any use as validation evidence requires an appropriate research protocol and study design capable of supporting the specific claim. The process-state model and `playbook_events` exist to make later, properly designed research *possible* — not to stand in for it.

---

## 2. Revised consumer experience — entry through integration

Composable, not a forced funnel. Walked end-to-end for **Read It, Then Decide**:

1. **Understand** *(optional, anytime).* Cluster literature ("what Difficulty Feeling Chosen actually is"; "wanting to be chosen vs. using selection as evidence of worth"; "seeing relational evidence vs. acting on what you know"). Play literature ("why dating uncertainty is hard, and what it can and can't tell you") is surfaced near the Play but never gates it. → **Exposure.**
2. **Experience.** The RD simulation *unfolds over time* (§6): strong first date → "they want to see you again" → texts shorten → **capture interpretation & temptation** → **reveal** new evidence (a concrete plan for next week) → **reconsider** the interpretation in light of that evidence → **teach** the evidence-to-decision operation. Reconsidering in light of evidence — and revising *only when warranted* — is a **Technique Fidelity** signal (not "changed my mind"). → **Attempt / Technique Fidelity (in-app).**
3. **Play.** The RD intervention (saw-it / guessing / don't-know-yet + a decision rule), framed as *"here's the operation you just felt,"* flowing from the simulation, not a standalone worksheet. → **Attempt**, saved output = executable artifact.
4. **Practice.** A behaviorally specific real-world mission bound to the operation ("On your next date, name what you're learning about the other person before evaluating your own performance"). → **Attempt (real world)** when the user reports attempting.
5. **Integrate.** Structured return: did you separate what you saw from what you guessed? What became clearer? Where did you still get stuck? Does your saved Play still fit (Keep / Update)? → **Technique Fidelity + tool-review signals**, feeding Change Path. (Use in another context, over time, is what accrues toward **Transfer**.)

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

### 3.1 How the five objects bind and sequence (no separate `Track` object)

The objects are bound by **object-to-operation mapping** — each `Simulation`, `Play`, `Mission`, `LiteratureEntry`, and `UseReview` references the operation (`playId`) it serves — and sequenced by the **default five-layer flow** (Understand → Experience → Play → Practice → Integrate), with **Change Path** choosing the next useful node from the user's functional state.

> **Parsimony (adjudication 6): the proposed `Track` object is removed.** Its only proposed job — associating objects around one operation and suggesting an order — is already fully served by the `playId` mappings plus the five-layer default sequence plus Change Path. It added an identity with no unique function, so it is cut.

---

## 4. Change Path — decision model *(expanded — Section A)*

**What it is:** a pure, deterministic, **internal** orchestration function. Input = the user's functional interaction state. Output = a prioritized surface of next-useful experiences + one plain-language "Your Next Step" line. Recomputable from state; stores no psychological profile. **It is an orchestration system, not a hidden assessment.**

### 4.1 Inferential boundary (frozen — decision 4)

**May use — user-declared inputs:** recognition selections; explicit area/focus selections; user "this is what I want to work on" choices.

**May use — first-party functional interaction data:** simulation choices; whether the interpretation was **reconsidered in light of evidence (and revised when warranted)**; Play operations performed; saved executable outputs; fidelity-review responses; real-world mission selected; whether the user reports attempting/using the mission; structured integration responses; whether the user chose Keep or Update after real-world use *(as a tool-review signal, not Transfer)*; current and prior application focus; recency of relevant practice; **evidence of use in another context** *(the Transfer signal)*.

**May influence recommendations only (never a change claim):** content engagement — literature opened, saved, or revisited. **Reading is never evidence a competency or enactment improved.**

**Must NOT infer from:** relationship outcomes; whether another person pursued/committed/rejected/replied; mood; emotional intensity; presumed attachment style; personality or stable traits; partner motives; diagnosis; etiology; unrestricted free-text interpretation; number of completions alone; time spent in app; reading completion alone.

### 4.2 Observation-not-trait rule + claim-tightening (frozen + adjudication 3)

Every conclusion describes **what the user demonstrated or reported in a specific context**, never what kind of person they are, and never overstates capability from a single interaction. **Treat evidence across contexts as accumulating evidence of Transfer — never proof of stable integration or mastery.**

**Allowed** (context-bound, process-framed):
- "In this exercise, you separated what you observed from what you were assuming. Your next step can focus on deciding what to do with that information." *(context-bound; not "that part is working.")*
- "You've practiced expressing a preference. A useful next stretch may be expressing a small need."
- Framing: "Based on what you practiced here…" / "A useful next area may be…"

**Not allowed** (trait/finding/etiology, or overstated capability):
- "You are good at reading people." · "You have trouble trusting yourself." · "You're an overthinker." · "You fear abandonment." · "You tend to choose emotionally unavailable people." · "That part is working" *(overstates from one interaction).*

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
| Understand | opens "seeing evidence vs. acting on what you know" | `literature_opened {object_id: lit-see-vs-act}` → **Exposure only** |
| Experience | RD simulation; at the reveal, **reconsiders** in light of the concrete plan and revises "losing interest" → "signal is ambiguous; the plan is real" | `simulation_completed {evidence_reconsidered: true, interpretation_revised_when_warranted: true}` → **Technique Fidelity (in-app)** |
| Play | performs RD operation; saves rule "If I see the plan actually happen → keep things the same for now" | `outputs[read-and-decide]` saved; `play_states.read-and-decide = in_my_plays` → **Attempt** |
| Practice | selects mission "name what you're learning about them before evaluating yourself"; later reports attempting | `mission_selected`, `mission_attempt_reported` → **Attempt (real world)** |
| Integrate | structured review: performed-as-intended = **partly**; hardest part = **acting on it**; Keep/Update = **Keep** | `integration_reviewed {performed: partly, hardest: acting}` → **Technique-Fidelity + `tool_reviewed`/`tool_retained` signals; no Transfer yet** |

**Recommendation point — data actually used:** `evidence_reconsidered=true` + `interpretation_revised_when_warranted=true` (in-app fidelity) **+** `hardest=acting` (reported) **+** `mission_attempt_reported=true` **+** recency of RD practice. The lit-open contributes **nothing** to the change claim — only to what's surfaced. Keep is logged as `tool_reviewed`/`tool_retained`, **not** as Transfer.

**Next Step (output):** *"In this exercise, you separated what you observed from what you were assuming. Your next step can focus on deciding what to do with the information once you have it."* → surfaces the **acting-on-evidence** focus (the T2b decision operation) / a decision-under-ambiguity mission — **not** "repeat the same Play." Repeated success across future contexts would accrue as **accumulating Transfer evidence**, not a mastery claim.

**Boundary check:** context-bound and process-framed; no trait, no "that part is working," no outcome inference, no mastery.

---

#### Pattern B — *Bounded event globalizing to self-worth* (WM track)

| Step | User action | Signals written |
|---|---|---|
| Recognition | taps "when things don't work out, I wonder what's wrong with me" | `recognized += rec-self-meaning` |
| Understand | opens "rejection vs. a global verdict about yourself" | `literature_opened {lit-rejection-not-verdict}` → **Exposure** |
| Experience | WM simulation (expansion/contraction, §6.4); expands "one no" → "no one will ever choose me," sees the teaching beat, then **narrows** it back to what the event establishes | `simulation_completed {interpretation_revised_when_warranted: true, expansion_axis: identity}` → **Technique Fidelity (in-app)** |
| Play | performs WM operation; saves "smallest true thing: this one person didn't want to continue" | `outputs[what-it-actually-means]` saved → **Attempt** |
| Practice | mission "when a letdown starts to feel like a fact about you, name what it actually shows before deciding what it means"; reports attempting | `mission_attempt_reported` → **Attempt (real world)** |
| Integrate | structured review: performed-as-intended = **no**; hardest part = **the feeling / it still spiraled**; Keep/Update = **Update** | `integration_reviewed {performed: no, hardest: feeling}` → low real-world fidelity; `tool_reviewed`/`tool_updated` |

**Recommendation point — data used:** in-app `interpretation_revised_when_warranted=true` (can do it in-app) **but** reported `performed=no` + `hardest=feeling` in the real world → an **exposure/attempt gap**, not a trait. Update is logged as tool-review + revise, **not** Transfer. Whether a *real recurring pattern* exists is read only from her **declared inputs/simulation choices** — never partner behavior.

**Next Step (output):** *"In the exercise you brought a big conclusion back to what actually happened. In the moment it's still hard — a useful next practice may be a smaller, lower-pressure version before the full step."* → surfaces a **graded WM mission** + a targeted **just-in-time literature** entry on globalization ("everyone / forever / identity / worth"). If her own inputs indicate a genuine recurring pattern, offer the authored **route to Read It, Then Decide** (existing `Play.routing`) — *without inventing a cause.*

**Layer-B (not crisis):** persistent self-worth heaviness surfaces the WM **support signpost** ("if this is bigger than a dating moment… a mental health professional can help"). **General self-worth language is never escalated to a Layer-A crisis event.**

**Boundary check:** "in the exercise you… in the moment it's still hard" is context-bound and process-framed; no "you have low self-esteem," no etiology, no diagnosis.

---

#### Pattern C — *Recognition-heavy, exploring, low attempt* (restraint pattern)

| Step | User action | Signals written |
|---|---|---|
| Recognition | taps several, incl. "I'm just tired of being alone" (validate) and "I'm worn out by dating" | `recognized += rec-loneliness, rec-fatigue` |
| Understand | opens "loneliness without pathologizing the desire for companionship"; revisits it once | `literature_opened` ×2 → **Exposure only** |
| Experience/Play | none yet | — |

**Recommendation point — data used:** declared recognition + **content engagement only.** There is **no** Attempt or Fidelity signal. Per the boundary, revisiting literature **cannot** be read as progress, and absence of a Play attempt **cannot** be read as inability.

**Next Step (output):** *"There's no rush, and wanting a partner isn't a problem to fix. When you're ready, a low-pressure place to start is a short exercise on reading early-dating signals — or you can keep exploring."* → offers an **invitation** (a low-stakes entry + Explore), never a verdict, never a push. If she later selects **"this is what I want to work on"** (declared input), Change Path surfaces the matching objects for that operation.

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

### 5.1 Formal 101-statement content map (frozen — decision 7)

The 101 cluster statements are a **phenomenological personalization asset, not 101 treatment targets.** A formal map assigns each statement one **or more** functions. This is a content deliverable with its own review gate.

```ts
type StatementFunction =
  | "recognition" | "cluster_literature" | "faq_literature" | "play_literature"
  | "jit_teaching" | "simulation_cue" | "play_routing" | "support_signpost"
  | "context_normalization" | "none";

interface StatementMapping {
  statementId: string;
  text: string;
  functions: StatementFunction[];   // one or more
  targets?: string[];               // ids of the literature/play/simulation objects it feeds
}
```

Most statements resolve to recognition / literature / normalization; only some feed interventions. Authoring the full map is Step 3 of the sequence (§16).

---

## 6. Simulation / content object model *(expanded — Section B)*

Deterministic authored scenario trees. **No LLM at runtime.** The purpose is experiential rehearsal of Discernment — **not gamification and not relationship-outcome scoring.**

### 6.1 The non-scoring, non-optimism guarantee (design-enforced)

Branches carry **educational feedback keyed to the operation**, never a predicted relationship result and never a "correct answer." The only *signals* persisted from a simulation are **process-level and evidence-anchored**:
- `evidence_reconsidered` — the user genuinely weighed the new evidence against their prior interpretation;
- `interpretation_revised_when_warranted` — they revised **because the evidence warranted it**, authored only into interactions where "warranted" is well-defined.

**The system does not reward reversal, optimism, or change-of-mind itself.** Simply flipping an interpretation when new information appears is *not* fidelity. There is no score, no points, no branch marked correct.

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
  | { id: string; kind: "reconsider"; prompt: string;
      signals: Array<"evidence_reconsidered" | "interpretation_revised_when_warranted"> } // weigh evidence; revise if warranted
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

- **Moments unfold**: moment → capture → (decision) → reveal → reconsider → teach. Not "completed scenario then quiz."
- **Reveals are state-driven and user-advanced** — never timed or animation-dependent (a11y, §6.5).
- **Optional branches** may surface different *educational* feedback; they never fork into a right/wrong relationship answer and never predict an outcome.
- **The `reconsider` node** is where fidelity is judged — did the user weigh the evidence and revise *when warranted* — not merely whether they changed their mind.
- **Intervention handoff:** the terminal `teach` node routes into `toPlayId`, so the Play reads as "the operation you just felt."

### 6.3 RD signature — `evidenceTimeline` (worked example)

Unfolding relational timeline; the user forms an interpretation on incomplete information, receives more evidence, and **practices reconsidering before applying** the evidence-to-decision operation.

```
moment      "Great first date. Easy. They say they'd love to see you again."
moment      "Over four days, their texts get shorter."
capture     "What do you think the shorter texts mean?"   → choice: [losing interest | busy week | just how they text | not sure]
capture     "What are you tempted to do?"                 → choice: [pull back | double-text | wait and watch | end it]
reveal      "Day 5: they message to set up a concrete plan for next week."
reconsider  "Given the plan, weigh your first read. Does the evidence change it?"  → signals: evidence_reconsidered, interpretation_revised_when_warranted
teach       "The gap between your first read and the new evidence is exactly what this Play trains." → toPlayId: read-and-decide
```

Reconsidering here is *warranted* (a concrete plan is real counter-evidence to "losing interest"). If the reveal had instead confirmed the ambiguity, holding the interpretation would be the fidelity-true response — the interaction is authored so that **revising is only credited when the evidence warrants it.**

### 6.4 WM signature — `conclusionNarrowing` (expansion/contraction)

A bounded event **expands** into unsupported global conclusions along four axes — **everyone / the future / identity / worth** — then the user **narrows** it back to what the event actually establishes.

```
moment      "After a few good dates: 'I had a great time, but I don't think we're a match.'"
capture     "What did that turn into in your head?"  → choice surfaces expansions (everyone / forever / who-I-am / worth)
decision    "Which of these does the event actually prove?"  → options tagged held_uncertainty | jumped_to_conclusion
reveal      "What the event establishes: this one person didn't want to continue. That's it."
reconsider  "Narrow it back to the smallest true thing the event supports."  → signals: interpretation_revised_when_warranted
teach       "Keeping the size of the story to the size of the facts is the operation." → toPlayId: what-it-actually-means
```

Underlying interaction is **visually distinct** from RD (expand→narrow, not a timeline) while running on the same universal engine via the interaction registry. Decision 6: *the engine is universal; the intervention experience is technique-specific.* Both reuse the accessible tap-first assignment underneath.

### 6.5 Accessibility fallback
- **Tap-first and keyboard-operable**; **no drag-only** interaction. Both signatures degrade to tap/select + focus-managed corrections (the existing `SortEngine` `role="status"` pattern).
- **Reveals are user-advanced and state-driven**, not timed/animated; reduced-motion honored (existing `matchMedia`/`setReducedMotion`). New evidence announced via `aria-live` so screen-reader order matches the unfolding.
- Every control labeled; the existing jsdom `axe` harness extends to the new primitives (serious/critical = 0). jsdom axe is **not** proof of visual contrast — checked separately.

### 6.6 Persisted vs. ephemeral

| Persisted (functional, version-stamped) | Ephemeral (never stored) |
|---|---|
| that the simulation was completed (`simulation_completed` event + current-state ref) | intermediate per-node draft text |
| `evidence_reconsidered` / `interpretation_revised_when_warranted` (Technique-Fidelity signals) | exact wording typed in a bounded capture, beyond what the intervention output needs |
| optional `processTag` from a decision node (aggregate process signal) | scratch/undo history within the simulation |
| the resulting Play handoff / saved output (if the Play is completed) | any relationship-event detail not required by the operation |
| `simulationSchemaVersion`, `object_version` on stored refs | — |

Persist the **minimum functional payload** needed to resume, to support fidelity, and to feed Change Path — nothing more (decisions 2 & 5).

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

- Behaviorally specific; explicit tie to the intervention; appropriate for self-guided use; safety/suitability boundaries where needed.
- **No levels, XP, streaks, ranks, badges, or completion percentages** (decision 8). Progression is **authored within the intervention design** and offered only when theoretically and safety appropriate (e.g., Authentic Presentation: preference → opinion → small need → reasonable boundary — a *future* Play, not built here).
- The system may recommend a next stretch from **demonstrated/reported enactment**, but must **not claim mastery** from completion.
- **Consumer copy:** "Try this next." / "Ready to stretch this a little further?" / "A useful next practice may be…" (internally: progressive Developmental Application).
- **No partner-surveillance** prompts (§15).

---

## 8. Integration / return model (`UseReview`)

Structured choices + **minimal, bounded, purpose-specific free text** — never journaling (decision 5).

```ts
interface UseReview {            // authored object; internal state key: use_review_state
  id: string; version: number; playId: string;
  prompts: {
    didDifferently:     StructuredPrompt;   // bounded choices
    performedOperation: StructuredPrompt;   // yes / partly / no  (Technique Fidelity)
    becameClearer:      StructuredPrompt;   // bounded
    stuckWhere:         StructuredPrompt;   // bounded (evidence / acting / the feeling / …)
    stillFits:          "keep" | "update";  // reuses v0 Keep/Update — a tool-review signal, NOT Transfer
  };
}
```

- Collects only what supports **fidelity, behavioral transfer, updating the saved Play, and selecting the next focus.**
- Free text only where the **intervention itself** requires user-authored content (e.g., the WM "smallest true thing"). No asking users to recount relationship events in detail to personalize the system.
- **Keep/Update is logged as `tool_reviewed` + `tool_retained_or_updated`** — separate from `used_in_another_context` (adjudication 4). Reuses `recordOutput(..., keepState=true)` + the narrow `OutputEditor`.
- **Does not measure relationship outcome.** Correct use + remaining discomfort = still a success.

---

## 9. Technical component / schema changes

- **Content schema** (`lib/playbook/contentSchema.ts`, additive): add `LiteratureEntry`, `Simulation` (+ `SimNode`, `SimOption`, `CaptureField`), `Mission` (+ `MissionRung`), `UseReview`, `StatementMapping`, and an `InteractionKind` registry type. `PlaybookContent` gains `literature[]`, `simulations[]`, `missions[]`, `useReviews[]`, `statementMap[]`. **No `Track`.** `Play` keeps `screens[]`; its `literature` screen migrates to `LiteratureEntry`; `realWorldUse` graduates into `Mission`.
- **Interaction registry:** refactor `PlayContainer`'s `renderScreen` switch into a **component registry keyed by interaction kind**, consumed by the Play walker *and* the Simulation/Mission/UseReview walkers.
- **New views in `ExperienceShell`:** `understand`, `experience`, `practice`, `integrate`, and a Change-Path-driven home that **resumes** (§3). The v0 `opening → recognition → board → gate → play → myplays` machine is extended, not rewritten.
- **`lib/playbook/changePath.ts`** (new): pure `changePath(state) → { nextStep, surfaced[] }` implementing §4, fully unit-testable (incl. boundary tests: reading-not-progress, absence-not-inability, observation-not-trait, Keep/Update-not-Transfer).
- **Server-side event registry** (`lib/playbook/events.ts`, new): a **type-safe registry** defining allowed `object_type`, allowed `event_type`, a **payload schema per event**, and a `schema_version` — the single validated path that writes `playbook_events` (§10.2).
- **New pure reducers** (in the `progressActions.ts` style) for literature-read, simulation completion, mission state, and use-review signals — version-stamped, functional-only.
- **Process-state tagger** mapping signals → Exposure/Attempt/Technique-Fidelity/Transfer (§1), used by Change Path and the event writer.

---

## 10. Persistence & state objects (frozen decisions 2 & 3; adjudication 5)

Two stores, cleanly separated.

### 10.1 `playbook_progress` — current state / resume state (additive, **separated versioned state objects**, NOT one catch-all)
Extend with clearly separated, individually version-stamped jsonb objects:

```
literature_state    { version, … }   -- read-where-useful, saved
simulation_state    { version, … }   -- resume position, fidelity signals
practice_state      { version, … }   -- mission assignment + MissionState
use_review_state    { version, … }   -- last structured review + Keep/Update (NOT named integration_state)
change_path_state   { version, … }   -- current + prior application focus
```
Each object is designed so it can **later be extracted into a sibling table without changing product identity or IDs** if scale/query needs justify normalization. Existing `recognized / play_states / outputs / my_plays` are unchanged.

### 10.2 `playbook_events` — append-only, **server-written, schema-validated** longitudinal history (own normalized table)
Supports future **product-process analysis and research design without becoming surveillance** (see the §1.1 research boundary). **No arbitrary client insertion:** product actions call validated server/API logic which writes the event through the type-safe registry (§9). Store **only the minimum functional payload** — no unrestricted narratives, no partner-monitoring data, no raw sensitive disclosures.

```
id                uuid pk
user_id           uuid  -> auth.users on delete cascade
playbook_key      text        -- stable
playbook_version  integer
object_type       text        -- registry-constrained: 'literature'|'simulation'|'play'|'mission'|'use_review'
object_id         text
object_version    integer
event_type        text        -- registry-constrained: 'literature_opened'|'simulation_completed'|'operation_performed'|'mission_selected'|'mission_attempt_reported'|'use_reviewed'|'focus_changed'|…
schema_version    integer     -- event payload shape version (from the registry)
payload           jsonb        -- MINIMUM functional payload, validated against the per-event schema
created_at        timestamptz
```

- **Write path:** an authenticated API route validates `(object_type, event_type, payload)` against the registry, stamps `schema_version`, and inserts via the server/service-role client — mirroring the `/api/score` server-write posture. The client never inserts directly.
- **RLS:** own-row **select**; **no client insert/update/delete** policy (inserts are server-only; the table is append-only — never updated or deleted).
- Layer A still screens any bounded free text *before* an event is written; events carry metadata, not raw disclosures.

---

## 11. Reuse audit (grounded in the deployed code)

**Reused unchanged:** `playbook_progress` table + RLS + `unique(user_id, playbook_key)` (extended additively); `lib/playbook/keys.ts`; `lib/playbook/crisisSafety.ts` + Safety V2 (Layer A); entitlement/commerce (`ownsPlaybook`, `playbook_entitlements`, `/api/playbook/[key]/access`, `PlaybookCta`, RSC gating in `app/playbook/[key]/page.tsx`); `SortEngine.tsx` accessible tap-first mechanic; version-stamping (`StoredOutput`), `sanitize.ts`, `useProgress` autosave, `outputSummary.deriveUserLine`; **My Plays** (schema + UI) preserved.

**Generalized:** `PlayContainer` linear walker → interaction registry serving multiple walkers; `ExperienceShell` state machine → additional layer views + resuming Change-Path home; `Screen` union → intervention screens stay on `Play`, literature/real-world-use/use-review graduate into their own objects; recognition cards retained, now routable to literature (not only Plays) and feeding Change Path inputs.

**New:** `LiteratureEntry` (+ read-state), `Simulation` engine, `Mission` engine (+ progression + states), `UseReview`, `StatementMapping`, `changePath.ts`, server-side event registry, process-state tagger, interaction primitives (`evidenceTimeline`, `conclusionNarrowing`), `playbook_events` table. **`Track` is not introduced.**

---

## 12. What must change vs. must not

**Must change:** extract in-Play literature to `LiteratureEntry`; author Cluster-1 literature + the 101-statement map (content gate); add the Simulation layer *before* the Play; build the two signature interactions; add Missions (+ authored progression where supported); replace Keep/Update with the structured `UseReview`; add Change Path + the resuming home/IA; additive current-state objects + the server-written `playbook_events` table; add the Exposure→Attempt→Technique-Fidelity→Transfer process model throughout.

**Must NOT change:** the two Plays' *intervention logic*; the remaining **four Cluster-1 Plays are not authored/implemented here** (they still require approved Phase 5/5B design); Snapshot/scoring; the RLC framework; entitlement/commerce; stable `playbook_key`/`play_id`; RLS; no-LLM-runtime; no gamification.

---

## 13. Database migration (described — NOT written, NOT run)

Eventual migration, **owner-run only after explicit approval:**
1. `playbook_progress` (additive): add nullable jsonb `literature_state`, `simulation_state`, `practice_state`, `use_review_state`, `change_path_state`, each defaulting empty; no backfill; existing rows read as empty; compatible with deployed data.
2. `playbook_events` (new, append-only, **server-written**): the §10.2 shape; RLS own-row **select only** (no client insert/update/delete); inserts via the validated server route/service-role client; `notify pgrst`.
3. **No changes** to `playbook_entitlements`, `quiz_*`, or any Snapshot/scoring table.

No migration is written or run in this pass.

---

## 14. Accessibility implications
Tap-first, keyboard-operable, focus-managed, `role="status"` corrections preserved in the new primitives; **no drag-only** interactions; unfolding is **user-advanced/state-driven**, reduced-motion honored, reveals via `aria-live`; missions and use-reviews are labeled forms; the jsdom `axe` harness extends to every new component (serious/critical = 0); jsdom axe ≠ visual-contrast proof (checked separately); fully responsive/mobile.

---

## 15. Safety / privacy implications
Two-layer separation preserved: **Layer A (crisis)** stays the frozen, shared, metadata-only engine, extended to screen any bounded free text in simulations/missions/use-reviews; **Layer B (per-Play/Simulation/Mission signposts)** stays content-driven. **General self-worth language never becomes a crisis event.** Data minimization: functional product state, structured selects, version-stamped outputs, minimal **server-validated** event payloads — **never** unrestricted emotional narratives or partner-surveillance data. Mission design avoids partner-monitoring. Change Path stores only a small functional focus record, recomputable from state, never a psychological profile. **Attorney review outstanding; nothing represented as attorney-approved; Owner Risk Acceptance is the posture.**

---

## 16. Implementation sequence (build only after approval; each step its own gate; behind a feature flag)

0. **Approved architecture (this document).**
1. Schema/type layer + separated current-state objects + the **server-side event registry** + author the `playbook_events` migration (owner-run) + process-state tagger; flag-isolated.
2. Interaction registry refactor — proven by **behavioral and persistence parity** for the two current Plays (§18, item 8): same on-screen behavior and the **same persisted `playbook_progress` shape/values** for identical inputs; with the flag off, v0 is untouched.
3. Understand: literature objects + navigable field guide + the **101-statement content map** *(content gate)*.
4. Experience: Simulation engine + RD `evidenceTimeline` + WM `conclusionNarrowing` *(content gate)*.
5. Play: wire the two Plays to follow their simulation; extract literature.
6. Practice: Mission engine + RD/WM missions + authored progression where supported.
7. Integrate: structured `UseReview` replacing Keep/Update.
8. Change Path: orchestrator + resuming home/IA + boundary tests.
9. Full a11y + safety regression → owner walkthrough → **separate deploy decision**.

No production change and no deploy at any step without explicit owner approval.

---

## 17. Frozen decisions ledger (Rev 3.0)

1. **Decompose into five composable objects** (Understand→Experience→Play→Practice→Integrate) — **APPROVED.**
2. **Create `playbook_events` now** (append-only longitudinal history; progress = current/resume state; minimum functional payload; stable IDs + version stamps) — **APPROVED.**
3. **Additive current state as separated versioned state objects; events in their own normalized table; no catch-all JSONB; extractable to sibling tables later without changing identity/IDs** — **APPROVED.**
4. **Change Path inputs + observation-not-trait rule** — **APPROVED** (see §4, now with adjudication 3).
5. **Integration = structured choices + minimal bounded free text; not journaling** — **APPROVED.**
6. **Two signature interactions** (RD unfolding evidence timeline; WM expansion/contraction) — **APPROVED.**
7. **Literature scope model + formal 101-statement content map** (multi-function; phenomenological asset; ~5th-grade + adult tone) — **APPROVED.**
8. **Mission progression = progressive Developmental Application** (no levels/XP/streaks/ranks/badges/%; no mastery claim from completion) — **APPROVED.**
9. **IA / home** with Change Path *internal*; preserve returning-user state — **APPROVED (labels are copy candidates).**
10. **Deployment posture** — v0 intact; Rev 3 flag-isolated; no deploy / no new production migration without explicit approval; attorney review outstanding; Owner Risk Acceptance — **APPROVED.**

## 18. Adjudications ledger (Rev 3.1) — incorporated

1. **Process-state terminology revised** to **Exposure → Attempt → Technique Fidelity → Transfer** (no `Application`, no internal `Integration`). Consumer function `Integrate` retained; internal persistence uses `use_review_state`, process state uses `Transfer`. Developmental Application retains canonical meaning, interpreted only where evidence supports authentic-context enactment. — **§0, §1, throughout.**
2. **Simulation fidelity signal tightened** to `evidence_reconsidered` / `interpretation_revised_when_warranted`; the blanket `updated_interpretation` is removed; reversal/optimism/change-of-mind is not rewarded. — **§1, §6.1–6.4, §6.6.**
3. **Change Path claims tightened** — context-bound ("in this exercise…") replaces "that part is working"; cross-context evidence is *accumulating evidence of Transfer*, not proof of stable integration/mastery. — **§4.2, §4.5.**
4. **Keep/Update is not Transfer by itself** — tracked as `tool_reviewed` + `tool_retained_or_updated`, separate from `used_in_another_context`; `attempt`, `technique_fidelity`, tool-review, and cross-context use are distinct signals informing Change Path differently. — **§1, §4.1, §8.**
5. **`playbook_events` is server-written and schema-validated** via a type-safe registry (allowed `object_type`/`event_type`, per-event payload schema, `schema_version`); no arbitrary client insertion; minimal functional payloads. — **§9, §10.2, §13.**
6. **`Track` removed** under the parsimony rule (no unique function beyond `playId` mappings + the five-layer sequence + Change Path). — **§3.1, §9, §11.**
7. **Research boundary added** — telemetry supports product-process analysis / feasibility / hypothesis generation / research design, but is **not by itself RLC-validation evidence**; validation requires an appropriate protocol and study design. — **§1.1.**
8. **"Byte-parity" replaced** with **behavioral and persistence parity** — the goal is proving flag-gated Rev 3 does not alter deployed v0 outside the flag, not a brittle byte-level constraint. (Literal byte equality is required only if/where a specifically named serialized artifact demands it; none is named here.) — **§16 step 2.**

---

### Scope guardrails honored
Prototype is **Cluster 1 only**; the architecture is designed to *eventually* support the other Playbooks but does **not** generalize or implement all 27 clusters, and the remaining four Cluster-1 Plays are **not** authored here. No code, no migration, no production change, no deploy in this pass. Branch held local pending final architecture approval.
