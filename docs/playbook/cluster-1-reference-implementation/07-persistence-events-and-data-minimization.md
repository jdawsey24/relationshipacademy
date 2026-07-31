# 07 — Persistence, Events & Data Minimization

**Status:** AS BUILT (working tree). Migration `0053` is committed; owner confirmed run (#45/#46) but the file header still says "AUTHORED, NOT RUN" (discrepancy — see `14-…`).
**Primary sources:** `lib/playbook/{progress,sanitize,events,clientEvents}.ts`, `supabase/migrations/{0052,0053}*.sql`, `app/api/playbook/[key]/{progress,screen,access}/route.ts`.

---

## 1. Database schema

### `playbook_progress` — migration `0052` (`:19-34`)
Columns: `id uuid PK`; **`user_id uuid NOT NULL references auth.users(id) on delete cascade`** (`:21`); `playbook_key text NOT NULL`; `playbook_version integer NOT NULL default 1`; `recognized jsonb NOT NULL default '[]'`; `play_states jsonb NOT NULL default '{}'`; `outputs jsonb NOT NULL default '{}'`; `my_plays jsonb NOT NULL default '[]'`; `updated_at`/`created_at timestamptz`. **`unique (user_id, playbook_key)`** (`:30`). RLS enabled; **own-row SELECT/INSERT/UPDATE** (`auth.uid() = user_id`); **no DELETE policy**. Header: "only FUNCTIONAL data … No emotional journaling, mood, or partner data."

### Five Rev 3 columns added — migration `0053` (`:21-26`)
`literature_state`, `simulation_state`, `practice_state`, `use_review_state`, `change_path_state` — each **`jsonb NOT NULL default '{}'`**.

### `playbook_events` (append-only) — migration `0053` (`:29-46`)
`id uuid PK`; **`user_id … references auth.users(id) on delete cascade`**; `action_id text NOT NULL` (idempotency); `playbook_key`, `playbook_version`, `object_type`, `object_id`, `object_version`, `event_type`, `schema_version`, `payload jsonb NOT NULL default '{}'`, `created_at`. **`unique (user_id, action_id)`** (idempotency). RLS: **SELECT-only** own-row policy; **no insert/update/delete policy** — server (service-role) writes only; **append-only**. Header (`:14-17`): "MINIMUM functional payload only — no narratives, no partner-monitoring data, no raw sensitive disclosures."

> The `playbook_events` write path is **designed but not live**: `progress.ts:89` marks the future emit seam, and the events store's producer route is not yet wired. Longitudinal events are a designed-and-validated seam pending activation. See `14-…`.

---

## 2. Load & save — `progress.ts`

**`loadProgress(userId, key, version)`** (`:32-61`): selects the eleven columns (`playbook_key, playbook_version, recognized, play_states, outputs, my_plays, literature_state, simulation_state, practice_state, use_review_state, change_path_state`, `:40`), scoped `user_id`+`playbook_key`. No row → `emptyProgress`. **Empty `'{}'` → `undefined`** via the `state<T>()` helper (`:47`, treats an object with 0 keys as absent) applied to the five Rev 3 columns.

**`saveProgress(userId, key, progress)`** (`:64-90`): `upsert(..., { onConflict: "user_id,playbook_key" })`. Each Rev 3 state is written as `progress.<state> ?? {}` (`:80-84`) — absent state persists as `'{}'` (NOT-NULL jsonb). `updated_at = new Date().toISOString()`.

**`ownsPlaybook(userId, key)`** (`:16-29`): entitlement check against `playbook_entitlements` (active status for the numeric cluster). The Playbook is a **paid** product; this is the commerce gate.

---

## 3. Sanitization (the untrusted-client boundary) — `sanitize.ts`

`sanitizeIncomingProgress(body, key, version)` (`:226-250`) rebuilds the object from `emptyProgress` so **`playbook_key`/`playbook_version` are server-authoritative**. `recognized` filtered to strings, capped **100**. Each Rev 3 state is included **only when its sanitizer returns truthy** (conditional spread, `:244-248`) — absent-or-invalid stays absent. **Unknown top-level keys are silently dropped** (only enumerated fields survive the rebuild).

Every persisted structure carries an explicit numeric cap and (where categorical) an enum allow-list that **coerces** invalid values rather than storing them:

| Sanitizer | Enum allow-list / coercion | Caps |
|---|---|---|
| `sanitizeStates` (`:30-38`) | `available/explored/in_my_plays/used`; others dropped | — |
| `sanitizeOutputs` (`:40-55`) | stamps `output_schema_version`/`play_version`; payload opaque | — |
| `sanitizeMyPlays` (`:57-72`) | string fields `String()`-coerced | ≤ **50** cards |
| `sanitizeFidelity` (`:105-111`) | requires known `signature`; invalid `FidelityState` → **`not_applicable`**; invalid `chosen_stance` → **`pause_decision`** | — |
| `sanitizeSimulationState` (`:113-137`) | `completed` bool; fidelity via `sanitizeFidelity` | ≤50 runs; `captures` ≤100×500; `selections` ≤100×200; nodeId ≤200 |
| `sanitizePracticeState` (`:141-163`) | `state ∈ {selected,attempted,reviewed}` (else dropped); `lastReport ∈ {attempted,no_opportunity,opportunity_not_taken,unsuitable}`; `attemptCount` clamped **[0,999]** | ≤50 missions |
| `sanitizeUseReviewSignals` (`:166-179`) | `performed ∈ {yes,partly,no}`; booleans | `didDifferently`/`becameClearer` ≤20×200; stuck ≤200 |
| `sanitizeUseReviewEntry` (`:181-188`) | `at` ≤40 (display-only); **`experience` ≤2000** | — |
| `sanitizeUseReviewState` (`:189-205`) | legacy single-object coerced to one-element list | ≤50 reviews × ≤ `MAX_REVIEW_ENTRIES=50` entries |
| `sanitizeChangePathState` (`:207-215`) | — | `currentFocus`/`priorFocus` ≤200 |
| `sanitizeLiteratureState` (`:217-223`) | strings only | `read` ≤500 × ≤200 |

---

## 4. Events — `events.ts`

Event object types: `literature | simulation | play | mission | use_review`. Seven event types with per-event payload allow-lists (`onlyKeys` rejects any unlisted key):

| event_type | schemaVersion | payload allow-list |
|---|---|---|
| `literature_opened` | 1 | `["revisit"]` |
| `simulation_completed` | **3** | `["signature", …per-signature fields]` (see below) |
| `operation_performed` | 1 | `[]` (empty) |
| `mission_selected` | 1 | `["rung_id"]` |
| `mission_attempt_reported` | 1 | `["rung_id"]` |
| `use_reviewed` | 1 | `["performed","stuck","kept","updated","saved"]` |
| `focus_changed` | 1 | `["focus"]` |

**`SIM_COMPLETED_FIELDS`** (signature-aware, `:43-50`) — per-signature allow-list matching `FidelityOutcome`: evidenceTimeline/conclusionNarrowing → `evidence_reconsidered`, `interpretation_response_appropriate`; dualAttention → `evaluator_stance_held`, `fit_information_kept_in_view`; decisionRoom → `intentional_stance_selected`, `discouragement_distinguished_from_conclusion`, `chosen_stance`; investmentView → `investment_evidence_tied`, `effort_without_new_evidence_noticed`; communicationRehearsal → `preference_expressed_clearly`, `unnecessary_self_erasure_avoided`. Each state validated by `isFidelityState`; `chosen_stance` by `isChosenStance`. `validateEvent` (`:139-148`) checks action_id, registration, object-type match, payload. **No event payload accepts free text or partner data — states only.**

`clientEvents.ts`: `buildPlaybookEvent` validates & returns null on non-conformance; `emitPlaybookEvent` best-effort POSTs with `keepalive`. Header: "MINIMAL functional metadata only: no relationship narrative, no partner-monitoring data." **The `use_reviewed` event never carries the `experience` free text** (only the five bounded keys) — confirmed in the review `onComplete` builder.

---

## 5. API routes

- **`progress/route.ts`** — `gate()`: `getMember()` → 401; content → 404; `ownsPlaybook` → 403. `GET` → `loadProgress`. `PUT` → `sanitizeIncomingProgress(body, key, content.playbookVersion)` (key/version server-authoritative) → `saveProgress` → `{ ok: true }`.
- **`screen/route.ts`** — `POST` only; same gates but **fails open** (benign `interrupt:false` on no-member/no-content/not-owned). Reads `body.text`, calls `screenPlaybookText`. **Persists nothing about the text** ("Metadata-only; never stores the raw text. Non-blocking").
- **`access/route.ts`** — `GET` → `{ signedIn, interactive, owned }`; no side effects.

---

## 6. Data-minimization matrix

| Data | Persisted? | Location | Reason | Privacy/safety guardrail |
|---|---|---|---|---|
| Play states | Y | `play_states` | resume | enum allow-list; junk dropped |
| Recognition card ids | Y | `recognized` | which cards tapped | strings only, ≤100 |
| Stored outputs (executable payloads) | Y | `outputs` | version-stamped tool output | schema/play-version stamped; opaque payload |
| My Plays (5 authored fields) | Y | `my_plays` | reader's own saved tools | ≤50 cards; string-coerced (reader's own authored content) |
| Simulation runs (completed/nodeId/captures/selections/fidelity) | Y | `simulation_state` | resume + fidelity | ≤50 runs; captures ≤100×500; selections ≤100×200; fidelity enum-coerced |
| Practice/mission state | Y | `practice_state` | mission progress | state/report enums; attemptCount [0,999]; ≤50 |
| Use-review bounded signals | Y | `use_review_state` | Change Path input | enum + array caps; ≤50 reviews × ≤50 entries |
| Use-review `experience` note | Y (bounded) | `use_review_state[..].experience` | reader's optional reflection | **≤2000 chars**; reader's own; crisis-screened; never in event log |
| Change-path focus | Y | `change_path_state` | app focus | two strings ≤200 |
| Literature read-ids | Y | `literature_state` | engagement | ≤500 ids × ≤200 |
| Longitudinal events (minimal payloads) | **Designed / not live** | `playbook_events` | idempotent history | allow-listed; append-only; SELECT-only RLS; `unique(user_id, action_id)` |
| **Crisis-screen free text** | **N** | — | screened in memory only | never stored/logged/returned |
| **Raw narrative / journaling / mood** | **N (prohibited)** | — | out of scope | 0052 header; no field accepts it |
| **Partner / other-person / surveillance data** | **N (prohibited)** | — | out of scope | no such key in any type; unknown keys dropped on rebuild; 0053 header |
| Crisis finding *metadata* (concept/category/severity) | Y (metadata only) | `companion_safety_events` | false-pos/neg review | canonical concept, **not** user text |

### The four explicit boundary rules
1. **Free text is never persisted from the crisis screen path.** `/screen` classifies in memory and returns only clinician-authored copy; it writes nothing to `playbook_progress`.
2. **The one bounded free-text field that IS stored** is `use_review_state.experience` (≤2000 chars) — the reader's own reflection; never partner data, never narrative disclosure; never in the event log.
3. **Partner-surveillance / other-person data is structurally impossible to persist** — no type or column accepts it, and `sanitizeIncomingProgress` rebuilds from an allow-list, dropping every unrecognized key.
4. **Bounded functional metadata is the only thing allowed** — every persisted map/array/string is explicitly capped and (where categorical) enum-coerced.

---

## 7. Authenticated round-trip — verification status

**OWNER E2E NOT YET VERIFIED.** The sanitize→save→load code path is unit-tested (`playbook-progress.test.ts` Phase D cases), and a read-only live check confirmed all five `0053` columns exist on the real `playbook_progress` (#46). But the **authenticated save→reload round-trip** (a signed-in user completing a Play and confirming state survives a reload against production Supabase) has **not** been verified — it is auth-gated and requires the owner to drive it. Documented as an open gate in `14-…`.
