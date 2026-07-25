# Companion Disclosure — Truth Audit

Verifies the three disclosures (Informed Use & Safety Disclosure, Privacy Disclosure,
Crisis & Safety Disclaimer) against the **actual architecture** — database, logging,
vendors, deletion behavior, account model — before publication. Requested focus:
Privacy Disclosure Sections 5, 10, 11, 12, 14, 15 (the privacy-topic sections).

**Overall: the disclosures are unusually accurate.** One disclosure edit is required
(Privacy §12), one nuance to consider (Informed Use §10), and one **cross-cutting
dependency** (the primary Privacy Policy / Terms of Use they defer to do not yet exist).

## Requested sections — verdicts

| § | Claim (paraphrased) | Architecture reality | Verdict |
|---|---|---|---|
| **Privacy 5** — response on detection | shows notice / pauses / modifies / shows resources / prioritizes safety; does **not** auto-call, contact a hotline, email/text, or notify anyone | L1 non-blocking notice, L2/L3 blocking interstitial, category-routed resources, safety precedence; the client fires **no** external contact; Quick Exit is user-initiated | ✅ **ACCURATE** |
| **Privacy 10** — third-party resources | shows contacts/links for independent orgs; user decides; their privacy practices apply; we don't control them | resources are external orgs (988 / DV / RAINN / 911), rendered as tap-to-use contacts/links, not operated by us | ✅ **ACCURATE** |
| **Privacy 11** — human access | not continuously monitored; authorized personnel may have **limited** access when necessary to operate/secure/support, subject to access controls | no real-time monitoring; server uses the service role for operations; operators with admin/service-role access *can* technically read data | ✅ **ACCURATE** — note: "limited access" is enforced by credential custody + role + policy, **not** by per-record technical restriction (entries are not operator-blind). The wording ("subject to access controls and company policies") already reflects this. |
| **Privacy 12** — service providers | hosting; databases/storage; authentication; payment processing; security/fraud; infrastructure/ops; "other" | Netlify (hosting), Supabase (db/auth), Stripe (payments) ✅. **Resend (transactional email) is used but not represented** in the function list ⚠️. AI (Anthropic) and CRM (GoHighLevel) are correctly **absent** — the Companion uses neither. | ⚠️ **MINOR DISCREPANCY** — add an email/communications-delivery function |
| **Privacy 14** — security | administrative/technical/organizational safeguards; access controls; no system is completely secure | RLS + owner-scoped policies; service-role key server-only; TLS in transit + at-rest encryption via Supabase default; no completeness guarantee | ✅ **ACCURATE** (no over-claim) |
| **Privacy 15** — retention/deletion | info retained as long as necessary; deleting account/content **may not** remove info retained for security/financial/fraud/audit/dispute/permitted purposes | `deleteCompanionData` removes reflections, responses, plans, Blueprint (+versions), milestones, interests + resets the profile; it **retains** the auth account, the entitlement (financial), analytics usage events (content-free), safety-event metadata, and status history — all covered by §15's carve-out | ✅ **ACCURATE** — the disclosure correctly anticipates the partial retention the code performs |

## Notable additional findings

- **Privacy §6 (Safety Event Information) — ✅ exact.** Claims a structured event with category, action/response level, immediate-danger flag, classification info, safety-system + rules **version**, technical context, timestamps — and that it does **not** copy the raw disclosure solely for logging (the original stays where the user saved it). This matches `companion_safety_events` **field-for-field** (categories, action_level, immediate_danger, findings_meta, safety_engine_version + registry_version, context/situation_ref, created_at; no raw text; the entry lives in `companion_user_entry_responses`). Impressively precise.
- **Informed Use §10 (Educational Interpretations) — nuance.** It says the Companion "may identify patterns, areas of strength, areas for development." The Companion serves **pre-authored guided experiences**; it does **not** algorithmically compute strengths/patterns (that's the separate Snapshot assessment). Hedged wording, low risk — but consider softening to "educational observations/prompts," or confirm the Companion won't present computed "strengths."
- **Cross-cutting DEPENDENCY (important).** All three disclosures repeatedly defer to a **"Symmetricly Privacy Policy"** and **"Terms of Use"** (Privacy §12, §15, §16, §18; Informed Use §9, §12) — but **no privacy or terms route exists in the app.** These primary documents must be published + linked before launch, or the disclosures reference documents that don't exist. (Owner/counsel item.)

## Recommendations (change disclosure vs. technology)

1. **Privacy §12 → change the disclosure:** add an email/transactional-communications function (Resend is legitimate + necessary; it receives the user's email address). No tech change needed.
2. **Primary Privacy Policy + Terms of Use → produce + publish them** (owner/counsel), and link them from the consent screen. Highest-priority dependency.
3. **Informed Use §10 → optional wording softening** (or confirm scope). Low priority.
4. Everything in the requested sections (5, 10, 11, 12, 14, 15) otherwise **passes** — the technology behaves as the disclosures state.

No technology changes are required to make the disclosures true (only the §12 wording add). The architecture already matches the safety, logging, retention, and no-monitoring claims.
