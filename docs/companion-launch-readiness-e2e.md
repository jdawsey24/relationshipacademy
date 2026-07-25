# Relationship Companion — Launch-Readiness E2E Report

**Original:** July 25, 2026 · **Last updated:** July 25, 2026 (post-deploy + content pass)
**Feature flag:** `NEXT_PUBLIC_COMPANION_ENABLED = false` (Companion **disabled** to the public)
**Deployed:** build is on production (relationshiplc.com); **feature gated off** · **Legal review:** **NOT PERFORMED**
(Owner risk-acceptance recorded — `companion-owner-risk-acceptance.md`.)

Consolidated launch-readiness verification: static checks, the full test suite, live behavioral verification
against the production database, API permission tests, browser UX, the **production post-deploy smoke test**
(`companion-step4-postdeploy-report.md`), and content readiness. Classification: **PASS · FAIL · BLOCKED ·
RESOLVED** (BLOCKED = a non-technical legal/policy or not-yet-implemented item, not a defect).

## Result: 0 FAIL. Technical + content readiness complete; the remaining gate is legal (Owner/counsel).

## What changed since the original E2E (2026-07-25)
- **Go-live attempt → rollback → re-issue.** The Companion was briefly activated (flag on + nav link +
  deploy), the Step 4 production smoke test found the six governing legal documents were **unpublished/unlinked**
  (`/privacy` 404'd), and the Owner authorized rollback (flag off + redeploy). **No entitlements were created
  during the live window** (verified 0 rows). Then the gap was fixed.
- **Legal documents PUBLISHED + linked** — `/privacy`, `/terms`, `/refund`,
  `/relationship-companion/{informed-use,privacy,crisis}` (all 200). Content = current approved drafts;
  internal review notes stripped; Informed Use renders from the same version-tracked source as the in-app
  acceptance gate. Linked in footer, on the landing (incl. near the purchase CTA), and from the disclosure gate.
- **Terms §27 liability cap set to 12 months** (Owner decision) — the prior `[12 months]` placeholder resolved.
- **Production post-deploy smoke test completed — 0 FAIL** (`companion-step4-postdeploy-report.md`): full
  authenticated pass via a staff test account (since torn down) — disclosure gate + version-logged acceptance,
  L1–L3 + immediate-danger + IPV/sexual-coercion digital-safety UX, Quick Exit + history mitigation, 988/DV/
  RAINN/911 routing, metadata-only logging with no raw-disclosure leakage, authorization (401s), PWA.
- **PWA cache-version issue fixed** (SW `companion-shell-v4` + stale-while-revalidate + update-on-controllerchange).
- **Content readiness** — the full single/breakup/marriage situation set is authored, reviewed, and published
  behind the flag (see Content Readiness below).

## Static / build
| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | **PASS** — 0 errors |
| Test suite (`npm test`) | **PASS** — 140 / 140 |
| Migrations 0048–0051 applied | **PASS** |
| Feature flag `NEXT_PUBLIC_COMPANION_ENABLED` | **PASS** — `false` (Companion not reachable) |

## Safety detection — live registry (Part A)
| Requirement | Result |
|---|---|
| Ordinary flow → no safety signal (level 0) | **PASS** |
| L1 non-blocking notice | **PASS** (also re-verified live in prod smoke test) |
| L2 clear concern (blocking) | **PASS** (live) |
| L3 serious concern (blocking) | **PASS** (live) |
| Immediate danger | **PASS** (live — 911 addendum, flag true only) |
| IPV digital-safety mode + Quick Exit | **PASS** (live — Back does not return to interstitial) |
| Sexual-coercion digital-safety mode | **PASS** (live — RAINN) |
| Multiple simultaneous risk categories | **PASS** (live) |
| Negation / media suppression (false-positive control) | **PASS** |
| No raw disclosure in output or event logs | **PASS** (live — events store concept/level only) |

## Resources + routing (Part B)
| Requirement | Result |
|---|---|
| All active resources verified (verifier + source + date) | **PASS** (988 · DV Hotline · RAINN · 911) |
| Category routing (self_harm→988, ipv→DV, sexual_coercion→RAINN, immediate/harm→911) | **PASS** (live) |
| Non-US / unsupported jurisdiction fallback (no US resources shown) | **PASS** |

## Entitlements, refunds, disputes (Parts C–D)
| Requirement | Result |
|---|---|
| Grant idempotency (duplicate → one row, unique index) | **PASS** |
| Full refund revokes only that payment | **PASS** |
| Effective access retained via another valid source | **PASS** |
| Cross-user isolation (unrelated user untouched) | **PASS** |
| Idempotent duplicate refund (no-op) | **PASS** |
| Dispute opened → suspended · won → restored · lost → revoked | **PASS** |
| Refund-before-grant → grant denied | **PASS** |
| Manual grant immune to Stripe refund/dispute | **PASS** |
| Admin revoke → restore | **PASS** |
| Checkout server-gated while flag off (503) | **PASS** (live) |

## Disclosure acceptance — Terms §32 (Part E)
| Requirement | Result |
|---|---|
| Records version + timestamp + user + event | **PASS** (live — `2026-07-25` / `i_understand_continue`) |
| Idempotent (one row per version); version bump re-prompts | **PASS** |
| Gate links to the correct published documents | **PASS** (live) |

## Access control / permissions (Part F)
| Requirement | Result |
|---|---|
| Unauthenticated consumer API | **PASS** — 401 (live) |
| Unauthenticated IDOR probe on a specific id | **PASS** — 401 |
| Unauthenticated admin API (safety CMS + entitlements + reconcile) | **PASS** — 401 (live) |
| RLS posture (all Companion tables) | **PASS** — deny-all / owner-scoped; service-role server-side |
| Draft situations hidden from non-staff (Home/Process/search/detail) | **PASS** (all 4 read paths gate by `is_staff`) |

## Browser UX (fresh + production)
| Screen | Result |
|---|---|
| Informed-use disclosure gate (summary + full text + single checkbox + "I Understand & Continue") | **PASS** |
| Digital-safety interstitial (Quick Exit + "Need privacy?" + verified resources) | **PASS** |
| Quick Exit → neutral page; Back does not return to the interstitial | **PASS** (live) |
| L1/L2/L3/immediate interstitials | **PASS** (live) |
| Legal documents resolve (6 routes, no broken links; `/privacy` fixed) | **PASS** (live) |
| Public landing "Coming soon" while disabled; nav link → marketing page | **PASS** (live) |

## Content readiness (2026-07-25)
| Item | Result |
|---|---|
| Published situations | **60** (was 42) — includes all single/breakup + the 2 marriage/separation |
| 16 Recovery–Renewal experiences authored (from Framework Manual Ch.6/7), reviewed, published | **PASS** — 0 directive advice, 0 rumination, autonomy-preserving |
| RS-0057/0058 (marriage/separation) — canonical Expiration/Acceptance + safety carve-out; published | **PASS** — `elevated_review_required`; a final CMS visual review is advisable |
| Publish integrity (consumer reads version snapshot, not live blocks) | **PASS** — all published against fresh snapshots; no placeholder content served |

> Content is **live-eligible only** — the feature flag is off, so no member can reach any of it until the
> Companion is enabled. ⚠️ A `seedCompanionRegistry` re-seed would overwrite `publication_status` — sync
> `data/companion-registry/reg_situations.json` if the 60-published state must survive a re-seed.

## Legal / policy status (Owner/counsel)
| Item | Status |
|---|---|
| Six governing documents published + linked in production | **RESOLVED** (were unpublished; fixed post-rollback) |
| Terms §27 liability-cap period | **RESOLVED** — set to 12 months (Owner decision) |
| **Attorney sign-off of the six governing documents** | **BLOCKED** — **legal review NOT PERFORMED**; the one hard gate before go-live |
| Dispute-resolution structure (Terms §30) | **BLOCKED** — LEGAL/POLICY (no arbitration/class-waiver adopted) |
| Public-site analytics + cookie consent (Meta Pixel/GA) | **BLOCKED** — LEGAL/POLICY, separate workstream (authenticated Companion uses no trackers — verified) |
| Full-account-deletion / privacy-request intake process | **NOT YET IMPLEMENTED** — Companion-data deletion works; a formal intake is deferred |

## Verdict
**Technical + content launch-readiness: PASS (0 FAIL).** Safety, entitlement, refund/dispute, disclosure,
access-control, and resource systems behave as documented and were re-verified live in production. The legal
documents are now published and linked, the liability-cap period is set, and the situation content is authored,
reviewed, and published behind the flag. **The remaining gate is legal — attorney review is NOT PERFORMED** —
plus a few Owner/counsel policy items and one deferred non-safety feature. **The Companion is not enabled and
not exposed to members.** Feature activation remains a separate Owner decision, appropriately made after
attorney sign-off.
