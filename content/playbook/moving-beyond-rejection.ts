// Cluster 1 "Difficulty Feeling Chosen" — consumer playbook "Moving Beyond Rejection".
// Authored content (Phase 5/5B). All six Cluster-1 Plays + Experiences are now built:
// the two original (read-and-decide, what-it-actually-means) plus the four approved slices
// (is-this-right-for-you, rest-or-giving-up, how-much-to-put-in, say-the-real-thing). Each slice
// lives in its own file and is spread in below; all behind PLAYBOOK_REV3_ENABLED.

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { MBR_LITERATURE, MBR_STATEMENT_MAP } from "@/content/playbook/moving-beyond-rejection-literature";
import { MBR_SIMULATIONS } from "@/content/playbook/moving-beyond-rejection-simulations";
import { MBR_MISSIONS } from "@/content/playbook/moving-beyond-rejection-missions";
import { MBR_USE_REVIEWS } from "@/content/playbook/moving-beyond-rejection-usereviews";
import { ITR_PLAY, ITR_SIMULATION, ITR_JIT } from "@/content/playbook/is-this-right-for-you";
import { RGU_PLAY, RGU_SIMULATION, RGU_JIT } from "@/content/playbook/rest-or-giving-up";
import { HMP_PLAY, HMP_SIMULATION, HMP_JIT } from "@/content/playbook/how-much-to-put-in";
import { STT_PLAY, STT_SIMULATION, STT_JIT } from "@/content/playbook/say-the-real-thing";

// User-choice investment/decision actions for Read & Decide (shared by the rule
// builder and the Update editor). Non-gamey: never mirroring/scorekeeping/deadlines.
const RD_ACTIONS = [
  "keep watching a little longer",
  "ask directly / get clarity",
  "keep things where they are for now",
  "put in a little more",
  "invest a little less for now",
  "stop adding extra effort that isn't being met",
  "let it show me more",
  "step away",
  "revisit soon",
];
const RD_CONTROL_CHECK =
  "This is about what you choose to invest based on what you're seeing — not a way to get them to chase, and not a deadline.";

export const MOVING_BEYOND_REJECTION: PlaybookContent = {
  playbookKey: "moving-beyond-rejection",
  playbookVersion: 1,
  displayName: "Believing You're Worth Being Chosen",
  // Rev 3 Understand layer (Step 3) — additive; consumed by the flag-gated field
  // guide, not by the v0 delivery path.
  literature: [...MBR_LITERATURE, ...ITR_JIT, ...RGU_JIT, ...HMP_JIT, ...STT_JIT],
  statementMap: MBR_STATEMENT_MAP,
  simulations: [...MBR_SIMULATIONS, ITR_SIMULATION, RGU_SIMULATION, HMP_SIMULATION, STT_SIMULATION],
  missions: MBR_MISSIONS,
  useReviews: MBR_USE_REVIEWS,
  opening: {
    title: "Believing You're Worth Being Chosen",
    body: [
      "Wanting to be chosen is human — everyone wants to feel wanted. That's not the problem.",
      "This is about what happens when being chosen starts carrying too much weight — quietly shaping how you see yourself, how you read a relationship, how you show up, how much you put in, and what you decide.",
      "The goal isn't to become easier to choose. It's to keep the feeling of being unchosen from running how you read your dating life — and what you do about it.",
      "This shows up differently for different people, and you won't work on all of it. Next, we'll help you spot the parts that sound like you — and you pick where to start.",
    ],
    manifestations: [
      "“Do they want me?”",
      "“What's wrong with me?”",
      "“Why does this keep happening?”",
      "“Is this going anywhere?”",
      "“Maybe I'm not enough.”",
      "“Should I keep trying?”",
    ],
    cta: "See what sounds like me",
  },

  recognitionCards: [
    {
      id: "rec-self-meaning",
      role: "route",
      pathwayPlayId: "what-it-actually-means",
      headline: "When something doesn't work out, I start wondering what's wrong with me.",
      secondaryExamples: ["“I think I'm the problem.”", "“Maybe I'm not enough.”"],
    },
    {
      id: "rec-selection",
      role: "route",
      pathwayPlayId: "is-this-right-for-you", // built (dualAttention slice)
      headline: "I spend more time wondering if they want me than asking whether I want this.",
      secondaryExamples: ["“I feel like the backup option.”", "“I feel like I'm waiting for them to choose me.”"],
    },
    {
      id: "rec-evidence",
      role: "route",
      pathwayPlayId: "read-and-decide",
      headline: "I can't always tell what their behavior means — or when to keep going, ask, slow down, or walk away.",
      secondaryExamples: [
        "“I don't know if we're just friends.”",
        "“I don't know when to walk away.”",
        "“They give me just enough attention to keep me around.”",
      ],
    },
    {
      id: "rec-over-invest",
      role: "route",
      pathwayPlayId: "how-much-to-put-in", // built (investmentView slice)
      headline: "I keep putting more into it even when I'm not getting much back.",
      secondaryExamples: ["“I always care more than they do.”", "“I'm tired of being almost enough.”"],
    },
    {
      id: "rec-self-edit",
      role: "route",
      pathwayPlayId: "say-the-real-thing", // built (communicationRehearsal slice)
      headline: "I edit myself so they'll keep liking me.",
      secondaryExamples: ["“I keep changing myself for other people.”", "“I don't know if people like the real me.”"],
    },
    {
      id: "rec-fatigue",
      role: "route",
      pathwayPlayId: "rest-or-giving-up", // built (decisionRoom slice)
      headline: "I'm worn out by dating, and I can't tell if I need a break or I'm just done.",
      secondaryExamples: ["“I don't even want to download the apps again.”", "“I'm exhausted by dating.”"],
    },
    {
      id: "rec-loneliness",
      role: "validate",
      pathwayPlayId: null,
      headline: "Honestly, mostly I'm just tired of being alone.",
      validationCopy:
        "Wanting a partner isn't a problem to fix. It's human. The only time it's worth a closer look is if it's quietly pushing your decisions — and if it is, “Read It, Then Decide” can help.",
      secondaryExamples: ["“I miss having someone.”", "“Weekends feel lonely.”"],
    },
  ],

  plays: [
    // -------------------------------------------------------------------------
    // READ IT, THEN DECIDE  (T2a → T2b)
    // -------------------------------------------------------------------------
    {
      playId: "read-and-decide",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "Read It, Then Decide",
      positioning: "Tell what you've seen from what you're guessing, and set a clear next move.",
      recognitionGate: {
        prompt:
          "I can't always tell what their behavior actually means — or when to keep going, ask, slow down, or walk away.",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Right now, an unclear signal can turn into a whole story fast — and the story decides what you do.",
            "This helps you do something different: tell what you've actually seen from what you're guessing, notice what you still don't know, and set a clear next move — so your decision follows the evidence, not the fear or the hope.",
          ],
        },
        {
          kind: "literature",
          l1: "Early dating is genuinely unclear — small, mixed signals, and your mind fills the gaps, usually with whatever you most fear or most hope. That's normal. But when a guess gets treated like a fact, you end up reacting to a story instead of the person. Two things help: keeping what happened separate from what you think it means, and deciding in advance what you'd need to actually see before you change how much you're putting in. This isn't suspicion or scorekeeping — it's giving yourself accurate information to work with.",
          l2Heading: "Understand this deeper",
          l2: "Under uncertainty, people fill missing information with expectation — often shaped by past disappointment. The move here slows that automatic step: separate observation from inference, name what's genuinely unknown, and pre-decide what evidence would change your investment. It doesn't make anyone more interested; it changes what you're reacting to. Evidence status (honest): pre-committing to “if-then” plans reliably helps people act on their intentions (implementation-intentions research); separating observation from inference is a core reasoning skill. Applying them to dating decisions is a reasoned extension we believe in but have not formally tested.",
        },
        {
          kind: "learn",
          body: [
            "Three buckets. When something happens and a story starts forming, sort it:",
            "Saw it — what actually happened. Guessing — what you think it means (could be right; still a guess). Don't know yet — what this doesn't tell you.",
            "Then one question: what would actually tell me?",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Let's try it on someone else's situation first. Sort each piece into a bucket.",
          situation:
            "You had a great date — easy conversation, they said they'd love to do it again. Over the next four days their texts got shorter. Then they messaged suggesting a specific plan for next week.",
          buckets: [
            { id: "saw", label: "Saw it" },
            { id: "guess", label: "Guessing" },
            { id: "unknown", label: "Don't know yet" },
          ],
          items: [
            { id: "s1", text: "The date went well and they said they'd like to see me again", correctBucket: "saw" },
            { id: "s2", text: "Their texts got shorter over four days", correctBucket: "saw" },
            {
              id: "s3",
              text: "They're losing interest",
              correctBucket: "guess",
              correction:
                "That's a guess, not something you saw. The shorter texts are what you saw — what it means is still open.",
            },
            { id: "s4", text: "They suggested a specific plan for next week", correctBucket: "saw" },
            { id: "s5", text: "Whether the shorter texts are about me, their week, or just how they text", correctBucket: "unknown" },
          ],
          note:
            "Notice: the only ‘losing interest’ evidence is shorter texts — and they just made a concrete plan. The story ran ahead of what you actually saw.",
          evidenceQuestion: {
            prompt: "What would actually tell you?",
            options: ["How they are on the plan they suggested", "Re-reading the old texts again", "Asking a friend what it means"],
          },
        },
        {
          kind: "scenarioSort",
          prompt: "One more. This time the signals are words vs. actions.",
          situation: "They keep saying they really like you — but they dodge making actual plans.",
          buckets: [
            { id: "saw", label: "Saw it" },
            { id: "guess", label: "Guessing" },
            { id: "unknown", label: "Don't know yet" },
          ],
          items: [
            { id: "w1", text: "They said they really like me", correctBucket: "saw" },
            { id: "w2", text: "They've avoided making concrete plans", correctBucket: "saw" },
            { id: "w3", text: "They're scared but really into me", correctBucket: "guess" },
            { id: "w4", text: "Whether their words and their actions line up over time", correctBucket: "unknown" },
          ],
          note:
            "When what someone says and what they repeatedly do don't line up, that mismatch is itself important information. It doesn't mean their words are meaningless — it means the gap is worth watching.",
          evidenceQuestion: {
            prompt: "What would tell you most?",
            options: ["Whether what they say and what they do line up over time", "Whether they say nice things next time", "How the next text feels"],
          },
        },
        {
          kind: "ownTurn",
          intro: "Now a real situation of yours. Keep it to one specific thing.",
          fields: [
            { id: "question", label: "What's the question you actually want answered?", input: "text", placeholder: "e.g. Is this going somewhere, or am I filling in the blanks?" },
            { id: "saw", label: "Saw it — what actually happened", input: "chips" },
            { id: "guessing", label: "Guessing — what you think it means", input: "chips" },
            { id: "unknown", label: "Don't know yet", input: "chips" },
            { id: "evidence", label: "What would actually tell you? (one thing)", input: "text" },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Do you already have enough to answer your question?",
          enoughLabel: "I already have enough — let me decide",
          needMoreLabel: "I need more information first",
          needMoreIntro:
            "Good — “I need more information” is a real answer. Name the one thing that would actually move this forward, so it doesn't turn into waiting forever.",
          needToKnowLabel: "What do I still need to know?",
          observableLabel: "What observable thing would answer it?",
        },
        {
          kind: "ruleBuilder",
          intro: "Now turn that into a move — decided now, so you're not deciding in the moment from fear or hope.",
          conditionLabel: "If I see… (the thing you'll watch for)",
          thenLabel: "…then I will",
          actions: RD_ACTIONS,
          controlCheck: RD_CONTROL_CHECK,
        },
        { kind: "output", heading: "Your Read & Decide", body: "Here's what you've got — keep it, or save it to My Plays." },
        {
          kind: "portable",
          heading: "Take it with you",
          steps: [
            "What did I actually see?",
            "What am I guessing?",
            "What don't I know yet?",
            "What would tell me?",
            "If I see ___, I'll ___.",
          ],
        },
        {
          kind: "realWorldUse",
          useWhen:
            "a text or a change in how they're acting starts turning into a story — or when you're unsure whether to keep going, ask, ease off, or walk away.",
          doThis: "Run the five lines before you react. Then watch for the one thing that would actually tell you.",
          safetyNote:
            "If what you're ‘waiting to be sure about’ is whether someone is treating you badly or unsafely — you don't need more evidence for that. Trust it.",
        },
      ],
      portable: [
        "What did I actually see?",
        "What am I guessing?",
        "What don't I know yet?",
        "What would tell me?",
        "If I see ___, I'll ___.",
      ],
      myPlaysTemplate: {
        when: "a signal turns into a story, or I'm stuck on whether to keep going",
        move: "saw it / guessing / don't know / what would tell me → if ___, then ___",
        lookingFor: "the one thing that would actually answer my question",
        watchOut: "treating a guess as a fact; making it a deadline or a test of them",
        remember: "decide from what I see, not from fear or hope",
      },
      fidelity: {
        correct: "You kept ‘saw it’ separate from ‘guessing’, named a real ‘don't know’, and your move has an observable trigger and your own action.",
        misuse: [
          "Filing clear, repeated behavior under ‘don't know’ to avoid a conclusion.",
          "A rule that's a countdown, or a way to make them chase.",
        ],
        notMeaning: "This isn't playing it cool, keeping score, testing them, or needing 100% certainty before you act.",
      },
      outputEditor: {
        heading: "Update your read & move",
        fields: [
          { id: "evidence", label: "What would tell you?", input: "text" },
          { id: "rule", label: "Your move", input: "rule", actions: RD_ACTIONS, controlCheck: RD_CONTROL_CHECK },
        ],
      },
    },

    // -------------------------------------------------------------------------
    // WHAT IT ACTUALLY MEANS  (T1a)
    // -------------------------------------------------------------------------
    {
      playId: "what-it-actually-means",
      playVersion: 1,
      outputSchemaVersion: 1,
      name: "What It Actually Means",
      positioning: "Separate what happened from what it says about you.",
      recognitionGate: {
        prompt:
          "When something doesn't work out with someone, it can start to feel like it means something bigger about me — like there's something wrong with me, or this is just how it'll always go.",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "When a date or a relationship doesn't work out, your mind can do something quick and unfair: it takes one thing that happened and turns it into a verdict about you. One person's choice becomes “I'm not enough.”",
            "This Play helps you keep the conclusion the size of the actual evidence — so a hard moment stays a hard moment, instead of becoming a definition of you. It won't make the sting go away. It just stops the sting from writing a story it doesn't have the evidence for.",
          ],
        },
        {
          kind: "literature",
          l1: "Getting turned down, or watching something fade, genuinely hurts — that's not a flaw, that's being a person who cares. But a step happens almost automatically: a specific event (‘this didn't work out with this person’) quietly expands into a global claim (‘I'm unlovable’). The claim feels true because it's painful — but pain isn't evidence. This isn't positive thinking, and it's not pretending you don't care. It's one honest question: what does this actually prove — and what does it not?",
          l2Heading: "Understand this deeper",
          l2: "When a painful event hits, the mind tends to explain it in a global, stable, internal way (‘this is about all of me, it'll always be like this’) rather than a specific, temporary one. Naming the event from a small step back tends to produce clearer, less distorted reasoning. It doesn't make anyone want you, and it doesn't remove the hurt — it changes the size of the conclusion you draw. A real recurring pattern is worth examining (keep it); ‘I'm fundamentally unlovable’ is a verdict a pattern doesn't establish. Evidence status (honest): the building blocks draw on established psychology (how people explain painful events; the reasoning benefits of a small amount of self-distance). Using them to keep dating letdowns from becoming self-verdicts is a reasoned application we believe in but haven't formally tested.",
        },
        {
          kind: "learn",
          body: [
            "When a letdown starts becoming a verdict, run it through three questions:",
            "What does this actually establish? What does it not establish? What's the narrowest true thing I can say?",
            "The trick is separating this happened from this is who I am. Let's try it on someone else's situation first.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Sort each statement: does the event support it, or can it not prove it?",
          situation: "After a few good dates, they said: “I had a really good time, but I don't think we're the right match.”",
          thought: "And the thought that showed up: “Something must be wrong with me.”",
          buckets: [
            { id: "supports", label: "This event supports this" },
            { id: "cant", label: "This event can't prove this" },
          ],
          items: [
            { id: "a1", text: "This person didn't want to keep dating me", correctBucket: "supports" },
            { id: "a2", text: "We weren't the right match for them", correctBucket: "supports" },
            { id: "a3", text: "I'm not enough", correctBucket: "cant", correction: "That's the story, not the evidence. What did the event actually show? That this one person didn't want to continue. The rest is the leap we're catching." },
            { id: "a4", text: "No one will ever choose me", correctBucket: "cant" },
            { id: "a5", text: "There's something wrong with me", correctBucket: "cant" },
          ],
          note: "Hint on each: is this about this person or everyone? this time or forever? what happened or who you are?",
        },
        {
          kind: "scenarioSort",
          prompt: "This one's frustrating — going quiet on someone isn't kind. We're only checking the global conclusion.",
          situation: "Someone you were really enjoying just… stopped replying. No explanation.",
          thought: "Thought: “I'm forgettable. Nobody ever stays interested.”",
          buckets: [
            { id: "supports", label: "This event supports this" },
            { id: "cant", label: "This event can't prove this" },
          ],
          items: [
            { id: "b1", text: "They stopped responding", correctBucket: "supports" },
            { id: "b2", text: "It was rude, and it stung", correctBucket: "supports" },
            { id: "b3", text: "I'm forgettable", correctBucket: "cant" },
            { id: "b4", text: "Nobody ever stays interested", correctBucket: "cant", correction: "‘Nobody / ever’ is the leap. One person going quiet can't prove a rule about everyone." },
          ],
          note: "Your reaction is valid. We're bounding only the global claim, not the feeling.",
        },
        {
          kind: "scenarioSort",
          prompt: "This one's different — there might be a real pattern. We won't tell you it's imaginary. Two things are getting tangled; sort them.",
          situation: "The last three people you were into slowly became less available.",
          thought: "Thought: “This keeps happening because I'm fundamentally unlovable.”",
          buckets: [
            { id: "supports", label: "An observation to keep" },
            { id: "cant", label: "A verdict to drop" },
          ],
          items: [
            { id: "c1", text: "The last three people I pursued became less available", correctBucket: "supports" },
            { id: "c2", text: "Because I'm fundamentally unlovable", correctBucket: "cant", correction: "That's a global cause the pattern doesn't prove. Keep the observation; drop the verdict." },
          ],
          note: "Keep the observation, drop the verdict. A real pattern is worth looking at — separately, as evidence.",
        },
        {
          kind: "ownTurn",
          intro: "Now one of yours. Keep it to one specific thing — not a whole era.",
          fields: [
            { id: "event", label: "What happened?", input: "text", placeholder: "one specific event" },
            { id: "conclusion", label: "What did you turn it into?", input: "text", placeholder: "the conclusion about you" },
            { id: "establishes", label: "What does it actually establish?", input: "chips" },
            { id: "notEstablishes", label: "What does it NOT establish?", input: "chips", suggestions: ["about everyone", "forever", "who I am"] },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The narrowest true thing",
          helper: "Build it from what the event actually establishes. Specific and honest — not flattering.",
        },
        {
          kind: "emotionBeat",
          body: [
            "Bounding the conclusion doesn't mean you're fine, or that you didn't want it, or that it didn't matter.",
            "You can hold both: your narrowest true thing — and this can still hurt. You just did the hard part: you kept the fact and dropped the verdict.",
          ],
        },
        { kind: "output", heading: "Your Bounded Conclusion", body: "Keep it, or save it to My Plays." },
        {
          kind: "portable",
          heading: "Take it with you",
          steps: ["What does this actually establish?", "What does it NOT establish?", "What's the narrowest true thing?"],
        },
        {
          kind: "realWorldUse",
          useWhen: "a dating letdown starts turning into a sentence about you — ‘what's wrong with me,’ ‘this always happens,’ ‘I'm not enough.’",
          doThis: "Run the three questions before the story hardens. Keep the fact, drop the verdict, keep the feeling.",
          safetyNote:
            "If this feels bigger than a dating moment — a belief about yourself that follows you everywhere, or something that's been heavy for a long time — that's real, and it deserves more than a dating tool. Talking it through with a mental health professional can genuinely help.",
        },
      ],
      portable: ["What does this actually establish?", "What does it NOT establish?", "What's the narrowest true thing?"],
      myPlaysTemplate: {
        when: "a dating letdown starts becoming a statement about me",
        move: "ask what it actually establishes, and what it can't prove",
        lookingFor: "the narrowest true thing I can honestly say",
        watchOut: "flipping to ‘their loss,’ denying it hurt, or turning a pattern into ‘I'm broken’",
        remember: "a painful outcome can be real without becoming a definition of me",
      },
      fidelity: {
        correct: "Your conclusion stays close to the actual event, doesn't expand one choice into a universal truth, and doesn't require you to feel better.",
        misuse: [
          "Positive spin (‘their loss’) — aim for true, not flattering.",
          "Denying it hurt — you can care and still bound the conclusion.",
          "Turning a real pattern into ‘I'm broken’ — keep the pattern, drop the verdict.",
          "Diagnosing them (‘they're avoidant’) — stay with what the evidence supports.",
        ],
        notMeaning: "This isn't positive thinking, self-esteem boosting, or pretending rejection doesn't hurt.",
      },
      supportSignposts: [
        {
          id: "severe-self-worth",
          heading: "If this is bigger than a dating moment",
          body:
            "This Play is built for the sting of a specific dating moment. If what you're feeling is a belief about yourself that follows you everywhere, or has been heavy for a long time, that's real — and it deserves more than a dating tool. Talking it through with a mental health professional can genuinely help.",
        },
      ],
      routing: { toPlayId: "read-and-decide", label: "That pattern's worth looking at → Read It, Then Decide" },
      outputEditor: {
        heading: "Update your bounded conclusion",
        fields: [{ id: "narrowest_true_thing", label: "The narrowest true thing", input: "text", placeholder: "the narrowest true thing the evidence supports" }],
      },
    },

    // -------------------------------------------------------------------------
    // IS THIS RIGHT FOR YOU?  (dualAttention vertical slice)
    // -------------------------------------------------------------------------
    ITR_PLAY,

    // -------------------------------------------------------------------------
    // REST, OR GIVING UP?  (decisionRoom vertical slice)
    // -------------------------------------------------------------------------
    RGU_PLAY,

    // -------------------------------------------------------------------------
    // HOW MUCH TO PUT IN?  (investmentView vertical slice)
    // -------------------------------------------------------------------------
    HMP_PLAY,

    // -------------------------------------------------------------------------
    // SAY THE REAL THING  (communicationRehearsal vertical slice)
    // -------------------------------------------------------------------------
    STT_PLAY,
  ],
};
