# 05 — Experience Engine, Signatures & Fidelity

**Status:** AS BUILT (working tree, branch `main`; uncommitted — see `01-…`).
**Primary sources:** `lib/playbook/simulation.ts` (291 lines), `components/playbook/SimulationPlayer.tsx`, `components/playbook/SimulationSignatures.tsx`.

An **Experience** (internal term: *simulation*) is a deterministic, authored decision graph the reader steps through *before* the Play. It rehearses one behavioral operation. It never asks the reader to author narrative; it never lets the reader's choice change the other person's behavior; it produces a small **fidelity outcome** computed from authored semantic tags, and hands off to the Play.

---

## 1. The engine is a deterministic authored graph

- Each `Simulation` has a `startNodeId` and a fixed `nodes: SimNode[]`; branches rejoin at authored `next` ids. There is no randomness and no generation.
- **The partner/other-person's behavior is authored, never a function of the reader's choice.** (Confirmed structurally: the other person's beats are `moment`/`note` nodes; the reader's `decision`/`reconsider` choices only route within the authored graph and set signal tags.)
- `SimulationPlayer` walks the graph (`SimulationPlayer.tsx`), rendering node-by-node with focus + live-region handling (§5).

### Graph validation — `validateSimulation(sim, approvedPlayIds)` — `simulation.ts:237-291`
Returns a deduped `string[]` (`[]` = valid). Rules:
1. duplicate node id → "duplicate node id" (`:240`).
2. `startNodeId` must exist (`:241`).
3. every successor id must exist → "{id} → unknown next {s}" (`:244`).
4. decision/reconsider option must have a route (`o.next ?? n.next`) (`:245-247`).
5. reconsider fidelity validated **only when the option carries `o.fidelity`** — each of `evidence_reconsidered` / `interpretation_response_appropriate` must be a valid `FidelityState` (`:248-254`). Options without fidelity (the four new signatures) are skipped.
6. teach `toPlayId` must be in `approvedPlayIds` else "unapproved play" (`:255`).
7. non-teach/decision/reconsider node with zero successors → "dead-ends" (`:257-259`).
8. DFS cycle detection (WHITE/GRAY/BLACK) → "cycle: {id} → {s}" (`:263-283`).
9. any unreachable node → "unreachable" (`:284`).
10. every reachable terminal that isn't a `teach` → "terminal node … is not a teach handoff" (`:286-289`).

`successors(node)` (`:44-50`): teach → `[]`; decision/reconsider → deduped option routes; else → `[node.next]`.

---

## 2. Fidelity is computed from authored signal tags, never node ids

Two authored tagging mechanisms coexist (by simulation generation):

- **The two original signatures** (`evidenceTimeline`, `conclusionNarrowing`) read the authored **`ReconsiderFidelity` fragment** (`o.fidelity`) off the selected `reconsider` option. (They also carry `processTag` on options, read by chrome renderers, not by fidelity.)
- **The four new signatures** read authored **`signal: string` tags** off the selected `decision`/`reconsider` options, aggregated by two pure helpers:
  - `selectedSignals(sim, selections): Set<string>` — `simulation.ts:91-99` — presence of each selected option's `signal`.
  - `selectedSignalCounts(sim, selections): Map<string,number>` — `:103-111` — counts across selected options (for majority-over-repeated-moments).

Header comment (`:86-90`): fidelity is read from authored semantic tags, **never from node ids**, and JIT literature is **never** a fidelity input (design guarantee "G2").

Stance helpers: `stanceFromSignals` (`:11-14`) reads the first `stance:*` signal → a `ChosenStance` (default `pause_decision`); `hasStance` (`:15-17`).

`notApplicableFor(signature)` (`:23-37`) returns the signature-shaped "nothing exercised yet" outcome (all state fields `not_applicable`) — the only source of `not_applicable` outcomes.

---

## 3. Per-signature aggregation — `aggregateFidelity(sim, selections, _captures?)` — `simulation.ts:113-165`

> `_captures` is accepted but unused. Fidelity is aggregated **once**, at the teach handoff (the sole call site — §5). For the four new signatures, absence of a relevant signal collapses to `not_demonstrated` (never `not_applicable` from this function).

**evidenceTimeline / conclusionNarrowing** (`:115-125`): loop every `reconsider` node; if the selected option has `.fidelity`, replace the working outcome with a copy of it — **last answered reconsider wins**. Returns `{ signature, evidence_reconsidered, interpretation_response_appropriate }`.

**dualAttention** (`:126-133`):
- `fit_information_kept_in_view` = `demonstrated` iff `sigs.has("fit_kept")`, else `not_demonstrated`.
- `evaluator_stance_held` = `demonstrated` iff `sigs.has("held_both")` **AND** fit is `demonstrated`, else `not_demonstrated`.

**decisionRoom** (`:134-141`):
- `intentional_stance_selected` = `demonstrated` iff `hasStance(sigs)` (any `stance:*`, incl. `pause_decision`).
- `discouragement_distinguished_from_conclusion` = `not_demonstrated` iff `sigs.has("held_forever")`, else `demonstrated` (**default demonstrated**; only a re-asserted forever-conclusion revokes it).
- `chosen_stance` = `stanceFromSignals(sigs)`.

**investmentView** (`:142-151`) — `increasedAtLull = sigs.has("increase_at_lull")`:
- `investment_evidence_tied` = `not_demonstrated` iff `increasedAtLull`, else `demonstrated`.
- `effort_without_new_evidence_noticed` = `not_demonstrated` iff `increasedAtLull && sigs.has("claimed_evidence_at_lull")`, else `demonstrated`.

**communicationRehearsal** (`:152-161`) — `clear = count("clear")`, `buried = count("buried")`:
- `preference_expressed_clearly` = `demonstrated` iff `clear + buried >= 2`.
- `unnecessary_self_erasure_avoided` = `demonstrated` iff `clear >= 2`.

**default** (`:162-163`): `notApplicableFor(sim.signature)`.

`completionPayload(fidelity)` (`:221-223`) is the identity function — the tagging (`signature` field) is already set by `aggregateFidelity`/`notApplicableFor`.

---

## 4. Reveal resolution (extended `reveal` node)

### `REVEAL_RESOLVERS` registry — `simulation.ts:171-188`
`Record<string, (sim, selections, captures) => string>` returning a **variant key**:
- **`dualAttentionFocus`** (`:173-178`): `held_both`→`"both"`; else `fit_kept`→`"evaluation_active"`; else `"interest"`. Comment: where choices focused, **not a measure of attention**.
- **`decisionRoomStance`** (`:180`): returns `stanceFromSignals(...)` — the variant key is the `ChosenStance` enum.
- **`communicationRehearsalRecap`** (`:182-187`): `count("clear")>=2`→`"clear"`; else `count("erased")>=2`→`"erased"`; else `"mixed"`.

(No resolvers for evidenceTimeline / conclusionNarrowing / investmentView — those reveals are static `body` and/or `recap`.)

### `resolveRevealContent(node, sim, selections, captures?)` — `simulation.ts:200-216`
Returns `{ paragraphs, label?, summary?, recap[], reactions[] }`:
- `paragraphs` = `node.body ?? []`; `label` = `node.label` (static reveals still work).
- `summary` = `variants[REVEAL_RESOLVERS[node.computedSummary.resolver](...)]` when `computedSummary` present (`:207-211`).
- `recap` = `node.recap` mapped `{ label, fromNode }` → `{ label, value: <reader's selected option label on fromNode> }`, filtering empties (`:212-214`).
- `reactions` = `node.reactions ?? []` (`:215`).

---

## 5. `SimulationPlayer` rendering & accessibility

- **Reveal branch** (`SimulationPlayer.tsx:105-136`): calls `resolveRevealContent`; renders (in order) a `aria-live="polite"` block with the label (focus target `ref=promptRef`, `tabIndex=-1`) + paragraphs; then `recap` as a `<dl>` (only if non-empty); then the computed `summary` as one highlighted `<p>`; then `reactions` as a `<ul>`; then the JIT link + Continue.
- **JIT hook** (`JitLink`, `:235-243`): a "Related read" button appears only when a node has `jitLiteratureId` **and** `onSurfaceJit` is provided; literature is surfaced **by id, never inlined** (Exposure-only, "G2"). Surfaced on moment/note/reveal/capture/decision/reconsider — never on teach.
- **Progress / resume** (`:42-44, 63-67`): seeds `currentNodeId`/`captures`/`selections` from `initialState`; fires `onProgress({nodeId, captures, selections})` on every change (resume-safe).
- **Focus management** (`:47-61`): moves focus to each new node's prompt on transition; **skips focus on initial mount** (`firstRun` guard).
- **Live region / neutrality** (`:203-204`): decision/reconsider feedback is wrapped `aria-live="polite" role="status"`, explicitly **neutral — not a "correct" verdict**; options are `<button aria-pressed>`; capture choice is a radio `<fieldset>` with `<legend class="sr-only">`.
- **teach `onComplete`** (`:217-229`): the "Open the tool →" button calls `onComplete(completionPayload(aggregateFidelity(simulation, selections, captures)), node.toPlayId)` — the **only** call site of `aggregateFidelity`. Fidelity is computed once, at handoff, and passed with the destination `toPlayId`.
- **Malformed/exhausted graph** (`:69-74`): calls `onExit?.()` via effect (never a render-time side effect) + a fallback paragraph.

### Signature chrome — `SimulationSignatures.tsx`
- `SIGNATURE_TITLE` (`:97-104`) — all six: evidenceTimeline "Reading the signals over time"; conclusionNarrowing "How big did the story get?"; dualAttention "Holding both questions"; decisionRoom "Rest, or giving up?"; investmentView "How much to put in"; communicationRehearsal "Say the real thing".
- `SIGNATURE_CHROME` (`:107-110`) — **only two** context-panel renderers exist: `EvidenceTimelineChrome` (`:28-44`, vertical timeline of moment/reveal beats) and `ConclusionNarrowingChrome` (`:47-95`, reads authored `event`/`expansion`/`narrowing` roles; shows "grew into" vs "kept bounded" vs "narrowed to"). The four new signatures render **interaction only, no chrome**.

---

## 6. The six signatures at a glance

| Signature | Consumer Experience | Operation rehearsed | Fidelity fields | Reveal mechanism | Reuse status |
|---|---|---|---|---|---|
| `evidenceTimeline` | Read It, Then Decide | Read signals over time before reacting | `evidence_reconsidered`, `interpretation_response_appropriate` | static `body` + EvidenceTimelineChrome | Cluster 1–specific content; signature reusable |
| `conclusionNarrowing` | What It Actually Means | Bound a globalized read to what the event establishes | `evidence_reconsidered`, `interpretation_response_appropriate` | static `body`/recap + ConclusionNarrowingChrome | Cluster 1–specific content; signature reusable |
| `dualAttention` | Is This Right for You? | Hold interest AND own-fit question simultaneously | `evaluator_stance_held`, `fit_information_kept_in_view` | `computedSummary` → `dualAttentionFocus` | Cluster 1–specific; signature reusable if it authentically fits |
| `decisionRoom` | Rest, or Giving Up? | Choose an intentional, revisitable stance vs a forever conclusion | `intentional_stance_selected`, `discouragement_distinguished_from_conclusion`, `chosen_stance` | `computedSummary` → `decisionRoomStance` | Cluster 1–specific; signature reusable if it fits |
| `investmentView` | How Much to Put In | Tie investment change to observed evidence, not the quiet | `investment_evidence_tied`, `effort_without_new_evidence_noticed` | `recap` of the three round choices | Cluster 1–specific; signature reusable if it fits |
| `communicationRehearsal` | Say the Real Thing | State a preference clearly without self-erasure across moments | `preference_expressed_clearly`, `unnecessary_self_erasure_avoided` | `computedSummary` → `communicationRehearsalRecap` | Cluster 1–specific; signature reusable if it fits |

---

## 7. Per-field: what each fidelity field establishes — and does NOT

Strictly what the code/comments support (no interpretive inflation). **Every consumer claim must be bounded to exactly this.**

**evidenceTimeline / conclusionNarrowing**
- `evidence_reconsidered` — *establishes:* the authored state of whether the reader's **last-answered** reconsider re-examined the evidence. *Does not establish:* anything about interpretation/response quality, nor any earlier read (only the last reconsider counts).
- `interpretation_response_appropriate` — *establishes:* the authored appropriateness of the interpretation/response on that last reconsider (in ConclusionNarrowingChrome, `demonstrated` here is what surfaces the "Narrowed to" panel). *Does not establish:* that evidence was reconsidered.

**dualAttention**
- `fit_information_kept_in_view` — *establishes:* the reader made ≥1 `fit_kept`-tagged choice (fit information kept in the evaluative frame). *Does not establish:* sustained or actual attention — the resolver comment is explicit: "where choices focused… not a measure of attention." Absence → `not_demonstrated`, never `not_applicable`.
- `evaluator_stance_held` — *establishes:* the reader chose `held_both` **and** kept fit in view (both required). *Does not establish:* either condition alone.

**decisionRoom**
- `intentional_stance_selected` — *establishes:* any `stance:*` was selected, including `pause_decision`. *Does not establish:* which stance, or that it was a "good"/rest stance.
- `discouragement_distinguished_from_conclusion` — *establishes:* the reader did **not** re-assert `held_forever` (default `demonstrated`). *Does not establish:* an affirmative distinction act — it's a default a `held_forever` signal revokes; disengagement still reads `demonstrated`.
- `chosen_stance` — *establishes:* the concrete revisitable stance enum picked (default `pause_decision`). Not a fidelity state; a **record of the choice**.

**investmentView**
- `investment_evidence_tied` — *establishes:* the reader did **not** increase investment at the lull (inverse of `increase_at_lull`). *Does not establish:* positive evidence-tying reasoning.
- `effort_without_new_evidence_noticed` — *establishes:* the reader did **not** both increase at the lull **and** claim non-existent evidence. *Does not establish:* noticing in any general sense — fails only on that specific combination. (Name ruling: DECISION-LOG #23 — it describes the *observable effort-vs-evidence relationship*, not a causal/functional inference; do not revert to `compensatory_effort_recognized`.)

**communicationRehearsal**
- `preference_expressed_clearly` — *establishes:* across three moments, ≥2 were `clear` or `buried` (preference stated at all, even if buried in apology). *Does not establish:* that it was said well or received well — reaction is **never** an input.
- `unnecessary_self_erasure_avoided` — *establishes:* ≥2 moments were `clear` specifically (not buried). *Does not establish:* anything about the partner's reaction.

**Cross-cutting (code-supported):** the four choice-computed signatures emit only `demonstrated`/`not_demonstrated`; `not_applicable` comes solely from `notApplicableFor`/default (the pre-run seam). Fidelity takes **no** JIT/literature/reaction input, and the reconsider signatures read only authored `o.fidelity` fragments — never inferred from the signature name.
