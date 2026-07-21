# Clinical Safety Authoring Brief — Relationship Companion™

**Reference:** Reasoning Engine Spec §5 (Safety Architecture); DI-011 §5.3
**Date:** 2026-07-20
**Prepared by:** Systems Architect
**For:** A qualified clinical / safety professional (and legal review)
**Status:** Scope-of-work + templates. **This is a launch-blocking gate — the Companion must not be publicly exposed until this content is authored, reviewed, and signed off.**

---

## 0. Why this brief exists — and its hard boundary

The Companion's runtime (the Reasoning Engine) includes a **continuous safety screen** on every learner input. The *mechanism* is specified (escalation levels, override behavior, handoff points). The **clinical content that fills that mechanism is deliberately blank** and must be authored by a qualified professional.

**What engineering/AI has NOT done, and must not do:**
- We have **not** written the detection signals that classify a message as risky.
- We have **not** set clinical thresholds for any escalation level.
- We have **not** written the safety-response language.
- We have **not** listed any crisis line, hotline number, or professional resource. *(A wrong or fabricated referral is itself a safety hazard.)*

Everything in that list is **your** deliverable. This brief gives you the fixed boundary, the architectural contract you're filling, empty templates, and the integration format.

---

## 1. What the Companion is (context)

A **guided educational-experience platform** for everyday relationship growth — not a chatbot, not therapy, not a crisis service. Learners work through structured experiences about dating, communication, trust, conflict, intimacy, breakups, and similar. Because the domain is intimate relationships, learner inputs can surface **intimate partner violence, sexual coercion or assault, self-harm or suicidality, harm to others, and acute mental-health distress**. The safety layer exists for exactly these moments.

## 2. The canonical boundary (fixed — you author *within* this)

These are quoted from the governing manuals and **cannot be changed**:

- **Not a crisis resource** (Operations Manual §4): *"It is not intended to support individuals experiencing situations that require immediate intervention … Experiences involving elevated risk should redirect users toward appropriate emergency or professional resources."* ← this sentence is the mandate for the safety response.
- **Educational boundary** (Prompt Architecture Layer 1 §5): the Companion **does not** diagnose mental-health conditions, conduct therapy, or prescribe treatment.
- **Not a decision-maker** (Ops §4; Layer 1 §6): it does not tell users what to do; responsibility for decisions remains with the user; autonomy is always respected.

Implication for your authoring: safety responses must be **supportive, non-diagnostic, non-directive, and hand-off oriented** — they connect the person to help; they do not assess, treat, or advise.

## 3. The architectural contract (what the engine already does)

- **SAF-001** runs as a **continuous guard on every learner input**, in parallel with all reasoning stages.
- Your taxonomy classifies each input into one of four levels; the engine then acts:

| Level | Engine behavior (fixed) | You author |
|-------|-------------------------|------------|
| **L0 Clear** | proceed normally | the signals that mean "clear" |
| **L1 Sensitive** | proceed; softer tone; route to a Process/Celebrate experience | criteria + any tone guidance |
| **L2 Out-of-scope** | **halt education**; deliver supportive non-diagnostic message + professional-resource guidance | criteria + message + resources |
| **L3 Elevated risk** | **halt immediately**; deliver emergency/crisis handoff; run no experience | criteria + message + emergency resources |
| — invariant — | **L2/L3 override every other trigger; the engine never runs an experience through them** | — |

You define *what* each level means and *what is said*; the engine guarantees *when* it halts.

---

## 4. Your deliverables (six)

Author each of the following. Templates in §5. Deliver as structured data (§7) so it plugs into SAF-001 directly.

1. **Escalation-level clinical definitions** — precise criteria distinguishing L0/L1/L2/L3.
2. **Detection taxonomy** — the signals/indicators (by risk category) that map an input to each level.
3. **Response content** — the exact learner-facing language per level (supportive, non-diagnostic, non-directive).
4. **Resource directory** — verified emergency/professional resources, jurisdiction-aware.
5. **Escalation & handoff rules** — halt/session-end behavior, and any human-escalation path.
6. **Domain edge-case guidance** — IPV, sexual coercion/assault, self-harm/suicidality, harm to others, minors, mandatory-reporting posture.

---

## 5. Templates (structure only — clinical content intentionally blank)

### 5.1 Escalation-level definitions
| Level | Clinical definition (author) | Illustrative in-scope examples |
|-------|------------------------------|--------------------------------|
| L0 Clear | *[author]* | ordinary relationship learning |
| L1 Sensitive | *[author]* | breakup, conflict, grief (already in-scope per Ops §6 Process/Celebrate) |
| L2 Out-of-scope | *[author]* | *[author — e.g. clinical-support categories]* |
| L3 Elevated risk | *[author]* | *[author — immediate-intervention categories]* |

> The L1 examples above are drawn from the canonical Experience Types (Process handles "we broke up," "we had an argument") — they are *not* clinical content. L2/L3 examples are for you to define.

### 5.2 Detection taxonomy (per risk category × level)
| Risk category | L1 signals | L2 signals | L3 signals | Notes |
|---------------|-----------|-----------|-----------|-------|
| Self-harm / suicidality | | | | |
| Intimate partner violence / abuse | | | | |
| Sexual coercion / assault | | | | |
| Harm to others | | | | |
| Acute mental-health distress | | | | |
| *(add categories as clinically appropriate)* | | | | |

*All cells authored by the clinical professional. Do not populate from engineering intuition.*

### 5.3 Response content (per level)
| Level | Learner-facing message (author) | Constraints |
|-------|---------------------------------|-------------|
| L2 | *[author]* | supportive; non-diagnostic; names no condition; offers resources; preserves autonomy |
| L3 | *[author]* | immediate; directs to emergency/crisis resources; no delay; runs no experience |

### 5.4 Resource directory (author + legal-verify — never fabricate)
| Jurisdiction | Resource name | Contact | Hours | Applicable levels | Verified date | Source |
|--------------|---------------|---------|-------|-------------------|---------------|--------|
| | | | | | | |

> **Every row must be professionally sourced and legally verified.** No engineering- or AI-supplied numbers. Specify the launch jurisdiction(s) and the fallback for out-of-jurisdiction users.

### 5.5 Escalation & handoff rules (author)
- When does the engine end the session vs. remain available?
- Is there a human-escalation path (support team), or resource-only?
- What is shown if the learner returns after an L3 event?

### 5.6 Domain edge cases (author)
Provide guidance for: intimate partner violence & coercive control; sexual coercion/assault disclosures; self-harm/suicidality; threats of harm to others; **minors** (age policy + handling); and the product's **mandatory-reporting posture** (with legal).

---

## 6. Non-negotiable constraints your content must satisfy

1. **Non-diagnostic** — never name or imply a clinical condition (Layer 1 §5).
2. **Non-directive** — support and refer; never decide for the learner (Ops §4).
3. **Education-only boundary preserved** — the Companion hands off; it does not treat.
4. **No delay on L3** — the emergency handoff precedes everything; no reasoning, no experience.
5. **Privacy** — consistent with the Companion's privacy-first posture: capture only what the safety action requires; do not build a durable sensitive-disclosure record beyond what law/safety demands (coordinate with legal).
6. **Fail safe** — on classifier uncertainty near a risk boundary, escalate to the *higher* level (Minimize-Assumptions rule); never under-classify a possible L3.

## 7. Integration specification (delivery format)

Deliver as three structured tables so they load directly into the runtime:
- **`safety_taxonomy`** — {risk_category, level, signal_definition} → configures the SAF-001 classifier.
- **`safety_responses`** — {level, message, tone} → the safety-response templates.
- **`safety_resources`** — the §5.4 directory → the jurisdiction-aware referral lookup.

Versioned (semver), each row with an author + review date, matching the workbook's governance pattern. The engine consumes these as configuration; it contains no hard-coded safety content.

## 8. Validation (co-authored)

We will build a **safety regression suite** *with* you: a curated set of inputs → expected level → expected response, asserted on every release. Hard invariants the suite enforces:
- L2/L3 inputs **never** run an experience.
- No L3 input is ever classified below L3 in the test set.
- Every level's response renders and includes the correct resources.

This suite is itself sensitive; it is authored and stored under the same clinical/legal review as the content.

## 9. Governance, review & sign-off

- **Clinical review:** the qualified author signs the taxonomy, responses, and edge-case guidance.
- **Legal review:** jurisdiction of resources, mandatory-reporting posture, minor policy, liability language.
- **Owner sign-off:** launch gate — the Companion stays non-public until 1–3 above are complete and signed.
- **Cadence:** resources re-verified on a fixed schedule (they change); taxonomy reviewed on a defined interval.

## 10. Responsibility split (so authorship is unambiguous)

| Item | Engineering / AI | Clinical author | Legal |
|------|------------------|-----------------|-------|
| Escalation mechanism, override, halt behavior | ✅ | | |
| Detection taxonomy & thresholds | | ✅ | |
| Response language | | ✅ | review |
| Resource directory | | ✅ (source/verify) | ✅ (jurisdiction) |
| Mandatory-reporting posture, minor policy | | input | ✅ |
| Integration + regression harness | ✅ (build) | ✅ (define cases) | |
| Launch sign-off | | ✅ | ✅ + owner |

## 11. Open questions (for owner + author before authoring)

1. **Launch jurisdiction(s)** — which countries/regions at launch? (Determines the resource directory scope and legal review.)
2. **Mandatory-reporting posture** — what, if anything, does the product do beyond referral? (Legal-led.)
3. **Minors** — is the product 18+ only, or must it handle minors (and their distinct safety/legal requirements)?
4. **Human escalation** — is there a support team in the loop, or is the safety response resource-only?
5. **Data handling of disclosures** — retention/erasure policy for inputs that trigger L2/L3 (legal + privacy).

---

### Summary
The safety *architecture* is complete and waiting. This packet is the frame for the **clinical content that only a qualified professional may author** — the detection signals, thresholds, response language, and verified resources — under clinical and legal review, as the final launch gate. Engineering will integrate and help build the regression harness; it will not author, and has not authored, any clinical safety content.
