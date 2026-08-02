/**
 * ADD-ON — "When Care Becomes the Relationship"
 * Derived from Cluster 20: Caregiving (10 statements).
 * Field Guide literature. 4 Core Guides + 1 Question Read. (Add-on scale.)
 *
 * Track: Expansion. Core Need: TO BUILD PARTNERSHIP.
 *
 * ⚠ ADD-ON, NOT A PLAYBOOK. Not quiz-detectable — reached by signpost from a
 *   Playbook, or from a life-situation menu. `addon-` prefix on playbookKey.
 *
 * ⚠ PAIRED WITH `addon-living-with-illness`. These are the same situation from
 *   two sides: this one is the person providing care, the other is the person
 *   receiving it. Deliberately built as a pair, and each routes to the other —
 *   a couple may well be reading both.
 *
 * ⚠ NOT MEDICAL OR CARE-PRACTICAL GUIDANCE. Nothing here advises on care
 *   provision, benefits, respite services, or clinical decisions. Those have
 *   specialists and this is not one.
 *
 * ⚠ THE EXHAUSTION IS NOT A FAILURE OF LOVE. "I love them, but I'm overwhelmed"
 *   is the central sentence and both halves are true simultaneously. Nothing
 *   may treat the second half as evidence against the first.
 *
 * ⚠ NO SUGGESTION THAT THEY SHOULD LEAVE, or that the caring is a mistake.
 *   Equally, no suggestion that continuing is obligatory.
 *
 * ⚠ CLAIM SCOPE. May claim: separate the caring from the partnership; notice
 *   what the guilt about resting assumes; ask for one specific thing. MUST NOT
 *   CLAIM: that the partnership can be restored, that help is available, that
 *   respite fixes exhaustion, or anything about the illness or its course.
 */

import type { LiteratureEntry } from "@/lib/playbook/contentSchema";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const ADDON_CAREGIVING_LITERATURE: LiteratureEntry[] = [
  {
    id: "lit-care-what-this-is",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "What this is for",
    related: ["lit-care-two-relationships", "lit-care-guilt"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cOur relationship has become more about caregiving than partnership.\u201d That's the sentence, and it's usually said quietly because saying it feels like a complaint about someone who is ill.",
          "It isn't. It's a true description of a change in how things are set up \u2014 a change that happened to both of you.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that are both true",
        body: [
          "You love them. That's not in doubt, and it's why this is hard rather than simple.",
          "You are overwhelmed. That's also not in doubt, and it isn't evidence against the first.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is advice on how to give care, benefits, respite services, or anything clinical. Those things have experts, and this isn't one. This is about what has happened to the relationship underneath the caring.",
        ],
      },
    ],
  },

  {
    id: "lit-care-two-relationships",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Two relationships, one person",
    related: ["lit-care-what-this-is", "lit-care-alone"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI miss the relationship we used to have.\u201d \u201cI don't know how to balance love and responsibility.\u201d",
          "What's happened is that two relationships now run through the same person. And one of them has to come first.",
        ],
      },
      {
        kind: "distinction",
        label: "They need different things",
        body: [
          "The caring one is built around need. It doesn't go both ways, it doesn't take turns, and it doesn't stop when either of you is tired.",
          "The partnership was built on give-and-take. It needed two people with something to spare.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "That's why the partnership fades rather than ends \u2014 there's rarely anything to spare. Not because either of you stopped wanting it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cNobody prepared us for this season\u201d is true. Almost nobody is prepared, there's very little written about it, and what does exist is mostly about the practical side, not the relationship side.",
        ],
      },
    ],
  },

  {
    id: "lit-care-guilt",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "The guilt about wanting a break",
    related: ["lit-care-what-this-is", "lit-care-asking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel guilty wanting a break.\u201d \u201cI'm exhausted.\u201d",
          "The guilt usually rests on a comparison: they didn't choose to be ill, and you're tired of helping. Put that way it seems obvious who has the right to complain.",
        ],
      },
      {
        kind: "distinction",
        label: "Why the comparison doesn't hold up",
        body: [
          "Their struggle being bigger doesn't make yours zero. The two aren't on the same scale, and one doesn't cancel out the other.",
          "And wanting a break isn't wanting them to be different. It's wanting to be less worn down. That's a fact about how much you have left, not about them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's also a practical point. Being worn down doesn't get better with guilt \u2014 it gets better with rest. A carer who doesn't rest gets worse at caring, which helps nobody, including the person being cared for.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of this says that rest is available. For a lot of people it truly isn't, or not much. Knowing that the wanting is fair is a smaller thing than getting the break — and it's sometimes all that's on offer.",
        ],
      },
    ],
  },

  {
    id: "lit-care-alone",
    version: 1,
    scope: "cluster",
    depth: "core",
    title: "Alone while together",
    related: ["lit-care-two-relationships", "lit-care-asking"],
    body: [
      {
        kind: "paragraph",
        body: [
          "\u201cI feel alone even though we're together.\u201d One of the loneliest parts, and it's rarely said because it sounds like a complaint about them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Some of it is about how things are set up. The person you'd normally talk to about something hard is the hard thing, which shuts off the usual way.",
          "Some of it is that carers become invisible. People ask how the ill person is. Almost nobody asks how you are, and the ones who do often want a short answer.",
        ],
      },
      {
        kind: "distinction",
        label: "Which changes what would help",
        body: [
          "Not more support for them, though that helps with the load.",
          "Someone whose relationship with you isn't built around the illness \u2014 who asks about something else, or who lets you say the thing you can't say out loud, without having to manage your guilt about saying it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Carers' groups exist for exactly this, and people are often reluctant because they think others have it worse. Mostly they don't, and that isn't the entry requirement.",
        ],
      },
    ],
  },

  // ────────────────────────────────────────────── QUESTION READ ──
  {
    id: "lit-care-asking",
    version: 1,
    scope: "cluster",
    depth: "question",
    title: "\u201cI don't know how to ask for help\u201d",
    related: ["lit-care-guilt", "lit-care-alone"],
    body: [
      {
        kind: "paragraph",
        body: [
          "Very common among carers, and it usually isn't about pride. It's more often about being specific.",
        ],
      },
      {
        kind: "distinction",
        label: "Why the general offer never turns into help",
        body: [
          "\u201cLet me know if you need anything\u201d puts the work on you \u2014 you have to name a task, decide if it's fair to ask, and then ask. That's three jobs on top of the one you already have.",
          "\u201cCould you sit with him Thursday afternoon?\u201d is one job for them and none for you afterwards.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So the thing that turns offers into help is having a specific request ready before anyone offers. Most people who offer mean it, and they're waiting to be told what.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some people offer and don't mean it, and finding that out hurts. But it's also information, and it's cheaper to learn early than to find out during a crisis.",
        ],
      },
    ],
  },
];
