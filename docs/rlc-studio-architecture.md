# RLC Studio — Competency-Centered Architecture (Phase 1)

_Status: built on branch `studio-competency-refactor`, build-only. **Do not merge until the owner has reviewed the new workflow.**_

## Why this exists

The admin had grown into two flat "products" — **Studio** (`/admin/studio`) and a standalone **AI Studio** (`/admin/ai`). The Knowledge Base was an undifferentiated table of 6 phases + 6 domains + 111 competencies, and every asset (1,665 items, ~2,500 library rows) was browsed in type-keyed lists that only incidentally filtered by competency. That does not mirror the Relationship Life Cycle™ framework, which is strictly hierarchical.

This refactor makes the **competency the primary operational interface**, with the **Framework** as the canonical source of truth and **AI embedded** as an authoring tool rather than a separate destination. It is navigation + workflow only: **no schema change, no data migration, all existing URLs/behavior preserved.**

## Framework vs. RLC Studio

- **Framework** — the canonical intellectual property. Version-controlled, rarely changes, the source of truth. Phases · Domains · Competencies · Behavioral Indicators · Structural Markers · Developmental Tasks · Decision Log. Backed by `kb_competencies` + `studio_behavioral_indicators`/`incomplete_indicators` + scoring phase-mappings.
- **RLC Studio** — the authoring environment. Everything created in Studio derives from the Framework: Assessments, Content, Publishing, Review, AI-assisted authoring, Assets.

**The Framework powers Studio. Studio does not replace the Framework.**

## Guiding principle

The **Competency Workspace** is the primary operational workspace of RLC Studio. Once inside a competency, the owner should rarely need to leave it to build, review, publish, or maintain that competency's resources. The competency is the smallest complete operational unit.

## Information architecture

```
RLC ADMIN (sidebar)
├── RLC Studio        /admin/studio        ← primary authoring environment
├── Website           /admin/website       (unchanged)
├── Website Content   /admin/framework     ← RELABELED public-copy CMS (NOT the Framework)
├── Assessment · Knowledge Center · Academy · Institute · Live Sessions (unchanged)
└── (AI Studio removed as a top-level item — folded into RLC Studio → AI Services)

RLC STUDIO nav (StudioNav)
├── Overview        /admin/studio                 governance registry + review banner + Framework entry cards
├── Framework       /admin/studio/framework       canonical hierarchy (replaces the flat Knowledge Base)
│     Framework → Phase → Domain → COMPETENCY → Behavioral Indicators
│                                   │
│                                   ▼
│     COMPETENCY WORKSPACE  /admin/studio/competency/[code]   ← operational hub
│       Overview │ Behavioral Indicators │ Assessment (+Blueprint Coverage) │
│       Content │ Related Assets │ Publishing │ Health
│       └ contextual AI: Generate Items / Generate <content type>
├── Assessments     /admin/studio/assessment      (existing)
├── Content Library /admin/studio/library         (existing)
├── Assets          /admin/studio/assets          (existing)
├── Publishing      /admin/studio/publishing      hub → AI publishing + result recs
├── Review Queue    /admin/studio/review          hub → governance in-review + AI drafts
└── AI Services     /admin/ai                     owner-only; preserved AI Authoring Studio
```

## Competency Workspace tabs

`/admin/studio/competency/[code]` (e.g. `COM-EXPL-001` = Curiosity). A server layout loads the competency once (`getCompetencyByCode`, React-cached) and frames the tabs with badge counts.

| Tab | Backing source (existing) | Notes |
|-----|---------------------------|-------|
| Overview | `kb_competencies` 62-field detail | `CompetencyProfile`; edit-in-place via `KbRecordEditor` |
| Behavioral Indicators | `library/behavioral-indicators` + `incomplete-indicators` filtered by competency | reuses Library API + `GenericRowEditor` |
| Assessment | `assessment/items?competency_id=` | **Blueprint Coverage** summary + embedded **Generate items with AI** |
| Content | `library/[type]?competency_id=` across 7 competency-keyed types | embedded **Generate with AI** per type |
| Related Assets | aggregation by competency (server) | read-only traceability: assessments, content, recommendations, published destinations |
| Publishing | this competency's approved/published assets + active destinations | read view; publish/unpublish (owner+MFA) stays in the hub |
| Health | `getWorkspaceCounts` | **completeness dashboard** — flags missing asset types; the ecosystem-completion roadmap |

**Blueprint Coverage** derives candidate/approved/assigned/reverse/phase-anchored/duplicate counts from `studio_assessment_items`. Per-competency blueprint _requirement_ is not yet established in the item architecture, so a target coverage % is intentionally not computed (shown as such) until requirements exist.

**Lessons** are multi-competency (`competency_ids`), so they surface under Related Assets and remain managed in the main Content Library rather than the single-competency Content tab.

## Embedded AI (contextual, reuse only)

Assessment + Content tabs mount the existing `AiGenerateModal` pre-scoped to the current competency (`defaultCompetencyId` + `lockCompetency`), hitting the existing generate endpoints (`/api/admin/studio/assessment/items/generate`, `/api/admin/studio/library/[type]/generate`). Drafts arrive as `status='draft'`, `provenance='ai_generated'` exactly as before and are approved in place / via the item bank. No new AI infrastructure, no free-form chat. The preserved AI Authoring Studio (`/admin/ai/*`, staged `ai_*_drafts` flow) is unchanged and reached via **AI Services**.

## Routing changes

New routes (admin-gated by existing middleware): `/admin/studio/framework`, `/admin/studio/competency/[code]` + `indicators|assessment|content|related|publishing|health`, `/admin/studio/publishing`, `/admin/studio/review`.

Redirects (`next.config.ts`, `permanent: false`): `/admin/studio/kb` and `/admin/studio/kb/:path*` → `/admin/studio/framework`.

Preserved unchanged: every `/admin/ai/*`, `/admin/studio/assessment/*`, `/library/*`, `/assets`, `/objects/*`, `/preview/*`, and all APIs.

## New / changed files

**New**
- `lib/studioFramework.ts` — client config (workspace tabs, content types, hierarchy types)
- `lib/studioFrameworkData.ts` — server reads: `getFrameworkTree`, `getCompetencyByCode`, `getWorkspaceCounts`, `getRelatedAssets`, `getCompetencyPublishing` (all resilient)
- `components/admin/StudioNav.tsx` (replaces `StudioTabs`), `CompetencyWorkspaceTabs.tsx`, `FrameworkBrowser.tsx`, `CompetencyProfile.tsx`, `KbRecordEditor.tsx`
- `app/admin/studio/framework/page.tsx`, `app/admin/studio/competency/[code]/{layout,page,indicators,assessment,content,related,publishing,health}`, `app/admin/studio/{publishing,review}/page.tsx`
- `docs/rlc-studio-architecture.md`

**Changed**
- `app/admin/layout.tsx` — sidebar: Studio→**RLC Studio**, remove top-level AI Studio, Framework→**Website Content**
- `app/admin/studio/page.tsx` — Overview reframing + Framework entry cards (registry preserved)
- `components/admin/AiGenerateModal.tsx` — added `defaultCompetencyId` / `lockCompetency` (backward-compatible)
- 10 studio pages — `StudioTabs` → `StudioNav`
- `next.config.ts` — kb→framework redirects
- Removed `components/admin/StudioTabs.tsx`, `app/admin/studio/kb/page.tsx` (redirected)

## Key data note

Competencies store their phase in `kb_competencies.phase_slug` (all 111 populated); `competency_phase_slug` is null in the imported KB. The Framework tree + workspace read `phase_slug`. Verified live: 6 phases, 6 domains, 111 competencies; e.g. `COM-EXCL-006` → domain=communication, phase=exclusivity.

## Verification performed

- `tsc --noEmit` clean; `npm run build` green (all 10 new routes compiled); `npm test` 39/39 pass.
- Public surfaces unaffected: `/` and `/learn` → 200.
- Admin routes gated: all `/admin/studio/*` new routes → 307 → `/admin/login` (unauthenticated); no 500s; dev log clean.
- Redirect: `/admin/studio/kb` → 307 → `/admin/studio/framework`.
- Data layer exercised against live Supabase (service role): framework tree (6/6/111), competency detail (62 fields), workspace counts (items/indicators/content/recommendations), related assets, publishing — all return correct populated data with resilient empty-fallbacks.

## E2E checklist for owner review (authenticated)

1. Sidebar shows **RLC Studio** (no "AI Studio"), and **Website Content** (formerly "Framework").
2. `/admin/studio` = Overview with new nav + Framework entry cards; governance registry still present.
3. `/admin/studio/kb` redirects to `/admin/studio/framework`.
4. **Framework**: domains list with competencies grouped beneath; toggle **Domain→Phase / Phase→Domain**; each competency shows both domain + phase chips; search + hide-retired work.
5. Open **Curiosity (COM-EXPL-001)**: header shows name/code/status/domain/phase; all seven tabs load.
   - Overview: 62-field profile; **Edit record** opens the editor and saves.
   - Behavioral Indicators: only this competency's indicators.
   - Assessment: Blueprint Coverage stats + item list; **Generate items with AI** (pre-scoped) → new Drafts appear.
   - Content: per-type lists; **Generate with AI** per type (pre-scoped) → Draft appears.
   - Related Assets: assessments / content / recommendations / destinations.
   - Publishing: approved assets + destinations (or empty state); **Manage in Publishing** link.
   - Health: completeness dashboard; missing asset types flagged.
6. Publishing + Review hubs link to the existing surfaces, which still function.
7. **AI Services** (`/admin/ai`) fully functional (dashboard, builders, review, templates, settings).
8. Role gating: viewer read-only (no generate/edit); editor can draft/generate; owner-only actions unchanged.
9. A competency with zero assets shows clean empty states across every tab (no error).

## Backward compatibility & rollback

No schema/data changes. Every existing table, API, and page keeps working. Governance, AI staged approval, and RLS/role gating are reused unchanged. **Rollback** = revert the branch; there is nothing to un-migrate.

## RLC Studio Assistant (V1 — built)

A collapsible, **competency-route-aware** authoring panel scoped to `/admin/studio/*` + `/admin/ai/*`. It makes AI ambient across Studio by wrapping the **existing** generation endpoints — no new AI infrastructure, no free-form chat, no new cost surface.

- **Shell** `components/admin/StudioAssistant.tsx` (mounted in `app/admin/layout.tsx` inside `RoleProvider`): pathname scoping, persisted open state (`localStorage`), **push content on ≥lg / overlay + backdrop on <lg**, a11y (Escape, focus move + restore, focus trap when overlaid, `aria-expanded`, `role=dialog/complementary`, reduced-motion).
- **Content** `components/admin/AssistantPanel.tsx`: resolves the competency from the `/admin/studio/competency/[code]` route (shows name / domain · phase / code · status); in-context actions = **Generate assessment items** + **Generate <content type>** (label updates to the type) via the existing `AiGenerateModal` + generate endpoints (drafts flow through the existing approval path); no-context = searchable competency **picker** + quick links. Always: a deterministic **reading-level** check.
- **Registry endpoint** `GET /api/admin/studio/framework/competencies` (Framework-owned; `{id,name,domain,phase,status}` from `getFrameworkTree`) — replaces the temporary assessment-meta dependency.
- **Reading level**: shared pure util `lib/readability.ts` (also now the single source for `lib/ai/quality.ts`); shows grade/ease/word/sentence counts, a Grade-5 target, a <50-word reliability warning, and an "estimate only" disclaimer. No network, no AI.
- **Event logging**: `POST /api/admin/studio/assistant/event` records `assistant.opened|competency_selected|reading_level_check` via the existing `audit()` (no new tables; never logs pasted text).
- **Role gating**: viewers see the panel + reading level; generate actions are disabled with "Generation requires editor or owner access." Owner-only links (Content Builder, Review Mode) hidden for non-owners.

_V1 is competency-route-aware only. Later, context can also resolve from assessment items, content assets, review drafts, and publishing mappings._

## Competency Analytics tab (V1 — built, architecture scaffold)

The 8th workspace tab (`/admin/studio/competency/[code]/analytics`). Read-only. Real per-competency usage/performance analytics **does not exist yet** — the live quiz scores only to the ~4 competency *phases*, not to `COM-*` codes, and recommendations are never logged. So V1 shows what's real, scaffolds the rest, and makes **zero changes to the live results/score path** (no migration).

- **Data** `lib/studioAnalyticsData.ts#getCompetencyAnalytics(code, competency)` → `{ inventory, simulation, phaseContext, domainContext }`, each with `{ source, version, validation, updatedAt }` provenance. Resilient.
- **Strict separation:** competency-specific blocks (inventory, owner **simulation** results from `studio_score_results`) are kept apart from **broader context** (phase/domain live averages), which is explicitly labeled *shared — not a measure of this competency*.
- **Deterministic mappings only:** phase via `competency_phases.slug`, domain via `domains.slug` (both confirmed to exist). No presentation-label / name matching; returns null if unmapped.
- **No false comparison:** simulation is labeled *Provisional (owner test data)* and flagged not-comparable to the live aggregates (different scale/version).
- **Prominent banner:** validated live-respondent analytics for the individual competency are not yet available.
- **"Not yet tracked" cards** name the real future events — *completion rate, live performance, recommendation displayed / clicked, resource started / completed* — each with the instrumentation it needs.
- **Live path untouched:** verified `app/api/results/*`, `app/api/score/*`, `lib/scoring.ts` unchanged.

## Governed Question→Indicator→Competency mapping layer (built)

Canonical assessment architecture: a **governed traceability + descriptive-analysis** system that maps each live 47-item Snapshot question to the **behavioral indicator** it reflects (competency/domain/phase derived from the indicator). It is **not** validated competency scoring. **The public scoring/results path is untouched** — `quiz_responses` is read only for descriptive aggregates.

- **Migration `0027_live_question_map.sql`** (owner-run): a single RLS-locked, append-only table; no `ALTER` on `questions` or any live scoring table. Governance columns: `status` (draft/approved/superseded/retired), immutable `version_no`, `effective_from/to`, `rationale`, `confidence_level`, `assessment_version_id`, `mapping_kind` + `exception_reason`, `scoring_eligible`, `weight`, `reviewed_by`/`approved_by`.
- **Lifecycle:** editors create drafts; **only the owner approves** (superseding the prior current mapping — history preserved, never deleted); retire keeps history; delete is draft-only.
- **Data** `lib/questionMap.ts` (client types, coverage tiers) + `lib/questionMapData.ts` (server: governed writes + `getCompetencyLiveSummary`). The descriptive read applies a **response-model compatibility gate** (competency-phase items only — expiration-risk excluded — and `scoring_eligible` only) before aggregating.
- **Tool** `/admin/studio/assessment/question-map` (Studio → Assessment → Question Map): the 47 questions with competency→indicator pickers, rationale/confidence, discouraged direct-to-competency fallback (requires exception reason, `scoring_eligible=false`), draft→approve→supersede→history, coverage counter.
- **Analytics** `getCompetencyAnalytics` gains `liveSummary`; the competency Analytics tab shows a **"Live mapped response summary"** — mapped question/indicator counts, contributing sessions, assessment version, mapping version, coverage tier, and validation status **"Exploratory — not psychometrically validated"** (never "Validated live"). "Completion rate" was removed (not meaningful for fixed-form/complete-only data). Note: a 47-item Snapshot does not validly measure all 111 competencies.
- **Verified:** build green, 39 tests, consumer path untouched (`git diff`), resilient pre-migration (47 questions load, `no_coverage`). Governance + descriptive E2E runs after the owner applies `0027`.

## Deferred (follow-ups after validation)

- **Formal validated scoring/interpretation/recommendations** from the mapping (Assessment System build); weighted/multi-indicator mapping UI; adaptive assessment.
- **Engagement event log** on `/api/results` + surfaces (recommendation displayed/clicked, resource started/completed) — no clean per-competency surfaces today. Consumer-path-touching — a deliberate separate branch.
- Cross-competency Studio-level Analytics dashboard.
- **Studio Assistant** capability expansion: Summarize Competency, Find Duplicates, inline AI Review, conversational assistant (each needs a new owner+MFA AI endpoint / cost surface); broader (non-route) context resolution.
- Standalone cross-competency **Analytics** (completion rates, performance, most-assigned, recommendation frequency).
- **Sandbox**.
- Framework **Structural Markers** + **Decision Log** as first-class editable screens (currently linked to existing data).
- Optionally moving the `/admin/framework` "Website Content" CMS fully under Website.
