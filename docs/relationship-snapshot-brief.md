# Relationship Snapshot — Project Brief for Claude Code

## ⚠️ Naming change — read this first

There has been a rename that affects existing code. Before touching anything:

| Term | Refers to | Status |
|---|---|---|
| **Relationship Snapshot** | The new 5-quiz, 20-25-question, 27-cluster assessment system (this project) | **NEW** — this is what you're building |
| **RPI™** (Relationship Progress Index) | The *original* 15-item, 5-dimension quiz that used to be called "Relationship Snapshot" | **RENAMED** — if you find existing code, tables, routes, or copy referring to "Relationship Snapshot" that use a 15-item/5-dimension structure with a GHL webhook, Meta Pixel, and Google Ads conversion tracking, that is the OLD system. It needs to be renamed to RPI, not deleted, not merged, not treated as the same thing as this project.
| **Relationship Profile™** | A separate, larger clinical assessment (six-domain, cross-phase) | **NOT part of this build** — do not build this yet, do not confuse it with either of the above |
| **The Relationship Playbook™** | The report/output a person receives after completing a Relationship Snapshot quiz | **UNCHANGED name** — only the assessment system was renamed, not the report brand |

**Action required before writing any code:** search the existing relationshiplc.com codebase for "Relationship Snapshot," "Snapshot," and any 15-item/5-dimension quiz logic. Confirm with the person before renaming anything — do not assume which occurrences are old vs. new without checking the actual item count/structure (old = 15 items/5 dimensions; new = 20-25 questions per marker, 27 clusters [25 assessable], described below).

---

## What Relationship Snapshot is

A person picks one of 5 short quizzes based on their **actual structural relationship situation** — single but dating, in a relationship, married/long-term, recent divorce or breakup, or single and contemplating dating. This replaced an earlier design where people self-selected a *phase* directly (e.g. "dating issues → Exploration") — that design silently prevented real incongruence from ever surfacing (a married person could never land on an Expiration-flavored result, even if that's genuinely what their answers pointed to, because Expiration wasn't in their quiz at all). It's 5 markers, not 6, because Expiration never needs to be a marker's own primary phase — nobody self-selects "I'm in Expiration." It shows up purely as a shadow signal, across three different markers.

Each marker now blends two phases: a **primary phase** (the structurally expected content) and a **shadow phase** (the most realistic incongruence pattern for that situation — e.g. Married's shadow is Expiration, because a structurally intact marriage can still be relationally ending). Primary-phase clusters appear roughly 3x more often than shadow-phase clusters in the quiz, so incongruence is detectable but requires real signal to surface as someone's actual result, not just incidental resonance. Full mapping — which marker, which primary/shadow phase pair, which clusters, why — is in **`RLC-Operating-System-Architecture.md`, Section 6**.

Each quiz is 20–25 questions (varies by marker — larger combined cluster counts get more questions) with 5 statement options each; they pick whichever resonates most per question. Scoring produces a Primary and Secondary result out of the clusters available to that marker. Primary gets a full report (validating paragraph + "The Relationship Playbook™" with a cluster-specific subtitle + a CTA). Secondary is named but gets no CTA.

Full worked architecture — data model, scoring function, results page layout, and open product questions — is in **`RLC-Operating-System-Architecture.md`** in this same directory. Read that in full before starting. All tables use a `snapshot_` prefix (e.g. `snapshot_clusters`, `snapshot_quiz_sessions`) — deliberate, so that when Relationship Profile™ gets built later it doesn't collide with or get confused for this system's tables.

## Data files (seed-ready, do not hand-transcribe from the Excel workbook)

All in `/data`:

- **`clusters.json`** — 27 records: id, name, core_challenge, description, unmet_need, underlying_fear, is_assessable (false for clusters 2 & 17 — they exist for backend content only and must never be a quiz outcome), playbook_title, playbook_subtitle, alignment_paragraph (Primary's full report content), secondary_blurb (Secondary's trimmed one-sentence version — no CTA ever accompanies this), content_pillars (array of 4, backend content use, not shown to end users). 25 of the 27 are assessable; see "Cluster 27" section below for why it's structurally different from the other 26.
- **`quiz_items.json`** — 519 records: cluster_id + statement (some entries also carry a `context` field — see "Cluster 24 is a special case" below). The curated item bank, mostly 8-20 per cluster, reused across questions in different combinations. One cluster (26) is capped at only 10 total; that's its real ceiling, not a bug. Cluster 1 was later expanded to 30 (see Cluster 27 section — the two additions are related).
- **`assessments.json`** — 6 records, now structural markers, not pure phases: id, display_name, entry_prompt (picker copy), question_count (20-25, varies by marker), primary_phase/shadow_phase (for reference), primary_clusters/shadow_clusters (which cluster IDs, and which tier they belong to for this specific marker — a cluster can be primary for one marker and shadow for another).
- **`quiz_questions.json`** — the full pre-built, validated question **structure** for all 5 markers (133 questions total, varies 20-25 per marker). Each question has a fixed number of **slots**, and each slot is locked to a specific cluster_id **and tagged with its tier** (`"primary"` or `"shadow"`) — this is what guarantees the 3:1 weighted balance, not just "some balance." **This structure is fixed and pre-validated — do not regenerate it.** Built by `build_marker_quizzes.py` using a greedy scheduler, not random shuffle-and-retry — that distinction matters if this ever needs rebuilding (see architecture doc Section 6 for why naive randomization failed under tight weighting). What's NOT fixed is which exact statement fills each slot — see below.

## Alternating statements (new)

Each quiz slot is tied to a cluster, not a fixed statement. When a person starts a session, resolve each slot to a statement from that cluster's pool in `quiz_items.json`.

**Hard requirement, not a nice-to-have: no statement may repeat within one person's session.** If a cluster appears in 9 different question slots for someone's quiz, that person must see 9 *different* statements — never the same sentence twice, even by chance. Concretely: when resolving statements for a session, sample **without replacement** per cluster — group that session's slots by cluster_id, shuffle that cluster's item pool once, and hand out unique statements from it, not independent random picks per slot (independent picks can collide by chance once a cluster needs several appearances from a limited pool).

This is provably possible for every marker as currently built — the offline generation in `build_marker_quizzes.py` enforces a hard cap so no cluster is ever asked about more times than it has unique statements available (see the pool-size cap in that script). If this system is ever extended with new markers or clusters, that cap must be preserved — a marker requesting more appearances of a cluster than that cluster has statements is treated as a build-time error, not something to paper over with a repeat at runtime.

Persist the resolved statement per session (so navigating back to a previous question shows the same statement, not a re-randomized one — also matters for scoring/analytics integrity). This is the only piece of randomization logic in the whole system — sampling without replacement from a pre-approved list, not a balancing algorithm. **Do not build a live version of the balancing/round-generation logic** — that stays offline in `build_marker_quizzes.py`; the structure it already produced (in `quiz_questions.json`) is what you're building against.

Schema for this: `snapshot_quiz_question_slots` (cluster_id per slot, part of the fixed structure) + `snapshot_quiz_session_items` (which specific statement got shown for that slot, generated once at session start — this is also where the without-replacement guarantee has to be implemented, at write time). Full detail in the architecture doc, Section 2.

## Cluster 24 is a special case — its item pool is split by marker

Cluster 24 ("Difficulty Knowing Whether to Invest") shows up in **three** markers, not two — as a **primary** result in Single, But Dating and In a Relationship (the same underlying doubt at two different checkpoints: before a relationship is defined, and after), and as a **shadow** result in Single and Contemplating Dating. That third one is easy to miss, and was missed — the statement pool is split by a `context` field in `quiz_items.json`, and every marker that uses Cluster 24 must be mapped to the right context:

- `"context": "pre_definition"` (10 statements, e.g. *"I don't know if we're dating or just hanging out"*) — for the **Single, But Dating** marker (primary) AND the **Single and Contemplating Dating** marker (shadow). Both involve someone who is not yet in a defined relationship, so both draw from the same pool.
- `"context": "post_definition"` (9 statements, e.g. *"I don't know if I should lean in or walk away"*) — **only** for the **In a Relationship** marker.

**This is a hard rule, not a preference:** when resolving a Cluster-24 slot for a session, filter `quiz_items.json` by `cluster_id == 24 AND context == <the appropriate value for that marker>` before picking, for **all three** markers that reference Cluster 24 — not just the two obvious primary-result ones. Do not let any marker whose person is pre-relationship (Single, But Dating; Single and Contemplating Dating) show a post-definition statement, and do not let In a Relationship show a pre-definition one. Every other cluster's items have no `context` field and are used as-is, unfiltered, by any marker that includes them.

## Shadow-tier results matter — don't treat them as noise

If someone's Primary or Secondary result is a **shadow-tier** cluster for the marker they picked, that's not a fluke — it's the incongruence signal the whole marker system was built to catch (e.g. a married person's top result being an Expiration cluster). If results ever get surfaced differently for shadow-tier vs. primary-tier outcomes (different framing, a flag for the future clinical side, anything), that distinction needs to be preserved end-to-end, not collapsed once scoring is done. The `tier` field on `snapshot_assessment_clusters` and on each `snapshot_quiz_question_slot`'s parent structure is there specifically so this is queryable later, not just an artifact of how the quiz was generated.

**Fixed, not just flagged:** every shadow cluster across all 5 markers is guaranteed at least 6 appearances, enforced by a minimum floor in `build_marker_quizzes.py` — it's not left to whatever the 3:1 proportional math happens to produce. This mattered concretely for Married, whose 12 primary clusters were diluting its 2 shadow clusters down to 3 appearances each before the floor was added; they're now at 6, same as every other marker's shadow clusters, with primary clusters losing at most 1-2 appearances each to fund it.

## Build order (from the architecture doc)

1. Supabase migration (schema in the architecture doc, Section 2)
2. Seed script — loads the 4 JSON files above directly into the tables
3. One assessment end-to-end (Exploration) — picker → quiz UI → scoring → results page
4. Scoring + tie-break logic (Section 3 of the architecture doc)
5. Remaining 5 assessments (same components, different assessment_id)
6. Playbook delivery — **blocked on open product decisions, see below**

## Product decisions — resolved, build to these

- **Playbook delivery:** PDF, accessed through a client portal (requires a real Supabase Auth account, not an anonymous session). Start with pre-generated static PDFs per cluster (27 total) unless personalization is confirmed as a requirement — see architecture doc Section 5A before choosing dynamic generation.
- **Email timing:** captured only at conversion (CTA click), never required to start or complete a quiz. `contact_email` and `user_id` stay null through the whole quiz-taking flow.
- **This replaces RPI on the public site** — not a simple swap. There's a migration checklist in the architecture doc, Section 5C (GHL webhook, Meta Pixel, Google Ads conversion action all need repointing from the old quiz's completion event to this one; old quiz's code/data gets unpublished, not deleted, since it's needed for the future Relationship Profile™ build; existing Healthy/Mid/Distressed GHL nurture tracks need an explicit remapping decision, not a forced fit onto the cluster taxonomy). **Do this checklist alongside the build, not after** — both systems technically existing on the site at once will cause the old marketing infrastructure to misfire.
- **Secondary result:** gets `secondary_blurb` (already in `clusters.json` for all 27) — a short single sentence, not the full `alignment_paragraph`. No CTA on Secondary, ever.

## Audit performed — findings, so this isn't re-litigated

A full integrity + content-fit pass was run on the final system:

**Mechanical checks, all clean:** no non-assessable cluster (2 or 17) leaks into any marker; every one of the assessable clusters is reachable by at least one marker (no orphans); every cluster has complete playbook/alignment content; every quiz slot's cluster matches its marker's declared primary/shadow lists; every quiz_item's cluster_id is valid; total question-option counts reconcile exactly with computed appearance targets for all 5 markers. **This audit was originally run against 26 clusters (24 assessable); Cluster 27 was added afterward and independently re-verified against the same checks — see "Cluster 27" section below.** Current state: 27 clusters, 25 assessable.

**Content-fit read-through found one real bug**, already fixed: Cluster 20 was pulled into "In a Relationship"'s shadow set purely by phase tag, but its actual statements are major-life-disruption content that doesn't fit a new relationship's context — removed (see architecture doc Section 6). **The lesson, not just the fix:** a cluster being correctly phase-tagged doesn't guarantee it's a good content fit for every marker built from that phase — if this system is ever extended with new markers, each shadow-cluster inclusion needs an actual read-through of its statements, not just a phase-tag match.

**One flagged, not yet resolved:** Cluster 19 in "Single, But Dating"'s shadow set uses present-tense "we" language ("We argue about parenting") that assumes an active partner dynamic — plausible for a single co-parent, but the phrasing sits oddly against "not currently in a relationship." Left as-is pending a decision on whether to reword those specific statements or leave it.

## "None of these fit" — a 6th option, app-rendered, not in the question data

Every question shows 5 statement options from `quiz_questions.json`, unchanged. On top of that, **always render a 6th button** — "None of these fit" — that is NOT part of the pre-built question structure and never touches `snapshot_quiz_question_slots`. Selecting it writes `is_neutral = true` and `selected_slot_id = null` to `snapshot_quiz_answers`; scoring skips it entirely (see `scoreSession` in the architecture doc, Section 3).

**Why it's built this way, not as data:** this keeps the validated 5-per-question structure we audited completely untouched — the neutral option is pure application logic layered on top, not a change to the quiz content itself.

**The tradeoff, on purpose, not overlooked:** this was pushed back on before being built, because someone who leans on this option heavily gets a result built on real signal from fewer questions than everyone else, and the people most likely to do that tend to have a milder or more ambivalent version of whatever pattern they're actually experiencing — not a random sample. That's why `neutral_answer_count` and `is_low_confidence` (>40% neutral) exist on `snapshot_quiz_sessions` — so a thin-signal result is knowable, not invisible. **What to actually do with `is_low_confidence` on the results page is not decided — do not invent behavior for it.** Ask before building anything that changes what a low-confidence person sees.

## Cluster 27 — structurally different from the other 26, on purpose

**What it is:** "Fear of Being Used Again" — core challenge "I feel used in relationships." Need: To Feel Secure. Fear: "If I let my guard down, I'll get used again — so I'd rather assume the worst before it happens." Playbook subtitle: "Letting Go of the Armor."

**Why it exists and what it covers:** built to serve people whose guardedness in dating comes from feeling valued only for what they provide (money, status, effort, emotional labor) rather than who they are — and the specific fear that they're disposable once they stop providing it. This wound shows up under two very different vocabularies — red-pill/manosphere framing (transactional dating, status-based worth, replaceability) and pink-pill/Female Dating Strategy framing (invisible emotional labor, being used, distrust of reciprocity) — and this cluster deliberately holds both as flavors of the same fear, the same way Cluster 1 already holds Incel and Femcel framing without needing two separate clusters. See the Culture Terms tab in the Excel workbook for the specific term-to-cluster mapping (Red Pill, Pink Pill, Female Dating Strategy, Leveling Up, High-Value Woman all point here).

**How it's structurally different from Clusters 1-26, and why that matters for future maintenance:**
- Clusters 1-26 were mined from a 1,069-statement corpus the person provided, then organized into clusters. Cluster 27 was built the opposite direction — the pain point was identified first, then 16 statements were written to match it. Its statements were later added to the backend "Full Statement Mapping" pool too (bringing it to 1,085) purely so it wouldn't show a misleading zero count in reporting — but its actual origin is different, and that's worth knowing if anyone audits "where did this cluster come from" later.
- It was **not** picked up by the mechanical phase-blending logic that builds `markers_raw.json` for the other 26 clusters (that logic reads phase tags from the original corpus, and Cluster 27 has none in the same sense). It was added via an explicit, manual override in `build_markers.py` directly into "Single, But Dating"'s primary cluster set. If `build_markers.py` or `build_marker_quizzes.py` is ever rewritten from scratch, this override must be preserved — Cluster 27 will silently disappear from the system otherwise, since there's no corpus data that would regenerate it automatically.
- Cluster 1 was expanded from 20 to 30 statements at the same time (10 new statements reflecting how rejection gets narrated in this same content space), so if you're diffing item bank sizes later, that's why Cluster 1 is the largest.

**Independently re-verified after addition:** re-ran the full mechanical audit (orphan check, pool-cap check, playbook-completeness check) after Cluster 27 was integrated — all clean. 25 assessable clusters, zero orphans, zero pool-cap violations.

