# 14 — Open Gates, Known Limitations & Owner Decisions

**Status:** current, verified against the working tree. Nothing here is a claim of completion where verification has not occurred.

---

## 1. Owner-gated / unverified (do NOT claim complete)

| Gate | Status | Evidence / where |
|---|---|---|
| **Authenticated DB round-trip** (signed-in save→reload against production Supabase) | **OWNER E2E NOT YET VERIFIED** | Code path unit-tested (`playbook-progress.test.ts` Phase D); a read-only live check confirmed the 5 `0053` columns exist (#46); the authenticated write→reload was never driven (auth-gated, no credentials). |
| **Owner E2E acceptance** (full) | 🟡 Partial | Non-authenticated preview walkthrough PASS (#46); authenticated persistence not accepted. |
| **Production deployment** | ❌ Not done | Nothing deployed at any phase. |
| **Production feature flag** (`PLAYBOOK_REV3_ENABLED`) | ❌ Off | OFF by default; not enabled in production (`rev3.ts:11`). |
| **Attorney / legal review** | **Not evidenced in-repo** | No sign-off artifact exists in the repository. Do not claim performed. |
| **Working-tree commit** | ⚠️ Uncommitted | HEAD `9429246` is the Step-8 two-Experience build; all Phase A–D + owner changes are uncommitted (`01-…` §4). |

---

## 2. Known content gaps

| Gap | Detail | Decision-log |
|---|---|---|
| **Four new Plays' Use Reviews are FOR REVIEW, not owner-approved** | `review-{is-this-right-for-you,rest-or-giving-up,how-much-to-put-in,say-the-real-thing}` are authored + tested, but the copy has not received owner content approval (the two originals did). | #49 |
| **No Missions for the four new Plays** | Only `read-and-decide` and `what-it-actually-means` have Missions. The four new pathways have no Practice/Mission layer; Change Path stops at generic "practice in real life." | (implied) |
| **Content validator coverage gap** | `validatePlaybookContent` validates only Plays + recognition cards. Simulations, Missions, Use Reviews, Literature, and StatementMap are **not** build-time validated (covered by tests + `validateSimulation` only). | `03-…` §8 |

---

## 3. Known technical debt / provisional items

| Item | Detail |
|---|---|
| **Stale migration comment** | `0053_playbook_events.sql:3` still reads "⚠️ AUTHORED, NOT RUN," but the owner confirmed it ran (#45/#46). The comment contradicts reality; not repaired in this audit task. |
| **`playbook_events` producer not wired** | The events table + validators + client writer exist, but no live event-emit route is wired; `progress.ts:89` is a seam only. Longitudinal events are DEFERRED. |
| **RD Change-Path hardcode** | `changePath.ts:132` special-cases `read-and-decide` on `reviewStuck === "Acting on what I already saw"`. Cluster-1-specific; parameterize before generalizing. |
| **Naming collision (documentation hazard)** | Code comments use `R1/R2/R3/R4` as release-phase markers, unrelated to the RLC R1/R2/R3 suitability tiers (`08-…` §1). |
| **Consumer-title split** | `displayName` = "Believing You're Worth Being Chosen" (code) vs DB `playbook_subtitle`/marketing "Moving Beyond Rejection" — intentional hold until launch (`01-…` §2). | _(superseded 2026-08-09 — see the correction note in `README.md`.)_
| **Provisional IDs** | None outstanding — the four slice objects finalized their ids during Phase C (sim ids `sim-itr-evaluator-stance`, `sim-rgu-decision-room`, `sim-hmp-investment-view`, `sim-stt-rehearsal`; play ids match the slugs). |

---

## 4. Historical / compatibility behavior retained

| Item | Detail |
|---|---|
| **v0 product preserved** | With the flag off, the original Plays-only product renders unchanged (opening, board, v0 "I used this in real life" Keep/Update dialog). Tests enforce v0 is untouched. |
| **Legacy single-object Use Review coercion** | `reviewEntries`/`sanitizeUseReviewState` coerce a pre-multi-log single review object into a one-element list, so old data survives the #47 change. |
| **`processTag` + `fidelity`-fragment tagging (original sims)** vs **`signal` tagging (new sims)** | Both mechanisms coexist by design; `aggregateFidelity` dispatches per signature. |
| **Superseded v1 linear model** | Retained only as source artifacts (`cluster-1-difficulty-feeling-chosen-*-v1.md`); RETIRED as product shape (#14). |

---

## 5. Known accessibility / manual-testing needs

- Automated a11y coverage exists for SortEngine, FieldGuide, and the recognition/board states (axe). **Manual** screen-reader and mobile-device passes across the four new Experiences/Plays are **not evidenced** as completed and should be part of owner E2E (`13-…` step 13).
- Browser verification during development used the dev preview harness; a production-like device/assistive-tech sweep remains a manual gate.

---

## 6. Owner decisions that shape the implementation (durable)

These are settled owner rulings the implementation depends on; a future cluster inherits the *principles*, not the specific values:
- Signature-tagged `FidelityOutcome`, no generic score (#17).
- Extend the `reveal` node rather than add a node kind (#28).
- One canonical name per fidelity signal, no aliases (#30); observable names, not causal inferences (#23).
- "Give a little less" is legitimate (never withdrawal/game-playing) (#17/#24).
- `pause_decision` is a co-equal legitimate stance; ordinary "never going to happen" is not a signpost trigger (#21).
- Persist only the bounded `chosen_stance` enum + fidelity pair for decisionRoom (#17/#21).
- Say the Real Thing is strictly R1/low-risk; success is never "did they like it" (#26).
- Multi-log real-life experiences; optional crisis-screened free-text note is the one journaling exception (#47/#50).
- In-session persistence was v1; durable persistence (migration 0053) was a separate owner-gated phase (#28/#45).

---

## 7. What must NOT be claimed

- ❌ "Deployed" / "live in production" — it is not.
- ❌ "Production flag enabled" — it is not.
- ❌ "Authenticated persistence verified" — it is not.
- ❌ "Attorney-reviewed" — not evidenced.
- ❌ "Committed on main" — the current implementation is uncommitted.
- ❌ "All content owner-approved" — the four new Use Reviews are FOR REVIEW only.
