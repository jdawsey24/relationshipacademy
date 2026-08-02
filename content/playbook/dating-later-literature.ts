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

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
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
          "\u201cI never thought I'd be dating at this age.\u201d Most of what's written for people who date assumes someone right at the start — with time, few commitments, and no long history behind them.",
          "That fits almost nobody doing this later. That gap is most of why the advice out there reads like it was written for someone else.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things have changed, and they often get mixed up",
        body: [
          "The mechanics. How people meet, what's expected, the pace. Really different now, and something you can learn.",
          "You. A settled life, knowing what you like, less patience for what doesn't work. Also really different, and mostly an advantage.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here says how it will go or promises you'll meet someone. What it can do is keep the two kinds of change from being treated as one problem.",
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
          "Both are true. It's worth pulling apart what's changed out there from what's changed in you, because they need different answers.",
        ],
      },
      {
        kind: "list",
        label: "Changed out there",
        items: [
          "Where people meet, and how much of it happens on a screen before anyone is in a room.",
          "The pace, which is often faster at the start and slower to actually go anywhere.",
          "The sheer number \u2014 more options, and less real attention on any one of them.",
          "Less shared background. People show up with histories you can't see.",
        ],
      },
      {
        kind: "list",
        label: "Changed in you",
        items: [
          "You know what you want, which most people at the start don't.",
          "You have a life, which changes what a relationship has to carry.",
          "Less patience for what doesn't work, which is being efficient, not rigid.",
          "More to protect, and more to lose by joining your lives carelessly.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "The first list is a learning problem, and it's smaller than it feels. The second isn't a problem at all. People often call it one, though \u2014 usually people who'd be better off if you had less of it.",
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
          "\u201cI don't know how to balance protecting my peace with opening my heart.\u201d This is the clearest way to name the real difficulty. It's a true tension, not a mix-up to be cleared up.",
        ],
      },
      {
        kind: "distinction",
        label: "Why it doesn't go away",
        body: [
          "Both are good things. The peace was hard to win, and losing it would be a real loss. And nothing worth having comes without opening yourself up a little.",
          "Advice usually picks a side \u2014 be more open, or protect yourself \u2014 and each side is wrong about half the time.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "It helps more to treat this as a rate, not a decision. Not open or closed \u2014 but how fast, about what, and with the freedom to slow down without ending anything.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI enjoy my independence, but I miss companionship\u201d isn't a contradiction, and it doesn't mean you have to choose. Plenty of people build lives that hold both, and those setups are less traditional than the ones on offer earlier in life.",
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
          "\u201cI don't want to merge my life with someone too quickly.\u201d Sensible. And worth noticing that merging is easier to do later, not harder.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Two pressures push you to hurry. One is \u201cI don't want to waste time\u201d. That's often true about the years, but not about the pace \u2014 moving fast doesn't save time if it ends badly.",
          "The other is that merging is easier when there's more to merge. Houses, routines, family, money. It happens faster, and it's much harder to undo.",
        ],
      },
      {
        kind: "distinction",
        label: "What's worth keeping separate, longer than feels natural",
        body: [
          "Money and property. Obvious, often rushed, and the costly one to get wrong.",
          "Your own place, if you have one, and your own week \u2014 the things that make up the peace you'd be protecting.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Going slower isn't a test of them, and shouldn't be presented as one. It's about what you'd want to still have if it didn't work out. That's a fair thing to look after, and it has nothing to do with expecting it to fail.",
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
          "We're not going to answer that with a pep talk. A pep talk about this usually rings empty, and you'd know it.",
        ],
      },
      {
        kind: "distinction",
        label: "What's actually true about it",
        body: [
          "Some things are harder. Fewer people to meet, more tangled lives, and more that has to be worked around instead of built together.",
          "Some things are easier. Knowing what you want, being able to say it, and not needing the relationship to give you everything.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "\u201cWill I ever find love again\u201d has no answer, and nobody can give you one. What can be said is that it isn't a question about you. People who have everything going for them don't meet anyone, and people who have none of it do.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cI don't know how to trust after everything I've experienced\u201d is the more workable version of the same worry, and it's a different question. Trust after all you've been through isn't going back to being naive. It's a choice you make based on evidence. That evidence is there for you now, and it wasn't there at twenty.",
        ],
      },
    ],
  },
];
