# 03 — Content & Schema Contracts (Shared)

**Status of this document:** AS BUILT, verified against the working tree of branch `main`.
**Primary source file:** `lib/playbook/contentSchema.ts` (526 lines), `lib/playbook/contentValidate.ts`, `lib/playbook/types.ts`, `lib/playbook/rev3.ts`.

> ⚠️ **Commit status (read this first).** Every schema below was verified in the **working tree**. The tree is modified relative to `HEAD` (`9429246` "Step 8 orchestration corrections"). The `FidelityOutcome` discriminated union, the four new signature variants, `UseReviewEntry.experience`, and the five Rev 3 progress `*_state` shapes are present in the working tree but **not yet committed**. See `01-source-of-truth-and-status.md` and `14-open-gates…md`.

This document is the authoritative description of the **shared content contracts** — the schema layer that any cluster's authored content plugs into. None of these types are Cluster 1–specific; they are the reusable substrate. Cluster 1's concrete objects that fill these shapes are inventoried in `04-cluster-1-object-inventory.md`.

Convention: `file.ts:START-END` denotes the exact line range in the working tree.

---

## 1. Content root

### `PlaybookContent` — `contentSchema.ts:5-21`
```ts
interface PlaybookContent {
  playbookKey: string;
  playbookVersion: number;
  displayName: string;
  opening: OpeningContent;
  recognitionCards: RecognitionCard[];
  plays: Play[];
  literature?: LiteratureEntry[];      // Rev 3, optional
  simulations?: Simulation[];          // Rev 3, optional
  missions?: Mission[];                // Rev 3, optional
  useReviews?: UseReview[];            // Rev 3, optional
  statementMap?: StatementMapping[];   // Rev 3, optional
}
```
- The five Rev 3 arrays are **optional**: a v0 playbook (Plays only) is still valid content.
- `OpeningContent` — `:23-28`: `{ title; body: string[]; manifestations?: string[]; cta }`.

### `RecognitionCard` + `RecognitionRole` — `:30-40`
```ts
type RecognitionRole = "route" | "validate" | "signpost";
interface RecognitionCard {
  id: string;
  role: RecognitionRole;
  pathwayPlayId: string | null;   // must be set iff role === "route"
  headline: string;
  explanation?: string;
  secondaryExamples?: string[];
  validationCopy?: string;
}
```
Recognition cards are the consumer statements that route a reader to a Play pathway (`role: "route"`), normalize/validate, or signpost. **Statements are personalization/routing assets, not interventions.**

---

## 2. Play contract (shared)

### `Play` — `contentSchema.ts:148-165`
```ts
interface Play {
  playId: string;
  playVersion: number;
  outputSchemaVersion: number;
  name: string;
  positioning: string;
  recognitionGate: { prompt: string };
  screens: Screen[];
  portable: string[];
  myPlaysTemplate: MyPlaysTemplate;   // the five-field saved card
  fidelity: Fidelity;
  supportSignposts?: PlaySupportSignpost[];
  routing?: PlayRouting;
  outputEditor?: OutputEditor;         // optional editable output
}
```
Supporting shapes:
- `MyPlaysTemplate` — `:109-115`: `{ when; move; lookingFor; watchOut; remember }` (all required).
- `Fidelity` — `:131-135`: `{ correct; misuse: string[]; notMeaning }`.
- `OutputEditor` — `:126-129`: `{ heading; fields: OutputEditorField[] }`; `OutputEditorField` `:117-125`: `{ id; label; input: "text" | "rule"; placeholder?; actions?; controlCheck? }`.
- `PlaySupportSignpost` — `:137-141`, `PlayRouting` — `:143-146` (`{ toPlayId; label }`).
- `PlayStateValue` — `:107`: `"available" | "explored" | "in_my_plays" | "used"` (the per-Play progress state).

### `Screen` union — `contentSchema.ts:67-103`
Twelve screen kinds (discriminated on `kind`):

| kind | line | key fields |
|---|---|---|
| `shift` | 68 | `body: string[]` |
| `literature` | 69 | `l1; l2?; l2Heading?` |
| `learn` | 70 | `body: string[]` |
| `scenarioSort` | 71-80 | `prompt; situation; buckets: SortBucket[]; items: SortItem[]; evidenceQuestion?` |
| `ownTurn` | 81 | `intro?; fields: OwnTurnField[]` |
| `sufficiency` | 82-90 | `prompt; enoughLabel; needMoreLabel; needToKnowLabel; observableLabel` |
| `ruleBuilder` | 91-98 | `conditionLabel; thenLabel; actions: string[]; controlCheck` |
| `sentenceBuilder` | 99 | `label; helper?` |
| `emotionBeat` | 100 | `body: string[]` |
| `output` | 101 | `heading; body?` **(required in every Play — see validator)** |
| `portable` | 102 | `heading; steps: string[]` |
| `realWorldUse` | 103 | `useWhen; doThis; safetyNote?` |

Helper shapes: `SortBucket` `:44-47`, `SortItem` `:48-54` (`correctBucket?`, `correction?`), `EvidenceQuestion` `:55-58`, `OwnTurnField` `:59-65` (`input: "text" | "chips"`, `suggestions?`).

> **Schema constraint (as built):** there is **no bounded single-select screen kind**. Where a Play needs a bounded choice (e.g. the five stances in *Rest, or Giving Up?* or the investment choice in *How Much to Put In*), it is captured through an `ownTurn` text field seeded with `suggestions` — a soft-select. This is documented in the Play specs (DECISION-LOG #33, #35). See `07-…`.

---

## 3. Simulation ("Experience") contract (shared)

### `Simulation` — `contentSchema.ts:388-396`
```ts
interface Simulation {
  id: string;
  version: number;
  simulationSchemaVersion: number;
  playId: string;              // the Play this Experience rehearses / hands off to
  signature: InteractionKind;
  startNodeId: string;
  nodes: SimNode[];
}
```

### `InteractionKind` — `contentSchema.ts:227-236`
```ts
type InteractionKind =
  | "evidenceTimeline" | "conclusionNarrowing"
  | "scenarioSort" | "ruleBuilder" | "sentenceBuilder"
  | "dualAttention" | "decisionRoom"
  | "communicationRehearsal" | "investmentView";
```
Six of these are used as Experience **signatures** in Cluster 1 (the two original + four new). `scenarioSort`/`ruleBuilder`/`sentenceBuilder` are Play-screen interaction kinds, not simulation signatures.

### `SimNode` — `contentSchema.ts:369-386`
```ts
type SimNodeBase = { id: string; role?: SimDisplayRole; jitLiteratureId?: string };
type SimNode = SimNodeBase & (
  | { kind: "moment";     body: string[]; next? }
  | { kind: "note";       body: string[]; next? }
  | { kind: "capture";    prompt; field: CaptureField; next? }
  | { kind: "decision";   prompt; options: SimOption[]; next? }
  | { kind: "reveal";     body?: string[]; label?; next?;
                          computedSummary?: RevealComputedSummary; recap?: RevealRecap[]; reactions?: RevealReaction[] }
  | { kind: "reconsider"; prompt; options: ReconsiderOption[]; next? }
  | { kind: "teach";      body: string[]; toPlayId: string }   // terminal, no next
);
```
- `SimDisplayRole` — `:284`: `"event" | "expansion" | "narrowing" | "beat" | "evidence"` (authored roles read by chrome renderers).
- `CaptureField` — `:278-280`: `{ kind: "choice"; options }` **or** `{ kind: "shortText"; maxLen; purpose }`.
- `jitLiteratureId` on any node hooks a Just-In-Time literature read (surfaced by id, never inlined).

### `SimOption` / `ReconsiderOption` — `:286-297` / `:324-334`
```ts
interface SimOption      { id; label; feedback: string[]; processTag?: SimProcessTag; signal?: string; next? }
interface ReconsiderOption { id; label; feedback?: string[]; next?; fidelity?: ReconsiderFidelity; signal?: string }
```
- `signal?: string` is the **authored semantic tag** the fidelity engine reads (e.g. `fit_kept`, `held_both`, `stance:rest`, `increase_at_lull`, `clear`). Fidelity is computed **from these tags, never from node ids** (see `05-…`).
- `SimProcessTag` — `:276`: `"held_uncertainty" | "jumped_to_conclusion" | "sought_evidence" | "bounded_to_evidence"`.
- `ReconsiderFidelity` — `:306-309`: `{ evidence_reconsidered: FidelityState; interpretation_response_appropriate: FidelityState }` — the authored fidelity fragment used only by the two reconsider-based signatures.

### Reveal computed-content shapes — `contentSchema.ts:344-358`
```ts
interface RevealComputedSummary { label?: string; resolver: string; variants: Record<string,string> }  // :344-348
interface RevealRecap  { label: string; fromNode: string }                                             // :350-353
interface RevealReaction { label: string; example: string }                                            // :354-358
```
These three optional fields on a `reveal` node are the extension (DECISION-LOG #28: "extend the reveal node," not a new node kind). Static `reveal.body` still works unchanged. Rendering is in `05-…` and `06-…`.

---

## 4. Fidelity contracts (shared)

### `FidelityState` — `contentSchema.ts:270`
```ts
type FidelityState = "demonstrated" | "not_demonstrated" | "not_applicable";
```
No numeric score exists anywhere. Fidelity is a small set of authored/observable state fields, not a rating.

### `FidelityOutcome` (signature-tagged discriminated union) — `contentSchema.ts:317-322`
```ts
type FidelityOutcome =
  | ({ signature: "evidenceTimeline" | "conclusionNarrowing" } & ReconsiderFidelity)
  | { signature: "dualAttention";  evaluator_stance_held: FidelityState; fit_information_kept_in_view: FidelityState }
  | { signature: "decisionRoom";   intentional_stance_selected: FidelityState; discouragement_distinguished_from_conclusion: FidelityState; chosen_stance: ChosenStance }
  | { signature: "investmentView"; investment_evidence_tied: FidelityState; effort_without_new_evidence_noticed: FidelityState }
  | { signature: "communicationRehearsal"; preference_expressed_clearly: FidelityState; unnecessary_self_erasure_avoided: FidelityState };
```
- `ChosenStance` — `:312`: `"rest" | "not_now" | "lightly_open" | "return_later" | "pause_decision"` (a **record of the choice**, not a fidelity state).
- **Owner decision #1 (DECISION-LOG #17):** each signature owns its own fields; there is no generic score. Field-by-field meaning ("establishes / does not establish") is in `05-…`.

---

## 5. Practice / Mission contract (shared)

### `Mission` — `contentSchema.ts:410-420`
```ts
interface Mission {
  id; version; playId; title; instruction;
  linkToOperation: string;
  attemptMeaning?: string;
  suitability?: string;
  progression?: MissionRung[];   // rungs = ladder of stretch instructions
}
```
- `MissionRung` — `:406-409`: `{ id; instruction }`.
- `MissionState` — `:402`: `"selected" | "attempted" | "reviewed"`.
- `MissionReport` — `:405`: `"attempted" | "no_opportunity" | "opportunity_not_taken" | "unsuitable"` (a non-attempt report is factual, **not a failure**).

---

## 6. Integrate / Use Review contract (shared)

### `UseReview` — `contentSchema.ts:429-438`
```ts
interface UseReview {
  id; version; playId;
  didDifferently:     StructuredPrompt;   // multi-select
  performedOperation: StructuredPrompt;   // single-select → Technique Fidelity (yes/partly/no)
  becameClearer:      StructuredPrompt;   // multi-select
  stuckWhere:         StructuredPrompt;   // single-select, prioritized friction point
}
```
- `StructuredPrompt` — `:424-428`: `{ label; options: string[]; multi? }`. **Bounded selects only** — no free-text field in the authored `UseReview` itself.

---

## 7. Progress state (shared, persisted)

`PlaybookProgress` — `contentSchema.ts:189-206` — is the whole current-state object.
```ts
interface PlaybookProgress {
  playbook_key; playbook_version;
  recognized: string[];
  play_states: Record<string, PlayStateValue>;
  outputs: Record<string, StoredOutput>;
  my_plays: SavedPlayCard[];
  literature_state?: LiteratureState;      // Rev 3
  simulation_state?: SimulationState;      // Rev 3
  practice_state?: PracticeState;          // Rev 3
  use_review_state?: UseReviewState;       // Rev 3
  change_path_state?: ChangePathState;     // Rev 3
}
```
`emptyProgress(key, version)` — `:208-217` — returns the v0 shell (`recognized:[]`, `play_states:{}`, `outputs:{}`, `my_plays:[]`); the five Rev 3 `*_state` fields are **omitted (undefined)**, not empty objects.

Rev 3 separated-state shapes:
- `LiteratureState` — `:466-469`: `{ version; read?: string[] }`.
- `SimulationRunState` — `:472-478`: `{ completed?; nodeId?; captures?: Record<string,string>; selections?: Record<string,string>; fidelity?: FidelityOutcome }`; `SimulationState` `:479-482`: `{ version; runs?: Record<simId, SimulationRunState> }`.
- `MissionRunState` — `:483-491`: `{ state: MissionState; rungId?; stretchEligible?; lastReport?: MissionReport; attemptCount? }`; `PracticeState` `:492-496`: `{ version; currentMissionId?; missions?: Record<missionId, MissionRunState> }`.
- `UseReviewSignals` — `:500-509`: `{ performed?: "yes"|"partly"|"no"; didDifferently?; becameClearer?; stuck?; kept?; updated?; saved? }` (bounded functional signals — this stays purely functional; Change Path reads only these).
- `UseReviewEntry` — `:515`: `UseReviewSignals & { at?: string; experience?: string }` — **a chronological list per Play**; `experience` is the one optional free-text note (owner-requested; bounded; crisis-screened; never emitted to the event log).
- `UseReviewState` — `:516-521`: `{ version; reviews?: Record<playId, UseReviewEntry[]> }`.
- `ChangePathState` — `:522-526`: `{ version; currentFocus?; priorFocus? }`.
- `StoredOutput` — `:170-174`: `{ output_schema_version; play_version; payload }`; `SavedPlayCard` — `:176-187`: the five My-Plays fields + `play_id; play_version; name; userLine?`.

---

## 8. Build-time / content validation

`lib/playbook/contentValidate.ts` (exported `validatePlaybookContent(content): string[]`, `:57-82`; `[]` = valid).

**Play rules** (`validatePlay`, `:21-54`) — an error is pushed when:
- `playId` / `name` / `recognitionGate.prompt` missing (`:23,26,27`); `playVersion >= 1`, `outputSchemaVersion >= 1` (`:24-25`);
- `screens` empty (`:28`); **no `output` screen** → "no executable output" (`:39-40`);
- any of the five `myPlaysTemplate` fields missing (`:30-33`); `fidelity.correct` / non-empty `fidelity.misuse` / `fidelity.notMeaning` missing (`:34-36`); `portable` empty (`:37`);
- any screen `kind` not in `SCREEN_KINDS` (the 12 kinds, `:6-19,43`); `scenarioSort` with < 2 buckets, or an item `correctBucket` not a known bucket (`:45-51`).

**Content rules** (`:57-82`): `playbookKey` / `playbookVersion >= 1` / `opening.title`+`opening.body` (`:59-61`); duplicate `playId` (`:66`); `routing.toPlayId` must be a built Play (`:69-71`); route cards must have `pathwayPlayId`, non-route cards must not (`:77-78`); card `headline` required (`:79`).

> **Validator scope discrepancy (documented, not repaired):** `validatePlaybookContent` imports only `PlaybookContent, Play, Screen` (`:4`) and validates **Plays and recognition cards only**. The Rev 3 objects — `Simulation`, `Mission`, `UseReview`, `LiteratureEntry`, `StatementMapping` — are **not** validated at build time by this module. Simulation validity is enforced separately by `validateSimulation` in `lib/playbook/simulation.ts` (see `05-…`) and by the test suite (see `10-…`). No build-time validator exists for Missions / Use Reviews / Literature. This is a real coverage gap a future cluster should be aware of.

---

## 9. Feature flag

`lib/playbook/rev3.ts:11`
```ts
export const PLAYBOOK_REV3_ENABLED = process.env.NEXT_PUBLIC_PLAYBOOK_REV3 === "true";
```
- Strict equality to `"true"`; OFF for any other value; **OFF by default**.
- `ExperienceShell` accepts a testable `rev3` prop that defaults to this constant, so tests can force either mode.
- Enabling the flag does **not** run any migration and does **not** deploy.

`lib/playbook/types.ts`: `PlaybookProgressRow` (`:19-32`) is the raw DB row — all jsonb columns nullable, the five Rev 3 `*_state` columns noted as added in migration `0053`, jsonb default `'{}'`. `CrisisScreenResult` (`:35-40`): `{ interrupt; heading|null; message|null; resources: {label; value}[] }`.
