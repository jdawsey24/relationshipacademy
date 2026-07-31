/**
 * ADD-ON — "When Care Becomes the Relationship"
 * Derived from Cluster 20: Caregiving (10 statements).
 *
 * Track: Expansion. Core Need: TO BUILD PARTNERSHIP.
 * Two Plays, five literature entries — add-on scale.
 *
 * ⚠ ADD-ON. Not quiz-detectable. Reached by signpost or a life-situation menu.
 *
 * ⚠ PAIRED WITH `addon-living-with-illness` — the same situation from the other
 *   side. Each routes to the other via a recognition card; a couple may be
 *   reading both.
 *
 * ⚠ NOT MEDICAL OR CARE-PRACTICAL GUIDANCE.
 *
 * ⚠ "I love them, but I'm overwhelmed" — both halves true simultaneously.
 *   Nothing may treat the second as evidence against the first.
 *
 * ⚠ NO SUGGESTION THAT THEY SHOULD LEAVE, and none that continuing is
 *   obligatory.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { ADDON_CAREGIVING_LITERATURE } from "./caregiving-literature";

export const ADDON_CAREGIVING: PlaybookContent = {
  playbookKey: "addon-caregiving",
  playbookVersion: 1,
  displayName: "When Care Becomes the Relationship",

  opening: {
    title: "Two things that are both true",
    body: [
      "You love them. And you are overwhelmed. The second isn't evidence against the first, though it's usually carried as though it were.",
      "What's happened is structural: two relationships now run through the same person, and one of them takes precedence by necessity.",
      "Nothing here is guidance on care, benefits, or anything clinical. Those have specialists. This is about what happened to the relationship underneath.",
    ],
    manifestations: [
      "Our relationship has become more about caregiving than partnership.",
      "I feel guilty wanting a break.",
      "I feel alone even though we're together.",
      "I love them, but I'm overwhelmed.",
    ],
    cta: "Start with what changed",
  },

  recognitionCards: [
    {
      id: "rec-care-overwhelmed",
      role: "validate",
      pathwayPlayId: null,
      headline: "I love them, but I'm overwhelmed.",
      validationCopy:
        "Both halves are true at once, and the guilt usually rests on a comparison — they didn't choose to be ill, and you're tired of helping. But their difficulty being larger doesn't make yours zero; those aren't on the same scale. And wanting a break isn't wanting them to be different. It's a fact about capacity.",
      secondaryExamples: [
        "I'm exhausted.",
        "I feel guilty wanting a break.",
        "Nobody prepared us for this season.",
      ],
    },
    {
      id: "rec-care-other-side",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I'm the one who's ill, not the one caring.",
      validationCopy:
        "Then this is written from the wrong side. There's a companion piece for the person living with the illness — about feeling like a burden, about not wanting them to feel trapped, about staying connected when everything has changed. That's the one for you. If you're both reading, reading each other's is often more useful than reading your own.",
      secondaryExamples: [
        "I feel like a burden.",
        "I don't want them to feel trapped.",
        "I miss who I used to be.",
      ],
    },
    {
      id: "rec-care-miss-it",
      role: "route",
      pathwayPlayId: "the-two-relationships",
      headline: "I miss the relationship we used to have.",
      explanation:
        "The partnership recedes rather than ending. It required two people with something spare, and there rarely is any.",
      secondaryExamples: [
        "Our relationship has become more about caregiving than partnership.",
        "I don't know how to balance love and responsibility.",
        "I don't know how to care for them without losing myself.",
      ],
    },
    {
      id: "rec-care-alone",
      role: "route",
      pathwayPlayId: "one-specific-ask",
      headline: "I don't know how to ask for help.",
      explanation:
        "Usually not about pride. \u201cLet me know if you need anything\u201d puts three jobs on you. A specific request is one job for them.",
      secondaryExamples: [
        "I feel alone even though we're together.",
        "I'm exhausted.",
      ],
    },
  ],

  plays: [
    {
      playId: "the-two-relationships",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Two Relationships",
      positioning: "For the partnership that receded without either of you choosing it.",
      recognitionGate: {
        prompt: "Has the caring taken over the space the relationship used to occupy?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Two relationships are now running through the same person, and one takes precedence by necessity.",
            "The caring one is organised around need — not reciprocal, doesn't take turns, doesn't stop when either of you is tired.",
            "The partnership was organised around mutuality. It required two people with something spare, and there rarely is any.",
            "Which is why it recedes rather than ends. Not because either of you stopped wanting it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Naming that separation does something specific: it stops the receding being read as a verdict on the relationship, or on either of you.",
            "It also makes a smaller question available. Not \u201chow do we get the partnership back\u201d, which usually isn't answerable while the caring load is what it is. But: is there anything left of it that doesn't require spare capacity?",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Be concrete. Small things count more here than large ones.",
          fields: [
            {
              id: "what-went",
              label: "What has the caring taken over?",
              input: "chips",
              suggestions: [
                "Time alone together",
                "Talking about anything else",
                "Physical affection",
                "Being looked after myself",
                "Plans and future talk",
                "Laughing about things",
              ],
            },
            {
              id: "whats-left",
              label: "Is there anything of the partnership that survives?",
              input: "text",
              placeholder:
                "It's usually something very small. A joke, ten minutes, one habit.",
            },
            {
              id: "requires-spare",
              label: "Does that thing require spare capacity, or does it fit inside the day?",
              input: "chips",
              suggestions: [
                "Fits inside the day",
                "Needs a bit of energy",
                "Needs a lot",
                "There isn't anything",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is the receding being read as a verdict on the relationship?",
          enoughLabel: "No \u2014 it's the situation",
          needMoreLabel: "Sometimes, yes",
          needMoreIntro:
            "Very common, and it adds a second weight to the first. The partnership receding under this load isn't information about how you feel about each other.",
          needToKnowLabel: "What I'd want them to know about that",
          observableLabel: "Something small I could say",
        },
        {
          kind: "output",
          heading: "What's receded, and what's left",
          body:
            "The partnership requiring spare capacity is why it went. That isn't a verdict on it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Two relationships, one person. One takes precedence by necessity.",
            "It receded because there's nothing spare, not because we stopped wanting it.",
            "The small thing that fits inside the day is worth more than the large one that doesn't.",
          ],
        },
      ],
      portable: [
        "Two relationships, one person. One takes precedence by necessity.",
        "It receded because there's nothing spare, not because we stopped wanting it.",
        "The small thing that fits inside the day is worth more than the large one that doesn't.",
      ],
      myPlaysTemplate: {
        when: "When the caring has taken the space the relationship used to have",
        move: "Separate the caring relationship from the partnership, and find what survives",
        lookingFor: "Something that fits inside the day rather than needing spare capacity",
        watchOut: "Reading the receding as a verdict on how we feel about each other",
        remember: "Nobody prepared us for this. That's accurate rather than a failing.",
      },
      fidelity: {
        correct:
          "The caring relationship and the partnership are named separately, and any surviving element is identified by whether it fits within existing capacity.",
        misuse: [
          "Using it to build a case that the relationship is over.",
          "Setting a goal of restoring the partnership while the load is unchanged.",
          "Treating the receding as either person's fault.",
        ],
        notMeaning:
          "It does not mean the partnership returns, that anything survives, or that naming it reduces the load.",
      },
    },

    {
      playId: "one-specific-ask",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "One Specific Ask",
      positioning:
        "For converting offers into help. You prepare the ask — then you use it.",
      recognitionGate: {
        prompt: "Do people offer to help and nothing ever comes of it?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't know how to ask for help\u201d usually isn't about pride. It's about specificity.",
            "\u201cLet me know if you need anything\u201d puts the work on you — identify a task, judge whether it's reasonable, then ask. That's three jobs on top of the one you already have.",
            "\u201cCould you sit with him Thursday afternoon?\u201d is one job for them and none for you afterwards.",
          ],
        },
        {
          kind: "learn",
          body: [
            "So what converts offers into help is having a specific request ready before anyone offers. Most people who offer mean it and are waiting to be told what.",
            "It's also worth having more than one, at different sizes. People decline the big one and take the small one, and you want the small one to exist.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Two or three requests, ready in advance. Different sizes.",
          fields: [
            {
              id: "who-offers",
              label: "Who has offered, in general terms?",
              input: "text",
              placeholder: "The people who've said some version of \u201clet me know\u201d.",
            },
            {
              id: "the-asks",
              label: "What are two or three specific things that would actually help?",
              input: "text",
              placeholder:
                "One small, one medium. A named day is better than \u201csometime\u201d.",
            },
            {
              id: "for-me",
              label: "Is any of them for you, rather than for the caring?",
              input: "chips",
              suggestions: [
                "Yes \u2014 something that gives me an hour",
                "No, they're all about them",
                "Hadn't thought of that",
              ],
            },
          ],
        },
        {
          kind: "realWorldUse",
          useWhen:
            "The next time someone offers in general terms \u2014 or the next time you see one of the people who has.",
          doThis:
            "Name one specific thing, with a day attached. Don't soften it, don't offer them an exit, and don't apologise for asking.",
          safetyNote:
            "If nobody has offered and there's nobody to ask, that's a different problem and a real one. A carers' group or your GP is a reasonable place to start \u2014 people are often reluctant on the grounds that others have it worse, and that isn't the entry requirement.",
        },
        {
          kind: "output",
          heading: "My asks, ready",
          body:
            "Most people who offer mean it and are waiting to be told what.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "\u201cLet me know if you need anything\u201d is three jobs for me.",
            "A named day beats \u201csometime\u201d.",
            "Have a small one ready. People decline the big one and take the small one.",
          ],
        },
      ],
      portable: [
        "\u201cLet me know if you need anything\u201d is three jobs for me.",
        "A named day beats \u201csometime\u201d.",
        "Have a small one ready. People decline the big one and take the small one.",
      ],
      myPlaysTemplate: {
        when: "When people offer and nothing comes of it",
        move: "Have two or three specific asks ready, with days attached",
        lookingFor: "Whether a specific ask converts where a general offer didn't",
        watchOut: "Making every ask about them and none about me",
        remember: "Depletion responds to rest, not to guilt.",
      },
      fidelity: {
        correct:
          "Specific requests with named times are prepared in advance and made directly when an offer occurs.",
        misuse: [
          "Softening the ask until it's declinable by default.",
          "Only ever asking for things that serve the caring.",
          "Waiting for an offer specific enough to accept.",
        ],
        notMeaning:
          "It does not mean people will help, that help is available, or that asking gets easier.",
      },
    },
  ],

  literature: ADDON_CAREGIVING_LITERATURE,

  missions: [
    {
      id: "mission-care-small",
      version: 1,
      playId: "the-two-relationships",
      title: "Protect the small thing for a fortnight",
      instruction:
        "Whatever survives that fits inside the day \u2014 keep it, for two weeks, deliberately.",
      linkToOperation: "Preserving a surviving element of partnership within existing capacity",
      attemptMeaning:
        "You kept it. Whether it felt like enough isn't the measure.",
      suitability:
        "If nothing survives that fits inside the day, that's a real answer and worth saying to someone rather than solving alone.",
      progression: [
        {
          id: "rung-care-small-2",
          instruction: "Tell them you're doing it, and why.",
        },
      ],
    },
    {
      id: "mission-care-ask",
      version: 1,
      playId: "one-specific-ask",
      title: "Make the ask that's for you",
      instruction:
        "Ask for the one that gives you an hour, rather than the ones that serve the caring. Note what happens.",
      linkToOperation: "Requesting support for oneself rather than for the care task",
      attemptMeaning:
        "You asked. A refusal is information about them, not about whether you should have.",
      suitability:
        "If asking for something that's only for you feels impossible, that's worth noticing \u2014 it's the most common version of this.",
      progression: [
        {
          id: "rung-care-ask-2",
          instruction: "Ask a second person, for something slightly larger.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-care-small",
      version: 1,
      playId: "the-two-relationships",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Separated the caring from the partnership",
          "Found something that survives",
          "Protected it deliberately",
          "Couldn't find anything",
        ],
      },
      performedOperation: {
        label: "Did you name the two relationships separately?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it receded rather than ended",
          "That something does survive",
          "That there's nothing spare at all",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Nothing survives that fits in the day",
          "Protecting it took energy I don't have",
          "It made me sadder rather than clearer",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-care-ask",
      version: 1,
      playId: "one-specific-ask",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Had asks ready in advance",
          "Named a specific day",
          "Asked for something that was for me",
          "Waited for a better offer",
        ],
      },
      performedOperation: {
        label: "Did you make a specific request with a time attached?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That specific asks convert",
          "That some offers weren't meant",
          "How rarely I ask for anything for myself",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't ask for something just for me",
          "They said no",
          "There's nobody to ask",
          "Nothing stuck",
        ],
      },
    },
  ],
};
