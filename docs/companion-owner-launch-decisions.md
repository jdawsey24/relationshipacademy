# Companion Launch — Owner Decisions (2026-07-25)

Owner decisions recorded for launch governance. **None of these constitute legal
approval.** Attorney review status remains **NOT PERFORMED / BLOCKED**, and nothing here
is attorney-approved. The Companion feature flag remains **OFF**; nothing was deployed.

| # | Decision | Status / action taken |
|---|---|---|
| 1 | **Analytics** — no Meta Pixel or Google Analytics inside the authenticated Relationship Companion at launch; do not transmit Companion content, assessment responses, safety information, or other sensitive relationship information to advertising or general-purpose analytics platforms. Public-site analytics/cookie consent handled separately. | **Already satisfied in code (verified):** `<Analytics>` (Meta Pixel + GA) is only in the public `(site)` layout; `/companion` is a top-level route with its own layout and no analytics; the root layout has none. Companion analytics events are sanitized (no free-text); safety events are metadata-only. **Doc correction:** Privacy Policy §19/§23 scoped analytics/advertising to "our public marketing website" and state they are **not used within the authenticated Relationship Companion**, and that Companion content, assessment responses, and safety-detection information are **not** transmitted to advertising or general-purpose analytics providers. No code change required. |
| 2 | **Liability** — leave the liability-cap amount/structure flagged as LEGAL/POLICY DECISION; do not invent a monetary cap for free services. | **No change.** Terms `[12 months]` and the free-service liability figure left as placeholders; flagged LEGAL/POLICY DECISION. |
| 3 | **Contact information** — standardize to Symmetricly, **info@symmetricly.co**, **1246 Concord Rd, Smyrna, GA 30080** wherever the general company contact is required; do not invent additional department email addresses. | **Doc correction:** Privacy Policy §25 and Terms §36 contact set to `info@symmetricly.co` (replaced the earlier `admin@relationshiplc.com`); mailing address already filled in both; Refund Policy already consistent. No new department emails. |
| 4 | **Refund/dispute automation scope** — keep automated refund/dispute entitlement enforcement scoped to the Relationship Companion for now; do not extend to Academy, workshops, assessments, certifications, or other products until their commerce/access architectures are implemented and tested. | **No change (matches current code):** the 0050 refund/dispute lifecycle is Companion-only. Terms §14–15 and the Refund Policy use permissive ("may") wording consistent with this scope. |
| 5 | **Legal status** — attorney review remains NOT PERFORMED / BLOCKED; these decisions are not legal approval. | **Unchanged.** All documents retain "Attorney Review Status: Not yet reviewed." |

## Remaining unresolved before the final launch-readiness E2E
1. **Attorney sign-off** of all six documents — the BLOCKED legal gate (owner/counsel).
2. **Liability cap** amount/structure + free-service liability figure — LEGAL/POLICY DECISION (owner/counsel).
3. **Public-site analytics + cookie-consent** workstream — separate from Companion launch, but the Privacy Policy's public-site analytics language + a consent/opt-out mechanism should be finalized before GA/Meta Pixel are enabled on the marketing site.
4. **Companion transactional-email support contact** — `lib/companion/email.ts` currently shows `admin@relationshiplc.com` as the "trouble getting in" support address (a code/product contact, not a legal-document field). Decide whether to align it with `info@symmetricly.co`.
5. **Final full launch-readiness E2E** — to be run once the legal gate clears and items 1–2 are settled.
