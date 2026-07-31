// Cluster 1 vertical slice — "Rest, or Giving Up?" (decisionRoom).
// Play + Experience simulation + JIT literature, authored from the approved specs
// (cluster-1-play-spec-rest-or-giving-up-v1.md, cluster-1-experience-graph-rest-or-giving-up-v1.md).
// No other person in this tool. Flag-gated via ExperienceShell.

import type { Play, Simulation, LiteratureEntry } from "@/lib/playbook/contentSchema";

export const RGU_PLAY_ID = "rest-or-giving-up";
export const RGU_SIM_ID = "sim-rgu-decision-room";

const STANCE_SUGGESTIONS = [
  "Rest — set it down for a while",
  "Not now — not dating right now",
  "Lightly open — around, not pursuing",
  "Come back later, on my terms",
  "Not deciding yet — let it settle",
];

// ---- Play ---------------------------------------------------------------------
export const RGU_PLAY: Play = {
  playId: RGU_PLAY_ID,
  playVersion: 1,
  outputSchemaVersion: 1,
  name: "Rest, or Giving Up?",
  positioning: "Choose an intentional, revisitable stance toward dating right now — instead of letting a hard week decide.",
  recognitionGate: {
    prompt: "When dating gets heavy, a hard week can quietly decide I'm done — instead of me choosing on purpose.",
  },
  screens: [
    {
      kind: "shift",
      body: [
        "When dating gets heavy, a hard week or a rough date can quietly settle the question — “I'm done” — before you've actually chosen anything.",
        "This helps you choose your stance toward dating on purpose, just for right now, and keep it something you can revisit. Resting counts. Not-now counts. Not deciding yet counts.",
      ],
    },
    {
      kind: "literature",
      l1: "Dating fatigue, discouragement, loneliness, dread — these are common, and none of them is a verdict on you or on how it'll go. What's worth catching is the moment a hard feeling quietly turns into a forever conclusion: 'it's never going to happen,' 'I'll always be the one not chosen.' That's a forever question being answered with today's feeling. You can honor the feeling and still keep it separate from what you actually want to decide — which is only ever 'for right now.' Choosing to rest, to step back, to stay lightly open, to come back later, or simply not to decide yet from a low moment — these are all real, equal choices, and every one of them is yours to change. Rest isn't giving up, and a break isn't a failure.",
    },
    {
      kind: "learn",
      body: [
        "Three quick moves:",
        "Name what's true right now — tired, discouraged, lonely, flat. No fixing, just naming.",
        "Notice if a feeling is trying to make a forever decision — and set that part aside; you're only choosing for now.",
        "Choose your stance for right now — rest, not now, lightly open, come back later, or not deciding yet. All of them count, and you can change your mind.",
      ],
    },
    {
      kind: "scenarioSort",
      prompt: "Quick sort. Which is which?",
      situation: "A few thoughts that show up on a low dating night.",
      buckets: [
        { id: "feeling", label: "A feeling, right now" },
        { id: "forever", label: "A forever conclusion" },
        { id: "stance", label: "A stance I could choose" },
      ],
      items: [
        { id: "s1", text: "I'm wiped out by the apps right now.", correctBucket: "feeling" },
        {
          id: "s2",
          text: "It's never going to happen for me.",
          correctBucket: "forever",
          correction: "That's a forever conclusion showing up in a discouraged moment — it answers a forever question with tonight's feeling. You don't have to call it forever.",
        },
        { id: "s3", text: "I'm setting this down for a month, then I'll see how I feel.", correctBucket: "stance" },
        {
          id: "s4",
          text: "I'll always be the one who doesn't get chosen.",
          correctBucket: "forever",
          correction: "A hard stretch, spoken as 'always.' That's a big word for one rough patch — you're allowed to leave it open even when it doesn't feel open.",
        },
        { id: "s5", text: "I want to stay a little open, without chasing anything.", correctBucket: "stance" },
        { id: "s6", text: "Honestly, I just dread opening the app tonight.", correctBucket: "feeling" },
      ],
      note: "Feelings are real and worth naming — they just aren't decisions. Forever conclusions answer a forever question with today's feeling. A stance is something you choose, for now, and can change.",
      evidenceQuestion: {
        prompt: "Which of these is a choice you get to make on purpose?",
        options: ["A stance I could choose", "A feeling, right now", "A forever conclusion"],
      },
    },
    {
      kind: "emotionBeat",
      body: [
        "Feeling done-for-now tired, or lonely, or discouraged isn't a flaw or a diagnosis — it's a real signal, and it's allowed.",
        "You can honor exactly how it feels and still choose your stance on purpose. Rest is a choice, not a defeat.",
      ],
    },
    {
      kind: "ownTurn",
      intro: "Now you. Just for right now — not forever.",
      fields: [
        { id: "now", label: "Right now, what's most true for you?", input: "text", placeholder: "e.g. I'm tired of the apps, and the last date stung" },
        { id: "stance", label: "For right now, what do you want to choose?", input: "text", suggestions: STANCE_SUGGESTIONS, placeholder: "pick one, or say it your way" },
        { id: "reentry", label: "Optional: what would make coming back feel right? (Only if you want to — you don't have to name this.)", input: "text", placeholder: "leave blank if you'd rather not" },
      ],
    },
    { kind: "output", heading: "Your Stance, For Now", body: "Here's what you've chosen — for right now, and yours to change. Keep it, or save it to My Plays." },
    {
      kind: "portable",
      heading: "Take it with you",
      steps: [
        "What's true right now?",
        "Is a feeling trying to make a forever decision?",
        "What do I want to choose — just for now?",
        "Rest counts. I can revisit this anytime.",
      ],
    },
    {
      kind: "realWorldUse",
      useWhen: "the apps feel like a chore, or a letdown has you ready to call it forever.",
      doThis: "Choose a stance for right now, on purpose — rest included — and let it be something you can revisit.",
      safetyNote: "If the heaviness is bigger than dating — following you everywhere, for a long time, or you're not sure you want to be here — that deserves more than a dating tool. Talking with a mental health professional can help, and support is available.",
    },
  ],
  portable: [
    "What's true right now?",
    "Is a feeling trying to make a forever decision?",
    "What do I want to choose — just for now?",
    "Rest counts. I can revisit this anytime.",
  ],
  myPlaysTemplate: {
    when: "dating feels heavy and I catch myself concluding it's never going to happen",
    move: "name what's true now, separate the feeling from the decision, choose a stance for now (rest included)",
    lookingFor: "a deliberate, revisitable stance from my present capacity — not a forever verdict",
    watchOut: "letting a low moment make a forever decision; treating rest as failure",
    remember: "rest is a real choice; a break isn't giving up; I can revisit anytime",
  },
  fidelity: {
    correct: "You chose an intentional stance for now and kept it revisitable.",
    misuse: [
      "Treating a break as failure, or forcing yourself back to dating to prove something.",
      "Reading a forever verdict off one discouraged night.",
    ],
    notMeaning: "This isn't quitting, and it isn't a diagnosis. Rest and staying open are equally valid.",
  },
  outputEditor: {
    heading: "Update your stance",
    fields: [
      { id: "stance", label: "Your stance for now", input: "text" },
      { id: "reentry", label: "What would make coming back feel right? (optional)", input: "text" },
    ],
  },
};

// ---- Experience simulation (decisionRoom) — no other person -------------------
export const RGU_SIMULATION: Simulation = {
  id: RGU_SIM_ID,
  version: 1,
  simulationSchemaVersion: 1,
  playId: RGU_PLAY_ID,
  signature: "decisionRoom",
  startNodeId: "rgu-n1",
  nodes: [
    { id: "rgu-n1", kind: "moment", jitLiteratureId: "lit-jit-fatigue-not-verdict", body: ["The app pings — a new match, or just the icon sitting there on your screen. You look at it for a second and feel… tired. Not heartbroken. Just done-for-now tired. Another week, another round of this."], next: "rgu-c1" },
    {
      id: "rgu-c1",
      kind: "decision",
      jitLiteratureId: "lit-jit-loneliness-signal",
      prompt: "Right now, what's most true?",
      options: [
        { id: "rest", label: "I need a rest.", feedback: ["That's allowed."], next: "rgu-note-ack" },
        { id: "not-now", label: "I don't want to date right now.", feedback: ["That's a complete answer."], next: "rgu-note-ack" },
        { id: "discouraged", label: "I'm just discouraged — that last one stung.", feedback: ["Makes sense."], next: "rgu-note-ack" },
        { id: "lightly", label: "I want to stay a little open, without actively pursuing anything.", feedback: ["Real stance."], next: "rgu-note-ack" },
        { id: "later", label: "I might come back to it later, when it's on my terms.", feedback: ["Also allowed."], next: "rgu-note-ack" },
        { id: "forever", label: "Honestly? I'm done. It's never going to happen for me.", signal: "forever_read", feedback: ["Let's slow that one down."], next: "rgu-note-forever" },
      ],
    },
    { id: "rgu-note-ack", kind: "note", body: ["That's a real read, and it's yours to have. Nothing here is going to nudge you back toward dating — the only thing we're doing is making sure it's you deciding, and not just the tired."], next: "rgu-c2" },
    { id: "rgu-note-forever", kind: "note", jitLiteratureId: "lit-jit-rest-not-giving-up", body: ["That's a forever conclusion showing up in a discouraged moment — and the feeling is real. Notice it's answering a forever question with tonight's feeling. You don't have to call it forever right now."], next: "rgu-r1" },
    {
      id: "rgu-r1",
      kind: "reconsider",
      prompt: "So — is this something you want to decide right now, or a feeling you want to let settle first? Both are fine.",
      options: [
        { id: "decide-now", label: "I want to decide something — just for now.", signal: "distinguished", next: "rgu-c2" },
        { id: "let-settle", label: "I want to let the feeling settle before I decide anything.", signal: "distinguished", next: "rgu-note-settle" },
        { id: "hold-forever", label: "Honestly, it doesn't feel like just-for-now — it feels like it's just not going to happen.", signal: "held_forever", next: "rgu-note-hold-forever" },
      ],
    },
    { id: "rgu-note-settle", kind: "note", body: ["Letting it settle is a decision too. You can set the whole question down for now and come back to it when your head's clearer. Nothing's expiring."], next: "rgu-c2" },
    { id: "rgu-note-hold-forever", kind: "note", body: ["Okay — you don't have to talk yourself out of how it feels tonight. Just one thing to hold: “never” is a big word for one hard stretch. You're allowed to leave it open even if it doesn't feel open right now. Nothing you pick here is permanent."], next: "rgu-c2" },
    {
      id: "rgu-c2",
      kind: "decision",
      prompt: "For right now — not forever — what do you want to do?",
      options: [
        { id: "rest", label: "Rest. I'm setting it down for a while.", signal: "stance:rest", feedback: [], next: "rgu-note-rest" },
        { id: "not-now", label: "Not now. I don't want to date right now.", signal: "stance:not_now", feedback: [], next: "rgu-note-notnow" },
        { id: "lightly", label: "Stay lightly open — around, without actively pursuing right now.", signal: "stance:lightly_open", feedback: [], next: "rgu-note-lightly" },
        { id: "later", label: "Come back to it later, on conditions I choose.", signal: "stance:return_later", feedback: [], next: "rgu-note-return" },
        { id: "pause", label: "I'm not deciding yet — I want to let it settle.", signal: "stance:pause_decision", feedback: [], next: "rgu-note-pause" },
      ],
    },
    { id: "rgu-note-rest", kind: "note", body: ["Rest is a real choice, not giving up. Setting it down for a while isn't a failure — it's you deciding, for your own reasons, that now isn't the time. You can pick it back up whenever you want."], next: "rgu-reveal" },
    { id: "rgu-note-notnow", kind: "note", body: ["“Not now” is a complete answer. You don't owe the apps — or anyone — a reason. It stays your call, and you can change it whenever you want."], next: "rgu-reveal" },
    { id: "rgu-note-lightly", kind: "note", body: ["Lightly open is a real stance, not a lukewarm one — open to what comes, without actively pursuing anything right now. That's a perfectly good place to be."], next: "rgu-reveal" },
    { id: "rgu-note-return", kind: "note", body: ["Later, on your terms — the door stays open, on conditions you'll set when the time feels right. Nothing to pin down tonight."], next: "rgu-reveal" },
    { id: "rgu-note-pause", kind: "note", body: ["Letting it settle it is. You've chosen not to decide from a low moment — which is its own kind of steady. Come back to it whenever you want."], next: "rgu-reveal" },
    {
      id: "rgu-reveal",
      kind: "reveal",
      label: "Where you landed",
      body: [
        "Here's where you landed — on purpose, for now, and yours to change. Not giving up, not a failure, not forever unless you decide it is — a decision you made from where you actually are, and you can revisit it anytime.",
      ],
      computedSummary: {
        resolver: "decisionRoomStance",
        variants: {
          rest: "Rest — you're setting dating down for a while.",
          not_now: "Not now — you're not dating right now. That's a complete choice for now.",
          lightly_open: "Lightly open — around, without actively pursuing right now.",
          return_later: "Later, on your terms — the door's open on conditions you choose.",
          pause_decision: "Not deciding yet — you're letting a low moment settle before you call anything.",
        },
      },
      next: "rgu-teach",
    },
    { id: "rgu-teach", kind: "teach", body: ["Out in real life, this is the tool: when dating feels heavy, make the call on purpose — from your capacity and what you actually want — instead of letting a hard week decide for you. Whatever you choose, including setting it down, is yours, and it's revisitable. Here's the Play."], toPlayId: RGU_PLAY_ID },
  ],
};

// ---- JIT literature (Exposure only) -------------------------------------------
export const RGU_JIT: LiteratureEntry[] = [
  {
    id: "lit-jit-fatigue-not-verdict",
    version: 1,
    scope: "jit",
    anchor: "rgu.entry",
    title: "Dating fatigue isn't a verdict",
    body: [
      { kind: "paragraph", body: ["Getting tired of dating is common, and it doesn't say anything about whether it'll work out for you or what you're worth. Fatigue is a signal that you're running low — not a conclusion about the future."] },
      { kind: "guardrail", body: ["Let 'I'm tired' be exactly that. It doesn't have to become 'it's never going to happen.'"] },
    ],
  },
  {
    id: "lit-jit-loneliness-signal",
    version: 1,
    scope: "jit",
    anchor: "rgu.state",
    title: "Loneliness is a signal, not a diagnosis",
    body: [
      { kind: "paragraph", body: ["Loneliness is a normal human signal — it points at a real need for connection. It isn't a flaw, and it isn't a verdict on how lovable or dateable you are."] },
      { kind: "guardrail", body: ["You can feel lonely and still choose rest. The feeling is real; it just doesn't get to make the decision for you."] },
    ],
  },
  {
    id: "lit-jit-rest-not-giving-up",
    version: 1,
    scope: "jit",
    anchor: "rgu.forever",
    title: "Rest is not giving up",
    body: [
      { kind: "paragraph", body: ["Setting dating down for a while is a choice you make on purpose — not a failure, and not a permanent verdict. Rest, not-now, and staying lightly open are all real stances, and every one of them is yours to revisit."] },
      { kind: "guardrail", body: ["“Never” is a big word for one hard stretch. You can decide something just for now, and change it later."] },
    ],
  },
];
