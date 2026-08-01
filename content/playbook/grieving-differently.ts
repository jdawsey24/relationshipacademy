/**
 * ADD-ON — "When You Grieve Differently"
 * Derived from Cluster 20: Infertility & Pregnancy Loss (10 statements).
 *
 * Track: Expansion. Core Need: TO BUILD PARTNERSHIP.
 * Two Plays, five literature entries — add-on scale.
 *
 * ⚠⚠ DELIBERATELY SCOPED TO THE RELATIONAL HALF. Owner-agreed 30 Jul 2026.
 *   Worked on: grieving differently, supporting each other, the relationship
 *   having changed, feeling alone in it, the question from other people.
 *   SIGNPOSTED AND NOT WORKED ON: "I don't know how to grieve what never
 *   happened", "my body has failed me", "every pregnancy announcement hurts",
 *   "I don't know how to have hope anymore", "I don't know how to move
 *   forward". Those belong to specialist support. **Do not extend the scope
 *   without clinical review.**
 *
 * ⚠ NO MEDICAL CONTENT. No causes, treatment, likelihood, or next steps. No
 *   assumption about whether they are still trying or have stopped, or what
 *   was lost.
 *
 * ⚠ NO ASSUMPTION ABOUT WHICH PARTNER THE READER IS, or whose body is involved.
 *
 * ⚠ NEVER SUGGEST AN ALTERNATIVE. No adoption, surrogacy, "there's still time".
 *   These are the most common unhelpful responses and they do not appear.
 *
 * ⚠ "MY BODY HAS FAILED ME" IS ACKNOWLEDGED ONCE, IN THE SIGNPOST, and left to
 *   people qualified to sit with it.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { ADDON_GRIEVING_DIFFERENTLY_LITERATURE } from "./grieving-differently-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const ADDON_GRIEVING_DIFFERENTLY: PlaybookContent = {
  playbookKey: "addon-grieving-differently",
  playbookVersion: 1,
  displayName: "When You Grieve Differently",

  opening: {
    title: "This is about the two of you",
    body: [
      "Not about the loss itself. That needs people who work with it. We'd rather say so plainly than give you something thinner.",
      "What's here is what has happened between you. The different ways you're each responding. The distance that's opened. And the questions from people who have no idea what they're asking.",
      "Nothing here suggests another option or has a view about what happens next.",
    ],
    manifestations: [
      "We don't grieve the same way.",
      "I don't know how to support my partner.",
      "I feel alone in this experience.",
      "I'm tired of everyone asking when we're having kids.",
    ],
    cta: "Start with the two ways of grieving",
  },

  recognitionCards: [
    {
      id: "rec-grievediff-alone",
      role: "validate",
      pathwayPlayId: null,
      headline: "I feel alone in this experience.",
      validationCopy:
        "This is often true even when both people are there. Being in the same house as someone who's grieving the same thing in a different way is its own kind of alone. It isn't evidence that either of you has pulled away. Both of you may be feeling it at the same time, about each other.",
      secondaryExamples: [
        "Our relationship feels different now.",
        "We don't grieve the same way.",
      ],
    },
    {
      id: "rec-grievediff-the-grief",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I don't know how to grieve what never happened.",
      validationCopy:
        "That one, and \u201cmy body has failed me\u201d, and the way an announcement can take a whole afternoon out of you — those are the heaviest parts of this. They need more than anything written for people in general can offer. One thing worth saying plainly, though: pregnancy or fertility loss is not evidence that you have failed. Fertility counsellors and pregnancy loss services are there for exactly this, and they can hold it far better than we could. We'd rather point you to them than half-help in the place where half-helping matters most. What's here is only the part about the two of you.",
      secondaryExamples: [
        "My body has failed me.",
        "Every pregnancy announcement hurts.",
        "I don't know how to have hope anymore.",
      ],
    },
    {
      id: "rec-grievediff-two-ways",
      role: "route",
      pathwayPlayId: "two-ways-of-grieving",
      headline: "We don't grieve the same way.",
      explanation:
        "Each of you may be misreading what the other's way means. And what each of you does can seem to prove the other right.",
      secondaryExamples: [
        "Our relationship feels different now.",
        "I feel alone in this experience.",
      ],
    },
    {
      id: "rec-grievediff-question",
      role: "route",
      pathwayPlayId: "the-question-from-other-people",
      headline: "I'm tired of everyone asking when we're having kids.",
      explanation:
        "The bracing costs more than the moment. Having a line ready mostly takes care of the bracing.",
      secondaryExamples: [
        "I don't know how to support my partner.",
      ],
    },
  ],

  plays: [
    {
      playId: "two-ways-of-grieving",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Two Ways of Grieving",
      positioning: "For what you've each decided about how the other is coping.",
      recognitionGate: {
        prompt: "Are the two of you responding to this very differently?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Grieving differently isn't the problem. What each of you decides about the other's way usually is.",
            "The one who talks about it hears the silence as not caring, or as having moved on.",
            "The one who doesn't hears the talking as not being able to let it rest. And that person often stays quiet on purpose, to avoid making it worse.",
            "Each of you is often reading the other without enough to go on. And both of you are acting reasonably, given what you each think is happening.",
          ],
        },
        {
          kind: "learn",
          body: [
            "That's why it builds. Each response seems to prove the other right, so neither of you ever gets to find out you were wrong.",
            "\u201cI don't know how to support my partner\u201d is often said by both people, about each other, at the same time. Most of us support someone the way we'd want to be supported. So when two people need different things, each one offers something the other doesn't want. And both are hurt that the offer wasn't taken.",
            "Nothing here says you should grieve the same way, or that one of you should change.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "What have you each decided? Be honest about the second one. It's usually less kind than we'd like.",
          fields: [
            {
              id: "my-way",
              label: "How are you carrying it?",
              input: "chips",
              suggestions: [
                "Wanting to talk about it",
                "Not wanting to talk about it",
                "Keeping busy",
                "It comes in waves",
                "I don't know",
              ],
            },
            {
              id: "their-way",
              label: "And how are they?",
              input: "text",
              placeholder: "What you can actually see, not what you think it means.",
            },
            {
              id: "what-i-concluded",
              label: "What have you decided from their way?",
              input: "text",
              placeholder: "Honestly. Most people find it isn't kind.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Have either of you asked the other what they'd actually want when it's bad?",
          enoughLabel: "Yes, directly",
          needMoreLabel: "No \u2014 we've each guessed it",
          needMoreIntro:
            "Almost nobody has. \u201cHow are you\u201d gets you \u201cfine\u201d. Everything else has been guessed from behaviour that both of you are misreading.",
          needToKnowLabel: "What I'd want them to do when it's bad",
          observableLabel: "Something specific they could actually do",
        },
        {
          kind: "output",
          heading: "Two ways, and what we each made of them",
          body:
            "Not a problem to line up. What you've each decided is the part that can change.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Grieving differently isn't the problem. What we decide about it is.",
            "We're each offering what we'd want, and neither of us wants it.",
            "Both of us may be feeling alone, about each other, at the same time.",
          ],
        },
      ],
      portable: [
        "Grieving differently isn't the problem. What we decide about it is.",
        "We're each offering what we'd want, and neither of us wants it.",
        "Both of us may be feeling alone, about each other, at the same time.",
      ],
      myPlaysTemplate: {
        when: "When we're responding to this very differently",
        move: "Name what I've decided from their way, and check it",
        lookingFor: "Whether either of us has actually asked what the other wants",
        watchOut: "Treating the difference as something to line up",
        remember: "They may be staying quiet on purpose, to avoid making it worse.",
      },
      fidelity: {
        correct:
          "Each person's way of grieving is described by what can be seen, and the reader's own conclusion about the other's way is named and marked as a guess.",
        misuse: [
          "Using it to prove they're grieving wrongly.",
          "Setting a goal of grieving the same way.",
          "Treating a difference in how it shows as a difference in what's felt.",
        ],
        notMeaning:
          "It does not mean the difference goes away, that either of you will change, or that you can support each other well through this.",
      },
      supportSignposts: [
        {
          id: "signpost-grievediff-outside",
          heading: "You may not be able to do this for each other",
          body:
            "Two people grieving the same loss are both worn down, and sometimes the support has to come from outside. That isn't a failure of the relationship. A fertility counsellor or a pregnancy loss service can hold what neither of you may have to spare right now. For some couples, that eases the pressure rather than adding a problem.",
        },
      ],
    },

    {
      playId: "the-question-from-other-people",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Question From Other People",
      positioning:
        "For the thing people keep asking. You agree on the line together, and then you have it ready.",
      recognitionGate: {
        prompt: "Do you brace for the question before social occasions?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A small thing that lands hard, repeatedly, from people who have no idea what they're asking.",
            "There are two costs. The moment itself. And the bracing — once it's happened a few times, you weigh whole occasions ahead of time for whether it'll come up.",
            "The second one is the more tiring of the two, and it's the one you can do something about.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Having a line ready mostly takes care of the bracing. Not because the answer matters, but because knowing what you'll say removes the need to brace.",
            "It's also worth agreeing with each other what gets said, and to whom. Couples often get caught out when one has told someone and the other didn't know. That's a small thing, but it lands as a betrayal when everything is already raw.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Where does it come up, and who from?",
          fields: [
            {
              id: "where",
              label: "Where does the question tend to come up?",
              input: "chips",
              suggestions: [
                "Family gatherings",
                "Work",
                "Friends with children",
                "Casual acquaintances",
                "Everywhere",
              ],
            },
            {
              id: "who-knows",
              label: "Who knows right now, and do you both agree on that list?",
              input: "text",
              placeholder:
                "This is the one couples get caught out by. Worth checking.",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The line, for people who don't know",
          helper:
            "Short, and only as much as you want to give. You might say \u201cIt's not on the cards right now\u201d, or \u201cThat's a harder question than you'd think \u2014 let's talk about something else\u201d, or something that closes it without explaining anything.",
        },
        {
          kind: "realWorldUse",
          useWhen:
            "Before the next time it's likely to come up — and after you've agreed with your partner what gets said.",
          doThis:
            "Use the line and change the subject. You owe nobody an explanation, and their discomfort at a closed answer is theirs to handle, not yours.",
        },
        {
          kind: "output",
          heading: "The line, and who knows",
          body:
            "Removes the bracing, which costs more than the moment does.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The bracing costs more than the question.",
            "Agree who knows. That's the one couples get caught out by.",
            "Their discomfort at a closed answer is theirs to handle.",
          ],
        },
      ],
      portable: [
        "The bracing costs more than the question.",
        "Agree who knows. That's the one couples get caught out by.",
        "Their discomfort at a closed answer is theirs to handle.",
      ],
      myPlaysTemplate: {
        when: "When I'm bracing for the question before social occasions",
        move: "Agree a line together, and agree who knows",
        lookingFor: "Whether having it ready removes the bracing",
        watchOut: "Assuming we agree on who's been told",
        remember: "I owe nobody an explanation.",
      },
      fidelity: {
        correct:
          "A ready-made answer is agreed on, and the list of who knows is checked between both partners.",
        misuse: [
          "Choosing a line that gives more than you wanted to give.",
          "Deciding it alone when it affects both of you.",
          "Treating the need for a line as evidence of not coping.",
        ],
        notMeaning:
          "It does not mean the question stops hurting, that people stop asking, or that you owe anyone anything.",
      },
    },
  ],

  literature: ADDON_GRIEVING_DIFFERENTLY_LITERATURE,

  missions: [
    {
      id: "mission-grievediff-ask",
      version: 1,
      playId: "two-ways-of-grieving",
      title: "Ask what they'd want when it's bad",
      instruction:
        "Not \u201chow are you\u201d. Ask what they'd actually want you to do on a bad day \u2014 and tell them yours.",
      linkToOperation: "Asking for a partner's support preference rather than guessing it",
      attemptMeaning:
        "You asked. Finding out it's different from what you've been offering is the point.",
      suitability:
        "If neither of you has anything left for this, that's a fair answer. It's what the outside-support signpost is for.",
      progression: [
        {
          id: "rung-grievediff-ask-2",
          instruction: "Say what you've been deciding from their way, and check it.",
        },
      ],
    },
    {
      id: "mission-grievediff-line",
      version: 1,
      playId: "the-question-from-other-people",
      title: "Agree the list of who knows",
      instruction:
        "Check with each other who has been told what. Most couples find the lists don't match.",
      linkToOperation: "Getting partners to agree on who's been told",
      attemptMeaning:
        "You checked. A mismatch you find now costs much less than one you find later.",
      suitability:
        "Do this when nothing's coming up soon, not on the way to a family gathering.",
      progression: [
        {
          id: "rung-grievediff-line-2",
          instruction: "Agree who, if anyone, you'd want to tell next.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-grievediff-ask",
      version: 1,
      playId: "two-ways-of-grieving",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Described their way without reading into it",
          "Named what I'd decided",
          "Asked what they'd actually want",
          "Assumed I knew",
        ],
      },
      performedOperation: {
        label: "Did you name what you'd decided and check it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I'd misread what their way meant",
          "That they'd misread mine",
          "That we want different things",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "They wouldn't talk about it",
          "Asking made it worse",
          "Neither of us has anything left",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-grievediff-line",
      version: 1,
      playId: "the-question-from-other-people",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Agreed a line together",
          "Checked who knows",
          "Used it and changed the subject",
          "Answered fully again",
        ],
      },
      performedOperation: {
        label: "Did you agree a line and check who knows?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the lists didn't match",
          "That having it ready removes the bracing",
          "How much I'd been bracing for it",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "We disagreed about who should know",
          "The line didn't hold in the moment",
          "Someone pushed for more",
          "Nothing stuck",
        ],
      },
    },
  ],
};
