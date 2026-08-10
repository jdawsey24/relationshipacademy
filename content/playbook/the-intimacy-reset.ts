/**
 * Cluster 9 — "Difficulty Staying Physically Connected"
 * The Relationship Playbook™ · Rebuilding Physical Connection
 *
 * Track: Expansion. Task = Integration. Core Need: TO BE CHOSEN.
 * §0 DECISION: PLAYS-ONLY.
 *
 * ⚠ OWNER RULINGS 29 Jul 2026 (Part B, Instance 7):
 *   1. FRAME — WANTED-NESS, not frequency. No tool is built around initiating
 *      more. "I miss affection more than sex" is the key statement.
 *   2. DESIRE DISCREPANCY — MEDIUM guard. Tools work on TALKING about it,
 *      never on GETTING more of it. Every relevant Play carries the boundary
 *      in its fidelity block and its control check.
 *   3. MEDICAL — FIRM and FIRST. `lit-c9-rule-this-out-first` is entry one and
 *      is named in the opening screen before anything else.
 *   4. JOINT WORK — unlike Clusters 7 and 8, this is NOT "your half". The work
 *      requires the other person. Every Play produces a CONVERSATION and every
 *      Mission is "have this talk". There is no solo practice in this cluster.
 *
 * ⚠ CONTENT — clinical, practical, non-explicit throughout.
 *
 * ⚠ CLAIM SCOPE. May claim: work out what you actually miss; say it out loud;
 *   have the conversation about a difference in wanting. MUST NOT CLAIM:
 *   frequency increases, desire returns, your partner will want you more, or
 *   that any of this can be achieved alone.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C9_LITERATURE } from "./the-intimacy-reset-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const REBUILDING_PHYSICAL_CONNECTION: PlaybookContent = {
  playbookKey: "the-intimacy-reset", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Rebuilding Physical Connection",

  opening: {
    title: "Two things before we start",
    body: [
      "First: rule out the physical causes. Medication, menopause, thyroid, pain, the year after a baby — all common, all treatable, and all easy to miss. Read 'Before you work on this' before anything else.",
      "Second: this one can't be done alone. Everything here ends in a conversation, because that's the only place this work happens. If you're hoping for something you can practise quietly on your own side, that isn't this.",
    ],
    manifestations: [
      "I don't feel desired.",
      "I miss affection more than sex.",
      "We have different sex drives.",
      "I don't know how to talk about it.",
    ],
    cta: "Start by ruling out the physical",
  },

  recognitionCards: [
    {
      id: "rec-c9-rule-out-first",
      role: "signpost",
      pathwayPlayId: null,
      headline: "Something's changed and I don't know why.",
      validationCopy:
        "Changes in desire can come from many places: your body, a medication, hormones, feelings, the relationship, or a mix of these. Antidepressants and other medicines, pregnancy or the months after a baby, perimenopause or menopause, thyroid conditions, pain, stress, and relationship trouble can all play a part. A GP or the right healthcare professional can help rule out or treat medical causes while you look at the relationship side too. Finding a physical cause doesn't mean the relationship side doesn't matter — and the other way round too.",
      secondaryExamples: [
        "This started fairly suddenly.",
        "One of us is on medication or has had a health change.",
      ],
    },
    {
      id: "rec-c9-not-wanted",
      role: "route",
      pathwayPlayId: "what-you-actually-miss",
      headline: "I don't feel wanted anymore.",
      explanation:
        "This usually looks like a problem about how often you have sex, but it isn't. More sex doesn't fix not feeling wanted.",
      secondaryExamples: [
        "I don't feel desired.",
        "I feel rejected by my partner.",
        "I miss affection more than sex.",
      ],
    },
    {
      id: "rec-c9-cant-say-it",
      role: "route",
      pathwayPlayId: "saying-it-out-loud",
      headline: "I don't know how to bring this up.",
      explanation:
        "Most couples who've been together a long time have never talked about this in a plain, direct way. There's no good moment and no good way to start.",
      secondaryExamples: [
        "We avoid talking about sex.",
        "I don't know how to talk about what I want.",
        "I don't know how to initiate.",
      ],
    },
    {
      id: "rec-c9-different-wanting",
      role: "route",
      pathwayPlayId: "the-difference-conversation",
      headline: "We want different amounts.",
      explanation:
        "Very common, and not something one person solves. This is about having the conversation, not about getting more.",
      secondaryExamples: [
        "We have different sex drives.",
        "We're on different pages sexually.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 ──
    {
      playId: "what-you-actually-miss",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What You Actually Miss",
      positioning: "For working out what's missing before you try to ask for it.",
      recognitionGate: {
        prompt: "Do you feel less wanted than you used to?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "It shows up as: we don't have sex anymore. It usually means: I don't feel wanted.",
            "Those two need different conversations. Some people ask for more sex and get it, and still don't feel wanted. They'll tell you the first thing didn't fix the second.",
            "So it's worth being clear before you say anything. The wrong ask gets you the wrong thing.",
          ],
        },
        {
          kind: "learn",
          body: [
            "In long relationships, touch often stops being ordinary. It turns into a signal — a hand on the back now means something is being started.",
            "So the person who doesn't want sex right now stops touching at all, so they don't seem to be starting something. And the other person reads that missing touch as not being wanted.",
            "Both of them make sense. The result is two people who miss each other and have stopped touching.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these would actually change how you feel?",
          situation:
            "It's been a while. Neither of you has said anything about it, and the not-saying has become its own thing.",
          buckets: [
            { id: "would", label: "Yes, this is it" },
            { id: "wouldnt", label: "Not really" },
          ],
          items: [
            {
              id: "sort-c9-more-often",
              text: "The same as now, but more often",
              correctBucket: "wouldnt",
              correction:
                "For most people here, more of the same isn't it. Still worth checking — for some, it really is.",
            },
            {
              id: "sort-c9-reached-for",
              text: "Being reached for when nothing's going to happen",
              correctBucket: "would",
              correction: "That's the one most people land on. Touch without a question in it.",
            },
            {
              id: "sort-c9-told",
              text: "Being told they find you attractive, out loud",
              correctBucket: "would",
              correction: "Often the missing piece, and almost never asked for.",
            },
            {
              id: "sort-c9-scheduled",
              text: "A regular slot in the diary",
              correctBucket: "wouldnt",
              correction:
                "It fixes how often, but not feeling wanted. Useful for some couples, not for this.",
            },
            {
              id: "sort-c9-they-start",
              text: "Them starting it, rather than you",
              correctBucket: "would",
              correction:
                "Being chased rather than doing the chasing. Very common answer.",
            },
            {
              id: "sort-c9-new-things",
              text: "Trying something different in bed",
              correctBucket: "wouldnt",
              correction:
                "That's about routine. Different question — see 'When it's gone routine'.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Say it in your own words",
          fields: [
            {
              id: "what-i-miss",
              input: "text",
              label: "What do you actually miss?",
              placeholder: "Not what's missing. What you miss. There's a difference.",
            },
            {
              id: "last-time",
              input: "text",
              label: "When did you last have it? Briefly.",
              placeholder: "A moment, if one comes to mind.",
            },
          ],
        },
        {
          kind: "output",
          heading: "What I actually miss",
          body: "Clear enough to ask for. That's the whole job of this one.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "More sex doesn't fix not feeling wanted.",
            "What do I miss — not what's missing.",
            "Touch with no question in it.",
          ],
        },
      ],
      portable: [
        "More sex doesn't fix not feeling wanted.",
        "What do I miss — not what's missing.",
        "Touch with no question in it.",
      ],
      myPlaysTemplate: {
        when: "When I feel less wanted and I'm about to ask for the wrong thing",
        move: "Work out exactly what I miss before saying anything",
        lookingFor: "Whether it's about how often, or about feeling wanted — they need different conversations",
        watchOut: "Asking for more sex when what I want is to be reached for",
        remember: "Wanting to be wanted isn't the same as wanting more sex.",
      },
      fidelity: {
        correct:
          "I've named the missing thing exactly, and kept it separate from how often.",
        misuse: [
          "Turning it into a list of what they've failed to do.",
          "Deciding what they'd say before asking them.",
        ],
        notMeaning:
          "It does not mean you'll get it, that they'll agree with how you see it, or that naming it changes anything on its own.",
      },
    },

    // ─────────────────────────────── Play 2 ──
    {
      playId: "saying-it-out-loud",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Saying It Out Loud",
      positioning: "For the conversation neither of you has started.",
      recognitionGate: {
        prompt: "Have you and your partner ever talked about this directly?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Not because they're avoiding it. It's because there's no good moment and no good way to start. And the longer it goes unsaid, the bigger a deal saying it becomes.",
            "There isn't a version of this that isn't awkward. The aim is to get through it, not to do it well.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Clothes on, nothing about to happen. Not in bed. Not after being turned down. Somewhere neither of you feels exposed.",
            "Say what you miss, not what's missing. \u201cI miss you reaching for me\u201d is something they can take in. \u201cYou never touch me anymore\u201d sounds like an accusation, and they'll get defensive.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Bringing it up means saying out loud that you want something you're not getting — to the person not giving it. That leaves you exposed in a way most talks don't.",
            "It's also the only way. There's no version where they figure it out and you don't have to say it.",
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "How you'll open it",
          helper:
            "Keep it short, and say what you miss rather than what's missing. You might start with “Can I say something that's a bit awkward?” or “Something I miss, and I don't want it to sound like a complaint…”",
        },
        {
          kind: "ruleBuilder",
          intro: "When and how",
          conditionLabel: "When I'll say it",
          thenLabel: "And what I'll hold to",
          actions: [
            "Not in bed, not at night",
            "Not after being turned down",
            "Somewhere side by side rather than face to face",
            "This week, before I talk myself out of it",
          ],
          controlCheck:
            "I'm saying what I miss, not asking for something tonight. Their answer might be about them, not about me. This is one conversation, not the whole subject.",
        },
        {
          kind: "output",
          heading: "What I'm going to say, and when",
          body: "You can't make it not awkward. Getting through it is the win.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Clothes on, nothing pending.",
            "What I miss, not what's missing.",
            "Getting through it is the win.",
          ],
        },
      ],
      portable: [
        "Clothes on, nothing pending.",
        "What I miss, not what's missing.",
        "Getting through it is the win.",
      ],
      myPlaysTemplate: {
        when: "When neither of us has ever raised this directly",
        move: "Say what I miss, out loud, at a time when nothing's about to happen",
        lookingFor: "Whether it can be a conversation rather than a negotiation",
        watchOut: "Raising it in bed, or straight after being turned down",
        remember: "There's no non-awkward version. That isn't a sign to wait.",
      },
      fidelity: {
        correct:
          "I've brought it up at a calm time, as something I miss rather than something they're holding back.",
        misuse: [
          "Bringing it up in bed, or right after being turned down.",
          "Making it about what they've failed to give.",
          "Turning one conversation into a full review of everything.",
        ],
        notMeaning:
          "It does not mean they'll respond well, that anything changes, or that one conversation settles it.",
      },
    },

    // ─────────────────────────────── Play 3 · guarded ──
    {
      playId: "the-difference-conversation",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Difference Conversation",
      positioning: "For when you want different amounts — and no, this isn't about getting more.",
      recognitionGate: {
        prompt: "Do you and your partner want different amounts of physical intimacy?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "We want to be plain about this before anything else, because nearly all advice in this area points the other way.",
            "A difference in wanting isn't fixed by starting things better, being more attractive, or trying harder. Do that long enough and it turns into pressure — and pressure lowers desire in the person on the receiving end, again and again.",
            "So this tool doesn't help you get more. It helps you have the talk about the difference. That's a different thing — and it's the only part you can do on your own.",
          ],
        },
        {
          kind: "learn",
          body: [
            "This isn't about agreeing on a number. Numbers agreed under pressure don't last, and both people know it.",
            "It's about getting both sides said out loud, once, without either of you having to defend it. That includes if the honest answer from either side is \u201cless, at the moment\u201d.",
            "Most couples in this spot have never done that. They've had rounds of it at the wrong moment instead.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "Where you stand, honestly",
          fields: [
            {
              id: "my-position",
              input: "text",
              label: "What's true for you right now?",
              placeholder: "Not what you think is reasonable. What's actually true.",
            },
            {
              id: "what-i-assume",
              input: "text",
              label: "What do you assume is true for them?",
              placeholder: "And note whether they've ever actually told you.",
            },
            {
              id: "affection-separate",
              input: "chips",
              label: "Would separating affection from sex change anything for you?",
              suggestions: [
                "Yes, quite a lot",
                "Some",
                "No, it's the sex I miss",
                "I don't know",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Have they actually told you where they are — or are you working it out from behaviour?",
          enoughLabel: "They've told me directly",
          needMoreLabel: "I'm working it out from behaviour",
          needMoreIntro:
            "Very common — and it's why this conversation is worth having. Silence can mean a lot of things, and right now you're picking one.",
          needToKnowLabel: "What I'd want to actually know",
          observableLabel: "Something they could tell me",
        },
        {
          kind: "output",
          heading: "Both positions, said once",
          body: "Not an agreement. Two things now known instead of guessed at.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A difference in wanting isn't mine to solve.",
            "Not negotiating a number. Getting both positions said.",
            "Pressure reduces desire. It doesn't increase it.",
          ],
        },
      ],
      portable: [
        "A difference in wanting isn't mine to solve.",
        "Not agreeing on a number. Getting both sides said.",
        "Pressure lowers desire. It doesn't raise it.",
      ],
      myPlaysTemplate: {
        when: "When we want different amounts and we've never talked about it",
        move: "Get both sides said out loud, once, without either being defended",
        lookingFor: "What's actually true for them, rather than what I've guessed",
        watchOut: "Turning it into a negotiation, or a case for why I should get more",
        remember: "This isn't a problem I can solve on my own, and trying harder makes it worse.",
      },
      fidelity: {
        correct:
          "Both sides are said once, at a calm time, without either being negotiated or defended.",
        misuse: [
          "Using it to argue for more.",
          "Agreeing on how often, under pressure.",
          "Repeating the conversation until the answer changes.",
        ],
        notMeaning:
          "It does not mean the difference goes away, that they'll want more, or that having the conversation means you're owed anything.",
      },
      supportSignposts: [
        {
          id: "signpost-c9-pressure",
          heading: "If they've already said no",
          body:
            "If your partner has told you they don't want to, the answer isn't a better approach. Wanting more than your partner does really does hurt, and it isn't something you can fix on your own — and if you keep trying, it turns into pressure, whatever you mean by it. A qualified sex therapist can help partners look at differences in desire without ever treating consent as negotiable. It's a reasonable thing to want help with, rather than keep working at it alone. Where there's fear, coercion, or retaliation, joint work isn't the right setting — individual support comes first.",
        },
      ],
    },
  ],

  literature: C9_LITERATURE,

  missions: [
    {
      id: "mission-c9-miss",
      version: 1,
      playId: "what-you-actually-miss",
      title: "Say the one sentence",
      instruction:
        "Tell them the thing you worked out you miss. One sentence, at a calm time. Then let it sit.",
      linkToOperation: "Naming the missing thing exactly",
      attemptMeaning:
        "You said it. How they took it isn't the measure.",
      suitability:
        "If you haven't ruled out the physical causes yet, do that first — it may change the conversation entirely.",
      progression: [
        { id: "rung-c9-miss-2", instruction: "Ask them the same question: what do you miss?" },
      ],
    },
    {
      id: "mission-c9-talk",
      version: 1,
      playId: "saying-it-out-loud",
      title: "Have the conversation",
      instruction:
        "Say your opening, at the time you chose. Clothes on, nothing about to happen. See where it goes.",
      linkToOperation: "Opening the subject directly at a calm time",
      attemptMeaning:
        "You raised it. Awkward counts. Badly counts.",
      suitability:
        "Not in bed and not after being turned down. If those are the only times it comes up, that's worth noticing on its own.",
      progression: [
        { id: "rung-c9-talk-2", instruction: "Come back to it a week later rather than leaving it as one conversation." },
      ],
    },
    {
      id: "mission-c9-difference",
      version: 1,
      playId: "the-difference-conversation",
      title: "Get both positions said",
      instruction:
        "Say yours. Ask theirs. Don't negotiate anything in the same conversation.",
      linkToOperation: "Stating both positions without negotiation",
      attemptMeaning:
        "Both positions are now known rather than guessed at. That's the whole outcome.",
      suitability:
        "If they've already told you they don't want to, don't do this one. Read the signpost on that Play instead.",
      progression: [
        { id: "rung-c9-difference-2", instruction: "Talk about affection separately from sex, as its own subject." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c9-miss",
      version: 1,
      playId: "what-you-actually-miss",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Worked out it wasn't about frequency",
          "Said one specific thing",
          "Asked what they miss",
          "Asked for more sex anyway",
        ],
      },
      performedOperation: {
        label: "Did you identify what you actually miss, separate from frequency?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it's about feeling wanted",
          "That it is actually about frequency",
          "What they miss",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't separate the two",
          "Saying it made it worse",
          "They didn't understand what I meant",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c9-talk",
      version: 1,
      playId: "saying-it-out-loud",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Raised it at a neutral time",
          "Said what I miss rather than what's missing",
          "Got through the awkward part",
          "Didn't manage to bring it up",
        ],
      },
      performedOperation: {
        label: "Did you raise it at a neutral time, framed as something you miss?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it could be discussed at all",
          "Where they actually are",
          "That they'd been avoiding it too",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into an argument",
          "They shut it down",
          "I couldn't get the words out",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c9-difference",
      version: 1,
      playId: "the-difference-conversation",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said my position without arguing for it",
          "Asked theirs and listened",
          "Kept affection separate from sex",
          "Tried to negotiate a number",
        ],
      },
      performedOperation: {
        label: "Did you get both positions said without negotiating?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Where they actually are",
          "That I'd assumed wrong",
          "That this needs more than the two of us",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It became a negotiation",
          "Hearing their position was hard",
          "Nothing has changed since",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
