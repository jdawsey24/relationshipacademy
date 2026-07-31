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

export const ADDON_GRIEVING_DIFFERENTLY: PlaybookContent = {
  playbookKey: "addon-grieving-differently",
  playbookVersion: 1,
  displayName: "When You Grieve Differently",

  opening: {
    title: "This is about the two of you",
    body: [
      "Not about the loss itself. That needs people who work with it, and we'd rather say so plainly than offer you something thinner.",
      "What's here is what has happened between you — the different ways you're each responding, the distance that's opened, and the questions from people who have no idea what they're asking.",
      "Nothing here suggests an alternative or has a view about what happens next.",
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
        "Often true even when both people are present. Being in the same house as someone grieving the same thing differently is a specific kind of alone, and it isn't evidence that either of you has withdrawn. Both of you may be feeling it at the same time, about each other.",
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
        "That, and \u201cmy body has failed me\u201d, and the way an announcement can take an afternoon out of you — those are the heaviest parts of this and they need more than anything written generally can offer. Fertility counsellors and pregnancy loss services exist specifically for it, and they are considerably better at it than we would be. We'd rather point you there than half-help in the place where half-helping matters most. What's here is only the part about the two of you.",
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
        "Both of you are usually wrong about what the other's way means — and each response confirms the other's reading.",
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
        "The anticipation costs more than the moment. Having a line ready mostly addresses the anticipation.",
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
      positioning: "For what you've each concluded from how the other is coping.",
      recognitionGate: {
        prompt: "Are the two of you responding to this very differently?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Grieving differently isn't the problem. What each of you concludes from the other's way usually is.",
            "The one who talks about it hears the silence as not caring, or as having moved on.",
            "The one who doesn't hears the talking as being unable to let it rest — and often stays quiet specifically to avoid making it worse.",
            "Both are usually wrong, and both are behaving reasonably given what they think is happening.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Which is why it compounds. Each response confirms the other's reading, and neither of you gets to find out you were wrong.",
            "\u201cI don't know how to support my partner\u201d is often said by both people about each other at the same time. Most people support someone the way they'd want to be supported — so when two people need different things, both are offering something the other doesn't want, and both are hurt the offer wasn't taken.",
            "Nothing here suggests you grieve the same way, or that one of you should adjust.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "What have you each concluded? Be honest about the second one — it's usually less generous than we'd like.",
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
              placeholder: "What you can actually observe, not what you assume it means.",
            },
            {
              id: "what-i-concluded",
              label: "What have you concluded from their way?",
              input: "text",
              placeholder: "Honestly. Most people find it isn't generous.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Have either of you asked the other what they'd actually want when it's bad?",
          enoughLabel: "Yes, directly",
          needMoreLabel: "No \u2014 we've each inferred it",
          needMoreIntro:
            "Almost nobody has. \u201cHow are you\u201d produces \u201cfine\u201d, and everything else has been guessed from behaviour that both of you are misreading.",
          needToKnowLabel: "What I'd want them to do when it's bad",
          observableLabel: "Something specific they could actually do",
        },
        {
          kind: "output",
          heading: "Two ways, and what we each made of them",
          body:
            "Not a problem to align. The conclusions are the part that can change.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Grieving differently isn't the problem. What we conclude from it is.",
            "We're each offering what we'd want, and neither of us wants it.",
            "Both of us may be feeling alone, about each other, at the same time.",
          ],
        },
      ],
      portable: [
        "Grieving differently isn't the problem. What we conclude from it is.",
        "We're each offering what we'd want, and neither of us wants it.",
        "Both of us may be feeling alone, about each other, at the same time.",
      ],
      myPlaysTemplate: {
        when: "When we're responding to this very differently",
        move: "Name what I've concluded from their way, and check it",
        lookingFor: "Whether either of us has actually asked what the other wants",
        watchOut: "Treating the difference as something to be aligned",
        remember: "They may be staying quiet specifically to avoid making it worse.",
      },
      fidelity: {
        correct:
          "Each person's way of grieving is described observationally, and the reader's own conclusion about the other's way is named and identified as an inference.",
        misuse: [
          "Using it to establish that they're grieving wrongly.",
          "Setting a goal of grieving the same way.",
          "Treating a difference in expression as a difference in feeling.",
        ],
        notMeaning:
          "It does not mean the difference resolves, that either of you will change, or that you can support each other well through this.",
      },
      supportSignposts: [
        {
          id: "signpost-grievediff-outside",
          heading: "You may not be able to do this for each other",
          body:
            "Two people grieving the same loss are both depleted, and sometimes the support has to come from outside. That isn't a failure of the relationship — it's arithmetic. A fertility counsellor or a pregnancy loss service can hold what neither of you currently has spare, and couples who use one often find it takes pressure off rather than adding a problem.",
        },
      ],
    },

    {
      playId: "the-question-from-other-people",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Question From Other People",
      positioning:
        "For the thing people keep asking. You agree the line together — then you have it ready.",
      recognitionGate: {
        prompt: "Do you brace for the question before social occasions?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A small thing that lands hard, repeatedly, from people who have no idea what they're asking.",
            "There are two costs. The moment itself. And the anticipation — once it's happened a few times, whole occasions get weighed in advance for whether it'll come up.",
            "The second is the more tiring one, and it's the one that's addressable.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Having a line ready mostly addresses the anticipation. Not because the answer matters, but because knowing what you'll say removes the need to brace.",
            "It's also worth agreeing with each other what gets said, and to whom. Couples are frequently caught out by one having told someone and the other not knowing — a small thing that lands as a betrayal when everything is already raw.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Where does it come up, and who from?",
          fields: [
            {
              id: "where",
              label: "Where does the question tend to arrive?",
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
              label: "Who currently knows, and do you both agree on that list?",
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
            "Short, and only as much as you want to give. You might use \u201cIt's not on the cards at the moment\u201d, or \u201cThat's a harder question than you'd think \u2014 let's talk about something else\u201d, or something that closes it without explaining anything.",
        },
        {
          kind: "realWorldUse",
          useWhen:
            "Before the next occasion where it's likely — and after you've agreed with your partner what gets said.",
          doThis:
            "Use the line and change the subject. You owe nobody an explanation, and their discomfort at a closed answer is theirs to manage rather than yours.",
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
            "The anticipation costs more than the question.",
            "Agree who knows. That's the one couples get caught out by.",
            "Their discomfort at a closed answer is theirs to manage.",
          ],
        },
      ],
      portable: [
        "The anticipation costs more than the question.",
        "Agree who knows. That's the one couples get caught out by.",
        "Their discomfort at a closed answer is theirs to manage.",
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
          "A prepared response is agreed, and the list of who knows is checked between both partners.",
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
      linkToOperation: "Eliciting a partner's support preference rather than inferring it",
      attemptMeaning:
        "You asked. Finding out it's different from what you've been offering is the point.",
      suitability:
        "If neither of you has anything left for this, that's a fair answer and it's what the outside-support signpost is for.",
      progression: [
        {
          id: "rung-grievediff-ask-2",
          instruction: "Say what you've been concluding from their way, and check it.",
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
      linkToOperation: "Aligning disclosure between partners",
      attemptMeaning:
        "You checked. A mismatch found now is much cheaper than one found later.",
      suitability:
        "Do this when nothing is imminent, not on the way to a family gathering.",
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
          "Described their way without interpreting it",
          "Named what I'd concluded",
          "Asked what they'd actually want",
          "Assumed I knew",
        ],
      },
      performedOperation: {
        label: "Did you name your conclusion and check it?",
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
          "They wouldn't engage with it",
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
        label: "Did you agree a line and check the disclosure list?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the lists didn't match",
          "That having it ready removes the bracing",
          "How much I'd been anticipating it",
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
