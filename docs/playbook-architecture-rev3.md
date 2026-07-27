# Phase 7 — Relationship Playbook™ Product Architecture (Rev 3)

**Status:** FOR REVIEW — not approved, not implemented.
**Prototype cluster:** Cluster 1 "Difficulty Feeling Chosen" (consumer: *Moving Beyond Rejection*).
**Constraint:** the currently deployed two-Play Playbook is a *functioning first iteration*. This plan **evolves** it. It is not a rollback, not a wholesale replacement, and nothing here ships until explicitly approved.

> Nothing in this document is a change to Relationship Life Cycle™ theory. `UNDERSTAND → EXPERIENCE → PLAY → PRACTICE → INTEGRATE` and `Change Path` are **product-delivery concepts only**. The canonical framework is unchanged: **Phase → Developmental Task → Competencies → Developmental Application → Task Mastery.** The Playbook's job is to strengthen **Developmental Application** for the specific problem a cluster represents.

---

## 0. The core architectural move

The deployed model is **Play-centric and linear.** Everything — literature, the sort exercise, the own-turn, the rule builder, the real-world-use note — is a `Screen` inside one `Play.screens[]`, walked in order by `PlayContainer`. Literature is a screen kind. Real-world use is a screen kind. Integration is a one-off "Keep / Update" dialog. There is no simulation-over-time, no mission object, and no orchestration.

Rev 3 **decomposes the monolithic Play into five composable layer-objects bound by an orchestrator**, while keeping the Play's intervention core (the part that already works) reusable:

| Layer | New content object | What it is | Replaces / extends today |
|---|---|---|---|
| **UNDERSTAND** | `LiteratureEntry` (scopes: cluster / play / jit) | Navigable, optional field-guide entries | the single `literature` screen kind |
| **EXPERIENCE** | `Simulation` (deterministic scenario tree) | Unfolding moment → interpretation → evidence → decision → teach | the single static `scenarioSort` screen |
| **PLAY** | `Play` (largely as-is) | The mechanism-specific intervention | reused; literature extracted; can follow a Simulation |
| **PRACTICE** | `Mission` (+ progression ladder) | A behaviorally-specific real-world assignment | the `realWorldUse` screen + "I used this" flag |
| **INTEGRATE** | `IntegrationReview` | A structured functional return | the "How did it go / Keep / Update" dialog |
| *(orchestration)* | `Change Path` | Pure function over functional state → next-useful surface | the board's "recognition surfaces, never locks" logic |

A cluster's content becomes a **set of authored objects across these layers**, each addressed by a stable id and git-versioned — exactly the authoring discipline the current `Play` already uses. The universal engine reads the interfaces; per-cluster content is authored into them. No LLM at runtime.

---

## 1. Revised consumer experience — entry through integration

The five layers are **composable, not a forced funnel.** The user is never marched through them linearly; Change Path surfaces the *next useful* node, literature is always optional, and "Explore another area" is always present (the existing non-locking guarantee, generalized).

Walked end-to-end for **Read It, Then Decide** (the prototype):

1. **UNDERSTAND** *(optional, anytime).* Cluster literature — "what Difficulty Feeling Chosen actually is," "wanting to be chosen vs. using selection as evidence of worth," "seeing relational evidence vs. acting on what you know." Play literature — "why dating uncertainty is hard, and what uncertainty can and can't tell you" — is surfaced near the Play but never gates it.
2. **EXPERIENCE.** The RD simulation *unfolds over time*: strong first date → "they want to see you again" → texts get shorter → **capture** ("what do you think the change means?" / "what are you tempted to do?") → **reveal** additional evidence (they message to set a concrete plan for next week) → **update** your interpretation → **teach** ("that gap between your first read and the new evidence is exactly the operation this Play trains"). No outcome is predicted; no branch is the "correct relationship answer."
3. **PLAY.** The RD intervention (saw-it / guessing / don't-know-yet + a decision rule) — now framed as *"here is the operation you just felt,"* flowing naturally from the simulation instead of appearing as a standalone worksheet.
4. **PRACTICE.** A real-world mission bound to the operation: *"On your next date, name what you're learning about the other person before you evaluate your own performance,"* or *"When ambiguity shows up, write what you actually know before deciding what it means."*
5. **INTEGRATE.** On return: did you separate what you saw from what you guessed? What became clearer? Where did you still get stuck? Does your saved Play still fit? → Change Path updates the focus: *"You can name the evidence now — acting on what you know still seems to be the harder part,"* and surfaces a decision-under-ambiguity mission rather than telling you to repeat the same Play.

**What It Actually Means** runs the same spine with a different signature (see §6): the simulation shows a single event *expanding* into global conclusions, and the intervention narrows it back to what the evidence establishes.

---

## 2. Information architecture — the Cluster 1 Playbook home

Reconsidered around the richer product. Labels are **architecture concepts, not final copy.**

- **Understand This Pattern** — the field guide (cluster + play + surfaced JIT literature). Navigable, optional.
- **Where You Might Start** — recognition-based suggestions (today's board), now also fed by Change Path.
- **Experience / Practice** — the relevant simulations and Plays for the current focus.
- **What I'm Practicing** — the current real-world mission and its state.
- **My Change Path** — the current application focus / next growth edge. **No scores, no %, no levels.** One plain-language functional line.
- **My Plays** — portable saved tools (preserved exactly as today).
- **Explore Another Area** — always available; the user is never hard-locked into one inferred pathway.

This is a **hub**, not a course outline. The home renders what Change Path surfaces; every section is reachable directly.

---

## 3. How the five layers work together

The binding object is a **`Track`**: an *authored* association of `{ optional literature, a simulation, a play, a mission, an integration review }` around **one intervention operation**. A Track is a suggested ordering, **not a lock** — Change Path may enter at any node, skip literature, or jump straight to the Play.

```
        ┌──────────── Change Path (orchestrator, non-locking) ───────────┐
        │                                                                │
UNDERSTAND ──▶ EXPERIENCE ──▶ PLAY ──▶ PRACTICE ──▶ INTEGRATE ──▶ (loops back to
 literature     simulation   interv.   mission      review          Change Path)
 (optional)    (deterministic)         (real world) (functional)
```

- **UNDERSTAND feeds everything:** cluster literature stands alone; play literature supports a Play; JIT literature is surfaced *after* a specific simulation beat, decision, real-world use, or stuck point.
- **EXPERIENCE precedes PLAY** so the user *feels the mechanism before being taught it.*
- **PLAY follows naturally from EXPERIENCE** rather than reading as a worksheet.
- **PRACTICE turns the Play into real-world Developmental Application.**
- **INTEGRATE closes the loop functionally** and hands structured signals to **Change Path**, which decides the next useful node.

---

## 4. Change Path — decision logic and inferential boundaries

**What it is:** a pure, deterministic, product-level function. Input = the user's *functional interaction state*. Output = a prioritized surface of next-useful experiences + a single plain-language "current focus" line. It is recomputable from state; it stores no psychological profile.

**What it is NOT** (restating the boundaries): not a clinical treatment plan, not a diagnosis, not a new assessment, not a completion percentage, not a gamified level system, not an AI-generated formulation.

### 4.1 Legitimate inputs (the only ones)
- recognized card ids;
- literature entries opened **where meaningful** (e.g., a JIT entry surfaced at a stuck point);
- play states: `explored | in_my_plays | used`;
- mission states: `assigned | attempted | reviewed | advanced`;
- **structured** integration answers — bounded selects such as *"performed the operation? yes / partly / no"* and *"hardest part? evidence / acting on it / the feeling"* — **not** free-text emotional narrative;
- output presence and Keep-vs-Update signals.

### 4.2 The inference rule
Change Path may state a **functional observation about the interaction**, never a trait attribution about the person.

- ✅ *"You appear able to identify the evidence now, but acting on what you know still seems hard — here's a decision-under-ambiguity mission."*
- ❌ *"You have an anxious attachment style"* / *"You fear abandonment."*

### 4.3 Absence is not evidence
Not-yet-done ≠ can't-do. Absence surfaces an **invitation**, never a verdict. The user never has to complete every Play; Change Path recommends, it does not require.

### 4.4 Success definition (unchanged)
Intervention success = **reduced Functional Interference + stronger Developmental Application.** It is *never* measured by whether the relationship produced the desired outcome. Emotional discomfort may persist even when the operation was performed correctly — Change Path treats that as a success signal, not a failure.

---

## 5. Content model — literature (UNDERSTAND)

First-class, navigable content objects (not a screen kind). Git-versioned TS, authored like `Play`.

```ts
type LiteratureScope = "cluster" | "play" | "jit";

interface LiteratureEntry {
  id: string;                     // stable
  version: number;                // R2 versioning
  scope: LiteratureScope;
  title: string;                  // often the lived-experience question, e.g. "Why do I always feel like the backup option?"
  body: LiteratureBlock[];        // short field-guide prose blocks (authored at the ~5th-grade target, per PR #68)
  playId?: string;                // scope="play": which intervention it supports
  anchor?: string;                // scope="jit": what surfaces it (a simulation beat, decision, real-world-use, or difficulty tag)
  related?: string[];             // ids of related entries — navigable, non-sequential
}
```

- **Three levels:** *cluster* (the overall problem), *play* (education directly supporting an intervention), *jit* (short, surfaced after a specific moment/decision/use/difficulty).
- **The 101 statements become source material**, not 101 interventions. Each maps to recognition / education / normalization / contextualization — most resolve as `jit` or `cluster` entries ("Why does nobody choose me?", "What if I'm just not enough?", "Why do I keep caring more?"). Authoring which statements become literature vs. feed a Play is a **content task with its own review gate.**
- **Optional and navigable**, never required sequential reading. Read-state is stored **only where useful** (e.g., "you've read this" to avoid re-surfacing a JIT entry) — not as progress-tracking or a completion metric.
- **Boundary:** more literature does **not** turn the Playbook into the Academy. Every entry earns its place by helping the user understand/change *this cluster.*

---

## 6. Authored simulation model (EXPERIENCE)

Deterministic scenario trees. **No LLM at runtime.** The point is experiential rehearsal of Discernment — not gamification, not outcome prediction.

```ts
interface Simulation {
  id: string;
  version: number;
  simulationSchemaVersion: number;
  playId: string;                 // the Play this rehearses
  signature: InteractionKind;     // e.g. "evidenceTimeline" | "conclusionNarrowing"
  nodes: SimNode[];               // ordered, deterministic
}

type SimNode =
  | { kind: "moment"; body: string[] }                    // something happens (unfolds over time)
  | { kind: "capture"; prompt: string; field: CaptureField } // interpretation / temptation ("what do you think it means?")
  | { kind: "reveal"; body: string[] }                    // new relational evidence appears
  | { kind: "decision"; prompt: string; branches: Branch[] } // a choice point
  | { kind: "update"; prompt: string }                    // re-interpret given the new evidence
  | { kind: "teach"; body: string[]; toPlayId: string };  // hand off into the Play

interface Branch {
  id: string;
  label: string;                  // a plausible choice — never "the correct one"
  feedback: string[];             // EDUCATIONAL feedback, mechanism-focused
  // NO outcome field. Branches must not encode a "right relationship answer."
}
```

**Rules the model enforces by shape:**
- Scenarios **unfold**: moment → interpretation → new evidence → decision → more evidence → reflection/teaching. Not "completed scenario then quiz."
- Different choices may surface **different educational feedback**, but the engine offers **no simplistic correct-answer branch** and predicts no relationship outcome.
- Reveals are **state-driven and user-advanced**, never timed/animated (accessibility, §13).

### 6.1 Signature interactions (Plays should not all look the same)
Add an **interaction primitive registry** (the generalization of today's `renderScreen` switch). A Play/Simulation declares its interaction kind; the engine renders the matching component:

- **`evidenceTimeline`** — RD signature. Unfolding moments on a timeline; interpretation captured at each beat; evidence revealed; interpretation updatable.
- **`conclusionNarrowing`** — WM signature. An event visually *expands* into unsupported global conclusions; the user narrows it back to what the evidence establishes. (Reuses `SortEngine`'s accessible tap-first assignment mechanic underneath, presented as expand→narrow rather than two static buckets.)
- **Reused as-is:** `scenarioSort`, `ruleBuilder`, `sentenceBuilder`, `ownTurn`, `sufficiency`, `emotionBeat`.
- **Future placeholders (NOT built here):** `communicationRehearsal` (authentic-presentation work), `investmentView` (over-investment work).

The universal engine supports these differences through the registry **without** forcing every Play into the same form.

---

## 7. Practice / mission model (PRACTICE)

Repeating a Play in-app is not behavior change. Missions carry the operation into the real world.

```ts
interface Mission {
  id: string;
  version: number;
  playId: string;                 // the operation it exercises
  instruction: string;            // behaviorally specific
  linkToOperation: string;        // explicit tie to the intervention
  suitability?: string;           // safety/appropriateness boundary where needed
  ladder?: MissionRung[];         // progressive Developmental Application (NOT consumer "levels")
}

interface MissionRung { id: string; instruction: string; }  // e.g. preference → opinion → small need → reasonable boundary

type MissionState = "assigned" | "attempted" | "reviewed" | "advanced";
```

**Constraints enforced by design:**
- Behaviorally specific; explicit relationship to the underlying intervention.
- **No arbitrary streaks or completion quotas.** No prescribing relationship outcomes.
- Appropriate for self-guided use; includes safety/suitability boundaries where needed.
- **Progression = progressive Developmental Application**, surfaced only when the intervention supports it (e.g., authentic presentation: preference → opinion → small need → reasonable boundary). It is **not** a gamified level system and is never shown as "Level 2."
- Mission design must **avoid prompting partner surveillance** (privacy, §14).

---

## 8. Integration / return model (INTEGRATE)

Expands the current "How did it go? / Keep / Update" dialog into a genuine — but **functional, not journaling** — loop.

```ts
interface IntegrationReview {
  id: string;
  version: number;
  playId: string;
  prompts: {
    didDifferently: StructuredPrompt;   // what did I actually do differently?
    performedOperation: StructuredPrompt;// did I perform the operation as intended? (yes/partly/no)
    becameClearer: StructuredPrompt;    // what became clearer?
    stuckWhere: StructuredPrompt;       // where did I still get stuck? (bounded options)
    stillFits: "keep" | "update";       // does my saved Play still fit? (reuses today's Keep/Update)
  };
  // Output: structured functional signals → Change Path. Minimal free text (§14).
}
```

- Answers the six questions the owner specified, but through **structured selects** wherever possible so signals are legitimate Change-Path inputs and we store less sensitive data.
- **Does not measure relationship outcome.** Reinforces: skill used correctly + discomfort remaining = still a success.
- The **Keep / Update** branch is preserved and folded in (reuses `recordOutput(..., keepState=true)` and the narrow `OutputEditor`).

---

## 9. Technical component / schema changes

### 9.1 Content schema (git-versioned TS, additive)
Add to `lib/playbook/contentSchema.ts`: `LiteratureEntry`, `Simulation` (+ `SimNode`, `Branch`), `Mission` (+ `MissionRung`), `IntegrationReview`, `Track`, and an `InteractionKind` registry type. `PlaybookContent` gains `literature[]`, `simulations[]`, `missions[]`, `integrationReviews[]`, `tracks[]`. `Play` keeps its `screens[]` core; its embedded `literature` screen migrates out to `LiteratureEntry`, and `realWorldUse` graduates into `Mission`.

### 9.2 Engine
- **Interaction registry:** refactor `PlayContainer`'s `renderScreen` switch into a **component registry keyed by interaction kind**, consumed by the Play walker *and* the new Simulation/Mission/Integration walkers. No behavior change for the two existing Plays (regression-tested).
- **New views in `ExperienceShell`:** `understand` (field guide), `experience` (simulation), `practice` (mission), `integrate` (review), plus a Change-Path-driven home. The `opening → recognition → board → gate → play → myplays` machine is extended, not rewritten.
- **`lib/playbook/changePath.ts`** (new): pure function `changePath(state) → { focusLine, surfaced[] }`, with the §4 inputs and boundaries, fully unit-testable.
- **New pure reducers** in the `progressActions.ts` style for literature-read, mission state, and integration signals — version-stamped, functional-only.

### 9.3 Persistence (see §12 for the migration)
- **Current-state:** extend `playbook_progress` **additively** with jsonb columns `literature_state`, `missions`, `integration`, `change_path_focus`. Preserves the proven single-row, `unique(user_id, playbook_key)`, RLS-own-row, current-state-only model and stays migration-compatible.
- **History:** finally create the **designed-but-deferred append-only `playbook_events`** (R3) — Practice and Integrate genuinely need an event history (missions attempted over time, reviews over time) that current-state jsonb can't represent. Metadata-only, RLS own-row, no raw emotional text.

### 9.4 Safety
- **Layer A (crisis)** — `lib/playbook/crisisSafety.ts` over the frozen Safety V2 engine — **unchanged**, and extended to screen any free-text capture in simulations/missions/integration. Still metadata-only; still non-blocking.
- **Layer B (Play-specific signposts)** generalizes to per-Simulation and per-Mission signposts (e.g., a boundary-themed mission surfaces suitability guidance).

---

## 10. What can be reused from the deployed implementation

**Reused unchanged**
- `playbook_progress` table, RLS policies, `unique(user_id, playbook_key)` (extended additively).
- `lib/playbook/keys.ts` — `playbook_key ↔ cluster_id`, `INTERACTIVE_PLAYBOOK_KEYS`.
- `lib/playbook/crisisSafety.ts` + Safety V2 engine (Layer A).
- Entitlement/commerce: `ownsPlaybook`, `playbook_entitlements`, `/api/playbook/[key]/access`, `PlaybookCta`, RSC gating in `app/playbook/[key]/page.tsx`.
- `SortEngine.tsx` accessible tap-first assignment (drives `scenarioSort` and, underneath, `conclusionNarrowing`).
- Version-stamping discipline (`StoredOutput`), `sanitize.ts` (server-authoritative key/version), `useProgress` autosave, `outputSummary.deriveUserLine`.
- **My Plays** — preserved exactly (schema and UI).

**Generalized**
- `PlayContainer` linear walker → interaction registry serving multiple walkers.
- `ExperienceShell` state machine → additional layer views + Change-Path home; the "recognition surfaces, never locks" logic becomes the Change Path surface.
- `Screen` union → intervention screens stay on `Play`; literature/real-world-use/integration graduate into their own objects.
- Recognition cards → retained, now also routable to **literature** (recognition/education/normalization), matching "not every statement becomes an intervention," and feeding Change Path inputs.

**New**
- `LiteratureEntry` (+ optional read-state), `Simulation` engine, `Mission` engine (+ ladder + states), `IntegrationReview`, `Track`, `changePath.ts`, interaction primitives (`evidenceTimeline`, `conclusionNarrowing`), `playbook_events` (eventual).

---

## 11. What must change

- Extract in-Play literature into first-class, navigable `LiteratureEntry` objects.
- Author cluster/play/JIT literature for Cluster 1 from the 101 statements (content task, own review gate; authored at the ~5th-grade target of PR #68).
- Introduce the Simulation layer *before* the Play so the mechanism is felt before taught.
- Add the two signature interactions so RD ≠ WM visually.
- Add Missions (with the two existing Plays' real-world operations) + progression where supported.
- Replace the Keep/Update dialog with the structured `IntegrationReview`.
- Add the Change Path orchestrator + the new home/IA.
- Additive persistence changes + the `playbook_events` table.

**Explicitly NOT changing:** the two Plays' *intervention logic*; the remaining four Cluster-1 Plays are **not** authored/implemented here (they still need their approved Phase 5/5B design); Snapshot/scoring; the RLC framework; entitlement/commerce; stable `playbook_key`/`play_id`; RLS; no-LLM-runtime; no-gamification.

---

## 12. Database migration (described — NOT written, NOT run)

Eventual migration (owner-run when we reach that build step):

1. **`playbook_progress` (additive):** add nullable jsonb columns `literature_state`, `missions`, `integration`, `change_path_focus`, each `default '{}'`/`'[]'`. No backfill; existing rows read as empty. Fully compatible with deployed data.
2. **`playbook_events` (new, append-only):** `id`, `user_id → auth.users on delete cascade`, `playbook_key text`, `event_type text` (e.g. `mission_attempted`, `integration_reviewed`, `literature_opened`), `play_id text null`, `ref_id text null` (mission/simulation/entry id), `payload jsonb` (**functional metadata only**), `created_at timestamptz`. RLS own-row select/insert; **no update/delete** (append-only). `notify pgrst`.
3. **No changes** to `playbook_entitlements`, `quiz_*`, or any Snapshot/scoring table.

I will **not** write or run this until the architecture is approved and we reach that step.

---

## 13. Accessibility implications

- New interaction primitives (`evidenceTimeline`, `conclusionNarrowing`) must preserve SortEngine's **tap-first, keyboard-operable, focus-managed, `role="status"` correction** pattern. No drag-only interactions.
- Simulation "unfolding over time" is **state-driven and user-advanced** — never timed or animation-dependent; reduced-motion honored (the existing `matchMedia`/`setReducedMotion` handling extends). Reveals use `aria-live` for screen-reader order.
- Missions and integration reviews are forms → same labeled-field discipline; the existing `axe` jsdom harness extends to every new component (serious/critical = 0).
- The documented jsdom color-contrast limitation still stands: jsdom axe is **not** proof of visual contrast; visual contrast is checked separately.
- Fully responsive/mobile (the experience is a PWA-style consumer flow).

---

## 14. Safety / privacy implications

- **Two-layer separation preserved.** Layer A (crisis) stays the shared, frozen, metadata-only engine; Layer B (Play/Simulation/Mission signposts) stays content-driven. **General self-worth language ("I'm not enough") must not become a crisis event** — Safety V2 already distinguishes; keep that boundary.
- **Data minimization.** Store functional product state — states, structured selects, version-stamped outputs, event metadata — **not** unrestricted emotional narratives and **not** partner-surveillance data. Integration favors structured selects over free text precisely to store less and infer legitimately.
- **Mission design** must avoid prompting partner monitoring or evidence-collection-about-a-partner.
- **Change Path** stores only a small functional "focus" record, recomputable from state; it is never a stored psychological profile.
- **Standing item (owner-owed):** attorney review of the Playbook/Companion remains **NOT performed**; this evolution does not change that status and should not ship without the owner's explicit risk decision.

---

## 15. Implementation sequence (proposed — build only after approval, each step its own gate)

0. **Approve this architecture.**
1. **Schema/type layer** — add content types + versioning; extend `PlaybookProgress` additively; author the `playbook_events` migration (owner-run); stage behind the existing playbook flag.
2. **Interaction registry** — refactor `PlayContainer` → registry; **regression-test the two current Plays to byte-parity behavior.**
3. **UNDERSTAND** — literature objects + navigable field-guide IA; migrate in-Play literature; author Cluster-1 literature from the 101 statements *(content review gate)*.
4. **EXPERIENCE** — Simulation engine + RD `evidenceTimeline` + WM `conclusionNarrowing` *(content review gate)*.
5. **PLAY** — wire the two Plays to follow their simulation; extract their literature.
6. **PRACTICE** — Mission engine + RD/WM missions + ladders; mission states.
7. **INTEGRATE** — `IntegrationReview` replacing/extending Keep/Update; structured signals.
8. **CHANGE PATH** — orchestrator + home/IA + inferential-boundary tests.
9. **Full a11y + safety regression → owner walkthrough → separate deploy decision.**

No production change and no deploy at any step without explicit approval.

---

## 16. Decisions requiring owner approval before any coding

1. **Decompose `Play` into five layer-objects + `Track` binding** (vs. keep Play-centric and bolt features on). — *Recommend: decompose.*
2. **Create `playbook_events` now** (append-only functional history) vs. stay current-state-only. — *Recommend: create; Practice/Integrate need history; metadata-only.*
3. **Extend `playbook_progress` with additive jsonb columns** vs. sibling tables for the new current-state. — *Recommend: additive columns.*
4. **Change Path inferential boundary** — approve the exact allowed inputs (§4.1), the "functional observation, never trait" output rule (§4.2), absence-is-not-evidence (§4.3), and the hard exclusions.
5. **Integration = structured selects, minimal free text** (privacy-first) vs. richer free-text review. — *Recommend: structured.*
6. **Build the two signature interactions now** (`evidenceTimeline`, `conclusionNarrowing`) — only for the two shipped Plays. — *Recommend: yes.*
7. **Literature scope model** (cluster / play / jit) and mapping the 101 statements to recognition/education/normalization (not all → interventions). — *Recommend: approve; authoring is a separate content gate.*
8. **Mission progression = progressive Developmental Application** (not levels); approve the no-streaks / no-quotas / outcome-neutral constraints + suitability boundaries.
9. **IA / home** around Understand · Where You Might Start · Experience/Practice · What I'm Practicing · My Change Path · My Plays · Explore Another Area (copy TBD). — *Recommend: approve as architecture.*
10. **Deployment posture** — build behind the existing playbook flag; **do not deploy** until a later explicit approval; attorney review still outstanding.

---

### Scope guardrails honored
Prototype is **Cluster 1 only**; the architecture is designed to *eventually* support the other Playbooks but does **not** generalize or implement all 27 clusters. The remaining four Cluster-1 Plays are **not** authored here. No code, no migration, no production change, no deploy in this pass.
