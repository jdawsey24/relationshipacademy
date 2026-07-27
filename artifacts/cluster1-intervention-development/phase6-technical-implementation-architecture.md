# Relationship Playbook™ · Difficulty Feeling Chosen — Phase 6 (Rev 2)
## Technical Implementation Architecture & Build Specification

## 0. REV 2 — REQUIRED ARCHITECTURAL REVISIONS (applied before build; authoritative)
Approved with the following required revisions; each is applied in the sections noted.
| # | Revision | Applied in |
|---|---|---|
| **R1** | **Stable string identifiers** independent of numeric cluster IDs: **`playbook_key`** (e.g. `"difficulty-feeling-chosen"`) keys content/routing/progress; **`play_id`** (e.g. `"read-and-decide"`, `"what-it-actually-means"`) keys each Play — never technique codes, ordinals, or the numeric cluster. **The numeric `cluster_id` stays ONLY as the entitlement/commerce link** (a `cluster_id ↔ playbook_key` map lives in `lib/snapshot/playbooks.ts`). | §1, §3, §4, §5, §8 |
| **R2** | **Versioning** on three things: **`playbook_version`** (content module), per-Play **`play_version`**, and **`output_schema_version`** (stamped on every stored output). Stored progress records the versions under which its data was produced, so content/output-shape can evolve additively. | §3, §4, §5 |
| **R3** | **Keep current-state persistence for MVP** (`playbook_progress` snapshot), **and design (do NOT build) a clean future path for an append-only intervention-use / process-event log** (`playbook_events`). The seam is reserved now; MVP writes current-state only. | §3, §10 |
| **R4** | **Separate two safety layers explicitly:** (a) **Crisis Safety Detection** — a shared, cross-Play/cross-cluster service (Safety V2 engine on free-text → crisis resources); (b) **Play-specific support/signpost** — content-driven routing per Play (e.g. T1a severe-self-worth signpost, T3a unsafe-relationship exclusion). Independent modules, independent triggers; both may fire. | §9 |
| **R5** | **First implementation = ONLY the two screen-complete Plays** (`read-and-decide`, `what-it-actually-means`) + the universal engine. | §13, §14 |
| **R6** | **The other four Plays must complete the same full content/design + human-approval process (Phase-5/5B depth) before any implementation.** Until then they are light-spec only and are **not built.** | §13, §14 |
| **R7** | **Interactive + PDF coexist for MVP**, with **interactive as the PRIMARY experience** and **PDF as a supporting/offline artifact** (resolves prior open decision #1). | §2, §15 |
| **R8** | **All standing constraints retained:** no production deploy without explicit instruction · owner runs migrations · no Snapshot/scoring/commerce/framework/intervention change · the 333 records untouched · not attorney-reviewed (Owner Risk Acceptance only). | §12, §14, Readiness |

**Status:** PHASE 6 build specification for human review — **Rev 2 (approved-with-revisions).** **Specification only — no code, migrations, or
deploy in this phase** (consistent with the staged pattern; code lands on a branch in the implementation step,
never straight to production). Governing design: frozen Intervention Architecture v1.0; Phase 4 (L1–L6);
Phase 5 + 5B (two screen-complete prototype Plays + universal slotted container + shared sort engine).

**Grounding (verified in repo):** Next.js **15.1.6** (App Router) · React **19** · `@supabase/supabase-js`
**2.45** · Tailwind **3.4** · Netlify. Existing playbook surface = **checkout + gated PDF download**
(`app/(site)/playbooks/[slug]`, `app/api/playbooks/checkout`, `app/api/playbooks/[cluster]/download`) gated by
**`playbook_entitlements`** (migration `0042`; one row per (user, cluster_id); RLS own-row read; service-role
writes; a playbook = a Snapshot `cluster_id`; helpers in `lib/snapshot/playbooks.ts`). Latest migration =
`0051` → next = **`0052`**. **Difficulty Feeling Chosen = cluster_id 1.**

**Thesis:** the interactive Playbook is a **new *delivery mode* for the existing entitlement** — it reuses
`playbook_entitlements` (no new commerce), adds a content layer + a functional-progress store, and is a
**deterministic, no-LLM-at-runtime** experience. Build the **universal shell + shared sort engine once**;
author Cluster-1 content into it (Phase 5B Deliverable 24).

---

## 1. Architecture Overview
```
Snapshot (owns cluster result) ──▶ /playbooks/[slug] (existing marketing + checkout)
                                        │  Stripe one-time → webhook → playbook_entitlements (cluster_id=1)
                                        ▼
   NEW: interactive delivery  ──▶ /playbook/1  (entitlement-gated app experience)
        Server (RSC): gate + initial state    Client: experience shell (state machine)
        Content: typed TS content module (git-versioned, frozen design)     [no DB content, no LLM]
        Persistence API: /api/playbook/1/progress  ↔  playbook_progress (new, RLS own-row)
        Safety: reuse Safety V2 engine on short free-text → support signpost
```
Two layers, cleanly split: **Universal Playbook Engine** (reusable across 27 clusters) + **Cluster-1 Content
Module** (authored). Access piggybacks on the existing entitlement; commerce is untouched.

## 2. Access / Entitlement (reuse, don't rebuild)
- **Gate:** the interactive route requires a signed-in member **and** an active `playbook_entitlements` row for
  `cluster_id = 1`. Reuse `requireMember()` (`lib/academyAuth`) + `hasPlaybook()` and a new
  `ownsPlaybook(userId, clusterId)` helper reading `playbook_entitlements` (own-row RLS or service-role).
- **No commerce change:** checkout, Stripe price, webhook grant, and the PDF download route are untouched. The
  interactive experience is offered **in addition to** (or eventually in place of) the PDF for owners.
- **Not-owned state:** show the marketing/purchase entry (existing `/playbooks/difficulty-feeling-chosen`), not
  the experience.
- **Auth requirement rationale:** persistence (My Plays, outputs, states) must attach to an account — the
  experience is not usable anonymously if progress is to be saved. (A read-only "preview" of Play 1 without
  save could be a future teaser; not MVP.)
- **(R7) Interactive is PRIMARY; PDF is a supporting artifact.** For owners, the interactive experience is the
  primary way to use the playbook; the existing gated PDF **coexists** as a supporting/offline artifact (and
  fallback). Owner entry points (post-purchase, account, `/playbooks/[slug]`) lead to the interactive
  experience first, with the PDF offered as "also available." No commerce/PDF code changes.
- **(R1) Identifier boundary:** the numeric **`cluster_id` is used ONLY for entitlement/commerce** (unchanged
  `playbook_entitlements`). Everything else — content, routing, progress, analytics — keys on the stable
  **`playbook_key`** resolved via a `cluster_id ↔ playbook_key` map in `lib/snapshot/playbooks.ts`
  (`cluster_id 1 ↔ "difficulty-feeling-chosen"`).

## 3. Data / Persistence — migration `0052_playbook_progress.sql` (proposed; additive, RLS-locked)
**Principle (Phase 4 D14): functional data only — no emotional journaling.** **Current-state persistence for
MVP (R3):** one row per (user, `playbook_key`); per-play state + user-authored *outputs* keyed by **`play_id`**
(R1) and version-stamped (R2).
```sql
create table public.playbook_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  playbook_key       text not null,                 -- R1: stable key, e.g. 'difficulty-feeling-chosen' (NOT cluster_id)
  playbook_version   integer not null default 1,    -- R2: content module version this row was produced under
  recognized         jsonb not null default '[]',   -- pathway ids the user tapped ("sounds like me")
  play_states        jsonb not null default '{}',   -- { play_id: 'available'|'explored'|'in_my_plays'|'used' }   (R1 keys)
  outputs            jsonb not null default '{}',   -- { play_id: { output_schema_version, play_version, payload } }   (R2)
  my_plays           jsonb not null default '[]',   -- ordered saved Plays (5-field cards; each carries its play_id + versions)
  updated_at         timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  unique (user_id, playbook_key)
);
create index if not exists idx_playbook_progress_user on public.playbook_progress (user_id, playbook_key);
alter table public.playbook_progress enable row level security;
-- own-row read + write (the experience writes the user's own progress; no cross-user access)
create policy "own progress select" on public.playbook_progress for select using (auth.uid() = user_id);
create policy "own progress upsert" on public.playbook_progress for insert with check (auth.uid() = user_id);
create policy "own progress update" on public.playbook_progress for update using (auth.uid() = user_id);
notify pgrst, 'reload schema';
```
- **(R2) Versioning:** every stored output carries `{ output_schema_version, play_version, payload }`, and the
  row carries `playbook_version`. Content/output-shape can evolve additively; readers migrate old payloads by
  version. No numeric `cluster_id` column here — the entitlement gate (Section 2) resolves ownership; progress
  is keyed by `playbook_key`.
- **(R3) Future append-only events — DESIGNED, NOT BUILT.** A later, additive migration would add
  **`playbook_events`** (`id, user_id, playbook_key, play_id, event_type, output_schema_version, occurred_at,
  metadata jsonb`) — an **immutable, append-only** log of intervention-use / process events (Play opened,
  output saved, used-in-real-life, fidelity self-mark) seeding the Phase 2/3 process measures. **MVP does NOT
  create it.** The seam: the progress API's write path is structured so it *could* later also emit an event
  without reshaping current-state persistence. This keeps current state simple now and the research path clean
  later.
- **What is NOT stored (now or in events):** free-form reflection, mood logs, partner identity/tracking, "how
  did that feel" prose. Short free-text (event/situation) persists **only** inside a functional output, never as
  a diary; events (future) would store **metadata**, not raw emotional content.
- **Payloads are typed** (Section 5) and validated server-side before persist. **RLS own-row** (authenticated
  user data; mirrors `companion_user_entries`, not the service-role public path).

## 4. Content Model — typed, git-versioned, no DB dependency (MVP)
Cluster-1 content is **authored as typed TS modules** (frozen design → code), not DB-authored, for MVP:
- Rationale: content is **frozen** (Phase 5/5B), single cluster, must be reviewable in PRs, and has **no
  runtime authoring need**. DB/Studio authoring is a **future** scale concern (27 clusters), added without
  changing the engine (the engine reads the content *interface*, not the source).
- **Content schema (types in `lib/playbook/contentSchema.ts`) — R1 keys + R2 versions:**
  - `PlaybookContent` = `{ playbookKey, playbookVersion, opening, recognitionCards[], plays[], education[], recognitionContext[] }`
    — keyed by **`playbookKey`** (not clusterId); carries **`playbookVersion`**.
  - `RecognitionCard` = `{ id, pathwayPlayId|null, headline, secondaryExamples[], role: 'route'|'validate'|'signpost' }`
    — routes to a **`play_id`**, not a technique code.
  - `Play` = `{ playId, playVersion, outputSchemaVersion, name, positioning, recognitionGate, shift, literatureL1, literatureL2, screens[], executableOutput, portable, fidelity, myPlaysTemplate, routing, prerequisites[], supportSignposts[] }`
    — stable **`playId`** + **`playVersion`** + **`outputSchemaVersion`**; `supportSignposts[]` are Play-specific (R4-b).
  - `Screen` = discriminated union: `shift | literature | learn | scenarioSort | ownTurn | ruleBuilder | emotionBeat | output | portable | realWorldUse | signpost`.
  - `SortScreen` = `{ prompt, situation, items:{id,text,correctBucket?}[], buckets:{id,label,icon}[], accuracyFeedback?, hints? }` — **N buckets**.
- **Registry:** `lib/snapshot/playbooks.ts` gains a `cluster_id ↔ playbook_key` map (`1 ↔ "difficulty-feeling-chosen"`)
  so entitlement (numeric) and experience (string key) stay decoupled (R1).
- **Cluster-1 content file** `content/playbook/difficulty-feeling-chosen/*.ts` (named by **`playbook_key`**, R1)
  holds the exact Phase 5/5B copy. **First implementation authors ONLY the two screen-complete Plays**
  (`read-and-decide`, `what-it-actually-means`) — R5. The other four Plays are **not authored/built** until they
  complete the same Phase-5/5B design + approval (R6).

## 5. Executable Output Types (typed payloads persisted per Play)
| Play | Output type (TS) |
|---|---|
| Read & Decide | `{ question, saw:string[], guessing:string[], unknown:string[], evidenceQuestion, rule:{ifCondition, thenAction} }` |
| What It Actually Means | `{ event, conclusion, establishes:string[], notEstablishes:string[], boundedConclusion, patternRouted:boolean }` |
| Is This Right for You? | `{ criteria:string[], observed:string[], myReactions:string[], marks:{criterion,verdict}[], nextLearn }` |
| How Much to Put In | `{ investmentKinds:string[], currentEvidence:string[], forwardDecision, spaceCheck }` |
| Say the Real Thing | `{ expression, prediction, outcome?, learning? }` |
| Rest, or Giving Up? | `{ mode:'choice'|'automatic', valueServed, decision, reentrySignal }` |
Each `→ my_plays[]` card via the Play's `myPlaysTemplate` (5 consumer fields). **Every persisted output is
wrapped `{ output_schema_version, play_version, payload }` (R2)**; server validates the payload against the
`play_id`'s current schema and stamps versions. Outputs are keyed by **`play_id`** (R1). Readers migrate older
`output_schema_version` payloads forward additively.

## 6. Component Architecture (Universal Engine + Cluster Content)
**Universal (build once — `components/playbook/`):**
- `PlaybookGate` (RSC) — entitlement + auth check; renders purchase entry or the experience.
- `ExperienceShell` (client) — the state machine: entry → recognition → board → play → return-home/exit; reads
  initial state (RSC-provided) + syncs via the progress API.
- `RecognitionPass` — the short tap-pass (cards + expanders; L4).
- `PathwayBoard` — dynamic 2–4 recognized pathways + **always** "Explore another area" (L6).
- `PlayContainer` — the **slotted** container (Phase 5B D23): renders a Play's `screens[]` in order, with
  optional slots (emotion-beat, safety-signpost, two-stage unlock). Not a fixed screen list.
- **`SortEngine`** — the shared **N-bucket, tap-first, accessible** sorter (Section 7). Powers both sort Plays.
- `RuleBuilder` (Read & Decide if-then), `SentenceBuilder` (T1a bounded conclusion), `ChipList` (add-lists),
  `LiteratureBlock` (L1 inline + L2 expandable), `MyPlaysCard` (5 fields), `UsedReview` (fidelity chips),
  `SupportSignpost`, `HealthyMarker`.
- `useProgress()` hook — debounced load/save against `/api/playbook/[cluster]/progress`; optimistic local
  state; offline-tolerant (persist partial outputs locally, reconcile on reconnect — Phase 5 error states).
**Cluster-specific:** the content module only (copy, scenarios, buckets, feedback rules) — no bespoke
components for MVP's two prototype Plays (they reuse SortEngine + builders). If a *future* Play needs a novel
interaction, add a component; the container's slot model absorbs it.

## 7. The Shared Sort Engine (the one non-trivial interaction primitive)
- **Generalized to N buckets** (Read & Decide: Saw it / Guessing / Don't know yet = 3; What It Actually Means:
  Supports / Can't prove = 2).
- **Interaction:** **tap-to-assign is primary** (each item is a button → choose a bucket via a labeled control),
  **drag is a progressive enhancement only.** Fully keyboard-operable.
- **Feedback:** optional per-item `correctBucket` drives **one** accuracy correction (e.g., inference-as-
  observation; verdict-as-evidence); otherwise **no right/wrong** (most sorts are non-scored).
- **Accessibility:** each item announces its current bucket (`aria`), buckets are labeled regions (not color),
  corrections are text and move focus, reduced-motion removes animation, targets ≥44px.
- **Output:** the bucketed assignment → the Play's executable-output builder.
- This single component + its config is what Phase 5B's universal/technique-specific matrix identified as the
  shared engine.

## 8. Routes (App Router)
| Route | Type | Purpose |
|---|---|---|
| `app/(member)/playbook/[cluster]/page.tsx` | RSC gate → client shell | the interactive experience (single entry; internal state machine handles recognition/board/play/home/exit) |
| `app/api/playbook/[cluster]/progress/route.ts` | Route handler (nodejs) | `GET` load, `PUT` upsert progress (auth + entitlement + shape validation + RLS own-row) |
| *(reused)* `app/(site)/playbooks/[slug]` | RSC | marketing + checkout (unchanged) |
| *(reused)* `app/api/playbooks/checkout`, `.../[cluster]/download` | handlers | commerce + PDF (unchanged) |
- **Single-route client experience** (not many sub-routes) mirrors the earlier prototype's state machine and
  keeps deep emotional flows in one place; deep-linking to a specific Play is an internal state param, not a URL
  the user can be dropped into cold. (Revisit for shareable Play links in V1.1.)
- `dynamic = 'force-dynamic'` on the gate (per-user); `runtime = 'nodejs'` on the API.

## 9. Safety — TWO EXPLICITLY SEPARATE LAYERS (R4)
The prior draft blurred these; they are now **architecturally distinct modules with independent triggers**.
Both may fire; neither depends on the other.

**Layer A — Crisis Safety Detection (shared, cross-Play, cross-cluster, engine-driven).**
- A single shared service wrapping the **frozen deterministic Safety V2 engine** (`lib/` safety modules;
  migration `0048`), run on the Playbook's short free-text at submit time — **metadata-only, no raw disclosure
  logging** (its live posture).
- On a crisis/immediacy signal → surface **crisis resources**, non-punitive, non-blocking (as the Companion
  does). This layer is **content-agnostic** — identical behavior regardless of which Play or cluster the user
  is in. Implemented as `lib/playbook/crisisSafety.ts` calling the existing engine; **not** authored per Play.

**Layer B — Play-specific Support / Signpost (content-driven, per-Play routing).**
- Declared in each Play's content (`supportSignposts[]`), independent of the crisis engine: e.g. **T1a
  severe/chronic self-worth signpost** (Phase 5B S-WM-15, triggered by the situational-only gate + language),
  **T3a unsafe/coercive-relationship exclusion** (do-not-run + route out), **PE-6 accurate-expectancy**
  recognition. These are **developmental/context routing**, not crisis detection.
- Implemented as content + the `SupportSignpost` component; each Play declares its own signposts and their
  triggers.

**Separation contract:** Layer A is a global safety service (one implementation, all Plays); Layer B is
per-Play content. A crisis signal (A) fires regardless of Play; a Play signpost (B) fires from that Play's
rules. They compose — a user can hit both. **No new safety theory** — Layer A reuses Safety V2 only.
*(Attorney review unchanged and NOT performed; the Playbook ships under the same documented Owner Risk
Acceptance as the rest of the live surface — never represented as attorney-approved.)*

## 10. State, Analytics, and the "no gamification" constraint
- Four states + optional Used (Phase 4 D13): `available → relevant → explored → in_my_plays` (+ `used`), stored
  in `play_states`. **No** completion %, streaks, scores, badges, mastery.
- **Product analytics:** MVP may record **coarse, non-gamified** usage server-side (play opened, output saved,
  used-marked) for the owner's own product learning — **not** shown to the user as progress/score, and **no**
  emotional content. Keep to counts/events; this is the future process-measure seed (Phase 2/3), not a Snapshot
  change.

## 11. Accessibility & Mobile (implementation notes → the specs in Phase 5/5B)
- WCAG AA; keyboard-complete; SR semantics on sort/builders; visible focus; no color-only; reduced-motion;
  ≥44px targets; plain-language errors; **every sort/drag has a tap-assign fallback** (SortEngine is tap-first).
- Mobile-first: single column; buckets stack / segmented toggle on narrow screens; builders = dropdowns +
  single-line fields + chips; sticky save; partial-output persistence on exit; no hover-dependent UI; no
  timing pressure; the emotion beat is a calm full-screen (no confetti).

## 12. Testing & Verification Plan (for the implementation step; not run now)
- **Unit:** content-schema validation (every Play conforms to `PlaybookContent`); state-machine transitions;
  SortEngine assignment + accuracy feedback; output-payload validators; My Plays templating.
- **Integration:** entitlement gate (owned vs not-owned vs anonymous); progress `GET/PUT` with RLS (own-row
  only; cross-user denied); safety-engine hook on free-text.
- **A11y:** keyboard-only pass of both prototype Plays; screen-reader QA of SortEngine; reduced-motion; axe/CI.
- **Verification (implementation step):** `tsc` clean · `npm run build` green · unit/integration pass ·
  Snapshot untouched (`git diff --stat` shows nothing under `app/snapshot`, `lib/scoring.ts`, `quiz_*`) ·
  entitlement/commerce untouched. **Owner runs `0052`.** **Do NOT deploy to production without explicit
  instruction; build on a branch, open a PR.**

## 13. First-Implementation Build Sequence (branch: `playbook-dfc-interactive`) — R5/R6
**Scope = the universal engine + the TWO screen-complete Plays only** (`read-and-decide`,
`what-it-actually-means`). The other four Plays are **out of this build** (R6).
1. **Migration `0052`** (owner-run) + `playbook_progress` types (R1 keys, R2 versions) + `ownsPlaybook()` +
   `cluster_id ↔ playbook_key` registry + progress API (RLS + shape/version validation).
2. **Universal engine:** `contentSchema` (playbookKey/playVersion/outputSchemaVersion), `ExperienceShell`
   state machine, `PlaybookGate`, `useProgress`.
3. **SortEngine** (N-bucket, tap-first, accessible) + `SentenceBuilder`/`RuleBuilder`/`ChipList` +
   `LiteratureBlock`/`MyPlaysCard`/`UsedReview`/`HealthyMarker`; **Layer-A** `crisisSafety` service +
   **Layer-B** `SupportSignpost` component (R4).
4. **Cluster content module** `difficulty-feeling-chosen` — opening, recognition (7 cards + expanders),
   board, and **only** `read-and-decide` + `what-it-actually-means`, screen-complete from Phase 5/5B.
5. **Wiring:** recognition → board → play → return-home → exit + "Explore another area" (the board surfaces
   only the two built Plays as pathways; recognition prompts for not-yet-built pathways are shown as
   "coming soon / not yet available," never as broken routes).
6. **Tests + a11y pass** (Section 12); `tsc`/build green; **PR** on the branch. *(No prod deploy without
   explicit instruction; owner runs `0052`.)*
**Later (each gated on its own approval, R6):** author + deep-design each remaining Play (`is-this-right-for-
you`, `how-much-to-put-in`, `say-the-real-thing`, `rest-or-giving-up`) through the full Phase-5/5B process →
human approval → add its content module + any technique-specific component → surface its pathway. No engine
change required to add a Play (that's the point of the shell).

## 14. What NOT to build (first implementation) / Defer
- **(R5/R6) The four not-yet-approved Plays are NOT built** — `is-this-right-for-you`, `how-much-to-put-in`,
  `say-the-real-thing`, `rest-or-giving-up` each require the full Phase-5/5B content/design + human approval
  first. **No T2d** Play (V1.1). Only `read-and-decide` + `what-it-actually-means` ship in the first build.
- **(R3) The append-only `playbook_events` log is NOT built** — designed/reserved only; MVP writes current-state.
- **No** LLM at runtime. **No** DB/Studio content authoring (typed modules for the first build).
- **No** gamification, journaling engine, partner tracking, always-on chat, shareable Play URLs, or Companion
  deep-linking beyond the optional exit handoff link.
- **(R8) No** Snapshot/scoring/commerce/framework/intervention changes. **No** rewrite of the 333 records.
  **No** production deploy without explicit instruction; **owner runs migrations.**
- **No** new safety theory (Layer A reuses Safety V2 only).

## 15. Risks / Open Technical Decisions
1. ~~Interactive vs PDF~~ → **RESOLVED (R7): coexist; interactive PRIMARY, PDF supporting/offline artifact.**
2. **Content source** — typed modules (first build) vs Studio/DB authoring (future). Confirmed = typed modules.
3. **Anonymous preview** — no-save teaser of Play 1 pre-purchase? (Defer; auth+entitlement for first build.)
4. **Analytics scope** — confirm coarse non-gamified event logging is acceptable, and where it lives (also the
   natural place the future `playbook_events` seam attaches — R3).
5. **Safety engine coupling (Layer A)** — confirm reuse of the live Safety V2 engine on Playbook free-text
   (recommended).
6. **Migration number** — `0052` assumes no intervening migration lands first; reconcile at PR time.
7. **`playbook_key` value** — confirm `"difficulty-feeling-chosen"` as the canonical key (must match the
   marketing slug used by `/playbooks/[slug]`).

## 16. Decision Log
| # | Decision | Basis |
|---|---|---|
| P6-D1 | Interactive Playbook = **new delivery mode of the existing entitlement** (reuse `playbook_entitlements`, cluster_id=1); **no new commerce** | repo survey |
| P6-D2 | **Universal engine + Cluster-1 content module** split (build once, author per cluster) | Phase 5B D24 |
| P6-D3 | **Content = typed TS modules** (frozen design, git-versioned) for MVP; DB authoring deferred | Section 4 |
| P6-D4 | **`playbook_progress`** (migration 0052), **functional-data-only**, RLS own-row read+write | Phase 4 D14 |
| P6-D5 | **Shared N-bucket SortEngine**, tap-first + accessible, powers both prototype Plays | Phase 5B D24 / §7 |
| P6-D6 | **No LLM at runtime** — deterministic content + user inputs | §1 |
| P6-D7 | **Reuse Safety V2** on free-text (metadata-only) + content-driven support signpost; no new safety theory | §9 |
| P6-D8 | **No gamification**; coarse non-gamified analytics only, never shown as score | §10 |
| P6-D9 | Single entitlement-gated route + internal state machine; commerce/PDF untouched | §8 |
| P6-D10 | **Spec only this phase**; code on branch `playbook-dfc-interactive`, PR, **no prod deploy without instruction**; owner runs 0052 | standing constraints |
| P6-D11 | **Attorney review unchanged (NOT performed)**; ships under existing Owner Risk Acceptance; not attorney-approved | standing constraint |
| **P6-D12 (Rev 2)** | **Stable `playbook_key` + `play_id`** decouple content/routing/progress from numeric `cluster_id` (which stays entitlement-only) | R1 |
| **P6-D13 (Rev 2)** | **Versioning** — `playbook_version` · `play_version` · `output_schema_version` stamped on stored data | R2 |
| **P6-D14 (Rev 2)** | **Current-state persistence for MVP**; **append-only `playbook_events` designed but NOT built** | R3 |
| **P6-D15 (Rev 2)** | **Two separate safety layers** — A crisis detection (shared engine service) vs B Play-specific signposts (content) | R4 |
| **P6-D16 (Rev 2)** | **First build = 2 screen-complete Plays only**; other 4 gated on full design + approval | R5/R6 |
| **P6-D17 (Rev 2)** | **Interactive PRIMARY, PDF supporting**; coexist in MVP | R7 |

---

## READINESS
**READY FOR FIRST-IMPLEMENTATION BUILD (Rev 2).** All 8 required revisions (R1–R8) are applied. The spec now
translates directly: R1 stable keys, R2 versioning, R3 current-state-now / events-designed-later, R4 two
separate safety layers, R5 build only the two screen-complete Plays, R6 gate the other four on their own
approvals, R7 interactive-primary/PDF-supporting, R8 all constraints retained — with **no product/therapeutic/
interaction logic left to invent.** Remaining Section-15 items are owner/product confirmations (content-source,
analytics scope, anonymous preview, migration number, `playbook_key` value), not architecture gaps.

**Hard constraints reaffirmed for the build step:** work on branch `playbook-dfc-interactive`; **owner runs
migration 0052**; **do not deploy to production without explicit instruction**; leave Snapshot/scoring/commerce/
framework/intervention/the-333-records untouched; the Playbook remains **not attorney-reviewed** and ships (if
enabled) only under the documented Owner Risk Acceptance.

## STOP CONDITION — honored
Technical implementation architecture + build specification produced (architecture, entitlement reuse, data
model + proposed migration 0052, content model, output types, component architecture, shared SortEngine, routes
+ progress API, safety reuse, state/analytics, a11y/mobile, testing, MVP build sequence, do-not-build list,
risks, decision log). **No** code · migrations run · Supabase change · route edits · deploy · animation ·
Snapshot/scoring/framework/intervention change. **Staged as "Difficulty Feeling Chosen — Phase 6: Technical
Implementation Architecture & Build Specification" for human review** before the implementation build step.
