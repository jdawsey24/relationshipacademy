# Companion Safety — V1 (lightweight layer)

An **educational** safety layer, not a clinical crisis-classification engine. Scoped by the owner (a licensed clinician + framework author) 2026-07-21. Expandable later into the full L0–L3 taxonomy in `docs/companion-safety-authoring-brief.md` without a schema change.

## What it does
1. **Persistent access to crisis resources** — a "Get help" affordance is always reachable in the Companion (chrome + experience runner). It appears only once at least one verified resource is authored.
2. **Clinician-authored trigger library** — obvious high-risk terms/phrases.
3. **Interruption of the educational flow** — when a learner's free-text (experience autosave) matches an active trigger, the API returns a `safety` payload and the client shows a full-screen supportive interstitial instead of continuing.
4. **Supportive language + verified resources** — shown on interrupt (clinician-authored, non-diagnostic, non-directive).
5. **Metadata-only audit log** — records that an event fired (trigger, level, context, situation ref, timestamp) — **never the learner's raw text**.

## Architecture
- **Migration `0047_companion_safety.sql`** (owner-run) — `companion_safety_triggers`, `companion_safety_responses` (one per level), `companion_safety_resources`, `companion_safety_events`. All service-role only (no client RLS); learners reach content via server APIs. Schema-forward: `level` (V1 `high_risk`) + `risk_category` present for the future taxonomy.
- **Runtime** — `lib/companion/safety.ts#screenText()` loads active triggers, matches (keyword/phrase/regex), logs a metadata-only event, returns `{ heading, message, resources }`. Wired into `PATCH /api/companion/entries/[id]` (the educational flow). Fails safe (no triggers / infra error → no interruption, never crashes the save).
- **Consumer** — `GET /api/companion/safety/resources` (signed-in), `components/companion/GetHelp.tsx` (persistent), `SafetyInterstitial.tsx` (interrupt).
- **CMS** — `/admin/companion/safety` (owner/editor) manages triggers, response language, resources, and shows the audit log. Linked from the Companion admin landing page.

## Content boundary
**Engineering/AI authored NO clinical content.** The tables ship EMPTY. The clinician authors triggers, response language, and resources in the CMS. The layer is **inert until** an active trigger + a response message + an active resource all exist (the CMS shows a readiness banner). A generic non-diagnostic fallback message exists only so a misconfiguration never shows a blank screen — the clinician overrides it.

## Owner / clinician steps
1. Run migration `0047_companion_safety.sql`.
2. In `/admin/companion/safety`, author: the trigger library, the supportive response message, and the verified resources.
3. **Verified crisis resources + jurisdiction-specific content are legally reviewed and owner-approved before launch** (the CMS stamps a verification date when "verified by" is filled).

## Notes / open items for legal
- **Retention:** `companion_safety_events.user_id` is `on delete set null`, so the metadata audit trail persists (detached) if an account is deleted. Confirm this retention posture with legal, and whether the account-delete flow should purge safety events.
- **Scope:** V1 screens every learner free-text authoring surface — the guided experience (`entries`, context `experience`), the **Blueprint** (context `blueprint`), and the **Conversation Planner** (context `planner`). Journey PATCH is only title/tags/favorite (the reflections themselves are screened at creation), so it is intentionally not screened.
- Minors policy, mandatory-reporting posture, and human-escalation path remain open questions from the authoring brief (§11).
