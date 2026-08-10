// Cluster 1 "Difficulty Feeling Chosen" — consumer playbook "Moving Beyond Rejection".
// Consumer copy written at ~5th-grade reading level: short sentences, plain words.
// Authored content (Phase 5/5B). All six Cluster-1 Plays + Experiences are now built:
// the two original (read-and-decide, what-it-actually-means) plus the four approved slices
// (is-this-right-for-you, rest-or-giving-up, how-much-to-put-in, say-the-real-thing). Each slice
// lives in its own file and is spread in below; all behind PLAYBOOK_REV3_ENABLED.

import type { PlaybookContent } from "@/lib/playbook/contentSchema";
import { MBR_LITERATURE, MBR_STATEMENT_MAP } from "@/content/playbook/finding-love-that-feels-mutual-literature";
import { MBR_SIMULATIONS } from "@/content/playbook/finding-love-that-feels-mutual-simulations";
import { MBR_MISSIONS } from "@/content/playbook/finding-love-that-feels-mutual-missions";
import { MBR_USE_REVIEWS } from "@/content/playbook/finding-love-that-feels-mutual-usereviews";
import { ITR_PLAY, ITR_SIMULATION, ITR_JIT } from "@/content/playbook/is-this-right-for-you";
import { RGU_PLAY, RGU_SIMULATION, RGU_JIT } from "@/content/playbook/rest-or-giving-up";
import { HMP_PLAY, HMP_SIMULATION, HMP_JIT } from "@/content/playbook/how-much-to-put-in";
import { STT_PLAY, STT_SIMULATION, STT_JIT } from "@/content/playbook/say-the-real-thing";

// User-choice investment/decision actions for Read & Decide (shared by the rule
// builder and the Update editor). Non-gamey: never mirroring/scorekeeping/deadlines.
const RD_ACTIONS = [
  "keep watching a little longer",
  "just ask them",
  "keep things the same for now",
  "put in a little more",
  "put in a little less for now",
  "stop giving extra that isn't coming back",
  "let it show me more",
  "step away",
  "come back to this soon",
];
const RD_CONTROL_CHECK =
  "This is about what you choose to do, based on what you see. It's not a way to make them chase you. And it's not a deadline.";

export const MOVING_BEYOND_REJECTION: PlaybookContent = {
  playbookKey: "finding-love-that-feels-mutual",
  playbookVersion: 1,
  // The consumer name comes from the Experience Clusters workbook and must match
  // snapshot_clusters.playbook_subtitle, which is what the results page shows
  // when it recommends this playbook. The KEY stays "finding-love-that-feels-mutual":
  // it is the stable identifier in URLs, purchases and progress records, and
  // renaming it would strand everything already pointing at it.
  displayName: "Finding Love That Feels Mutual",
  // Rev 3 Understand layer (Step 3) — additive; consumed by the flag-gated field
  // guide, not by the v0 delivery path.
  literature: [...MBR_LITERATURE, ...ITR_JIT, ...RGU_JIT, ...HMP_JIT, ...STT_JIT],
  statementMap: MBR_STATEMENT_MAP,
  simulations: [...MBR_SIMULATIONS, ITR_SIMULATION, RGU_SIMULATION, HMP_SIMULATION, STT_SIMULATION],
  missions: MBR_MISSIONS,
  useReviews: MBR_USE_REVIEWS,
  opening: {
    title: "Finding Love That Feels Mutual",
    body: [
      "Wanting to be chosen is human. Everyone wants to feel wanted. That part is fine.",
      "The trouble starts when being chosen takes over. It can shape how you see yourself. It can change how you read a date, how you act, how much you give, and what you do next.",
      "The goal here isn't to make you easier to pick. It's to keep the fear of not being chosen from running your dating life.",
      "This looks different for different people. You won't work on all of it. Next, tap what sounds like you. Then pick where to start.",
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
      headline: "When things don't work out, I start to wonder what's wrong with me.",
      secondaryExamples: ["“I think I'm the problem.”", "“Maybe I'm not enough.”"],
    },
    {
      id: "rec-selection",
      role: "route",
      pathwayPlayId: "is-this-right-for-you", // built (dualAttention slice)
      headline: "I spend more time wondering if they want me than asking if I want them.",
      secondaryExamples: ["“I feel like the backup option.”", "“I feel like I'm waiting to be picked.”"],
    },
    {
      id: "rec-evidence",
      role: "route",
      pathwayPlayId: "read-and-decide",
      headline: "I can't always tell what someone's really doing — or when to stay, ask, slow down, or leave.",
      secondaryExamples: ["“I don't know if we're just friends.”", "“I don't know when to walk away.”", "“They give me just enough to keep me around.”"],
    },
    {
      id: "rec-over-invest",
      role: "route",
      pathwayPlayId: "how-much-to-put-in", // built (investmentView slice)
      headline: "I keep giving more, even when I'm not getting much back.",
      secondaryExamples: ["“I always care more than they do.”", "“I'm tired of being almost enough.”"],
    },
    {
      id: "rec-self-edit",
      role: "route",
      pathwayPlayId: "say-the-real-thing", // built (communicationRehearsal slice)
      headline: "I change myself so they'll keep liking me.",
      secondaryExamples: ["“I keep changing myself for other people.”", "“I don't know if people like the real me.”"],
    },
    {
      id: "rec-fatigue",
      role: "route",
      pathwayPlayId: "rest-or-giving-up", // built (decisionRoom slice)
      headline: "I'm worn out by dating. I can't tell if I need a break or I'm just done.",
      secondaryExamples: ["“I don't even want to open the apps again.”", "“I'm so tired of dating.”"],
    },
    {
      id: "rec-loneliness",
      role: "validate",
      pathwayPlayId: null,
      headline: "Honestly, I'm just tired of being alone.",
      validationCopy:
        "Wanting a partner isn't a problem to fix. It's normal. It only matters here if it starts to push your choices. If it does, “Read It, Then Decide” can help.",
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
      positioning: "Tell what you saw from what you're guessing. Then pick a clear next step.",
      recognitionGate: {
        prompt: "I can't always tell what someone really means — or when to stay, ask, slow down, or leave.",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "Right now, one small thing can turn into a big story fast. And the story decides what you do.",
            "This helps you do something else. Tell what you really saw from what you're guessing. Notice what you still don't know. Then pick a clear next step. That way your choice follows what's real — not fear or hope.",
          ],
        },
        {
          kind: "literature",
          l1: "Early dating is unclear. The signs are small and mixed. Your mind fills in the blanks — often with your biggest fear or your biggest hope. That's normal. But when a guess feels like a fact, you react to a story, not a person. Two things help. First, keep what happened apart from what you think it means. Second, decide ahead of time what you'd need to see before you give more. This isn't about being suspicious. It's not about keeping score. It's about giving yourself real facts to work with.",
          l2Heading: "Understand this deeper",
          l2: "When you're not sure, your mind fills the gap with what you expect. Often that's shaped by past hurt. This move slows that step down. You keep what you saw apart from what you think it means. You name what you truly don't know. And you decide up front what would change your mind. It doesn't make anyone like you more. It changes what you're reacting to. Said plainly: these ideas come from real research on how people make plans and read facts. Using them for dating is our best guess. We haven't tested that part yet, and we won't pretend we have.",
        },
        {
          kind: "learn",
          body: [
            "When a letdown starts to feel like a story, put it in three piles:",
            "Saw it — what really happened. Guessing — what you think it means (might be right, still a guess). Don't know yet — what this can't tell you.",
            "Then ask one thing: what would really tell me?",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Try it on someone else first. Put each piece in a pile.",
          situation:
            "You had a great date. It was easy, and they said they'd love to go out again. Over the next four days, their texts got shorter. Then they wrote to set up a plan for next week.",
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
              correction: "That's a guess, not something you saw. The shorter texts are what you saw. What it means is still open.",
            },
            { id: "s4", text: "They set up a plan for next week", correctBucket: "saw" },
            { id: "s5", text: "Whether the short texts are about me, their week, or just how they text", correctBucket: "unknown" },
          ],
          note: "See it? The only sign of “losing interest” is shorter texts. And they just set up a plan. The story ran ahead of the facts.",
          evidenceQuestion: {
            prompt: "What would really tell you?",
            options: ["How they act on the plan they set up", "Reading the old texts again", "Asking a friend what it means"],
          },
        },
        {
          kind: "scenarioSort",
          prompt: "One more. This time it's words vs. actions.",
          situation: "They keep saying they really like you. But they keep dodging real plans.",
          buckets: [
            { id: "saw", label: "Saw it" },
            { id: "guess", label: "Guessing" },
            { id: "unknown", label: "Don't know yet" },
          ],
          items: [
            { id: "w1", text: "They said they really like me", correctBucket: "saw" },
            { id: "w2", text: "They keep dodging real plans", correctBucket: "saw" },
            { id: "w3", text: "They're just scared but really into me", correctBucket: "guess" },
            { id: "w4", text: "Whether their words and their actions line up over time", correctBucket: "unknown" },
          ],
          note:
            "When someone's words and their actions don't line up, that gap tells you something. It doesn't mean their words are fake. It means the gap is worth watching. So keep both: what they say, and what they do.",
          evidenceQuestion: {
            prompt: "What would tell you most?",
            options: ["Whether their words and actions line up over time", "Whether they say nice things next time", "How the next text feels"],
          },
        },
        {
          kind: "ownTurn",
          intro: "Now try one of your own. Keep it to one real thing.",
          fields: [
            { id: "question", label: "What do you really want to know?", input: "text", placeholder: "e.g. Is this going somewhere, or am I making it up?" },
            { id: "saw", label: "Saw it — what really happened", input: "chips" },
            { id: "guessing", label: "Guessing — what you think it means", input: "chips" },
            { id: "unknown", label: "Don't know yet", input: "chips" },
            { id: "evidence", label: "What would really tell you? (one thing)", input: "text" },
          ],
        },
        {
          kind: "sufficiency",
          prompt: "Do you already have enough to answer your question?",
          enoughLabel: "I already have enough — let me decide",
          needMoreLabel: "I need more info first",
          needMoreIntro:
            "Good. “I need more info” is a real answer. Name the one thing that would help most. That keeps it from turning into waiting forever.",
          needToKnowLabel: "What do I still need to know?",
          observableLabel: "What could I see that would answer it?",
        },
        {
          kind: "ruleBuilder",
          intro: "Now make it a plan. Decide now, so you're not choosing later from fear or hope.",
          conditionLabel: "If I see… (the thing you'll watch for)",
          thenLabel: "…then I will",
          actions: RD_ACTIONS,
          controlCheck: RD_CONTROL_CHECK,
        },
        { kind: "output", heading: "Your read and plan", body: "Here's what you've got. Keep it, or save it to My Plays." },
        {
          kind: "portable",
          heading: "Take it with you",
          steps: [
            "What did I really see?",
            "What am I guessing?",
            "What don't I know yet?",
            "What would tell me?",
            "If I see ___, I'll ___.",
          ],
        },
        {
          kind: "realWorldUse",
          useWhen:
            "a text, or a change in how they act, starts turning into a story — or when you're not sure whether to stay, ask, ease off, or leave.",
          doThis: "Run the five lines before you react. Then watch for the one thing that would really tell you.",
          safetyNote:
            "If what you're “waiting to be sure about” is whether someone is treating you badly or unsafely — you don't need more proof. Trust it.",
        },
      ],
      portable: [
        "What did I really see?",
        "What am I guessing?",
        "What don't I know yet?",
        "What would tell me?",
        "If I see ___, I'll ___.",
      ],
      myPlaysTemplate: {
        when: "a small thing turns into a story, or I'm stuck on whether to keep going",
        move: "saw it / guessing / don't know / what would tell me → if ___, then ___",
        lookingFor: "the one thing that would really answer my question",
        watchOut: "treating a guess like a fact; making it a deadline or a test",
        remember: "decide from what I see, not from fear or hope",
      },
      fidelity: {
        correct: "You kept “saw it” apart from “guessing.” You named a real “don't know.” And your plan uses something you can see, plus your own choice.",
        misuse: [
          "Putting clear, repeated behavior under “don't know” so you don't have to decide.",
          "A plan that's really a countdown, or a way to make them chase you.",
        ],
        notMeaning: "This isn't about playing it cool, keeping score, testing them, or being 100% sure before you act.",
      },
      outputEditor: {
        heading: "Update your read and plan",
        fields: [
          { id: "evidence", label: "What would tell you?", input: "text" },
          { id: "rule", label: "Your plan", input: "rule", actions: RD_ACTIONS, controlCheck: RD_CONTROL_CHECK },
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
      positioning: "Tell what happened apart from what it says about you.",
      recognitionGate: {
        prompt: "When something doesn't work out, it starts to feel like something's wrong with me — like this is just how it'll always go.",
      },
      screens: [
        {
          kind: "shift",
          body: [
            "When a date or a relationship ends, your mind can do something quick and unfair. It takes one thing that happened and turns it into a verdict about you. One person's “no” becomes “I'm not enough.”",
            "This Play helps you keep the story the size of the facts. A hard moment stays a hard moment. It doesn't become who you are. It won't take the hurt away. It just stops the hurt from writing a story the facts don't back up.",
          ],
        },
        {
          kind: "literature",
          l1: "Getting turned down hurts. So does watching something fade. That's not a flaw — it means you care. But one step happens fast. One event (“this didn't work with this person”) grows into a big claim (“I'm unlovable”). The claim feels true because it hurts. But hurt isn't proof. This isn't about happy thoughts. And it's not about pretending you don't care. It's one honest question: what does this really show — and what does it not?",
          l2Heading: "Understand this deeper",
          l2: "When something hurts, your mind tends to explain it in the biggest way. It says the problem is all of you, and it'll always be true. Taking a small step back helps you see it more clearly. It doesn't make anyone want you. It doesn't erase the hurt. It just keeps the story the right size, so your next move fits the facts. A real, repeating pattern is worth a look — keep that. But “I'm unlovable” is a verdict a pattern can't prove. Said plainly: these ideas come from real research on how people handle painful events. Using them for dating is our best guess. We haven't tested that part yet, and we won't pretend we have.",
        },
        {
          kind: "learn",
          body: [
            "When a letdown starts to feel like a verdict, ask three things:",
            "What does this really show? What does it NOT show? What's the smallest true thing I can say?",
            "The trick is to keep “this happened” apart from “this is who I am.” Let's try one first.",
          ],
        },
        {
          kind: "scenarioSort",
          prompt: "Sort each one. Does the event back it up, or can it not prove it?",
          situation: "After a few good dates, they said: “I had a great time, but I don't think we're a match.”",
          thought: "And the thought that showed up: “Something must be wrong with me.”",
          buckets: [
            { id: "supports", label: "This event supports this" },
            { id: "cant", label: "This event can't prove this" },
          ],
          items: [
            { id: "a1", text: "This person didn't want to keep dating me", correctBucket: "supports" },
            { id: "a2", text: "We weren't a match for them", correctBucket: "supports" },
            { id: "a3", text: "I'm not enough", correctBucket: "cant", correction: "That's the story, not the evidence. What did the event really show? That this one person didn't want to keep going. The rest is the jump we're catching." },
            { id: "a4", text: "No one will ever choose me", correctBucket: "cant" },
            { id: "a5", text: "Something is wrong with me", correctBucket: "cant" },
          ],
          note: "A hint on each: is this about this one person, or everyone? This time, or forever? What happened, or who you are?",
        },
        {
          kind: "scenarioSort",
          prompt: "This one stings. Going quiet on someone isn't kind. We're only checking the big claim.",
          situation: "Someone you were really into just… stopped writing back. No reason given.",
          thought: "Thought: “I'm forgettable. Nobody ever stays.”",
          buckets: [
            { id: "supports", label: "This event supports this" },
            { id: "cant", label: "This event can't prove this" },
          ],
          items: [
            { id: "b1", text: "They stopped writing back", correctBucket: "supports" },
            { id: "b2", text: "It was rude, and it stung", correctBucket: "supports" },
            { id: "b3", text: "I'm forgettable", correctBucket: "cant" },
            { id: "b4", text: "Nobody ever stays", correctBucket: "cant", correction: "“Nobody” and “ever” are the jump. One person going quiet can't prove a rule about everyone." },
          ],
          note: "Your feelings are fair. We're only checking the big claim, not the hurt.",
        },
        {
          kind: "scenarioSort",
          prompt: "This one's different. There may be a real pattern. We won't tell you it's fake. Two things are mixed up — sort them.",
          situation: "The last three people you liked slowly pulled away.",
          thought: "Thought: “This keeps happening because I'm unlovable.”",
          buckets: [
            { id: "supports", label: "An observation to keep" },
            { id: "cant", label: "A verdict to drop" },
          ],
          items: [
            { id: "c1", text: "The last three people I liked pulled away", correctBucket: "supports" },
            { id: "c2", text: "Because I'm unlovable", correctBucket: "cant", correction: "That's a big claim the pattern can't prove. Keep what you saw. Drop the verdict." },
          ],
          note: "Keep what you saw. Drop the verdict. A real pattern is worth a look — on its own, as facts.",
        },
        {
          kind: "ownTurn",
          intro: "Now one of yours. Keep it to one real thing — not your whole life.",
          fields: [
            { id: "event", label: "What happened?", input: "text", placeholder: "one real event" },
            { id: "conclusion", label: "What did you turn it into?", input: "text", placeholder: "what you turned it into" },
            { id: "establishes", label: "What does it really show?", input: "chips" },
            { id: "notEstablishes", label: "What does it NOT show?", input: "chips", suggestions: ["about everyone", "forever", "who I am"] },
          ],
        },
        {
          kind: "sentenceBuilder",
          label: "The smallest true thing",
          helper: "Build it from what the event really shows. Keep it true, not nice.",
        },
        {
          kind: "emotionBeat",
          body: [
            "Keeping the story small doesn't mean you're fine. It doesn't mean you didn't want it. It doesn't mean it didn't matter.",
            "You can hold both: your smallest true thing — and this can still hurt. You just did the hard part. You kept the fact and dropped the verdict.",
          ],
        },
        { kind: "output", heading: "Your smallest true thing", body: "Keep it, or save it to My Plays." },
        {
          kind: "portable",
          heading: "Take it with you",
          steps: ["What does this really show?", "What does it NOT show?", "What's the smallest true thing?"],
        },
        {
          kind: "realWorldUse",
          useWhen: "a letdown starts to feel like a fact about you — “what's wrong with me,” “this always happens,” “I'm not enough.”",
          doThis: "Ask the three questions before the story sets. Keep the fact. Drop the verdict. Keep the feeling.",
          safetyNote:
            "If this feels bigger than one dating moment — like a belief about yourself that follows you everywhere, or something heavy for a long time — that's real. It deserves more than a dating tool. Talking with a mental health professional can really help.",
        },
      ],
      portable: ["What does this really show?", "What does it NOT show?", "What's the smallest true thing?"],
      myPlaysTemplate: {
        when: "a letdown starts to feel like a fact about me",
        move: "ask what it really shows, and what it can't prove",
        lookingFor: "the smallest true thing I can honestly say",
        watchOut: "spinning it to “their loss,” saying it didn't hurt, or turning a pattern into “I'm broken”",
        remember: "a painful thing can be real without being who I am",
      },
      fidelity: {
        correct: "Your smallest true thing stays close to what happened. It doesn't turn one “no” into a rule about everyone. And it doesn't need you to feel better.",
        misuse: [
          "Spinning it into “their loss.” Aim for true, not nice.",
          "Saying it didn't hurt. You can care and still keep the story small.",
          "Turning a real pattern into “I'm broken.” Keep the pattern. Drop the verdict.",
          "Judging them (“they're just avoidant”). Stick to what you really know.",
        ],
        notMeaning: "This isn't positive thinking, a self-esteem pep talk, or pretending it doesn't hurt.",
      },
      supportSignposts: [
        {
          id: "severe-self-worth",
          heading: "If this is bigger than a dating moment",
          body:
            "This Play is for the sting of one dating moment. If what you feel is a belief about yourself that follows you everywhere — or something that's been heavy a long time — that's real. It deserves more than a dating tool. Talking with a mental health professional can really help.",
        },
      ],
      routing: { toPlayId: "read-and-decide", label: "That pattern's worth looking at → Read It, Then Decide" },
      outputEditor: {
        heading: "Update your smallest true thing",
        fields: [{ id: "narrowest_true_thing", label: "The smallest true thing", input: "text", placeholder: "the smallest true thing the facts support" }],
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
