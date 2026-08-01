/**
 * Cluster 21 — "Feeling Like We Want Different Things" — VOLUME II
 * The Relationship Playbook™ · Asking Better Questions Early
 *
 * Track: Exclusivity (20 of 48 statements). Task = Intentional Investment.
 * Core Need: TO BUILD PARTNERSHIP. Plays-only.
 *
 * ⚠ THIS READER IS NOT IN TROUBLE. Eight of twenty statements are wants; the
 *   rest are skill gaps. First preventive Playbook in the set rather than a
 *   remedial one. Nothing may treat the reader as stuck, hurt, or mistaken.
 *
 * ⚠ FAITH NEUTRALITY IS LOAD-BEARING. Nine of twenty statements touch faith.
 *   Content must work equally for someone devout, deconstructing, of another
 *   faith, or secular with strong values. No position on what anyone should
 *   believe or practise, and no assumption about which faith.
 *
 * ⚠ NO TIMING RULES. No number of dates, no correct week. What exists is the
 *   asymmetry between raising something early and raising it late.
 *
 * ⚠ VOLUME I is the couple already together discovering a mismatch. Readers in
 *   that position route out via `rec-c21b-already-together`.
 *
 * ⚠ CLAIM SCOPE. May claim: raise the big things as information rather than as
 *   an interview; tell a preference difference from a structural one; date in a
 *   way that matches your values. MUST NOT CLAIM: that any timing is correct,
 *   that shared faith or values are necessary or unnecessary, that compromise
 *   has a right amount, or that asking well produces compatibility.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C21B_LITERATURE } from "./asking-better-questions-literature";

export const ASKING_BETTER_QUESTIONS: PlaybookContent = {
  playbookKey: "asking-better-questions",
  playbookVersion: 1,
  displayName: "Asking Better Questions Early",

  opening: {
    title: "You're not in trouble",
    body: [
      "Most of what's written for people dating assumes something has gone wrong. This isn't that.",
      "You already know what matters to you, which is further than most people get. What's missing is the mechanics — when to raise the big things, how to do it without it becoming an interview, and how to tell which differences will actually matter.",
      "There are no rules here about timing. Anyone giving you a number of dates is guessing.",
    ],
    manifestations: [
      "I want to ask better questions early.",
      "I don't know when to talk about marriage.",
      "I want to know someone beyond attraction.",
      "I want wisdom more than chemistry.",
    ],
    cta: "Start with what's actually knowable early",
  },

  recognitionCards: [
    {
      id: "rec-c21b-already-together",
      role: "signpost",
      pathwayPlayId: null,
      headline: "We're already together and we've found a gap.",
      validationCopy:
        "This one is for people still working out whether to build something. If you're already in it and you've discovered you want different things, that's a different situation with different tools — the differences are no longer hypothetical and there's a shared life in the way. Look for the Playbook about building a shared future.",
      secondaryExamples: [
        "We're becoming different people.",
        "Our goals don't match anymore.",
        "I feel like I've outgrown my relationship.",
      ],
    },
    {
      id: "rec-c21b-when-to-raise",
      role: "route",
      pathwayPlayId: "raising-it-early",
      headline: "I don't know when to bring up the big things.",
      explanation:
        "No correct week exists. What does exist is an asymmetry — the cost of early is immediate and small, the cost of late is large and hypothetical until it isn't.",
      secondaryExamples: [
        "I don't know when to talk about marriage.",
        "I don't know when to talk about children.",
        "I don't want to ignore important differences.",
      ],
    },
    {
      id: "rec-c21b-which-matter",
      role: "route",
      pathwayPlayId: "which-differences-will-matter",
      headline: "I don't know if we're aligned on what matters most.",
      explanation:
        "Nearly every couple differs in ways that don't matter. The test is whether both lives can still happen.",
      secondaryExamples: [
        "I don't know if our lifestyles are compatible.",
        "I don't know how much compromise is healthy.",
        "I don't know if shared faith is important.",
      ],
    },
    {
      id: "rec-c21b-hard-conversations",
      role: "route",
      pathwayPlayId: "the-conversation-not-the-debate",
      headline: "These conversations turn into debates.",
      explanation:
        "They go wrong the same way — arguing about whether the position is correct, when what you wanted was to know what it means to them.",
      secondaryExamples: [
        "I don't know how to discuss politics respectfully.",
        "I don't know how to have hard conversations about faith.",
        "I don't know how to navigate spiritual differences.",
      ],
    },
    {
      id: "rec-c21b-own-terms",
      role: "route",
      pathwayPlayId: "dating-on-my-own-terms",
      headline: "I want to date in a way that matches what I believe.",
      explanation:
        "The difficulty isn't knowing your values. It's that dating has strong defaults, and holding a different position means explaining it to people who didn't ask.",
      secondaryExamples: [
        "I don't know how to date with integrity.",
        "I don't want to compromise my beliefs.",
        "My faith has changed how I view relationships.",
      ],
    },
  ],

  plays: [
    // ───────────────────────────────────────────── Play 1 ──
    {
      playId: "raising-it-early",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Raising It Early",
      positioning:
        "For the question you've been saving. You draft it — then you ask it.",
      recognitionGate: {
        prompt: "Is there something big you've been waiting for the right moment to raise?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "There's no correct week and no agreed norm. What there is: an asymmetry.",
            "Raise it early and you risk seeming intense, or ending something that might have been good. Raise it late and you risk two years, real attachment, and finding out something that was knowable at week three.",
            "Most people wait far longer than that asymmetry justifies, because the early cost is immediate and the late cost is hypothetical until it isn't.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The fear isn't really the question. It's that asking turns a nice evening into an assessment — and it can, if you put a question to someone without going first.",
            "\u201cDo you want children?\u201d requires an answer and arrives without context. \u201cI've always assumed I'd have children — what about you?\u201d is an exchange.",
            "Going first also tells them what you think, which is exactly what you're hoping they'll do. People match the register they're given.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "One thing you've been saving. Not the whole list — the one that would change what you do.",
          fields: [
            {
              id: "the-question",
              label: "What have you been waiting to ask?",
              input: "chips",
              suggestions: [
                "Whether they want children",
                "What they think about marriage",
                "How central faith is to their life",
                "Where they see themselves living",
                "Something else",
              ],
            },
            {
              id: "my-own-position",
              label: "What's your own answer to it? You'll be going first.",
              input: "text",
              placeholder: "Plainly, as you'd say it out loud.",
            },
            {
              id: "how-long-waiting",
              label: "How long have you been not asking?",
              input: "text",
              placeholder: "And what were you waiting for?",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "How you'll open it",
          helper:
            "Your position first, then the question. You might start with \u201cI've always assumed\u2026 what about you?\u201d or \u201cSomething I know about myself is\u2026 where are you on that?\u201d One question, not three.",
        },
        {
          kind: "realWorldUse",
          useWhen:
            "An ordinary conversation with time in it — not the end of an evening, and not alongside two other big questions.",
          doThis:
            "Say your bit, then ask theirs. Then stop and let them answer at their own length. If it turns into a longer conversation, that's fine; if it doesn't, don't chase it.",
        },
        {
          kind: "output",
          heading: "What I asked, and what they said",
          body:
            "Whatever came back, you now know something that was going to matter eventually.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Early costs a second date. Late costs two years.",
            "Go first. People match the register they're given.",
            "One question, not three. Three is an interview.",
          ],
        },
      ],
      portable: [
        "Early costs a second date. Late costs two years.",
        "Go first. People match the register they're given.",
        "One question, not three. Three is an interview.",
      ],
      myPlaysTemplate: {
        when: "When there's something big I've been saving for the right moment",
        move: "Offer my own position, then ask theirs",
        lookingFor: "A real answer, at whatever length they give it",
        watchOut: "Stacking three big questions into one evening",
        remember: "If it scares someone off, that's usually the thing I was trying to find out.",
      },
      fidelity: {
        correct:
          "One significant question is raised with the reader's own position offered first, at a time with room for an answer.",
        misuse: [
          "Asking several big questions in a single conversation.",
          "Asking without offering your own position.",
          "Treating the answer as final rather than as a starting point.",
        ],
        notMeaning:
          "It does not mean the answer will suit you, that asking early is always right, or that they'll be comfortable with it.",
      },
    },

    // ───────────────────────────────────────────── Play 2 ──
    {
      playId: "which-differences-will-matter",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Which Differences Will Matter",
      positioning: "For sorting a preference from a structural difference.",
      recognitionGate: {
        prompt: "Are you trying to work out whether a difference between you is serious?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Nearly every couple is different in ways that don't matter and similar in ways that don't help. The sorting is the useful part.",
            "One test does most of the work: does this difference mean the lives you each want can't both happen?",
            "If yes, it's structural — and structural things don't resolve, they get decided about. If it would just be harder, it's a preference. Most differences are preferences.",
          ],
        },
        {
          kind: "learn",
          body: [
            "This also answers \u201chow much compromise is healthy\u201d, which is usually asking for a number that doesn't exist.",
            "Compromise on preferences is just how two people live together — where you holiday, how often you see people, whose family at Christmas.",
            "Compromise on structure means one person not getting the thing. Half a child doesn't exist. Living halfway between two cities suits nobody.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Structural, or a preference?",
          situation:
            "It's going well. A few differences have surfaced and you're trying to work out which of them would actually decide anything.",
          buckets: [
            { id: "structural", label: "Both lives can't happen" },
            { id: "preference", label: "Harder, but workable" },
          ],
          items: [
            {
              id: "sort-c21b-children",
              text: "One of you wants children and the other is fairly sure they don't",
              correctBucket: "structural",
              correction:
                "The clearest one there is, and the one most often postponed.",
            },
            {
              id: "sort-c21b-tidiness",
              text: "One of you is much tidier than the other",
              correctBucket: "preference",
              correction: "Genuinely annoying, and not a life that can't happen.",
            },
            {
              id: "sort-c21b-sunday",
              text: "Their faith shapes every Sunday and most holidays; yours shapes nothing",
              correctBucket: "structural",
              correction:
                "It's the week that decides this, not the belief. Worth checking early.",
            },
            {
              id: "sort-c21b-politics",
              text: "You vote differently",
              correctBucket: "preference",
              correction:
                "For many couples workable — though it depends how much of the week it touches.",
            },
            {
              id: "sort-c21b-city",
              text: "Their whole life is in one city and yours is fixed in another",
              correctBucket: "structural",
              correction: "If both are genuinely fixed, this is arithmetic.",
            },
            {
              id: "sort-c21b-social",
              text: "They want people round constantly; you want quiet",
              correctBucket: "preference",
              correction: "A negotiation about the calendar, not about the life.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Your own differences. Only you can sort these — someone else's list won't fit.",
          fields: [
            {
              id: "the-differences",
              label: "What differences have you noticed?",
              input: "text",
              placeholder: "All of them, including the ones that feel small.",
            },
            {
              id: "structural-ones",
              label: "Which of those means both lives genuinely can't happen?",
              input: "text",
              placeholder: "Usually fewer than expected. If none, that's a real finding.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Do you actually know their position on the structural ones — or are you assuming?",
          enoughLabel: "They've told me directly",
          needMoreLabel: "I'm inferring it",
          needMoreIntro:
            "Very common, and it's exactly the thing worth checking early. Inferred positions on structural questions are where the two-year surprises come from.",
          needToKnowLabel: "What I'd want to actually hear them say",
          observableLabel: "Something they could tell me plainly",
        },
        {
          kind: "output",
          heading: "What would actually matter",
          body:
            "A shorter list than you started with, usually. And a note of which ones you're assuming rather than know.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Structural means both lives can't happen. Not that it'd be hard.",
            "Compromise on preferences, not on structure.",
            "Half a child doesn't exist.",
          ],
        },
      ],
      portable: [
        "Structural means both lives can't happen. Not that it'd be hard.",
        "Compromise on preferences, not on structure.",
        "Half a child doesn't exist.",
      ],
      myPlaysTemplate: {
        when: "When I can't tell whether a difference is serious",
        move: "Sort by whether both lives can still happen",
        lookingFor: "Which structural positions I'm assuming rather than knowing",
        watchOut: "Using someone else's list of what should matter",
        remember: "Most differences are preferences. A few aren't, and those get decided about.",
      },
      fidelity: {
        correct:
          "Differences are sorted by whether both lives can happen, and assumed positions are distinguished from known ones.",
        misuse: [
          "Treating every difference as structural.",
          "Using someone else's list.",
          "Sorting to justify a conclusion already reached.",
        ],
        notMeaning:
          "It does not mean a structural difference is fatal, that preferences are easy, or that sorting settles anything.",
      },
    },

    // ───────────────────────────────────────────── Play 3 ──
    {
      playId: "the-conversation-not-the-debate",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Conversation, Not the Debate",
      positioning: "For faith, politics, and anything that turns into an argument.",
      recognitionGate: {
        prompt: "Do these conversations turn into debates about who's right?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "They go wrong the same way, whatever the subject. It becomes an argument about whether the position is correct — when what you were trying to find out was what it means to the person.",
            "Two different conversations. \u201cIs this view right?\u201d is unwinnable, and neither of you is changing your mind over dinner.",
            "\u201cWhat does holding this do to your life?\u201d is answerable, interesting, and the actual information you need.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The second version also goes better socially, because it's a genuine question rather than an opening position — and people can tell the difference immediately.",
            "It's especially useful with faith, where the belief matters much less than what it does to the week. What someone believes can differ enormously from you and cause no friction. What they do on Sundays might.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these is a question, and which is an opening position?",
          situation:
            "Something has come up — a political view, or how they were raised, or what they do on a Sunday — and you want to understand it rather than argue about it.",
          buckets: [
            { id: "question", label: "A genuine question" },
            { id: "position", label: "An opening position" },
          ],
          items: [
            {
              id: "sort-c21b-how-did-you",
              text: "\u201cHow did you come to think that?\u201d",
              correctBucket: "question",
              correction: "Genuinely curious, and almost always answered well.",
            },
            {
              id: "sort-c21b-but-surely",
              text: "\u201cBut surely you'd agree that\u2026\u201d",
              correctBucket: "position",
              correction: "An argument wearing a question mark.",
            },
            {
              id: "sort-c21b-what-does-it-mean",
              text: "\u201cWhat does that actually look like in your week?\u201d",
              correctBucket: "question",
              correction:
                "The most useful question in this whole Playbook, and it works on anything.",
            },
            {
              id: "sort-c21b-dont-you-think",
              text: "\u201cDon't you think that's a bit\u2026?\u201d",
              correctBucket: "position",
              correction: "A judgement, offered for agreement.",
            },
            {
              id: "sort-c21b-what-would-you-want",
              text: "\u201cWhat would you want for children, if you had them?\u201d",
              correctBucket: "question",
              correction: "Concrete, forward-looking, and hard to argue with.",
            },
            {
              id: "sort-c21b-how-can-you",
              text: "\u201cHow can you believe that when\u2026\u201d",
              correctBucket: "position",
              correction: "This one ends the conversation rather than opening it.",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "Your version of the question",
          helper:
            "About what it does rather than whether it's right. You might use \u201cWhat does that look like in your week?\u201d or \u201cHow did you come to think that?\u201d \u2014 both work on almost anything.",
        },
        {
          kind: "output",
          heading: "The question I'll ask",
          body:
            "A conversation that reveals an incompatibility hasn't gone wrong. That's what asking was for.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Not \u201cis this right\u201d. \u201cWhat does holding it do to your life?\u201d",
            "Belief matters less than what it does to the week.",
            "Finding an incompatibility isn't the conversation failing.",
          ],
        },
      ],
      portable: [
        "Not \u201cis this right\u201d. \u201cWhat does holding it do to your life?\u201d",
        "Belief matters less than what it does to the week.",
        "Finding an incompatibility isn't the conversation failing.",
      ],
      myPlaysTemplate: {
        when: "When faith or politics turns into a debate",
        move: "Ask what holding it does to their life, rather than whether it's right",
        lookingFor: "What it actually changes about their week",
        watchOut: "An argument wearing a question mark",
        remember: "A conversation that reveals an incompatibility has worked.",
      },
      fidelity: {
        correct:
          "A question about the practical effect of a position is asked, in place of a challenge to whether the position is correct.",
        misuse: [
          "Asking the practical question as a way into the argument.",
          "Using it to demonstrate that their position is inconsistent.",
          "Treating a difference discovered this way as a failure.",
        ],
        notMeaning:
          "It does not mean you'll agree, that the difference is workable, or that asking well prevents conflict.",
      },
    },

    // ───────────────────────────────────────────── Play 4 ──
    {
      playId: "dating-on-my-own-terms",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Dating on My Own Terms",
      positioning: "For holding a position against the default.",
      recognitionGate: {
        prompt: "Do you find yourself explaining your values to people who didn't ask?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "The difficulty isn't knowing your values. You know them — that's further than most people get.",
            "It's that dating has strong defaults, and holding a different position means explaining it, repeatedly, to people who didn't ask and sometimes to people who want to argue.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Two things make it easier. Stating it as a fact about you rather than a position to be defended — \u201cI don't do that\u201d needs no argument attached.",
            "And saying it before it's contested rather than at the moment of contest. It's much easier as information than as a refusal.",
            "You'll lose some people this way. That isn't the method failing — it's the method working, earlier and more cheaply than it would have otherwise.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "What are your actual terms? Not what you think is reasonable — what's true.",
          fields: [
            {
              id: "my-terms",
              label: "What do you do differently from the default?",
              input: "text",
              placeholder: "Pace, exclusivity, physical, drinking, how you spend Sundays.",
            },
            {
              id: "when-i-say-it",
              label: "When does it usually come up?",
              input: "chips",
              suggestions: [
                "Before anything happens",
                "When it's about to be relevant",
                "When I'm already having to refuse",
                "It doesn't — I just manage around it",
              ],
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "As information, before it's contested.",
          conditionLabel: "The one I'll say plainly, and when",
          thenLabel: "And if someone wants me to justify it, I'll",
          actions: [
            "Say \u201cthat's just how I do it\u201d and leave it",
            "Explain it once, and only once",
            "Ask what makes them want a reason",
            "Take the pushback as information",
          ],
          controlCheck:
            "This is a fact about me offered early, not a rule I'm imposing \\u2014 and nobody is owed a justification for something that only affects me.",
        },
        {
          kind: "output",
          heading: "My terms, said as information",
          body:
            "Losing some people is the method working, not failing.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "\u201cThat's just how I do it\u201d is a complete sentence.",
            "Information before it's contested, not a refusal at the moment of contest.",
            "Someone requiring justification for something that affects only me is information.",
          ],
        },
      ],
      portable: [
        "\u201cThat's just how I do it\u201d is a complete sentence.",
        "Information before it's contested, not a refusal at the moment of contest.",
        "Someone requiring justification for something that affects only me is information.",
      ],
      myPlaysTemplate: {
        when: "When my way of doing things runs against the default",
        move: "Say it early, as a fact about me rather than a position to defend",
        lookingFor: "How someone responds to a position that costs them nothing",
        watchOut: "Explaining it repeatedly — once is the whole allowance",
        remember: "Losing people this way is the method working, and it's cheaper early.",
      },
      fidelity: {
        correct:
          "A personal term is stated early as information, without justification, and pushback is treated as information.",
        misuse: [
          "Explaining it repeatedly to win agreement.",
          "Stating it as a rule imposed on the other person.",
          "Waiting until the moment of contest and delivering it as a refusal.",
        ],
        notMeaning:
          "It does not mean people will accept it, that stating it protects it, or that anyone who disagrees is wrong for you.",
      },
    },
  ],

  literature: C21B_LITERATURE,

  missions: [
    {
      id: "mission-c21b-ask",
      version: 1,
      playId: "raising-it-early",
      title: "Ask a second one, a fortnight later",
      instruction:
        "You asked the first in the tool. Ask another in two weeks — one question, your position first.",
      linkToOperation: "Raising a significant question with one's own position offered first",
      attemptMeaning:
        "You asked. An answer that doesn't suit you is still a completed attempt.",
      suitability:
        "If you find yourself stacking them into one evening, spread them out — that's the difference between a conversation and an interview.",
      progression: [
        {
          id: "rung-c21b-ask-2",
          instruction: "Ask something you'd normally save for much later.",
        },
      ],
    },
    {
      id: "mission-c21b-sort",
      version: 1,
      playId: "which-differences-will-matter",
      title: "Check one assumed position",
      instruction:
        "Take one structural thing you've been inferring and actually ask about it. Note whether you had it right.",
      linkToOperation: "Converting an inferred structural position into a known one",
      attemptMeaning:
        "You checked. Being wrong about what you assumed is the useful outcome.",
      suitability:
        "If you found no structural differences, that's a real result — worth noting rather than looking harder for one.",
      progression: [
        {
          id: "rung-c21b-sort-2",
          instruction: "Ask them which differences they'd call structural.",
        },
      ],
    },
    {
      id: "mission-c21b-question",
      version: 1,
      playId: "the-conversation-not-the-debate",
      title: "Use the week question once",
      instruction:
        "Next time a belief or a view comes up, ask what it looks like in their week rather than whether it's right.",
      linkToOperation: "Asking about practical effect rather than correctness",
      attemptMeaning:
        "You asked it. Where it goes afterwards isn't the measure.",
      suitability:
        "If the conversation turns into a debate anyway, notice who took it there — sometimes it's them, and that's information too.",
      progression: [
        {
          id: "rung-c21b-question-2",
          instruction: "Use it on the subject you've been most avoiding.",
        },
      ],
    },
    {
      id: "mission-c21b-terms",
      version: 1,
      playId: "dating-on-my-own-terms",
      title: "Say one term before it's relevant",
      instruction:
        "Say one of your terms early, as information, before it's about to be contested. Note how it's received.",
      linkToOperation: "Stating a personal term as information rather than as a refusal",
      attemptMeaning:
        "You said it. Someone reacting badly is the information you were after.",
      suitability:
        "If saying it early feels impossible with someone, that's worth noticing rather than pushing through.",
      progression: [
        {
          id: "rung-c21b-terms-2",
          instruction:
            "Say the one you're least comfortable stating, and don't explain it.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c21b-ask",
      version: 1,
      playId: "raising-it-early",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Offered my position first",
          "Asked one thing, not three",
          "Asked earlier than I normally would",
          "Waited for a better moment again",
        ],
      },
      performedOperation: {
        label: "Did you offer your own position and then ask theirs?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Where they actually stand",
          "That it wasn't as heavy as I expected",
          "That I'd been assuming their answer",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It landed as an interview",
          "I couldn't find the moment",
          "The answer wasn't what I hoped",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c21b-sort",
      version: 1,
      playId: "which-differences-will-matter",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Sorted by whether both lives can happen",
          "Noticed what I was assuming",
          "Checked one assumed position",
          "Treated everything as serious",
        ],
      },
      performedOperation: {
        label: "Did you sort by whether both lives can still happen?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That most of it is preference",
          "That there's a structural one",
          "How much I was inferring",
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
      id: "review-c21b-question",
      version: 1,
      playId: "the-conversation-not-the-debate",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Asked what it does to their week",
          "Didn't argue about whether it's right",
          "Let a difference stand without resolving it",
          "It became a debate anyway",
        ],
      },
      performedOperation: {
        label: "Did you ask about practical effect rather than correctness?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What it actually changes about their life",
          "That the belief matters less than I thought",
          "That it matters more than I thought",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "They took it as a challenge",
          "I couldn't keep out of the argument",
          "What I found out was hard to hear",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c21b-terms",
      version: 1,
      playId: "dating-on-my-own-terms",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said it early, as information",
          "Didn't justify it",
          "Took the reaction as information",
          "Waited until I had to refuse",
        ],
      },
      performedOperation: {
        label: "Did you state it early, without justifying it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's easier said early",
          "How someone responds to a position that costs them nothing",
          "That I'd been managing around it",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I ended up explaining it repeatedly",
          "They wanted a justification",
          "Saying it ended something",
          "Nothing stuck",
        ],
      },
    },
  ],
};
