# Publishing a Studio instrument to live (parallel consumer assessment)

The **Relationship Snapshot™** (47 items, `/snapshot`, `lib/scoring.ts`, `quiz_*` tables) is the
live flagship and is **never touched** by this pipeline. Publishing takes a Studio‑assembled
instrument live as a **second, parallel** public assessment that runs entirely on the studio
scoring stack (`studio_*` tables + `lib/studioScoring.ts`). Each instrument has its own on/off
switch (`live_enabled`); the Snapshot is unaffected.

## Pipeline at a glance

```
Specification → Measurement Model → Assembly (approved membership)
      → [author cut‑points] + [author consumer item text]      ← the two gates
      → Publish (owner)  →  /assess/<public_slug>               ← live consumer flow
```

## The two readiness gates (must be green before Publish enables)

Enforced by `publishReadiness()` in `lib/instrumentPublish.ts` and shown as a checklist on the
Studio **Publish** tab (`/admin/studio/assessment/instruments/[id]/publish`):

1. **Approved assembled membership present** — the instrument has items in
   `studio_assessment_membership`.
2. **Scoring cut‑points established** — every scoring rule level in use
   (`studio_scoring_rules.cut_points`) has non‑empty, validated bands. Real respondents are
   never scored against empty or "Not Validated" thresholds.
3. **Consumer item text authored** — every membership item has `consumer_item_text`
   (authored in the **Item Bank** editor; the public flow falls back to `item_text` only if
   present, but the gate requires consumer text so respondents never see raw research wording).
4. **Results Templates authored** — `studio_results_templates` exist so `buildConsumerReport`
   can render the Participant report.

Until all gates pass, the **Publish** button is disabled and lists exactly what is missing.

## Migration

`supabase/migrations/0030_instrument_publish.sql` (owner‑run, additive, RLS‑locked):

- `studio_assessments`: `public_slug text` (unique where not null), `live_enabled boolean
  not null default false`, `published_at timestamptz`, `intro_copy jsonb default '{}'`.
- `studio_assessment_attempts`: `respondent_name text`, `respondent_email text` (PII —
  service‑role only; no public RLS policy).

## Publish / Unpublish (owner‑only, audited)

- **Publish** (`POST …/publish {action:'publish'}`) re‑checks readiness, sets `public_slug`
  (slugified from the name), `live_enabled=true`, `published_at`.
- **Unpublish** (`{action:'unpublish'}`) flips `live_enabled=false` — instant off; the public
  route 404s immediately.

## Public flow (all service‑role, rate‑limited, 404 unless `live_enabled`)

- `app/assess/[slug]/page.tsx` — single‑page stepper: intro → structural context
  (`STRUCTURAL_MARKERS`) → questions grouped by domain on the 5‑point frequency scale →
  capture (first name + email) → submit.
- `GET /api/assess/[slug]/items` — `getPublicInstrumentBySlug` (404 if not live) +
  `loadPublicQuizItems` (`consumer_item_text || item_text`, position order) + 5‑pt options.
- `POST /api/assess/[slug]/score` — validates responses (int 1–5), runs `runLiveScoring`
  (`kind='live'`, stores respondent name/email), returns `attempt_id`.
- `GET /api/assess/results?attempt=` — `isUuid` guard + `getLiveResults` →
  `buildConsumerReport` → Participant report sections.

`runLiveScoring` reuses the exact load + pure‑engine + persist path as `runSimulation`
(`computeScores` / `deriveFindings` / `selectRecommendations`), only with `kind='live'`,
respondent identity, and `provisional=false` (readiness‑gated instruments are validated).

## AI-assisted consumer item text (governed propose → apply)

Authoring consumer wording for every item by hand is the biggest gate. The
**Consumer Text** tab (`/admin/studio/assessment/instruments/[id]/consumer-text`)
scaffolds it with AI, without ever letting the model write the canonical bank:

- `lib/ai/consumerItemText.ts#generateConsumerItemDrafts` loads the instrument's
  approved membership items (missing consumer text, or all), and in batches of 8
  asks the provider to rewrite each `item_text` into plain-language consumer
  wording. **Meaning and direction are preserved as a hard rule** — reverse-scored
  and negatively-worded items are never flipped (scoring is untouched regardless;
  this field is display-only).
- Generation type `consumer_item_text` is gated by the standard AI preflight
  (kill switch, `enabled_generation_types`, rate limit, daily cost ceiling) and
  owner+MFA (`requireAiOwner`); each pass records an `ai_generation_requests`
  row for cost tracking. Enable the type in **AI Settings** before first use.
- Drafts are **proposed in the review UI** with per-row quality flags (reading
  grade > 8, clinical terms, phrased-as-a-question, large length delta). Nothing
  is saved until the owner clicks **Apply** (or **Apply all**), which writes
  `consumer_item_text` through the existing governed item PATCH + audit
  (`studio.consumer_text.apply`).
- A live "N of total have consumer text" counter tracks readiness gate #3.

## Site integration

`app/(site)/assessment/page.tsx` renders a card per live instrument (from
`listLiveInstruments()`) under the hero, linking to `/assess/<public_slug>`. The section is
hidden entirely when nothing is live, so the Snapshot page is unchanged until an owner publishes.

## Owner runbook

1. Run `supabase/migrations/0030_instrument_publish.sql` in the Supabase SQL editor.
2. Assemble + approve the instrument's membership (Assembly tab).
3. Author cut‑points/bands (Scoring → Rules & Bands) and consumer item text (Item Bank).
4. Open the **Publish** tab; when all gates are green, click **Publish to live**.
5. Verify `/assess/<public_slug>` and the card on `/assessment`. **Unpublish** to take it down.

## Flagship swap — /snapshot now serves the Studio instrument

The flagship assessment at **`/snapshot`** is served by the Studio instrument
(`FLAGSHIP_SLUG` in `lib/flagship.ts`, currently `relationship-snapshot`) instead
of the legacy multi-route quiz. The swap is **routing/rendering only** — the
legacy engine is left byte-for-byte intact and dark:

- `app/snapshot/intro/page.tsx` renders `<AssessFlow slug={FLAGSHIP_SLUG} …>`
  (shared with `/assess/[slug]`); results at `app/snapshot/results/page.tsx`
  render `<AssessResults/>`. The single page handles intro → context → questions
  → capture, posting to the `/api/assess/*` endpoints and the studio engine.
- Legacy steps `phase-select`, `questions/[domain]`, `capture` are now
  server redirects to `/snapshot/intro`. `app/snapshot/layout.tsx` dropped the
  legacy `QuizProvider`.
- **Untouched (rollback path):** `lib/scoring.ts`, `app/api/score`,
  `app/api/results`, the `questions`/`quiz_*` tables, and `QuizContext`. The 47
  legacy engine tests still pass.
- The `/assessment` page hides the flagship from its "more assessments" cards
  (filtered by `FLAGSHIP_SLUG`); every site CTA already points to `/snapshot/intro`.

**Prerequisite:** the instrument must be published (`live_enabled` + `public_slug
= relationship-snapshot`) or `/snapshot` shows "not available." Scoring uses the
bands mirrored from the live `result_levels` (Needs Attention / Growth Opportunity
/ Healthy Development / Strength on the 1–5 scale).

**Rollback:** `git revert` the swap commit (restores the legacy `/snapshot`
pages + layout), or unpublish the instrument. No data migration is involved; the
legacy engine and tables were never modified.

## Invariants

- Snapshot untouched: nothing under `app/snapshot/*`, `app/api/score`, `app/api/results`,
  `lib/scoring.ts`, or the `questions`/`quiz_*` tables changes.
- Off by default: every instrument ships with `live_enabled=false`; public routes 404 until
  published.
