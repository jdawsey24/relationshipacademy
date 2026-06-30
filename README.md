# Relationship Life Cycle™

Assessment platform for the Relationship Life Cycle™ framework — `relationshiplc.com`.
Standalone brand, separate from Symmetricly.

**Phase 1 (this scaffold):** Next.js project on Netlify with a Supabase client
and a working scoring API. No quiz UI or results pages yet.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres) · Netlify

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in Supabase keys
npm run dev                         # http://localhost:3000
```

### Environment variables

Set these locally in `.env.local` and in Netlify's environment settings (never
commit real keys):

| Var | Scope | Used for |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | RLS-respecting reads |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | privileged writes from the scoring API |

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm test` — pure scoring-logic unit tests (no DB needed)
- `npm run test:score` — end-to-end smoke test against the running API

### End-to-end smoke test

With `.env.local` filled in and the dev server running:

```bash
npm run dev          # terminal 1
npm run test:score   # terminal 2
```

`scripts/test-score.mjs` pulls the real snapshot question IDs from Supabase,
submits a full attempt to `POST /api/score`, then reads back every table and
confirms rows were written. It prints the API response and a per-table row
count, exiting non-zero if any expected write is missing.

## Layout

```
app/
  layout.tsx            root layout + brand fonts
  page.tsx              placeholder home page
  api/score/route.ts    POST /api/score — orchestrates scoring + persistence
lib/
  supabase.ts          anon + service-role clients
  scoring.ts           pure scoring functions (no I/O, unit-tested)
types/
  assessment.ts        domain types
test/
  scoring.test.ts      unit tests for lib/scoring.ts
```

## Scoring API

`POST /api/score` — see the project brief for the request/response contract.
Logic lives in `lib/scoring.ts` as pure functions; the route handles validation,
Supabase reads (reference tables) and writes (session/result tables). Writes for
a given `session_id` are idempotent (delete-then-insert / upsert), so re-scoring
the same session is safe.

## Scoring decisions (confirmed)

- **Alignment (Step 5)** is a single-score threshold check, not a comparison of
  two numbers. The respondent's competency score for their self-selected
  structural phase is tested against **3.25**: `>= 3.25` ⇒ Congruent (Strength /
  Healthy Development), `< 3.25` ⇒ Incongruent (Growth Opportunity / Needs
  Attention). Lives in `computeAlignment()` (`CONGRUENCE_SCORE_THRESHOLD`).
- **Result-table columns** match the live schema: `quiz_responses` →
  `scored_value`; `domain_scores` / `competency_phase_scores` → `average_score`,
  `result_level_id`; `expiration_risk_results` → `risk_level_id`;
  `alignment_results` → `structural_phase_id`, `matching_competency_phase_id`,
  `alignment_status`, `interpretation_text`.

## Schema notes (verified against live Supabase, 2026-06-30)

`npm run test:score` was run end-to-end against the live database — all seven
tables wrote correctly. Things worth knowing:

- **Reference tables** use `score_min` / `score_max` (not `min_score`/`max_score`)
  and `level` / `risk_level` / `title` (no `label`). Bands are contiguous to two
  decimals with 0.01 gaps (`[1,2.49] [2.5,3.24] [3.25,3.99] [4,5]`), so
  `resolveBand()` rounds the score to 2 decimals before matching.
- **No DB-side defaults.** Every write table requires the API to supply `id`
  (uuid), the timestamp column (`started_at` / `selected_at` / `created_at`), and
  `quiz_sessions.assessment_version_id`. The route generates these; the active
  assessment version is the `assessment_versions` row with `active_to IS NULL`.
- **`structural_phase_selection`** has no unique constraint on `session_id`, so
  the route uses delete-then-insert (not upsert) to stay idempotent.
- **`alignment_results.interpretation_text`** is currently generated copy in
  `computeAlignment()`. If canonical result language lives in a table or doc,
  swap the generator for it — this is the one remaining open item.
```
