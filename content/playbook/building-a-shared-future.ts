/**
 * Cluster 21 — "Feeling Like We Want Different Things" — VOLUME I
 * The Relationship Playbook™ · Building a Shared Future
 *
 * Track: Expiration (28 of 48 statements). Task = Acceptance.
 * Core Need: TO BUILD PARTNERSHIP. Plays-only.
 *
 * ⚠ TWO VOLUMES, owner-ruled. Volume I is the couple already together
 *   discovering a mismatch. Volume II (20 statements, Exclusivity) is someone
 *   still dating, working out when to raise things and what matters — authored
 *   separately. Readers in that position route out via `rec-c21-still-dating`.
 *
 * ⚠ MUST NOT PUSH TOWARD ENDING. Expiration is the track; this reader has
 *   decided nothing. Same constraint as Cluster 11.
 *
 * ⚠ CULTURAL AND RACIAL DIFFERENCE — real and permanent, not a problem to be
 *   solved. Nothing may suggest either person become less themselves. The
 *   workable thing is the repeating misunderstanding, never the difference.
 *
 * ⚠ FAITH — neutral across all faiths and none. No position taken, in any
 *   direction, on what anyone ought to believe or practise.
 *
 * ⚠ CLAIM SCOPE. May claim: work out which differences are load-bearing; tell a
 *   permanent difference from a repeating misunderstanding; say what you want it
 *   to become. MUST NOT CLAIM: that difference can be overcome, that love is or
 *   isn't enough, that any value should be compromised, or that staying or
 *   leaving is right.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C21_LITERATURE } from "./building-a-shared-future-literature";

export const BUILDING_A_SHARED_FUTURE: PlaybookContent = {
  playbookKey: "building-a-shared-future",
  playbookVersion: 1,
  displayName: "Building a Shared Future",

  opening: {
    title: "Not every difference is the same size",
    body: [
      "You've noticed a gap — not a fight, not a betrayal, but a difference in what you each want your life to look like.",
      "Most differences are permanent and completely fine. A few are permanent and load-bearing, and those get decided about rather than worked on. And some aren't differences at all — they're the same misunderstanding in a new costume.",
      "Most of the exhaustion here comes from treating all three the same way.",
    ],
    manifestations: [
      "We're becoming different people.",
      "I don't know if we're headed in the same direction.",
      "We have different values.",
      "We keep having the same misunderstandings.",
    ],
    cta: "Start by sorting which is which",
  },

  recognitionCards: [
    {
      id: "rec-c21-still-dating",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I'm still dating and trying to work out what matters.",
      validationCopy:
        "This Playbook is for people already together who've found a gap. What you're describing sounds earlier — working out when to raise the big things, and how much difference actually matters before you're committed. That's a different situation with different answers, and the tools here assume a shared life that's already being built. Look for the one about asking better questions early.",
      secondaryExamples: [
        "I don't know when to talk about marriage.",
        "I want to ask better questions early.",
        "I don't know how much compromise is healthy.",
      ],
    },
    {
      id: "rec-c21-different-directions",
      role: "route",
      pathwayPlayId: "which-differences-are-load-bearing",
      headline: "Our goals don't match anymore.",
      explanation:
        "A load-bearing difference is one where both lives can't happen. Not one where it would be harder — one where it can't.",
      secondaryExamples: [
        "I don't know if we're headed in the same direction.",
        "We have different values.",
        "I don't know if love is enough to overcome our differences.",
      ],
    },
    {
      id: "rec-c21-outgrown",
      role: "route",
      pathwayPlayId: "the-thing-neither-of-us-says",
      headline: "I feel like I've outgrown my relationship.",
      explanation:
        "Uncomfortable in both directions, which is why it's usually silent — and whole years get spent on a mismatch nobody has described out loud.",
      secondaryExamples: [
        "I feel like I'm growing alone.",
        "I want more out of life than my partner does.",
        "We're becoming different people.",
      ],
    },
    {
      id: "rec-c21-same-misunderstanding",
      role: "route",
      pathwayPlayId: "the-rule-underneath",
      headline: "We keep having the same misunderstanding.",
      explanation:
        "A misunderstanding that repeats isn't one anymore. It's a pattern, and patterns are workable in a way single events aren't.",
      secondaryExamples: [
        "Our families have different expectations.",
        "We experience the world differently.",
        "I don't know how to navigate family traditions.",
      ],
    },
    {
      id: "rec-c21-what-i-want",
      role: "route",
      pathwayPlayId: "what-i-want-us-to-be",
      headline: "I don't want our differences to become divisions.",
      explanation:
        "Notice that this doesn't ask them to change. It describes a way of being together that holds difference rather than resolving it.",
      secondaryExamples: [
        "I want us to feel like a team despite our differences.",
        "I don't want either of us to lose ourselves.",
        "I want us to understand each other's experiences better.",
      ],
    },
  ],

  plays: [
    // ───────────────────────────────────────────── Play 1 ──
    {
      playId: "which-differences-are-load-bearing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Which Differences Are Load-Bearing?",
      positioning: "For sorting what can be lived with from what can't.",
      recognitionGate: {
        prompt: "Are you trying to work out how much your differences actually matter?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A load-bearing difference is one where the life you each want cannot both happen. Not one where it would be harder — one where it can't.",
            "Most differences aren't. Two people are never going to want identical lives, and nearly every long relationship contains people who want somewhat different ones.",
            "The exhausting part is treating them all the same way: working hard on the permanent ones and letting the workable ones repeat.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The ones that most often turn out structural: children, where you live when it's genuinely fixed, how much of the week faith or practice shapes, whether it's monogamous, and what money is for.",
            "The ones that look structural and usually aren't: different interests, different politics, different social appetites, different paces.",
            "You're the only one who can say which of yours is which. \u201cThat wouldn't bother me\u201d from someone else isn't information about your relationship.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Structural, or livable?",
          situation:
            "You've been together a few years. Several differences have surfaced and you're trying to work out which of them actually decides anything.",
          buckets: [
            { id: "structural", label: "Both lives can't happen" },
            { id: "livable", label: "Harder, but livable" },
          ],
          items: [
            {
              id: "sort-c21-children",
              text: "One of you wants children and the other doesn't",
              correctBucket: "structural",
              correction:
                "The clearest one there is. It doesn't resolve — it gets decided about.",
            },
            {
              id: "sort-c21-politics",
              text: "You vote differently",
              correctBucket: "livable",
              correction:
                "Common, and workable for many couples — though it depends how much of your week it touches.",
            },
            {
              id: "sort-c21-city",
              text: "Their job is fixed in one city and yours is fixed in another",
              correctBucket: "structural",
              correction:
                "If both are genuinely fixed, this is arithmetic rather than attitude.",
            },
            {
              id: "sort-c21-social",
              text: "One of you wants people round constantly and the other doesn't",
              correctBucket: "livable",
              correction: "A negotiation about the calendar, not about the life.",
            },
            {
              id: "sort-c21-practice",
              text: "Faith shapes most of one person's week and none of the other's",
              correctBucket: "structural",
              correction:
                "It's the practice rather than the belief that decides this one.",
            },
            {
              id: "sort-c21-ambition",
              text: "One of you is more ambitious than the other",
              correctBucket: "livable",
              correction:
                "Usually a difference in appetite, not in values — though it needs saying out loud.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your own list. Only you can sort this one.",
          fields: [
            {
              id: "the-differences",
              label: "What are the actual differences between you?",
              input: "text",
              placeholder: "All of them, including the ones that feel small.",
            },
            {
              id: "which-structural",
              label: "Which of those means both lives genuinely can't happen?",
              input: "text",
              placeholder:
                "Usually fewer than expected. If none, that's a real finding.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Has the structural one — if there is one — ever been discussed directly?",
          enoughLabel: "Yes, properly",
          needMoreLabel: "Not directly",
          needMoreIntro:
            "Very common. Structural differences get circled for years without being named, because naming them makes them real.",
          needToKnowLabel: "What I'd want to actually know from them",
          observableLabel: "Something they'd have to say plainly",
        },
        {
          kind: "output",
          heading: "What's actually load-bearing",
          body:
            "A shorter list than you started with, usually. That's the point of the exercise, not a conclusion about the relationship.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Structural means both lives can't happen. Not that it would be harder.",
            "Most differences aren't structural. A few are, and those get decided about.",
            "Only I can sort my own list.",
          ],
        },
      ],
      portable: [
        "Structural means both lives can't happen. Not that it would be harder.",
        "Most differences aren't structural. A few are, and those get decided about.",
        "Only I can sort my own list.",
      ],
      myPlaysTemplate: {
        when: "When I can't tell how much our differences actually matter",
        move: "Sort them into what can be lived with and what genuinely can't",
        lookingFor: "Whether both lives can actually happen, not whether it'd be hard",
        watchOut: "Sorting to reach a conclusion I've already come to",
        remember: "Someone else's list won't fit me. Nor will mine fit them.",
      },
      fidelity: {
        correct:
          "Differences are sorted by whether both lives can happen, and the structural ones are named separately from the livable ones.",
        misuse: [
          "Sorting to justify a decision already made.",
          "Treating every difference as structural.",
          "Using someone else's list of what should matter.",
        ],
        notMeaning:
          "It does not mean the structural ones are fatal, that the livable ones are easy, or that you should act on the result.",
      },
    },

    // ───────────────────────────────────────────── Play 2 ──
    {
      playId: "the-thing-neither-of-us-says",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Thing Neither of Us Says",
      positioning:
        "For the gap that's grown in silence. You work out how to say it — then you say it.",
      recognitionGate: {
        prompt: "Have you been carrying something about the two of you that's never been said?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cI feel like I'm growing alone.\u201d \u201cI've outgrown this.\u201d \u201cI want more out of life than they do.\u201d",
            "These go unsaid for a specific reason. The one who's moving can't mention it without sounding like they think they're better. The one who isn't can't mention it without sounding resentful of someone else's momentum.",
            "So the gap grows in silence, and both people privately conclude the other doesn't care.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Wanting more from your life isn't a criticism of someone who wants less. Those are different appetites, not different values — though they get treated as the second, which is what makes it so hard to raise.",
            "Surprisingly often the other person doesn't know. Whole years get spent on a mismatch that has never actually been described out loud.",
            "Which means the first move isn't a decision. It's a description.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Saying this out loud can feel like starting something you can't stop.",
            "It might be. It's also worth knowing that the silence has a cost that's already being paid, and it compounds.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Describe it rather than conclude it. A description invites a response; a verdict invites a defence.",
          fields: [
            {
              id: "the-gap",
              label: "What's the thing you haven't said?",
              input: "text",
              placeholder: "As plainly as you can, without the conclusion attached.",
            },
            {
              id: "do-they-know",
              label: "Do they know?",
              input: "chips",
              suggestions: [
                "No — I don't think so at all",
                "They might have sensed it",
                "I've hinted",
                "Yes, we've discussed it",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "How you'll say it",
          helper:
            "A description, not a verdict — and about you rather than about them. You might start with \u201cThere's something I've been carrying and I want to say it badly rather than not at all\u201d or \u201cI don't think this is a criticism, but\u2026\u201d",
        },
        {
          kind: "realWorldUse",
          useWhen: "You're both calm, nothing is pending, and there's time afterwards.",
          doThis:
            "Say it once, as a description of where you are. Don't attach a conclusion, don't ask them to fix it, and leave room for them to say something back — they may have been carrying their own version.",
          safetyNote:
            "If saying honest things about the relationship isn't safe with them, that's a different situation and this tool doesn't apply.",
        },
        {
          kind: "output",
          heading: "What I said",
          body:
            "A description, said once. Whatever comes back is more than the silence was giving you.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Different appetites, not different values.",
            "Describe it. Don't conclude it.",
            "They may not know. Years get spent on a mismatch nobody has described.",
          ],
        },
      ],
      portable: [
        "Different appetites, not different values.",
        "Describe it. Don't conclude it.",
        "They may not know. Years get spent on a mismatch nobody has described.",
      ],
      myPlaysTemplate: {
        when: "When there's a gap between us that's never been said out loud",
        move: "Describe where I am, once, without attaching a conclusion",
        lookingFor: "Whether they knew, and whether they have their own version",
        watchOut: "Turning a description into a verdict — that gets defended against",
        remember: "The silence is already costing something, and it compounds.",
      },
      fidelity: {
        correct:
          "The unspoken gap is described plainly to the other person, without a conclusion or a demand attached.",
        misuse: [
          "Delivering it as a verdict about them.",
          "Using it as the opening of an exit conversation you've already decided on.",
          "Saying it in the middle of an argument.",
        ],
        notMeaning:
          "It does not mean they'll understand, that the gap closes, or that saying it commits you to anything.",
      },
    },

    // ───────────────────────────────────────────── Play 3 ──
    {
      playId: "the-rule-underneath",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Rule Underneath",
      positioning: "For the misunderstanding that keeps coming back in a new costume.",
      recognitionGate: {
        prompt: "Do you resolve the same thing repeatedly and find it returns?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "A misunderstanding that repeats isn't a misunderstanding anymore. It's a pattern — and patterns are workable in a way single events aren't.",
            "What makes them repeat is that each instance gets handled as an instance. This particular Christmas, this particular comment, this particular relative.",
            "The rule underneath never gets stated — whose family takes precedence, what gets explained and what gets assumed, who does the accommodating and how often.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Some of what looks like a repeating misunderstanding is actually a permanent difference, and that's worth separating. You do experience the world differently, and that isn't a gap that closes with effort.",
            "Nothing here suggests either of you should become less yourself. The difference isn't the target. The unnamed rule is.",
            "And where one person is describing something the other hasn't lived, the conversation will sometimes be painful even when it's going well. That isn't a sign it's going badly.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Find the rule rather than the instance. The instances are the symptom.",
          fields: [
            {
              id: "the-instances",
              label: "What keeps happening? Two or three times it's come up.",
              input: "text",
              placeholder: "The specific occasions, briefly.",
            },
            {
              id: "the-rule",
              label: "What's the unstated rule underneath them?",
              input: "text",
              placeholder:
                "Whose family goes first, who explains, who accommodates, what gets assumed.",
            },
            {
              id: "permanent-or-pattern",
              label: "Is this a rule that could be named, or a difference that just is?",
              input: "chips",
              suggestions: [
                "A rule — it could be agreed",
                "A permanent difference",
                "Both, tangled together",
                "I'm not sure",
              ],
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro:
            "Name the rule when nothing is imminent. Mid-instance almost never works.",
          conditionLabel: "The rule I want to name",
          thenLabel: "And when I'll raise it",
          actions: [
            "On an ordinary evening, nothing pending",
            "Before the next occasion, not during it",
            "After this one has fully settled",
            "This week, while it's clear in my head",
          ],
          controlCheck:
            "I'm naming a rule we could agree, not asking them to be less themselves \u2014 and I'm ready for their version of the rule to differ from mine.",
        },
        {
          kind: "output",
          heading: "The rule underneath",
          body:
            "Naming it is a bigger conversation than any single instance, and it's the only one that stops the repetition.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Resolve the instance and it returns in a new costume.",
            "The difference isn't the target. The unnamed rule is.",
            "Not mid-instance. When nothing is pending.",
          ],
        },
      ],
      portable: [
        "Resolve the instance and it returns in a new costume.",
        "The difference isn't the target. The unnamed rule is.",
        "Not mid-instance. When nothing is pending.",
      ],
      myPlaysTemplate: {
        when: "When the same misunderstanding keeps returning",
        move: "Name the unstated rule rather than resolving another instance",
        lookingFor: "Whether it's a rule that could be agreed or a difference that just is",
        watchOut: "Treating a permanent difference as a pattern to be fixed",
        remember: "Neither of us should have to become less ourselves.",
      },
      fidelity: {
        correct:
          "The unstated rule beneath a repeating instance is named, at a time when nothing is pending, and distinguished from a permanent difference.",
        misuse: [
          "Raising it mid-instance.",
          "Naming a rule that requires the other person to be less themselves.",
          "Treating a permanent difference as a pattern to correct.",
        ],
        notMeaning:
          "It does not mean the rule will be agreed, that the instances stop, or that the underlying difference changes.",
      },
    },

    // ───────────────────────────────────────────── Play 4 ──
    {
      playId: "what-i-want-us-to-be",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What I Want Us to Be",
      positioning:
        "For the generous thing you've never said. You find the words — then you say them.",
      recognitionGate: {
        prompt: "Have they only ever heard about the differences?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "In amongst all of this, people say what they actually want, and it's usually the most concrete thing in the whole conversation.",
            "I don't want either of us to lose ourselves. I want a relationship that helps us both become better. I don't want our differences to become divisions. I want us to feel like a team.",
            "Notice that none of those ask the other person to change.",
          ],
        },
        {
          kind: "learn",
          body: [
            "They describe a way of being together that holds difference rather than resolving it — which is a different and more achievable aim than agreement.",
            "They're also generous, and specific, and most partners in this situation have never heard them. They've only heard the differences.",
            "Which means saying one is genuinely new information, not a repeat of a conversation you've already had.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Which of these is closest to true for you?",
          fields: [
            {
              id: "what-i-want",
              label: "What do you want this to become?",
              input: "chips",
              suggestions: [
                "Neither of us losing ourselves",
                "Both of us becoming better",
                "Our differences not becoming divisions",
                "Understanding each other's experiences better",
                "Feeling like a team",
              ],
            },
            {
              id: "in-my-words",
              label: "Say it in your own words",
              input: "text",
              placeholder: "Specific to you and them, rather than general.",
            },
          ],
        },
        {
          kind: "realWorldUse",
          useWhen:
            "An ordinary moment, not after a disagreement and not as part of a bigger conversation.",
          doThis:
            "Say the one thing. Nothing attached — no request, no comparison, no 'but'. Then let it sit rather than explaining it.",
        },
        {
          kind: "output",
          heading: "What I said I want",
          body:
            "Most partners in this position have only ever heard about the differences. This is new information.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "None of what I want asks them to change.",
            "Holding difference is a more achievable aim than agreement.",
            "They've only ever heard the differences.",
          ],
        },
      ],
      portable: [
        "None of what I want asks them to change.",
        "Holding difference is a more achievable aim than agreement.",
        "They've only ever heard the differences.",
      ],
      myPlaysTemplate: {
        when: "When they've only ever heard about our differences",
        move: "Say what I want us to become, with nothing attached",
        lookingFor: "Whether it lands as new — it usually does",
        watchOut: "Attaching a request or a 'but' to it",
        remember: "It doesn't ask them to change. That's what makes it sayable.",
      },
      fidelity: {
        correct:
          "A statement of what the reader wants the relationship to become is said plainly, with no request or comparison attached.",
        misuse: [
          "Attaching a demand to it.",
          "Saying it immediately after a disagreement as a repair move.",
          "Using it as the preamble to raising a difference.",
        ],
        notMeaning:
          "It does not mean they'll want the same thing, that the differences shrink, or that saying it changes anything on its own.",
      },
    },
  ],

  literature: C21_LITERATURE,

  missions: [
    {
      id: "mission-c21-sort",
      version: 1,
      playId: "which-differences-are-load-bearing",
      title: "Say the structural one out loud",
      instruction:
        "If you found one, say it plainly to them — as a fact about what you each need, not as an ultimatum.",
      linkToOperation: "Naming a structural difference directly",
      attemptMeaning:
        "You named it. It doesn't decide anything by itself.",
      suitability:
        "If you found none, that's a real result and worth sitting with rather than looking harder.",
      progression: [
        {
          id: "rung-c21-sort-2",
          instruction: "Ask them to sort the same list and compare what you each called structural.",
        },
      ],
    },
    {
      id: "mission-c21-say-it",
      version: 1,
      playId: "the-thing-neither-of-us-says",
      title: "Come back to it a fortnight later",
      instruction:
        "You said it in the tool. Two weeks on, ask what they made of it — rather than waiting to see.",
      linkToOperation: "Describing an unspoken gap and following it up",
      attemptMeaning:
        "You followed up. A flat response is information about where they are.",
      suitability:
        "If saying it opened something bigger than expected, that's worth having someone alongside you for.",
      progression: [
        {
          id: "rung-c21-say-it-2",
          instruction: "Ask whether they've been carrying a version of their own.",
        },
      ],
    },
    {
      id: "mission-c21-rule",
      version: 1,
      playId: "the-rule-underneath",
      title: "Name the rule, once, when nothing is pending",
      instruction:
        "Raise the rule rather than the next instance. On an ordinary day, with time afterwards.",
      linkToOperation: "Naming an unstated rule beneath a repeating pattern",
      attemptMeaning:
        "You named it. Their version differing from yours is the expected outcome, not a failure.",
      suitability:
        "If the repeating thing is a permanent difference rather than a rule, this won't help — and knowing that is the useful part.",
      progression: [
        {
          id: "rung-c21-rule-2",
          instruction: "Agree what happens at the next specific occasion, in advance.",
        },
      ],
    },
    {
      id: "mission-c21-want",
      version: 1,
      playId: "what-i-want-us-to-be",
      title: "Say a second one, later",
      instruction:
        "You said one in the tool. Say another in a few weeks — a different one, still with nothing attached.",
      linkToOperation: "Stating a generous aim without a request attached",
      attemptMeaning:
        "You said it. Whether they respond in kind isn't the measure.",
      suitability:
        "If attaching a 'but' feels unavoidable, that's worth noticing — it usually means there's a request that wants making separately.",
      progression: [
        {
          id: "rung-c21-want-2",
          instruction: "Ask them what they'd want it to become.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c21-sort",
      version: 1,
      playId: "which-differences-are-load-bearing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Sorted by whether both lives can happen",
          "Found fewer structural ones than expected",
          "Named one out loud",
          "Called everything structural",
        ],
      },
      performedOperation: {
        label: "Did you sort by whether both lives can actually happen?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That most of it is livable",
          "That there is a structural one",
          "That we've never discussed it directly",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Everything felt structural",
          "I found one and didn't want to",
          "I couldn't tell which was which",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c21-say-it",
      version: 1,
      playId: "the-thing-neither-of-us-says",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Described it rather than concluding it",
          "Said it at a calm moment",
          "Left room for their version",
          "It came out as a verdict",
        ],
      },
      performedOperation: {
        label: "Did you describe the gap without attaching a conclusion?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That they genuinely didn't know",
          "That they'd been carrying their own version",
          "How long it had been unsaid",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It became an argument",
          "They took it as a criticism",
          "I couldn't get it out",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c21-rule",
      version: 1,
      playId: "the-rule-underneath",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named the rule, not the instance",
          "Raised it when nothing was pending",
          "Separated the rule from the difference",
          "Handled another instance instead",
        ],
      },
      performedOperation: {
        label: "Did you name the rule beneath the instances?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That there was a rule nobody had stated",
          "That it's a permanent difference, not a rule",
          "That we'd each assumed a different rule",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't find the rule",
          "Their version was very different from mine",
          "It turned into another instance",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c21-want",
      version: 1,
      playId: "what-i-want-us-to-be",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said what I want with nothing attached",
          "Picked an ordinary moment",
          "Let it sit without explaining",
          "Attached a request to it",
        ],
      },
      performedOperation: {
        label: "Did you say it with no request or comparison attached?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That they'd never heard it before",
          "That they want something similar",
          "How much of what I say is about differences",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't say it without a 'but'",
          "It landed flat",
          "It felt like pretending things are fine",
          "Nothing stuck",
        ],
      },
    },
  ],
};
