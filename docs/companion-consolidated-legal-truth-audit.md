# Consolidated Truth & Cross-Document Consistency Audit

**Documents audited (drafts):** (1) Symmetricly Privacy Policy · (2) Symmetricly Terms of Use ·
(3) Symmetricly Refund & Cancellation Policy · (4) Relationship Companion Privacy Disclosure ·
(5) Relationship Companion Informed Use & Safety Disclosure · (6) Crisis & Safety Disclaimer.

**Purpose:** verify every material factual claim about how the platform operates against the
production-intended architecture, and check the six documents for consistency. **This is a
technical audit to accompany the drafts for legal review — it is NOT attorney review, nothing
here is attorney-approved, and the Companion remains disabled.**

**Classification legend:** `ACCURATE` · `INACCURATE` · `PARTIALLY ACCURATE` · `NOT YET
IMPLEMENTED` (intended, not built) · `NOT TECHNICALLY VERIFIABLE` · `LEGAL/POLICY DECISION`
(a legal drafting/business choice, not a code fact — not rewritten here).

> Note: the Privacy Policy §12 (service providers), §19 (cookies), and §23 (advertising) were
> corrected during this pass to match the actual vendor/tracker stack; the classifications below
> reflect the **corrected** drafts.

## Claim-by-claim (by area)

| Area | Claim (docs) | Reality | Class |
|---|---|---|---|
| **Account creation** | Supabase Auth; name/email/auth info; passwords via auth provider, not readable by staff (PP §2A; Terms §10) | Supabase Auth; passwords hashed by Supabase, never stored/readable by us | **ACCURATE** |
| **Account deletion** | in-app controls delete Companion data; full-account/privacy-request via privacy contact (PP §18/§22; Companion PD §15; Refund §14) | `deleteCompanionData` removes reflections/responses/plans/Blueprint(+versions)/milestones/interests + resets profile. A **full-account deletion + privacy-request intake process is not built** (deferred to a contact) | **PARTIALLY ACCURATE** — Companion-data deletion accurate; the account/request path is **NOT YET IMPLEMENTED** |
| **Data retention** | account/financial/entitlement/usage/safety-metadata/audit records may persist after deletion (PP §17; Companion PD §15; Refund §14) | Exactly what `deleteCompanionData` leaves behind | **ACCURATE** |
| **Assessment behavior** | stores responses, completion, structural context, derived results, indicators; results are educational, not diagnoses (PP §3/§10; Terms §6) | `snapshot_quiz_sessions` + responses + cluster results + low-confidence indicator + AI narrative | **ACCURATE** |
| **Companion functionality** | guided experiences, Blueprint, Planner, Journey, progress; provides prompts/reflections/observations, does not score (Companion PD §2/§3; Informed §10 corrected; Terms §7) | Matches; the Companion serves pre-authored experiences, no scoring engine | **ACCURATE** |
| **Automated safety detection** | deterministic rules; 4 categories + immediate danger; pauses/modifies/shows resources; no auto-contact; not a professional assessment (all 6 docs) | Deterministic engine; L1/L2/L3 + immediate; no external contact fired; **no AI** on learner text | **ACCURATE** |
| **Safety-event metadata** | structured record: category/level/immediate/classification/**version**/context/timestamps; no raw-text copy solely for logging (Companion PD §6; PP §6) | `companion_safety_events` matches field-for-field; no raw text; entry stays in its feature | **ACCURATE** |
| **Human access** | not real-time monitored; authorized personnel limited access subject to controls/policy (PP §14; Companion PD §11) | Server uses service role; operators with admin/service-role access can technically read; governed by credential custody + role + policy (not per-record technical block) | **ACCURATE** |
| **Analytics / logging** | technical/usage events; "seek to avoid free-text in analytics/URLs/console/logs" (PP §8) | First-party `companion_events` **sanitized** (allowlist, no free-text); safety events metadata-only; verified no raw text in URLs/console | **ACCURATE** |
| **Service providers** | Netlify, Supabase, Stripe, Resend, GoHighLevel, Anthropic, and (where enabled) Google Analytics + Meta Pixel (PP §11/§12 **corrected**; Companion PD §12 corrected) | All present in code: hosting/db/auth/payments/email, `pushLeadToGHL`, `generateResultNarrative` (Anthropic), `Analytics.tsx` (GA/Pixel) | **ACCURATE** (was INACCURATE before this pass) |
| **Transactional email** | account/verification/purchase/security/support messages (PP §20; Companion PD §12) | Resend (Companion access email), Supabase (auth/verify), Stripe (receipts) | **ACCURATE** |
| **Cookies / storage** | essential cookies + local storage; where enabled, GA/Pixel analytics cookies; consent/opt-out where required (PP §19 **corrected**) | Supabase auth-session cookies + PWA localStorage (essential); GA/Pixel wired but **dormant** (IDs unset) | **ACCURATE** for essential; the **consent/opt-out mechanism** for ad cookies is **NOT YET IMPLEMENTED** (no cookie banner) — required before enabling GA/Pixel |
| **Stripe payments** | price shown at checkout; third-party processor charges; access on payment confirmation; card not stored (Terms §12; PP §7; Refund) | Stripe Checkout; webhook grant on `checkout.session.completed`; no card data stored | **ACCURATE** |
| **Subscriptions** | recurring until canceled; cancel stops renewal; access through paid period (Terms §13; Refund §3) | Applies to the **Academy** (Stripe subscription → tier flip). Companion is one-time (not a subscription) | **ACCURATE** |
| **Cancellation** | separate from refund + from data deletion (Refund §3/§14; Terms §13) | Matches | **ACCURATE** |
| **Refunds** | full → revoke; partial → keep; duplicate → other valid source keeps access; refund ≠ record deletion (Refund §5–7/§13; Terms §14) | **Companion 0050 matches exactly.** Academy/Playbook do **not** auto-revoke on refund (hedged "may" covers it) | **ACCURATE (Companion)** / **PARTIALLY ACCURATE (platform-wide)** |
| **Disputes / chargebacks** | open → suspend; won → restore; lost → revoke; other entitlement keeps access (Refund §8/§13; Terms §15) | **Companion 0050 matches exactly** (`dispute_suspended`/`active`/`revoked_dispute`). Companion-only | **ACCURATE (Companion)** / **PARTIALLY ACCURATE (platform-wide)** |
| **Suspension / revocation / restoration** | payment reversal/loss of entitlement → suspend/revoke; restore where state supports (Terms §25; Refund §8/§9) | Companion 0050 lifecycle + admin restore | **ACCURATE (Companion)** |
| **Manual / admin access** | complimentary/admin access not refundable; a Stripe refund/dispute doesn't revoke an independent manual grant; may revoke access granted by mistake (Refund §10; Terms §16) | 0050: manual grants (null payment_intent) immune to Stripe events; owner admin grant/revoke/restore | **ACCURATE** |
| **Reconciliation** | systems may reconcile payment status with the processor to correct access not properly granted/removed (Refund §9) | `reconcileCompanionEntitlements` repairs **paid-but-ungranted** (under-provisioning). It does **not** sweep for refunded-but-still-active (over-provisioning) | **PARTIALLY ACCURATE** (repair of missing grants only) |
| **Third-party resources** | 988 / DV / RAINN / 911; jurisdiction-aware; user chooses; independent orgs (Crisis; Companion PD §10; PP §13) | 4 verified US resources, routed by category + jurisdiction (non-US → none) | **ACCURATE** |
| **Quick Exit** | leaves quickly; does **not** erase history/device activity; no auto-contact (Crisis; Companion PD §9; Informed §8; PP §16) | `location.replace` + `history.replaceState`; no erasure claimed; no contact fired | **ACCURATE** |
| **Intellectual-property restrictions** | ownership of Framework/assessments/scoring/etc.; no reproduction/AI-training use (Terms §20/§21/§22) | Ownership + license terms — a legal assertion, not a runtime behavior | **LEGAL/POLICY DECISION** |
| **Electronic acceptance / version logging** | records of document/version accepted, date/time, user id, technical info (Terms §32; the intended Companion consent flow) | The acceptance table (`companion_disclosure_acceptances`) + consent gate are **designed but not built** | **NOT YET IMPLEMENTED** — build before the consent flow / disclosures publish |
| **Eligibility (18+), governing law, liability, indemnity, dispute resolution** | Terms §9/§27/§28/§29/§30 | No technical age-gate (standard); the rest are legal provisions | **LEGAL/POLICY DECISION** (age-gate is `NOT TECHNICALLY VERIFIABLE` as a behavior) |

## Cross-document consistency

**Consistent (the six documents + the software tell one story):** safety framing (no real-time
monitoring, fallible detection, absence ≠ safe, no auto-contact), Quick Exit non-erasure,
refund/dispute lifecycle (Refund + Terms ↔ 0050), assessment-scores-vs-Companion-reflects,
retention/deletion carve-outs, third-party-resource independence. Cross-references between all
documents resolve correctly.

**Inconsistencies / items to reconcile (LEGAL/POLICY DECISION unless noted):**
- **Effective dates:** Privacy Policy, Terms, Refund Policy = **July 25, 2026**; Companion
  disclosures = **7/24/2026**. Align to one date.
- **Contact addresses differ by document/domain:** privacy + legal = `admin@relationshiplc.com`
  (relationshiplc.com); refund + support = `info@symmetricly.co` (symmetricly.co). Not a
  conflict, but confirm the intended contact per purpose.
- **Mailing address:** the Refund Policy shows **1246 Concord Rd, Smyrna, GA 30080**; the
  Privacy Policy and Terms still have `[BUSINESS MAILING ADDRESS]` — fill them with the same
  address for consistency. *(I can apply this on request.)*
- **Legal entity name:** Terms names **4 The Love Counseling & Consulting DBA Symmetricly**; the
  Privacy Policy and Refund Policy use "Symmetricly" only — confirm whether the full entity name
  should appear in all three.
- **Terms `[12 months]` liability cap** and the free-service liability figure remain placeholders.

## Action summary (before legal review / launch)
1. **NOT YET IMPLEMENTED:** electronic-acceptance/version logging (Terms §32) — build the consent
   gate + `companion_disclosure_acceptances`; cookie **consent/opt-out mechanism** if GA/Pixel are
   enabled; full-account-deletion / privacy-request intake process.
2. **PARTIALLY ACCURATE (product decision):** platform-wide refund/dispute auto-revoke is
   Companion-only today — decide whether to extend the 0050 lifecycle to Academy/Playbook or keep
   the Terms/Refund "may" wording; add a refunded-but-still-active reconciliation sweep if desired.
3. **LEGAL/POLICY DECISIONS:** keep vs disable GA/Meta Pixel (drives §19/§23); fill placeholders
   (dates, entity, mailing address, liability figures); dispute-resolution structure (Terms §30);
   contact-address consistency.
4. **No safety-critical technical inaccuracy found.** The safety, retention, deletion, human-access,
   and Companion-entitlement claims all match the code.

**Attestation:** technical audit only. Attorney review has not been performed; nothing herein is
attorney-approved. The Companion feature flag remains OFF.
