/**
 * Cluster 7 — "Difficulty Communicating Without It Becoming a Fight"
 * The Relationship Playbook™ · Breaking the Cycle of the Same Arguments
 *
 * FIRST EXPANSION-PHASE CLUSTER. Task = Integration.
 * §0 DECISION: PLAYS-ONLY, consistent with Clusters 3-6.
 *
 * ⚠⚠ SAFETY ROUTING — the defining feature of this module.
 *   `SAFETY_RECOGNITION_CARD` (shared) has role "signpost": it routes to NO Play. Anyone who
 *   taps it gets `lit-shared-if-you-dont-feel-safe` and nothing else. Every tool
 *   here asks the reader to raise difficult things and stay in the
 *   conversation, which is the wrong instruction for someone frightened of
 *   their partner. Owner-ruled 29 Jul 2026. Do not convert this card to a
 *   route under any future edit.
 *
 * ⚠ SCOPE — "YOUR HALF". Owner-ruled. 16 of 30 statements are about the
 *   couple. Every Play works on what the single reader controls. No copy may
 *   promise the pattern will change or the other person will respond.
 *
 * ⚠ CLAIM SCOPE. May claim: raise something without it becoming the fight;
 *   stop being the only one raising things; notice when it turns and slow it;
 *   go back afterwards. MUST NOT CLAIM: the arguments will stop, they will
 *   change, the relationship will improve, or that communication fixes a
 *   relationship that isn't safe.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { SAFETY_RECOGNITION_CARD } from "./shared/safety-not-safe";
import { C7_LITERATURE } from "./breaking-the-cycle-literature";

export const BREAKING_THE_CYCLE: PlaybookContent = {
  playbookKey: "breaking-the-cycle", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Breaking the Cycle of the Same Arguments",

  opening: {
    title: "Two things before we start",
    body: [
      "First: if you don't feel safe with them — if you're managing how you speak to avoid a reaction — nothing in here applies. Read 'If you don't feel safe' and stop there.",
      "Second: this is a two-person pattern and there's one of you here. Everything in this Playbook works on your half. We can't move theirs and won't pretend to.",
    ],
    manifestations: [
      "We keep having the same argument.",
      "Everything turns into a fight.",
      "One of us always shuts down.",
      "We apologise but nothing changes.",
    ],
    cta: "Start with your half",
  },

  recognitionCards: [
    SAFETY_RECOGNITION_CARD,
    {
      id: "rec-c7-avoid",
      role: "route",
      pathwayPlayId: "raise-it-anyway",
      headline: "I don't bring things up because I know how it'll go.",
      explanation:
        "Avoidance here is usually a calculation, and often a correct one. The conversation costs more than the thing.",
      secondaryExamples: [
        "I avoid difficult conversations because they're exhausting.",
        "I stop talking because nothing changes.",
        "I don't know how to bring things up without starting a fight.",
      ],
    },
    {
      id: "rec-c7-always-me",
      role: "route",
      pathwayPlayId: "not-always-me",
      headline: "I'm always the one who has to bring things up.",
      explanation:
        "Being the only one raising things is exhausting, and it quietly makes you the problem in every conversation.",
      secondaryExamples: [
        "Nothing gets talked about unless I start it.",
      ],
    },
    {
      id: "rec-c7-turns",
      role: "route",
      pathwayPlayId: "when-it-starts-turning",
      headline: "Everything turns into a fight.",
      explanation:
        "There's usually a moment where it turns. Most people notice it. Very few do anything at the time.",
      secondaryExamples: [
        "Every conversation becomes defensive.",
        "One of us always explodes.",
        "We keep having the same argument.",
      ],
    },
    {
      id: "rec-c7-no-way-back",
      role: "route",
      pathwayPlayId: "going-back-afterwards",
      headline: "We apologise and nothing actually changes.",
      explanation:
        "An apology closes the incident. It doesn't reconnect anyone. Those are two different jobs.",
      secondaryExamples: [
        "We don't know how to recover after conflict.",
        "We don't know how to repair after arguments.",
      ],
    },
  ],

  plays: [
    // ────────────────────────────── Play 1 · CP-13 ──
    {
      playId: "raise-it-anyway",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Raise It Anyway",
      positioning: "For the thing you've decided isn't worth the conversation.",
      recognitionGate: {
        prompt: "Is there something you've stopped bringing up because of how it goes?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "You've weighed the thing against the conversation and the conversation costs more. That's usually an accurate sum.",
            "The trouble is what accumulates. Each unraised thing is small; the pile isn't, and the pile eventually arrives all at once attached to something trivial.",
            "This isn't about being braver. It's about making the conversation cost less.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Two different conversations, and mixing them is why they go wrong.",
            "The incident is Tuesday. Specific, recent, solvable — and settling it changes nothing about next week.",
            "The pattern is what happens every time. Bigger, riskier, and the only one that could actually shift things. It needs a calm day, not the fourth instance.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The thing you haven't said",
          fields: [
            {
              id: "the-thing",
              input: "text",
              label: "What is it? One thing.",
              placeholder: "Not the list. The one at the top.",
            },
            {
              id: "incident-or-pattern",
              input: "chips",
              label: "Are you raising the incident or the pattern?",
              suggestions: [
                "The incident",
                "The pattern",
                "I was going to do both at once",
                "Not sure",
              ],
            },
            {
              id: "what-i-want",
              input: "text",
              label: "What do you actually want to be different?",
              placeholder: "A request, not a complaint. What would you like to happen instead?",
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "How you'll open it",
          helper:
            "One thing, specific, shorter than feels sufficient. You might start with “Can I raise something? It's not a big thing” or “There's something I've been sitting on.”",
        },
        {
          kind: "ruleBuilder",
          intro: "When",
          conditionLabel: "When I'll raise it",
          thenLabel: "And what I'll do if it starts turning",
          actions: [
            "On a calm day, not in the moment",
            "Not late at night",
            "When neither of us is already annoyed",
            "Next time it happens, but afterwards",
          ],
          controlCheck:
            "One thing, not the accumulated list. If it turns, I'll name it and pause rather than push. I'm raising it, not delivering a verdict.",
        },
        {
          kind: "output",
          heading: "What I'm raising, and when",
          body: "Your half. How they take it isn't in your control.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "One thing. Specific. Shorter than feels sufficient.",
            "Incident or pattern — don't do both at once.",
            "Say what you want, not only what's wrong.",
          ],
        },
      ],
      portable: [
        "One thing. Specific. Shorter than feels sufficient.",
        "Incident or pattern — don't do both at once.",
        "Say what you want, not only what's wrong.",
      ],
      myPlaysTemplate: {
        when: "When there's something I've stopped raising",
        move: "Raise one specific thing, on a calm day, with what I'd like instead",
        lookingFor: "Whether I said the actual thing, and kept it to one",
        watchOut: "Bringing the whole pile because I finally started talking",
        remember: "Delivery changes the odds. It doesn't guarantee anything.",
      },
      fidelity: {
        correct:
          "One specific thing is raised at a chosen time, with a request attached, separate from the accumulated list.",
        misuse: [
          "Raising the whole backlog at once.",
          "Using the opening as a delivery mechanism for a verdict.",
          "Raising the pattern mid-argument.",
        ],
        notMeaning:
          "It does not mean they'll respond well, that the issue will resolve, or that the pattern will change.",
      },
      supportSignposts: [
        {
          id: "signpost-c7-not-safe",
          heading: "If raising things isn't safe",
          body:
            "If you're weighing whether to speak based on how angry they'll get, or you've learned to manage your words around their mood, this tool is the wrong one and following it could make things worse. Please read 'If you don't feel safe', and talk to someone — a domestic abuse service, a GP, or a therapist. You don't have to be certain to ask.",
        },
      ],
    },

    // ────────────────────────────── Play 2 · CP-12 ──
    {
      playId: "not-always-me",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Not Always Me",
      positioning:
        "For when nothing gets discussed unless you start it. This one needs them in the room \u2014 it ends in a conversation, not a plan.",
      recognitionGate: {
        prompt:
          "Are you the only one who ever brings anything up \u2014 and ready to say so to them?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "It's exhausting, which you know. Here's the part that's less obvious: it also makes you the one who starts every difficult conversation.",
            "Which means over time you become associated with them. You're not the person raising an issue — you're the person who always has an issue.",
            "That's not a fair outcome and it isn't something you did wrong. It's just what happens when one person carries all the initiating.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Raising less so they'll raise more. That's a test, it usually just means nothing gets said, and it rarely works.",
            "Making room, and saying that you're doing it. That's different — it names the imbalance out loud rather than staging it.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The honest count",
          fields: [
            {
              id: "who-raises",
              input: "chips",
              label: "Of the last five difficult conversations, how many did you start?",
              suggestions: ["All five", "Four", "Three", "Fewer than three"],
            },
            {
              id: "what-happens-if-i-dont",
              input: "text",
              label: "What happens if you don't raise something?",
              placeholder: "Be honest. Does it get raised, or does it just sit?",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "Naming it, once",
          conditionLabel: "What I'll say about the imbalance",
          thenLabel: "And what I'll do while I wait to see",
          actions: [
            "Say plainly that I'm always the one who starts these",
            "Ask them to bring one thing to me this month",
            "Leave one small thing unraised and see what happens",
            "Say that carrying it is wearing me out",
          ],
          controlCheck:
            "I'm saying it, not staging it silently. Leaving something unraised isn't a punishment. They may not pick it up. That's information, not a failure of mine.",
        },
        {
          kind: "sentenceBuilder",
          label: "What you'll say about the imbalance",
          helper:
            "Plainly, once, and not as an accusation. You might start with \u201cCan I say something I've noticed?\u201d",
        },
        {
          kind: "output",
          heading: "What I said, and what came back",
          body: "The conversation is the tool. What they do with it is the part you don't control.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "I'm not the person with an issue. I'm the person who raises them.",
            "Name the imbalance. Don't stage it.",
            "If they don't pick it up, that's information.",
          ],
        },
      ],
      portable: [
        "I'm not the person with an issue. I'm the person who raises them.",
        "Name the imbalance. Don't stage it.",
        "If they don't pick it up, that's information.",
      ],
      myPlaysTemplate: {
        when: "When nothing gets discussed unless I start it",
        move: "Name the imbalance out loud rather than testing it silently",
        lookingFor: "Whether they bring anything to me without prompting",
        watchOut: "Going quiet to prove a point — that's a test, not a request",
        remember: "Carrying all the initiating makes me look like the problem. That isn't fair and it isn't mine to fix alone.",
      },
      fidelity: {
        correct:
          "The imbalance is said out loud to the other person, directly, rather than demonstrated through withdrawal. The conversation happening IS the operation.",
        misuse: [
          "Going silent to see if they notice.",
          "Using it to build a case about how much you do.",
          "Treating their non-response as proof of something.",
        ],
        notMeaning:
          "It does not mean they'll start raising things, that the balance will shift, or that naming it is enough on its own. Their response is not part of what this tool achieves.",
      },
    },

    // ────────────────────────────── Play 3 ──
    {
      playId: "when-it-starts-turning",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "When It Starts Turning",
      positioning: "For the moment a conversation stops being one.",
      recognitionGate: {
        prompt: "Can you usually tell when a conversation is about to go wrong?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "There's a point where it's still a conversation, and then it isn't. Afterwards you can both roughly point at when.",
            "Most people notice at the time. Almost nobody does anything, because by then it has momentum and stopping feels like losing.",
            "Your half of this is small: name it, and stop. Not win it, not resolve it, not explain why it turned.",
          ],
        },
        {
          kind: "learn",
          body: [
            "The subject moves to something older. One of you starts explaining rather than listening. Always and never show up.",
            "You notice you're building your reply while they're still talking. Or your body gets there first — chest, jaw, the voice going up.",
            "Yours will be one or two of those, reliably. Knowing which is most of the skill.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Still a conversation, or turning?",
          situation:
            "You raised something small on Sunday evening. Ten minutes in, you're both somewhere else entirely.",
          buckets: [
            { id: "conversation", label: "Still a conversation" },
            { id: "turning", label: "Turning" },
          ],
          items: [
            {
              id: "sort-c7-asked-question",
              text: "They asked what you meant by that",
              correctBucket: "conversation",
              correction: "A real question is a good sign. They're still in it.",
            },
            {
              id: "sort-c7-last-year",
              text: "Something from last year has come up",
              correctBucket: "turning",
              correction: "Old material arriving is one of the clearest markers.",
            },
            {
              id: "sort-c7-you-always",
              text: "\u201cYou always do this\u201d",
              correctBucket: "turning",
              correction: "Absolutes mean it's stopped being about the specific thing.",
            },
            {
              id: "sort-c7-uncomfortable",
              text: "It's uncomfortable and you both stay with it",
              correctBucket: "conversation",
              correction:
                "Uncomfortable isn't the same as turning. Difficult conversations are supposed to be difficult.",
            },
            {
              id: "sort-c7-rehearsing",
              text: "You're working out your reply while they're still speaking",
              correctBucket: "turning",
              correction: "You've stopped listening. That's your half of the turn.",
            },
            {
              id: "sort-c7-conceded",
              text: "One of you said \u201cthat's fair\u201d",
              correctBucket: "conversation",
              correction: "Still a conversation, and a fairly healthy one.",
            },
          ],
        },
        {
          kind: "ownTurn",
          intro: "Your tell",
          fields: [
            {
              id: "my-tell",
              input: "chips",
              label: "Which one is usually yours?",
              suggestions: [
                "I bring up something older",
                "I start explaining instead of listening",
                "I go absolute — always, never",
                "I'm building my reply",
                "My body gets there first",
              ],
            },
            {
              id: "my-line",
              input: "text",
              label: "What will you say when you notice it?",
              placeholder: "Short. \u201cThis is going the usual way — can we come back to it?\u201d",
            },
          ],
        },
        {
          kind: "output",
          heading: "My tell, and my line",
          body: "Pausing only counts if you come back. Put a time on it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Name it and stop. Don't win it.",
            "Uncomfortable isn't the same as turning.",
            "A pause you don't come back from is avoidance.",
          ],
        },
      ],
      portable: [
        "Name it and stop. Don't win it.",
        "Uncomfortable isn't the same as turning.",
        "A pause you don't come back from is avoidance.",
      ],
      myPlaysTemplate: {
        when: "When a conversation is starting to go the usual way",
        move: "Name that it's turning and pause it, with a time to come back",
        lookingFor: "My own tell — the thing I do when I've stopped listening",
        watchOut: "Using the pause to end the subject permanently",
        remember: "It works about as often as it doesn't. That's a big improvement on nothing.",
      },
      fidelity: {
        correct:
          "The turn is named at the time and the conversation is paused with a stated point of return.",
        misuse: [
          "Pausing and never coming back.",
          "Naming the turn as an accusation — \u201cyou're doing it again\u201d.",
          "Using it to exit any conversation that gets uncomfortable.",
        ],
        notMeaning:
          "It does not mean they'll accept the pause, that the conversation will go better, or that you'll always catch it in time.",
      },
    },

    // ────────────────────────────── Play 4 ──
    {
      playId: "going-back-afterwards",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Going Back Afterwards",
      positioning: "For the gap after the argument ends.",
      recognitionGate: {
        prompt: "Do arguments end without anything really being repaired?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "An apology closes the incident. Necessary, and it stops the argument.",
            "Repair is coming back to each other afterwards — which is a separate thing, and most couples who fight the same fight forever are good at the first and have none of the second.",
            "The argument ends, there's a gap, and the gap is where the next one gets built.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Smaller than you'd think. Naming what happened without relitigating it. Checking you're both still here. Sometimes just being in the same room with no agenda.",
            "It doesn't require agreement about who was right. That's the part people get stuck on — they wait to agree before reconnecting, and the agreement never comes.",
            "And it's the part you can do a surprising amount of alone. Going back is one-sided until it isn't.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Going back first when you still feel wronged is genuinely hard, and there's a fair argument that it shouldn't be your job.",
            "It probably shouldn't. It's also the only half you control. You can think both.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "One that didn't get repaired",
          fields: [
            {
              id: "what-happened",
              input: "text",
              label: "What was the last one that just... ended?",
              placeholder: "Briefly. What it was about.",
            },
            {
              id: "what-the-gap-was",
              input: "chips",
              label: "What happened afterwards?",
              suggestions: [
                "We went quiet for a day or two",
                "We were polite but distant",
                "Someone apologised and we moved on",
                "We pretended it hadn't happened",
                "It just merged into the next one",
              ],
            },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "Your going-back line",
          helper:
            "Not an apology and not a re-run. Just contact. You might say “That was horrible. I don't want to go over it, I just don't want to leave it there” — or simply “are we alright?”",
        },
        {
          kind: "output",
          heading: "How I'll go back",
          body: "Repair, not a rematch. It doesn't need them to agree with you.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "An apology ends it. Repair reconnects.",
            "You don't have to agree about who was right.",
            "Going back is one-sided until it isn't.",
          ],
        },
      ],
      portable: [
        "An apology ends it. Repair reconnects.",
        "You don't have to agree about who was right.",
        "Going back is one-sided until it isn't.",
      ],
      myPlaysTemplate: {
        when: "After an argument ends and nothing is actually repaired",
        move: "Go back afterwards without relitigating it",
        lookingFor: "Whether contact is possible before agreement is",
        watchOut: "Turning the repair into round two",
        remember: "It shouldn't have to be my job. It's still the half I control.",
      },
      fidelity: {
        correct:
          "Contact is re-established after conflict without reopening the content of it.",
        misuse: [
          "Using the repair to reopen the argument.",
          "Repairing in order to extract an apology.",
          "Skipping repair because they should go first.",
        ],
        notMeaning:
          "It does not mean the issue is resolved, that they'll reciprocate, or that repeated repair makes the pattern acceptable.",
      },
      supportSignposts: [
        {
          id: "signpost-c7-always-repairing",
          heading: "If you're always the one going back",
          body:
            "If repair is only ever coming from you, and it's been that way a long time, that's worth taking seriously rather than doing more of. A pattern where one person does all the reconnecting isn't a communication problem — it's an imbalance, and it usually needs both of you in a room with someone. Read 'Should we see someone?'",
        },
      ],
    },
  ],

  literature: C7_LITERATURE,

  missions: [
    {
      id: "mission-c7-raise",
      version: 1,
      playId: "raise-it-anyway",
      title: "Raise the one thing",
      instruction:
        "Say it, at the time you chose, in the words you wrote. One thing. Then note what happened — not whether it worked.",
      linkToOperation: "Direct issue raising in place of avoidance",
      attemptMeaning:
        "You raised it. It doesn't mean it went well, and going badly doesn't mean you did it wrong.",
      suitability:
        "Not if raising things isn't safe. If you're weighing this against how angry they'll get, read 'If you don't feel safe' instead.",
      progression: [
        { id: "rung-c7-raise-2", instruction: "Raise the pattern once, on a calm day, rather than the incident again." },
      ],
    },
    {
      id: "mission-c7-imbalance",
      version: 1,
      playId: "not-always-me",
      title: "Come back to it a month later",
      instruction:
        "You've already named it in the tool. A month on, say whether anything shifted \u2014 once, without keeping score out loud.",
      linkToOperation: "Making shared-responsibility space by naming the imbalance",
      attemptMeaning:
        "You said it. Whether they pick it up isn't yours.",
      suitability:
        "If you find yourself going quiet to prove the point instead, that's a test rather than a request, and it won't tell you anything.",
      progression: [
        { id: "rung-c7-imbalance-2", instruction: "Ask them to bring one thing to you this month." },
      ],
    },
    {
      id: "mission-c7-pause",
      version: 1,
      playId: "when-it-starts-turning",
      title: "Catch one turn",
      instruction:
        "Next time you notice your tell, say your line and pause it — with a time to come back. Then come back.",
      linkToOperation: "Naming escalation and pausing at the point of turn",
      attemptMeaning:
        "You caught one. Missing them is expected; you'll miss more than you catch at first.",
      suitability:
        "If pausing gets overridden — if they won't let the conversation stop — that's worth noticing, and it isn't a failure of the technique.",
      progression: [
        { id: "rung-c7-pause-2", instruction: "Catch it earlier — at the tell rather than after it." },
      ],
    },
    {
      id: "mission-c7-repair",
      version: 1,
      playId: "going-back-afterwards",
      title: "Go back once",
      instruction:
        "After the next argument ends, go back within a day. Don't relitigate it. Just make contact.",
      linkToOperation: "Repair contact separate from apology",
      attemptMeaning:
        "You went back. It doesn't require them to meet you there.",
      suitability:
        "If you're always the one going back and have been for a long time, read the signpost on that Play before doing more of it.",
      progression: [
        { id: "rung-c7-repair-2", instruction: "Go back sooner — the same evening rather than the next day." },
      ],
    },
  ],

  useReviews: [
    {
      id: "review-c7-raise",
      version: 1,
      playId: "raise-it-anyway",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Raised one thing, not the list",
          "Picked the timing on purpose",
          "Said what I wanted, not just what was wrong",
          "Ended up raising everything",
        ],
      },
      performedOperation: {
        label: "Did you raise one specific thing, at a chosen time?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That the delivery does change it",
          "That it goes wrong regardless of how I say it",
          "How much I'd been holding",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned anyway",
          "I couldn't find a calm moment",
          "I said it and nothing changed",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c7-imbalance",
      version: 1,
      playId: "not-always-me",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Named it out loud",
          "Asked them to bring something",
          "Left one thing unraised and said so",
          "Went quiet without saying why",
        ],
      },
      performedOperation: {
        label: "Did you name the imbalance rather than demonstrate it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much of it I carry",
          "That they hadn't noticed",
          "That nothing gets raised if I don't",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "They took it as criticism",
          "Nothing got raised at all",
          "Saying it felt like more work I was doing",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c7-pause",
      version: 1,
      playId: "when-it-starts-turning",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Noticed my tell",
          "Named it and paused",
          "Came back to it afterwards",
          "Carried on anyway",
        ],
      },
      performedOperation: {
        label: "Did you name the turn and pause?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What my tell actually is",
          "How early it turns",
          "That pausing is possible",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I noticed too late",
          "They wouldn't let it pause",
          "We paused and never came back",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c7-repair",
      version: 1,
      playId: "going-back-afterwards",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Went back within a day",
          "Made contact without relitigating",
          "Went first even though I didn't want to",
          "Waited for them",
        ],
      },
      performedOperation: {
        label: "Did you re-establish contact without reopening it?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That contact doesn't need agreement",
          "How long the gap usually lasts",
          "That I'm always the one going back",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It turned into round two",
          "I'm always the one who does this",
          "They weren't ready",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
