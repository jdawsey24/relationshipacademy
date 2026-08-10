# 01 — Sources of Truth & Current Status

**Verified against:** working tree of branch `main`, `HEAD = 9429246` ("playbook(rev3): Step 8 orchestration corrections"), on the date the package was produced.

---

> ### ⚠ Correction — 2026-08-09
>
> **The consumer name is now "Finding Love That Feels Mutual".** This package records it as
> "Believing You're Worth Being Chosen", which was correct when the package was written and is
> not any more.
>
> The Experience Clusters workbook was revised and applied. `snapshot_clusters`
> now carries `playbook_subtitle = "Finding Love That Feels Mutual"` for cluster 1, and
> `content/playbook/moving-beyond-rejection.ts` was updated to match — both its
> `displayName` and the opening screen's title.
>
> This also retires the discrepancy this package documents. The earlier ruling —
> that the code was renamed **in code only** while the database and marketing
> were held on "Moving Beyond Rejection" — no longer describes anything: all
> three surfaces now agree, and none of them says "Moving Beyond Rejection".
>
> **The key did not change.** `moving-beyond-rejection` is still the stable
> identifier in URLs, purchases and saved progress, so every path, filename and
> key in this package is still accurate.
>
> Nothing else in the package was rewritten. It is an as-built record of what
> was true when it was produced; this note says what changed since.

---


## 1. Executive status — the seven distinct states (do NOT collapse)

| State | Value | Evidence |
|---|---|---|
| **Design complete** | ✅ Yes (with one exception) | All 6 Experience graphs + 6 Play specs authored & owner-approved (DECISION-LOG #19–#27, #31–#38). **Exception:** the 4 new Plays' Use Reviews are authored **FOR REVIEW, not owner-approved** (#49). |
| **Implementation complete** | ✅ Yes — ⚠️ **uncommitted** | Phases A–D done; six signatures run end-to-end (#44, #45). All in the **working tree**; not committed (see §4). |
| **Migration complete** | ⚠️ Owner says run; file says "not run" | Owner confirmed `0053` ran (#45/#46, and a live read-only check found all five columns present). **Discrepancy:** `supabase/migrations/0053_playbook_events.sql:3` still reads "⚠️ AUTHORED, NOT RUN." See `14-…`. |
| **Automated validation complete** | ✅ Yes | Latest reported: **376/376 tests green, `tsc --noEmit` clean, `npm run build` green** (#52, #53). |
| **Owner E2E accepted** | 🟡 Partial | Non-authenticated preview walkthrough of all six pathways: **PASS** (#46). **Authenticated DB save→reload round-trip: NOT verified** (auth-gated; no credentials). = **OWNER E2E NOT YET VERIFIED** for the persistence round-trip. |
| **Deployed** | ❌ No | Nothing deployed at any phase (#39–#53). |
| **Production feature flag enabled** | ❌ No | `PLAYBOOK_REV3_ENABLED` is `false` unless `NEXT_PUBLIC_PLAYBOOK_REV3 === "true"`; OFF by default; not enabled in production (`lib/playbook/rev3.ts:11`). |

**Attorney review:** not represented anywhere in the repository. Treat as **not evidenced** (do not claim performed).

---

## 2. Naming (verified)

| Layer | Value | Source |
|---|---|---|
| Snapshot cluster | "Difficulty Feeling Chosen", `cluster_id = 1` | `lib/playbook/keys.ts:11-13` |
| Stable playbook key | `moving-beyond-rejection` | `content/playbook/moving-beyond-rejection.ts:34`; `keys.ts` |
| Consumer product title (code `displayName`) | **"Believing You're Worth Being Chosen"** | `moving-beyond-rejection.ts:36` | _(superseded 2026-08-09 — see the correction note in `README.md`.)_
| Marketing / legacy name | "Moving Beyond Rejection" (the key and older marketing copy) | key value; memory note |

> **~~Documented discrepancy (not repaired)~~ — RETIRED 2026-08-09, see the correction note at the top of this file:** the consumer title was renamed to "Believing You're Worth Being Chosen" **in code only**. The DB `playbook_subtitle` and marketing page were intentionally held on the older "Moving Beyond Rejection" naming until the Rev 3 launch. The code `displayName` and the marketing surface therefore differ by design. (Owner ruling; see the project memory `cluster1-title-rename`.)

---

## 3. Source-of-truth hierarchy (authoritative order)

When any two disagree, the **higher** wins. **Code never redefines the framework.**

1. **RLC framework** — the canonical RLC manuals, the Behavioral Code Book, and RLC intervention-development standards (the theory of Problem Expressions, Functional Interference, Change Targets, intervention mechanisms, Technique Fidelity vs Transfer, suitability tiers). *These are external to this repository and are the top authority.*
2. **Approved cluster specification + Decision Log** — the frozen, owner-approved Cluster 1 design: `artifacts/playbook-experience/*` (Experience graphs, Play specs, design packs) and `artifacts/playbook-experience/DECISION-LOG.md` (53 entries).
3. **Implementation** — the current code, content, tests, and migrations in this repository (the working tree). Implements #2; it does not *define* #1 or #2.
4. **Historical / superseded drafts** — the retired v1 linear model artifacts (kept as source only; see §5).

---

## 4. ⚠️ Commit status — critical for every "as-built" claim

`HEAD` on `main` is `9429246` ("Step 8 orchestration corrections"), which is the **original two-Experience Rev 3 build** (`evidenceTimeline` + `conclusionNarrowing`). **Everything from Phase A onward is present only in the working tree, uncommitted:**

- **Modified (tracked) files** include: `lib/playbook/{contentSchema,simulation,sanitize,progress,events,changePath,progressActions,types}.ts`, `components/playbook/{ExperienceShell,ChangePathHome,SimulationPlayer,SimulationSignatures,UseReviewFlow}.tsx`, `content/playbook/{moving-beyond-rejection,moving-beyond-rejection-usereviews}.ts`, and ~14 test files.
- **Untracked (new) files** include: the four slice content files `content/playbook/{is-this-right-for-you,rest-or-giving-up,how-much-to-put-in,say-the-real-thing}.ts`, four new signature tests, and `app/playbook-preview/`.
- **Committed** already: migration `0053_playbook_events.sql` (tracked).

**Implication:** the "as-built" documented in this package is the **working-tree state**, which is the current, runnable, test-passing state — but it does **not** yet exist in any commit on `main`. Committing (or a PR) is an outstanding, un-flagged housekeeping step. This is a `SUPERSEDED`-style gap between `HEAD` and the working tree, recorded here so no downstream reader mistakes `HEAD` for the current implementation.

---

## 5. Repository sources of truth (files)

### Approved cluster specification — `artifacts/playbook-experience/`
- `DECISION-LOG.md` — 53 numbered entries (approvals, rulings, milestones, code, changes). The canonical decision record.
- **Experience graphs (approved):** `cluster-1-experience-graph-{is-this-right-for-you,rest-or-giving-up,how-much-to-put-in,say-the-real-thing}-v1.md` (+ the design pack `cluster-1-experience-design-pack-remaining-four-v1.md`).
- **Play specs (approved):** `cluster-1-play-spec-{is-this-right-for-you,rest-or-giving-up,how-much-to-put-in,say-the-real-thing}-v1.md` (+ `cluster-1-play-design-pack-remaining-four-v1.md`).
- **SUPERSEDED v1 linear design (kept as source only):** `cluster-1-difficulty-feeling-chosen-design-v1.md`, `cluster-1-difficulty-feeling-chosen-ux-architecture-v1.md`, `cluster-1-content-architecture-and-copy-v1.md`. Retired as product shape by DECISION-LOG #14.
- **Pivot document:** `cluster-1-playbook-architecture-v2.md` (retires the linear model; defines the Play-Board shape).

### Architecture / content reference docs — `docs/`
- `docs/playbook-architecture-rev3.md` — the canonical Rev 3 product architecture (process-state model §1, layers).
- `docs/playbook-cluster1-changepath.md`, `-integrate-content.md`, `-practice-content.md`, `-simulations-content.md`, `-rev3-end-to-end.md` — Cluster 1 content/flow references.
- `docs/playbook-commerce.md` — the Playbook is a **paid** product (Stripe `playbook_onetime`); owning one discounts the Companion (entitlement-gated; see `playbook-cta.interaction.test.ts`).

### Implementation (current code) — the working tree
- **Schema/engine:** `lib/playbook/contentSchema.ts`, `contentValidate.ts`, `simulation.ts`, `processState.ts`, `changePath.ts`, `rev3Flow.ts`, `mission.ts`, `progressActions.ts`, `sanitize.ts`, `progress.ts`, `events.ts`, `clientEvents.ts`, `crisisSafety.ts`, `keys.ts`, `rev3.ts`, `types.ts`, `outputSummary.ts`, `sortLogic.ts`.
- **Components:** `components/playbook/*` (`ExperienceShell`, `ChangePathHome`, `SimulationPlayer`, `SimulationSignatures`, `PlayContainer`, `PlaySequence`, `OutputEditor`, `MissionCard`, `UseReviewFlow`, `FieldGuide`, `SortEngine`, `useProgress`).
- **Content:** `content/playbook/moving-beyond-rejection.ts` (registry) + slice files + `-literature.ts`, `-simulations.ts`, `-missions.ts`, `-usereviews.ts`, `-rev3-copy.ts`, `index.ts`.
- **API:** `app/api/playbook/[key]/{progress,screen,access}/route.ts`.
- **Migrations:** `supabase/migrations/0052_playbook_progress.sql`, `0053_playbook_events.sql`.

### Tests — `test/playbook-*.test.ts`
33 playbook test files (inventory in `10-…`). Latest reported total: **376/376 green**.

---

## 6. What the Relationship Playbook™ is (and is not)

The **Relationship Playbook™** is a **distinct, paid application-layer product** (DECISION-LOG #4). It turns a recognized RLC pattern into **rehearsable, savable behavioral tools** the reader can use in real life. It is *not* the other RLC surfaces:

| Product | Role (boundary map, DECISION-LOG #4) |
|---|---|
| **Snapshot** | Recognition — identifies which pattern/cluster is present. |
| **Relationship Playbook™** | **Application** — rehearses and applies the specific behavioral operations for a cluster. |
| **Companion** | Navigation — guided, situation-by-situation processing (separate PWA). |
| **Academy** | Education — member learning portal. |

Cluster 1 is the **first and reference** Playbook implementation. See `README.md` §"What Claude Chat Should Learn From Cluster 1" for the framing that Cluster 1 is a *reference implementation, not a universal template*.
