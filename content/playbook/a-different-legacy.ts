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

export const A_DIFFERENT_LEGACY: PlaybookContent = {
  playbookKey: "a-different-legacy",
  playbookVersion: 1,
  displayName: "A Different Legacy",

  opening: {
    title: "Most of this isn't a problem",
    body: [
      "You've noticed something that ran in the family you grew up in, and you'd rather it stopped running. Most people never notice at all.",
      "So this is a short one — two tools. The gap it works on is between wanting to break a pattern and having something small enough to do this week.",
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
        "That's a clearly held value, arrived at by someone who has thought about it. Most people never articulate it and a good number never notice the pattern at all — noticing is the part that's hard to acquire, and you've done it. There isn't much here that needs fixing.",
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
        "A direction, not yet a thing you could do. Inherited patterns are hard to see because they were the water — what happened in your house was simply what happens.",
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
        "The operative word is what they see. What's absorbed isn't the good moments — it's what happens when something goes wrong.",
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
            "Whatever happened in your house was, for years, simply what happens. That background quality persists long after you can name it as a pattern.",
            "Which is why \u201cI don't want dysfunction to become normal\u201d describes a category rather than telling you what to watch for.",
          ],
        },
        {
          kind: "learn",
          body: [
            "There are two levels, and only one is workable.",
            "\u201cThere was a lot of conflict\u201d or \u201cnobody talked about anything\u201d is a description of the climate. True, and too broad to act on.",
            "\u201cWhen someone was upset, everyone left the room\u201d or \u201cyou apologised by making a joke\u201d is a specific move, repeated. That's a thing you could catch yourself doing.",
            "The specific version is nearly always small and procedural \u2014 what happened at the moment of difficulty. Who spoke, who left, what got said instead of the real thing.",
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
              correction: "Small, procedural, and catchable. That's the level.",
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
                "A procedure, and one of the most commonly inherited ones.",
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
            "One move, not the climate. Think about the moment something went wrong rather than the general atmosphere.",
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
          needToKnowLabel: "The smaller, more procedural version",
          observableLabel: "Something I'd catch myself doing",
        },
        {
          kind: "output",
          heading: "The specific thing",
          body:
            "One move, small enough to notice. Not a verdict on anyone who taught it to you.",
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
        lookingFor: "Something procedural and small enough to catch myself doing",
        watchOut: "Describing the atmosphere \u2014 there's nothing in it to act on",
        remember: "Whoever taught me this was almost certainly taught it too.",
      },
      fidelity: {
        correct:
          "A specific, procedural inherited move is named at the level of what happens at the moment of difficulty.",
        misuse: [
          "Naming the climate rather than the move.",
          "Turning it into an account of what a parent did wrong.",
          "Treating the naming as sufficient on its own.",
        ],
        notMeaning:
          "It does not mean the pattern stops, that you're doing it, or that anyone is to blame for it.",
      },
      supportSignposts: [
        {
          id: "signpost-c26-harm",
          heading: "If what you inherited was harmful rather than unhelpful",
          body:
            "There's a difference between a habit you'd rather not carry forward and something that genuinely harmed you. If it's the second, that's a different weight and worth having someone alongside you for — a therapist, or a service that works with people who grew up in it. A Playbook is a reasonable place to work on a habit and the wrong place to work on that.",
        },
      ],
    },

    // ────── Play 2 · Repair Engagement / Intentional Self-Expression ──
    {
      playId: "what-they-see",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What They See",
      positioning: "For what a relationship demonstrates, rather than what it says.",
      recognitionGate: {
        prompt: "Do you want the next generation to see something different?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI want my children to see a healthy relationship.\u201d The operative word is *see*.",
            "Whatever anyone is told about relationships, what gets absorbed is what's demonstrated. And mostly not the good moments \u2014 those are noticed and enjoyed and don't teach much.",
            "What's absorbed is what happens when something goes wrong.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Which is unexpectedly good news. It means you don't need a relationship without conflict \u2014 you couldn't have one, and a household with no visible disagreement teaches something too.",
            "A repaired disagreement demonstrates more than an avoided one. Someone watching learns that things can go wrong and be put right, which is the more useful lesson and the harder one to come by.",
            "This also applies whether or not anyone is watching. What gets demonstrated is what gets practised, and it's the practice that carries.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "The moment of difficulty is the one that teaches. What does yours currently look like?",
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
              label: "What's one thing you'd want visible that currently isn't?",
              input: "text",
              placeholder:
                "Usually the repair. Small \u2014 not a demonstration, just a thing that happens.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is the repair currently visible, or does it happen out of sight?",
          enoughLabel: "It's visible",
          needMoreLabel: "It happens privately, or not at all",
          needMoreIntro:
            "Very common, and worth knowing. Households often argue in front of people and repair behind closed doors \u2014 which demonstrates half the lesson, and the harder half.",
          needToKnowLabel: "What a visible repair would look like",
          observableLabel: "Something someone could actually witness",
        },
        {
          kind: "output",
          heading: "What's demonstrated",
          body:
            "Not a performance. What already happens, with the useful half made visible.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "What's absorbed isn't the good moments. It's what happens when things go wrong.",
            "A repaired disagreement teaches more than an avoided one.",
            "Arguing in front of people and repairing in private teaches half the lesson.",
          ],
        },
      ],
      portable: [
        "What's absorbed isn't the good moments. It's what happens when things go wrong.",
        "A repaired disagreement teaches more than an avoided one.",
        "Arguing in front of people and repairing in private teaches half the lesson.",
      ],
      myPlaysTemplate: {
        when: "When I want the next generation to see something different",
        move: "Notice what the moment of difficulty currently demonstrates",
        lookingFor: "Whether the repair is visible or happens out of sight",
        watchOut: "Performing a relationship rather than making the real repair visible",
        remember: "I don't need a relationship without conflict. I couldn't have one.",
      },
      fidelity: {
        correct:
          "What the moment of difficulty demonstrates is examined, and the visibility of repair is distinguished from the visibility of conflict.",
        misuse: [
          "Performing harmony for an audience.",
          "Suppressing disagreement so nothing is seen.",
          "Using it as leverage in an argument with a partner.",
        ],
        notMeaning:
          "It does not mean children won't repeat the pattern, that visible repair is sufficient, or that anything about your relationship is currently wrong.",
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
      linkToOperation: "Recognising an inherited pattern as it activates",
      attemptMeaning:
        "You watched. Catching it late is still catching it.",
      suitability:
        "If nothing comes up, that's fine. The move is worth having named regardless.",
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
      linkToOperation: "Demonstrating repair rather than only conflict",
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
        label: "Did you name a specific procedural move?",
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
