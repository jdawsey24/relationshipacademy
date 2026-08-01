/**
 * ADD-ON — "Dating Later"
 * Derived from Cluster 20: Dating Later in Life (10 statements).
 * Field Guide literature. 4 Core Guides + 1 Question Read. (Add-on scale.)
 *
 * Track: Renewal. Core Need: TO MOVE FORWARD.
 *
 * ⚠ ADD-ON, NOT A PLAYBOOK. Not quiz-detectable. Reached by signpost or a
 *   life-situation menu. `addon-` prefix on playbookKey.
 *
 * ⚠ NO AGE IS NAMED ANYWHERE. "Later" means later than the reader expected to
 *   be doing this. That is fifty for some people and thirty for others, and the
 *   content must work for both. No numbers, no life-stage assumptions, no
 *   assumption about why they are single now.
 *
 * ⚠ THE READER IS NOT DISADVANTAGED. "Am I too old to start over" is answered
 *   as a question about mechanics rather than about worth, and the accumulated
 *   position — a settled life, known preferences, less patience for what doesn't
 *   work — is treated as an advantage, because it is one.
 *
 * ⚠ NO REASSURANCE ABOUT FINDING SOMEONE. "Will I ever find love again" is not
 *   answered yes. Nobody knows.
 *
 * ⚠ OVERLAPS ACKNOWLEDGED. `staying-yourself` (C22) covers independence and
 *   commitment; `lean-in-or-let-go` (C24) covers whether to invest. This add-on
 *   is the context those sit in when someone is starting again with a life
 *   already built — it should not restate either.
 *
 * ⚠ CLAIM SCOPE. May claim: separate what changed in dating from what changed
 *   in you; hold independence and openness together deliberately. MUST NOT
 *   CLAIM: that you'll meet someone, that it's easier later, that the
 *   independence must be given up, or anything about anyone's timeline.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

export const ADDON_DATING_LATER_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-later-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this is for",
    related: ["lit-later-whats-different", "lit-later-peace"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI never thought I'd be dating at this age.\u201d Most of what's written for people dating assumes someone at the beginning of things, with time, few commitments and no accumulated history.",
          "That describes almost nobody doing this later, and the mismatch is most of why the available advice reads as though it were written for somebody else.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things have changed and they're often conflated",
        body: [
          "The mechanics. How people meet, what's expected, the pace. Genuinely different, and learnable.",
          "You. A settled life, known preferences, less patience for what doesn't work. Also genuinely different, and mostly an advantage.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here says how it goes or promises you'll meet someone. What it can do is stop the two kinds of change being treated as one problem.",
        ],
      },
    ],
  },

  {
    id: "lit-later-whats-different",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What's actually different",
    related: ["lit-later-what-this-is", "lit-later-too-old"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cDating feels completely different now.\u201d \u201cI don't know what people expect anymore.\u201d",
          "Both accurate. It's worth separating what's changed out there from what's changed in you, because they need different responses.",
        ],
      },
      {
        kind: "list",
        label: "Changed out there",
        items: [
          "Where people meet, and how much of it happens on a screen before anyone is in a room.",
          "The pace, which is often faster at the start and slower to arrive anywhere.",
          "The volume \u2014 more options, less depth of attention on any of them.",
          "Less shared context. People arrive with histories that aren't visible.",
        ],
      },
      {
        kind: "list",
        label: "Changed in you",
        items: [
          "You know what you want, which most people at the start don't.",
          "You have a life, which changes what a relationship has to carry.",
          "Less patience for what doesn't work, which is efficiency rather than rigidity.",
          "More to protect, and more to lose by merging carelessly.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The first list is a learning problem and it's smaller than it feels. The second isn't a problem at all, though it frequently gets described as one \u2014 usually by people who'd benefit from you having less of it.",
        ],
      },
    ],
  },

  {
    id: "lit-later-peace",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Protecting your peace and opening your heart",
    related: ["lit-later-whats-different", "lit-later-merging"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't know how to balance protecting my peace with opening my heart.\u201d The clearest statement of the actual difficulty, and it's a genuine tension rather than a confusion to be resolved.",
        ],
      },
      {
        kind: "distinction",
        label: "Why it doesn't resolve",
        body: [
          "Both are real goods. The peace was hard-won and losing it would be a genuine loss. And nothing worth having is available without some exposure.",
          "Advice usually picks a side \u2014 be more open, or protect yourself \u2014 and both halves of that are wrong half the time.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "What's more useful is treating it as a rate rather than a decision. Not open or closed \u2014 how fast, and about what, and with the ability to slow down without ending anything.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI enjoy my independence, but I miss companionship\u201d is not a contradiction and doesn't require choosing. Plenty of people arrange lives that contain both, and the arrangements are less conventional than the ones available earlier.",
        ],
      },
    ],
  },

  {
    id: "lit-later-merging",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Not merging too quickly",
    related: ["lit-later-peace", "lit-later-too-old"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI don't want to merge my life with someone too quickly.\u201d Sensible, and worth noticing that it's easier said than done later rather than harder.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Two pressures push toward speed. \u201cI don't want to waste time\u201d, which is often accurate about the years and inaccurate about the pace \u2014 moving quickly doesn't save time if it ends badly.",
          "And the fact that merging is easier when there's more to merge. Houses, routines, family, money. It happens faster and it's much harder to undo.",
        ],
      },
      {
        kind: "distinction",
        label: "What's worth keeping separate, longer than feels natural",
        body: [
          "Money and property. Obvious, frequently rushed, and the expensive one to get wrong.",
          "Your own place, if you have one, and your own week \u2014 the things that constitute the peace you'd be protecting.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Slower isn't a test of them and shouldn't be presented as one. It's about what you'd want to still have if it didn't work, which is a reasonable thing to attend to and has nothing to do with expecting it to fail.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READ ──
  {
    id: "lit-later-too-old",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cAm I too old to start over?\u201d",
    related: ["lit-later-whats-different", "lit-later-what-this-is"],
    body: [
      {
        kind: "paragraph",
        body: [
          "We're not going to answer that with encouragement, because encouragement about this is usually hollow and you'd know.",
        ],
      },
      {
        kind: "distinction",
        label: "What's actually true about it",
        body: [
          "Some things are harder. A smaller pool, more complicated lives, more that has to be accommodated rather than built together.",
          "Some things are easier. Knowing what you want, being able to say it, and not needing the relationship to supply everything.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cWill I ever find love again\u201d has no answer and nobody can give you one. What can be said is that it isn't a question about you \u2014 people with everything in their favour don't meet anyone, and people with none of it do.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know how to trust after everything I've experienced\u201d is the more workable version of the same worry, and it's a different question. Trust after experience isn't naivety restored \u2014 it's a decision made on evidence, which is available to you and wasn't available at twenty.",
        ],
      },
    ],
  },
];
