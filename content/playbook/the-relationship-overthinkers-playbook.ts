/**
 * Cluster 6 — "Feeling Like I Need Constant Reassurance"
 * The Relationship Playbook™ · Finding Security Without Constant Reassurance
 *
 * §0 DECISION: PLAYS-ONLY, consistent with Clusters 3, 4 and 5.
 *
 * ⚠⚠ HARD PROHIBITION — NO ATTACHMENT CLASSIFICATION anywhere in this module.
 *   No "anxious attachment", no attachment style, no type, no diagnosis.
 *   The pattern is DESCRIBED (reassurance helps and wears off; a lot is spent
 *   on watching) and never NAMED. Owner-confirmed 29 Jul 2026.
 *
 * ⚠ OWNER RULING 29 Jul: the target is the REASSURANCE ROUTE, not the need.
 *   PE-3b (nine statements of self-attack about having the need) gets NO Play.
 *   Content must never reinforce "you should not need this".
 *
 * Derived against Framework Version 1.9.
 *   PE-3b  → wellbeing constraint; Understand layer only, no intervention
 *   PE-8   → Personal Capacity Regulation (RLC-FR-002) framing
 *   PE-5   → Perceptual Lens; STM-0418 is an observation and may be accurate
 *   Phase  → single phase, Exploration (1047/1050/1054 per C3 and C5 precedent)
 *
 * ⚠ CLAIM SCOPE. May claim: ask a question that has a real answer; notice what
 *   happens to reassurance when it arrives; tell a specific read from a
 *   familiar one; see what the watching costs and reclaim some. MUST NOT
 *   CLAIM: that the reader will need less reassurance, that they will feel
 *   secure, that they will stop being anxious, or anything about what kind of
 *   person they are.
 *
 * ⚠ IDs ARE DO-NOT-REVERT ONCE SHIPPED.
 */

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { C6_LITERATURE } from "./the-relationship-overthinkers-playbook-literature";
import { CRISIS_ESCALATION } from "./shared/safety-not-safe";

// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
export const FINDING_SECURITY: PlaybookContent = {
  playbookKey: "the-relationship-overthinkers-playbook", // ⚠ CONFIRM canonical slug
  playbookVersion: 1,
  displayName: "Finding Security Without Constant Reassurance",

  opening: {
    title: "Before anything else",
    body: [
      "Wanting to know where you stand is one of the most ordinary things a person can want. Nothing here is going to work on making you need less.",
      "What we'll look at instead is the route you take — because most people in this spot aren't short of reassurance. It comes, it helps, and then it drains away.",
      "We won't be telling you what kind of person you are.",
    ],
    manifestations: [
      "I overanalyze every text.",
      "I need constant reassurance.",
      "I don't believe compliments.",
      "I hate needing reassurance.",
    ],
    cta: "Start with what isn't a defect",
  },

  // ── recognition ────────────────────────────────────────────────
  recognitionCards: [
    {
      id: "rec-c6-not-a-defect",
      role: "validate",
      pathwayPlayId: null,
      headline: "I hate that I need this much reassurance.",
      validationCopy:
        "Wanting to know where you stand isn't a flaw, and caring a lot isn't either. Nothing here is aimed at making you need less. The shame is worth putting down though — hidden needs get asked for sideways, and sideways asking gets thin answers that don't last.",
      secondaryExamples: [
        "I wish I didn't need so much reassurance.",
        "I'm embarrassed by how much I care.",
        "I don't like who I become when I'm insecure.",
      ],
    },
    {
      id: "rec-c6-overanalysing",
      role: "route",
      pathwayPlayId: "ask-then-watch",
      headline: "I've read the message eleven times.",
      explanation:
        "The eleventh read has the same information as the first. Only asking or waiting gives you anything new.",
      secondaryExamples: [
        "I overanalyze every text.",
        "I keep checking when they were last online.",
        "I always wonder what they really meant.",
      ],
    },
    {
      id: "rec-c6-doesnt-land",
      role: "route",
      pathwayPlayId: "when-it-doesnt-land",
      headline: "They tell me it's fine and by evening I need to hear it again.",
      explanation:
        "You're probably not short of reassurance. It isn't staying.",
      secondaryExamples: [
        "I don't believe compliments.",
        "I assume they're just being nice.",
        "We're exclusive and I still don't feel secure.",
      ],
    },
    {
      id: "rec-c6-insecure-or-real",
      role: "route",
      pathwayPlayId: "insecure-or-accurate",
      headline: "I can't tell if I'm being insecure or if something's actually changed.",
      explanation:
        "Sometimes you're right. There's a way you can actually use to check.",
      secondaryExamples: [
        "I don't know if I'm overreacting.",
        "I compare myself to their ex.",
        "I wonder if they're losing interest.",
      ],
    },
    {
      id: "rec-c6-consumed",
      role: "route",
      pathwayPlayId: "what-this-is-costing",
      headline: "This is taking up most of my head.",
      explanation:
        "Not a flaw. A budget. And the more of you it takes, the more weight the relationship has to carry.",
      secondaryExamples: [
        "I become consumed by relationships.",
        "I get attached too quickly.",
        "I don't know how to slow down.",
      ],
    },
  ],

  // ── plays ──────────────────────────────────────────────────────
  plays: [
    // ─────────────────────────────────── Play 1 · CP-09 ──
    {
      playId: "ask-then-watch",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Ask, Then Watch",
      positioning:
        "For when you've reread it eleven times and learned nothing. You write the question alone \u2014 then you ask it, because rereading never gives you new information, and asking does.",
      recognitionGate: {
        prompt: "Do you go back over messages looking for something you missed?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Going over it feels like progress. You're turning it over, looking at every angle, working on it.",
            "But no new information is coming in, so nothing can get settled. All it makes is more possible meanings — which is the opposite of what you were after.",
            "Only two things make new information: asking, and watching what happens over time.",
          ],
        },
        {
          kind: "learn",
          body: [
            "\u201cAre we okay?\u201d gets you \u201cyes, of course\u201d. Lovely, and almost no information — which is why it's gone by Thursday.",
            "A question with an actual answer is specific: are we seeing other people, are you free next weekend, is this a regular thing.",
            "The narrower it is, the harder it is to answer with warmth alone — and warmth alone is the thing that doesn't last.",
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The question, in your words",
          helper:
            "Specific enough that “yeah, of course” wouldn't answer it. You might start with “I'd rather ask than guess…” or “Can I check one thing?”",
        },
        
        {
          kind: "ruleBuilder",
          intro: "Then watch, rather than reread",
          conditionLabel: "What I'll watch over the next week",
          thenLabel: "And what I'll do instead of rereading",
          actions: [
            "Whether they start things without me",
            "Whether what they said would happen, happens",
            "Whether it's steady rather than one good day",
            "Whether they actually answered what I asked",
          ],
          controlCheck:
            "I asked once. I'm not going to re-ask it in a new shape. I'm not going quiet to see what they do. When I want to reread, I've got somewhere else to put it.",
        },
        {
          kind: "output",
          heading: "What I asked, and what I'm watching",
          body: "Asked once. Then a week of actual information.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "The eleventh read has the same words in it.",
            "\u201cAre we okay?\u201d is a nice noise. Ask something with an answer.",
            "Asked once. Now watch.",
          ],
        },
      ],
      portable: [
        "The eleventh read has the same words in it.",
        "\u201cAre we okay?\u201d is a nice noise. Ask something with an answer.",
        "Asked once. Now watch.",
      ],
      myPlaysTemplate: {
        when: "When I'm rereading and analysing instead of finding out",
        move: "Ask one specific answerable question, then watch over a week",
        lookingFor: "Whether they initiate, follow through, and stay steady",
        watchOut: "Re-asking the same thing in a different shape",
        remember: "Rereading feels like doing something. It keeps me exactly where I am.",
      },
      fidelity: {
        correct:
          "You actually ask one specific question that has an answer, and then you watch over time instead of going back over it. Writing the question is just getting ready; asking is the real move.",
        misuse: [
          "Re-asking the same question in different words.",
          "Going quiet to see what they do.",
          "Treating a warm non-answer as the answer.",
        ],
        notMeaning:
          "It does not mean the answer will settle you, that they'll follow through, or that you'll stop wanting to reread.",
      },
    },

    // ───────────────────────── Play 2 · the cluster's centre ──
    {
      playId: "when-it-doesnt-land",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "When It Doesn't Land",
      positioning: "For the reassurance that arrives, helps, and drains by evening.",
      recognitionGate: {
        prompt: "Does reassurance help for a while and then wear off?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "They've told you. It landed. And then it faded — faster than seemed reasonable — and you were back where you started.",
            "So the problem isn't supply. It's what happens on the way in, and how quickly the ground goes soft again.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Information is something you didn't know and now do. It holds until something changes.",
            "Relief is the discomfort dropping for a while. Nothing was learned, so there's nothing to hold onto.",
            "Most reassurance-seeking gets relief. That's why it fades — not because they didn't mean it.",
          ],
        },
        {
          kind: "emotionBeat",
          body: [
            "Looking at how you take something apart is uncomfortable, especially when you'd rather just be able to believe it.",
            "You're not doing it on purpose and it isn't a flaw in you. It's a habit with a reason behind it. Noticing is all we're asking here.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "One time it didn't stay",
          fields: [
            {
              id: "what-they-said",
              input: "text",
              label: "What did they say or do?",
              placeholder: "The reassuring thing.",
            },
            {
              id: "how-long",
              input: "chips",
              label: "How long did it hold?",
              suggestions: [
                "A few minutes",
                "A few hours",
                "Until the next quiet patch",
                "A day or two",
                "It didn't really land at all",
              ],
            },
            {
              id: "what-i-did-with-it",
              input: "chips",
              label: "What happened to it?",
              suggestions: [
                "Decided they were being polite",
                "Found the thing they didn't say",
                "Thought they'd say that to anyone",
                "Took it in, then took it apart later",
                "Not sure",
              ],
            },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Was there anything in it you could check against — or was it warmth?",
          enoughLabel: "There was something checkable in it",
          needMoreLabel: "It was warmth",
          needMoreIntro:
            "That's the common answer and it explains the draining. Warmth is real and it doesn't hold, because there's nothing in it to hold onto.",
          needToKnowLabel: "What would have been checkable",
          observableLabel: "Something I could see over the next week",
        },
        {
          kind: "output",
          heading: "What actually holds",
          body: "Not a way to believe things more. A note on which kind you're getting.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Information stays. Relief doesn't.",
            "Where does it get taken apart? That's the moment.",
            "Warmth is real and it doesn't hold. That's not their fault or mine.",
          ],
        },
      ],
      portable: [
        "Information stays. Relief doesn't.",
        "Where does it get taken apart? That's the moment.",
        "Warmth is real and it doesn't hold. That's not their fault or mine.",
      ],
      myPlaysTemplate: {
        when: "When reassurance keeps wearing off",
        move: "Notice which kind I'm getting, and where it gets taken apart",
        lookingFor: "Whether there was anything checkable in it, or only warmth",
        watchOut: "Turning this into more evidence that I'm broken",
        remember: "Not short of reassurance. It isn't staying.",
      },
      fidelity: {
        correct:
          "You look at one specific time and check whether it had anything you could check against, and you name the moment it got brushed off.",
        misuse: [
          "Using it as further proof that you're too much.",
          "Deciding their reassurance was insincere.",
          "Demanding checkable reassurance from them as a new requirement.",
        ],
        notMeaning:
          "It does not mean you'll believe them next time, that they should reassure you differently, or that the need will shrink.",
      },
      supportSignposts: [
        {
          id: "signpost-c6-worth-contingent",
          heading: "If it isn't only about them",
          body:
            `Some of what people write here is less about the relationship and more about whether they're worth anything at all — where being wanted is the only thing that settles it. If that's closer to it for you, it can help to take it to someone who can stay with it — a therapist, a GP, or another professional. It's a bigger question than a dating tool can hold.\n\n${CRISIS_ESCALATION}`,
        },
      ],
    },

    // ─────────────────────────── Play 3 · discrimination ──
    {
      playId: "insecure-or-accurate",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Insecure, or Accurate?",
      positioning: "For when you genuinely can't tell whether something's changed.",
      recognitionGate: {
        prompt: "Do you find it hard to know whether you're reading something real?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Being anxious doesn't make you wrong. People do lose interest, and you may well be picking something up.",
            "The trouble is that the feeling is the same whether or not there's really something there. So the feeling can't be the test.",
          ],
        },
        {
          kind: "learn",
          body: [
            "Probably about them: you can point at a specific thing, something changed, and someone else would notice if you described it plainly.",
            "Probably the pattern: it's the same feeling as last month and the person before, it's loudest when nothing at all has happened, and it gets stronger rather than weaker after they reassure you.",
            "That last one is the most useful tell here.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Which side?",
          situation:
            "You sent a message four hours ago. They've been online since. Nothing yet, and nothing has actually gone wrong.",
          buckets: [
            { id: "about-them", label: "Probably about them" },
            { id: "the-pattern", label: "Probably the pattern" },
          ],
          items: [
            {
              id: "sort-c6-stopped-calling",
              text: "They used to call on the way home and stopped three weeks ago",
              correctBucket: "about-them",
              correction: "Specific, and it changed. That's about them.",
            },
            {
              id: "sort-c6-quiet-afternoon",
              text: "It's a quiet Sunday and nothing has happened, and I'm certain something's wrong",
              correctBucket: "the-pattern",
              correction: "Loudest when nothing's happening. That's the pattern.",
            },
            {
              id: "sort-c6-worse-after",
              text: "They reassured me and I felt worse an hour later",
              correctBucket: "the-pattern",
              correction:
                "Reassurance that makes it louder isn't really about them. That's one of the clearest tells.",
            },
            {
              id: "sort-c6-friend-would-see",
              text: "If I described it without commentary, a friend would raise an eyebrow",
              correctBucket: "about-them",
              correction: "If you can describe it without adding your own spin, it's usually really out there.",
            },
            {
              id: "sort-c6-same-as-last",
              text: "This is exactly how I felt about the last two people",
              correctBucket: "the-pattern",
              correction: "The same feeling across different people points at what stays the same, not at the person.",
            },
            {
              id: "sort-c6-their-ex",
              text: "I don't think I compare well to their ex",
              correctBucket: "the-pattern",
              correction:
                "There's no test and no result for that one, so it stays open forever. That's the pattern's favourite kind of question.",
            },
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
              placeholder: "The thing you're worried about.",
            },
            {
              id: "point-at-it",
              input: "text",
              label: "What specific thing changed?",
              placeholder: "If nothing comes to mind, write 'nothing specific' — that's an answer.",
            },
          ],
        },
        {
          kind: "output",
          heading: "Where this one lands",
          body: "Either answer gives you a next move. Neither one means ignore it.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "Louder after they reassure me? That's the pattern.",
            "Can I point at something that changed?",
            "\u201cThe pattern\u201d never means ignore it.",
          ],
        },
      ],
      portable: [
        "Louder after they reassure me? That's the pattern.",
        "Can I point at something that changed?",
        "\u201cThe pattern\u201d never means ignore it.",
      ],
      myPlaysTemplate: {
        when: "When I can't tell if something's actually changed",
        move: "Check the read against both lists before acting on it",
        lookingFor: "Something specific that changed, describable without commentary",
        watchOut: "Using \u201cit's just me\u201d to dismiss something that was real",
        remember: "Anxious doesn't mean wrong. The feeling just can't be the test.",
      },
      fidelity: {
        correct:
          "You check a read for a specific change before you act on it or push it away.",
        misuse: [
          "Using the pattern label to override something you actually saw.",
          "Running it repeatedly until it gives the answer you wanted.",
          "Treating the result as settled.",
        ],
        notMeaning:
          "It does not mean the read is right or wrong, that your worry is unfounded, or that you should stop worrying.",
      },
    },

    // ───────────────────── Play 4 · PCR (RLC-FR-002) ──
    {
      playId: "what-this-is-costing",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What This Is Costing",
      positioning: "For when the relationship has taken over most of your head.",
      recognitionGate: {
        prompt: "Is this taking up more of you than you've got spare?",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "This isn't about caring less, and it isn't a diagnosis of how you attach.",
            "It's just math. The rereading, the checking, the replaying, the working out what they meant — those hours come out of the same pile as everything else.",
            "And the less of you there is elsewhere, the more weight the relationship has to carry, which makes every wobble in it enormous.",
          ],
        },
        {
          kind: "learn",
          body: [
            "You've probably tried to just stop checking. It doesn't stick, and then that becomes another thing you've failed at.",
            "Adding it up works better than banning it. Knowing the price lets you decide what you'd rather spend some of it on — that's a choice, not a ban.",
          ],
        },
        {
          kind: "ownTurn",
          intro: "The honest count",
          fields: [
            {
              id: "where-it-goes",
              input: "chips",
              label: "Where does most of it go?",
              suggestions: [
                "Rereading messages",
                "Checking when they were last online",
                "Looking at who they follow",
                "Replaying conversations",
                "Working out what to send",
              ],
            },
            {
              id: "how-much",
              input: "text",
              label: "Roughly how much of your day?",
              placeholder: "A guess is fine. Most people underestimate.",
            },
            {
              id: "what-got-dropped",
              input: "text",
              label: "What's been getting less of you lately?",
              placeholder: "Work, friends, sleep, the thing you used to do on Sundays.",
            },
          ],
        },
        {
          kind: "ruleBuilder",
          intro: "Reclaim some of it",
          conditionLabel: "The one I'll take back first",
          thenLabel: "And where that goes instead",
          actions: [
            "Check once a day rather than whenever",
            "Read it once and close it",
            "Stop looking at who they follow",
            "Give the worrying a slot, and keep it there",
          ],
          controlCheck:
            "The time goes somewhere real, not nowhere. This isn't about seeming less keen to them. Slipping is expected and isn't a failure.",
        },
        {
          kind: "output",
          heading: "What I'm taking back",
          body: "One thing, and somewhere for it to go.",
        },
        {
          kind: "portable",
          heading: "Take this with you",
          steps: [
            "A budget, not a flaw.",
            "When it's carrying everything, every wobble is enormous.",
            "Slipping is expected. It isn't a failure.",
          ],
        },
      ],
      portable: [
        "A budget, not a flaw.",
        "When it's carrying everything, every wobble is enormous.",
        "Slipping is expected. It isn't a failure.",
      ],
      myPlaysTemplate: {
        when: "When the relationship is taking up most of my head",
        move: "Count what the watching costs and take one piece back",
        lookingFor: "Where the hours actually go, and what's been dropped",
        watchOut: "Turning the limit into another thing I'm failing at",
        remember: "Not caring less. Keeping the rest of my life running alongside it.",
      },
      fidelity: {
        correct:
          "You count what the watching costs, then take back one specific piece and put it somewhere else.",
        misuse: [
          "Using the limit as another standard to fail.",
          "Doing it to appear less interested.",
          "Cutting the monitoring with nothing to put in its place.",
        ],
        notMeaning:
          "It does not mean you'll feel calmer, that the wanting will reduce, or that monitoring less makes the relationship safer.",
      },
      supportSignposts: [
        {
          id: "signpost-c6-consumed",
          heading: "If it's most of your life, not most of your head",
          body:
            "If this has been eating your sleep, your work, or your other relationships for a while, that's worth talking to someone about. A GP or a therapist. Not because wanting reassurance is a problem — because running at this level for a long time takes a toll that's worth looking at on its own.",
        },
      ],
    },
  ],

  literature: C6_LITERATURE,

  // ── missions ───────────────────────────────────────────────────
  missions: [
    {
      id: "mission-c6-ask",
      version: 1,
      playId: "ask-then-watch",
      title: "Watch for a week without re-asking",
      instruction:
        "You asked in the tool. Now hold a full week \u2014 note what they do, and don't re-ask it in a new shape.",
      linkToOperation: "Direct clarification followed by observation over time",
      attemptMeaning:
        "You asked and watched. It doesn't mean the answer settled anything.",
      suitability:
        "If you find yourself re-asking it in a new shape, that's the thing to notice rather than a failure.",
      progression: [
        {
          id: "rung-c6-ask-2",
          instruction: "Let a full week pass before asking anything else.",
        },
      ],
    },
    {
      id: "mission-c6-land",
      version: 1,
      playId: "when-it-doesnt-land",
      title: "Catch one deflection",
      instruction:
        "Next time someone says something good, notice the moment you start taking it apart. Don't stop it — just note where it happened.",
      linkToOperation: "Observing the point at which reassurance is discounted",
      attemptMeaning:
        "You noticed. Believing it wasn't the ask.",
      suitability:
        "If noticing turns into a fresh round of beating yourself up, stop and read 'Wanting to know where you stand isn't a defect'.",
      progression: [
        {
          id: "rung-c6-land-2",
          instruction: "Leave one good thing alone for a full day before examining it.",
        },
      ],
    },
    {
      id: "mission-c6-check",
      version: 1,
      playId: "insecure-or-accurate",
      title: "Run one live worry through the lists",
      instruction:
        "Take something you're currently worried about and check it against both lists before you act on it or push it down.",
      linkToOperation: "Discriminating a specific change from a familiar feeling",
      attemptMeaning:
        "You checked. Landing on 'the pattern' doesn't mean the worry was silly.",
      suitability:
        "If it lands on both, that's a real result. Some reads don't sort.",
      progression: [
        {
          id: "rung-c6-check-2",
          instruction: "Describe it out loud to someone without commentary, and see if it holds up.",
        },
      ],
    },
    {
      id: "mission-c6-cost",
      version: 1,
      playId: "what-this-is-costing",
      title: "Take one thing back for a week",
      instruction:
        "Pick the one you named. Hold it for a week, and put the time somewhere real. Note what you noticed.",
      linkToOperation: "Reclaiming capacity spent on monitoring",
      attemptMeaning:
        "You tried it. Slipping is information, not failure.",
      suitability:
        "If holding it makes the worry noticeably worse rather than just uncomfortable, ease off — that's worth knowing rather than pushing through.",
      progression: [
        {
          id: "rung-c6-cost-2",
          instruction: "Add a second one, or extend the first by a week.",
        },
      ],
    },
  ],

  // ── use reviews ────────────────────────────────────────────────
  useReviews: [
    {
      id: "review-c6-ask",
      version: 1,
      playId: "ask-then-watch",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Asked something specific",
          "Watched over the week instead of rereading",
          "Let a non-answer stand as a non-answer",
          "Re-asked it in a different shape",
        ],
      },
      performedOperation: {
        label: "Did you ask once and then watch?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "What they actually do over a week",
          "How little the rereading was giving me",
          "That I'd been asking things with no real answer",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "I asked and needed to ask again",
          "Waiting a week was harder than rereading",
          "I couldn't make the question specific",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c6-land",
      version: 1,
      playId: "when-it-doesnt-land",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Noticed the deflection",
          "Left it alone longer than usual",
          "Noticed which kind of reassurance it was",
          "Took it apart as usual",
        ],
      },
      performedOperation: {
        label: "Did you notice where it got taken apart?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "Where exactly it comes apart",
          "That most of it was warmth, not information",
          "How fast it drains",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Noticing turned into beating myself up",
          "I couldn't catch the moment",
          "Seeing it didn't stop it",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c6-check",
      version: 1,
      playId: "insecure-or-accurate",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Checked against both lists",
          "Looked for something specific that changed",
          "Said it out loud without commentary",
          "Acted on the feeling directly",
        ],
      },
      performedOperation: {
        label: "Did you check before acting or pushing it down?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "That nothing specific had changed",
          "That something had, actually",
          "That it's loudest when nothing's happening",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "It landed on both lists",
          "Knowing it was the pattern didn't help",
          "I used it to dismiss something real",
          "Nothing stuck",
        ],
      },
    },
    {
      id: "review-c6-cost",
      version: 1,
      playId: "what-this-is-costing",
      didDifferently: {
        label: "What did you do differently?",
        multi: true,
        options: [
          "Held the one I picked",
          "Put the time somewhere real",
          "Counted honestly",
          "Slipped back into it",
        ],
      },
      performedOperation: {
        label: "Did you take one thing back and put it somewhere?",
        options: ["Yes", "Partly", "No"],
      },
      becameClearer: {
        label: "What got clearer?",
        multi: true,
        options: [
          "How much it was actually taking",
          "What I'd been dropping",
          "That the checking wasn't making me feel safer",
          "Nothing new",
        ],
      },
      stuckWhere: {
        label: "Where did you get stuck?",
        options: [
          "Not checking made the worry louder",
          "I had nowhere to put the time",
          "It became another thing I was failing at",
          "Nothing stuck",
        ],
      },
    },
  ],

  // simulations — INTENTIONALLY ABSENT. Plays-only.
};
