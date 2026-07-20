# Relationship Companion — Content Architecture Blueprint

**This is the system content will use — not content.** No guided reflections, prompts, educational copy, practices, or RLC™ interpretations are written here. It defines the templates, roles, metadata, and mappings that keep hundreds of future experiences consistent, and how they sit on the technical schema already built (`companion_*` tables, the 22-type block renderer, the governed CMS).

## Governing principles
1. **Situation-first for consumers.** People navigate by real-life moments ("They haven't texted me back"), never by Trust / Communication / Conflict / Attachment / domains / competencies / phases.
2. **Theory is internal.** Experience *type*, RLC phase, developmental task, domains, competencies, and practices are metadata for governance + recommendation logic. A consumer never needs to understand the theory to use the Companion.
3. **Two layers, always.** A **technical block type** (the input widget the renderer draws) is distinct from a **content block role** (the semantic job it does in an experience). One widget serves many roles. This is what makes scale consistent.
4. **Templates, not bespoke pages.** Every experience is an instance of one of five **experience types**, each with a recommended **flow** (an ordered list of content roles). Authoring = pick a type → start from its flow template → fill the blocks → map metadata → publish.

---

## 1. Experience Types (five reusable templates — INTERNAL)

Stored as `companion_experiences.experience_type` (proposed field, §9). Never shown to consumers unless a record explicitly opts in.

| Type | Purpose | When to use | User mindset | Desired outcome | Recommended flow (content roles) | Core reusable blocks |
|---|---|---|---|---|---|---|
| **Prepare** | Get ready for a moment that hasn't happened yet | Before a date, a hard conversation, meeting family, a DTR | Anticipatory, a little anxious, wants to feel grounded and ready | Clear intentions + a concrete plan; feels prepared and calmer | Introduction → Intentions → Preparation → Planning → Closing | intro_context, values_check, needs_identification, conversation_planner, user_next_step, closing_summary |
| **Process** | Make sense of something that already happened | After an argument, a confusing date, a letdown, a breakup | Activated, emotional, seeking understanding and relief | Emotional clarity + a grounded read + one constructive next step | Story → Emotions → Understanding → Reflection → Application → Closing | reflection_long, emotion_select, fact_vs_assumption, perspective_taking, ownership_reflection, user_next_step, closing_summary |
| **Decide** | Weigh a real decision (never decide *for* them) | "Should I keep dating them?", moving in, staying/leaving, setting a boundary | Torn, ruminating; wants structure, not a verdict | A clearer, values-aligned sense of the choice + a next step | Introduction → Clarify the decision → Values → Options → Reality-check → Next step → Closing | intro_context, values_check, decision_comparison, fact_vs_assumption, needs_identification, user_next_step, closing_summary |
| **Build** | Strengthen a capacity or change a pattern over time (proactive) | Improve communication, rebuild trust, healthier boundaries, deepen intimacy | Motivated, growth-oriented, reflective | Insight into a pattern + a concrete practice or commitment | Introduction → Educational insight → Pattern recognition → Reflection → Practice → Closing | intro_context, educational_note, pattern_recognition, boundary_reflection, practice_recommendation, user_next_step, closing_summary |
| **Celebrate** | Notice and anchor something good | A great date, a milestone, a win, gratitude, an anniversary | Warm, positive, appreciative | Savoring + anchoring what worked and what it means | Introduction → Story → Appreciation → Meaning → Anchor → Closing | intro_context, reflection_long, emotion_select, values_check, user_next_step, closing_summary |

**Safety by type:** Decide carries the strongest safety posture (never resolves stay/leave, never labels a relationship abusive); Process is next (risk-aware suppression of confrontation exercises). Every type honors the global safety rules (§7, and `companion_safety_rules`).

---

## 2. Situation Library (the consumer navigation spine)

Consumers browse **situations** — concrete, first-person moments — not categories. A situation is the unit people recognize; the experience type + theory live behind it.

**Model (proposed `companion_situations`, §9):**
- A **situation** = `{ slug, consumer_label, collection, status_markers, keywords, primary_experience_id }`, e.g. *"They haven't texted me back."*
- A situation points to a **primary experience** now, and can gain **alternate experiences** later (different depth, length, or status framing) without changing the consumer entry.
- Situations roll up into **collections** (life-moment groupings) for browse — collections are still situation-language, never theory:

| Collection (consumer browse) | Example situations |
|---|---|
| Early dating & connection | Before a first date · They haven't texted me back · Something felt off on a date · We had a great date |
| Defining the relationship | Should I keep dating them? · Are we on the same page? · I want to talk about exclusivity |
| Friction & repair | We had our first argument · I feel unheard · I need to set a boundary · We keep having the same fight |
| Big decisions | Should we move in together? · I don't know whether to stay · We want different things |
| Distance & disconnection | We feel like roommates · I feel lonely in this relationship · We've stopped being close |
| Endings & healing | We just broke up · I keep replaying how it ended · I'm scared to try again |
| Growth & intention | I want to be a better partner · I noticed an old pattern · I want to reflect freely |
| Wins & milestones | We had a great date · We hit a milestone · Something went well |

- **Never** a consumer-facing tab named Trust / Communication / Conflict / Attachment / Domain / Competency. Those are metadata (§7).
- Free reflection is always available as its own situation ("I want to reflect freely" → a `free`-mode experience).

**Relationship to existing schema:** today `companion_experience_categories` holds a topic taxonomy. The blueprint elevates that into two consumer layers — **collections** (browse groups) and **situations** (entries) — with the theory taxonomy demoted to pure metadata. §9 specifies the small schema delta.

---

## 3. Experience Metadata architecture

Every experience carries the fields below. "Where" shows the existing column or a proposed addition (§9). "Consumer" marks what a member can ever see.

**Identity & discovery**
| Field | Purpose | Consumer | Where |
|---|---|---|---|
| title | Internal name | no | `title` ✓ |
| consumer_title / situation label | The situation phrasing shown | yes | `consumer_title` ✓ (or `companion_situations.consumer_label`) |
| subtitle | One-line consumer framing under the title | yes | **new** `subtitle` |
| estimated_completion_time | "About N min" | yes | `est_minutes` ✓ |
| search_keywords | Powers situation search | no (drives results) | **new** `search_keywords` |

**Classification & targeting**
| Field | Purpose | Consumer | Where |
|---|---|---|---|
| experience_type | Prepare/Process/Decide/Build/Celebrate | no | **new** `experience_type` |
| structural relationship marker(s) | Which statuses it prioritizes for | no | `companion_experience_status_mappings` ✓ (include/exclude) |
| trigger | The real-life event that surfaces it | no | **new** `trigger` |
| primary_goal | The single job of this experience | no | **new** `primary_goal` |
| desired_outcome | What the user leaves with | no | **new** `desired_outcome` |

**Internal theory (never consumer-facing)**
| Field | Purpose | Where |
|---|---|---|
| primary RLC phase | Exploration/Exclusivity/Expansion/Expiration/Recovery/Renewal | `phase` ✓ |
| developmental_task | The phase task it serves | `developmental_task` ✓ |
| primary_domain | One of the six domains | `domain` ✓ |
| secondary_domain | Optional second domain | **new** `secondary_domain` |
| competencies | Many competencies | `companion_experience_competency_mappings` ✓ |
| primary/secondary phase & domain mappings (multi) | Cross-mapping for recommendation | `companion_experience_phase_mappings`, `_domain_mappings` ✓ |

**Safety, connections & integration**
| Field | Purpose | Where |
|---|---|---|
| safety_flags | Classification + which safety rules apply | `safety_classification` ✓ + `companion_safety_rules` ✓ |
| suggested follow-up tools | e.g. Conversation Planner, another experience | **new** `follow_up_tools` (jsonb) |
| recommended Playbook | Cross-sell / deepen | `playbook_connection` ✓ |
| recommended Academy lesson | Learn more | `academy_lesson_connection` ✓ |
| Blueprint integration | Which Blueprint section(s) this feeds/reads | **new** `blueprint_link` (jsonb) |
| recommended practice | The practice it points to | `recommended_practice` ✓ + `companion_experience_practice_mappings` ✓ |
| reading_level / audience | Readability + public/professional | `reading_level` ✓, `audience` ✓ |
| version / review / provenance | Governance | `current_version`/`published_version`, `companion_content_reviews` ✓ |

---

## 4. Reusable Content Blocks (the two-layer library)

**Layer A — technical block types (already built, 22).** The renderer's input widgets: `intro_context, educational_note, reflection_single, reflection_long, reflection_multiple_choice, checkbox_select, emotion_select, fact_vs_assumption, perspective_taking, values_check, needs_identification, boundary_reflection, decision_comparison, conversation_planner, ownership_reflection, pattern_recognition, practice_recommendation, safety_notice, professional_support, closing_summary, user_next_step, free_write`.

**Layer B — content block roles (semantic).** What a block *does* in an experience. Roles are how authors think and how flows are described; each role renders through a technical type. Add an optional `role` tag to a block (§9) so templates and reporting stay consistent. Purposes only — no prompt text here.

| Content role | Purpose (what it accomplishes) | Renders as (type) | Input? |
|---|---|---|---|
| Introduction | Set context + a safe, calm frame for the moment | intro_context | display |
| Educational Insight | Offer a short, non-clinical bit of understanding | educational_note | display |
| Intentions | Name what the user wants from this moment | values_check | input |
| Story Reflection | Let the user describe what happened, in their words | reflection_long | input |
| Emotion Reflection | Identify and name what they're feeling | emotion_select | input |
| Facts vs Assumptions | Separate what's known from what's inferred | fact_vs_assumption | input |
| Perspective Taking | Consider the other person's likely experience | perspective_taking | input |
| Values Reflection | Surface what matters most here | values_check | input |
| Needs Identification | Name the underlying need or request | needs_identification | input |
| Boundary Reflection | Clarify a limit, request, or line | boundary_reflection | input |
| Ownership Reflection | Notice the part that belongs to them | ownership_reflection | input |
| Pattern Recognition | See a recurring theme across situations | pattern_recognition | input |
| Decision Matrix | Weigh options against values/outcomes | decision_comparison | input |
| Conversation Planning | Prepare a specific conversation | conversation_planner | input |
| Action Planning / Next Step | Choose one constructive next step | user_next_step | input |
| Practice Recommendation | Point to an approved practice | practice_recommendation | display |
| Celebration Reflection | Savor + anchor what went well | reflection_long / emotion_select | input |
| Preparation | Rehearse / ready oneself for the moment | reflection_long or checkbox_select | input |
| Understanding | Make meaning (bridge between emotion and action) | perspective_taking / reflection_long | input |
| Application | Translate insight into this week | user_next_step | input |
| Safety Notice | Surface a safety message when a rule fires | safety_notice | display |
| Professional Support | Recommend a qualified professional | professional_support | display |
| Closing Reflection | Consolidate + close gently | closing_summary | display |
| Free Write | Open, unstructured space | free_write | input |
| Quick Choice / Checklist | Lightweight structured input | reflection_multiple_choice / checkbox_select / reflection_single | input |

No new technical block types are required — the 22 cover every role. New *roles* are additive metadata, never migrations.

---

## 5. Experience Flows (starter templates per type)

Each flow is an ordered list of **content roles** — the default skeleton an author starts from and adapts. Not mandatory; the renderer supports any combination + conditional blocks.

- **Prepare:** Introduction → Intentions → Preparation → (Conversation Planning) → Action Planning → Closing
- **Process:** Story → Emotions → Understanding (Facts vs Assumptions → Perspective Taking) → Reflection (Values → Ownership) → Application (Next Step) → Closing
- **Decide:** Introduction → Clarify the decision (Story/Free Write) → Values → Decision Matrix → Reality-check (Facts vs Assumptions) → Needs → Next Step → Closing
- **Build:** Introduction → Educational Insight → Pattern Recognition → Reflection (Boundary/Values) → Practice Recommendation → Action Planning → Closing
- **Celebrate:** Introduction → Story → Appreciation (Emotion) → Meaning (Values) → Anchor (Next Step / save win) → Closing

**Cross-cutting rules:** any flow may insert a **Safety Notice / Professional Support** block (rule-driven, §7); Decide and Process flows must be able to **suppress** confrontation/communication steps when a safety rule indicates risk. Every flow ends on a Closing role and offers **follow-up tools** (Conversation Planner, a related situation, a Playbook).

---

## 6. Relationship Status Mapping

- Experiences map to the five markers — **Single, Dating, Committed Relationship, Engaged, Married** — via `companion_experience_status_mappings` (many-to-many, `include`/`exclude`).
- **Universal** = no include rows (available to all); **status-specific** = include one or more; **exclude** suppresses even when otherwise matched.
- Status **prioritizes** what surfaces (Home ordering, Process default) and **filters** unsuitable content. It **never determines the RLC phase** — a Married user can still land on Expiration-flavored internal metadata if that's what an experience carries. Status is a consumer situation lens; phase is internal theory. These two are permanently separate.

---

## 7. Internal Theory Mapping (governance + recommendation only)

Every experience supports internal mapping to **RLC phase, developmental task, domain(s), competencies, practices** via the existing metadata columns + mapping tables (`_phase_mappings`, `_domain_mappings`, `_competency_mappings`, `_practice_mappings`, all include/exclude). These power:
- **Recommendation logic** (surface the next best situation given status + history + gaps),
- **Coverage reporting** (which phases/domains/competencies are thin — the same content-gap signal the Snapshot analytics gave),
- **Safety routing** (`companion_safety_rules`: suppress an experience, show a notice, recommend a professional, route to crisis resources, bypass confrontation).

None of it is ever exposed to consumers unless a record explicitly opts a term in. The renderer and situation navigation carry zero theory vocabulary.

---

## 8. Navigation recommendations (situation-first IA)

- **Home** — "What are you navigating right now?" → situations ranked by status + interests + recent + featured + universal. No theory, ever.
- **Process** — browse **collections** (life-moment groups) → situations; plus search (keywords) and light filters that stay in situation/format language (guided vs free, time, unfinished/complete). Never a Trust/Communication filter.
- **Experience** — a situation opens its primary experience; the renderer draws the flow; theory stays invisible.
- **Journey / Blueprint / Planner / Library** — unchanged; Blueprint links (`blueprint_link`) let a Build/Process experience feed a Blueprint section, and a situation can suggest the Conversation Planner as a follow-up tool.
- **Consumer language discipline:** situations are first-person and plain (≈5th-grade); type names (Prepare/Process/Decide/Build/Celebrate) and all theory terms are internal.

---

## 9. Scalability recommendations

1. **Author-by-template workflow.** In the CMS, choosing an `experience_type` pre-loads that type's flow (a role skeleton) so every Process experience shares a spine. Biggest single consistency lever.
2. **Content roles as a tag layer.** Add optional `role` to `companion_experience_blocks` so blocks are semantically labeled (not just typed) — enables templates, coverage reports, and swapping a role's wording library across many experiences.
3. **Situation catalog.** A `companion_situations` table decouples the consumer entry from the experience behind it: rename/rescope a situation, or add a shorter alternate experience, without breaking links or history.
4. **Metadata completeness gate.** Extend the publish-readiness check (mirroring the Snapshot instrument gate) to require: type set, ≥1 status mapping (or explicit universal), primary goal + desired outcome, safety classification, and ≥1 flow block — before an experience can reach Published.
5. **Naming + keyword conventions.** Situations are first-person present ("I need to set a boundary"); keywords capture the vernacular ("ghosted", "iced out") so search matches how people actually phrase it.
6. **Deduplication discipline.** Reuse the Snapshot lesson: scan situation labels + keywords for near-duplicates within a collection before publishing, so the library doesn't sprawl into overlaps.
7. **Coverage dashboard.** An owner view of experiences × (status, type, phase, domain, competency) to see gaps and over-concentration — turns "what to write next" into data.
8. **Versioning stays immutable.** Revising an experience creates a new version; past user entries keep the version + status they used. Situations can re-point to a new primary experience without rewriting anyone's Journey.
9. **Recommendation hooks now, engine later.** The mappings above are enough to power a simple "next situation" recommender at launch and a richer one later — no schema change required.

---

## 10. Proposed schema delta (design only — implement on approval)

A single additive migration (`0043_companion_content_architecture`) would enable the above; **not built yet** (this is the blueprint):
- `companion_experiences` add: `experience_type text`, `subtitle text`, `trigger text`, `primary_goal text`, `desired_outcome text`, `secondary_domain text`, `follow_up_tools jsonb default '[]'`, `blueprint_link jsonb default '[]'`, `search_keywords jsonb default '[]'`.
- `companion_experience_blocks` add: `role text` (content-block role).
- new `companion_situations` (`id, slug, consumer_label, subtitle, collection, keywords jsonb, primary_experience_id, display_order`) + `companion_situation_experiences` junction (situation ↔ experiences, with `is_primary`), reusing status mappings for prioritization.
- CMS: type→flow template loader, role tagging on blocks, situation manager, and a metadata-completeness publish gate.

Everything here rides on the existing renderer, governance workflow, RLS, and mappings — no rework, only additive fields + a situation catalog. **No guided experiences written; this is the frame they'll fill.**
