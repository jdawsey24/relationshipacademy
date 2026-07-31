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
          "It isn't. It's an accurate description of a structural change that happened to both of you.",
        ],
      },
      {
        kind: "distinction",
        label: "Two things that are both true",
        body: [
          "You love them. Not in question, and it's why this is hard rather than simple.",
          "You are overwhelmed. Also not in question, and it isn't evidence against the first.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Nothing here is guidance on providing care, benefits, respite services, or anything clinical. Those have specialists and this isn't one. This is about what has happened to the relationship underneath the caring.",
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
          "What's happened is that two relationships are now running through the same person, and one of them takes precedence by necessity.",
        ],
      },
      {
        kind: "distinction",
        label: "They have different requirements",
        body: [
          "The caring one is organised around need. It's not reciprocal, it doesn't take turns, and it doesn't stop when either of you is tired.",
          "The partnership was organised around mutuality. It required two people with something spare.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Which is why the partnership recedes rather than ending \u2014 there's rarely anything spare. Not because either of you stopped wanting it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "\u201cNobody prepared us for this season\u201d is accurate. Almost nobody is prepared, there's very little written for it, and the material that exists is mostly practical rather than relational.",
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
        label: "Why the comparison doesn't hold",
        body: [
          "Their difficulty being larger doesn't make yours zero. Those aren't on the same scale and one doesn't cancel the other.",
          "And wanting a break isn't wanting them to be different. It's wanting to be less depleted, which is a fact about capacity rather than about them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "There's also a practical point. Depletion doesn't respond to guilt \u2014 it responds to rest. A carer who doesn't rest becomes worse at caring, which serves nobody, including the person being cared for.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "None of this is a claim that rest is available. For a lot of people it genuinely isn't, or not much. Knowing that the wanting is legitimate is a smaller thing than getting the break, and it's sometimes all that's on offer.",
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
          "\u201cI feel alone even though we're together.\u201d One of the more isolating parts, and it's rarely said because it sounds like a complaint about them.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "Some of it is structural. The person you'd normally talk to about something difficult is the difficult thing, which closes the usual route.",
          "Some of it is that carers become invisible. People ask how the ill person is. Almost nobody asks how you are, and the ones who do often want a short answer.",
        ],
      },
      {
        kind: "distinction",
        label: "Which changes what would help",
        body: [
          "Not more support for them, though that helps with the load.",
          "Someone whose relationship with you isn't organised around the illness \u2014 who asks about something else, or who lets you say the unspeakable thing without managing your guilt about saying it.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Carers' groups exist for exactly this and people are often reluctant, on the grounds that others have it worse. They generally don't, and that isn't the entry requirement.",
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
          "Very common among carers, and it usually isn't about pride. It's more often about specificity.",
        ],
      },
      {
        kind: "distinction",
        label: "Why the general offer never converts",
        body: [
          "\u201cLet me know if you need anything\u201d puts the work on you \u2014 you have to identify a task, judge whether it's reasonable, and ask. That's three jobs on top of the one you already have.",
          "\u201cCould you sit with him Thursday afternoon?\u201d is one job for them and none for you afterwards.",
        ],
      },
      {
        kind: "paragraph",
        body: [
          "So the thing that converts offers into help is having a specific request ready before anyone offers. Most people who offer mean it and are waiting to be told what.",
        ],
      },
      {
        kind: "guardrail",
        body: [
          "Some people offer and don't mean it, and finding that out is unpleasant. It's also information, and it's cheaper to have early than to discover during a crisis.",
        ],
      },
    ],
  },
];
