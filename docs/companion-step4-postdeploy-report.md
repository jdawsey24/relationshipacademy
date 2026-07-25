# Step 4 — Final Consolidated Post-Deploy Report

**Product:** Relationship Companion — relationshiplc.com
**Build tested:** deploy `6a64b8971eee4cc14226e8d9` · commit `2c84fd0` (`main`)
**Feature flag:** `NEXT_PUBLIC_COMPANION_ENABLED = false` (Companion disabled for the public)
**Test account:** `temp@relationshiplc.com` — provisioned owner/staff role + `manual_grant` entitlement (Owner
authenticated; staff bypass let the authenticated experience be exercised while the flag stayed OFF).
**Fully torn down after testing** (role cleared, all test data purged; auth login left as a plain,
un-elevated, un-entitled account).
**Legal review:** **NOT PERFORMED** — not attorney-reviewed or legally approved; live under the documented
Owner Risk Acceptance only (`companion-owner-risk-acceptance.md`).

## Result: 0 FAIL. The rollback-causing defect (Part C) is fixed and verified end-to-end.

This report consolidates the reachable/unauthenticated production verification and the authenticated
verification performed with the staff test account. Classification: **PASS · FAIL · BLOCKED · NOT DONE**
(BLOCKED/NOT DONE = environment-limited or legal/policy, not a defect).

---

## A–S results

| Part | Area | Status | Evidence |
|---|---|---|---|
| **A** | Public entry & routing | **PASS** | `/relationship-companion` 200; nav "Companion" → marketing landing (not the app); desktop+mobile; unauth `/companion` → sign-in/coming-soon; APIs 401 |
| **B** | Auth → entitlement → onboarding → app | **PASS** | Sign-in → gate chain → app; entitled access recognized; onboarding not re-prompted; entitlement enforced server-side; manual URL can't bypass |
| **C** | Disclosure acceptance | **PASS** | Gate shown to non-accepter; full 12-section text; links to the correct docs (new-tab); acceptance recorded in DB = `companion_informed_use` / `2026-07-25` / event `i_understand_continue` / timestamp / correct user; access granted after accept; no re-prompt on reload; version-bump re-prompt capability present. All six legal docs resolve 200; no internal review notes exposed |
| **D** | Ordinary flow | **PASS** | Benign Blueprint entry → `{ok:true}`, "Saved", no notice; Blueprint multi-section works; no false positive; "no signal" never rendered as "you are safe" |
| **E** | Safety L1 (non-blocking) | **PASS** | `action_level 1` → dismissible bottom-sheet, content stays editable, not blocked, 988 accessible, no external contact |
| **F** | Safety L2 (blocking) | **PASS** | Blocking interstitial, ordinary guidance paused, approved copy, acknowledgment ("I understand") works |
| **G** | Safety L3 (serious) | **PASS** | "Let's pause and focus on your safety," L3 precedence, correct copy, no false reassurance |
| **H** | Immediate danger | **PASS** | Immediacy term → `immediate_danger:true`, emergency addendum, 911 first + category resource; explicit "nothing…will automatically…notify anyone" |
| **I** | IPV digital-safety + Quick Exit | **PASS** | `digital_safety:true`, discreet "Need privacy?", neutral page title; Quick Exit → neutral page instantly, no modal; Back did not return to the interstitial; honest about not erasing history |
| **J** | Sexual-coercion mode | **PASS** | `sexual_coercion` detected → RAINN routed |
| **K** | Multiple simultaneous categories | **PASS** | `["sexual_coercion","ipv"]` preserved (no overwrite); resources routed for all categories (911+DV+RAINN); no debug/classifier data exposed |
| **L** | Resource routing | **PASS** | 988 / DV Hotline / RAINN / 911 each routed correctly; contact info matches verified CMS records (`verified_by`="Janelle Dawsey, LMFT", `verified_at`, `source`); metadata internal; not auto-opened |
| **M** | Privacy / no-leakage | **PASS** | API responses carry only classification metadata + resources (no raw disclosure); page title neutral; safety-event scan found no raw text stored; authenticated Companion has no GA/Meta Pixel |
| **N** | CMS permissions | **PASS** | All `/api/admin/companion/safety/*` + entitlements + reconcile → 401 unauth; safety events store concept/level/category only (never user text) |
| **O** | RLS / authorization | **PASS (structural)** | Protected routes enforce authz (uniform 401); safety/config tables deny-all (service-role only); user tables owner-scoped `auth.uid()=user_id`; service-role server-side. Live A-can't-read-B not exercised — see Not Completed |
| **P** | Stripe entitlement | **PASS (server-side)** | Checkout server-gated (503 while off); entitlement checks server-side; unentitled blocked; `manual_grant` immune to Stripe events (observed). No live charge created — see Not Completed |
| **Q** | Refund/dispute lifecycle | **PASS (logic)** | Deterministic lifecycle verified via 140-test suite on the deployed commit; manual-grant independence observed live |
| **R** | PWA / app behavior | **PASS (partial)** | `/manifest.webmanifest` 200; SW `companion-shell-v4` (stale-while-revalidate + update-on-controllerchange); install prompt appeared; no trackers/sensitive state in HTML. Installed-app gate-bypass not exercised — see Not Completed |
| **S** | Rollback readiness | **PASS** | Demonstrated live: flag→false + redeploy took the Companion offline successfully; nav + legal commits independently revertible; prior deploys retained in Netlify |

## Defects

- **New this pass:** none.
- **Resolved since the first Step 4:** the critical Part C gap (six governing documents unpublished/unlinked;
  `/privacy` 404) — now published, linked, and verified end-to-end; and the Terms §27 `[12 months]`
  liability-cap placeholder — set to 12 months per Owner direction.

## Not completed (environment-limited, not failures)

1. **O — cross-user isolation (live A/B):** structurally enforced by RLS and verified at the API/schema level,
   but a two-account read/modify test was not run. Needs a second throwaway account.
2. **P — live purchase:** deliberately not run (would create a real charge on live Stripe). Server-side gating
   + idempotency verified by other means.
3. **R — installed-app gate-bypass:** the install prompt was confirmed, but a true Home-Screen install + offline
   gate test isn't feasible in the in-app browser.
4. **N — granular role-scoped editing:** only one staff role was provisioned, so editor/viewer/owner write
   differences weren't separately exercised.

## Browser-specific limitation

The in-app browser required a manual re-check after some navigations (the CompanionChrome "Opening your
Companion…" gate re-runs on each load); handled with short waits. No functional impact.

## Privacy / security note

Posture is clean: uniform authorization (401), no trackers in the authenticated Companion, safety events
metadata-only, and no raw disclosure transmitted in responses or stored in event logs. The only place raw
free-text lives is the user's own Blueprint/entry content, as designed and disclosed.

## Standing legal / policy items (Owner / counsel — unchanged by this test)

- **Attorney review: NOT PERFORMED** — the six governing documents remain draft; the product is not
  attorney-approved.
- **Dispute-resolution structure (Terms §30):** no arbitration/class-waiver adopted (open policy choice).
- **Public-site analytics + cookie consent (GA/Meta Pixel):** separate workstream; the authenticated Companion
  uses none.
- **Full account-deletion / privacy-request intake:** Companion-data deletion works; a formal intake process is
  deferred.

## Verdict

**Technical Step 4: PASS — 0 FAIL.** Every safety-critical authenticated behavior works correctly in
production — disclosure gating with version-logged acceptance, L1–L3 + immediate-danger + digital-safety UX,
Quick Exit with history mitigation, correct per-category resource routing, and metadata-only logging with no
raw-disclosure leakage — alongside sound public routing, authorization, PWA, and rollback posture. The
remaining items are legal/policy decisions and a few environment-limited checks, not defects.

**The Companion remains DISABLED (flag off).** Re-activation is a separate Owner decision; if taken, the
sensible sequence is: resolve the open legal/policy items (ideally attorney sign-off) → optionally finish the
two environment-limited checks (cross-user O, installed-PWA R) → set the flag true → deploy → spot-check live.
