# Playbook Content — Authoring Schema (author to THIS, exactly)

**Who this is for.** Whoever authors a cluster's `PlaybookContent` module. Every field below is a real type
in `lib/playbook/contentSchema.ts`, enforced by `lib/playbook/contentValidate.ts` and the TypeScript compiler.
**Author to these shapes exactly — do not add fields that aren't listed.** TypeScript rejects unknown properties
on a typed object literal, so an invented field (e.g. a `heading` on a `shift` screen) is a hard compile error,
not a warning. The recurring problem has been authoring against a *richer, assumed* schema; this is the real one.

Deliver one module per cluster: `content/playbook/<slug>.ts` exporting a `PlaybookContent`, plus a
`<slug>-literature.ts` companion. Mirror `content/playbook/dating-without-losing-hope.ts` (Cluster 4).

---

## 1. Top level — `PlaybookContent`
```ts
{
  playbookKey: string,        // kebab slug, == marketing slug. DO-NOT-REVERT once shipped.
  playbookVersion: 1,
  displayName: string,        // consumer name
  opening: { title: string, body: string[], manifestations?: string[], cta: string },  // cta REQUIRED
  recognitionCards: RecognitionCard[],
  plays: Play[],
  literature?: LiteratureEntry[],   // companion file
  missions?: Mission[],
  useReviews?: UseReview[],
  // simulations?: Simulation[]  — omit for Plays-only clusters
}
```

## 2. `recognitionCards[]`
```ts
{ id, role: "route" | "validate" | "signpost", pathwayPlayId: string | null,
  headline: string, explanation?: string, secondaryExamples?: string[], validationCopy?: string }
```
Rule: `role:"route"` **must** set `pathwayPlayId` (a playId). `validate`/`signpost` **must** set it `null`.

## 3. `plays[]` — required fields (validator-enforced)
```ts
{
  playId, playVersion: 1, outputSchemaVersion: 1, name, positioning,
  recognitionGate: { prompt: string },
  screens: Screen[],                 // exactly ONE screen of kind "output"
  portable: string[],                // >= 1 (the take-away reminder lines)
  myPlaysTemplate: { when, move, lookingFor, watchOut, remember },   // all 5
  fidelity: { correct: string, misuse: string[] /* >=1 */, notMeaning: string },
  supportSignposts?: { id, heading, body }[],
  routing?: { toPlayId, label },     // optional cross-play route
  // NO `outputEditor: true`. It is an object or absent — omit it.
}
```

## 4. `Screen` — the ONLY valid screen shapes (this is where drafts break)
Author each screen as EXACTLY one of these. No extra keys.
```ts
{ kind: "shift", body: string[] }                          // NO heading — lead line is body[0]
{ kind: "learn", body: string[] }                          // NO heading
{ kind: "emotionBeat", body: string[] }                    // NO heading
{ kind: "ownTurn", intro?: string,                         // "intro", NOT "heading". No "note".
  fields: { id, label, input: "text" | "chips", placeholder?, suggestions?: string[] }[] }
                                                            // chips options go in `suggestions`, NOT `options`.
                                                            // input is only "text" | "chips" — no "number".
{ kind: "scenarioSort", prompt: string, situation: string, // situation REQUIRED (a one-line scene)
  thought?: string, note?: string,
  buckets: { id, label }[],                                 // >= 2
  items: { id, text, correctBucket?, correction? }[] }
{ kind: "sufficiency", prompt, enoughLabel, needMoreLabel,
  needMoreIntro?, needToKnowLabel, observableLabel }
{ kind: "ruleBuilder", intro?: string,
  conditionLabel: string, thenLabel: string,
  actions: string[],                                        // PLAIN STRINGS, not {id,label} objects
  controlCheck: string }                                    // ONE string, not a list
{ kind: "sentenceBuilder", label: string, helper?: string }// a single free-text box. NO prompt/parts/options.
{ kind: "output", heading: string, body?: string }         // body is a SINGLE string, not an array
{ kind: "portable", heading: string, steps: string[] }     // NEVER a bare { kind: "portable" }
{ kind: "realWorldUse", useWhen, doThis, safetyNote? }
{ kind: "literature", l1: string, l2?: string, l2Heading?: string }
```

### How `ruleBuilder` renders (so author it right the first time)
It draws: the **`conditionLabel`** as a fill-in text field → the **`thenLabel`** as a dropdown whose options are
**`actions`** → the **`controlCheck`** as a single confirmation checkbox. So:
- `conditionLabel` must be a genuine fill-in prompt the user completes (e.g. "When I see…", "Who I'll tell").
  A dead phrase ("After I've said it") reads wrong in a fill-in box.
- `actions` are the selectable options (plain strings).
- `controlCheck` is one guardrail sentence. If you have several guardrails, fold them into one sentence.
- If a Play needs a SECOND selectable list, put it in a preceding `ownTurn` chips screen — `ruleBuilder` has
  room for only one `actions` list.

### How `sentenceBuilder` renders
A label + optional helper + one free-text textarea. There are no structured "parts" or opener buttons — fold
any opener suggestions into `helper` as prose ("You might start with …").

## 5. `literature[]` (companion file) — `LiteratureEntry`
```ts
{ id, version: 1, scope: "cluster", depth?: "core" | "question", title,
  body: LiteratureBlock[], related?: string[] }
```
`LiteratureBlock` is one of:
```ts
{ kind: "paragraph", heading?: string, body: string[] }
{ kind: "distinction", label: string, body: string[] }
{ kind: "list", label?: string, items: string[] }
{ kind: "example", body: string[] }
{ kind: "guardrail", body: string[] }
```
**Every `related[]` id MUST be the id of an entry that actually exists in the file.** The validator does NOT
check literature links, and TypeScript can't either — a dangling `related` (e.g. referencing an entry you
planned but didn't write) ships silently broken. Self-check every `related` against your own `id` list.

## 6. `missions[]` and `useReviews[]`
```ts
Mission:   { id, version: 1, playId, title, instruction, linkToOperation,
             attemptMeaning?, suitability?, progression?: { id, instruction }[] }
UseReview: { id, version: 1, playId,
             didDifferently: Prompt, performedOperation: Prompt, becameClearer: Prompt, stuckWhere: Prompt }
Prompt:    { label: string, options: string[], multi?: boolean }
```
`performedOperation.options` must reduce to **yes / partly / no** (3 options, in that order).
`stuckWhere` is single-select; its option strings are what Change Path routes on — keep them stable.

## 7. IDs & versions
All `*Version` / `*SchemaVersion` = `1`. All ids kebab-case and cluster-scoped (`lit-cN-*`, `mission-cN-*`,
`review-cN-*`, play ids, `rec-cN-*`, signpost ids). **IDs are do-not-revert once shipped.**

## 8. Pre-submit checklist (run before handing a cluster over)
- [ ] `opening.cta` present.
- [ ] No `heading` on `shift` / `learn` / `emotionBeat` / `ownTurn` / `ruleBuilder` / `sentenceBuilder`.
- [ ] `ownTurn` chips use `suggestions`, not `options`.
- [ ] Every `scenarioSort` has a `situation`.
- [ ] Every `ruleBuilder`: `actions` is `string[]`, `controlCheck` is one string, `conditionLabel` is a real
      fill-in prompt.
- [ ] Every `sentenceBuilder` is just `{ label, helper? }`.
- [ ] Every `output.body` is a single string (or omitted).
- [ ] Every `portable` screen has `heading` + `steps`; exactly one `output` screen per Play.
- [ ] No `outputEditor: true` anywhere.
- [ ] Every Play: `portable[]` non-empty, all 5 `myPlaysTemplate` fields, `fidelity.misuse` non-empty.
- [ ] Every literature `related[]` id resolves to a real entry in the same file.

*If a cluster passes this checklist it compiles and validates on first import. Cluster 4
(`content/playbook/dating-without-losing-hope.ts`) is the reference example.*
