# Relationship Snapshot — Project Brief for Claude Code

## ⚠️ Naming change — read this first

There has been a rename that affects existing code. Before touching anything:

| Term | Refers to | Status |
|---|---|---|
| **Relationship Snapshot** | The new 6-quiz, 22-question, 26-cluster assessment system (this project) | **NEW** — this is what you're building |
| **RPI™** (Relationship Progress Index) | The *original* 15-item, 5-dimension quiz that used to be called "Relationship Snapshot" | **RENAMED** — if you find existing code, tables, routes, or copy referring to "Relationship Snapshot" that use a 15-item/5-dimension structure with a GHL webhook, Meta Pixel, and Google Ads conversion tracking, that is the OLD system. It needs to be renamed to RPI, not deleted, not merged, not treated as the same thing as this project.
| **Relationship Profile™** | A separate, larger clinical assessment (six-domain, cross-phase) | **NOT part of this build** — do not build this yet, do not confuse it with either of the above |
| **The Relationship Playbook™** | The report/output a person receives after completing a Relationship Snapshot quiz | **UNCHANGED name** — only the assessment system was renamed, not the report brand |

**Action required before writing any code:** search the existing relationshiplc.com codebase for "Relationship Snapshot," "Snapshot," and any 15-item/5-dimension quiz logic. Confirm with the person before renaming anything — do not assume which occurrences are old vs. new without checking the actual item count/structure (old = 15 items/5 dimensions; new = 22 questions/26 clusters, described below).

---

## What Relationship Snapshot is

A person picks one of 6 short quizzes based on what part of their life they're struggling in (e.g. dating issues → Exploration quiz). Each quiz is 22 forced-choice questions with 4–5 statement options; they pick whichever resonates most per question. Scoring produces a Primary and Secondary result out of 26 possible "Experience Clusters." Primary gets a full report (validating paragraph + "The Relationship Playbook™" with a cluster-specific subtitle + a CTA). Secondary is named but gets no CTA.

Full worked architecture — data model, scoring function, results page layout, and open product questions — is in **`RLC-Operating-System-Architecture.md`** in this same directory. Read that in full before starting. All tables use a `snapshot_` prefix (e.g. `snapshot_clusters`, `snapshot_quiz_sessions`) — deliberate, so that when Relationship Profile™ gets built later it doesn't collide with or get confused for this system's tables.

## Data files (seed-ready, do not hand-transcribe from the Excel workbook)

All in `/data`:

- **`clusters.json`** — 26 records: id, name, core_challenge, description, unmet_need, underlying_fear, is_assessable (false for clusters 2 & 17 — they exist for backend content only and must never be a quiz outcome), playbook_title, playbook_subtitle, alignment_paragraph (Primary's full report content), secondary_blurb (Secondary's trimmed one-sentence version — no CTA ever accompanies this), content_pillars (array of 4, backend content use, not shown to end users).
- **`quiz_items.json`** — 216 records: cluster_id + statement. The curated item bank (8–10 per cluster) that quiz questions are built from.
- **`assessments.json`** — 6 records: the phase-quizzes (exploration/exclusivity/expansion/expiration/recovery/renewal), entry_prompt copy for the picker screen, and valid_clusters (which cluster IDs can be a possible outcome in that specific quiz — this list already has the exclusions and minimum-count pruning applied; don't recompute it).
- **`quiz_questions.json`** — the full pre-built 132 questions (22 × 6 assessments) with their exact option sets. **Use this as-is.** Do not regenerate questions algorithmically — this set was built and verified (balanced cluster appearances, zero duplicate statements per question) through several iterations with the person; regenerating would risk losing that validation.

## Build order (from the architecture doc)

1. Supabase migration (schema in the architecture doc, Section 2)
2. Seed script — loads the 4 JSON files above directly into the tables
3. One assessment end-to-end (Exploration) — picker → quiz UI → scoring → results page
4. Scoring + tie-break logic (Section 3 of the architecture doc)
5. Remaining 5 assessments (same components, different assessment_id)
6. Playbook delivery — **blocked on open product decisions, see below**

## Product decisions — resolved, build to these

- **Playbook delivery:** PDF, accessed through a client portal (requires a real Supabase Auth account, not an anonymous session). Start with pre-generated static PDFs per cluster (26 total) unless personalization is confirmed as a requirement — see architecture doc Section 5A before choosing dynamic generation.
- **Email timing:** captured only at conversion (CTA click), never required to start or complete a quiz. `contact_email` and `user_id` stay null through the whole quiz-taking flow.
- **This replaces RPI on the public site** — not a simple swap. There's a migration checklist in the architecture doc, Section 5C (GHL webhook, Meta Pixel, Google Ads conversion action all need repointing from the old quiz's completion event to this one; old quiz's code/data gets unpublished, not deleted, since it's needed for the future Relationship Profile™ build; existing Healthy/Mid/Distressed GHL nurture tracks need an explicit remapping decision, not a forced fit onto 26 clusters). **Do this checklist alongside the build, not after** — both systems technically existing on the site at once will cause the old marketing infrastructure to misfire.
- **Secondary result:** gets `secondary_blurb` (already in `clusters.json` for all 26) — a short single sentence, not the full `alignment_paragraph`. No CTA on Secondary, ever.

