# Privacy Policy + Terms — Platform Truth Audit + 5-Document Consistency

Line-by-line verification of the **Symmetricly Privacy Policy** and **Terms of Use** against
the actual codebase, checkout flows, storage, logging, and vendors — then a cross-document
consistency check across all five documents (Privacy Policy, Terms, Companion Privacy
Disclosure, Companion Informed Use & Safety Disclosure, Crisis & Safety Disclaimer).

**Headline:** The Terms, the Companion disclosures, and the software **tell the same story** —
refund/dispute, safety, and assessment-vs-Companion behavior all match the code. The **one
place the software does something the policy doesn't say is third-party data sharing**: the
platform is wired to send data to **Meta Pixel, Google Analytics, GoHighLevel (CRM), and
Anthropic (AI)** — none of which the Privacy Policy discloses, and Meta Pixel directly
conflicts with §23.

---

## 🔴 Primary finding — undisclosed third-party data recipients

| Recipient | Evidence | State | Policy gap |
|---|---|---|---|
| **GoHighLevel** (marketing CRM) | `app/api/snapshot/convert/route.ts:26` → `pushLeadToGHL()` sends lead **email + assessment result** | **ACTIVE** (`GHL_WEBHOOK_URL` set) | Not in §11/§12 service-provider list |
| **Anthropic** (AI) | `/api/results/narrative` → `getOrCreateLiveNarrative` → `generateResultNarrative` sends assessment grounding to Anthropic | **Wired**, `ANTHROPIC_API_KEY` set (confirm the live results UI invokes it) | Not in §11/§12; no "AI / automated text generation" processor disclosed |
| **Meta Pixel** (Meta) | `components/site/Analytics.tsx` injects `fbevents.js`; `app/snapshot/results/[session]/page.tsx` fires `fbq('track','Lead'/'InitiateCheckout')` | **Dormant** (`settings.meta_pixel_id` unset) | Not in §12; **contradicts §23** ("do not sell/share for targeted advertising" — Meta Pixel *is* cross-context ad sharing); §19 doesn't disclose ad cookies or a consent mechanism |
| **Google Analytics** (Google) | `Analytics.tsx` injects `gtag/js`; results page fires `gtag('event','snapshot_conversion')` | **Dormant** (`settings.ga_id` unset) | Not in §12; §19 doesn't disclose analytics cookies/consent |

**Recommendation (change disclosure or technology — your call):**
- **GHL + Anthropic are live** → **disclose them now** (add "CRM/marketing automation" and "AI/automated text-generation" processors to §11/§12), **or disable** them.
- **Meta Pixel + GA are dormant** → **before enabling** the Pixel/GA IDs, add them to §11/§12, **fix §23**, and add ad/analytics-cookie disclosure + a consent mechanism to §19. If you don't intend to enable them, leave the IDs unset (and consider removing the wiring).

## Privacy Policy — requested sections

| § | Verdict | Notes |
|---|---|---|
| **3 Assessment Information** | ✅ ACCURATE | `snapshot_quiz_sessions` stores responses, completion, structural context, derived cluster results, low-confidence indicator; narrative = derived interpretation. Matches. |
| **8 Technical & Usage** | ✅ ACCURATE (hedged) | IP/device are received at the **infra layer** (Netlify/Supabase) — not stored by the app; first-party analytics (`companion_events`) is **sanitized** (allowlist, no free-text). "We seek to avoid free-text in analytics/URLs/console/logs" is **verified true**. |
| **11 How We Share** | ⚠️ **DISCREPANCY** | "do not sell to advertisers" + the service-provider list is **incomplete** — see primary finding (Meta/Google/GHL/Anthropic). |
| **12 Service-Provider Categories** | ⚠️ **DISCREPANCY** | Names only **Netlify, Supabase, Stripe, Resend**. Actual processors also include **GoHighLevel, Anthropic** (active) and **Meta, Google** (wired). |
| **17 Retention** | ✅ ACCURATE | Retained categories (auth account, financial/entitlement, content-free usage events, safety metadata, security/audit) exactly match what `deleteCompanionData` leaves behind. |
| **18 Account & Data Deletion** | ✅ ACCURATE | `deleteCompanionData` removes reflections/responses/plans/Blueprint/milestones/interests + resets profile; account/entitlement/analytics/safety-metadata retained. Note: a full **account-deletion + privacy-request path** is deferred to a placeholder contact — build/define before publishing. |
| **19 Cookies & Similar** | ⚠️ **DISCREPANCY (conditional)** | Essential cookies (Supabase auth session) + PWA localStorage are accurate. But if Meta Pixel/GA are enabled they set **ad/analytics cookies** not disclosed here, with **no consent mechanism** ("where required" → required in EU/UK/several US states). Currently dormant. |
| **20 Communications** | ✅ ACCURATE | Transactional: Companion access email (Resend), auth emails (Supabase), Stripe receipts. Marketing (GHL nurture) with unsubscribe — accurate **once GHL is disclosed**. |

## Terms of Use — requested sections

| § | Verdict | Notes |
|---|---|---|
| **9 Eligibility (18+)** | ✅ ACCURATE (contractual) | No technical age-gate exists (standard); the Term is an eligibility statement, not a code behavior. |
| **10 Account & Security** | ✅ ACCURATE | Supabase auth, email-verification required, reauth for sensitive actions, no shared-entitlement feature. |
| **12 Purchases** | ✅ ACCURATE | Stripe Checkout; price shown at checkout; access depends on payment confirmation (webhook grant). |
| **13 Subscriptions** | ✅ ACCURATE | Applies to the **Academy** subscription (Companion is one-time). Cancellation → tier flip via `customer.subscription.deleted`. |
| **14 Refunds** | ✅ ACCURATE (Companion) | Full→revoke, partial→keep, another valid entitlement keeps access, refund doesn't delete records — **exactly matches the 0050 lifecycle.** Note: auto-revoke is **Companion-only**; Academy/Playbook refunds don't auto-revoke (the "may" wording covers this). The referenced "refund policy" doc doesn't exist yet. |
| **15 Disputes/Chargebacks** | ✅ ACCURATE (Companion) | Suspend-on-open, restore-on-won, revoke-on-lost, another entitlement keeps access — **exactly matches 0050.** Companion-only caveat as above. |
| **16 Promo/Complimentary/Admin Access** | ✅ ACCURATE | Manual grants + owner admin revoke/restore ("revoke access granted by mistake") = the 0050 admin controls. |
| **17 Availability** | ✅ ACCURATE | Generic availability disclaimer; no false claim. |
| **19 User-Submitted Content** | ✅ ACCURATE | Content stored/processed to provide features (incl. automated safety detection); no ownership transfer claimed. |
| **20 Intellectual Property** | ✅ ACCURATE | Framework, assessments, scoring, competencies, guided experiences, proprietary DB — the real assets. |
| **21 Prohibited Reproduction** | ✅ ACCURATE | Policy statement; the platform's own AI use (authoring/narrative) is Symmetricly's, not user-facing training. |
| **24 Community Features** | ✅ CONDITIONAL | No in-app community; the Academy references an **external Skool community** (a third-party platform, governed by Terms §23). "If Symmetricly offers…" wording is safe. |
| **25 Suspension & Termination** | ✅ ACCURATE | "payment reversal / loss of entitlement → suspend/revoke" matches 0050; admin controls exist. |
| **32 Electronic Communications & Acceptance** | ⚠️ **DISCREPANCY (build-before-launch)** | Promises records of "document/version accepted, date/time, user/account id, technical info." That **acceptance-recording system is designed but NOT built** (`companion_disclosure_acceptances` / migration 0051 pending). Build it before the consent flow publishes, or the Terms describe a record the code doesn't produce. |

## Cross-document consistency (all 5)

**Consistent (the story matches):**
- **Safety framing** — no real-time monitoring · deterministic detection is fallible · absence ≠ safe · Quick Exit erases nothing · no auto-contact · jurisdiction-aware resources — identical across all five and true in code.
- **Refund/dispute** — Terms §14–15 ↔ Companion 0050 ↔ Privacy Policy §7 — aligned.
- **Assessment vs Companion** — assessments score/derive (Terms §6, PP §3/§10); Companion reflects, doesn't score (Companion Informed §10 corrected, Terms §7) — aligned.
- **Cross-references** between all documents resolve correctly.
- **Attorney-review-status "not yet reviewed"** notes in both PP and Terms — consistent with the still-BLOCKED legal gate.

**Inconsistencies / dependencies:**
- **Service-provider disclosure vs. code** — PP §12 and Companion Privacy Disclosure §12 are consistent *with each other* but both **omit GHL/Anthropic/Meta/Google** (the disclosures-vs-software gap above).
- **Placeholders to fill (PP + Terms):** `[DATE]` effective/updated dates, `[LEGAL ENTITY NAME]`, `[PRIVACY EMAIL]`, `[EMAIL ADDRESS]`, `[BUSINESS MAILING ADDRESS]`, `[12 months]` liability period, and the free-service liability figure. Companion disclosures are dated 7/24/2026 — align all effective dates.
- **Missing referenced documents:** a "refund policy" (Terms §14) and a defined "privacy/deletion request" process (PP §18/§22) are referenced but don't exist yet.

## Bottom line
The **Terms and the Companion disclosures are true to the software** — notably the refund/dispute
lifecycle, which matches the built 0050 behavior line-for-line. The **Privacy Policy is the
document to fix**: it must either disclose the advertising/analytics/CRM/AI recipients the
platform actually uses (and reconcile §19/§23), or those data flows must be turned off — your
call, before publication. Plus the §32 acceptance-record system must be built before the consent
flow goes live, and the placeholders/missing docs resolved. **No Companion-safety technology
change is implicated. Companion remains disabled.**
