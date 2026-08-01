/**
 * Cluster 25 — "Feeling Like No One Taught Me How to Do This"
 * The Relationship Playbook™ · From the Ground Up
 *
 * Track: Renewal (22) + Expansion (10). Task = Reengagement.
 * Core Need: TO BECOME MY BEST RELATIONAL SELF. Plays-only.
 *
 * ⚠⚠ THE FAILURE MODE IS SELF-ADVERTISEMENT. This reader is describing this
 *   product. Nothing here may reference the Playbook, the framework, or "the
 *   tools" as an answer, and nothing may congratulate the reader for wanting
 *   what it sells. If a screen could be read as marketing, it is wrong.
 *   `lit-c25-faq-reading` deliberately states the limits of anything written,
 *   including this.
 *
 * ⚠ TWENTY OF THIRTY-TWO STATEMENTS ARE REQUESTS OR ASPIRATIONS. PE-4 and PE-5
 *   route to Recognition/Context. Only three Plays, deliberately.
 *
 * ⚠ "WHY DO I KEEP ENDING UP HERE" IS DECLINED, WITH A REASON. Confident
 *   explanations exist and none are established enough to hand someone as fact.
 *   Same discipline as Clusters 5 and 27. What's offered instead is the
 *   recurring move.
 *
 * ⚠ MIXED UNIT OF ANALYSIS. PE-1 is a couple; the rest is an individual. All
 *   content must work for someone reading alone.
 *
 * ⚠ COMPETENCY MAPPING
 *   love-and-skill      → Repair Engagement · Adaptive Responding
 *   the-recurring-move  → Pattern Interruption
 *   one-thing-practised → Growth Maintenance
 *
 * ⚠ CLAIM SCOPE. May claim: separate love from skill; find the recurring move;
 *   turn an aspiration into one practice. MUST NOT CLAIM: that relationships
 *   can be learned from reading, that skill is sufficient, that we can explain
 *   why the reader keeps ending up somewhere, or anything about this product.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C25_LITERATURE } from "./from-the-ground-up-literature";

export const FROM_THE_GROUND_UP: PlaybookContent = {
  playbookKey: "from-the-ground-up",
  playbookVersion: 1,
  displayName: "From the Ground Up",

  opening: {
    title: "You've already worked out the hard part",
    body: [
      "That relationships involve skills, that nobody taught you them, and that goodwill hasn't been enough on its own. Most people never get there.",
      "It's also, awkwardly, most of the way to the answer — which means there's less to do here than the size of the realisation suggests.",
      "We're not going to tell you that wanting tools is the right instinct and then hand you a list. Three things, and most of this gets left alone on purpose.",
    ],
    manifestations: [
      "We love each other, but we're still struggling.",
      "We have good intentions but poor habits.",
      "I never learned how to have healthy relationships.",
      "I want someone to explain why I keep ending up here.",
    ],
    cta: "Start with love and skill",
  },

  recognitionCards: [
    {
      id: "rec-c25-what-i-want",
      role: "validate",
      pathwayPlayId: null,
      headline: "I want tools, not just encouragement.",
      validationCopy:
        "Right instinct, and worth one honest caveat: collecting tools can become its own way of not practising any. Reading is good at naming things — having a word for what happens between you makes it discussable, and that's real. It's poor at the moment itself. Nothing you've read is available ninety seconds into a difficult conversation. Only what you've practised is.",
      secondaryExamples: [
        "I want practical guidance, not clich\u00e9s.",
        "I don't just want advice \u2014 I want understanding.",
        "I want to become relationship literate.",
      ],
    },
    {
      id: "rec-c25-love-not-enough",
      role: "route",
      pathwayPlayId: "love-and-skill",
      headline: "We love each other and we're still struggling.",
      explanation:
        "Love is not a skill and doesn't contain any. It supplies the motivation; something else has to supply the method.",
      secondaryExamples: [
        "Love isn't fixing our problems.",
        "I thought love would be enough.",
        "I don't think either of us is a bad person.",
      ],
    },
    {
      id: "rec-c25-why-here",
      role: "route",
      pathwayPlayId: "the-recurring-move",
      headline: "Why do I keep ending up here?",
      explanation:
        "We're going to decline the explanation and give you something smaller instead — the move itself, rather than the reason for it.",
      secondaryExamples: [
        "I want to stop attracting unhealthy relationships.",
        "I'm trying to unlearn what I grew up with.",
        "I want to stop sabotaging myself.",
      ],
    },
    {
      id: "rec-c25-become",
      role: "route",
      pathwayPlayId: "one-thing-practised",
      headline: "I want to become emotionally healthier.",
      explanation:
        "True and not yet available on a Tuesday. Intentions arrive when you're calm; habits arrive when it matters.",
      secondaryExamples: [
        "I want to communicate better.",
        "I want to become a better partner.",
        "I want to love without losing myself.",
      ],
    },
  ],

  plays: [
    // ─────────── Play 1 · Repair Engagement / Adaptive Responding ──
    {
      playId: "love-and-skill",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Love and Skill",
      positioning: "For two people who care a great deal and keep getting nowhere.",
      recognitionGate: {
        prompt: "Do you care about each other and still keep having the same trouble?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Love is not a skill and does not contain any. That's the whole reframe.",
            "Love supplies the motivation — it's why you'd bother repairing something, and why it matters when it goes wrong. Skill supplies the method.",
            "Having the first without the second produces exactly what you're describing: two people who care, trying hard, getting nowhere.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cNeither of us is a bad person\u201d is usually true and usually not much comfort — if nobody's at fault, there's nothing obvious to change.",
            "But most difficulty between decent people is procedural. It isn't what either of you wants. It's what happens in the ninety seconds after something lands badly — and neither of you chose that procedure. You each brought one.",
            "\u201cWe don't know how\u201d is a much better position than \u201cwe don't care enough\u201d, because it's the one that responds to anything.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these is about caring, and which is about method?",
          situation:
            "Something small has landed badly \u2014 a comment, a forgotten thing, a tone. The next ninety seconds are the ones that decide how the evening goes.",
          buckets: [
            { id: "caring", label: "About caring" },
            { id: "method", label: "About method" },
          ],
          items: [
            {
              id: "sort-c25-defend",
              text: "We both start defending before either has finished",
              correctBucket: "method",
              correction: "A procedure. Nothing to do with how much you care.",
            },
            {
              id: "sort-c25-dont-care",
              text: "One of us has stopped bothering to repair anything",
              correctBucket: "caring",
              correction: "That's motivation, and this Playbook isn't the answer to it.",
            },
            {
              id: "sort-c25-no-repair",
              text: "Neither of us knows how to end an argument",
              correctBucket: "method",
              correction: "Very common, entirely procedural, and learnable.",
            },
            {
              id: "sort-c25-try-hard",
              text: "We both try, and it still goes wrong the same way",
              correctBucket: "method",
              correction:
                "Trying harder at the wrong method produces more of the same, harder.",
            },
            {
              id: "sort-c25-contempt",
              text: "There's contempt in how we talk to each other now",
              correctBucket: "caring",
              correction:
                "That's further along and it needs more than a method. Worth taking to someone.",
            },
            {
              id: "sort-c25-raise-badly",
              text: "We only raise things when we're already annoyed",
              correctBucket: "method",
              correction: "Timing is a procedure. One of the most changeable ones.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "The ninety seconds after something lands badly. What actually happens?",
          fields: [
            {
              id: "the-procedure",
              label: "What do the two of you do?",
              input: "text",
              placeholder: "Who speaks, who goes quiet, what gets said first.",
            },
            {
              id: "my-half",
              label: "Which part of that is yours?",
              input: "text",
              placeholder: "Only your half. Theirs isn't available to you.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is the trouble in the method, or has the caring gone?",
          enoughLabel: "The method — we both still care",
          needMoreLabel: "I'm not sure the caring is still there",
          needMoreIntro:
            "Then this isn't the problem you have, and skill won't reach it. That's worth knowing rather than working around, and it's a conversation to have with someone rather than a tool to apply.",
          needToKnowLabel: "What would tell me either way",
          observableLabel: "Something one of us would actually have to do",
        },
        {
          kind: "output",
          heading: "The procedure, and my half of it",
          body:
            "Not what either of you wants. What happens in the ninety seconds, which nobody chose.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Love supplies the motivation. Something else has to supply the method.",
            "Neither of us chose the procedure. We each brought one.",
            "\u201cWe don't know how\u201d is a better position than \u201cwe don't care enough.\u201d",
          ],
        },
      ],
      portable: [
        "Love supplies the motivation. Something else has to supply the method.",
        "Neither of us chose the procedure. We each brought one.",
        "\u201cWe don't know how\u201d is a better position than \u201cwe don't care enough.\u201d",
      ],
      myPlaysTemplate: {
        when: "When we both care and keep getting nowhere",
        move: "Name what happens in the ninety seconds, and which part is mine",
        lookingFor: "Whether the trouble is method or motivation",
        watchOut: "Naming their half — it isn't available to me",
        remember: "Trying harder at the wrong method produces more of the same, harder.",
      },
      fidelity: {
        correct:
          "The procedural sequence following a difficulty is described, with the reader's own part distinguished, and motivation separated from method.",
        misuse: [
          "Using it to establish that the other person is the problem.",
          "Applying it where the caring has genuinely gone.",
          "Describing what you both want rather than what you both do.",
        ],
        notMeaning:
          "It does not mean the method can be fixed, that both of you will change it, or that caring is sufficient.",
      },
    },

    // ─────────────────────── Play 2 · Pattern Interruption ──
    {
      playId: "the-recurring-move",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Recurring Move",
      positioning: "For the pattern, without the explanation you wanted.",
      recognitionGate: {
        prompt: "Do you keep arriving somewhere familiar without knowing why?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI want someone to explain why I keep ending up here.\u201d Fair request, and we're going to decline it.",
            "Confident explanations exist — about your childhood, your attachment, what you're drawn to. Some may even be true for you. None are established enough to hand someone as fact.",
            "And a wrong explanation held confidently is worse than none. It reorganises how you see yourself around something that might not be so.",
          ],
        },
        {
          kind: "learn",
          body: [
            "What's available instead is smaller and more reliable: the move itself. Not why you do it — what it is, and when it shows up.",
            "That's less satisfying than a reason. It's also the part that can be acted on, and \u201cwhy\u201d turns out not to be required.",
            "\u201cI'm trying to unlearn what I grew up with\u201d is the same work. Nothing gets removed — at best a second option becomes available alongside the first, and the first still arrives first for a long time.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Two or three situations that ended somewhere similar. Work forwards from the start, not backwards from the end.",
          fields: [
            {
              id: "the-similar-ending",
              label: "Where do you keep arriving?",
              input: "text",
              placeholder: "The familiar place, described plainly.",
            },
            {
              id: "the-move",
              label: "What did YOU do, early, in each of them?",
              input: "text",
              placeholder:
                "Something small and repeated. Earlier than feels significant.",
            },
            {
              id: "when-it-shows",
              label: "When does it tend to show up?",
              input: "chips",
              suggestions: [
                "Very early, before I know them",
                "When they pull back",
                "When things get serious",
                "When something goes wrong",
                "When I'm tired or things are hard elsewhere",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is the move something you could catch yourself doing?",
          enoughLabel: "Yes — I'd notice it",
          needMoreLabel: "Not yet — it's still a description",
          needMoreIntro:
            "Go smaller. The usable version is usually one step before the thing you first thought of, and it usually feels too minor to matter.",
          needToKnowLabel: "The smaller version of it",
          observableLabel: "Something I'd catch myself doing",
        },
        {
          kind: "output",
          heading: "The move, and when it shows up",
          body:
            "Not the reason. The thing itself \u2014 which is the part that can be acted on.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A wrong explanation held confidently is worse than none.",
            "Not why I do it. What it is, and when it shows up.",
            "Nothing gets removed. A second option becomes available.",
          ],
        },
      ],
      portable: [
        "A wrong explanation held confidently is worse than none.",
        "Not why I do it. What it is, and when it shows up.",
        "Nothing gets removed. A second option becomes available.",
      ],
      myPlaysTemplate: {
        when: "When I keep arriving somewhere familiar",
        move: "Find the recurring move, without requiring the reason for it",
        lookingFor: "Something small, mine, and repeated across situations",
        watchOut: "Adopting a confident explanation because it's satisfying",
        remember: "A recurrence isn't evidence nothing has changed. It's the expected condition.",
      },
      fidelity: {
        correct:
          "A small, repeated behaviour of the reader's own is identified across situations, without an explanatory account being adopted.",
        misuse: [
          "Adopting a confident causal explanation of yourself.",
          "Naming something the other people did.",
          "Treating a recurrence as proof that nothing has changed.",
        ],
        notMeaning:
          "It does not mean the pattern stops, that you now understand yourself, or that noticing prevents it.",
      },
      supportSignposts: [
        {
          id: "signpost-c25-the-why",
          heading: "If you want the why",
          body:
            "Wanting to understand where it comes from is legitimate, and a therapist can provide an appropriate place to explore it \u2014 someone who knows your history, can be wrong out loud with you, and can revise it as you go. That's a different thing from a text that has to guess, and it can be worth having if the question matters to you.",
        },
      ],
    },

    // ────────────────────── Play 3 · Growth Maintenance ──
    {
      playId: "one-thing-practised",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "One Thing, Practised",
      positioning: "For turning an aspiration into something available on a Tuesday.",
      recognitionGate: {
        prompt: "Do you know what you want to become and not what to do about it?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI want to communicate better.\u201d \u201cI want to become emotionally healthier.\u201d \u201cI want to feel secure.\u201d",
            "All true, all sincere, and none of them available at the moment they'd be needed.",
            "Intentions arrive when you're calm and thinking about the relationship — which is exactly when they aren't needed. Habits arrive at the moment of difficulty, when you aren't thinking about intentions at all.",
          ],
        },
        {
          kind: "learn",
          body: [
            "So the useful unit is small and specific enough to survive the moment. \u201cI want to communicate better\u201d isn't available mid-argument. \u201cI'll ask what they meant before I answer\u201d might be.",
            "One of them. Not a set. A list of good practices behaves exactly like a list of good intentions, and neither is present when it matters.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Take one aspiration and bring it down two levels — to a thing you'd do in a specific moment.",
          fields: [
            {
              id: "the-aspiration",
              label: "Which one matters most to you?",
              input: "chips",
              suggestions: [
                "Communicate better",
                "Stop repeating old patterns",
                "Feel secure",
                "Trust myself",
                "Love without losing myself",
                "Become a better partner",
              ],
            },
            {
              id: "the-moment",
              label: "In what specific moment would it be needed?",
              input: "text",
              placeholder: "Concrete. \u201cWhen they go quiet\u201d, \u201cwhen I feel dismissed\u201d.",
            },
            {
              id: "the-practice",
              label: "What's the one thing you'd do in that moment?",
              input: "text",
              placeholder: "Small enough to remember while it's happening.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "One practice, one moment. Not a set.",
          conditionLabel: "The moment I'll watch for",
          thenLabel: "And the one thing I'll do",
          actions: [
            "Ask what they meant before I answer",
            "Say the thing rather than manage around it",
            "Wait until I'm not annoyed to raise it",
            "Stay in the room",
            "Name what I'm feeling rather than act on it",
          ],
          controlCheck:
            "One practice, done badly at first, beats a list of good ones \\u2014 a set of practices behaves exactly like a set of intentions.",
        },
        {
          kind: "output",
          heading: "One thing, one moment",
          body:
            "Expect to do it badly for a while. That's what practice is, and it's the part reading can't cover.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Intentions arrive when they aren't needed. Habits arrive when they are.",
            "One practice, not a set. A set is just intentions again.",
            "Badly, repeatedly, is the mechanism.",
          ],
        },
      ],
      portable: [
        "Intentions arrive when they aren't needed. Habits arrive when they are.",
        "One practice, not a set. A set is just intentions again.",
        "Badly, repeatedly, is the mechanism.",
      ],
      myPlaysTemplate: {
        when: "When I know what I want to become and not what to do",
        move: "Bring one aspiration down to one thing in one moment",
        lookingFor: "Whether it's small enough to remember while it's happening",
        watchOut: "Choosing several — a set of practices is just intentions again",
        remember: "Collecting tools can become its own way of not practising any.",
      },
      fidelity: {
        correct:
          "One aspiration is reduced to a single specific practice tied to a specific moment.",
        misuse: [
          "Choosing several practices at once.",
          "Choosing something too abstract to perform under pressure.",
          "Treating a poor first attempt as evidence it doesn't work.",
        ],
        notMeaning:
          "It does not mean the practice will work, that you'll remember it, or that one practice changes the pattern.",
      },
    },
  ],

  literature: C25_LITERATURE,

  missions: [
    {
      id: "mission-c25-procedure",
      version: 1,
      playId: "love-and-skill",
      title: "Watch the ninety seconds, once",
      instruction:
        "Next time something lands badly, watch what the two of you do. Don't change it. Note your half afterwards.",
      linkToOperation: "Observing the procedural sequence following a difficulty",
      attemptMeaning: "You watched. Changing it wasn't the ask.",
      suitability:
        "If watching turns into building a case about their half, stop — that's the misuse and it's an easy one to fall into.",
      progression: [
        {
          id: "rung-c25-procedure-2",
          instruction: "Change one thing about your half and see what the sequence does.",
        },
      ],
    },
    {
      id: "mission-c25-move",
      version: 1,
      playId: "the-recurring-move",
      title: "Watch for the move for a month",
      instruction:
        "Keep it in mind. If you catch it, note when — during, just after, or weeks later. That progression is the measure.",
      linkToOperation: "Recognising a recurring behaviour as it activates",
      attemptMeaning:
        "You watched. Catching it late is still catching it.",
      suitability:
        "If you find yourself reaching for an explanation of why you do it, notice that and set it aside.",
      progression: [
        {
          id: "rung-c25-move-2",
          instruction: "Name a smaller, earlier version of the same move.",
        },
      ],
    },
    {
      id: "mission-c25-practice",
      version: 1,
      playId: "one-thing-practised",
      title: "Do the one thing, three times",
      instruction:
        "Three occasions. Badly is fine. Note only whether you did it, not how well it went.",
      linkToOperation: "Converting an intention into a practised habit",
      attemptMeaning:
        "You did it. Doing it badly is the expected first version.",
      suitability:
        "If you find yourself adding a second practice, don't. One at a time is the whole method.",
      progression: [
        {
          id: "rung-c25-practice-2",
          instruction: "Keep it going for a month before adding anything.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c25-procedure",
      version: 1,
      playId: "love-and-skill",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Watched the ninety seconds",
          "Named my half of it",
          "Separated method from caring",
          "Built a case about their half",
        ],
      },
      performedOperation: {
        label: "Did you describe the procedure and your own part in it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's procedural, not personal",
          "What my half actually is",
          "That the caring might be the issue",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I could only see their half",
          "It happened too fast to watch",
          "It's not the method, it's something else",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c25-move",
      version: 1,
      playId: "the-recurring-move",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Found the move across situations",
          "Kept it small and mine",
          "Left the explanation alone",
          "Reached for a reason instead",
        ],
      },
      performedOperation: {
        label: "Did you identify a small recurring move of your own?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What the move actually is",
          "When it tends to show up",
          "That I've been looking for a reason instead",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I wanted the explanation more than the move",
          "The situations were too different",
          "I found it and did it anyway",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c25-practice",
      version: 1,
      playId: "one-thing-practised",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Picked one thing, not several",
          "Tied it to a specific moment",
          "Did it badly and kept going",
          "Added more practices",
        ],
      },
      performedOperation: {
        label: "Did you reduce it to one practice in one moment?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the general version was never usable",
          "That one thing is enough to start",
          "How hard it is in the moment",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I forgot it when it mattered",
          "I picked something too abstract",
          "I collected more instead of practising",
          "Nothing stuck",
        ],
      },
    },
  ],
};
