# 09 — Build Sequence & Decision Traceability

**Status:** AS BUILT + historical. Reconstructed from `git log` and `artifacts/playbook-experience/DECISION-LOG.md` (53 entries).

The lesson this section exists to teach: **a future cluster should be fully designed and owner-approved before Claude Code begins implementation.** Cluster 1 followed exactly that shape — design/approval (Steps 1–8 and the four-Experience graphs/specs) came before any code, and every code phase returned for review.

---

## 1. Git commit chronology (committed history, `main`)

The committed history ends at the original two-Experience Rev 3 build. (Everything after Phase A is in the working tree, uncommitted — see `01-…` §4.)

| Commit | Meaning |
|---|---|
| `0f3f4a5` | **Original prototype** — "interactive Difficulty Feeling Chosen experience — first build (engine + 2 Plays)" |
| `0818a6f`–`af0f669` | prototype fixes, tests, sufficiency branch + Keep/Update loop |
| `eedb997` | **Rev 3 Step 1** — schema/state/events registry (flag-gated, additive) |
| `ad925e3` | Rev 3 Step 2 — interaction registry refactor (behavioral + persistence parity) |
| `642d4f3`, `04b6aca` | Rev 3 Step 3 — Understand layer (literature + field guide) |
| `a5703ee`, `73360a3`, `0240ca0` | Rev 3 Step 4 — deterministic simulation engine + signatures |
| `a41da95`, `02fa2f4` | Rev 3 Step 5 — Plays follow their simulation + literature extracted |
| `7955d66`, `38ace35` | Rev 3 Step 6 — Practice (Mission) layer |
| `7f7037a`, `9fa0819` | Rev 3 Step 7 — Integrate (structured Use Review) |
| `af75e23`, **`9429246`** (HEAD) | Rev 3 Step 8 — Change Path orchestrator + resuming home/IA |

**Working tree (uncommitted)** = HEAD + the four new Experience/Play slices + Phase A–D + owner-requested changes (#39–#53).

---

## 2. Decision-log phase chronology (design → code)

| Phase | Decision-log entries | What happened | Test count / build |
|---|---|---|---|
| **Original prototype** | #1–#13 | v1 linear design → UX → content copy → "Difficulty Feeling Chosen" prototype built on branch `playbook-dfc-prototype` (16-screen state machine + two-lane Reciprocity Timeline). | *design/proto; not stated* |
| **Architecture pivot v1→v2** | #14–#16 | Linear 21-screen PRESENT→OBSERVE→DECIDE model **RETIRED as product shape**; replaced by Play Board / Candidate Behavioral Pathways → Activated Play → My Plays. Cross-Cluster rule unchanged. | *not implemented* |
| **Rev 3 / Experience graphs** | #17–#27 | Six-signature Experience set authored & approved (design pack w/ 7 owner decisions #17; four graphs one at a time #19/#21/#24/#26; signal-name ruling #23). Milestone #27. | *design phase* |
| **Roadmap approved** | #28 | Phases A/B/C/D approved: design 4 Plays first; extend `reveal` node (not new kind); in-session persistence for v1 (defer 0053). | — |
| **Phase A — design 4 Plays** | #29–#38 | Play design pack (#29) + direction/rulings (#30); four Play specs authored & approved (#31/#32, #33/#34, #35/#36, #37/#38). **Phase A COMPLETE (#38).** | *design deliverables* |
| **Phase B1 — signature-tagged union** | #39 | `FidelityOutcome` discriminated union; `ChosenStance`; `InteractionKind` additions; events schemaVersion 2→3. | **327/327**, build green |
| **Phase B2 + C.1 dualAttention** | #40 | reusable `signal` tags + extended `reveal` node + resolver registry; dualAttention aggregator + slice content. | **336/336 (+9)**, build green |
| **Phase C.2 decisionRoom** | #41 | aggregator + `decisionRoomStance` resolver + content. | **345/345 (+9)** |
| **Phase C.3 investmentView** | #42 | aggregator w/ round-context tags; `recap` reveal + content. | **353/353 (+8)** |
| **Phase C.4 communicationRehearsal** | #43 | `selectedSignalCounts` multiset + `communicationRehearsalRecap` + content. | **360/360 (+8)** |
| **Milestone B+C complete** | #44 | Six-signature set runs E2E behind flag. | **360/360**, build green |
| **Phase D — persistence** | #45 | `sanitize.ts`/`progress.ts` carry the 5 Rev 3 columns; owner confirmed `0053` ran. **Authenticated round-trip NOT verified.** | **364/364 (+4)** |
| **E2E verification** | #46 | Non-authenticated preview walkthrough of all 6 pathways PASS; live check confirmed the 5 columns exist. Auth round-trip still unverified. | **364/364** |
| **Owner-requested changes** | #47–#53 | multi-log (#47); Home+MyPlays surfacing (#48); **4 new Use Reviews authored FOR REVIEW (#49)**; rename + optional free-text (#50); history view (#51); Home "View all" + MyPlays Edit + back-nav bugfix (#52); modal editor bugfix (#53). | up to **376/376** |

---

## 3. Superseded / overridden decisions (explicit)

- **#14 supersedes #5, #12, #13** and the entire linear-model design: the PRESENT→OBSERVE→DECIDE 21-screen product shape is **RETIRED** (kept only as source). This is the one hard supersession.
- **#23** overrides a provisional signal name: `compensatory_effort_recognized` → **`effort_without_new_evidence_noticed`** (do-not-revert ruling).
- **#19 / #21** override provisional field/enum names inside their own graphs: `fit_information_used` → `fit_information_kept_in_view`; `reacting` → `pause_decision`; `deliberate_decision_made` → `intentional_stance_selected`.
- **#47** overrides the original once-per-Play overwrite behavior (single review → append list).
- **#50** overrides the #47/#48 label ("Log a Real-Life Use" → "Log a real-life experience") and relaxes the "bounded selects, no journaling" rule with the owner-approved optional free-text exception.
- **#49** closes the content gap flagged in **#48**.
- No entry is literally tagged "SUPERSEDED"; #14 is the sole hard supersession of prior design.

---

## 4. As-designed vs as-built audit

**Status labels:** `AS BUILT` · `OWNER-APPROVED AND IMPLEMENTED` · `OWNER-APPROVED BUT NOT IMPLEMENTED` · `DEFERRED` · `SUPERSEDED` · `OWNER E2E NOT YET VERIFIED`.

| Approved requirement | Decision-log ref | Current implementation | Status | Variance |
|---|---|---|---|---|
| Signature-tagged discriminated `FidelityOutcome`, no generic score | #17 | `contentSchema.ts:317-322` | OWNER-APPROVED AND IMPLEMENTED | — |
| Add `dualAttention`/`decisionRoom`/`investmentView`/`communicationRehearsal` to `InteractionKind` | #17 | `contentSchema.ts:227-236` | OWNER-APPROVED AND IMPLEMENTED | — |
| Extend the `reveal` node (not a new node kind) | #28 | `contentSchema.ts:375-383, 344-358`; `simulation.ts:171-216` | OWNER-APPROVED AND IMPLEMENTED | — |
| `dualAttention` graph (Is This Right for You?) incl. respect/treatment exclusion, observed-choices mirror, `fit_information_kept_in_view` | #19 | `is-this-right-for-you.ts`; `simulation.ts:126-133` | OWNER-APPROVED AND IMPLEMENTED | — |
| `decisionRoom` graph incl. `pause_decision`, `intentional_stance_selected`, persist fidelity pair + `chosen_stance` | #21 | `rest-or-giving-up.ts`; `simulation.ts:134-141` | OWNER-APPROVED AND IMPLEMENTED | — |
| `investmentView` `effort_without_new_evidence_noticed` name | #23 | `simulation.ts:149`; `contentSchema.ts:321` | OWNER-APPROVED AND IMPLEMENTED | — |
| `investmentView` graph (3 rounds, space-creation guardrail, no free text) | #24 | `how-much-to-put-in.ts` | OWNER-APPROVED AND IMPLEMENTED | — |
| `communicationRehearsal` graph (3 low-risk moments, select-a-phrasing, 3 fixed reactions) + signal names | #26 | `say-the-real-thing.ts`; `simulation.ts:152-161` | OWNER-APPROVED AND IMPLEMENTED | — |
| Four Play specs (ITR/RGU/HMP/STT), `outputEditor` per ruling | #30–#38 | slice files; `is-this-right-for-you` has **no** editor | OWNER-APPROVED AND IMPLEMENTED | — |
| Phase D persistence (5 columns, sanitizer, load/save) | #28, #45 | `sanitize.ts`, `progress.ts`, `types.ts`, migration `0053` | OWNER-APPROVED AND IMPLEMENTED | **Migration ran per owner (#45) but `0053` header still says "AUTHORED, NOT RUN"** — stale comment. |
| Multi-log real-life experiences (append list, cap 50) | #47 | `progressActions.ts:108-115`; `contentSchema.ts:515-521` | OWNER-APPROVED AND IMPLEMENTED | — |
| Surface logging on Home + My Plays + history + View all + Edit | #48, #51, #52 | `ChangePathHome.tsx`, `ExperienceShell.tsx` | OWNER-APPROVED AND IMPLEMENTED | — |
| Rename → "Log a real-life experience" + optional crisis-screened free-text note | #50 | `UseReviewFlow.tsx`, `sanitize.ts:185` | OWNER-APPROVED AND IMPLEMENTED | Deliberate exception to "bounded selects, no journaling." |
| **Use Reviews for the 4 new Plays** | #49 | `moving-beyond-rejection-usereviews.ts` (6 reviews) | **OWNER-APPROVED BUT NOT [FULLY] APPROVED** — *authored FOR REVIEW, copy not owner-approved* | Content present & tested, but the copy has not received owner content approval (unlike the 2 originals). |
| **Missions for the 4 new Plays** | (implied by Practice layer) | none — only RD & WM missions | **OWNER-APPROVED BUT NOT IMPLEMENTED** (no Mission authored) | The four new pathways have no Practice/Mission; their Change Path stops at "practice in real life" generic. |
| Append-only `playbook_events` longitudinal store | 0053, events.ts | table + validators exist; **producer route not wired** | **DEFERRED** | `progress.ts:89` seam only; no live event writes. |
| Authenticated DB save→reload round-trip | #45, #46 | code path unit-tested; live auth path unrun | **OWNER E2E NOT YET VERIFIED** | Requires owner sign-in. |
| Linear 21-screen PRESENT→OBSERVE→DECIDE product | #5, #13 | retired | **SUPERSEDED** (#14) | Kept only as source artifacts. |
| Consumer title "Believing You're Worth Being Chosen" | rename | `displayName` in code only | AS BUILT (code) | DB `playbook_subtitle` / marketing held on "Moving Beyond Rejection" — intentional (see `01-…`). |
| Working-tree commit | — | uncommitted on `main` | **variance** | HEAD is Step 8; Phase A–D uncommitted. |

### Flagged items (documented, **not repaired** in this task)
- **Obsolete comment:** `0053` header "AUTHORED, NOT RUN" contradicts owner confirmation it ran.
- **Provisional/authored-not-approved content:** the four new Plays' Use Reviews (#49) — copy is candidate.
- **Unimplemented approved behavior:** no Missions for the four new Plays; `playbook_events` producer not wired.
- **Validator coverage gap:** `validatePlaybookContent` does not validate Simulations/Missions/UseReviews/Literature (only Plays + recognition cards) — see `03-…` §8.
- **Behavior not clearly tied to a single approval:** the `read-and-decide` Change-Path special-case (`changePath.ts:132`, `reviewStuck === "Acting on what I already saw"`) is a reasonable content coupling but is a cluster-1-specific hardcode; note for future clusters.
- **Uncommitted working tree:** the entire current implementation is uncommitted on `main`.
