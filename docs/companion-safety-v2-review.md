# Safety Layer V2 — Consolidated End-to-End Review

**For:** Owner / clinician sign-off before enabling the public Companion.
**Status:** Built across four approved stages; migration run; registry seeded; **feature flag OFF**.
**Decision requested:** approve the system end-to-end (or flag changes). Enabling
`NEXT_PUBLIC_COMPANION_ENABLED` is a **separate, explicit** step that stays blocked until you say so.

This is an **application-level safety system around** the Relationship Life Cycle™ framework.
It does **not** modify any RLC construct, competency, developmental task, domain score, phase, or
assessment scoring.

---

## 1. What the system does (data flow)

```
learner free-text (experience / blueprint / planner / journey title)
  → normalize in memory (never persisted for safety)
  → SafetyEngine.classify()         [pure, deterministic — lib/companion/safetyEngine.ts]
       per-clause negation · subject (media/hypothetical/3p) · temporality · multiple categories
       immediate_danger = actionable disclosure + STRONG present-danger signal
  → routing decision (action_level 0–3, immediate_danger, categories, digital_safety)
  → authorized persistence of the learner's own entry (their content is theirs)
  → structured, version-stamped safety event   [METADATA ONLY — never raw text]
  → normal Companion processing only when action_level = 0
  → client render: L1 non-blocking notice · L2/L3 blocking interstitial · immediate addendum · discreet mode + Quick Exit
```

## 2. Stages delivered

| Stage | Result |
|---|---|
| 1. Engine + context modules | `lib/companion/safetyEngine.ts` (pure), 41 engine tests |
| 2. Schema + registry | `0048_safety_v2.sql` **run**; seeded **170 triggers · 38 immediacy · 5 responses** (owner-approved copy) |
| 3. Client rendering | L1/L2/L3 + immediate-danger + digital-safety + Quick Exit; 5 states browser-verified |
| 4. Admin CMS | 5-tab owner CMS; owner-gated + audited + validated; sections browser-verified |

## 3. Requirement traceability (original V2 spec)

| # | Requirement | How it's met |
|---|---|---|
| 1 | 4 risk categories | self_harm · ipv · sexual_coercion · harm_to_others, extensible registry |
| 2 | Severity 1/2/3 (not auto-3) | Authored per behavior; IPV physical split (assault 2 / choke-strangle 3); sev spread 14/99/57 |
| 3 | `immediate_danger` orthogonal | Separate flag; requires disclosure **+** strong present-danger signal; weapon = category-neutral; confinement needs a present-tense cue |
| 4 | Context-aware (subject/negation/temporality) | Per-clause negation with contrastive scoping; media/hypothetical/3p suppression w/ personalization override; temporality current/recent/historical |
| 5 | Centralized versioned registry | DB tables + `registry_version`; no vocabulary hard-coded in routes/components |
| 6 | Safety precedes interpretation | `classify()` runs before persistence/normal processing on all surfaces |
| 7 | Assessment data separate | No RLC scoring touched; safety only gates display/flow |
| 8 | Response routing L1/L2/L3 | Non-blocking L1 · blocking L2 · precedence L3 · immediate addendum |
| 9 | No false reassurance | No "you are safe / not abusive / didn't mean it"; `action_level 0` = `no_safety_signal_detected` |
| 10 | Minimal logging / privacy | Metadata-only events, version-stamped; no raw text in logs/analytics/URLs/console |
| 11 | Testing | 114 tests (engine + validation); all enumerated cases incl. negation/media/historical/compound/immediacy |
| 12 | Audit-then-plan-then-build | Done; migration reviewed before running |

## 4. Guardrails (CMS stage)

Admin-only (owner writes + `audit()`, admin reads; **unauthenticated → 401 verified**) · no raw
disclosures in CMS · server-side validation of severity/category/kind · malformed regex cannot be
saved active · duplicate/overlap warnings · new rules created **inactive** (explicit activation) ·
audit metadata (who/when) · event-referenced rules cannot be hard-deleted (deactivate instead) ·
resource "Verified" only with verifier + source + date · **no feature-flag control in the CMS**.

## 5. Verification status

- **Tests:** `npm test` → **114 pass / 0 fail**; `tsc` → **0 errors**.
- **Client UX:** L1 (non-blocking), L2, L3, immediate-danger, digital-safety all screenshotted in mobile preview; Quick Exit navigates to a neutral page and Back does not return to the interstitial; console/URLs carry no classification.
- **CMS:** all 5 tabs screenshotted; permission guards return 401 unauthenticated.
- **Live registry:** DB-loaded rules classify identically to the tests (spot-checked end-to-end).

## 6. What is live vs off (production)

- **Live in prod DB:** migration `0048`, the seeded registry, and the approved response copy.
- **OFF:** `NEXT_PUBLIC_COMPANION_ENABLED=false` — the public Companion is not reachable, so **no learner is being screened yet**. The safety system is fully wired and will engage the moment the Companion is enabled.

## 7. Known limitations / edge cases for human review

- **Paraphrase/anaphora** outside the registry won't match (monitor false negatives via events; extend the registry — no code change).
- **Reversal heuristic** ("…never hit me, but he actually did") can occasionally over-detect; errs toward detection (safe direction).
- **Hyperbole**: bare "kill him" classifies at L1 (non-blocking), explicit intent at L3.
- **English-only** lexicons; jurisdiction defaults to US (architecture is jurisdiction-aware).
- **Quick Exit** verified in the in-app Chromium preview; recommend a real iOS Safari / Android Chrome pass before public launch. It does not (and does not claim to) erase browser history.

## 8. Outstanding launch blockers

1. **This end-to-end review** — your sign-off.
2. **Verified production resources** — confirm `verified_by` + `source` on 988 / DV entries and add sexual-assault (RAINN) + emergency (911) entries via the CMS; nothing is shown as "Verified" without full metadata.
3. **Legal review** of crisis-resource content + the digital-safety/Quick-Exit approach (your standing requirement).
4. (Companion-wide, not safety-specific, from the earlier audit) Stripe grant-retry + RLS on remaining tables before the Companion goes public.

## 9. Go-live sequence (only on your explicit approval)

1. You approve this review.
2. Confirm/add verified resources in the CMS; legal sign-off.
3. Real-device Quick-Exit check.
4. Enable `NEXT_PUBLIC_COMPANION_ENABLED=true` (Netlify) + link the Companion in the header + redeploy — **the only step that exposes any of this to a learner.**

---

**Bottom line:** the Safety V2 system is built, tested, and inert in production behind the flag. It
is ready for your end-to-end sign-off. Approving this review does **not** enable the Companion —
that remains a separate action you control.
