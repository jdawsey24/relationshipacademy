/**
 * Cluster 5 — "Difficulty Trusting Your Own Judgment"
 * The Relationship Playbook™ · Trusting What You See
 *
 * §0 DECISION: PLAYS-ONLY, consistent with Clusters 3 and 4.
 *
 * Derived against Framework Version 1.9. Part B Instance 3 rulings applied:
 *   1. Single phase — Exploration. STM-1043/1045/1048/1049 assigned Exploration
 *      following the Cluster 3 precedent.
 *   2. The ambition block (PE-9) describes WANTS, not a judgement difficulty.
 *      Recognition/Context. No Play. It is the input to PE-6b.
 *   3. PE-8 split on Context-Validity. PE-8a EXITS — accurate recalibration
 *      after real misjudgement is not a distortion.
 *   4. Standards reframed: not "are they too high" but "do they fit who I am".
 *
 * Four Tier 1 Core Plays carry this cluster: CP-01, CP-02, CP-03, CP-04.
 *
 * ⚠ CLAIM SCOPE. May claim: name a concern instead of burying it; set a point
 *   at which you look; tell a specific read from a familiar feeling; put effort
 *   where it is returned; take a second look before dismissing; sort which of
 *   your requirements are load-bearing. MUST NOT claim: that the reader will
 *   choose better, that their instincts will come back, that their standards
 *   are too high or too low, or that attraction to unavailable people means
 *   anything in particular about them.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C5_LITERATURE } from "./trusting-what-you-see-literature";

export const TRUSTING_WHAT_YOU_SEE: PlaybookContent = {
  playbookKey: "trusting-what-you-see", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Trusting What You See",

  opening: {
    title: "Before anything else",
    body: [
      "You're not short of information. You usually notice. What happens next is the problem.",
      "And if your judgement has genuinely been wrong before, then being wary of it now is a fair conclusion — not something to talk yourself out of.",
      "What follows is a way of deciding that doesn't need you to feel certain.",
    ],
    manifestations: [
      "I keep choosing the wrong people.",
      "I ignore red flags.",
      "I don't trust my judgment.",
      "I always give people one more chance.",
    ],
    cta: "Start with what's already fair",
  },

  // ── recognition ────────────────────────────────────────────────
  recognitionCards: [
    {
      id: "rec-c5-distrust-is-fair",
      role: "validate",
      pathwayPlayId: null,
      headline: "I don't trust my own judgment anymore — and I don't think that's paranoia.",
      validationCopy:
        "It isn't. If you've misread people more than once, lowered confidence is a correct update, not damage. Nothing here will tell you to trust your gut. We'll give you something to check against instead.",
      secondaryExamples: [
        "I don't trust my instincts anymore.",
        "I don't trust myself to choose well.",
      ],
    },
    {
      id: "rec-c5-knew-anyway",
      role: "route",
      pathwayPlayId: "check-it-dont-bury-it",
      headline: "I saw it and stayed anyway.",
      explanation:
        "The information was there. It got overridden. That's a different problem from not noticing.",
      secondaryExamples: [
        "I ignore red flags.",
        "I knew something was wrong.",
        "I ignore my intuition.",
      ],
    },
    {
      id: "rec-c5-one-more-chance",
      role: "route",
      pathwayPlayId: "how-long-am-i-giving-this",
      headline: "I always give people one more chance.",
      explanation:
        "Every chance is reasonable on the day. A chance with no end point can't be failed.",
      secondaryExamples: [
        "I stay too long.",
        "I keep repeating the same relationship.",
        "I don't know if I'm settling.",
      ],
    },
    {
      id: "rec-c5-chasing",
      role: "route",
      pathwayPlayId: "where-my-effort-goes",
      headline: "I keep chasing people who aren't available.",
      explanation:
        "Someone unavailable never becomes ordinary. The wanting doesn't run out because it never gets what it's after.",
      secondaryExamples: [
        "I only want people who don't want me.",
        "I always date emotionally unavailable people.",
      ],
    },
    {
      id: "rec-c5-no-spark",
      role: "route",
      pathwayPlayId: "give-it-a-second-look",
      headline: "When someone's steady and available, I lose interest.",
      explanation:
        "Not necessarily the absence of feeling. Possibly the absence of anxiety.",
      secondaryExamples: [
        "Healthy relationships feel boring.",
        "I mistake anxiety for chemistry.",
        "I don't feel \u201cthe spark.\u201d",
      ],
    },
    {
      id: "rec-c5-wise-or-scared",
      role: "route",
      pathwayPlayId: "wise-or-scared",
      headline: "I can't tell if I'm being wise or just frightened.",
      explanation:
        "There's a usable test for this. Not a perfect one.",
      secondaryExamples: [
        "I don't know if I'm overthinking or seeing reality.",
        "I second-guess every decision.",
      ],
    },
    {
      id: "rec-c5-standards",
      role: "route",
      pathwayPlayId: "do-my-standards-fit-me",
      headline: "Everyone says my standards are too high.",
      explanation:
        "That's their claim, not a finding. The real question is whether your standards fit the life you actually have.",
      secondaryExamples: [
        "I don't know if my standards are realistic.",
        "I don't know the difference between compromise and settling.",
        "I worry my standards are influenced by my lifestyle.",
      ],
    },
  ],

  // ── plays ──────────────────────────────────────────────────────
  plays: [
    // ─────────────────────────────────── Play 1 · CP-03 ──
    {
      playId: "check-it-dont-bury-it",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Check It, Don't Bury It",
      positioning: "For the concern you've already talked yourself out of.",
      recognitionGate: {
        prompt: "Have you noticed something and then decided you were being unfair?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "You noticed. You usually do. What happens is that the concern arrives without proof, and you park it until it's certain — and certainty doesn't come in the timeframe you need it.",
            "So the concern goes quiet, and the decision gets made by default.",
            "This puts one step between noticing and burying: name it, and give it something to look for.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Waiting for proof. Deciding it says something unkind about you. Explaining it with something true — they're busy, it's early, they're stressed. Or giving it one more chance, and then another.",
            "All four are reasonable. All four end the same way: the concern is gone and you never tested it.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Name it plainly",
          fields: [
            {
              id: "the-concern",
              input: "text",
              label: "What did you notice? Say it as flatly as you can.",
              placeholder: "Not what it might mean. What happened.",
            },
            {
              id: "how-i-explained-it",
              input: "chips",
              label: "How did you talk yourself out of it?",
              suggestions: [
                "Waited for proof",
                "Decided I was being unfair",
                "Explained it with something true",
                "Gave it one more chance",
                "Haven't yet",
              ],
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "Give it something to look for",
          conditionLabel: "The concern",
          thenLabel: "What would tell me either way",
          actions: [
            "Whether it happens again",
            "How they respond when I raise it",
            "Whether it shows up in a different situation",
            "Whether it's a one-off or a pattern",
          ],
          controlCheck:
            "I'm checking, not building a case. What I named is something I could actually see. I'd accept a result that says it was nothing.",
        },
        {
          kind: "output",
          heading: "My concern, and what I'm looking for",
          body: "Named, not buried. That's the whole operation.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Don't wait for proof. Name it and look.",
            "Explaining it isn't testing it.",
            "Would I accept a result that says it was nothing?",
          ],
        },
      ],
      portable: [
        "Don't wait for proof. Name it and look.",
        "Explaining it isn't testing it.",
        "Would I accept a result that says it was nothing?",
      ],
      myPlaysTemplate: {
        when: "When I've noticed something and started explaining it away",
        move: "Name the concern flatly and give it something specific to look for",
        lookingFor: "Whether it happens again, and how they respond when raised",
        watchOut: "Collecting evidence for a verdict I've already reached",
        remember: "I noticed for a reason. Checking isn't accusing.",
      },
      fidelity: {
        correct:
          "A concern is stated plainly and paired with an observable thing to look for.",
        misuse: [
          "Building a case rather than checking.",
          "Naming a concern you'd never accept a negative result on.",
          "Turning it into surveillance.",
        ],
        notMeaning:
          "It does not mean the concern is right, that the person is untrustworthy, or that you should act on it now.",
      },
      supportSignposts: [
        {
          id: "signpost-c5-safety-concern",
          heading: "If the concern is about safety",
          body:
            "If what you noticed involves being frightened, pressured, controlled, or hurt, that isn't a concern to test over time. That's a reason to talk to someone now — a friend, a professional, or a domestic abuse service. Please don't wait to be certain about that one.",
        },
      ],
    },

    // ─────────────────────────────────── Play 2 · CP-04 ──
    {
      playId: "how-long-am-i-giving-this",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "How Long Am I Giving This?",
      positioning: "For when every chance is reasonable and there've been forty of them.",
      recognitionGate: {
        prompt: "Do you find yourself giving one more chance, repeatedly?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Nobody stays five years because of one big decision. They stay because of forty small ones, each defensible on the day.",
            "A chance with no end point never resolves. A chance with an end point produces information — either it changes by then, or it doesn't.",
            "The whole difference is a date you set before you need it.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It isn't a threat and you don't tell them. It isn't a promise to leave, and it isn't a promise to stay.",
            "It's a promise to look, on a particular day, at a particular thing. That's all it has to be to work.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Putting a date on something can feel like you've already decided against them. It isn't that.",
            "Deciding by default is the version where they don't get a fair look. This is the one where they do.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The thing you keep giving chances on",
          fields: [
            {
              id: "the-thing",
              input: "text",
              label: "What is it you keep hoping will change?",
              placeholder: "One thing. The one that keeps coming back.",
            },
            {
              id: "how-long",
              input: "text",
              label: "How long has it been going on?",
              placeholder: "Roughly is fine.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "The date, and what you'll look at",
          conditionLabel: "When I'll look",
          thenLabel: "What I'll be looking at",
          actions: [
            "Two weeks",
            "A month",
            "Three months",
            "The next time it comes up",
          ],
          controlCheck:
            "What I'm looking at is specific enough to answer yes or no. This is for me. I'm not telling them as a warning. I'll actually look on that day, not extend it.",
        },
        {
          kind: "output",
          heading: "My date",
          body: "Not a decision. A day on which you decide.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A chance with no end can't be failed.",
            "The date is a promise to look, not a promise to leave.",
            "Deciding by default isn't fairer to them.",
          ],
        },
      ],
      portable: [
        "A chance with no end can't be failed.",
        "The date is a promise to look, not a promise to leave.",
        "Deciding by default isn't fairer to them.",
      ],
      myPlaysTemplate: {
        when: "When I keep giving one more chance on the same thing",
        move: "Set a date to look, and name what I'll be looking at",
        lookingFor: "Whether the specific thing has changed by then",
        watchOut: "Extending the date when it arrives",
        remember: "It's a promise to look, not a promise to go.",
      },
      fidelity: {
        correct:
          "A date is set in advance and paired with a specific observable thing to review.",
        misuse: [
          "Using it as an unspoken ultimatum.",
          "Extending the date rather than looking.",
          "Setting one so far out it changes nothing.",
        ],
        notMeaning:
          "It does not mean you should leave on that date, that the thing won't change, or that you've decided anything.",
      },
    },

    // ─────────────────────────────────── Play 3 · CP-01 ──
    {
      playId: "where-my-effort-goes",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Where My Effort Goes",
      positioning: "For when you're doing most of the work and calling it chemistry.",
      recognitionGate: {
        prompt: "Are you putting more in than is coming back?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Someone unavailable never becomes ordinary. There's always a next thing to find out, always a reason it hasn't settled.",
            "So the wanting doesn't run out — it never gets what it's after. Which means how strongly you want someone may be telling you how unresolved they are, not how right they are.",
          ],
        },
        {
          kind: "learn",
          body: [
            "This isn't about giving less to punish anyone, or matching them move for move. That's scorekeeping and it doesn't work.",
            "It's about noticing whether what you put in comes back in any form — and letting that, rather than the intensity of the pull, decide how much more goes in.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these came back?",
          situation:
            "Three weeks in. Something happened on Tuesday that you keep coming back to, and you've already explained it to yourself twice.",
          buckets: [
            { id: "returned", label: "Came back" },
            { id: "not-returned", label: "Didn't" },
          ],
          items: [
            {
              id: "sort-c5-they-planned",
              text: "They made the plan this time",
              correctBucket: "returned",
              correction: "They did something. That's it coming back.",
            },
            {
              id: "sort-c5-said-lovely",
              text: "They said something lovely when you pushed for it",
              correctBucket: "not-returned",
              correction:
                "You had to go and get it. That's your effort, returned to you.",
            },
            {
              id: "sort-c5-remembered",
              text: "They remembered something you'd told them weeks ago",
              correctBucket: "returned",
              correction: "That took attention on their side.",
            },
            {
              id: "sort-c5-replied-eventually",
              text: "They replied eventually, warmly",
              correctBucket: "not-returned",
              correction:
                "Warmth after a delay you spent worrying about isn't the same as reciprocation. Have another look.",
            },
            {
              id: "sort-c5-checked-in",
              text: "They checked in when nothing was happening",
              correctBucket: "returned",
              correction: "Unprompted contact is one of the clearer signals.",
            },
            {
              id: "sort-c5-agreed",
              text: "They agreed it would be nice to meet up sometime",
              correctBucket: "not-returned",
              correction: "Agreeing isn't doing. Nothing happened yet.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "How I'll pace it",
          conditionLabel: "What I'll treat as it coming back",
          thenLabel: "And what I'll do while I wait to see",
          actions: [
            "They start something without me prompting it",
            "They make a plan and keep it",
            "They follow up on something I said",
            "It happens more than once",
          ],
          controlCheck:
            "I'm pacing, not punishing. I'm not going quiet to see what they do. The effort I'm not spending goes somewhere, not nowhere.",
        },
        {
          kind: "output",
          heading: "Where my effort goes",
          body: "Following evidence rather than following the pull.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The pull may be measuring how unresolved they are.",
            "Pacing, not punishing.",
            "Did it come back, or did I go and get it?",
          ],
        },
      ],
      portable: [
        "The pull may be measuring how unresolved they are.",
        "Pacing, not punishing.",
        "Did it come back, or did I go and get it?",
      ],
      myPlaysTemplate: {
        when: "When I'm doing most of the work and it feels like chemistry",
        move: "Let effort follow what's actually returned, not the strength of the pull",
        lookingFor: "Unprompted contact, plans kept, things followed up",
        watchOut: "Going quiet to see what they do — that's a test, not pacing",
        remember: "Someone unavailable never becomes ordinary. That's why it doesn't settle.",
      },
      fidelity: {
        correct:
          "Investment is paced against observed reciprocation rather than against felt intensity.",
        misuse: [
          "Withdrawing to provoke a response.",
          "Scorekeeping or matching move for move.",
          "Using it to justify a decision already made.",
        ],
        notMeaning:
          "It does not mean they'll step up, that the pull is wrong, or that pacing will change how they behave.",
      },
    },

    // ─────────────────────────────────── Play 4 · CP-02 ──
    {
      playId: "give-it-a-second-look",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Give It a Second Look",
      positioning: "For the person you dismissed because nothing happened.",
      recognitionGate: {
        prompt: "Do you rule people out quickly when there's no spark?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Uncertainty generates activity — wondering, analysing, waiting. That activity feels like involvement.",
            "When someone is straightforwardly available, all of it stops. And the absence of the activity can read as the absence of feeling, when it's actually the absence of anxiety.",
            "This isn't about dating people you don't like. It's about not deciding in the first hour.",
          ],
        },
        {
          kind: "learn",
          body: [
            "One more real interaction, in a setting where something could happen — not a repeat of the same coffee.",
            "And a specific thing to notice, so you're not just re-running the same feeling and getting the same answer.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The person you were about to rule out",
          fields: [
            {
              id: "the-person",
              input: "text",
              label: "What's the reason you'd give for ruling them out?",
              placeholder: "In your own words, even if it's just 'nothing there'.",
            },
            {
              id: "spark-or-thing",
              input: "chips",
              label: "Is that a thing they did, or a feeling you didn't have?",
              suggestions: [
                "A thing they did",
                "A feeling I didn't have",
                "Honestly, both",
                "Not sure",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "If it's a feeling you didn't have — has there been enough happening for a feeling to form?",
          enoughLabel: "Yes, there's been enough to go on",
          needMoreLabel: "Not really — it's been quite thin",
          needMoreIntro:
            "That's worth knowing. A first read on a steady person is often taken before there's anything to read.",
          needToKnowLabel: "What I'd want to see on a second look",
          observableLabel: "Something I could actually notice",
        },
        {
          kind: "output",
          heading: "My second look",
          body: "One more, with something specific to notice. Then decide.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Nothing happening, or nothing going wrong?",
            "A first read on a steady person is usually taken too early.",
            "One more, with something specific to notice.",
          ],
        },
      ],
      portable: [
        "Nothing happening, or nothing going wrong?",
        "A first read on a steady person is usually taken too early.",
        "One more, with something specific to notice.",
      ],
      myPlaysTemplate: {
        when: "When I'm about to rule someone out for no spark",
        move: "Take one more look, with a specific thing to notice",
        lookingFor: "Whether it was a thing they did or a feeling I didn't have",
        watchOut: "Talking myself into someone — this is a second look, not a verdict",
        remember: "Quiet isn't the same as nothing.",
      },
      fidelity: {
        correct:
          "A dismissal based on absent feeling is deferred for one further observation with a named thing to notice.",
        misuse: [
          "Talking yourself into someone you don't want.",
          "Overriding a specific thing they actually did.",
          "Repeating the look indefinitely rather than deciding.",
        ],
        notMeaning:
          "It does not mean you should date them, that the spark will arrive, or that your first read was wrong.",
      },
    },

    // ─────────────────────────── Play 5 · PE-8b discrimination ──
    {
      playId: "wise-or-scared",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Wise, or Scared?",
      positioning: "For when you can't tell if you're reading something or reacting to it.",
      recognitionGate: {
        prompt: "Do you struggle to tell a real concern from an old fear?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "This is the question underneath most of the others, and the honest position is that you can't always tell.",
            "What you can do is check the read against a few things, and get a better-than-nothing answer. That's a lot more than choosing between trusting yourself completely and not at all.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Probably about them: you can point at the specific thing, it's recent, you could describe it to someone and they'd see why you noticed, and it didn't arrive before you'd met them.",
            "Probably about you: it's the same feeling you had about the last three people, it arrived early, it gets stronger the better things go, and when you try to say what it's about you end up describing a pattern rather than a person.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Run yours through it",
          fields: [
            {
              id: "the-read",
              input: "text",
              label: "What's the read?",
              placeholder: "The thing you're uneasy about.",
            },
            {
              id: "point-at-it",
              input: "text",
              label: "What specific thing can you point at?",
              placeholder: "If nothing comes, that's an answer too — write 'nothing specific'.",
            },
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which side does each of these fall on?",
          situation:
            "You've been putting in most of the effort for a month. Every so often something comes back and it keeps you going.",
          buckets: [
            { id: "about-them", label: "Probably about them" },
            { id: "about-me", label: "Probably about me" },
          ],
          items: [
            {
              id: "sort-c5-same-as-last",
              text: "It's the same feeling I had about the last three",
              correctBucket: "about-me",
              correction:
                "A feeling that's identical across different people is telling you about the constant, not the variable.",
            },
            {
              id: "sort-c5-specific-thing",
              text: "They said something dismissive about my job on Tuesday",
              correctBucket: "about-them",
              correction: "Specific, recent, pointable. That's about them.",
            },
            {
              id: "sort-c5-stronger-when-good",
              text: "It gets louder the better things are going",
              correctBucket: "about-me",
              correction:
                "A read that intensifies when things improve isn't tracking them.",
            },
            {
              id: "sort-c5-friend-would-see",
              text: "If I described it, a friend would understand why I noticed",
              correctBucket: "about-them",
              correction: "Describable to someone else usually means it's in the world.",
            },
            {
              id: "sort-c5-before-meeting",
              text: "I felt it before we'd properly met",
              correctBucket: "about-me",
              correction: "It arrived before there was anything to read.",
            },
            {
              id: "sort-c5-pattern-not-person",
              text: "When I explain it, I end up describing a type",
              correctBucket: "about-me",
              correction:
                "If the description is of a category rather than a person, it came with you.",
            },
          ],
        },
        {
          kind: "output",
          heading: "Where this one lands",
          body: "A best guess, not a verdict. Either answer tells you what to do next.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Can I point at the specific thing?",
            "Same feeling as the last three? That's about me.",
            "Louder when things go well? That's about me too.",
          ],
        },
      ],
      portable: [
        "Can I point at the specific thing?",
        "Same feeling as the last three? That's about me.",
        "Louder when things go well? That's about me too.",
      ],
      myPlaysTemplate: {
        when: "When I can't tell a real concern from an old fear",
        move: "Check the read against both lists",
        lookingFor: "Something specific, recent, and describable to someone else",
        watchOut: "Using 'it's about me' to dismiss something that was real",
        remember: "Either answer is useful. Neither settles it forever.",
      },
      fidelity: {
        correct:
          "A read is checked against specificity, recency and describability before being acted on or dismissed.",
        misuse: [
          "Using 'that's just my pattern' to override something specific you actually saw.",
          "Treating the result as proof either way.",
          "Running it repeatedly on the same read until you get the answer you wanted.",
        ],
        notMeaning:
          "It does not mean the read is right or wrong, that your fear is unfounded, or that you can now trust your instincts.",
      },
      supportSignposts: [
        {
          id: "signpost-c5-cant-tell-anything",
          heading: "If this is bigger than dating",
          body:
            "If you don't trust your judgement about anything — work, friends, what you're seeing generally — or if the sense of not being able to tell what's real has spread beyond relationships, it can help to take that to someone. A GP or another professional. And if it's tipping further than that — if you're feeling unsafe, unable to get through an ordinary day, or genuinely unable to tell what's real — please treat that as a reason to reach out sooner rather than later: a GP, an urgent-care or crisis service, or someone you trust. It isn't a dating problem at that point.",
        },
      ],
    },

    // ────────────────────────── Play 6 · PE-6b standards-to-self ──
    {
      playId: "do-my-standards-fit-me",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Do My Standards Fit Me?",
      positioning: "For when everyone says you're too picky and you're not sure they're wrong.",
      recognitionGate: {
        prompt: "Do you wonder whether what you're looking for is realistic?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "\u201cAre my standards too high?\u201d has no answer, because there's no general standard to be high relative to.",
            "\u201cDo my standards fit the life I actually have and the person I actually am?\u201d does have an answer, and only you can work it out.",
            "If you've built something demanding, wanting someone who can hold it isn't fussiness. It's arithmetic.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Load-bearing: without this, the thing genuinely doesn't work. Not preference — structure.",
            "Inherited: it came from a film, a family, an idea you formed at twenty-two, and it's never been looked at.",
            "Most people have both and haven't sorted them. Nobody outside you can do the sorting, which is why being told you're too picky is unhelpful even when it's kindly meant.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What you actually need someone to hold",
          fields: [
            {
              id: "my-life",
              input: "text",
              label: "What's true about your life that a partner would have to fit around?",
              placeholder: "Work, family, how you live, what you're not giving up.",
            },
            {
              id: "requirements",
              input: "text",
              label: "List what you're looking for. All of it, including the bits you feel silly about.",
              placeholder: "Don't edit yet.",
            },
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Sort your list. Which of these is which?",
          situation:
            "You've got a bad feeling about someone and you can't work out whether it's them or whether you've felt this before.",
          buckets: [
            { id: "load-bearing", label: "Load-bearing" },
            { id: "inherited", label: "Worth a second look" },
          ],
          items: [
            {
              id: "sort-c5-supports-work",
              text: "Someone who doesn't resent how much I work",
              correctBucket: "load-bearing",
              correction:
                "If the work isn't going anywhere, this is structural rather than preference.",
            },
            {
              id: "sort-c5-taller",
              text: "Taller than me",
              correctBucket: "inherited",
              correction:
                "Might still matter to you. But it's worth knowing which pile it's in.",
            },
            {
              id: "sort-c5-kids-view",
              text: "Wants children, or definitely doesn't",
              correctBucket: "load-bearing",
              correction: "Hard to build around a mismatch on this one.",
            },
            {
              id: "sort-c5-instant-spark",
              text: "Instant chemistry from the first meeting",
              correctBucket: "inherited",
              correction:
                "This one's worth examining — see 'Anxiety isn't chemistry'.",
            },
            {
              id: "sort-c5-same-ambition",
              text: "Understands why my work matters to me",
              correctBucket: "load-bearing",
              correction:
                "If you're not willing to shrink it, someone has to be able to hold it.",
            },
            {
              id: "sort-c5-sweeps",
              text: "Sweeps me off my feet",
              correctBucket: "inherited",
              correction:
                "Possibly a film. Worth checking what it's standing in for.",
            },
          ],
        },
        {
          kind: "output",
          heading: "What's load-bearing for me",
          body: "Not a shorter list, necessarily. A list you can defend.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Not too high — does it fit the life I actually have?",
            "Load-bearing, or inherited?",
            "Nobody outside me can sort these two piles.",
          ],
        },
      ],
      portable: [
        "Not too high — does it fit the life I actually have?",
        "Load-bearing, or inherited?",
        "Nobody outside me can sort these two piles.",
      ],
      myPlaysTemplate: {
        when: "When I'm being told I'm too picky and I'm not sure",
        move: "Sort my requirements into load-bearing and worth-a-second-look",
        lookingFor: "Which ones the life I actually have genuinely depends on",
        watchOut: "Cutting the list to be agreeable rather than because I've thought about it",
        remember: "The question is fit to me, not high or low in general.",
      },
      fidelity: {
        correct:
          "Requirements are sorted against the reader's actual life rather than against an external judgement of reasonableness.",
        misuse: [
          "Shortening the list to satisfy other people.",
          "Using 'load-bearing' to protect a requirement from examination.",
          "Treating the output as a checklist to screen with.",
        ],
        notMeaning:
          "It does not mean your standards are right or wrong, that a shorter list would help, or that anyone matching the list would work.",
      },
    },
  ],

  literature: C5_LITERATURE,

  // ── missions ───────────────────────────────────────────────────
  missions: [
    {
      id: "mission-c5-check",
      version: 1,
      playId: "check-it-dont-bury-it",
      title: "Name one concern, and look for the thing",
      instruction:
        "Next time you notice something and start explaining it away, write it down instead. Note what you said you'd look for, and whether you saw it.",
      linkToOperation: "Verifying a concern before deciding on it",
      attemptMeaning: "You named it and looked. It doesn't mean the concern was right.",
      suitability:
        "For ordinary concerns. If what you noticed involves being frightened or controlled, don't test it over time — talk to someone now.",
      progression: [
        { id: "rung-c5-check-2", instruction: "Raise it with them, rather than only watching." },
      ],
    },
    {
      id: "mission-c5-date",
      version: 1,
      playId: "how-long-am-i-giving-this",
      title: "Set the date, and keep it",
      instruction:
        "Put the date in your calendar. When it arrives, look at the thing you named — and don't move the date.",
      linkToOperation: "Time-bounded observation before deciding",
      attemptMeaning:
        "You looked on the day. It doesn't mean you have to act on what you found.",
      suitability: "If you find yourself moving the date, that's information worth noticing.",
      progression: [
        { id: "rung-c5-date-2", instruction: "Set the next one shorter than the last." },
      ],
    },
    {
      id: "mission-c5-effort",
      version: 1,
      playId: "where-my-effort-goes",
      title: "One week, following what comes back",
      instruction:
        "For a week, put effort in where something came back and hold where it didn't. Note what you noticed — in them and in yourself.",
      linkToOperation: "Pacing investment against observed reciprocation",
      attemptMeaning:
        "You paced it. It doesn't mean they'll step up, and it doesn't mean they won't.",
      suitability:
        "If holding back is being used to provoke a reaction, that's a test rather than pacing, and it won't tell you anything.",
      progression: [
        {
          id: "rung-c5-effort-2",
          instruction: "Put the effort you held back into something that isn't dating.",
        },
      ],
    },
    {
      id: "mission-c5-second-look",
      version: 1,
      playId: "give-it-a-second-look",
      title: "One more look, then decide",
      instruction:
        "See them once more, somewhere something could actually happen. Notice the thing you named. Then decide either way.",
      linkToOperation: "Deferring a dismissal for one further observation",
      attemptMeaning:
        "You looked again. Deciding no afterwards counts as completing it.",
      suitability:
        "Once, not indefinitely. If you're on the fourth second look, that's a different pattern.",
      progression: [
        {
          id: "rung-c5-second-look-2",
          instruction: "Notice how long it takes for a read to form when nothing is going wrong.",
        },
      ],
    },
    {
      id: "mission-c5-wise",
      version: 1,
      playId: "wise-or-scared",
      title: "Run one live read through the lists",
      instruction:
        "Take a read you're currently holding and check it against both lists before you act on it or drop it.",
      linkToOperation: "Discriminating a specific read from a familiar one",
      attemptMeaning:
        "You checked. Landing on 'about me' doesn't mean the concern was baseless.",
      suitability:
        "If you can't get a clear answer, that's a legitimate result. Some reads don't sort.",
      progression: [
        {
          id: "rung-c5-wise-2",
          instruction: "Describe the read out loud to someone and see if it holds up in words.",
        },
      ],
    },
    {
      id: "mission-c5-standards",
      version: 1,
      playId: "do-my-standards-fit-me",
      title: "Say the load-bearing list to one person",
      instruction:
        "Tell someone you trust what's actually load-bearing for you and why. Notice which ones you can defend easily and which ones wobble.",
      linkToOperation: "Testing requirements against one's actual life",
      attemptMeaning: "You said it out loud. Wobbling on one isn't a sign to drop it.",
      suitability:
        "Pick someone who won't immediately tell you you're too picky. That's the input you're trying to get away from.",
      progression: [
        {
          id: "rung-c5-standards-2",
          instruction: "Take one from the second pile and work out what it's standing in for.",
        },
      ],
    },
  ],

  // ── use reviews ────────────────────────────────────────────────
  useReviews: [
    {
      id: "review-c5-check",
      version: 1,
      playId: "check-it-dont-bury-it",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Wrote the concern down",
          "Named something specific to look for",
          "Raised it with them",
          "Explained it away again",
        ],
      },
      performedOperation: {
        label: "Did you name the concern and give it something to look for?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I'd noticed more than I admitted",
          "How I usually talk myself out of it",
          "Whether it was a one-off",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't name it without sounding unfair",
          "I looked and still couldn't tell",
          "I named it and buried it anyway",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c5-date",
      version: 1,
      playId: "how-long-am-i-giving-this",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Set a date",
          "Looked on the day",
          "Named something specific to review",
          "Moved the date",
        ],
      },
      performedOperation: {
        label: "Did you look on the day you set?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Whether it had actually changed",
          "How long this has really been going on",
          "That I'd have kept extending it",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I moved the date",
          "Looking didn't tell me anything",
          "I knew the answer and didn't want it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c5-effort",
      version: 1,
      playId: "where-my-effort-goes",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Let effort follow what came back",
          "Held where nothing came back",
          "Put the spare effort somewhere else",
          "Chased anyway",
        ],
      },
      performedOperation: {
        label: "Did you pace effort against what actually came back?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much of it was me",
          "What coming back actually looks like",
          "That the pull didn't match the evidence",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Holding felt like game-playing",
          "The pull got stronger, not weaker",
          "I couldn't tell what counted as coming back",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c5-second-look",
      version: 1,
      playId: "give-it-a-second-look",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Took a second look",
          "Named something specific to notice",
          "Decided either way afterwards",
          "Ruled them out as usual",
        ],
      },
      performedOperation: {
        label: "Did you take one more look with something specific in mind?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it was a feeling, not a thing they did",
          "How early I usually decide",
          "That there genuinely wasn't anything there",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Still nothing, and I felt guilty about it",
          "I talked myself into it and regretted it",
          "I couldn't tell if I was forcing it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c5-wise",
      version: 1,
      playId: "wise-or-scared",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Checked the read against both lists",
          "Tried to name something specific",
          "Said it out loud to someone",
          "Acted on it without checking",
        ],
      },
      performedOperation: {
        label: "Did you check the read before acting on it or dropping it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I couldn't point at anything",
          "That there was something specific after all",
          "That it's the same feeling every time",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It landed on both lists",
          "I used 'it's just me' to drop something real",
          "Knowing didn't change what I did",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c5-standards",
      version: 1,
      playId: "do-my-standards-fit-me",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Sorted the list honestly",
          "Said it out loud to someone",
          "Kept something I'd been embarrassed about",
          "Cut things to seem reasonable",
        ],
      },
      performedOperation: {
        label: "Did you sort against your actual life rather than against what people say?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Which ones are actually structural",
          "Where some of them came from",
          "That the list isn't the problem",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Everything felt load-bearing",
          "I cut things to seem reasonable",
          "Saying it out loud made me doubt it",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
