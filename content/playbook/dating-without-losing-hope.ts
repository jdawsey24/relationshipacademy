/**
 * Cluster 4 — "Feeling Like You Don't Belong in Today's Dating World"
 * The Relationship Playbook™ · Learning to Date Without Losing Hope
 *
 * Authored 29 Jul 2026. §0 DECISION: PLAYS-ONLY. No `simulations[]`,
 * no `exposureLoad`, no engine change. Ships under the amended invariant
 * permitting a Play without a paired Experience (PD-9, owner-approved).
 *
 * SCHEMA-CONFORMED by Claude Code, 29 Jul 2026, against contentSchema.ts +
 * contentValidate.ts. Corrections from the authored draft:
 *   - shift/learn screens: removed non-existent `heading` (no slot; body only).
 *   - scenarioSort: added required `situation`.
 *   - ownTurn: `heading` → `intro`; the Play-3 post-answer `note` became a
 *     short `learn` beat (ownTurn has no `note`).
 *   - ruleBuilder: real primitive is `actions: string[]` + `controlCheck: string`.
 *     The draft's two object-lists were reshaped — the "what counts as evidence"
 *     / "limit + cadence" selections moved to `ownTurn` chips/text screens; the
 *     ruleBuilder now carries the response moves (`actions`) + one guardrail
 *     (`controlCheck`). `heading` → `intro`.
 *   - output.body: string[] → single string.
 *   - portable screen: filled required `heading` + `steps` (mirrors the Play's
 *     top-level portable[]).
 *   - outputEditor: DEFERRED (was `true`, not a valid OutputEditor object) —
 *     the Keep/Update loop uses the v0 path; add per-Play editors in a follow-up.
 *
 * Derived against Framework Version 1.9 (Manual Lag Rule applied).
 *   PE-1 / PE-3 → Perceptual Lens (RLC-FR-001)
 *   PE-2        → Developmental Lens, 5 competencies (Resolution A)
 *   PE-4        → Personal Capacity Regulation (RLC-FR-002) — NOT a competency
 *
 * ⚠ CLAIM SCOPE. May claim: tell whether someone is actually engaged; stop
 *   spending where they are not; understand why people vanish; decide whether
 *   to keep going. MUST NOT claim: that dating improves, that the reader will
 *   feel more positive, that they will meet someone, that the problem is their
 *   attitude. No copy may imply the reader lacks judgement — PE-4 is capacity.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C4_LITERATURE } from "./dating-without-losing-hope-literature";

export const DATING_WITHOUT_LOSING_HOPE: PlaybookContent = {
  // ── §1 top level ───────────────────────────────────────────────
  playbookKey: "dating-without-losing-hope",
  playbookVersion: 1,
  displayName: "Learning to Date Without Losing Hope",

  opening: {
    title: "Before anything else",
    body: [
      "Most of what you've concluded about dating is probably accurate. We're not going to argue with it.",
      "What we're going to do is separate two things that have started running together: what you've noticed about dating in general, and what any particular person has actually done.",
      "Nothing here will tell you to be more positive.",
    ],
    cta: "See what sounds like me",
  },

  // ── §2 recognition ─────────────────────────────────────────────
  recognitionCards: [
    {
      id: "rec-not-imagining-it",
      role: "validate",
      pathwayPlayId: null,
      headline: "This is exhausting and I'm tired of pretending it isn't.",
      validationCopy:
        "You're describing the average experience, not a personal failing. Roughly four out of five people using apps say the same. Nothing here needs fixing about that — it's the starting point, not the problem.",
      secondaryExamples: [
        "I'm tired of starting over.",
        "Every conversation dies.",
        "Dating shouldn't be this hard.",
      ],
    },
    {
      id: "rec-pattern-vs-person",
      role: "route",
      pathwayPlayId: "them-or-the-pattern",
      headline: "I already know how it's going to go before it starts.",
      explanation:
        "A read about dating in general has started answering questions about specific people.",
      secondaryExamples: [
        "Nobody wants a relationship anymore.",
        "Everyone's just keeping options open.",
        "People treat each other like options.",
      ],
    },
    {
      id: "rec-who-is-serious",
      role: "route",
      pathwayPlayId: "whos-actually-here",
      headline: "I can't tell who's actually interested and who's just being pleasant.",
      explanation:
        "Warmth and effort read the same on a screen. They aren't the same signal.",
      secondaryExamples: [
        "I don't know who's serious.",
        "Why do people breadcrumb?",
        "I keep matching with people who never respond.",
      ],
    },
    {
      id: "rec-too-many-open",
      role: "route",
      pathwayPlayId: "how-many-at-once",
      headline: "Everyone's started to blur together.",
      explanation:
        "Not a judgement problem. Volume wears down anyone's ability to read individuals.",
      secondaryExamples: [
        "Dating apps are exhausting.",
        "I don't know if apps are worth it anymore.",
      ],
    },
  ],

  // ── §3 plays ───────────────────────────────────────────────────
  plays: [
    // ─────────────────────────────── 3a ──
    {
      playId: "them-or-the-pattern",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Them, or the Pattern?",
      positioning:
        "For when you've already decided how someone goes before they've done anything.",
      recognitionGate: {
        prompt:
          "Have you found yourself sure how someone will behave before they've shown you?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "You've got a read on how this usually goes. You didn't invent it — you earned it.",
            "The trouble is that a read about people in general has started answering questions about specific people. And once it does that, you stop watching, because you think you already know.",
            "This isn't about deciding you were wrong. It's about putting the general read in one hand and the actual person in the other, and looking at them separately.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Two different things get confused here.",
            "What you've noticed is a pattern across a lot of people. It's probably accurate.",
            "What this person has done is a much smaller pile of evidence about one person.",
            "The first can be completely true and still tell you nothing reliable about the second. That's not optimism — it's just how general and specific work.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Put each of these on the right side.",
          situation:
            "Here are things that might go through your head while you're talking to someone new.",
          buckets: [
            { id: "general", label: "A read about people in general" },
            { id: "specific", label: "Something this person did" },
          ],
          items: [
            {
              id: "sort-p1-nobody-serious",
              text: "Nobody on here is serious",
              correctBucket: "general",
              correction:
                "That one's about everyone. Have another look — is it about this person?",
            },
            {
              id: "sort-p1-two-days",
              text: "They took two days to reply",
              correctBucket: "specific",
              correction:
                "That's a thing that happened, with one person. It belongs on the specific side.",
            },
            {
              id: "sort-p1-options-open",
              text: "Everyone's keeping options open",
              correctBucket: "general",
              correction: "That's the pool, not the person. Move it across.",
            },
            {
              id: "sort-p1-asked-about-surgery",
              text: "They asked about my sister's surgery",
              correctBucket: "specific",
              correction:
                "Someone did that. It's evidence about them, whatever it turns out to mean.",
            },
            {
              id: "sort-p1-always-ends",
              text: "This always ends the same way",
              correctBucket: "general",
              correction:
                "“Always” is the giveaway — that's a read across many people.",
            },
            {
              id: "sort-p1-cancelled-twice",
              text: "They cancelled twice and didn't rebook",
              correctBucket: "specific",
              correction:
                "That's a specific thing this person did. It goes on the specific side.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Think of someone you're talking to, or recently were.",
          fields: [
            {
              id: "general-read",
              input: "text",
              label: "What's your general read telling you about how this goes?",
              placeholder: "The thing you already expect…",
            },
            {
              id: "actual-facts",
              input: "text",
              label:
                "What has this person actually done? Just the facts — what happened, not what it meant.",
              placeholder: "Replied on Tuesday. Suggested a time, then went quiet…",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Look at that second list. Is there enough there to conclude what you've concluded?",
          enoughLabel: "Yes — their actions match what I expected",
          needMoreLabel: "No — I concluded it before they'd shown me much",
          needMoreIntro:
            "Fine. That's the most common answer, and it's the useful one.",
          needToKnowLabel: "What I'd need to see to know either way",
          observableLabel: "Something I could actually notice happening",
        },
        {
          kind: "output",
          heading: "What I actually know",
          body: "Your general read stays where it is. This is just what's true about one person.",
        },
        {
          kind: "portable",
          heading: "Take it with you",
          steps: [
            "The read is about the pool. This person is a separate question.",
            "If I already know how it goes, I've stopped watching.",
            "What have they actually done — not what did it mean?",
          ],
        },
      ],
      portable: [
        "The read is about the pool. This person is a separate question.",
        "If I already know how it goes, I've stopped watching.",
        "What have they actually done — not what did it mean?",
      ],
      myPlaysTemplate: {
        when: "When I'm already sure how someone will behave",
        move: "Separate my general read from what this person has actually done",
        lookingFor: "Specific things they did, not what I expected them to do",
        watchOut: "Filling the gaps with the pattern instead of leaving them empty",
        remember: "Keep the read. Don't let it answer questions it wasn't asked.",
      },
      fidelity: {
        correct:
          "The general read is left intact; the individual is evaluated on their own record.",
        misuse: [
          "Talking yourself into someone.",
          "Using it to wave away behaviour you've actually seen.",
          "Deciding the general read was wrong all along.",
        ],
        notMeaning:
          "It does not mean dating is fine, that this person is safe, or that you owe anyone more chances.",
      },
      supportSignposts: [
        {
          id: "signpost-generalised-hopelessness",
          heading: "This sounds bigger than one person",
          body: "Some of what you've written sounds bigger than one person or one app. When the feeling stops being about dating and starts being about you — whether you're worth it, whether anything will work — that's worth saying out loud to someone. A therapist, a GP, a friend who'll actually sit with it. Not because something's wrong with you. Because that's heavier than a tool like this is built for.",
        },
      ],
    },

    // ─────────────────────────────── 3b ──
    {
      playId: "whos-actually-here",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Who's Actually Here",
      positioning: "For when you can't tell who's serious.",
      recognitionGate: {
        prompt:
          "Do you find it hard to tell who's actually engaged and who's just being pleasant?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "You're being asked to read intent from very little, in a format designed to make everyone look approximately the same.",
            "You can't fix the format. You can change what you're reading.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Warmth is cheap. Effort is expensive.",
            "Most people read warmth. Warmth is cheap — nearly everyone can produce it, and it's genuinely pleasant, which makes it hard to discount.",
            "Effort is expensive. Effort means doing something that costs time or attention, and doing it when you didn't prompt them.",
            "Effort is the more useful signal. Not because warm people are lying, but because warmth tells you about their manner and effort tells you about their intent.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these is effort you can see?",
          situation: "Someone you've been talking to says and does a mix of things.",
          buckets: [
            { id: "warmth", label: "Warmth" },
            { id: "effort", label: "Effort" },
          ],
          items: [
            {
              id: "sort-p2-so-glad",
              text: "“You're amazing, I'm so glad we matched”",
              correctBucket: "warmth",
              correction:
                "That's about how they made you feel. What did they actually do?",
            },
            {
              id: "sort-p2-replied-first",
              text: "Replied first, twice this week",
              correctBucket: "effort",
              correction:
                "That cost them something — starting is harder than answering.",
            },
            {
              id: "sort-p2-drink-sometime",
              text: "“We should definitely get a drink sometime”",
              correctBucket: "warmth",
              correction: "“Sometime” isn't a plan. That's a pleasant sentence.",
            },
            {
              id: "sort-p2-confirmed-thursday",
              text: "Suggested Thursday, then confirmed Thursday",
              correctBucket: "effort",
              correction: "Said it, then did it. That's the whole signal.",
            },
            {
              id: "sort-p2-thinking-of-you",
              text: "“I've been thinking about you all day”",
              correctBucket: "warmth",
              correction: "Lovely to hear. Doesn't tell you what they'll do.",
            },
            {
              id: "sort-p2-remembered",
              text: "Remembered the thing you were nervous about",
              correctBucket: "effort",
              correction:
                "Remembering takes attention. That's effort, not manner.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "What I'll treat as evidence with this person.",
          fields: [
            {
              id: "evidence",
              input: "chips",
              label: "Pick the ones that count for you",
              suggestions: [
                "They start conversations sometimes, not just respond",
                "What they said would happen, happened",
                "We've moved toward actually meeting",
                "It's held up across more than one week",
              ],
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro:
            "And if I'm not seeing it, decide the move now — not in the moment.",
          conditionLabel: "When I'm not seeing that evidence",
          thenLabel: "I'll",
          actions: [
            "Ask directly",
            "Keep my effort matched to theirs",
            "Give it one more week, then decide",
            "Let it go",
          ],
          controlCheck:
            "This is about weighing what they do over how they make me feel — not scorekeeping, and not testing them.",
        },
        {
          kind: "output",
          heading: "My read",
          body: "This is about whether they're showing up now. It isn't a prediction.",
        },
        {
          kind: "portable",
          heading: "Take it with you",
          steps: [
            "Warmth is manner. Effort is intent.",
            "Did they do it, or did they say it?",
            "More than one data point before I decide.",
          ],
        },
      ],
      portable: [
        "Warmth is manner. Effort is intent.",
        "Did they do it, or did they say it?",
        "More than one data point before I decide.",
      ],
      myPlaysTemplate: {
        when: "When I can't tell if someone's actually interested",
        move: "Weigh effort and follow-through above warmth and stated intent",
        lookingFor: "Do they start things? Does what they said match what they did?",
        watchOut: "Letting warmth stand in for evidence because it feels good",
        remember: "This tells me if they're showing up. It doesn't tell me how it ends.",
      },
      fidelity: {
        correct:
          "Reciprocated effort and follow-through are weighed above warmth and stated intent.",
        misuse: [
          "Scorekeeping.",
          "Testing them to see what happens.",
          "Withdrawing effort on purpose to measure their response.",
        ],
        notMeaning:
          "It does not mean you can predict them, that a good read protects you from being hurt, or that anyone owes you a reply.",
      },
      supportSignposts: [
        {
          id: "signpost-self-worth",
          heading: "Their silence isn't a verdict on you",
          body: "Some of what you've written reads like their silence is telling you something about you. Mostly it's telling you about them — and often it isn't telling you much at all. If that's a familiar feeling and it doesn't shift, it's worth talking to someone about, separately from any of this.",
        },
      ],
    },

    // ─────────────────────────────── 3c ──
    {
      playId: "how-many-at-once",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "How Many at Once",
      positioning: "For when everyone starts to blur.",
      recognitionGate: {
        prompt: "Do the people you're talking to start to blur together?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Before anything else: this one isn't about your judgement.",
            "You can read people. What's happened is that you've been asked to read a great many of them in a row, and that wears down anyone.",
            "When people work through profiles in one sitting, they get steadily more rejecting as they go — by the end, roughly a quarter less likely to say yes to anyone. The people at the end weren't worse. The person judging had run down.",
            "So this isn't a tool for judging better. It's a tool for not running on empty while you do it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "There's a number, and it's smaller than you think.",
            "There's a number of people you can actually pay attention to. Above it, they stop being individuals and become a queue.",
            "That number is smaller than most people think, and it isn't the same for everyone. It's also not fixed — it drops when the rest of your life is heavy.",
            "The point of naming it is that once everyone's a queue, you're not really choosing. You're processing.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The honest count.",
          fields: [
            {
              id: "count-open",
              input: "text",
              label:
                "How many people are you actively talking to or evaluating right now?",
              placeholder: "A number, or roughly",
            },
            {
              id: "count-specific",
              input: "text",
              label:
                "Of those, how many could you tell me something specific about — something that's actually theirs?",
              placeholder: "A number, or roughly",
            },
          ],
        },
        {
          kind: "learn",
          body: [
            "If the second number is smaller, that gap is the thing. Not a failing — just the honest count.",
          ],
        },
        {
          kind: "sufficiency",
          prompt: "How many do you think you can actually pay attention to properly?",
          enoughLabel: "I know my number",
          needMoreLabel: "I'm not sure yet",
          needMoreIntro:
            "That's a fine answer. People differ, and it changes week to week.",
          needToKnowLabel: "What would tell me I'd gone over",
          observableLabel: "Something I'd actually notice",
        },
        {
          kind: "ownTurn",
          intro: "Set your limit — chosen now, on purpose.",
          fields: [
            {
              id: "limit",
              input: "text",
              label: "My limit, for now",
              placeholder: "A number",
            },
            {
              id: "cadence",
              input: "chips",
              label: "I'll look at this again",
              suggestions: ["In a week", "In a month", "When something changes"],
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "Decide what you'll do when you hit it.",
          conditionLabel: "When I hit that limit",
          thenLabel: "I'll",
          actions: [
            "Close out the ones that have gone quiet",
            "Stop swiping until something resolves",
            "Move one toward actually meeting",
            "Pause the whole thing for a bit",
          ],
          controlCheck:
            "This is a limit I chose to protect my attention — not a rule I've failed if I go over.",
        },
        {
          kind: "output",
          heading: "My limit",
          body: "A number you chose. Not a rule you can fail.",
        },
        {
          kind: "portable",
          heading: "Take it with you",
          steps: [
            "It gets harsher the longer I scroll. That's the volume, not them.",
            "Above my number, I'm processing — not choosing.",
            "Going over is information, not failure.",
          ],
        },
      ],
      portable: [
        "It gets harsher the longer I scroll. That's the volume, not them.",
        "Above my number, I'm processing — not choosing.",
        "Going over is information, not failure.",
      ],
      myPlaysTemplate: {
        when: "When everyone I'm talking to starts to blur together",
        move: "Set my own limit on how many I'm evaluating at once",
        lookingFor: "Can I say something specific about each of them?",
        watchOut: "Treating the limit as a rule I've broken",
        remember: "I'm not bad at reading people. I've been doing it on empty.",
      },
      fidelity: {
        correct:
          "A limit the reader set themselves, chosen in advance, applied going forward.",
        misuse: [
          "Treating the limit as a rule you've failed.",
          "Using it as cover for stopping when you don't actually want to.",
          "Setting a number to prove something rather than to protect attention.",
        ],
        notMeaning:
          "It does not mean fewer is better, that you should keep going, or that stopping is failure.",
      },
      supportSignposts: [
        {
          id: "signpost-generalised-hopelessness",
          heading: "There's a difference worth checking",
          body: "There's a difference between this isn't working right now and nothing is going to work. The first is a decision. The second is a conclusion, and it's worth having someone else in the room when you look at it. If it's been sitting with you for a while, or it's spread past dating, please talk to someone.",
        },
      ],
    },
  ],

  // ── §4 literature ──────────────────────────────────────────────
  literature: C4_LITERATURE,

  // ── §5 missions ────────────────────────────────────────────────
  missions: [
    {
      id: "mission-c4-pattern",
      version: 1,
      playId: "them-or-the-pattern",
      title: "Check one person against their own record",
      instruction:
        "Next time you catch yourself already knowing how someone goes, stop and write down what they've actually done so far. Then decide.",
      linkToOperation:
        "Separating the general read from this person's actual record",
      attemptMeaning:
        "You ran the operation on a real person. Not that the read was right, and not that anything changed.",
      suitability:
        "This is for ordinary uncertainty, not for someone who's treated you badly. If you've seen disrespect, that's not a pattern error and this isn't the tool.",
      progression: [
        {
          id: "rung-c4-pattern-2",
          instruction: "Do it before you reply, rather than afterwards.",
        },
      ],
    },
    {
      id: "mission-c4-signals",
      version: 1,
      playId: "whos-actually-here",
      title: "Watch effort for one week",
      instruction:
        "Pick one person. For a week, note only what they did — not what they said, not how it felt.",
      linkToOperation: "Weighing effort and follow-through above warmth",
      attemptMeaning:
        "You ran the operation live. Not that you now know what they'll do.",
      suitability:
        "This is for ambiguity, not safety. If you've already seen something that concerns you, that isn't ambiguity.",
      progression: [
        {
          id: "rung-c4-signals-2",
          instruction: "Do it with two people and compare what you notice.",
        },
      ],
    },
    {
      id: "mission-c4-load",
      version: 1,
      playId: "how-many-at-once",
      title: "Hold your limit for one week",
      instruction:
        "Keep the number of people you're actively evaluating at or under the limit you set. Notice what changes.",
      linkToOperation: "Holding a self-set limit on concurrent evaluation",
      attemptMeaning: "You tried it. Going over is information, not failure.",
      suitability:
        "If holding the limit means stopping altogether for now, that counts. It isn't a miss.",
      progression: [
        {
          id: "rung-c4-load-2",
          instruction:
            "Notice whether the last person you talked to got a different read than the first.",
        },
      ],
    },
  ],

  // ── §6 use reviews ─────────────────────────────────────────────
  useReviews: [
    {
      id: "review-c4-pattern",
      version: 1,
      playId: "them-or-the-pattern",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Checked their actual record",
          "Kept my general read separate",
          "Waited before concluding",
          "Went with the conclusion anyway",
        ],
      },
      performedOperation: {
        label: "Did you check this person against their own record?",
        options: ["Pretty closely", "Some of it", "Not really this time"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "The gap between my read and their record",
          "That the general read is about the pool",
          "What I'd actually need to see",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The general read felt truer than the record",
          "I couldn't tell what counted as evidence",
          "I checked and went with the conclusion anyway",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c4-signals",
      version: 1,
      playId: "whos-actually-here",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Watched effort rather than warmth",
          "Waited across more than one exchange",
          "Named what counts as evidence",
          "Went with how it felt",
        ],
      },
      performedOperation: {
        label: "Did you weigh effort over warmth?",
        options: ["Pretty closely", "Some of it", "Not really this time"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Which signals actually repeat",
          "How much of it was warmth",
          "What absent effort looks like",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Warmth kept outweighing effort",
          "There wasn't enough contact to read",
          "I saw it and stayed anyway",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c4-load",
      version: 1,
      playId: "how-many-at-once",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Held the limit",
          "Went over and noticed",
          "Closed some out",
          "Paused altogether",
        ],
      },
      performedOperation: {
        label: "Did you hold the limit you set?",
        options: ["Pretty closely", "Some of it", "Not really this time"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How the last ones differed from the first",
          "How many I can actually read",
          "That the volume was doing it",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The limit felt like missing out",
          "I couldn't tell who to close out",
          "I held it and felt worse",
          "Nothing stuck",
        ],
      },
    },
  ],

  // §7 simulations — INTENTIONALLY ABSENT. §0 decision: Plays-only.
};
