/**
 * Cluster 12 — "Difficulty Letting Go of What's Already Over" — VOLUME II
 * The Relationship Playbook™ · Moving Forward
 *
 * Track: Renewal (20 of 58 statements). Task = Reengagement.
 * Core Need: TO MOVE FORWARD. Plays-only.
 *
 * ⚠ SCOPED DELIBERATELY. Roughly 12 of the 20 statements are distinct
 *   (STM-0245 / STM-0634 are verbatim duplicates; five more are near-dupes).
 *   Of those, the "doing it differently" material already exists elsewhere and
 *   routes out via `rec-c12b-differently`:
 *     • not repeating the past → `opening-your-heart-again` (C13)
 *     • what healthy looks like → `opening-your-heart-again` (C13)
 *     • trusting my judgment → `trusting-what-you-see` (C5)
 *
 *   THIS PLAYBOOK IS THE UNCOVERED PART: disclosure, guilt about dating at all,
 *   and comparing everyone to the former partner.
 *
 * ⚠ VOLUME I is `letting-go`. Readers still in it route back via
 *   `rec-c12b-still-in-it`.
 *
 * ⚠ NOT BEREAVEMENT. The guilt here concerns someone alive.
 *   `addon-losing-a-partner` handles the other.
 *
 * ⚠ NO ASSUMPTION about who ended it, whether there were children, or how long
 *   ago. No timeline claims about readiness.
 *
 * ⚠ COMPETENCY MAPPING
 *   what-to-say      → Narrative Integration (Recovery) · Calibrated Openness (Renewal)
 *   the-guilt        → Self-Compassion (Recovery) · Grief Integration (Recovery)
 *   the-comparison   → Relational Discernment (Recovery) · Adaptive Responding (Renewal)
 *
 * ⚠ CLAIM SCOPE. May claim: decide what to disclose and when; notice what the
 *   guilt is about; see what the comparison is comparing. MUST NOT CLAIM: that
 *   you're ready, that disclosure lands well, that the comparison stops, or
 *   that dating again is advisable.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C12B_LITERATURE } from "./moving-forward-literature";

export const MOVING_FORWARD: PlaybookContent = {
  playbookKey: "moving-forward",
  playbookVersion: 1,
  displayName: "Moving Forward",

  opening: {
    title: "Questions nobody had to answer the first time",
    body: [
      "How much of it do I tell someone. When do I mention the divorce. Am I allowed to want this yet. And why does everyone get measured against someone I chose to leave.",
      "This isn't about doing it differently — that has its own Playbook, and it's better than anything we'd repeat here. This is the specific problem of having a history.",
      "Nothing here says you should be dating, or that you're ready.",
    ],
    manifestations: [
      "I don't know how much of my past to share.",
      "I don't know when to talk about my divorce.",
      "I feel guilty dating again.",
      "I compare everyone to my former partner.",
    ],
    cta: "Start with what to say",
  },

  recognitionCards: [
    {
      id: "rec-c12b-want-without-pain",
      role: "validate",
      pathwayPlayId: null,
      headline: "I want love, but I don't want more pain.",
      validationCopy:
        "This comes up twice here, which suggests it's the honest heart of it. That isn't guilt or confusion — it's an honest look at the trade. There's no version of this that doesn't leave you open to being hurt, and anyone who says there is one is selling something. Knowing that plainly puts you in a better spot than hoping for a version that doesn't exist.",
      secondaryExamples: [
        "I'm afraid of getting hurt all over again.",
        "I want love again, but I want it to be different this time.",
        "Everything feels different now.",
      ],
    },
    {
      id: "rec-c12b-still-in-it",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I'm not there yet — I still can't stop thinking about them.",
      validationCopy:
        "Then this is the wrong half. There's a matching Playbook for the part before this — the checking, the replaying, figuring out what was really yours. You don't have to finish that one before reading this one. And going back to it isn't a step backward — plenty of people move between the two.",
      secondaryExamples: [
        "I keep checking their social media.",
        "I keep replaying everything.",
        "Why wasn't I enough?",
      ],
    },
    {
      id: "rec-c12b-differently",
      role: "signpost",
      pathwayPlayId: null,
      headline: "I don't want to repeat my past, and I don't know what healthy looks like.",
      validationCopy:
        "Those have their own Playbook, and it's a better answer than anything here — it's built to turn \u201cI want to do it differently\u201d into something you can actually catch yourself doing. If trusting your own judgment is the harder part, there's another Playbook for that. This one covers less: what to say about your history, the guilt, and the comparing.",
      secondaryExamples: [
        "I don't want to make the same mistakes.",
        "I don't know what healthy dating looks like anymore.",
        "I don't know how to trust my judgment after everything.",
      ],
    },
    {
      id: "rec-c12b-disclosure",
      role: "route",
      pathwayPlayId: "what-to-say",
      headline: "I don't know how much of my past to share.",
      explanation:
        "Two different kinds of sharing get treated as one. The fact is a sentence. The account is personal, and personal things get shared back and forth, not handed over.",
      secondaryExamples: [
        "I don't know when to talk about my divorce.",
        "I don't know how to date anymore.",
      ],
    },
    {
      id: "rec-c12b-guilt",
      role: "route",
      pathwayPlayId: "the-guilt",
      headline: "I feel guilty dating again.",
      explanation:
        "Surprising, because there's often nobody obvious to be guilty toward. It's rarely about the ex.",
      secondaryExamples: [
        "I don't know if I'm ready.",
        "I don't know if I'm emotionally available.",
      ],
    },
    {
      id: "rec-c12b-comparing",
      role: "route",
      pathwayPlayId: "the-comparison",
      headline: "I compare everyone to my former partner.",
      explanation:
        "Almost everyone does this. Worth knowing there are two versions, and only one fades on its own.",
      secondaryExamples: [
        "Everything feels different now.",
        "I don't know what I'm looking for anymore.",
      ],
    },
  ],

  plays: [
    // ─── Play 1 · Narrative Integration / Calibrated Openness ──
    {
      playId: "what-to-say",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What to Say",
      positioning:
        "For the history you don't know how to hand over. You decide the size — then you say it.",
      recognitionGate: {
        prompt: "Do you not know how much of your past to tell someone new?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "The advice out there splits into two unhelpful halves: be completely open, or don't burden them with it.",
            "Most of the trouble is that two different kinds of sharing are being treated as one.",
            "The fact — that you were married, that it ended, roughly when. This is context someone needs fairly early to understand your life.",
            "The account — what happened, whose fault, what it did to you. That's personal. Personal things get shared back and forth, not handed over.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The fact is small and fits in a sentence. Say it earlier than feels comfortable, because it shapes time, money, family, and how free you are — and it only gets harder to bring up.",
            "The account has no timetable. You don't have to give it, and giving it early usually changes what the conversation is about.",
            "One check worth running: are you telling them because they need to know, or because you're bracing for them to find out? The second one tends to bring out the whole account far too early.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Fact, or account?",
          situation:
            "A third date. It's going well and they've asked something general about your life. You can feel the whole thing waiting behind it.",
          buckets: [
            { id: "fact", label: "The fact \u2014 say it early" },
            { id: "account", label: "The account \u2014 no timetable" },
          ],
          items: [
            {
              id: "sort-c12b-was-married",
              text: "\u201cI was married \u2014 it ended a couple of years ago\u201d",
              correctBucket: "fact",
              correction: "One sentence, offered rather than confessed. That's the size.",
            },
            {
              id: "sort-c12b-why-it-ended",
              text: "Why it ended and who did what",
              correctBucket: "account",
              correction:
                "Personal. Not information they can use yet, and it changes the conversation.",
            },
            {
              id: "sort-c12b-kids",
              text: "That you have children, and roughly how it works",
              correctBucket: "fact",
              correction: "Shapes their life too if this goes anywhere. Early.",
            },
            {
              id: "sort-c12b-how-it-felt",
              text: "What the last year of it did to you",
              correctBucket: "account",
              correction: "Shared over time. Not handed over on a third date.",
            },
            {
              id: "sort-c12b-still-untangling",
              text: "That some of it is still being sorted out legally",
              correctBucket: "fact",
              correction: "Practical, and it affects them. Better said than discovered.",
            },
            {
              id: "sort-c12b-what-i-regret",
              text: "What you'd do differently, and what you blame yourself for",
              correctBucket: "account",
              correction:
                "The deepest layer. Worth having somewhere to put it that isn't a third date.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your version. The fact first — that's the one with a size.",
          fields: [
            {
              id: "the-fact",
              label: "What's the one-sentence version?",
              input: "text",
              placeholder: "What was, that it ended, roughly when. Nothing else.",
            },
            {
              id: "why-telling",
              label:
                "When you imagine saying more \u2014 is it because they need it, or because you're bracing?",
              input: "chips",
              suggestions: [
                "They'd need it",
                "I'm bracing for them to find out",
                "I want them to understand me",
                "Some of each",
              ],
            },
          ],
        },
        {
          kind: "realWorldUse",
          useWhen:
            "Early \u2014 sooner than feels comfortable, and in an ordinary part of the conversation rather than a serious moment.",
          doThis:
            "Say the one-sentence version and then stop. Let them ask if they want to. Don't fill the pause, and don't add the account because the silence felt like a question.",
        },
        {
          kind: "output",
          heading: "The fact, at the right size",
          body:
            "How someone takes it is genuinely useful information. The group who treat it as an ordinary fact about an adult's life is bigger than it feels.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The fact is a sentence. The account is personal.",
            "Earlier than comfortable, less than feels honest. Both are right.",
            "Am I telling them, or bracing for them to find out?",
          ],
        },
      ],
      portable: [
        "The fact is a sentence. The account is personal.",
        "Earlier than comfortable, less than feels honest. Both are right.",
        "Am I telling them, or bracing for them to find out?",
      ],
      myPlaysTemplate: {
        when: "When I don't know how much of my history to hand over",
        move: "Separate the fact from the account, and say the fact early",
        lookingFor: "How they take an ordinary fact about an adult's life",
        watchOut: "Filling the pause afterwards with the account",
        remember: "Holding back the fact doesn't protect anyone, and it gets harder to bring up.",
      },
      fidelity: {
        correct:
          "The fact is kept separate from the account, and the fact is said early and briefly, without the account attached.",
        misuse: [
          "Giving the account early because the silence felt like a question.",
          "Holding back the fact to avoid the conversation.",
          "Treating their reaction as a judgment on you rather than information about them.",
        ],
        notMeaning:
          "It does not mean they'll take it well, that the account never gets told, or that there's a correct moment.",
      },
    },

    // ───── Play 2 · Self-Compassion / Grief Integration ──
    {
      playId: "the-guilt",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Guilt",
      positioning: "For feeling guilty about something nobody is objecting to.",
      recognitionGate: {
        prompt: "Does wanting this again come with guilt you can't place?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "This one surprises people, because there's often nobody obvious to feel guilty toward. The relationship ended — maybe you're the one who ended it — and the other person is alive and getting on with things.",
            "So the guilt has no clear target, and guilt with no target is much harder to weigh than guilt with one.",
          ],
        },
        {
          kind: "learn",
          body: [
            "It's rarely about the ex. More often it's one of three things.",
            "Children, if there are any — not wanting to introduce something, or to be seen wanting something for yourself.",
            "The marriage as something you meant. Moving on can feel like admitting it wasn't what you said it was — and that's a loss on top of a loss.",
            "Or a feeling that wanting anything again is greedy, since you've already had a turn.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Naming it is the whole tool. None of these respond to being told you're allowed.",
          fields: [
            {
              id: "toward-who",
              label: "When the guilt arrives, who is it toward?",
              input: "chips",
              suggestions: [
                "My children",
                "My former partner",
                "The marriage itself",
                "Nobody I can name",
                "Myself",
              ],
            },
            {
              id: "what-it-says",
              label: "What does it seem to be saying?",
              input: "text",
              placeholder: "Put it in words, even if the words sound unreasonable.",
            },
            {
              id: "has-anyone",
              label: "Has anyone actually objected?",
              input: "chips",
              suggestions: [
                "No",
                "Not directly",
                "Yes \u2014 my children",
                "Yes \u2014 someone else",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "If the guilt is toward the marriage rather than a person \u2014 does moving on actually make it less real?",
          enoughLabel: "No \u2014 it happened either way",
          needMoreLabel: "It feels like it does",
          needMoreIntro:
            "That's the assumption underneath, and it's worth sitting with rather than solving. Wanting something again doesn't reach back and make the last thing less meant.",
          needToKnowLabel: "What would still be true about it regardless",
          observableLabel: "Something I'd still say about that time",
        },
        {
          kind: "output",
          heading: "What the guilt is toward",
          body:
            "Named, not argued with. That's most of what you can do here, and it's more than it sounds.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Guilt with no target is harder to weigh than guilt with one.",
            "It's rarely about them.",
            "Wanting something again doesn't make the last thing less meant.",
          ],
        },
      ],
      portable: [
        "Guilt with no target is harder to weigh than guilt with one.",
        "It's rarely about them.",
        "Wanting something again doesn't make the last thing less meant.",
      ],
      myPlaysTemplate: {
        when: "When wanting this again brings guilt I can't locate",
        move: "Name who or what the guilt is actually toward",
        lookingFor: "Whether anyone has actually objected, or whether it's unattached",
        watchOut: "Trying to argue myself out of it — that isn't what this does",
        remember: "Being told I'm allowed doesn't reach it. Naming it sometimes does.",
      },
      fidelity: {
        correct:
          "The target of the guilt is named specifically, and kept separate from whether anyone has actually objected.",
        misuse: [
          "Using it to decide the guilt is irrational and should stop.",
          "Deciding what your children think without asking them.",
          "Treating the naming as permission.",
        ],
        notMeaning:
          "It does not mean the guilt eases, that you should date, or that anyone approves.",
      },
    },

    // ─── Play 3 · Relational Discernment / Adaptive Responding ──
    {
      playId: "the-comparison",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "The Comparison",
      positioning: "For measuring everyone against someone you knew for years.",
      recognitionGate: {
        prompt: "Does everyone new get measured against your former partner?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "It isn't them against the new person. It's someone met three weeks ago against someone you knew for years — their humour, their references, the shorthand, the way they knew what you meant.",
            "That's not a fair comparison, and you can't fix it by trying to be fair. What you're missing is familiarity, and nobody new has any.",
          ],
        },
        {
          kind: "learn",
          body: [
            "There's a second version, and it's the one worth telling apart.",
            "Sometimes the comparison isn't flattering at all — you're scanning for likeness rather than who's better, checking whether this one will turn out the same way.",
            "The first fades with time and familiarity. The second doesn't, and it can make an ordinary person look like evidence.",
          ],
        },
        {
          kind: "ownTurn",
          intro:
            "Catch one comparison and look at which kind it was.",
          fields: [
            {
              id: "the-comparison",
              label: "What did you compare recently?",
              input: "text",
              placeholder: "The specific moment, not the general habit.",
            },
            {
              id: "which-kind",
              label: "Which was it?",
              input: "chips",
              suggestions: [
                "They came off worse \u2014 missing what was familiar",
                "I was checking for likeness",
                "Both at once",
                "I can't tell",
              ],
            },
            {
              id: "years-or-weeks",
              label:
                "How long had you known the person you were comparing them to?",
              input: "text",
              placeholder: "And how long have you known this one?",
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt:
            "If it's the likeness-scanning kind \u2014 is what you noticed something they did, or something you're expecting?",
          enoughLabel: "Something they actually did",
          needMoreLabel: "Something I was watching for",
          needMoreIntro:
            "Worth separating. Scanning finds what it's looking for, and an ordinary thing can look like a warning when you've been braced for it since before you met them.",
          needToKnowLabel: "What would actually have to happen for it to be a real signal",
          observableLabel: "Something I could point at afterwards",
        },
        {
          kind: "output",
          heading: "Which comparison it was",
          body:
            "One fades with familiarity. The other makes an ordinary person look like evidence.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Three weeks against years. That's not a comparison anyone wins.",
            "Am I missing familiarity, or scanning for likeness?",
            "Scanning finds what it's looking for.",
          ],
        },
      ],
      portable: [
        "Three weeks against years. That's not a comparison anyone wins.",
        "Am I missing familiarity, or scanning for likeness?",
        "Scanning finds what it's looking for.",
      ],
      myPlaysTemplate: {
        when: "When everyone new gets measured against them",
        move: "Tell missing-the-familiarity apart from scanning-for-likeness",
        lookingFor: "Whether what I noticed was something they did or something I expected",
        watchOut: "Treating either kind as a reason to stop seeing someone",
        remember: "Nobody new has any familiarity. That's not a fault of theirs.",
      },
      fidelity: {
        correct:
          "A specific comparison is looked at and sorted into missing familiarity or scanning for likeness, with what they actually did kept separate from what you expected.",
        misuse: [
          "Using it as a reason to end something.",
          "Deciding that any comparison means you shouldn't be dating.",
          "Brushing off something you really noticed as just scanning.",
        ],
        notMeaning:
          "It does not mean the comparison stops, that the new person is right for you, or that a likeness you noticed isn't real.",
      },
    },
  ],

  literature: C12B_LITERATURE,

  missions: [
    {
      id: "mission-c12b-say",
      version: 1,
      playId: "what-to-say",
      title: "Say the fact once, early",
      instruction:
        "Next time it's relevant, say the one-sentence version. Then stop, and note what they did with it.",
      linkToOperation: "Sharing the fact of your history without the account",
      attemptMeaning:
        "You said it. How they took it is information about them.",
      suitability:
        "If you find yourself adding the account, notice where the pause was \u2014 that's usually the point it goes.",
      progression: [
        {
          id: "rung-c12b-say-2",
          instruction: "Say it earlier than you did last time.",
        },
      ],
    },
    {
      id: "mission-c12b-guilt",
      version: 1,
      playId: "the-guilt",
      title: "Ask, if it's about your children",
      instruction:
        "If the guilt is toward children, ask them rather than deciding for them. Most people find the answer isn't the one they'd assumed.",
      linkToOperation: "Checking an assumed objection instead of guessing at it",
      attemptMeaning:
        "You asked. Whatever they said, you now know rather than guess.",
      suitability:
        "Age-appropriate and once. If they're young, this may not be a conversation to have \u2014 and that's a fair call rather than avoidance.",
      progression: [
        {
          id: "rung-c12b-guilt-2",
          instruction: "Name the guilt to one adult you trust, and see what it sounds like out loud.",
        },
      ],
    },
    {
      id: "mission-c12b-compare",
      version: 1,
      playId: "the-comparison",
      title: "Catch three, and sort them",
      instruction:
        "Over two weeks, catch three comparisons and note which kind each was. Don't try to stop them.",
      linkToOperation: "Telling familiarity loss apart from likeness scanning",
      attemptMeaning:
        "You sorted them. Stopping the comparing was never the ask.",
      suitability:
        "If all three are the scanning kind, that's worth knowing \u2014 it's the one that doesn't fade on its own.",
      progression: [
        {
          id: "rung-c12b-compare-2",
          instruction:
            "For one scanning comparison, name what would actually have to happen for it to be a real signal.",
        },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c12b-say",
      version: 1,
      playId: "what-to-say",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Said the fact, not the account",
          "Said it earlier than usual",
          "Stopped after the sentence",
          "Filled the pause with more",
        ],
      },
      performedOperation: {
        label: "Did you state the fact briefly without the account?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That it was smaller than I expected",
          "That they took it as ordinary",
          "That I'd been bracing rather than telling",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I gave the whole account",
          "They reacted badly",
          "I couldn't raise it at all",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c12b-guilt",
      version: 1,
      playId: "the-guilt",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named who it's toward",
          "Checked whether anyone had objected",
          "Asked rather than assumed",
          "Tried to argue myself out of it",
        ],
      },
      performedOperation: {
        label: "Did you name what the guilt is toward?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That nobody has actually objected",
          "That it's about the marriage, not a person",
          "That my children think something different",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I couldn't name what it's toward",
          "Naming it didn't help",
          "Someone has objected, and that's the problem",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c12b-compare",
      version: 1,
      playId: "the-comparison",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Caught specific comparisons",
          "Sorted which kind each was",
          "Separated what they did from what I expected",
          "Tried to stop comparing",
        ],
      },
      performedOperation: {
        label: "Did you sort the comparison and check the evidence?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That I'm mostly missing familiarity",
          "That I'm mostly scanning for resemblance",
          "How unfair the comparison is from the start",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "They were all the scanning kind",
          "I couldn't tell them apart",
          "I noticed a real resemblance and it worried me",
          "Nothing stuck",
        ],
      },
    },
  ],
};
