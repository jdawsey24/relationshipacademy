// Cluster 1 vertical slice — "Say the Real Thing" (communicationRehearsal).
// Play + Experience simulation + JIT literature, authored from the approved specs
// (cluster-1-play-spec-say-the-real-thing-v1.md, cluster-1-experience-graph-say-the-real-thing-v1.md).
// Strictly R1 / low-risk. The reader's choice never controls the reaction. Flag-gated.

import type { Play, Simulation, LiteratureEntry, SimOption } from "@/lib/playbook/contentSchema";

export const STT_PLAY_ID = "say-the-real-thing";
export const STT_SIM_ID = "sim-stt-rehearsal";

// ---- Play ---------------------------------------------------------------------
export const STT_PLAY: Play = {
  playId: STT_PLAY_ID,
  playVersion: 1,
  outputSchemaVersion: 1,
  name: "Say the Real Thing",
  positioning: "Say the genuine preference, opinion, or small request clearly and kindly — and treat the response as information, not a grade.",
  recognitionGate: {
    prompt: "I smooth myself over — agree, soften, or apologize — to stay likable, instead of saying the real thing.",
  },
  screens: [
    {
      kind: "shift",
      body: [
        "In small moments, it's easy to smooth yourself over — agree, soften, or apologize — to keep things nice, and let the real thing disappear.",
        "This helps you say the real thing clearly and kindly, and treat what comes back as information about whether you fit — not a verdict on you.",
      ],
    },
    {
      kind: "literature",
      l1: "Editing yourself to stay likable — agreeing when you don't, softening a preference until it's gone, apologizing for having one — is a common reflex, especially when you like someone. The catch is that smoothing yourself over leaves you with nothing to learn: their response only tells you something if you actually said the real thing. Saying it — clearly and kindly — isn't a risk to manage; it's how you find out whether this fits. And success isn't whether they liked it. A range of reactions is normal, and none of them is a failure — each is just information about how this person meets a real, small thing from you. This is for low-risk moments: preferences, opinions, small requests. Higher-stakes or unsafe conversations aren't what this tool is for.",
    },
    {
      kind: "learn",
      body: [
        "Three quick moves:",
        "Name the real thing — the preference, opinion, or small request.",
        "Say it clearly and kindly — no disappearing act, no apology tax.",
        "Let their answer be information — about fit, not a verdict on you. You don't control how it lands, and that's fine.",
      ],
    },
    {
      kind: "scenarioSort",
      prompt: "Quick sort. They suggested 8pm; you'd honestly rather do earlier. Which of these says the real thing?",
      situation: "They suggested meeting at 8. You'd genuinely rather do earlier — you're wiped by 8 on a weeknight.",
      buckets: [
        { id: "clear", label: "Says the real thing" },
        { id: "buried", label: "Buries it in apology" },
        { id: "erased", label: "Smooths it over" },
      ],
      items: [
        { id: "s1", text: "“Sure, 8 works!”", correctBucket: "erased" },
        { id: "s2", text: "“Could we do earlier? 8's a stretch for me on a weeknight.”", correctBucket: "clear" },
        { id: "s3", text: "“Maybe-ish? Whatever's easiest for you, honestly.”", correctBucket: "erased" },
        {
          id: "s4",
          text: "“Sorry, I know this is so annoying — maybe earlier? Only if that's totally fine!”",
          correctBucket: "buried",
          correction: "The real thing's in there — you just paid an apology tax for it. It can stand without the sorry.",
        },
        { id: "s5", text: "“I'd like to do earlier — I'm wiped by 8.”", correctBucket: "clear" },
      ],
      note: "Only one kind actually says it plainly. 'Smoothing it over' leaves you with nothing to learn; 'burying it in apology' says it but half-takes it back. Clear and kind is the move.",
      evidenceQuestion: {
        prompt: "What are you actually trying to find out by saying the real thing?",
        options: ["Something about whether we fit", "Whether they'll like me", "Whether I can dodge the awkwardness"],
      },
    },
    {
      kind: "ownTurn",
      intro: "Now a small, low-risk moment of yours — the kind where you'd usually smooth yourself over.",
      fields: [
        { id: "moment", label: "The moment — a plan, an opinion, or a small request.", input: "text", placeholder: "e.g. they want the loud bar; I'd rather somewhere quieter" },
        { id: "real", label: "What's the real thing you'd want to say?", input: "text" },
      ],
    },
    {
      kind: "sentenceBuilder",
      label: "Say it — one clear, kind sentence. No disappearing act, no apology tax.",
      helper: "The real thing, plainly. This is the sentence you can actually use — their answer will be information about fit, not a verdict on you.",
    },
    { kind: "output", heading: "Your Real Thing", body: "Here's the sentence you'd use — clear and kind. Keep it, or save it to My Plays." },
    {
      kind: "portable",
      heading: "Take it with you",
      steps: [
        "What's the real thing?",
        "Say it — clear and kind",
        "No disappearing act, no apology tax",
        "Their answer is information about fit, not a verdict on me.",
      ],
    },
    {
      kind: "realWorldUse",
      useWhen: "a low-risk moment where you're tempted to smooth yourself over — a plan, an opinion, a small request.",
      doThis: "Say the real thing clearly and kindly, without burying it in apology or explanation.",
      safetyNote: "For higher-stakes or unsafe conversations, this low-risk tool isn't the right one — those deserve more support.",
    },
  ],
  portable: [
    "What's the real thing?",
    "Say it — clear and kind",
    "No disappearing act, no apology tax",
    "Their answer is information about fit, not a verdict on me.",
  ],
  myPlaysTemplate: {
    when: "I notice myself about to agree / soften / apologize to stay likable",
    move: "name the real thing, say it clearly and kindly, let their response be information",
    lookingFor: "what I actually prefer/think/need — said plainly",
    watchOut: "vanishing the preference; burying it in apology; grading myself on their reaction",
    remember: "saying it is how I find out about fit; the response isn't a verdict on me",
  },
  fidelity: {
    correct: "You said the genuine thing with enough clarity that it could actually land — without erasing yourself in agreement or apology.",
    misuse: [
      "Measuring success by whether they liked it.",
      "Using it to push high-stakes or confrontational material that belongs in a safer, supported setting.",
    ],
    notMeaning: "This isn't about getting a reaction, scripting lines, or winning — it's saying the real thing and learning from what comes back.",
  },
  outputEditor: {
    heading: "Update your sentence",
    fields: [{ id: "sentence", label: "The real thing you'd say", input: "text" }],
  },
};

// ---- Experience simulation (communicationRehearsal) ---------------------------
// Per moment: SELECT-A-PHRASING (teaching in each option's feedback), then a FIXED spread of
// three labeled hypothetical reactions (shown on every path — decouples expression from outcome).
const phrasingOptions = (opts: { agree: string; soften: string; clear: string; apology: string; next: string }): SimOption[] => [
  { id: "agree", label: opts.agree, signal: "erased", feedback: ["Smooth — and also, nothing happened. When you go along or let it drop, there's nothing real to respond to, so there's nothing to learn. Here's what saying it could have told you →"], next: opts.next },
  { id: "soften", label: opts.soften, signal: "erased", feedback: ["Smooth — and also, nothing happened. When you go along or let it drop, there's nothing real to respond to, so there's nothing to learn. Here's what saying it could have told you →"], next: opts.next },
  { id: "clear", label: opts.clear, signal: "clear", feedback: ["You said it — plainly, and kindly. That's the whole move. Now watch what comes back: whatever it is, it's information about fit, and it's information you only get because you said it."], next: opts.next },
  { id: "apology", label: opts.apology, signal: "buried", feedback: ["You got there — and then spent it on “sorry.” The real thing can stand on its own; it doesn't need the apology wrapped around it. Here's what came back to what you said →"], next: opts.next },
];

export const STT_SIMULATION: Simulation = {
  id: STT_SIM_ID,
  version: 1,
  simulationSchemaVersion: 1,
  playId: STT_PLAY_ID,
  signature: "communicationRehearsal",
  startNodeId: "stt-n1",
  nodes: [
    { id: "stt-n1", kind: "moment", body: ["A few small moments coming up — the kind where it's easy to smooth yourself over to keep things nice. Nothing high-stakes here. Just practice saying the real thing, and seeing what you learn when you do."], next: "stt-m1" },

    // Moment 1 — a plan/time preference
    { id: "stt-m1", kind: "moment", jitLiteratureId: "lit-jit-self-editing", body: ["They suggest meeting at 8. You'd genuinely rather do earlier — you're wiped by 8 on a weeknight. There's a half-second where “sure, 8's fine!” is already forming."], next: "stt-d1" },
    {
      id: "stt-d1",
      kind: "decision",
      prompt: "What do you actually say?",
      options: phrasingOptions({
        agree: "“Sure, 8 works!”",
        soften: "“Maybe-ish? Whatever's easiest for you, honestly.”",
        clear: "“Could we do earlier? 8's a stretch for me on a weeknight.”",
        apology: "“Sorry — I know this is so annoying — it's just, maybe earlier? Only if that's totally fine!”",
        next: "stt-spread1",
      }),
    },
    {
      id: "stt-spread1",
      kind: "reveal",
      label: "Three ways it can land",
      body: ["Here are three ways that can land — you don't control which, and any of them can happen. None is a failure; each is just information about how this person meets a small, real preference."],
      reactions: [
        { label: "It lands easily", example: "“Oh, earlier's better for me too, honestly.”" },
        { label: "They'd prefer otherwise", example: "“I'd rather keep it at 8 — that work for you?”" },
        { label: "They meet you partway", example: "“Hmm, I kind of wanted later — split the difference at 7:30?”" },
      ],
      next: "stt-m2",
    },

    // Moment 2 — a differing opinion
    { id: "stt-m2", kind: "moment", jitLiteratureId: "lit-jit-answer-is-information", body: ["They're raving about a movie they loved — the one you thought was kind of a slog. “Wasn't it amazing? What'd you think?”"], next: "stt-d2" },
    {
      id: "stt-d2",
      kind: "decision",
      prompt: "What do you actually say?",
      options: phrasingOptions({
        agree: "“Yeah, totally — so good!”",
        soften: "“I mean… it was interesting? I can see why people like it.”",
        clear: "“Honestly, it didn't really land for me — I found it kind of slow. Curious what grabbed you, though.”",
        apology: "“Don't hate me! I know everyone loved it — I'm probably wrong — but I didn't totally get it? Sorry.”",
        next: "stt-spread2",
      }),
    },
    {
      id: "stt-spread2",
      kind: "reveal",
      label: "Three ways it can go",
      body: ["Three ways it can go — any of them can happen, and none is a wrong outcome. A different opinion, said plainly and kindly, doesn't blow anything up — it starts a real conversation, and tells you something about how they handle not-agreeing."],
      reactions: [
        { label: "It lands easily", example: "“Ha, fair — it's definitely not for everyone.”" },
        { label: "They'd prefer otherwise", example: "“Really? I could talk about it for an hour — let me defend it.”" },
        { label: "They meet you partway", example: "“Yeah, the pacing's rough — I just loved the ending.”" },
      ],
      next: "stt-m3",
    },

    // Moment 3 — a small request
    { id: "stt-m3", kind: "moment", jitLiteratureId: "lit-jit-kind-and-clear", body: ["You'd genuinely prefer the coffee place near you over the bar across town they suggested — you've got an early start. Easy to just say “the bar's fine.”"], next: "stt-d3" },
    {
      id: "stt-d3",
      kind: "decision",
      prompt: "What do you actually say?",
      options: phrasingOptions({
        agree: "“The bar's fine!”",
        soften: "“Wherever, really — I don't mind, you pick.”",
        clear: "“Would you be up for the coffee place near me instead? I've got an early start.”",
        apology: "“This is so high-maintenance of me, sorry — any chance we could do somewhere near me? Totally fine if not!”",
        next: "stt-spread3",
      }),
    },
    {
      id: "stt-spread3",
      kind: "reveal",
      label: "Three ways it can land",
      body: ["Three ways it can land — you don't pick which, and each is just information. A small, clear request, no apology tax required."],
      reactions: [
        { label: "It lands easily", example: "“Coffee near you? Done — easier for me too.”" },
        { label: "They'd prefer otherwise", example: "“I had my heart set on the bar — could we do your spot next time?”" },
        { label: "They meet you partway", example: "“How about somewhere in the middle so we both travel a bit?”" },
      ],
      next: "stt-reveal",
    },

    {
      id: "stt-reveal",
      kind: "reveal",
      label: "Across those three",
      body: ["Across those three, here's what you did — no grade, no “right” answer. The point was never whether they liked it: every time you said the real thing, you got something back to learn from; every time you smoothed it over, there was nothing to learn."],
      computedSummary: {
        resolver: "communicationRehearsalRecap",
        variants: {
          clear: "You mostly said the real thing — clearly, and without disappearing.",
          mixed: "Some you said straight; some you smoothed over. Both are visible now — that's the useful part.",
          erased: "You leaned toward keeping it smooth. Worth noticing — because smooth is the one that leaves you with nothing to learn.",
        },
      },
      next: "stt-teach",
    },
    { id: "stt-teach", kind: "teach", body: ["Out in real life, the move is one clear sentence — said kindly, without the disappearing act and without the apology tax. You won't control how it lands, and that was never the point: saying it is how you find out. Here's the Play."], toPlayId: STT_PLAY_ID },
  ],
};

// ---- JIT literature (Exposure only) -------------------------------------------
export const STT_JIT: LiteratureEntry[] = [
  {
    id: "lit-jit-self-editing",
    version: 1,
    scope: "jit",
    anchor: "stt.preference",
    title: "Self-editing to stay likable",
    body: [
      { kind: "paragraph", body: ["Agreeing when you don't, softening a preference until it's gone, apologizing for having one — it's a common reflex, especially when you like someone. The cost is quiet: when you smooth yourself over, there's nothing real for them to respond to, so there's nothing to learn."] },
      { kind: "guardrail", body: ["Saying the small real thing isn't a risk to manage — it's how you find out whether this fits."] },
    ],
  },
  {
    id: "lit-jit-answer-is-information",
    version: 1,
    scope: "jit",
    anchor: "stt.opinion",
    title: "A real answer is information, not a risk",
    body: [
      { kind: "paragraph", body: ["A range of reactions is normal, and none of them is a failure. Whatever comes back — glad, different, meeting you partway — is just information about how this person handles a real, small thing from you. The success was never whether they liked it."] },
      { kind: "guardrail", body: ["You don't control how it lands, and you don't need to. Saying it is the whole move."] },
    ],
  },
  {
    id: "lit-jit-kind-and-clear",
    version: 1,
    scope: "jit",
    anchor: "stt.request",
    title: "Kind and clear aren't opposites",
    body: [
      { kind: "paragraph", body: ["You can be warm and still say the real thing plainly — no disappearing act, and no apology tax. A small, clear request doesn't need 'sorry' wrapped around it to be kind."] },
      { kind: "guardrail", body: ["If the real thing gets buried in apology or over-explaining, it half-takes itself back. Let it stand on its own."] },
    ],
  },
];
