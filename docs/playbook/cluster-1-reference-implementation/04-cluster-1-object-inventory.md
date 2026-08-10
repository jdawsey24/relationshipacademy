# 04 — Cluster 1 Object Inventory

**Status:** AS BUILT (working tree). Every ID below was read directly from content files.
**Registry root:** `content/playbook/moving-beyond-rejection.ts` → `MOVING_BEYOND_REJECTION: PlaybookContent`.
**Resolved via:** `content/playbook/index.ts` `REGISTRY["moving-beyond-rejection"]` → `getPlaybookContent(key)`.

Cluster identity: `playbookKey = "moving-beyond-rejection"` (`:34`), `playbookVersion = 1` (`:35`), `displayName = "Believing You're Worth Being Chosen"` (`:36`), `cluster_id = 1` (`keys.ts`). _(superseded 2026-08-09 — see the correction note in `README.md`.)_

---

## 1. Content registry assembly (`moving-beyond-rejection.ts`)

| Content array | How assembled | Line |
|---|---|---|
| `literature` | `[...MBR_LITERATURE, ...ITR_JIT, ...RGU_JIT, ...HMP_JIT, ...STT_JIT]` | :39 |
| `statementMap` | `MBR_STATEMENT_MAP` | :40 |
| `simulations` | `[...MBR_SIMULATIONS, ITR_SIMULATION, RGU_SIMULATION, HMP_SIMULATION, STT_SIMULATION]` | :41 |
| `missions` | `MBR_MISSIONS` | :42 |
| `useReviews` | `MBR_USE_REVIEWS` | :43 |
| `opening` | inline (title, body[4], manifestations[6], `cta: "See what sounds like me"`) | :44-61 |
| `recognitionCards` | inline (7 cards) | :63-119 |
| `plays` | 2 inline + `ITR_PLAY, RGU_PLAY, HMP_PLAY, STT_PLAY` | :121-463 |

The four new Plays/Sims/JIT are imported from their slice files (`:12-15`) and spread/added here. There is no separate `recognitionCards` module — the cards are authored inline.

---

## 2. Recognition statement → pathway mappings (`:63-119`)

| Card id | Role | → Play (`pathwayPlayId`) | Consumer statement (verbatim) |
|---|---|---|---|
| `rec-self-meaning` | route | `what-it-actually-means` | "When something doesn't work out, I start wondering what's wrong with me." |
| `rec-selection` | route | `is-this-right-for-you` | "I spend more time wondering if they want me than asking whether I want this." |
| `rec-evidence` | route | `read-and-decide` | "I can't always tell what their behavior means — or when to keep going, ask, slow down, or walk away." |
| `rec-over-invest` | route | `how-much-to-put-in` | "I keep putting more into it even when I'm not getting much back." |
| `rec-self-edit` | route | `say-the-real-thing` | "I edit myself so they'll keep liking me." |
| `rec-fatigue` | route | `rest-or-giving-up` | "I'm worn out by dating, and I can't tell if I need a break or I'm just done." |
| `rec-loneliness` | **validate** | *(null — no route)* | "Honestly, mostly I'm just tired of being alone." *(has `validationCopy`)* |

**Statements are personalization/routing assets — not interventions.** Six route to a Play; one (`rec-loneliness`) normalizes/validates and does **not** route (loneliness ≠ automatic intervention target).

---

## 3. The six Experience/Play pathways

Each pathway = one **RecognitionCard** → one **Play** → one **Simulation (Experience)** with a **signature** → one **Use Review** → optionally a **Mission**. The Simulation hands off to the Play via `teach.toPlayId`.

| # | Consumer Experience | Signature | Play id | Sim id | Use Review id | Mission? | Source file |
|---|---|---|---|---|---|---|---|
| 1 | What It Actually Means | `conclusionNarrowing` | `what-it-actually-means` | `sim-wm-not-a-match` | `review-what-it-actually-means` | `mission-wm-narrowest-true-thing` | `moving-beyond-rejection.ts` (+ `-simulations.ts`) |
| 2 | Read It, Then Decide | `evidenceTimeline` | `read-and-decide` | `sim-rd-shorter-texts` | `review-read-and-decide` | `mission-rd-read-before-react` | `moving-beyond-rejection.ts` (+ `-simulations.ts`) |
| 3 | Is This Right for You? | `dualAttention` | `is-this-right-for-you` | `sim-itr-evaluator-stance` | `review-is-this-right-for-you` | — none — | `is-this-right-for-you.ts` |
| 4 | Rest, or Giving Up? | `decisionRoom` | `rest-or-giving-up` | `sim-rgu-decision-room` | `review-rest-or-giving-up` | — none — | `rest-or-giving-up.ts` |
| 5 | How Much to Put In | `investmentView` | `how-much-to-put-in` | `sim-hmp-investment-view` | `review-how-much-to-put-in` | — none — | `how-much-to-put-in.ts` |
| 6 | Say the Real Thing | `communicationRehearsal` | `say-the-real-thing` | `sim-stt-rehearsal` | `review-say-the-real-thing` | — none — | `say-the-real-thing.ts` |

> **Coverage note:** Missions exist **only** for the two original Plays (RD, WM). The four new Plays have Use Reviews (all six covered as of DECISION-LOG #49, authored FOR REVIEW) but **no Missions**. See `14-…`.

---

## 4. Plays — detail

### Play 1 · `read-and-decide` — "Read It, Then Decide" (inline `:125-288`)
- **positioning:** "Tell what you've seen from what you're guessing, and set a clear next move."
- **screens (order):** shift, literature, learn, scenarioSort, scenarioSort, ownTurn, sufficiency, ruleBuilder, output ("Your Read & Decide"), portable, realWorldUse.
- **outputEditor:** yes (`:281-287`) — `evidence` (text) + `rule` (input:"rule", `RD_ACTIONS`, `RD_CONTROL_CHECK`).
- **fidelity.correct:** "You kept 'saw it' separate from 'guessing', named a real 'don't know', and your move has an observable trigger and your own action."
- **fidelity.misuse:** [2]. **notMeaning:** "This isn't playing it cool, keeping score, testing them, or needing 100% certainty before you act."

### Play 2 · `what-it-actually-means` — "What It Actually Means" (inline `:293-442`)
- **positioning:** "Separate what happened from what it says about you."
- **screens:** shift, literature, learn, scenarioSort×3, ownTurn, sentenceBuilder, emotionBeat, output ("Your Bounded Conclusion"), portable, realWorldUse.
- **outputEditor:** yes (`:438-441`) — single `narrowest_true_thing` (text).
- **fidelity.correct:** "Your conclusion stays close to the actual event, doesn't expand one choice into a universal truth, and doesn't require you to feel better."
- **Unique:** `supportSignposts` (`:429-436`, id `severe-self-worth`) + `routing` (`:437`) → `read-and-decide`.

### Play 3 · `is-this-right-for-you` — "Is This Right for You?" (`is-this-right-for-you.ts:12-125`)
- consts: `ITR_PLAY_ID="is-this-right-for-you"` (:8), `ITR_SIM_ID="sim-itr-evaluator-stance"` (:9).
- **positioning:** "Keep two questions open — do they seem interested, and what are you learning about whether you want this."
- **screens:** shift, literature, learn, scenarioSort, ownTurn, sentenceBuilder, output ("Your Two Questions"), portable, realWorldUse.
- **outputEditor:** **none** (DECISION-LOG ruling #30/#31).
- **fidelity.correct:** "You kept your own question live — you can name at least one thing you've learned about fit, separate from whether they're interested." **notMeaning:** "This isn't vetting, rejecting, or grading someone…"

### Play 4 · `rest-or-giving-up` — "Rest, or Giving Up?" (`rest-or-giving-up.ts:20-145`)
- consts: `RGU_PLAY_ID` (:8), `RGU_SIM_ID="sim-rgu-decision-room"` (:9), `STANCE_SUGGESTIONS` (:11-17).
- **positioning:** "Choose an intentional, revisitable stance toward dating right now — instead of letting a hard week decide."
- **screens:** shift, literature, learn, scenarioSort, emotionBeat, ownTurn, output ("Your Stance, For Now"), portable, realWorldUse.
- **outputEditor:** yes (`:138-144`) — `stance` (text) + `reentry` (text, optional).
- **fidelity.correct:** "You chose an intentional stance for now and kept it revisitable." **notMeaning:** "This isn't quitting, and it isn't a diagnosis. Rest and staying open are equally valid."

### Play 5 · `how-much-to-put-in` — "How Much to Put In" (`how-much-to-put-in.ts:37-159`)
- consts: `HMP_PLAY_ID` (:8), `HMP_SIM_ID="sim-hmp-investment-view"` (:9), `HMP_ACTIONS` (:13-19), `HMP_CONTROL_CHECK` (:20-21).
- **positioning:** "Before you change how much you put in, name the evidence — and turn it into a move you decide on purpose."
- **screens:** shift, literature, learn, scenarioSort, ownTurn, ruleBuilder, output ("Your Evidence & Move"), portable, realWorldUse. (`ruleBuilder` is the CORE output — DECISION-LOG #30/#35.)
- **outputEditor:** yes (`:152-158`) — `evidence` (text) + `rule` (input:"rule", `HMP_ACTIONS`, `HMP_CONTROL_CHECK`).
- **fidelity.correct:** "Your investment change is tied to something you actually observed, and it's a deliberate choice — not a reaction to the quiet or a way to get a response." **notMeaning:** "This isn't playing games, withholding, or tit-for-tat…"

### Play 6 · `say-the-real-thing` — "Say the Real Thing" (`say-the-real-thing.ts:12-125`)
- consts: `STT_PLAY_ID` (:8), `STT_SIM_ID="sim-stt-rehearsal"` (:9).
- **positioning:** "Say the genuine preference, opinion, or small request clearly and kindly — and treat the response as information, not a grade."
- **screens:** shift, literature, learn, scenarioSort, ownTurn, sentenceBuilder, output ("Your Real Thing"), portable, realWorldUse.
- **outputEditor:** yes (`:121-124`) — single `sentence` (text).
- **fidelity.correct:** "You said the genuine thing with enough clarity that it could actually land — without erasing yourself in agreement or apology." **notMeaning:** "This isn't about getting a reaction, scripting lines, or winning…"

All six Plays carry a 5-field `myPlaysTemplate`, a `portable[]` step list, and an `output` screen (validator-required).

---

## 5. Simulations — signal tags, reveal mechanism, JIT hooks, handoff

| Sim id | Signature | startNodeId | Signal tags (option → signal) | Reveal mechanism | teach.toPlayId | JIT hooks (node → lit id) |
|---|---|---|---|---|---|---|
| `sim-rd-shorter-texts` | evidenceTimeline | `m1` | reconsider `rc1` options carry `fidelity` fragments (not `signal`) | static `body` (label "New evidence") | `read-and-decide` | `c1`→`lit-jit-ambiguity-spiral` |
| `sim-wm-not-a-match` | conclusionNarrowing | `m1` | options use `processTag` (`jumped_to_conclusion`/`bounded_to_evidence`); reconsider `rc1` carries `fidelity` | static `body` (label "What this actually establishes") | `what-it-actually-means` | `c1`→`lit-jit-globalizing` |
| `sim-itr-evaluator-stance` | dualAttention | `itr-n1` | `itr-d1`.fit→`fit_kept`; `itr-d2`.fit→`fit_kept`; `itr-r1`.both→`held_both` | `body` + `computedSummary` resolver **`dualAttentionFocus`** (variants interest/evaluation_active/both) | `is-this-right-for-you` | `itr-n2`→`lit-jit-wanted-vs-compatible`; `itr-n4`→`lit-jit-respect-vs-fit`; `itr-note-r1-collapse`→`lit-jit-liking-vs-choosing` |
| `sim-rgu-decision-room` | decisionRoom | `rgu-n1` | `rgu-c1`.forever→`forever_read`; `rgu-r1` decide-now/let-settle→`distinguished`, hold-forever→`held_forever`; `rgu-c2` five stances→`stance:{rest,not_now,lightly_open,return_later,pause_decision}` | `body` + `computedSummary` resolver **`decisionRoomStance`** (variant = stance enum) | `rest-or-giving-up` | `rgu-n1`→`lit-jit-fatigue-not-verdict`; `rgu-c1`→`lit-jit-loneliness-signal`; `rgu-note-forever`→`lit-jit-rest-not-giving-up` |
| `sim-hmp-investment-view` | investmentView | `hmp-n1` | `hmp-d2`.more→`increase_at_lull`; `hmp-cap2`.new→`claimed_evidence_at_lull`, .nothing→`named_no_evidence` | `body` + **`recap`** (fromNode `hmp-d1`, `hmp-d2`, `hmp-d3`) | `how-much-to-put-in` | `hmp-n2`→`lit-jit-mutual-signal`; `hmp-n3`→`lit-jit-effort-outruns-evidence`; `hmp-d2`→`lit-jit-relational-space` |
| `sim-stt-rehearsal` | communicationRehearsal | `stt-n1` | all three decisions (via `phrasingOptions`): agree/soften→`erased`, clear→`clear`, apology→`buried` | 3 intermediate **`reactions`** spreads + final `computedSummary` resolver **`communicationRehearsalRecap`** (variants clear/mixed/erased) | `say-the-real-thing` | `stt-m1`→`lit-jit-self-editing`; `stt-m2`→`lit-jit-answer-is-information`; `stt-m3`→`lit-jit-kind-and-clear` |

> The two original sims use `processTag` + `fidelity`-fragment tagging; the four new sims use `signal` string tags. Both feed `aggregateFidelity` (see `05-…`).

---

## 6. Literature (Field Guide + JIT)

### Core Guides — `scope:"cluster", depth:"core"` (`moving-beyond-rejection-literature.ts`)
`lit-what-is-dfc`, `lit-being-chosen-weight`, `lit-want-vs-worth`, `lit-wanted-vs-compatible`, `lit-rejection-not-verdict`, `lit-uncertainty`, `lit-kinds-of-signal`, `lit-see-vs-act`, `lit-over-investing`, `lit-self-editing`, `lit-fatigue`, `lit-loneliness`, `lit-healthier` (13).

### Question Reads — `scope:"cluster", depth:"question"`
`lit-faq-why-nobody-chooses`, `lit-faq-not-enough`, `lit-faq-backup-option`, `lit-faq-are-they-interested`, `lit-faq-care-more`, `lit-faq-tired-of-dating` (6).

### Play-scope — `scope:"play"`
`lit-play-rd` (→ read-and-decide), `lit-play-wm` (→ what-it-actually-means) (2).

### Just-in-Time — `scope:"jit"`
- From MBR file: `lit-jit-globalizing`, `lit-jit-ambiguity-spiral`, `lit-jit-waiting-to-be-chosen`, `lit-jit-hope-vs-hurt` (4).
- From slices (12): ITR — `lit-jit-wanted-vs-compatible`, `lit-jit-respect-vs-fit`, `lit-jit-liking-vs-choosing`; RGU — `lit-jit-fatigue-not-verdict`, `lit-jit-loneliness-signal`, `lit-jit-rest-not-giving-up`; HMP — `lit-jit-mutual-signal`, `lit-jit-effort-outruns-evidence`, `lit-jit-relational-space`; STT — `lit-jit-self-editing`, `lit-jit-answer-is-information`, `lit-jit-kind-and-clear`.

> ⚠️ **ID confusion caution:** `lit-self-editing` (core) and `lit-jit-self-editing` (JIT) are **different entries**; likewise `lit-wanted-vs-compatible` (core) vs `lit-jit-wanted-vs-compatible` (JIT). Do not conflate.

`MBR_STATEMENT_MAP` (the "101-statement" content map) is in the same file and is validated by `playbook-literature.test.ts` (covers all 101 statements exactly once; `none` is exclusive; only RD+WM are routed to).

---

## 7. Missions — `moving-beyond-rejection-missions.ts` (`MBR_MISSIONS`)

| id | playId | title | rung id | suitability boundary |
|---|---|---|---|---|
| `mission-rd-read-before-react` (:13-31) | `read-and-decide` | "Read it before you react" | `decide` | "for ambiguity, not safety…" |
| `mission-wm-narrowest-true-thing` (:32-50) | `what-it-actually-means` | "Name the narrowest true thing" | `hold-with-feeling` | "bigger than one dating moment… mental health professional" |

Two missions total; each has one `progression` rung, `attemptMeaning`, and a `suitability` string. **The four new Plays have no missions.**

---

## 8. Use Reviews — `moving-beyond-rejection-usereviews.ts` (`MBR_USE_REVIEWS`)

Six reviews, one per Play, each with four bounded prompts (`didDifferently` multi, `performedOperation` single→Technique Fidelity, `becameClearer` multi, `stuckWhere` single):

| id | playId | line | status |
|---|---|---|---|
| `review-read-and-decide` | `read-and-decide` | :18 | OWNER-APPROVED AND IMPLEMENTED |
| `review-what-it-actually-means` | `what-it-actually-means` | :57 | OWNER-APPROVED AND IMPLEMENTED |
| `review-is-this-right-for-you` | `is-this-right-for-you` | :96 | **Authored FOR REVIEW (#49) — not owner-approved** |
| `review-rest-or-giving-up` | `rest-or-giving-up` | :135 | **Authored FOR REVIEW (#49) — not owner-approved** |
| `review-how-much-to-put-in` | `how-much-to-put-in` | :174 | **Authored FOR REVIEW (#49) — not owner-approved** |
| `review-say-the-real-thing` | `say-the-real-thing` | :213 | **Authored FOR REVIEW (#49) — not owner-approved** |

`performedOperation.options` are always `["Pretty closely","Some of it","Not really this time"]` (→ yes/partly/no). The `didDifferently`/`becameClearer`/`stuckWhere` labels are identical wording across reviews; `performedOperation.label` is Play-specific.

---

## 9. My Plays templates & Change Path configuration

- **My Plays templates:** each Play's `myPlaysTemplate` (five fields: when/move/lookingFor/watchOut/remember) is the saved-card shape; `recordOutput` derives a `SavedPlayCard` from it (`progressActions.recordOutput` → `cardFor` → `deriveUserLine`).
- **Change Path configuration:** there is no Cluster-1-specific Change Path *content*; Change Path is generic orchestration reading the reader's progress signals (`changePath.ts`). Its only cluster-1-specific coupling is the special-case for `read-and-decide` when `reviewStuck === "Acting on what I already saw"` (`changePath.ts:132`) and the RD→other-pattern reviewed routing — otherwise it is content-agnostic. See `06-…`.

---

## 10. Rev 3 copy transform (not new content)

`moving-beyond-rejection-rev3-copy.ts` — `rev3Play(play)` (`:169-174`) applies **copy-only** tightening on the Rev 3 path: it filters out `literature` screens (`:171`), tightens the RD/WM Shift copy (`tightenRD`/`tightenWM` — only those two playIds; others identity-passed), and swaps the `severe-self-worth` signpost body. It changes **wording only** — ids, structure, `correctBucket`, actions, and fidelity are preserved. Verified by `playbook-rev3copy.test.ts` ("v0 content is untouched"; "structure/logic preserved — only wording changes").
