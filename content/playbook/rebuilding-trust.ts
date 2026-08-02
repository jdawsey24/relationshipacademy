/**
 * Cluster 16 — "Difficulty Trusting Again After Betrayal"
 * The Relationship Playbook™ · Rebuilding Trust After Betrayal
 *
 * Track: Expiration. Task = Acceptance. Core Need: TO FEEL SECURE.
 * Plays-only. No `simulations[]`.
 *
 * ⚠⚠ THE READER IS TORN AND THE PLAYBOOK MUST NOT PUSH. Owner-ruled. Nothing
 *   here leans toward staying or leaving — not in copy, not in framing, not in
 *   which option is listed first. Where stay/go options appear, the ordering is
 *   deliberately alternated so neither is consistently first.
 *
 * ⚠ BRANCHING STRUCTURE, and its limit. `which-question-am-i-asking` is the
 *   neutral orienting Play; it names both paths and routes onward. Because
 *   Play.routing supports only ONE onward route, the real branch is carried by
 *   the recognition cards: a reader who is checking arrives at `the-checking`,
 *   a reader weighing evidence at `has-anything-changed`, and either path can
 *   reach `what-forgiving-would-take`.
 *   `the-checking` and `has-anything-changed` are STAY-PATH tools — they assume
 *   the reader is still in it. `what-forgiving-would-take` applies to both.
 *
 * ⚠ FORGIVENESS DOES NOT REQUIRE STAYING. The most load-bearing correction in
 *   the cluster. All four combinations exist and the content says so.
 *
 * ⚠ ADDICTION IS OUT OF SCOPE. PE-7 routes to `signpost-c16-addiction`, not a
 *   tool. Support-versus-enabling needs specialist help.
 *
 * ⚠ CLAIM SCOPE. May claim: work out which question you're asking; see what the
 *   checking costs; check whether anything has changed; work out what forgiving
 *   would require. MUST NOT CLAIM: that trust returns, that they've changed,
 *   that either path is right, or that forgiveness is achievable.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C16_LITERATURE } from "./rebuilding-trust-literature";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.

export const REBUILDING_TRUST: PlaybookContent = {
  playbookKey: "rebuilding-trust",
  playbookVersion: 1,
  displayName: "Rebuilding Trust After Betrayal",

  opening: {
    title: "Two questions, and only one comes first",
    body: [
      "Something happened. You're still here, and you don't know whether you're staying.",
      "Most people work on whether trust can come back while that first question is still open. That's exhausting. It's a lot of effort aimed at something you haven't decided to keep.",
      "Nothing here leans either way. Both paths are real, and you can get through either one.",
    ],
    manifestations: [
      "I don't know if staying is weakness.",
      "I don't know if leaving is giving up.",
      "I can't stop checking their phone.",
      "I want to forgive, but I don't know how.",
    ],
    cta: "Start with which question you're actually asking",
  },

  recognitionCards: [
    {
      id: "rec-c16-torn",
      role: "route",
      pathwayPlayId: "which-question-am-i-asking",
      headline: "I don't know if staying is weakness or leaving is giving up.",
      explanation:
        "Neither is true. But while one choice means you're weak and the other means you failed, you can't really weigh them.",
      secondaryExamples: [
        "I don't know if my heart is still in this.",
        "I love them, but I'm tired.",
        "I don't know if I have another chance left in me.",
      ],
    },
    {
      id: "rec-c16-checking",
      role: "route",
      pathwayPlayId: "the-checking",
      headline: "I can't stop checking.",
      explanation:
        "This is what people do after a betrayal. It also can't do the job you need it to — finding nothing only proves nothing was found today.",
      secondaryExamples: [
        "I keep looking for signs they'll cheat.",
        "I keep asking questions that don't bring peace.",
        "I don't know how to stop imagining what happened.",
      ],
    },
    {
      id: "rec-c16-changed",
      role: "route",
      pathwayPlayId: "has-anything-changed",
      headline: "I don't know if they've really changed.",
      explanation:
        "You can't see inside someone. But change has an outside, and you can check the outside.",
      secondaryExamples: [
        "I wonder if they regret what they did.",
        "I want to believe things can be different.",
        "I don't know if I'll ever feel safe again.",
      ],
    },
    {
      id: "rec-c16-forgive",
      role: "route",
      pathwayPlayId: "what-forgiving-would-take",
      headline: "I want to forgive, but I don't know how.",
      explanation:
        "Forgiving doesn't mean staying. All four combinations exist, and people rarely realise forgive-and-leave is one of them.",
      secondaryExamples: [
        "I don't know if forgiveness means forgetting.",
        "I keep bringing up the past.",
        "I want peace more than I want to be right.",
      ],
    },
    {
      id: "rec-c16-addiction",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I don't know where support ends and enabling begins.",
      validationCopy:
        "This Playbook is the wrong tool for that, and we'd rather say so than half-help. Support-versus-enabling is a real and specific question, and there's a whole field of knowledge behind it. Depending on what fits, that might be a therapist who knows addiction, a family-support service, or a peer-support group such as Al-Anon. If the worry is affecting your health, a GP can help. And if there's ever fear, coercion, or violence in it, a domestic-abuse service comes first — or emergency services, if you're in immediate danger. Couples work can be part of the picture later, but it isn't the place to start when safety or coercion is involved. Some of what's here will still apply, but that question needs people who know the territory.",
      secondaryExamples: [
        "I'm exhausted from worrying.",
        "Recovery has changed our relationship.",
        "I'm afraid of going through this again.",
      ],
    },
  ],

  plays: [
    // ─────────────────────────────── Play 1 · orienting, neutral ──
    {
      playId: "which-question-am-i-asking",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Which Question Am I Asking?",
      positioning: "For sorting the decision from everything sitting on top of it.",
      recognitionGate: {
        prompt: "Are you working on trust while the bigger question is still open?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "There are two questions here and they've got tangled.",
            "Do I want to be in this? That's a decision, and it's yours alone.",
            "Can trust come back? A different question — and only worth answering if the first one is yes.",
            "Most people work on the second while the first is still open. That's exhausting. It's a lot of effort aimed at something you haven't decided to keep.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cIs staying weakness?\u201d and \u201cis leaving giving up?\u201d come together, and they do the same job. They turn a decision into a judgement about who you are.",
            "Neither is true. Staying is often harder than leaving. It means living with what happened instead of moving away from it. And leaving is a decision that something can't be fixed — which isn't giving up.",
            "While one choice means you're weak and the other means you failed, you can't weigh them. You're choosing between two accusations.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "You may not want to look at the first question. That's understandable — as long as it's open, nothing is decided and nothing is lost.",
            "Nothing in this tool asks you to decide today. It asks which question you've been working on.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "No option here is the right one, and nothing is scored.",
          fields: [
            {
              id: "which-question",
              label: "Which of these have you actually been working on?",
              input: "chips",
              suggestions: [
                "Whether I want to be in this",
                "Whether trust can come back",
                "Both at once",
                "Neither — I've been getting through the days",
              ],
            },
            {
              id: "what-if-decided",
              label:
                "If you knew for certain you were staying, what would you stop doing? And if you knew you were leaving?",
              input: "text",
              placeholder:
                "Two answers. The gap between them is often the part that tells you the most.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Is the first question — whether you want to be in this — actually open, or have you been avoiding an answer you already have?",
          enoughLabel: "It's genuinely open",
          needMoreLabel: "I think I know and I've been avoiding it",
          needMoreIntro:
            "Either is a real answer, and neither one forces you to act. Knowing which one you're in changes what the rest of this is for.",
          needToKnowLabel: "What I'd need before I could look at it properly",
          observableLabel: "Something that would have to happen or be said",
        },
        {
          kind: "output",
          heading: "Which question I'm on",
          body:
            "Neither path is the better one. Knowing which one you're on is what makes the rest of this useful.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Two questions. Only the first one comes first.",
            "Staying isn't weakness. Leaving isn't giving up.",
            "I don't have to decide today to know which question I'm on.",
          ],
        },
      ],
      portable: [
        "Two questions. Only the first one comes first.",
        "Staying isn't weakness. Leaving isn't giving up.",
        "I don't have to decide today to know which question I'm on.",
      ],
      myPlaysTemplate: {
        when: "When I'm working on trust and haven't decided whether I'm staying",
        move: "Separate whether I want this from whether trust could return",
        lookingFor: "Which question I've actually been spending my effort on",
        watchOut: "Treating either answer as a judgement about who I am",
        remember: "Nobody needs a good enough reason to leave. \u201cI don't want to\u201d is enough.",
      },
      fidelity: {
        correct:
          "The decision question is separated from the trust question, and the reader names which one they have been working on.",
        misuse: [
          "Using it to justify a decision already made.",
          "Treating the output as an instruction to act.",
          "Reading either answer as a statement about your character.",
        ],
        notMeaning:
          "It does not mean you should stay, that you should leave, or that the decision has to be made now.",
      },
      routing: {
        toPlayId: "what-forgiving-would-take",
        label: "Whichever way this goes, forgiveness is a separate question",
      },
      supportSignposts: [
        {
          id: "signpost-c16-pressure",
          heading: "If you're frightened, or being pressured about what you decide",
          body:
            "If any part of this involves being frightened of them, or being pressured about what you choose, or being made responsible for what happened — that's a different situation and this Playbook doesn't cover it. Please talk to someone: a domestic abuse service, a GP, or a therapist. You don't have to be certain it's serious to ask.",
        },
      ],
    },

    // ─────────────────────────────── Play 2 · stay-path ──
    {
      playId: "the-checking",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Checking",
      positioning: "For the searching that never settles anything. For if you're still in it.",
      recognitionGate: {
        prompt: "Are you looking for evidence, and finding it never settles anything?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "First: this is what people do after a betrayal. It isn't a character flaw and you aren't being unreasonable.",
            "It's also doing something specific. Checking is a way to try to turn not-knowing into knowing for sure — to find the thing that would settle it either way.",
            "And it can't, and there's a built-in reason why. Finding nothing doesn't prove anything. It only proves nothing was found today.",
          ],
        },
        {
          kind: "learn",
          body: [
            "That's why it grows. A clean check gives you relief for a few hours. Then the same uncertainty comes back, so you have to check again.",
            "The questions that \u201cdon't bring peace\u201d are the same pattern in words. Each answer leads to the next question, because no answer can do the job you need it to.",
            "And the images work the same way — your mind filling a gap with the few bits of information it has. More detail usually makes it worse, which is why the questions and the images feed each other.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "An honest count. Nothing here is a judgement about whether you're allowed to do it.",
          fields: [
            {
              id: "what-i-do",
              label: "What does the checking actually look like?",
              input: "chips",
              suggestions: [
                "Their phone",
                "Their social media, or the other person's",
                "Asking questions I've already asked",
                "Reading old messages",
                "Watching for changes in their behaviour",
              ],
            },
            {
              id: "how-long-relief",
              label: "When a check comes back clean, how long does the relief last?",
              input: "text",
              placeholder: "Be honest. Most people say hours.",
            },
            {
              id: "what-it-costs",
              label: "What is it costing you?",
              input: "text",
              placeholder: "Time, sleep, how you feel about yourself doing it.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "Is there any result the checking could give you that would actually settle it?",
          enoughLabel: "Yes — there's something that would",
          needMoreLabel: "No — nothing would be enough",
          needMoreIntro:
            "That's the usual answer, and it's the important one. If no result would settle it, the checking isn't gathering information. It's managing a feeling — and it costs you a lot.",
          needToKnowLabel: "What would actually settle it, if anything could",
          observableLabel: "Something that would have to happen outside my own searching",
        },
        {
          kind: "output",
          heading: "What the checking costs, and what it can't do",
          body:
            "Not a decision to stop. A clear view of what you're paying and what it buys.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Finding nothing proves nothing was found today.",
            "If no result would settle it, I'm managing a feeling, not gathering evidence.",
            "This is what people do. It's the cost that's worth looking at, not whether I'm allowed.",
          ],
        },
      ],
      portable: [
        "Finding nothing proves nothing was found today.",
        "If no result would settle it, I'm managing a feeling, not gathering evidence.",
        "This is what people do. It's the cost that's worth looking at, not whether I'm allowed.",
      ],
      myPlaysTemplate: {
        when: "When I'm searching for something that would settle it",
        move: "Look at what the checking costs and what it can never give me",
        lookingFor: "Whether any result would actually settle it",
        watchOut: "Turning this into shame about checking — that isn't the exercise",
        remember: "Relief for a few hours, then the same uncertainty. That's the shape of it.",
      },
      fidelity: {
        correct:
          "The checking is looked at for what it costs and whether any result could settle the question, without judging whether you're allowed to do it.",
        misuse: [
          "Using it to conclude you're paranoid or unreasonable.",
          "Deciding to stop as an act of will and treating a relapse as failure.",
          "Using it to justify more thorough checking.",
        ],
        notMeaning:
          "It does not mean you should stop, that they're trustworthy, or that the uncertainty is unfounded.",
      },
      supportSignposts: [
        {
          id: "signpost-c16-intrusive",
          heading: "If the images are constant",
          body:
            "If you're not sleeping, or the images come as though it's happening now, or they're there most of the day — it can help to take that to a therapist rather than managing it alone. Things like this can happen after a painful betrayal, and there is specific help for them. It doesn't mean anything has gone wrong with you.",
        },
      ],
    },

    // ─────────────────────────────── Play 3 · stay-path ──
    {
      playId: "has-anything-changed",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Has Anything Actually Changed?",
      positioning: "For weighing what you can see. For if you're still in it.",
      recognitionGate: {
        prompt: "Are you trying to work out whether they've genuinely changed?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "You can't see inside someone. That's the honest starting point, and it's why the question feels impossible to answer.",
            "But change has an outside, and you can check the outside — which is the only part you can see.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Remorse isn't change. It's real, and people can be truly devastated and still do it again. \u201cI wonder if they regret it\u201d — almost certainly yes, and it tells you very little about what happens next.",
            "Promises aren't change either, no matter how specific. They become evidence once they've been kept for a while.",
            "Here's what you can see: something that cost them; reassurance they offer instead of waiting to be asked for it; being able to talk about it without turning it into how hard it's been for them; time that has held; and not pushing you to be finished with it.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which of these is evidence, and which is sincerity?",
          situation:
            "It's been several months. They've said a lot and done some things. You're trying to work out which counts.",
          buckets: [
            { id: "evidence", label: "Evidence" },
            { id: "sincerity", label: "Sincere, but not evidence" },
          ],
          items: [
            {
              id: "sort-c16-devastated",
              text: "They were devastated and cried for days",
              correctBucket: "sincerity",
              correction:
                "Real, but it doesn't predict anything. People can be devastated and do it again.",
            },
            {
              id: "sort-c16-ended-friendship",
              text: "They cut contact with the person, including mutual friends",
              correctBucket: "evidence",
              correction: "It cost them something. That's the marker.",
            },
            {
              id: "sort-c16-promised-therapy",
              text: "They promised to start therapy",
              correctBucket: "sincerity",
              correction: "It moves across once they've been going for a while.",
            },
            {
              id: "sort-c16-been-therapy",
              text: "They've been in therapy for four months and still go",
              correctBucket: "evidence",
              correction: "It's lasted, and it cost them time. That counts.",
            },
            {
              id: "sort-c16-said-never",
              text: "They said it will never happen again",
              correctBucket: "sincerity",
              correction: "Everyone says this. It isn't information.",
            },
            {
              id: "sort-c16-doesnt-push",
              text: "They don't push you to be over it",
              correctBucket: "evidence",
              correction:
                "Quieter than the others and one of the more reliable ones.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your own record. Only what's actually happened.",
          fields: [
            {
              id: "what-theyve-done",
              label: "What have they actually done — not said?",
              input: "text",
              placeholder: "Things with dates attached, if you can.",
            },
            {
              id: "how-long",
              label: "How long has it held?",
              input: "text",
              placeholder: "Weeks isn't the same as months. Be exact.",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is there anything they could do that would be enough?",
          enoughLabel: "Yes — I can name it",
          needMoreLabel: "No — I don't think anything would be",
          needMoreIntro:
            "Important rather than hopeless. If nothing would be enough, then this isn't a question about their evidence — and that's worth knowing before you spend another year gathering it.",
          needToKnowLabel: "What enough would look like",
          observableLabel: "Something they'd have to actually do",
        },
        {
          kind: "output",
          heading: "What I can actually see",
          body:
            "None of this predicts. It's the best information you have, and there isn't a guarantee to be had.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Remorse isn't change. Promises become evidence once they're kept.",
            "Did it cost them something? Has it held?",
            "If nothing would be enough, this isn't a question about their evidence.",
          ],
        },
      ],
      portable: [
        "Remorse isn't change. Promises become evidence once they're kept.",
        "Did it cost them something? Has it held?",
        "If nothing would be enough, this isn't a question about their evidence.",
      ],
      myPlaysTemplate: {
        when: "When I'm trying to work out whether they've really changed",
        move: "Weigh what I can see and what has lasted, separately from what's sincere",
        lookingFor: "Something that cost them, and that has held over time",
        watchOut: "Waiting for a guarantee — there isn't one",
        remember: "This is the best information there is. It still doesn't predict.",
      },
      fidelity: {
        correct:
          "Change you can see that has lasted is weighed separately from remorse and promises, and the reader names what would be enough.",
        misuse: [
          "Counting a promise as a kept promise.",
          "Using it to build a case in either direction.",
          "Treating the result as a prediction.",
        ],
        notMeaning:
          "It does not mean they have changed, that they won't do it again, or that you should stay if the evidence is good.",
      },
    },

    // ─────────────────────────────── Play 4 · either path ──
    {
      playId: "what-forgiving-would-take",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What Forgiving Would Take",
      positioning: "For working out what it would take. Applies whichever way you go.",
      recognitionGate: {
        prompt: "Do you want to forgive this and find you can't?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Forgiving doesn't mean staying. That's the most useful thing in this Playbook, and most people don't know it's an option.",
            "There are four combinations, and all of them are real. Forgive and stay. Forgive and leave. Stay and not forgive. Leave and not forgive.",
            "Forgive-and-leave is the one people rarely realise they can have — you can stop carrying it and still not want the relationship.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cDoes forgiveness mean forgetting?\u201d No. You won't forget, and being asked to is unreasonable.",
            "More often, it's deciding to stop charging interest. The debt stays on the books; you just stop adding to it every day.",
            "That's much smaller than what people usually mean by the word, and a lot more doable.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "What would it actually take? Be specific.",
          fields: [
            {
              id: "what-would-need",
              label: "What would have to happen for you to stop carrying this?",
              input: "chips",
              suggestions: [
                "They'd have to fully admit what happened",
                "They'd have to understand what it cost me",
                "Enough time would have to pass",
                "Nothing — I'd just have to decide",
                "I genuinely don't know",
              ],
            },
            {
              id: "available",
              label: "Is that something they could actually give?",
              input: "text",
              placeholder: "And has any of it happened already?",
            },
            {
              id: "which-combination",
              label:
                "If you could choose freely — which of the four combinations would you want?",
              input: "chips",
              suggestions: [
                "Forgive and stay",
                "Forgive and leave",
                "Stay, and not pretend I've forgiven",
                "Leave, and not forgive",
                "I don't know yet",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Is what forgiveness would take actually open to you?",
          enoughLabel: "Yes, in principle",
          needMoreLabel: "No — or not from them",
          needMoreIntro:
            "That matters rather than being hopeless. If what forgiving takes isn't there, then not being able to forgive isn't a failing of yours. It's arithmetic.",
          needToKnowLabel: "What that means for what happens next",
          observableLabel: "Something I could actually decide or ask for",
        },
        {
          kind: "output",
          heading: "What forgiving would require",
          body:
            "Not forgiveness. A clear view of what it would cost and whether it's there for you.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Forgiving doesn't mean staying. Forgive-and-leave is a real option.",
            "Not forgetting. Deciding to stop charging interest.",
            "If what it requires isn't available, that's arithmetic, not failure.",
          ],
        },
      ],
      portable: [
        "Forgiving doesn't mean staying. Forgive-and-leave is a real option.",
        "Not forgetting. Deciding to stop charging interest.",
        "If what it requires isn't available, that's arithmetic, not failure.",
      ],
      myPlaysTemplate: {
        when: "When I want to let go of this and find I can't",
        move: "Name what forgiving would take, and whether it's there",
        lookingFor: "Whether the condition is something they could actually give",
        watchOut: "Treating not being able to forgive as something wrong with me",
        remember: "Forgiving something that was never really owned up to is a great deal to ask.",
      },
      fidelity: {
        correct:
          "The thing forgiveness would take is named, whether it's available is checked, and forgiveness is held separate from the decision to stay or leave.",
        misuse: [
          "Using it to pressure them into an apology.",
          "Deciding you've forgiven when you haven't.",
          "Treating forgiveness as a requirement for either path.",
        ],
        notMeaning:
          "It does not mean you will forgive, that you should, or that forgiving means you have to stay.",
      },
    },
  ],

  literature: C16_LITERATURE,

  missions: [
    {
      id: "mission-c16-question",
      version: 1,
      playId: "which-question-am-i-asking",
      title: "Say which question you're on, to one person",
      instruction:
        "Tell someone you trust which question you've actually been working on. Not what you've decided — which question.",
      linkToOperation: "Separating the decision from the trust question",
      attemptMeaning:
        "You named it. It doesn't commit you to anything.",
      suitability:
        "Pick someone who won't immediately tell you what to do. Most people will have a strong opinion and it will be about them.",
      progression: [
        {
          id: "rung-c16-question-2",
          instruction:
            "Answer the two 'if I knew for certain' questions again in a month and compare.",
        },
      ],
    },
    {
      id: "mission-c16-checking",
      version: 1,
      playId: "the-checking",
      title: "Notice one check, without stopping it",
      instruction:
        "Next time you check, do it — and afterwards note how long the relief lasted. Once is enough.",
      linkToOperation: "Observing what the checking delivers and for how long",
      attemptMeaning:
        "You noticed. Not stopping was never the ask.",
      suitability:
        "If noticing turns into shame about checking, stop and read 'The checking' again. That isn't what this is for.",
      progression: [
        {
          id: "rung-c16-checking-2",
          instruction: "Leave one check undone and note what happens to the urge.",
        },
      ],
    },
    {
      id: "mission-c16-changed",
      version: 1,
      playId: "has-anything-changed",
      title: "Write the record, with dates",
      instruction:
        "Write down what they've actually done since it happened, with dates. Only actions. Read it back a week later.",
      linkToOperation: "Gathering the change you can see, over time, into a record",
      attemptMeaning:
        "You looked at the record. A thin record is information, not a final judgement.",
      suitability:
        "If the record is thin and that's painful, that's worth having someone alongside you for.",
      progression: [
        {
          id: "rung-c16-changed-2",
          instruction: "Tell them what would be enough, if you were able to name it.",
        },
      ],
    },
    {
      id: "mission-c16-forgive",
      version: 1,
      playId: "what-forgiving-would-take",
      title: "Say the condition out loud",
      instruction:
        "Tell someone you trust what forgiving would require, and whether it's available. Not the person it's about.",
      linkToOperation: "Getting the thing forgiving would take out of your head and into words",
      attemptMeaning:
        "You said it. Hearing yourself say it is the point.",
      suitability:
        "If the honest answer is that it isn't available from them, that's worth taking to someone who can sit with it rather than solve it.",
      progression: [
        {
          id: "rung-c16-forgive-2",
          instruction:
            "Ask for it, if the condition is something they could actually give.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c16-question",
      version: 1,
      playId: "which-question-am-i-asking",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Separated the two questions",
          "Noticed which one I'd been working on",
          "Said it out loud to someone",
          "Kept working on trust anyway",
        ],
      },
      performedOperation: {
        label: "Did you separate the decision from the trust question?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I've been avoiding the first question",
          "That it's genuinely still open",
          "How much effort has gone into the wrong one",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't look at the first question",
          "I know the answer and don't want it",
          "Everyone told me what to do",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c16-checking",
      version: 1,
      playId: "the-checking",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Noticed how long the relief lasted",
          "Named what it's costing",
          "Left one check undone",
          "Checked more thoroughly instead",
        ],
      },
      performedOperation: {
        label: "Did you look at what the checking costs and delivers?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That nothing would settle it",
          "How short the relief is",
          "What it's actually costing me",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into shame about checking",
          "Not checking was worse",
          "Seeing the cost didn't change it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c16-changed",
      version: 1,
      playId: "has-anything-changed",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Wrote only actions, with dates",
          "Kept remorse separate from evidence",
          "Named what would be enough",
          "Counted promises as evidence",
        ],
      },
      performedOperation: {
        label: "Did you weigh visible change separately from sincerity?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That there is a real record",
          "That the record is thin",
          "That nothing would be enough for me",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "The record was thinner than I expected",
          "I couldn't name what would be enough",
          "It's good and I still don't feel safe",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c16-forgive",
      version: 1,
      playId: "what-forgiving-would-take",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named what forgiving would require",
          "Checked whether it's available",
          "Separated forgiving from staying",
          "Concluded I should just move on",
        ],
      },
      performedOperation: {
        label: "Did you name the condition and whether it's available?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I could forgive and still leave",
          "That what I need isn't available",
          "That it's smaller than I thought",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "What I need isn't available from them",
          "I couldn't name the condition",
          "Naming it made it feel worse",
          "Nothing stuck",
        ],
      },
    },
  ],
};
