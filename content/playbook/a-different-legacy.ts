/**
 * Cluster 26 — "Fear of Repeating What I Inherited"
 * The Relationship Playbook™ · A Different Legacy
 *
 * Track: Renewal. Task = Reengagement.
 * Core Need: TO BECOME MY BEST RELATIONAL SELF. Plays-only.
 *
 * ⚠ SLUG COLLISION — OWNER DECISION NEEDED. The canonical subtitle is "Breaking
 *   the Cycle", already used by Cluster 7 (`breaking-the-cycle`, about
 *   arguing). Using `a-different-legacy` here to avoid the clash. The display
 *   names would also read as duplicates in a catalogue.
 *
 * ⚠ SMALLEST CLUSTER IN THE CORPUS. Ten statements, eight Needs, zero
 *   Self-Behaviour. TWO tools only — most of this is a clearly-held set of
 *   values rather than a difficulty, and it is validated rather than worked on.
 *
 * ⚠ NOT PARENTING ADVICE. Nothing here tells anyone how to raise children.
 *
 * ⚠ DO NOT PATHOLOGISE THE FAMILY OF ORIGIN. No assumption that it was bad, no
 *   blame assigned, no account of what went wrong invited.
 *
 * ⚠ WORKS WITHOUT CHILDREN. No content assumes the reader has any.
 *
 * ⚠ COMPETENCY MAPPING (Renewal set)
 *   the-specific-thing  → Pattern Interruption
 *   what-they-see       → Repair Engagement · Intentional Self-Expression
 *
 * ⚠ CLAIM SCOPE. May claim: name the inherited pattern specifically; notice
 *   what a relationship demonstrates rather than states. MUST NOT CLAIM: that
 *   the pattern stops with you, that children won't repeat it, that intention
 *   is sufficient, or anything about parenting.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C26_LITERATURE } from "./a-different-legacy-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const A_DIFFERENT_LEGACY: PlaybookContent = {
  playbookKey: "a-different-legacy",
  playbookVersion: 1,
  displayName: "A Different Legacy",

  opening: {
    title: "Most of this isn't a problem",
    body: [
      "You've noticed something that ran in the family you grew up in, and you'd rather it stopped running. Most people never notice at all.",
      "So this is a short one — two tools. It works on one gap: you want to break a pattern, but you need something small enough to do this week.",
      "Nothing here is about how to raise children, and none of it assumes your family was bad.",
    ],
    manifestations: [
      "I want to break generational patterns.",
      "I don't want dysfunction to become normal.",
      "I want my children to see a healthy relationship.",
      "I want my story to change direction.",
    ],
    cta: "Start with the specific thing",
  },

  recognitionCards: [
    {
      id: "rec-c26-values",
      role: "validate",
      pathwayPlayId: null,
      headline: "I want to leave a different legacy than I inherited.",
      validationCopy:
        "That's a clear value, held by someone who has thought about it. Most people never put it into words, and plenty never notice the pattern at all. Noticing is the hard part to learn, and you've done it. There isn't much here that needs fixing.",
      secondaryExamples: [
        "I want my relationships to reflect my values.",
        "I want to build something that lasts beyond me.",
        "I want future generations to benefit from the work I'm doing now.",
      ],
    },
    {
      id: "rec-c26-pattern",
      role: "route",
      pathwayPlayId: "the-specific-thing",
      headline: "I want to break generational patterns.",
      explanation:
        "It's a direction, not yet a thing you could do. Inherited patterns are hard to see because they were the water — whatever happened in your house was simply what happens.",
      secondaryExamples: [
        "I don't want dysfunction to become normal.",
        "I want to create a healthier family than the one I grew up in.",
        "I want my story to change direction.",
      ],
    },
    {
      id: "rec-c26-what-they-see",
      role: "route",
      pathwayPlayId: "what-they-see",
      headline: "I don't want my children to repeat my mistakes.",
      explanation:
        "The key word is what they see. What gets taken in isn't the good moments — it's what happens when something goes wrong.",
      secondaryExamples: [
        "I want my children to see a healthy relationship.",
        "I want my relationships to reflect my values.",
      ],
    },
  ],

  plays: [
    // ───────────────────────── Play 1 · Pattern Interruption ──
    {
      playId: "the-specific-thing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Specific Thing",
      positioning: "For turning \u201cbreak the pattern\u201d into something you could catch.",
      recognitionGate: {
        prompt: "Can you name what ran in your family, without knowing what to watch for?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Inherited patterns are hard to see for a specific reason: they were the water.",
            "Whatever happened in your house was, for years, simply what happens. That background feeling stays with you long after you can name it as a pattern.",
            "That's why \u201cI don't want dysfunction to become normal\u201d names a whole category. It doesn't tell you what to watch for.",
          ],
        },
        {
          kind: "learn",
          body: [
            "There are two levels, and only one is something you can work with.",
            "\u201cThere was a lot of conflict\u201d or \u201cnobody talked about anything\u201d is a description of the climate. True, and too broad to act on.",
            "\u201cWhen someone was upset, everyone left the room\u201d or \u201cyou apologised by making a joke\u201d is a specific move, repeated. That's a thing you could catch yourself doing.",
            "The specific version is nearly always small and about what you actually did \u2014 what happened at the moment of difficulty. Who spoke, who left, what got said instead of the real thing.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these could you actually catch yourself doing?",
          situation:
            "Something has gone slightly wrong at home \u2014 a disagreement, a bad mood, something unsaid. The old moves are the ones that arrive first.",
          buckets: [
            { id: "specific", label: "A move I could catch" },
            { id: "climate", label: "A description of the climate" },
          ],
          items: [
            {
              id: "sort-c26-left-room",
              text: "When someone's upset, I leave the room",
              correctBucket: "specific",
              correction: "Small, about what you did, and easy to catch. That's the level.",
            },
            {
              id: "sort-c26-cold",
              text: "My family wasn't very warm",
              correctBucket: "climate",
              correction: "True, probably. Nothing in it you could catch on a Tuesday.",
            },
            {
              id: "sort-c26-joke",
              text: "I apologise by making a joke instead of saying sorry",
              correctBucket: "specific",
              correction: "Exactly the level. One move, repeated.",
            },
            {
              id: "sort-c26-conflict",
              text: "There was a lot of conflict growing up",
              correctBucket: "climate",
              correction: "A description. Go one level down \u2014 what happened during it?",
            },
            {
              id: "sort-c26-never-mentioned",
              text: "After an argument, nobody mentions it again",
              correctBucket: "specific",
              correction:
                "A move, and one of the most commonly inherited ones.",
            },
            {
              id: "sort-c26-dysfunction",
              text: "Dysfunction was normal in my family",
              correctBucket: "climate",
              correction:
                "The category. What was the actual move that made it so?",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "One move, not the climate. Think about the moment something went wrong rather than the general mood.",
          fields: [
            {
              id: "the-move",
              label: "What was the specific move, at the moment of difficulty?",
              input: "text",
              placeholder: "Who spoke, who left, what got said instead of the real thing.",
            },
            {
              id: "do-i-do-it",
              label: "Do you do it?",
              input: "chips",
              suggestions: [
                "Yes, and I notice afterwards",
                "Yes, and I don't notice",
                "Sometimes",
                "I do the opposite, quite hard",
                "I don't think so",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is that specific enough that you'd catch yourself doing it?",
          enoughLabel: "Yes — I'd notice",
          needMoreLabel: "Not quite — it's still a description",
          needMoreIntro:
            "Go one level down. Ask what actually happened in the room, physically, in the first thirty seconds after something went wrong.",
          needToKnowLabel: "The smaller, step-by-step version",
          observableLabel: "Something I'd catch myself doing",
        },
        {
          kind: "output",
          heading: "The specific thing",
          body:
            "One move, small enough to notice. Not a judgment on anyone who taught it to you.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "It was the water. That's why it's hard to see.",
            "Not the climate \u2014 the move, at the moment of difficulty.",
            "Naming it isn't blaming anyone.",
          ],
        },
      ],
      portable: [
        "It was the water. That's why it's hard to see.",
        "Not the climate \u2014 the move, at the moment of difficulty.",
        "Naming it isn't blaming anyone.",
      ],
      myPlaysTemplate: {
        when: "When I want to break a pattern and don't know what to watch for",
        move: "Name the specific move at the moment of difficulty, not the climate",
        lookingFor: "Something small and step-by-step, so I can catch myself doing it",
        watchOut: "Describing the mood \u2014 there's nothing in it to act on",
        remember: "Whoever taught me this was almost certainly taught it too.",
      },
      fidelity: {
        correct:
          "A specific inherited move gets named — the thing that actually happens at the moment of difficulty.",
        misuse: [
          "Naming the climate rather than the move.",
          "Turning it into a story of what a parent did wrong.",
          "Treating the naming as enough on its own.",
        ],
        notMeaning:
          "It does not mean the pattern stops, that you're doing it, or that anyone is to blame for it.",
      },
      supportSignposts: [
        {
          id: "signpost-c26-harm",
          heading: "If what you inherited was harmful rather than unhelpful",
          body:
            "There's a difference between a habit you'd rather not carry forward and something that truly harmed you. If it's the second, that's a heavier thing, and it's worth having someone alongside you for it — a therapist, or a service that works with people who grew up in it. A Playbook is a fine place to work on a habit, and the wrong place to work on that.",
        },
      ],
    },

    // ────── Play 2 · Repair Engagement / Intentional Self-Expression ──
    {
      playId: "what-they-see",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What They See",
      positioning: "For what a relationship shows, rather than what it says.",
      recognitionGate: {
        prompt: "Do you want the next generation to see something different?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI want my children to see a healthy relationship.\u201d The key word is *see*.",
            "Whatever anyone is told about relationships, what gets taken in is what's shown. And mostly not the good moments \u2014 those get noticed and enjoyed, but they don't teach much.",
            "What gets taken in is what happens when something goes wrong.",
          ],
        },
        {
          kind: "learn",
          body: [
            "This is surprisingly good news. It means you don't need a relationship without conflict \u2014 you couldn't have one \u2014 and a home where no disagreement is ever seen teaches something too.",
            "A repaired disagreement shows more than an avoided one. Someone watching learns that things can go wrong and then be put right. That's the more useful lesson, and the harder one to come by.",
            "This is true whether or not anyone is watching. What gets shown is what gets practised, and it's the practice that carries.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "The moment of difficulty is the one that teaches. What does yours look like right now?",
          fields: [
            {
              id: "what-happens-now",
              label: "When something goes wrong in your relationship, what happens?",
              input: "text",
              placeholder: "Honestly. The first ten minutes and the day after.",
            },
            {
              id: "whats-visible",
              label: "Which part of that would be visible to someone watching?",
              input: "chips",
              suggestions: [
                "The disagreement itself",
                "The silence afterwards",
                "Nothing \u2014 we do it out of sight",
                "The repair, if there is one",
                "Not sure",
              ],
            },
            {
              id: "the-different-thing",
              label: "What's one thing you'd want visible that isn't right now?",
              input: "text",
              placeholder:
                "Usually the repair. Small \u2014 not a show, just a thing that happens.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is the repair visible right now, or does it happen out of sight?",
          enoughLabel: "It's visible",
          needMoreLabel: "It happens privately, or not at all",
          needMoreIntro:
            "Very common, and worth knowing. Homes often argue in front of people and repair behind closed doors \u2014 which shows half the lesson, and the harder half.",
          needToKnowLabel: "What a visible repair would look like",
          observableLabel: "Something someone could actually see",
        },
        {
          kind: "output",
          heading: "What's shown",
          body:
            "Not a performance. What already happens, with the useful half made visible.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "What gets taken in isn't the good moments. It's what happens when things go wrong.",
            "A repaired disagreement teaches more than an avoided one.",
            "Arguing in front of people and repairing in private teaches half the lesson.",
          ],
        },
      ],
      portable: [
        "What gets taken in isn't the good moments. It's what happens when things go wrong.",
        "A repaired disagreement teaches more than an avoided one.",
        "Arguing in front of people and repairing in private teaches half the lesson.",
      ],
      myPlaysTemplate: {
        when: "When I want the next generation to see something different",
        move: "Notice what the moment of difficulty shows right now",
        lookingFor: "Whether the repair is visible or happens out of sight",
        watchOut: "Performing a relationship rather than making the real repair visible",
        remember: "I don't need a relationship without conflict. I couldn't have one.",
      },
      fidelity: {
        correct:
          "You look at what the moment of difficulty shows, and you separate how visible the repair is from how visible the conflict is.",
        misuse: [
          "Putting on a show of harmony for an audience.",
          "Holding down disagreement so nothing is seen.",
          "Using it to get the upper hand in an argument with a partner.",
        ],
        notMeaning:
          "It does not mean children won't repeat the pattern, that visible repair is enough, or that anything about your relationship is wrong right now.",
      },
    },
  ],

  literature: C26_LITERATURE,

  missions: [
    {
      id: "mission-c26-catch",
      version: 1,
      playId: "the-specific-thing",
      title: "Watch for the move for a month",
      instruction:
        "Keep the specific move in mind. If you catch yourself doing it, note when — during, just after, or days later.",
      linkToOperation: "Spotting an inherited pattern as it happens",
      attemptMeaning:
        "You watched. Catching it late is still catching it.",
      suitability:
        "If nothing comes up, that's fine. The move is worth having named anyway.",
      progression: [
        {
          id: "rung-c26-catch-2",
          instruction: "Name a second one, from a different part of family life.",
        },
      ],
    },
    {
      id: "mission-c26-visible",
      version: 1,
      playId: "what-they-see",
      title: "Make one repair visible",
      instruction:
        "Next time something goes wrong and gets put right, let the putting-right happen where it can be seen. Once.",
      linkToOperation: "Showing repair, not just conflict",
      attemptMeaning:
        "You made it visible. Whether anyone noticed isn't the measure.",
      suitability:
        "Not a performance. If it would be staged rather than real, wait for a real one.",
      progression: [
        {
          id: "rung-c26-visible-2",
          instruction: "Say out loud what you're doing, as it happens.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c26-catch",
      version: 1,
      playId: "the-specific-thing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named a specific move, not the climate",
          "Noticed myself doing it",
          "Caught it at the time",
          "Only saw it afterwards",
        ],
      },
      performedOperation: {
        label: "Did you name a specific move you actually do?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What the actual move is",
          "That I do it too",
          "That I've been overcorrecting instead",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I could only describe the atmosphere",
          "It turned into an account of my parents",
          "I caught it and did it anyway",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c26-visible",
      version: 1,
      playId: "what-they-see",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Let a repair happen where it could be seen",
          "Noticed what's currently visible",
          "Said out loud what was happening",
          "Kept it out of sight as usual",
        ],
      },
      performedOperation: {
        label: "Did you make a real repair visible?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That we repair privately and argue publicly",
          "That there isn't much repair to make visible",
          "That it's already visible",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It felt like performing",
          "There wasn't a repair to show",
          "My partner wasn't on board with it",
          "Nothing stuck",
        ],
      },
    },
  ],
};
