# Cluster 4 — Implementation Input Contract

**What this is.** The exact deliverable Claude Code needs to implement Cluster 4 from the 29 Jul content
write-up. Every item is keyed to a real schema type in `lib/playbook/contentSchema.ts` and the validator in
`lib/playbook/contentValidate.ts`. The content write-up supplies most of the *prose*; this contract lists the
**structured fields + stable IDs** still required so the module validates and runs behind `PLAYBOOK_REV3_ENABLED`.
**Nothing here is built yet; this is the spec, not code.**

Deliver as **one authored content module** (`content/playbook/<c4-key>.ts`) shaped like `PlaybookContent`, plus
its literature/simulations companion files. Format: the same object model as Cluster 1
(`content/playbook/finding-love-that-feels-mutual*.ts`).

---

## 0. BLOCKING DECISION (answer first — it changes the rest)

**Is Cluster 4 Plays-only, or Plays + the three Experiences?**
- **Plays-only** → skip §7 entirely. Recognition routes straight to Plays (as the write-up already does). No
  `exposureLoad`, no engine change. Fastest path; the write-up fully supports it.
- **Plays + Experiences** → §7 is required: three `Simulation` graphs. Two reuse existing signatures
  (`conclusionNarrowing`, `evidenceTimeline`); the third (`sim-c4-load`) needs either the new `exposureLoad`
  signature (engine change, gated behind Cluster 1 Phase B) or is dropped. **This is Call #2 from the
  reconciliation note.**

Everything in §1–§6 is required either way.

---

## 1. Top-level `PlaybookContent`
| Field | Value needed |
|---|---|
| `playbookKey` | marketing slug (e.g. `belonging-in-dating`) — **confirm the canonical slug** |
| `playbookVersion` | `1` |
| `displayName` | consumer name (write-up: "Learning to Date Without Losing Hope") |
| `opening` | `{ title, body: string[] }` — the entry screen. Write-up "What this actually is" is the likely source; **confirm which text is `opening` vs a literature Core Guide** |
| `recognitionCards` | §2 |
| `plays` | §3 |
| `literature?` | §4 |
| `missions?` | §5 |
| `useReviews?` | §6 |
| `simulations?` | §7 (only if the §0 decision is Plays+Experiences) |

---

## 2. `recognitionCards[]` — 4 cards (write-up Part Two)
Each: `{ id, role, pathwayPlayId, headline, explanation?, secondaryExamples?, validationCopy? }`.
Validator: `role:"route"` **must** have `pathwayPlayId`; `role:"validate"|"signpost"` **must not** route; `headline` required.

| id | role | pathwayPlayId | headline (from write-up) |
|---|---|---|---|
| `rec-not-imagining-it` | `validate` | `null` | "This is exhausting and I'm tired of pretending it isn't." + `validationCopy` |
| `rec-pattern-vs-person` | `route` | `them-or-the-pattern` | "I already know how it's going to go before it starts." |
| `rec-who-is-serious` | `route` | `whos-actually-here` | "I can't tell who's actually interested…" |
| `rec-too-many-open` | `route` | `how-many-at-once` | "Everyone's started to blur together." |

---

## 3. `plays[]` — 3 Plays. Each MUST supply every field below (validator-enforced)
Required per Play: `playId, playVersion:1, outputSchemaVersion:1, name, positioning, recognitionGate.prompt,
screens[] (≥1, exactly one of kind "output"), portable[] (≥1), myPlaysTemplate{when,move,lookingFor,watchOut,
remember} (all 5), fidelity{correct, misuse[≥1], notMeaning}`. Optional: `supportSignposts[]`, `routing`,
`outputEditor`.

**Screen kinds available** (use only these): `shift · learn · scenarioSort · ownTurn · sufficiency ·
ruleBuilder · sentenceBuilder · emotionBeat · output · portable · realWorldUse · literature`.
⚠️ `ownTurn` fields are `input:"text"|"chips"` only — **no number type**; the "how many" counts are `text`.

### 3a. `them-or-the-pattern` — "Them, or the Pattern?"
- `positioning`: "For when you've already decided how someone goes before they've done anything."
- `recognitionGate.prompt`: "Have you found yourself sure how someone will behave before they've shown you?"
- Screens: `shift` → `learn` → **`scenarioSort`** (2 buckets: "A read about people in general" / "Something this
  person did"; 6 items — supply `item.id` + `correctBucket` + one `correction` each) → **`ownTurn`** (2 `text`
  fields: general-read, actual-facts) → **`sufficiency`** (map the 3-way to the schema fields:
  `prompt, enoughLabel, needMoreLabel, needMoreIntro?, needToKnowLabel, observableLabel`) → **`output`**
  (`heading`, optional `body`).
- `supportSignposts`: `[{ id:"signpost-generalised-hopelessness", heading, body }]` (write-up copy).
- `fidelity`: correct/misuse[]/notMeaning — all present in write-up "Fidelity boundaries".

### 3b. `whos-actually-here` — "Who's Actually Here"
- `positioning`: "For when you can't tell who's serious."
- Screens: `shift` → `learn` → **`scenarioSort`** (buckets Warmth / Effort; 6 items + corrections) →
  **`ruleBuilder`** (`conditionLabel, thenLabel, actions[], controlCheck` — write-up gives "what I'll treat as
  evidence" = actions, "what I'll do if not seeing it" = the then/control) → **`output`**.
- `supportSignposts`: `[{ id:"signpost-self-worth", … }]`.

### 3c. `how-many-at-once` — "How Many at Once"
- `positioning`: "For when everyone starts to blur."
- Screens: `shift` → `learn` → **`ownTurn`** (2 `text` count fields) → **`sufficiency`** (4-option "how many can
  you read" → map to schema fields) → **`ruleBuilder`** (limit + "when I hit it, I'll…" actions) → **`output`**.
- `supportSignposts`: `[{ id:"signpost-generalised-hopelessness", … }]`.
- **Note:** authored entirely on existing screen primitives → needs **no** `exposureLoad` signature. (The new
  signature is only for the optional §7 Experience.)

**Net-new authoring these 3 Plays need that the write-up does NOT yet give explicitly:**
1. `portable[]` — the take-away reminder lines per Play (validator requires ≥1; write-up has no "portable" block).
2. `myPlaysTemplate` 5 fields (`when/move/lookingFor/watchOut/remember`) — the saved-card summary, distinct from
   the `output` screen payload. Derive from the Output fields but must be authored as the 5 named fields.
3. `scenarioSort` `item.id`s + per-item `correction` strings.
4. `sufficiency` exact label fields (the schema shape is fixed; the write-up's free phrasing must be mapped).

---

## 4. `literature[]` — Field Guide (write-up Part One)
Each: `{ id, version:1, scope, depth?, title, body: LiteratureBlock[], playId?, anchor?, related? }`.
`LiteratureBlock` kinds: `paragraph{heading?,body[]} · distinction{label,body[]} · list{label?,items[]} ·
example{body[]} · guardrail{body[]}`.

- **9 Core Guides** → `scope:"cluster", depth:"core"`: What this actually is · You're not imagining it · The
  average isn't the person in front of you · Why people vanish · What serious actually looks like · It's designed
  this way · Why volume makes you harsher · How people actually meet now · Stopping is a decision, not a failure.
- **3 Question Reads** → `scope:"cluster", depth:"question"`: Is it me, or is it this? · Why does it look so
  different for other people? · Are the apps still worth it?
- **Net-new needed:** a stable `id` per entry (`lit-c4-*`); the prose **structured into `body` blocks** (it's
  currently flat prose); `related[]` cross-links; and the **statistics citation pass + review date** (Open Item 4)
  — every stat-bearing entry needs its source attached before publish.

---

## 5. `missions[]` — 3 (write-up Part Four), one per Play
Each: `{ id, version:1, playId, title, instruction, linkToOperation, attemptMeaning?, suitability?,
progression?: [{id, instruction}] }`. Write-up supplies title, instruction, `attemptMeaning` ("What trying it
means"), `suitability` ("When it doesn't fit"), `progression` ("Next stretch"). **Net-new:** `id` (`mission-c4-*`)
and `linkToOperation` (one short phrase naming the operation each mission rehearses).

---

## 6. `useReviews[]` — 3 (write-up Part Five), one per Play
Each: `{ id, version:1, playId, didDifferently, performedOperation, becameClearer, stuckWhere }`, where each is a
`StructuredPrompt {label, options[], multi?}`. Mapping from the write-up:
- `didDifferently` → "What did you do differently?" (`multi:true`)
- `performedOperation` → the "Did you…?" line → options must reduce to **yes / partly / no** ("Pretty closely /
  Some of it / Not really this time")
- `becameClearer` → "What got clearer?" (`multi:true`)
- `stuckWhere` → "Where did you get stuck?" (single-select — its option becomes the Change-Path `stuck` signal)
- The optional "Anything else?" free-text reuses the existing per-entry `experience` field (already built).
**Net-new:** `id` (`review-c4-*`) and confirming each `stuckWhere` option string, because §8 routing keys off it.

---

## 7. `simulations[]` — ONLY if §0 = Plays+Experiences
Each `Simulation`: `{ id, version:1, simulationSchemaVersion:1, playId, signature, startNodeId, nodes: SimNode[] }`.
Graph rules (validated): connected from `startNodeId`, no cycles, no unreachable nodes, **every terminal is a
`teach` handoff** with `toPlayId` = the matching Play. `SimNode` kinds: `moment · note · capture · decision ·
reveal · reconsider · teach`.

| sim id | playId | signature | notes |
|---|---|---|---|
| `sim-c4-pattern-check` | `them-or-the-pattern` | `conclusionNarrowing` (reuse) | fidelity from `reconsider` (existing) |
| `sim-c4-signal-sort` | `whos-actually-here` | `evidenceTimeline` (reuse) | fidelity from `reconsider` (existing) |
| `sim-c4-load` | `how-many-at-once` | **`exposureLoad` (NEW)** or DROP | needs Cluster 1 Phase B + the new signature; else omit |

If any sim is authored, also supply its **JIT literature** entries (`scope:"jit"`, ids `lit-jit-c4-*`) and set the
sim nodes' `jitLiteratureId`. Reused-signature fidelity is inherited; **do not invent new fidelity names** for the
two reused sims.

---

## 8. Change Path routing (write-up Part Six)
Change Path is orchestration (`lib/playbook/changePath.ts`) driven by Play state + the `useReviews.stuckWhere`
signal, surfacing one item at a time. Deliver as a **routing table**: `(state | stuck-signal) → surfaced item +
authored copy`, preserving the write-up's rules — especially **"I held it and felt worse" → surfaces "Stopping is
a decision" and MUST NOT route back to a tool**, and the "no fault / no opportunity" terminal. This is partly code
(the selection logic) + partly authored strings (the copy column). Provide the table; Claude Code wires it.

---

## 9. IDs & versions — conventions
- All `*Version` / `*SchemaVersion` = `1`. All ids stable, kebab-case, `c4`-scoped where cluster-specific
  (`lit-c4-*`, `mission-c4-*`, `review-c4-*`, `sim-c4-*`, `lit-jit-c4-*`). Play/recognition/signpost ids as in
  §2–§3. **IDs are do-not-revert once shipped** (DECISION-LOG discipline).

## 10. Still gated (not Claude Code's to resolve)
The write-up's **6 Open Items = the pending owner decisions**: safety-copy clinical review (yours), gender
branching, the `STM-0290` "how to stand out" boundary, claim-scope, stats citations, reading level — plus the
Part B ratification reconciliation and the §0 architecture decision. Implementation can begin on the
non-gated objects (recognition, the 3 Plays, missions, reviews) once §0 and the IDs land; the gated items block
publish, not scaffolding.

*Schema verified against `lib/playbook/contentSchema.ts` + `contentValidate.ts`, 2026-07-29. No code, content,
or canon modified by this contract.*
