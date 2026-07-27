# Relationship Playbook™ · Difficulty Feeling Chosen — Phase 6
## Technical Implementation Architecture & Build Specification

**Status:** PHASE 6 build specification for human review. **Specification only — no code, migrations, or
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

## 3. Data / Persistence — migration `0052_playbook_progress.sql` (proposed; additive, RLS-locked)
**Principle (Phase 4 D14): functional data only — no emotional journaling.** One row per (user, cluster);
per-play state + user-authored *outputs* stored as typed JSON.
```sql
create table public.playbook_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  cluster_id    integer not null,
  recognized    jsonb not null default '[]',   -- pathway ids the user tapped ("sounds like me")
  play_states   jsonb not null default '{}',   -- { playId: 'available'|'explored'|'in_my_plays'|'used' }
  outputs       jsonb not null default '{}',   -- { playId: <executable output payload> } (bounded conclusion, evidence map, if-then rule, ...)
  my_plays      jsonb not null default '[]',   -- ordered saved Plays (5-field cards)
  updated_at    timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (user_id, cluster_id)
);
alter table public.playbook_progress enable row level security;
-- own-row read + write (the experience writes the user's own progress; no cross-user access)
create policy "own progress select" on public.playbook_progress for select using (auth.uid() = user_id);
create policy "own progress upsert" on public.playbook_progress for insert with check (auth.uid() = user_id);
create policy "own progress update" on public.playbook_progress for update using (auth.uid() = user_id);
notify pgrst, 'reload schema';
```
- **What is NOT stored:** free-form reflection, mood, partner identity/tracking, "how did that feel" text. The
  short free-text fields (event description, situation) are stored **only** as part of a functional output
  (e.g., inside a bounded conclusion) — never as a diary.
- **Output payloads are typed** (Section 5) and validated server-side before persist.
- **Owner-scoped writes via RLS** (own-row) — unlike the studio public endpoints, this is authenticated user
  data, so RLS own-row is correct (mirrors `companion_user_entries` posture, not the service-role public path).

## 4. Content Model — typed, git-versioned, no DB dependency (MVP)
Cluster-1 content is **authored as typed TS modules** (frozen design → code), not DB-authored, for MVP:
- Rationale: content is **frozen** (Phase 5/5B), single cluster, must be reviewable in PRs, and has **no
  runtime authoring need**. DB/Studio authoring is a **future** scale concern (27 clusters), added without
  changing the engine (the engine reads the content *interface*, not the source).
- **Content schema (types in `lib/playbook/contentSchema.ts`):**
  - `PlaybookContent` = `{ clusterId, opening, recognitionCards[], plays[], education[], recognitionContext[], safetySignpost }`
  - `RecognitionCard` = `{ id, pathwayId|null, headline, secondaryExamples[], role: 'route'|'validate'|'signpost' }`
  - `Play` = `{ id, name, positioning, recognitionGate, shift, literatureL1, literatureL2, screens[], executableOutput, portable, fidelity, myPlaysTemplate, routing, prerequisites[] }`
  - `Screen` = a discriminated union: `shift | literature | learn | scenarioSort | ownTurn | ruleBuilder | emotionBeat | output | portable | realWorldUse | signpost` — each with its own typed props.
  - `SortScreen` = `{ prompt, situation, items: {id,text,correctBucket?}[], buckets: {id,label,icon}[], accuracyFeedback?, hints? }` — **N buckets** (Read & Decide = 3, What It Actually Means = 2).
- **Cluster-1 content file** `content/playbook/cluster-1/*.ts` holds the exact Phase 5/5B copy (opening,
  7 recognition cards + expanders, the 6 MVP Plays; Read & Decide + What It Actually Means fully authored;
  the other four to the light-spec level → fully authored as a content task, not an engine change).

## 5. Executable Output Types (typed payloads persisted per Play)
| Play | Output type (TS) |
|---|---|
| Read & Decide | `{ question, saw:string[], guessing:string[], unknown:string[], evidenceQuestion, rule:{ifCondition, thenAction} }` |
| What It Actually Means | `{ event, conclusion, establishes:string[], notEstablishes:string[], boundedConclusion, patternRouted:boolean }` |
| Is This Right for You? | `{ criteria:string[], observed:string[], myReactions:string[], marks:{criterion,verdict}[], nextLearn }` |
| How Much to Put In | `{ investmentKinds:string[], currentEvidence:string[], forwardDecision, spaceCheck }` |
| Say the Real Thing | `{ expression, prediction, outcome?, learning? }` |
| Rest, or Giving Up? | `{ mode:'choice'|'automatic', valueServed, decision, reentrySignal }` |
Each `→ my_plays[]` card via the Play's `myPlaysTemplate` (5 consumer fields). Server validates shape on save.

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

## 9. Safety Integration (reuse the frozen Safety V2 engine)
- The Playbook has a small number of **short free-text fields** (the event/situation the user types). Run these
  through the **existing deterministic Safety V2 engine** (`lib/` safety modules; migration `0048`) at submit
  time — **metadata-only, no raw disclosure logging** (consistent with its live posture).
- On a crisis/immediacy signal → surface the **support signpost** (`SupportSignpost`) + resources, and do **not**
  block the Play (non-punitive), exactly as the Companion does.
- The T1a **severe/chronic self-worth signpost** (Phase 5B S-WM-15) is content-driven (gate + language),
  independent of the crisis engine; both can fire.
- **No new safety theory** — reuse only. *(Attorney review status is unchanged and NOT performed; the Playbook
  ships under the same documented Owner Risk Acceptance as the rest of the live surface — must not be
  represented as attorney-approved.)*

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

## 13. MVP Build Sequence (branch: `playbook-dfc-interactive`)
1. **Migration `0052`** (owner-run) + `playbook_progress` types + `ownsPlaybook()` + progress API (with RLS +
   shape validation).
2. **Universal engine:** `contentSchema`, `ExperienceShell` state machine, `PlaybookGate`, `useProgress`.
3. **SortEngine** (N-bucket, tap-first, accessible) + `SentenceBuilder`/`RuleBuilder`/`ChipList` +
   `LiteratureBlock`/`MyPlaysCard`/`UsedReview`/`SupportSignpost`/`HealthyMarker`.
4. **Cluster-1 content module** — opening, recognition (7 cards + expanders), board, **Read & Decide** +
   **What It Actually Means** (screen-complete), + the other four Plays authored from their light specs.
5. **Safety hook** (Safety V2 on free-text) + signposts.
6. **Recognition → board → play → return-home → exit** wiring + "Explore another area."
7. **Tests + a11y pass**; `tsc`/build; PR. *(No deploy without instruction.)*

## 14. What NOT to build (MVP) / Defer
- **No T2d** Play (V1.1). **No** LLM at runtime. **No** DB/Studio content authoring (typed modules for MVP).
- **No** gamification, journaling engine, partner tracking, always-on chat, shareable Play URLs, or Companion
  deep-linking beyond the optional exit handoff link.
- **No** Snapshot/scoring/commerce/framework/intervention changes. **No** rewrite of the 333 records.
- **No** new safety theory (reuse Safety V2 only).

## 15. Risks / Open Technical Decisions
1. **Interactive vs PDF for owners** — does the interactive experience *replace* the PDF download for cluster 1,
   or coexist? (Recommend coexist in MVP; PDF is the fallback/offline artifact.) **Owner decision.**
2. **Content source** — typed modules (recommended MVP) vs Studio/DB authoring (future). Confirm MVP = code.
3. **Anonymous preview** — allow a no-save teaser of Play 1 pre-purchase? (Defer; auth+entitlement for MVP.)
4. **Analytics scope** — confirm coarse non-gamified event logging is acceptable, and where it lives.
5. **Safety engine coupling** — confirm reuse of the live Safety V2 engine on Playbook free-text (recommended).
6. **Migration number** — `0052` assumes no intervening migration lands first; reconcile at PR time.

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

---

## READINESS
**READY FOR IMPLEMENTATION (build step).** The spec is concrete enough that implementation *translates* it:
data model (0052), entitlement reuse, typed content schema + Cluster-1 content, the universal engine +
slotted container + shared SortEngine, routes + progress API, safety reuse, a11y/mobile, tests, and a build
sequence — with **no product/therapeutic/interaction logic left to invent.** Open items (Section 15) are
owner/product decisions (interactive-vs-PDF coexistence, analytics scope, anonymous preview), not architecture
gaps.

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
