/**
 * Cluster 13 — "Fear of Trying Again"
 * The Relationship Playbook™ · Opening Your Heart Again
 *
 * Track: RENEWAL — first Renewal cluster built. Task = Reengagement.
 * Core Need: TO MOVE FORWARD. Plays-only.
 * Competencies from Recovery_and_Renewal_Competency_Manual_v0_1.
 *
 * ⚠⚠ WRITTEN TO READINESS, NOT TO FEAR. Exactly one of 36 statements is fear.
 *   Twenty-one are Needs; seven are Experiences reporting progress already
 *   underway. This reader is recovering well. Nothing here may treat them as
 *   stuck, and nothing may reframe their progress as avoidance or as a
 *   substitute for a relationship.
 *
 * ⚠ ELEVEN STATEMENTS NEED NO INTERVENTION. PE-3 and PE-4 are the reader
 *   stating what they know and what they want. Validated via
 *   `rec-c13-know-what-i-want`, never worked on.
 *
 * ⚠ COMPETENCY MAPPING (Renewal set)
 *   the-pattern-specifically  → Pattern Interruption
 *   different-how             → Adaptive Responding
 *   a-life-not-a-search       → Purpose Cultivation · Growth Maintenance · Joy Receptivity
 *   saying-yes-anyway         → Relational Risk Engagement · Active Role Engagement
 *
 * ⚠ CLAIM SCOPE. May claim: name the pattern specifically enough to catch it;
 *   turn "differently" into one behaviour; build a life alongside the looking;
 *   take a proportionate step while still uncertain. MUST NOT CLAIM: that the
 *   pattern won't recur, that this time will be different, that readiness
 *   guarantees anything, or that anyone is obliged to date again.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C13_LITERATURE } from "./starting-again-without-starting-from-scratch-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const OPENING_YOUR_HEART_AGAIN: PlaybookContent = {
  playbookKey: "starting-again-without-starting-from-scratch",
  playbookVersion: 1,
  displayName: "Opening Your Heart Again",

  opening: {
    title: "You're further along than this is usually called",
    body: [
      "You know what you want. You can name what went wrong before. You're rebuilding more than just your relationships. That isn't the language of someone stuck.",
      "What you're carrying is smaller than fear. It's one worry: that knowing better won't be enough, and you'll end up somewhere familiar anyway.",
      "Almost everything here is about one gap. It's the gap between wanting to do it differently and knowing what that means on a Tuesday.",
    ],
    manifestations: [
      "I don't want to repeat my past.",
      "How do I date differently this time?",
      "I want to build a life I'm proud of, with or without a partner.",
      "I want to say yes to new experiences, even if I'm still a little scared.",
    ],
    cta: "Start with what \u201cdifferently\u201d actually means",
  },

  recognitionCards: [
    {
      id: "rec-c13-know-what-i-want",
      role: "validate",
      pathwayPlayId: null,
      headline: "I finally know what I want.",
      validationCopy:
        "That's not a small thing, and most people can't say it. Most people can't say \u201cI'm learning who I am outside of being someone's partner\u201d either. Or \u201cI want to build a life I'm proud of, with or without a partner.\u201d Those aren't things to work on. They're ground you've already covered. And they put you in a better spot than most people are in when they start again.",
      secondaryExamples: [
        "I believe healthy love is possible.",
        "I want peace instead of chaos.",
        "I'm ready, but I want to do it right.",
      ],
    },
    {
      id: "rec-c13-repeat",
      role: "route",
      pathwayPlayId: "the-pattern-specifically",
      headline: "I'm afraid I'll repeat the same mistakes.",
      explanation:
        "Knowing the shape of a pattern isn't enough to catch one. What you can catch is the early cue. It's usually something you do, before it's obviously the pattern.",
      secondaryExamples: [
        "I don't want to repeat my past.",
        "I want to break old patterns.",
        "I don't want history to repeat itself.",
      ],
    },
    {
      id: "rec-c13-differently",
      role: "route",
      pathwayPlayId: "different-how",
      headline: "How do I date differently this time?",
      explanation:
        "The right question, but it usually gets answered too broadly. \u201cBe more careful\u201d doesn't tell you what to do on a specific evening.",
      secondaryExamples: [
        "I want to do relationships differently.",
        "I want to become a better partner.",
        "I want to become the kind of person who can build a healthy relationship.",
      ],
    },
    {
      id: "rec-c13-a-life",
      role: "route",
      pathwayPlayId: "a-life-not-a-search",
      headline: "I want to feel excited about my life again, not just my love life.",
      explanation:
        "Not a consolation prize. A full life changes what a relationship has to carry. It also changes what you can say no to.",
      secondaryExamples: [
        "I'm rebuilding more than just my relationships right now.",
        "I want to reconnect with things I used to love doing.",
        "I'm learning to enjoy my own company again.",
      ],
    },
    {
      id: "rec-c13-saying-yes",
      role: "route",
      pathwayPlayId: "saying-yes-anyway",
      headline: "I want to say yes even if I'm still a little scared.",
      explanation:
        "Notice the \u201ceven if,\u201d not \u201conce I'm not.\u201d Leftover caution doesn't go away just by waiting it out.",
      secondaryExamples: [
        "I want to invest in my friendships again.",
        "I want to show up for my community again.",
        "I want to trust myself again.",
      ],
    },
  ],

  plays: [
    // ───────────────────────────── Play 1 · Pattern Interruption ──
    {
      playId: "the-pattern-specifically",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Pattern, Specifically",
      positioning: "For turning \u201cI don't want to repeat this\u201d into something you could catch.",
      recognitionGate: {
        prompt: "Can you describe your pattern, and still not see it coming?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI don't want to repeat my past\u201d is a direction. It isn't yet something you could notice happening.",
            "Patterns don't announce themselves. They show up as an ordinary moment that feels a little familiar. By the time you can recognise it, it's usually well underway.",
            "Knowing the shape isn't enough. Most people can describe their pattern in general terms and still be right inside it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "What you can catch is the early cue. It's the small, specific thing that happens first, before it's obviously the pattern.",
            "Your part is the useful half, because it's the half you can do something about. \u201cThey started pulling away\u201d isn't something you can act on. \u201cI started explaining myself more\u201d is.",
            "Most people's early cue is something they do, not something the other person does.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these could you actually catch?",
          situation:
            "You're a few weeks into something new. Nothing has gone wrong. You're watching yourself more closely than you used to.",
          buckets: [
            { id: "catchable", label: "I could notice this" },
            { id: "not", label: "I'd only see it later" },
          ],
          items: [
            {
              id: "sort-c13-explaining",
              text: "I've started explaining myself more than usual",
              correctBucket: "catchable",
              correction: "Yours, small, and early. That's what a usable cue looks like.",
            },
            {
              id: "sort-c13-they-changed",
              text: "They started losing interest",
              correctBucket: "not",
              correction:
                "Real, but not something you can act on. And you usually only see it looking back.",
            },
            {
              id: "sort-c13-checking-phone",
              text: "I've started checking whether they've read it",
              correctBucket: "catchable",
              correction: "Specific and yours. Good cue.",
            },
            {
              id: "sort-c13-toxic",
              text: "It turned out they weren't good for me",
              correctBucket: "not",
              correction:
                "That's a conclusion, not a cue. And you only reach it at the end.",
            },
            {
              id: "sort-c13-cancelled-plans",
              text: "I've cancelled two things with friends to be available",
              correctBucket: "catchable",
              correction:
                "You can count it, it's early, and it's all yours. One of the more reliable ones.",
            },
            {
              id: "sort-c13-same-type",
              text: "I always go for the same type",
              correctBucket: "not",
              correction:
                "That describes the pattern. It's not a cue you could catch in the moment.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Now your own. Think back to the last time. Work forward from the start, not backward from the end.",
          fields: [
            {
              id: "the-pattern",
              label: "What's the pattern, in your words?",
              input: "text",
              placeholder: "The shape of it. Broad is fine here.",
            },
            {
              id: "early-cue",
              label:
                "What did YOU do first, before it was obviously happening?",
              input: "text",
              placeholder:
                "Something small and yours. Earlier than feels like it matters.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is that cue something you'd actually notice at the time?",
          enoughLabel: "Yes — I'd catch it",
          needMoreLabel: "Probably not — it's still too big",
          needMoreIntro:
            "Then go earlier and smaller. The useful cue is usually one step before the thing you first thought of. And it usually feels too small to matter.",
          needToKnowLabel: "An earlier, smaller version of it",
          observableLabel: "Something I'd catch myself doing",
        },
        {
          kind: "output",
          heading: "My early cue",
          body:
            "Not a rule against the pattern. One small thing you'd notice, early enough to have a choice about it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Knowing the shape isn't enough. I need the cue.",
            "The useful cue is something I do, not something they do.",
            "Earlier and smaller than feels like it matters.",
          ],
        },
      ],
      portable: [
        "Knowing the shape isn't enough. I need the cue.",
        "The useful cue is something I do, not something they do.",
        "Earlier and smaller than feels like it matters.",
      ],
      myPlaysTemplate: {
        when: "When I want to catch the pattern rather than describe it",
        move: "Name the small thing I do first, before it's obviously happening",
        lookingFor: "A cue that's mine, early, and small enough to be missed",
        watchOut: "Naming something about them — I can't act on that",
        remember: "Noticing sooner is what change looks like. Not never doing it.",
      },
      fidelity: {
        correct:
          "An early behavioural cue belonging to the reader is identified, specific and small enough to be noticed in the moment.",
        misuse: [
          "Naming something the other person does.",
          "Naming the pattern rather than the cue.",
          "Treating the cue as a rule to be enforced.",
        ],
        notMeaning:
          "It does not mean the pattern won't recur, that noticing it stops it, or that you'll catch it every time.",
      },
    },

    // ───────────────────────────── Play 2 · Adaptive Responding ──
    {
      playId: "different-how",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Different How?",
      positioning: "For when you know what you want, but not what to do.",
      recognitionGate: {
        prompt: "Do you know you want to do it differently, without knowing what that means?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cHow do I date differently this time?\u201d is the right question. It usually gets answered too broadly — be more careful, take it slower, know your worth.",
            "None of those tell you what to do when a specific thing happens on a specific evening.",
          ],
        },
        {
          kind: "learn",
          body: [
            "There are two ways this goes wrong, and the second is less obvious.",
            "Doing the same thing. It's familiar, and it's what the worry is about.",
            "Doing the exact opposite. This is also common after a bad ending, but it isn't real judgement. It's the same script flipped. Someone who used to over-explain, now explaining nothing, has changed the behaviour without gaining any judgement.",
            "What's actually different is choosing a response that fits the situation right now. Sometimes that's the old response — when the old response is right for what's in front of you.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Take the cue you named, or a moment you know is coming. One response, not a rule.",
          fields: [
            {
              id: "the-moment",
              label: "When the cue happens, what do you normally do?",
              input: "text",
              placeholder: "The automatic version.",
            },
            {
              id: "the-opposite",
              label: "What's the exact opposite? Write it down, then set it aside.",
              input: "text",
              placeholder:
                "This is usually the first idea, and it's usually the trap.",
            },
            {
              id: "the-fitting-one",
              label:
                "What response would actually fit the situation — judged on its own?",
              input: "text",
              placeholder:
                "It might be the old one. It might be something neither.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro:
            "One response, for one situation. Not a rule for every relationship to come.",
          conditionLabel: "When I notice my cue, I'll",
          thenLabel: "And before I act, I'll check",
          actions: [
            "Whether this situation is actually like the old one",
            "Whether I'm reacting to them or to the last person",
            "What the right-sized response would be",
            "Whether I'm about to overcorrect",
          ],
          controlCheck:
            "The old response might be the right one here. Different means fitting the situation now, not doing the opposite of last time.",
        },
        {
          kind: "output",
          heading: "My response, for this situation",
          body:
            "One response, judged on right now. Not a rule for everything after.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The opposite isn't judgement. It's the same script flipped.",
            "Different means fitting right now, not avoiding the past.",
            "Sometimes the old response is the right one.",
          ],
        },
      ],
      portable: [
        "The opposite isn't judgement. It's the same script flipped.",
        "Different means fitting right now, not avoiding the past.",
        "Sometimes the old response is the right one.",
      ],
      myPlaysTemplate: {
        when: "When I want to do it differently and don't know what that means",
        move: "Choose a response that fits this situation, not the opposite of last time",
        lookingFor: "Whether I'm assessing the present or reacting to the past",
        watchOut: "Overcorrecting — that's the same pattern with the sign flipped",
        remember: "A rule is appealing because it saves me assessing. That's also why it repeats.",
      },
      fidelity: {
        correct:
          "A response is selected on the basis of present conditions, distinguished from both the automatic response and its opposite.",
        misuse: [
          "Adopting the opposite as a rule.",
          "Turning one response into a policy for all future relationships.",
          "Using it to justify the old response without assessing.",
        ],
        notMeaning:
          "It does not mean the response is right, that it will work, or that you'll manage it in the moment.",
      },
    },

    // ─────── Play 3 · Purpose Cultivation / Growth Maintenance / Joy ──
    {
      playId: "a-life-not-a-search",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "A Life, Not a Search",
      positioning: "For the part that isn't about finding anyone.",
      recognitionGate: {
        prompt: "Is your life right now built around looking for a relationship?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI want to feel excited about my life again, not just my love life.\u201d \u201cI want to build a life I'm proud of, with or without a partner.\u201d",
            "These aren't consolation prizes. And nothing here treats them as filler until someone shows up.",
          ],
        },
        {
          kind: "learn",
          body: [
            "There's also a practical reason, and it's worth knowing. A full life changes what a relationship has to carry. When it's your only source of meaning, every wobble in it feels huge.",
            "It also changes what you can turn down. People with somewhere else to be can walk away from things that aren't right. People without can't afford to.",
            "That's the quiet part of \u201cchoosing better\u201d. It isn't only good judgement. It's having enough in your life that a bad option is one you can truly turn down.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Not a life plan. One thing, this month, that has nothing to do with anyone else.",
          fields: [
            {
              id: "what-came-back",
              label: "What's already coming back?",
              input: "chips",
              suggestions: [
                "Work I care about",
                "Something I used to enjoy",
                "Friendships",
                "Being in my community",
                "Faith or practice",
                "Enjoying my own company",
              ],
            },
            {
              id: "one-thing",
              label: "What's one thing you'd do this month, for its own sake?",
              input: "text",
              placeholder: "Specific and small. Not a project.",
            },
            {
              id: "for-its-own-sake",
              label:
                "Honestly — is it for its own sake, or is part of it about becoming more attractive?",
              input: "chips",
              suggestions: [
                "Its own sake",
                "Mostly its own sake",
                "Some of both",
                "If I'm honest, partly the other thing",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "If you knew nobody would ever see it — would you still want to do it?",
          enoughLabel: "Yes",
          needMoreLabel: "Not sure",
          needMoreIntro:
            "Worth sitting with rather than solving. Building a life just to be chosen is the same setup as before, in nicer clothes. And it doesn't give you the one thing that lets you turn a bad option down.",
          needToKnowLabel: "What I'd want if nobody were watching",
          observableLabel: "Something I'd actually do",
        },
        {
          kind: "output",
          heading: "One thing, for its own sake",
          body:
            "Not a plan for becoming attractive. The thing that lets you turn a bad option down.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "When it's your only source of meaning, every wobble feels huge.",
            "People with somewhere else to be can walk away.",
            "Building a life just to be chosen is the old setup in nicer clothes.",
          ],
        },
      ],
      portable: [
        "When it's your only source of meaning, every wobble feels huge.",
        "People with somewhere else to be can walk away.",
        "Building a life just to be chosen is the old setup in nicer clothes.",
      ],
      myPlaysTemplate: {
        when: "When my life has organised itself around looking",
        move: "Do one thing this month for its own sake",
        lookingFor: "Whether I'd want it if nobody would ever see it",
        watchOut: "Building a life as a strategy — that's the old arrangement",
        remember: "Having somewhere else to be is what makes a poor option refusable.",
      },
      fidelity: {
        correct:
          "One specific activity is chosen for its own sake, tested against whether it would still be wanted unobserved.",
        misuse: [
          "Choosing something intended to make you more attractive.",
          "Turning it into a life plan rather than one thing.",
          "Using it to avoid dating while calling it building.",
        ],
        notMeaning:
          "It does not mean you'll meet someone, that a fuller life makes dating easier, or that you should be doing more.",
      },
    },

    // ──────────────── Play 4 · Relational Risk Engagement ──
    {
      playId: "saying-yes-anyway",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Saying Yes Anyway",
      positioning: "For the step you'd take if you felt ready, taken while you don't.",
      recognitionGate: {
        prompt: "Are you waiting to feel ready before you do something?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI want to say yes to new experiences, even if I'm still a little scared.\u201d Notice the \u201ceven if,\u201d not \u201conce I'm not.\u201d",
            "That difference matters. Leftover caution doesn't go away just by waiting it out. It fades, if at all, through small bits of experience that show it's wrong.",
            "That makes right-sized steps, taken while you're still unsure, the way through — not the reward for having finished.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Two kinds of caution, and only one is information.",
            "Evidence-based: something specific about this situation or this person calls for care.",
            "Leftover: the alarm is about the last time, and it shows up before there's anything to weigh.",
            "Both feel exactly the same, which is why waiting to feel ready doesn't work.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "There's often a small alarm when something is simply good — as if enjoying it invites something.",
            "It tends to fade with practice rather than insight. That's unsatisfying, but it also means there's nothing to figure out. Only to notice.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Something right-sized. Not the biggest step — one you could survive if it went badly.",
          fields: [
            {
              id: "the-step",
              label: "What's one thing you'd say yes to if you felt ready?",
              input: "text",
              placeholder:
                "A date, a plan with friends, a class, telling someone something true.",
            },
            {
              id: "which-caution",
              label: "Is the hesitation about this, or about the last time?",
              input: "chips",
              suggestions: [
                "Something specific about this situation",
                "Mostly the last time",
                "Genuinely can't tell",
                "Both, in different amounts",
              ],
            },
            {
              id: "if-it-goes-badly",
              label: "If it went badly, what would actually happen?",
              input: "text",
              placeholder: "Be concrete. It's usually smaller than the feeling suggests.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is that step the right size — small enough that a bad outcome is survivable?",
          enoughLabel: "Yes",
          needMoreLabel: "No — it's bigger than that",
          needMoreIntro:
            "Then find a smaller one. Right-sized is doing a lot of work here. A step you couldn't survive going wrong isn't courage — it's a different pattern.",
          needToKnowLabel: "A smaller version of the same step",
          observableLabel: "Something I could actually do this month",
        },
        {
          kind: "output",
          heading: "The step, and what it risks",
          body:
            "Taken while you're still unsure. That's how it works, not a shortcut past it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "\u201cEven if I'm still scared\u201d, not \u201conce I'm not.\u201d",
            "Leftover caution doesn't go away just by waiting it out.",
            "Right-sized. Small enough that going wrong is survivable.",
          ],
        },
      ],
      portable: [
        "\u201cEven if I'm still scared\u201d, not \u201conce I'm not.\u201d",
        "Leftover caution doesn't go away just by waiting it out.",
        "Right-sized. Small enough that going wrong is survivable.",
      ],
      myPlaysTemplate: {
        when: "When I'm waiting to feel ready before doing something",
        move: "Take one proportionate step while still uncertain",
        lookingFor: "Whether the hesitation is about this or about the last time",
        watchOut: "Ignoring a warning sign and calling it courage",
        remember: "\u201cStill a little scared\u201d is a different report from \u201csomething is wrong here.\u201d",
      },
      fidelity: {
        correct:
          "A proportionate step is taken while uncertainty remains, with the source of the hesitation distinguished.",
        misuse: [
          "Overriding a specific warning sign.",
          "Choosing a step too large to survive going wrong.",
          "Taking the step to prove you've healed.",
        ],
        notMeaning:
          "It does not mean it will go well, that the caution was unfounded, or that readiness follows from doing it.",
      },
    },
  ],

  literature: C13_LITERATURE,

  missions: [
    {
      id: "mission-c13-cue",
      version: 1,
      playId: "the-pattern-specifically",
      title: "Watch for the cue for a month",
      instruction:
        "Keep your cue in mind for a month. If you catch it, note when — during, just after, or a week later. That's the measure.",
      linkToOperation: "Recognising the early activation of a familiar pattern",
      attemptMeaning:
        "You watched. Catching it late is still catching it, and it's the whole progression.",
      suitability:
        "If nothing comes up in a month, that's fine — the cue is still worth having ready.",
      progression: [
        {
          id: "rung-c13-cue-2",
          instruction: "Name a second cue, earlier than the first.",
        },
      ],
    },
    {
      id: "mission-c13-response",
      version: 1,
      playId: "different-how",
      title: "Use the response once",
      instruction:
        "Next time the moment comes, run the check and use the response you chose. Note whether it fitted.",
      linkToOperation: "Selecting a response based on present conditions",
      attemptMeaning:
        "You chose rather than defaulted. It not fitting is useful information.",
      suitability:
        "If you find you've overcorrected, that's the second failure mode and it's worth catching rather than hiding.",
      progression: [
        {
          id: "rung-c13-response-2",
          instruction:
            "Try it in a situation where the old response might actually be right.",
        },
      ],
    },
    {
      id: "mission-c13-life",
      version: 1,
      playId: "a-life-not-a-search",
      title: "Do the one thing",
      instruction:
        "Do it this month. Note how it felt, and whether you'd have wanted it with nobody watching.",
      linkToOperation: "Cultivating purpose independent of relational outcome",
      attemptMeaning:
        "You did it for its own sake. Whether it led anywhere isn't the point.",
      suitability:
        "If it turns into a project or a strategy, scale it back — small and for itself is the whole thing.",
      progression: [
        {
          id: "rung-c13-life-2",
          instruction: "Add a second, and don't drop the first.",
        },
      ],
    },
    {
      id: "mission-c13-yes",
      version: 1,
      playId: "saying-yes-anyway",
      title: "Take the step",
      instruction:
        "Do the proportionate thing you named, while still uncertain. Note what actually happened against what you predicted.",
      linkToOperation: "Engaging relational risk without requiring certainty",
      attemptMeaning:
        "You took it. Going badly is a completed attempt and is exactly the contradicting experience.",
      suitability:
        "Not if there's a specific warning sign about this situation. That hesitation is information, not residue.",
      progression: [
        {
          id: "rung-c13-yes-2",
          instruction: "Take a slightly larger one, once the first has settled.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c13-cue",
      version: 1,
      playId: "the-pattern-specifically",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named a cue that was mine",
          "Made it small and early",
          "Caught it when it happened",
          "Only saw it afterwards",
        ],
      },
      performedOperation: {
        label: "Did you identify an early cue of your own?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What I do first",
          "How early it actually starts",
          "That I've been watching them instead of me",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I could only name things they did",
          "The cue was still too late",
          "I caught it and did it anyway",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c13-response",
      version: 1,
      playId: "different-how",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Assessed the present situation",
          "Chose rather than defaulted",
          "Didn't just do the opposite",
          "Overcorrected",
        ],
      },
      performedOperation: {
        label: "Did you select a response based on present conditions?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the opposite isn't the answer",
          "That this situation was genuinely different",
          "That the old response fitted after all",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I did the opposite and it wasn't better",
          "I couldn't tell if it was the same situation",
          "I defaulted before I could think",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c13-life",
      version: 1,
      playId: "a-life-not-a-search",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Did the one thing",
          "Did it for its own sake",
          "Kept it small",
          "Turned it into a project",
        ],
      },
      performedOperation: {
        label: "Did you do one thing for its own sake?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I enjoyed it",
          "How much of my life had narrowed",
          "That part of it was still about being chosen",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't find something that wasn't strategic",
          "It felt like filling time",
          "I didn't get round to it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c13-yes",
      version: 1,
      playId: "saying-yes-anyway",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Took the step while uncertain",
          "Kept it proportionate",
          "Checked which kind of caution it was",
          "Waited to feel ready",
        ],
      },
      performedOperation: {
        label: "Did you take a proportionate step while still uncertain?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the hesitation was about last time",
          "That it was about this, and I was right",
          "That a bad outcome was survivable",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It went badly and that landed hard",
          "I couldn't tell which caution it was",
          "I waited again",
          "Nothing stuck",
        ],
      },
    },
  ],
};
