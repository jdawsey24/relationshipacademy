# Typography Type-Scale Audit — v1

**Date:** 2026-07-31
**Scope:** All `text-*` size usage across `app/` and `components/`.
**Status:** Findings recorded; canonical scale codified; highest-value drift fixed. A full
per-surface migration is scoped below as opt-in follow-up, not done in this pass.

---

## 1. How type was being sized (the "before")

The site had **no custom type scale**. Every heading and every line of copy pulled from one of two
uncoordinated systems:

1. **Tailwind's default steps** — `text-xs … text-6xl` (1,300+ `text-sm` alone).
2. **Arbitrary pixel values** — `text-[11px]`, `text-[15px]`, `text-[17px]`, `text-[44px]`, etc.,
   hand-tuned inline and paired with hand-picked `leading-*`.

### Measured distribution (occurrences)

| Arbitrary `text-[Npx]` | count | | Named step | count |
|---|---|---|---|---|
| `text-[11px]` | 146 | | `text-sm` (14px) | 1309 |
| `text-[15px]` | 100 | | `text-xs` (12px) | 404 |
| `text-[13px]` | 49 | | `text-lg` (18px) | 133 |
| `text-[17px]` | 41 | | `text-2xl` | 121 |
| `text-[10px]` | 33 | | `text-3xl` | 115 |
| `text-[16px]` | 30 | | `text-4xl` | 58 |
| `text-[14px]` | 26 | | `text-xl` | 46 |
| `text-[12px]` | 11 | | `text-base` (16px) | 21 |
| `text-[44px]` | 6 | | `text-5xl` | 18 |
| `text-[40px]` | 4 | | `text-6xl` | 5 |
| `text-[36/28/…px]` | ~10 | | | |

## 2. Findings

**F1 — The eyebrow/kicker was reinvented 146 times.** `text-[11px] font-semibold uppercase
tracking-[0.15em]` appears inline across the site. `SectionLabel` already encapsulated it, but many
surfaces hand-rolled it instead — so the canonical label had no single source.

**F2 — Intentional reading sizes looked like noise.** `text-[15px]` (100×) and `text-[17px]` (41×)
are *deliberate* body sizes (Tailwind has no 15px or 17px step) and are almost always paired with
`leading-relaxed`. They read as ad-hoc arbitrary values but are actually the site's real body scale —
they just had no name.

**F3 — Hero H1 drift (the one visible defect).** The same top-tier marketing hero —
`font-display font-semibold text-midnight-navy leading-[1.05]` — was rendered at **three different
mobile sizes** with no rule:

| Page | was (mobile → desktop) |
|---|---|
| Home | `text-[40px]` → `text-6xl` |
| Framework | `text-[44px]` → `text-6xl` |
| Relationship-Snapshot | `text-[42px]` → `text-6xl` |
| Learn / Assessment | `text-[40px]` → `text-5xl` |

40 vs 42 vs 44 for the same visual role — invisible in isolation, incoherent side by side.

**F4 — A handful of true redundancies.** `text-[12px]`≈`text-xs`, `text-[14px]`≈`text-sm`,
`text-[16px]`≈`text-base`, `text-[18px]`≈`text-lg`, `text-[36px]`≈`text-4xl`. *Note:* these are **not**
always safe find-replace targets — the bracket forms often carry an explicit `leading-*` the named
step would override. They are consolidation candidates, evaluated per-site, not a blanket sweep.

## 3. The canonical scale (codified this pass)

Added to `tailwind.config.ts` as semantic `fontSize` tokens that **bundle line-height** (and tracking,
for the eyebrow). Tailwind's default steps are preserved for structural headings; these name the
intentional off-default sizes so callers pick one token instead of re-tuning size + leading by hand.

| Token | Size | Line-height | Replaces | Use for |
|---|---|---|---|---|
| `text-eyebrow` | 11px | 1.2 + `0.15em` tracking | `text-[11px] … tracking-[0.15em]` | kickers / labels |
| `text-micro` | 13px | 1.5 | `text-[13px]` | helper / meta text |
| `text-body` | 15px | 1.6 | `text-[15px] leading-relaxed` | default card / body copy |
| `text-reading` | 17px | 1.7 | `text-[17px]` | long-form reading |
| `text-hero` | 40px | 1.05 | `text-[40/42/44px] leading-[1.05]` | display hero base (pair with `sm:text-5xl`/`6xl`) |

**Structural headings keep Tailwind's steps:** `text-3xl` (section h2), `text-2xl` (sub-head),
`text-4xl` (page h1 where not a display hero), `text-5xl`/`text-6xl` (hero desktop).

## 4. Applied this pass (low-risk, verified)

- **`SectionLabel` → `text-eyebrow`.** Verified live: 11px / 13.2px LH / 1.65px tracking.
- **Hero trio unified → `text-hero`** (Home, Framework, Relationship-Snapshot) + Learn/Assessment
  base tokenized. All five now share a 40px mobile base; desktop `sm:text-6xl`/`5xl` unchanged.
  Verified live: Home & Framework mobile both 40px/42px LH (Framework was 44px).

No mass rename. The two heavy tails (146 inline eyebrows, 100 `text-[15px]`) are **left untouched**
here — they render identically; migrating them is cosmetic-consistency work, not a bug fix.

## 5. Adoption path (opt-in follow-up)

Ordered by value / safety:

1. ~~**Eyebrows → `text-eyebrow`.**~~ **DONE (2026-07-31).** Migrated the 25 files / 30 sites whose
   eyebrow was the canonical `text-[11px] … tracking-[0.15em]` (snapshot, companion, playbooks
   landing, shared components) to `text-eyebrow`, dropping the redundant size + tracking classes.
   Verified live: 11px / 13.2px LH / 1.65px tracking — identical render. **Left as-is:** the 12px
   `text-xs … tracking-[0.15em]` eyebrow tier used in institute/academy account panels (a deliberately
   larger eyebrow — migrating would shrink it 12→11px), and admin status-pills / variant-tracking
   labels (0.12/0.14/0.2/0.22em) which are not the canonical eyebrow.
2. ~~**Body copy → `text-body` / `text-reading`.**~~ **DONE (2026-07-31).** Migrated the 78
   reading-copy sites (42 `text-[15px] leading-relaxed` → `text-body`; 36 `text-[17px] leading-relaxed`
   → `text-reading`, incl. the 3 `… italic leading-relaxed` variants and the `.article-prose` base in
   `globals.css`), dropping the now-redundant `leading-relaxed`. Verified live: body 15px/24px LH,
   reading 17px/28.9px LH. `text-body` is pixel-identical to the old pair (1.6 vs relaxed 1.625 =
   0.375px); `text-reading` gains a deliberately slightly looser long-form leading (1.7 vs 1.625,
   ~1.3px/line — better reading measure). **Left as-is:** the 57 bare `text-[15px]` and 3 bare
   `text-[17px]` (single-line labels/list-items on `normal` leading — migrating would loosen the
   multi-line ones), and the 3 `leading-snug` variants (intentional tight leading).
3. ~~**Micro text → `text-micro`.**~~ **DONE (2026-07-31).** Migrated the 44 bare `text-[13px]`
   meta/helper labels (36 files) → `text-micro`. Verified live: 13px / 19.5px LH — pixel-identical
   (bare 13px already inherited a 1.5 line-height = the token's). **Left as-is:** the 4
   `text-[13px] leading-relaxed` and 1 `leading-snug` — here the calculus inverts from step 2:
   `text-micro`'s 1.5 LH is *tighter* than `leading-relaxed` (1.625), so migrating those would tighten
   them; the explicit-leading variants keep their intended leading.
4. **Redundancy cleanup (F4).** Case-by-case; only where the named step's line-height matches intent.
5. **Secondary hero tiers.** Consider tokens for the 36px (`contact`) and 30→40px (`results`,
   `library`) tiers if they proliferate.

**Guardrail:** every migration in §5 must be a *no-visual-change* edit (or an intentional, noted
alignment like the hero fix). Verify computed `font-size`/`line-height` in the browser before/after,
per surface.
