# Relationship Companion — Implementation Plan

**Status: REVISED PLAN FOR FINAL REVIEW. No migrations run, no code written, nothing deployed.**
The six open decisions are now resolved per owner direction (see §15); this revision reflects them. Product owner must give final approval before Phase 1. Placeholders only — no final RLC™ content, prompts, practices, safety copy, legal/onboarding/email copy, icons, or install screenshots will be authored by the build; all ship as clearly labeled placeholders until supplied.

**Owner decisions locked (2026-07-19):** one-time standalone purchase with ongoing authenticated access + extensible entitlements · independent from the Academy tier ladder · dedicated `companion_*` tables reusing Studio governance utilities · privacy-first PWA (no private content cached offline) · public preview before purchase, onboarding only after purchase+auth+entitlement · placeholders throughout · hardened consumer session security (email verification, reauth for sensitive actions, session revocation, optional-MFA-ready) with **no mandatory consumer MFA in V1**.

---

## 1. Existing architecture review (what we're building on)

Confirmed by a read-only sweep of the codebase. The Companion **reuses**, does not duplicate:

- **Identity — one Supabase Auth pool.** `auth.users` already backs staff (`app_metadata.role`), Academy members (`profiles.membership_tier`), and Institute pros (`profiles.is_professional`). Companion is another slice of the same pool. Clients: `getSupabaseAdminClient()` (service-role, bypasses RLS — server workhorse), `getSupabaseBrowserClient()` (session cookie, login), cookie-bound server client for identity checks. **Reuse target = the Academy member pattern** (`lib/academyAuth.ts`: `getMember()`/`requireMember()`, `ensureProfile()`, per-page `redirect()`).
- **RLS convention.** User-owned tables: `user_id uuid references auth.users(id) on delete cascade` + `using (auth.uid() = user_id)`. Content/paid tables: RLS enabled, **no public policy**, read server-side via service role with app-code gating. Auto-provision via `handle_new_user()` trigger + lazy `ensureProfile()` fallback.
- **Admin governance — the Studio spine.** `studio_objects` (registry) + `studio_versions` (**immutable snapshots**) + `studio_reviews` (**append-only** log), driven by a status ladder `draft→in_review→changes_requested→approved→published→retired` with a client+server transition engine (`lib/studio.ts`, `lib/studioWorkflow.ts`) that re-reads DB state, re-checks role (owner-only publish), and runs a per-type **Publisher** projecting an approved version into a live table. This is the exact shape to clone.
- **Reusable-piece → assembled → published → per-session-frozen** already exists twice (Studio Assembly `0028`; Snapshot slots→`session_items` `0034`). The Companion's blocks map onto it directly.
- **Stripe + finance.** `stripe@22`, subscription checkout (`app/api/academy/checkout`), webhook flips `profiles.membership_tier` + syncs a finance read-model (`stripe_transactions` already models `one_time` via charge `metadata.billing_type`/`product_id`). **No generic entitlement layer exists** — access is a tier scalar + the `is_professional` boolean precedent.
- **Design.** Tailwind v3, brand tokens (`midnight-navy`, `coral-rose`, `warm-ivory`, `charcoal`, …), fonts `display`/`body`/`ui`, `CtaButton` primitive. Warm-ivory/charcoal is the default theme. No component-library — per-area UI barrels (`components/academy/ui.tsx`).
- **PWA: none today.** No manifest, service worker, or icon set — net-new (mind the enforcing CSP in `next.config.ts`).
- **Email.** Resend via `sendEmail()` (resilient, no-op without key). Only marketing drips exist — **no transactional/receipt email and no one-time-purchase flow yet** (both net-new).
- **Flags.** `lib/flagship.ts` constants + DB kill-switch (`lib/ai/settings.ts`) + env "configured?" gating. Hide pre-launch by holding the middleware matcher + a `lib/companion.ts` flag.
- **Migrations.** `supabase/migrations/00NN_*.sql`, idempotent, run manually, `notify pgrst` footer, UUID PKs. Latest = `0036`. Companion starts at **`0037`**.
- **Guardrail.** `lib/scoring.ts` and `app/snapshot-legacy/*` (the RPI 47-item engine) stay untouched. New logic lives under `lib/companion/*` with its own `test/companion-*.test.ts`.

---

## 2. Proposed route structure

New **bare top-level area** `app/companion/*` (peer of `academy`), its own mobile-first chrome; API under `app/api/companion/*`. Admin CMS under existing `app/admin/companion/*`.

```
app/companion/
  layout.tsx                      # <CompanionChrome> — bottom tab nav, warm-ivory, standalone-aware
  page.tsx                        # Home — "What are you navigating right now?"
  onboarding/                     # 4-step: intro → status → interests → privacy ack
  process/                        # situation library: browse by status + by topic, search/filters
    [experienceSlug]/page.tsx     # experience launch → block renderer (guided session)
  blueprint/                      # living Blueprint sections (autosave)
  journey/                        # timeline of saved entries, drafts, plans, milestones
    [entryId]/page.tsx            # entry detail (view/edit/append/archive/delete)
  library/                        # Playbooks / unlocked / Academy-linked / resources
  planner/                        # standalone Conversation Planner
  settings/                       # status, interests, notifications, "Add Companion to my phone"
  install/                        # device-aware Add-to-Home-Screen guide (reopenable)
  welcome/                        # post-purchase access flow ("Open My Relationship Companion")
  (auth) login / signup / reset / verify   # mirror academy auth pages + email-verification gate (public allow-list)

app/(site)/companion/             # PUBLIC pre-purchase preview (what it is, sample screens, buy) — no auth

app/api/companion/
  profile, status, interests, onboarding
  experiences (list/detail, published-only), entries (CRUD + autosave PATCH),
  blueprint, planner, milestones, entitlements/me, install-state, notifications, checkout
app/api/admin/companion/
  experiences, blocks, categories, mappings, entitlements, safety-rules,
  featured, reviews/transitions, publish, preview
app/manifest.ts                   # PWA manifest (net-new)
app/api/stripe/webhook            # EXTEND: add applyCompanionGrant branch (no new webhook)
```

**Public preview vs gated app (decision 5).** The **marketing/preview** lives in `app/(site)/companion/*` (public, no auth) — what the product is, sample screens, buy button. The **authenticated app** is `app/companion/*` and is gated: a signed-in user **without an active `companion_entitlements` grant** is routed to purchase/access, **not** into onboarding. Companion **onboarding begins only after purchase + authentication + entitlement activation**. Post-purchase order: **purchase confirmation → account access (verify email / sign in) → Companion onboarding → product launch (Home) → device-appropriate Add-to-Home-Screen guidance** (see §16).

Middleware: add a `/companion` + `/api/companion` branch **copied from the Academy member branch** (Supabase session; **no mandatory MFA in V1** but session security per §11), with a public allow-list for login/signup/reset/verify/welcome. The gated app additionally checks the entitlement in app code (redirect to `/companion/welcome` if missing). Admin CMS covered by the existing `/admin` matcher (MFA-enforced). Pre-launch: the matcher/branch is added but the area is flag-gated (`lib/companion.ts`), and nav/preview links stay hidden.

---

## 3. Proposed component tree

```
components/companion/
  CompanionChrome.tsx        # shell: bottom-nav (Home/Process/Blueprint/Journey/Library), standalone detection
  ui.tsx                     # SituationCard, SectionCard, Field, TextArea(autosize), Chip, SaveState, EmptyState, SafetyNotice
  blocks/                    # one renderer per block type (see §7) + BlockRenderer dispatcher
  onboarding/                # StatusPicker, InterestPicker, PrivacyAck
  install/                   # InstallGuide (iOS/Android/desktop variants), InstallPrompt (beforeinstallprompt)
  blueprint/BlueprintSection.tsx
  journey/EntryCard.tsx, Timeline.tsx, Filters.tsx
  planner/ConversationPlanner.tsx
components/admin/companion/  # ExperienceEditor, BlockPalette, BlockList (reorder/duplicate/conditional),
                             # MappingsPanel, EntitlementPanel, ReviewBar, PreviewPane, SafetyRulePanel
```
Reuse `CtaButton`, `Logo`, brand tokens. Autosave/session hooks in `lib/companion/hooks` (client). No gamification, calm/premium, large tap targets, autosizing fields, a11y labels.

---

## 4. Proposed database schema (design — DDL comes with the approved migration)

All tables `companion_`-prefixed (or as spec-named), UUID PKs, `created_at/updated_at timestamptz`, RLS per §5. Two clearly separated layers:

**A. Consumer identity & preferences**
- `companion_profiles` (`user_id` PK → auth.users): current `structural_status_id`, onboarding_completed_at, install_state, notification prefs, timestamps.
- `structural_statuses` (lookup): consumer label (Single/Dating/Committed/Engaged/Married), internal `structural_context` value, display_order. **No phase mapping.**
- `user_structural_status_history`: (user_id, structural_status_id, changed_at) — append-only; status change never rewrites past entries.
- `user_interest_preferences`: (user_id, topic) — preference filters only.

**B. Content library (owner-authored, governed)**
- `experiences`: governance record — stable id, title, consumer_title, slug, short_description, est_minutes, guided|free, owner, status, current_version, published_version, review fields, canonical/decision-log refs, internal_notes. **RLC metadata fields (all optional, internal):** structural_context, phase, developmental_task, domain, competency, situation_category, consumer_topic, playbook_connection, academy_lesson_connection, recommended_practice, safety_classification, reading_level, audience(public|professional), version, review_status, canonical_source_ref, decision_log_ref.
- `experience_versions`: **immutable** — (experience_id, version_no unique), `blocks jsonb` (ordered block payloads), authored_by, created_at. Never mutated.
- `reusable_block_templates`: the block library (type, default payload, label) — reused across experiences.
- `experience_blocks`: blocks belonging to a draft experience (type, order, payload jsonb, conditional_on jsonb) — snapshotted into `experience_versions.blocks` at publish. (Draft-editable; version body is frozen.)
- `experience_categories`: category/topic taxonomy (self-referencing parent for top-level vs sub).
- Many-to-many mappings, each supporting **include/exclude**: `experience_status_mappings`, `experience_domain_mappings`, `experience_phase_mappings`, `experience_competency_mappings`, `experience_practice_mappings` (each: experience_id, target_id, `mode enum('include','exclude')`).
- `safety_rules`: condition → action (suppress experience / show notice / recommend professional / crisis route / bypass confrontation). Placeholder copy.
- `content_reviews`: **append-only** per-experience workflow log (mirrors `studio_reviews`).
- Featured: `experience_featured` (experience_id, audience/status scope, window).

**C. Entitlements (two distinct concepts — do not conflate)**
- `experience_entitlements` (content rule): per-experience unlock policy — `included | free_preview | playbook_unlock | academy_unlock | subscription | manual | featured` (+ ref to the unlocking product).
- `companion_entitlements` (user grant): (user_id, **`source`**, `product_key`, stripe_customer_id, stripe_ref, status `active|canceled|expired`, granted_at, expires_at nullable, granted_by, notes). **Extensible by design** (decision 1): `source enum` opens as `one_time_purchase` and reserves `bundle | academy_inclusion | promotional | manual_grant | subscription` so future access models add a value, not a schema rewrite. Perpetual for the one-time purchase (`expires_at = null`); the column exists so time-boxed promos/bundles work later. Independent of `profiles.membership_tier` (decision 2) — an Academy grant would *write a companion_entitlements row*, never fold Companion into the tier ladder.

**D. Private user work (all `user_id`, RLS-owned, sensitive)**
- `user_entries`: a saved/started experience run — user_id, experience_id, **`experience_version_id` (immutable FK — the exact published version used)**, **`structural_status_id_at_time`** (frozen), status (draft|complete|archived), started_at, completed_at, updated_at.
- `user_entry_responses`: (entry_id, block_ref, response jsonb) — per-block answers.
- `user_entry_status`, `user_entry_tags`, `user_entry_favorites`: journey organization.
- `conversation_plans`: standalone or entry-linked planner fields (jsonb).
- `blueprint_sections`: (user_id, section_key, body, updated_at) — one row per section.
- `blueprint_section_versions`: optional archived revisions (immutable).
- `user_milestones`: saved wins / milestones.
- `admin_audit_log`: **reuse existing `audit_log`** for admin content changes (do not create a parallel).

**Historical integrity:** a `user_entry` is pinned to `experience_version_id`; revising an experience creates a new version and never mutates prior entries. Status change writes history and stamps new entries only.

---

## 5. Row-level security plan

- **Private user tables** (`user_entries`, `user_entry_responses`, `conversation_plans`, `blueprint_sections`, `*_versions`, `user_milestones`, `companion_profiles`, `user_*`): RLS ON, `using (auth.uid() = user_id) with check (auth.uid() = user_id)`. Child tables (responses/tags) enforce ownership via a join-guard policy or `user_id` denormalized for a direct check. Users see only their own rows.
- **Content tables** (`experiences`, `experience_versions`, mappings, categories, safety_rules, entitlement rules): RLS ON, **no public policy** — read server-side via service role; consumer API returns only **published** experiences the user is entitled to, gated in app code (the Academy model). Owner CMS writes via service role behind `requireOwner`/`requireEditor`.
- **Lookups** (`structural_statuses`): readable to authenticated (or served via API).
- Defense-in-depth: every API route re-checks auth/role even though middleware gates. No journal text ever leaves the owner's row via any world-readable path.

---

## 6. Content-management architecture (owner-only)

Clone the Studio governance spine for Companion content:
- **Registry + immutable versions + append-only reviews** (`experiences` / `experience_versions` / `content_reviews`).
- **Status ladder** `Draft → Internal Review → Theory Review → Clinical/Safety Review → Approved → Published → Archived` (spec's 7 statuses; extends the Studio 6 with two review gates). Transition engine mirrors `lib/studio.ts` (`canTransition`, owner-only approve/publish) re-checked server-side.
- **Block authoring**: add/remove/reorder/duplicate/conditional-display/draft/preview/publish/unpublish, all data-driven — **no code change to add or edit content**. A **Publisher** snapshots the current draft's blocks into a new immutable `experience_versions` row and flips `published_version`.
- **Every record** carries: stable id, title, consumer_title, slug, short_description, est_minutes, version, owner, created/revised, reviewer, approval_status, canonical_source, decision_log_ref, internal_notes.
- Admin lives under `app/admin/companion/*`, gated by `requireOwner`/`requireEditor`; mutations write `content_reviews` (per-object) **and** `audit()` (global trail).

---

## 7. Experience-block rendering architecture

A **data-driven block renderer**: `experience_versions.blocks` is an ordered array of `{ type, payload, conditional_on? }`. `BlockRenderer` dispatches on `type` to a registered component; unknown types render a safe fallback. All 22 spec block types are registered (intro context, educational note, single/long/multiple-choice/checkbox/emotion/fact-vs-assumption/perspective/values/needs/boundary/decision-comparison/conversation-planner/ownership/pattern/practice/safety-notice/professional-support/closing-summary/user-next-step/free-write). Input blocks write to `user_entry_responses` keyed by block ref; content blocks are display-only. **Conditional display** evaluates `conditional_on` against prior responses. **Safety blocks** consult `safety_rules` and can suppress/replace downstream blocks. Content is `[PLACEHOLDER]` until the approved library is supplied — the renderer ships; the words don't.

---

## 8. Entitlement model

**V1 = one-time standalone purchase → perpetual authenticated access** (decision 1). Independent of the Academy tier ladder (decision 2). Two layers resolved at access time:
1. **User grant** (`companion_entitlements`) — does this user have Companion access at all? For V1, a `one_time_purchase` row written by an `applyCompanionGrant` branch added to the **existing** Stripe webhook (one-time via `metadata.billing_type='one_time'` + `product_id='companion'`), keyed by `stripe_customer_id`. Finance dashboard populates for free via existing metadata. Checkout forks `app/api/academy/checkout` into **one-time `mode:'payment'`**. The `source` enum + nullable `expires_at` mean **bundles, Academy inclusion, promo grants, and manual grants attach later by writing a row with a different `source` — no restructuring** (decision 1). A future Academy inclusion writes a `academy_inclusion` grant; it never touches `membership_tier` (decision 2).
2. **Content rule** (`experience_entitlements`) — is this specific experience unlocked for an entitled user? `included | free_preview | playbook_unlock | academy_unlock | subscription | manual | featured`. Resolver `companionCanAccess(user, experience)` mirrors `memberCanAccess` and reads `companion_entitlements` (never the tier).
**Phase 1–3 use placeholder grant logic; real Stripe wiring lands in Phase 4 after a focused commerce review** (per spec "do not connect final commerce logic until reviewed").

---

## 9. Draft & autosave strategy

- Every guided run is a `user_entry` (status `draft`) created on start; responses PATCH to `user_entry_responses` **debounced (~1–2s)** and on blur/step-change.
- Clear saved-state indicator (Saving… / Saved · hh:mm), resume-later, draft recovery on reopen, `beforeunload` guard on unsaved edits, manual "Save & exit", completion allowed without answering non-required blocks.
- Blueprint sections autosave per-section (own row), last-updated shown.
- Autosave is idempotent and additive; never blocks navigation; no data lost on interrupted sessions.

---

## 10. Versioning strategy

- `experience_versions` are **immutable**; editing produces a new version (never overwrites). `published_version` pins what's live.
- `user_entries.experience_version_id` FK freezes the exact version a person used — revisions never alter past entries (the one net-new guarantee vs existing patterns).
- Relationship status is frozen per entry (`structural_status_id_at_time`); status history is append-only.
- Blueprint optional `blueprint_section_versions` for archived revisions.

---

## 11. Safety, privacy & account/session security plan

- **Safety boundaries (hard):** the product does not diagnose, decide stay/leave, label abuse, act as therapy/crisis care, pressure disclosure, or infer certainty. `safety_rules` infra supports: suppress an experience, show a safety notice, recommend a professional, crisis-resource routing, bypass confrontation exercises when risk is indicated. **All safety copy/escalation is `[SAFETY COPY TO BE PROVIDED]`.**
- **Privacy of entries:** entries are sensitive personal data — user-level RLS (§5), owner-only CMS, users access only their own entries. **No journal/Blueprint/plan text in analytics, notifications, error/Sentry payloads, or URLs** (decision-reinforced). No entry content for training/ads/public analytics. No partner sees another's private entries. Explicit confirmation before deletion; account-level deletion architecture; export-ready schema.

- **Account & session security (V1 — no mandatory consumer MFA, but hardened and MFA-ready):**
  - **Email verification required.** Unlike the Academy's pre-confirmed signup, the Companion account must verify email before the app unlocks. Post-purchase flow: Stripe has the purchaser's email → create the account and require a verification step (Supabase email confirmation / magic link) before onboarding. Unverified accounts can sign in but land on a "verify your email" gate, not the app.
  - **Secure session handling.** Supabase Auth httpOnly session cookies refreshed by middleware (existing pattern); no tokens returned from API routes; short-lived access token + rotating refresh; `Secure`/`SameSite` cookies over HTTPS (CSP already enforced).
  - **Reauthentication for sensitive account actions.** Changing email/password, deleting the account, or exporting all data requires a fresh reauth (recent-login check / password re-entry) even within an active session.
  - **Session revocation.** A "sign out of all devices" action (Supabase `auth.admin.signOut` / global sign-out) and server-side revocation on password change; surfaced in Settings.
  - **Optional-MFA-ready architecture.** Auth layer built so a user can *opt into* TOTP later (Supabase MFA factors, same primitives the admin login already uses) without reworking session handling — V1 ships the hooks, not the requirement.
  - **Defense-in-depth:** every `/api/companion/*` route re-checks the session + entitlement; RLS is the backstop, app-code the gate.

---

## 12. Analytics plan

- Track **product-usage events only**, in a table/stream separate from private content: onboarding_completed, status_selected/changed, experience_opened/started/completed, draft_resumed, planner_launched, blueprint_section_completed, resource_opened, entitlement_unlocked, install_prompt_shown/dismissed/completed.
- **Never** track typed reflection text, sensitive selections, Blueprint answers, conversation details, or entry summaries. Reuse the existing site analytics pattern; payloads carry ids + event names, never content.

---

## 13. Testing strategy

- `node:test` in `test/companion-*.test.ts` for pure logic: entitlement resolver, block conditional evaluation, status→experience prioritization/exclusion, versioning/immutability, safety-rule suppression.
- Live E2E smoke (mirror `scripts/test-score.mjs`): onboarding → open published experience → start → autosave → exit → resume → complete → entry pinned to version + status.
- Per phase: `tsc`/`next build` green, RLS verified (a user cannot read another's entry), legacy `lib/scoring.ts` untouched (`git diff --stat`), owner-can-author-without-code check, PWA installability validation.

---

## 14. Migration sequence (owner-run, idempotent, starting 0037)

- **0037** — consumer identity: `companion_profiles`, `structural_statuses` (+seed 5), `user_structural_status_history`, `user_interest_preferences` + RLS.
- **0038** — content governance: `experiences`, `experience_versions`, `reusable_block_templates`, `experience_blocks`, `experience_categories`, `content_reviews` + RLS.
- **0039** — mappings + safety + featured + `experience_entitlements` (content rules).
- **0040** — private user work: `user_entries`, `user_entry_responses`, `user_entry_status/tags/favorites`, `conversation_plans`, `blueprint_sections`, `blueprint_section_versions`, `user_milestones` + RLS.
- **0041** — `companion_entitlements` (user grants) + finance/webhook hookup fields.
- Each additive, `if not exists`, `notify pgrst`. Owner runs each; I seed placeholder records + reusable block templates via service-role script.

---

## 15. Decisions (resolved), assumptions & residual risks

**Assumptions:** reuse Supabase Auth (`companion_profiles.user_id → auth.users`); reuse the existing Stripe/finance + Studio governance stacks; RPI/`lib/scoring.ts`/`app/snapshot-legacy/*` untouched.

**The six decisions — RESOLVED (owner, 2026-07-19):**
1. **Access = one-time standalone purchase** with ongoing authenticated access. Entitlements extensible (`source` enum + nullable `expires_at`) so bundles / Academy inclusion / promo / manual grants add later without restructuring (§8).
2. **Independent from the Academy tier ladder.** Academy may later *grant* a Companion entitlement (a `companion_entitlements` row), but Companion stays its own product/entitlement; never folded into `membership_tier` (§8).
3. **Dedicated `companion_*` content + user tables, reusing Studio governance utilities/transition logic** where appropriate — no duplicated governance code (§6, §10).
4. **Privacy-first PWA:** installable manifest, branded Home Screen, standalone mode, **static app-shell caching only**, graceful offline screen. **No journal entries, Blueprint, conversation plans, or any private user content cached offline** (§16).
5. **Public preview before purchase; onboarding only after purchase + auth + entitlement.** Post-purchase order: confirmation → account access → onboarding → launch → Add-to-Home-Screen guidance (§2, §16).
6. **Placeholders** for icons, install screenshots, legal/safety/onboarding/transactional-email copy, and all RLC™ content until supplied.

**Plus (owner-directed) security hardening** — email verification, secure session handling, reauth for sensitive account actions, session revocation, private content excluded from notifications/logs, optional-MFA-ready; **no mandatory consumer MFA in V1** (§11).

**Residual risks:** (a) scope is large — mitigated by the 4-phase split behind a feature flag; (b) safety/clinical + legal copy is out-of-scope for the build and gates real launch; (c) commerce wiring deferred to Phase 4 pending a focused Stripe review; (d) email-verification-after-purchase UX needs care so a paying customer is never locked out — plan a resilient "resend verification" + support path; (e) CSP needs narrow same-origin additions for the manifest/service worker (low risk).

**Build phases (after final approval):** Phase 1 schema+RLS+CMS+placeholders · Phase 2 onboarding+Home+Process+renderer · Phase 3 Blueprint+Journey+Planner+drafts/autosave+search · Phase 4 entitlements+Stripe/Academy/Playbook integrations+notifications+exports+analytics+PWA polish+QA. Feature-flagged hidden until you approve launch.

---

## 16. Post-purchase access flow & PWA (privacy-first)

**Purchase → access sequence (decision 5):**
1. **Purchase confirmation** — after successful one-time checkout, a confirmation screen: "Access activated" + **"Open My Relationship Companion"** button. Framed as *instant access to a secure web app you save to your phone* — **never** "download your journal PDF."
2. **Account access** — create/claim the account tied to the purchaser's email; **email verification** gate (§11) before the app opens.
3. **Companion onboarding** — the 4-step onboarding (intro → status → interests → privacy ack) runs now, once entitled.
4. **Product launch** — land on Home ("What are you navigating right now?").
5. **Add-to-Home-Screen guidance** — device-appropriate, dismissible install guide (below).
- **Transactional email** (net-new; reuse `sendEmail` + a new inline-table template): access confirmation, direct link, sign-in + verification instructions, Home-Screen install steps, basic troubleshooting. Copy is `[TRANSACTIONAL EMAIL COPY TO BE PROVIDED]`.

**Install-to-Home-Screen onboarding:** first mobile visit shows a dismissible, device-detected guide.
- **iOS/Safari:** manual visual walkthrough (Share → Add to Home Screen → Add) with placeholder screenshots (iOS has no programmatic prompt).
- **Android/Chrome:** capture `beforeinstallprompt`, show "Add Companion to Home Screen"; manual fallback when unavailable.
- **Desktop:** continue in browser; optional Install action where supported.
- Persist install-guidance state (shown/dismissed/completed) on `companion_profiles`; **never falsely claim install succeeded** when the browser can't confirm; reopen from **Settings → "Add Companion to my phone"**; provide a troubleshooting link.

**PWA scope (V1, privacy-first — decision 4):**
- `app/manifest.ts` (net-new): name, short_name, standalone display, theme/background (warm-ivory/navy), branded icon set (**placeholder icons** in all required sizes incl. maskable + apple-touch), iOS Home-Screen metadata via `appleWebApp`/`viewport` in `app/companion/layout.tsx`.
- Service worker caches the **static application shell only** (HTML shell, CSS/JS, icons, fonts) → fast launch + graceful **offline screen**. **No caching of any authenticated API response or private user content** (entries, Blueprint, plans) — those are always network-fetched behind auth; offline shows the offline screen, not stale/cached private data.
- Installability validation in QA; CSP gets same-origin manifest/SW allowances in `next.config.ts`.
- **Consumer language** only in UI ("Add to Home Screen", "Save to Your Phone", "Use It Like an App"); technical terms (PWA, service worker, manifest) stay in internal docs.

**Post-purchase acceptance:** immediate authenticated access; confirmation page explains mobile access; first-time mobile user gets device-appropriate install guidance; Android native prompt where supported; iOS Safari-specific steps; guide reopenable; standalone launch after install where supported; messaging never implies a PDF/App-Store download; access stays tied to the authenticated account.
