// Cluster 1 vertical slice — "Is This Right for You?" (dualAttention).
// Play + Experience simulation + JIT literature, authored from the approved specs
// (artifacts/playbook-experience/cluster-1-play-spec-is-this-right-for-you-v1.md and
//  cluster-1-experience-graph-is-this-right-for-you-v1.md). Flag-gated via ExperienceShell.

import type { Play, Simulation, LiteratureEntry } from "@/lib/playbook/contentSchema";

export const ITR_PLAY_ID = "is-this-right-for-you";
export const ITR_SIM_ID = "sim-itr-evaluator-stance";

// ---- Play ---------------------------------------------------------------------
export const ITR_PLAY: Play = {
  playId: ITR_PLAY_ID,
  playVersion: 1,
  outputSchemaVersion: 1,
  name: "Is This Right for You?",
  positioning: "Keep two questions open — do they seem interested, and what are you learning about whether you want this.",
  recognitionGate: {
    prompt: "When someone's easy to like, I focus on whether they're into me — and lose track of whether this is actually what I want.",
  },
  screens: [
    {
      kind: "shift",
      body: [
        "When someone is appealing, it can become easy to spend more attention on whether they want you than on what you're learning about whether you want this.",
        "This helps you keep both questions open — so what you notice about whether this actually fits you stays in view as information, instead of getting waved off because you like them. It's not about deciding for or against anyone.",
      ],
    },
    {
      kind: "literature",
      l1: "Wanting to be chosen is human — enjoying that someone's into you isn't the problem. What's worth noticing is how much of your attention it can take. When someone's appealing and clearly interested, most of your attention can go to 'do they want me?', and your own question — 'is this actually what I want?' — can go quiet. Both can stay open at once. Keeping your own question live isn't vetting them or holding back; it just means the things you're learning about whether this fits you — how available they are, what they want, how they communicate, how your lives line up — stay in view as information instead of getting waved off because you like them.",
      l2Heading: "When it's not a fit question",
      l2: "One thing to keep separate: how much you like someone and how they treat what matters to you are different questions. If something crosses from 'we might not line up' into dismissiveness, disrespect, or feeling unsafe, that isn't a fit trade-off you weigh against how appealing they are — it goes in its own box. One moment doesn't tell you who someone is; a repeated pattern matters more. And anything that feels like pressure or makes you feel unsafe is a different conversation, and there's support for it.",
    },
    {
      kind: "learn",
      body: [
        "Two questions, held side by side:",
        "Do they seem interested? — what you've actually seen.",
        "What am I learning about whether I want this? — availability, values, communication, goals, lifestyle.",
        "You don't have to answer the second one today. You just have to keep it from going quiet.",
      ],
    },
    {
      kind: "scenarioSort",
      prompt: "Quick sort. A few things came up over a couple of dates with someone easy to like. Which box does each go in?",
      situation: "Two dates in with someone you genuinely enjoy. A handful of things have come up.",
      buckets: [
        { id: "interest", label: "About their interest" },
        { id: "fit", label: "About whether this fits me" },
        { id: "respect", label: "Not a fit question" },
      ],
      items: [
        { id: "s1", text: "They text back fast and are already planning a third date.", correctBucket: "interest" },
        { id: "s2", text: "They mentioned they're moving abroad in about six months.", correctBucket: "fit" },
        { id: "s3", text: "They lit up talking about wanting kids in the next couple of years.", correctBucket: "fit" },
        { id: "s4", text: "They complimented you a lot.", correctBucket: "interest" },
        {
          id: "s5",
          text: "When you shared something you're proud of, they brushed it off and moved on.",
          correctBucket: "respect",
          correction:
            "This one's easy to file under 'fit' with a 'but they're great otherwise.' It isn't a fit trade-off — it's about respect, and it goes in its own box. One moment doesn't define someone; a pattern would matter more.",
        },
      ],
      note: "Two of these tell you they're into it. Two tell you something about whether this fits you. The last one isn't a fit question at all.",
      evidenceQuestion: {
        prompt: "When someone's this easy to like, which question tends to go quiet?",
        options: ["What I'm learning about whether I want this", "Whether they're into me", "Neither — I track both evenly"],
      },
    },
    {
      kind: "ownTurn",
      intro: "Now someone real — someone you actually like right now. Keep it to what you've genuinely noticed, not what you're hoping or guessing.",
      fields: [
        { id: "interest", label: "What have you actually seen that they're interested?", input: "chips", placeholder: "e.g. texts first, planned our last date" },
        { id: "fit", label: "What have you learned about whether this fits YOU? (availability, values, communication, goals, lifestyle)", input: "chips", placeholder: "e.g. wants to keep things very casual" },
        { id: "respect", label: "Anything that isn't a fit question — a respect or treatment thing you noticed? (Leave blank if none.)", input: "chips" },
      ],
    },
    {
      kind: "sentenceBuilder",
      label: "Name one thing you've learned about whether this fits YOU — in your own words.",
      helper: "Not about whether they like you. About whether you want this. One honest sentence is plenty.",
    },
    { kind: "output", heading: "Your Two Questions", body: "Here's your check for this person — both questions, kept open. Keep it, or save it to My Plays." },
    {
      kind: "portable",
      heading: "Take it with you",
      steps: [
        "Do they seem interested?",
        "What am I learning about whether I want this?",
        "Is this a fit question, or a respect one?",
        "Liking them and choosing them aren't the same question — both get to stay open.",
      ],
    },
    {
      kind: "realWorldUse",
      useWhen: "you're a few dates in with someone you really like, and it's easy to spend all your attention on whether they're into you.",
      doThis: "Run both questions before you decide anything — and let what you learn about fit be information, not a verdict.",
      safetyNote: "If what you're weighing is disrespect or feeling unsafe, that's not a fit question — you don't weigh that against how much you like someone.",
    },
  ],
  portable: [
    "Do they seem interested?",
    "What am I learning about whether I want this?",
    "Is this a fit question, or a respect one?",
    "Liking them and choosing them aren't the same question — both get to stay open.",
  ],
  myPlaysTemplate: {
    when: "someone's appealing and I catch myself mostly tracking whether they're into me",
    move: "ask both questions — do they seem interested / what am I learning about whether I want this — and let fit info be data",
    lookingFor: "real information about fit (availability, values, communication, goals), not just signs of their interest",
    watchOut: "spending all my attention on whether they like me; filing a respect/treatment thing under 'fit'",
    remember: "liking them and choosing them are different questions; both get to stay open",
  },
  fidelity: {
    correct: "You kept your own question live — you can name at least one thing you've learned about fit, separate from whether they're interested.",
    misuse: [
      "Turning it into a verdict or a score on the person.",
      "Weighing a respect/treatment issue as if it were an ordinary fit trade-off.",
    ],
    notMeaning: "This isn't vetting, rejecting, or grading someone — it's keeping your own question from going quiet.",
  },
};

// ---- Experience simulation (dualAttention) ------------------------------------
const F: string[] = []; // empty inline feedback (mechanism teaching lives in the note branches)
export const ITR_SIMULATION: Simulation = {
  id: ITR_SIM_ID,
  version: 1,
  simulationSchemaVersion: 1,
  playId: ITR_PLAY_ID,
  signature: "dualAttention",
  startNodeId: "itr-n1",
  nodes: [
    { id: "itr-n1", kind: "moment", body: ["A few dates in with someone you genuinely like. They're warm, they're funny, they remember the small stuff you said last time. Tonight's the easy kind of easy — the kind that makes you want it to work out."], next: "itr-n2" },
    { id: "itr-n2", kind: "moment", jitLiteratureId: "lit-jit-wanted-vs-compatible", body: ["Over dinner they're clearly into it — leaning in, already floating ideas for a next time. Somewhere in there they mention, lightly, that they're on the road for work about three weeks out of every four this year."], next: "itr-d1" },
    {
      id: "itr-d1",
      kind: "decision",
      prompt: "What are you noticing right now?",
      options: [
        { id: "interest", label: "Mostly that they're really into this.", feedback: F, next: "itr-note1-widen" },
        { id: "fit", label: "That 'three weeks away' is something I'd want to understand for myself.", signal: "fit_kept", feedback: F, next: "itr-note1-hold" },
        { id: "dismiss", label: "Nothing worth flagging — it's going great.", feedback: F, next: "itr-note1-widen" },
      ],
    },
    { id: "itr-note1-widen", kind: "note", body: ["They do seem into it — that's real, and you get to enjoy it. It just doesn't answer your other question yet: is this — three weeks away most months and all — something you'd want? Both questions get to stay open."], next: "itr-n3" },
    { id: "itr-note1-hold", kind: "note", body: ["You let your own question stay in the room. Liking them and learning whether this fits you are allowed to run side by side — that's the whole move."], next: "itr-n3" },
    { id: "itr-n3", kind: "moment", body: ["Later, something real comes up — where things could go, further down the line. They stay warm, but wave it off with a smile: “Eh — honestly not sure I want the whole settle-down thing. Let's just see where it goes.”"], next: "itr-d2" },
    {
      id: "itr-d2",
      kind: "decision",
      prompt: "What are you noticing now?",
      options: [
        { id: "smooth", label: "They're so easy to be around — I don't want to make it heavy.", feedback: F, next: "itr-note2-widen" },
        { id: "fit", label: "That 'not sure I want to settle down' is information I'd want to keep in view, if long-term direction matters to me.", signal: "fit_kept", feedback: F, next: "itr-note2-hold" },
        { id: "dismiss", label: "It's probably nothing — people say that.", feedback: F, next: "itr-note2-widen" },
      ],
    },
    { id: "itr-note2-widen", kind: "note", body: ["Fair not to want to make it heavy. Still — that was real information about how they're talking about the future right now. You don't have to do anything with it tonight; the move is just to let it land as information instead of smoothing it away."], next: "itr-n4" },
    { id: "itr-note2-hold", kind: "note", body: ["You let it land as information. That's the evaluator stance — you can hold that they're lovely and that you just learned something about whether this points where you want to go."], next: "itr-n4" },
    { id: "itr-n4", kind: "moment", jitLiteratureId: "lit-jit-respect-vs-fit", body: ["You mention something you've been proud of — a thing you've been building at work. They laugh: “Cute. Anyway—” and move straight on."], next: "itr-d3" },
    {
      id: "itr-d3",
      kind: "decision",
      prompt: "What did you notice there?",
      options: [
        { id: "small", label: "A small thing — they're great otherwise.", feedback: ["Worth pausing on, even so."], next: "itr-note-exclusion" },
        { id: "treatment", label: "That was dismissive of something that matters to me.", feedback: ["You clocked it."], next: "itr-note-exclusion" },
        { id: "weird", label: "Not sure — it just sat a little wrong.", feedback: ["That 'sat wrong' is worth keeping."], next: "itr-note-exclusion" },
      ],
    },
    {
      id: "itr-note-exclusion",
      kind: "note",
      body: [
        "Here's one worth noticing rather than explaining away. A brush-off like that is information — and “they're great otherwise” is exactly the sentence that waves it off when someone's this appealing. One moment doesn't tell you who they are.",
        "But information about respect and how you'd be treated isn't the same kind of information as whether your schedules or your goals line up — it's worth holding a little differently, not folded in as just another fit trade-off. If that kind of thing turned out to be a pattern, it would matter more, not less. And anything that ever crossed into pressure, intimidation, or feeling unsafe is a different conversation altogether — not a fit question, and there's support for that.",
      ],
      next: "itr-r1",
    },
    {
      id: "itr-r1",
      kind: "reconsider",
      prompt: "Two things are true tonight: they seem genuinely into you, and you've picked up some real information about whether this is something you want. Right now — honestly — which one has more of your attention?",
      options: [
        { id: "mostly-them", label: "Mostly whether they're into me.", next: "itr-note-r1-collapse" },
        { id: "both", label: "Both — I'm enjoying them and keeping my own question open.", signal: "held_both", next: "itr-note-r1-both" },
        { id: "decided", label: "I'd already decided they were great, so the rest didn't really land.", next: "itr-note-r1-collapse" },
      ],
    },
    { id: "itr-note-r1-collapse", kind: "note", jitLiteratureId: "lit-jit-liking-vs-choosing", body: ["Notice where it landed — mostly on 'do they want me.' That's the exact pull this is about. Nothing went wrong; it's just worth seeing, because the other question is the one that tells you whether you want this."], next: "itr-reveal" },
    { id: "itr-note-r1-both", kind: "note", body: ["You held both — into them, and still asking your own question. That's the move, and it's harder than it sounds when someone's this easy to like."], next: "itr-reveal" },
    {
      id: "itr-reveal",
      kind: "reveal",
      label: "Where your attention went tonight",
      body: [
        "Here's tonight, laid out plainly — no verdict, no score.",
        "What came up: they're warm, funny, and clearly interested · they're away for work about three weeks a month this year · they said they're not sure they want to settle down · and when you shared something you're proud of, they brushed it off (worth noticing rather than explaining away — one moment doesn't define someone; a pattern would matter more).",
        "We're not stacking these against each other, and we're not scoring the fit — that's yours to decide, out in the world. The only move here was keeping your own question from going quiet. Where your choices focused in this exercise:",
      ],
      computedSummary: {
        resolver: "dualAttentionFocus",
        variants: {
          interest: "In this exercise, your choices leaned mostly toward whether they were interested.",
          evaluation_active: "In this exercise, your choices kept your own evaluation active.",
          both: "In this exercise, your choices held both streams — their interest and your own read.",
        },
      },
      next: "itr-teach",
    },
    { id: "itr-teach", kind: "teach", body: ["Out in real life, this is the whole tool: when someone's easy to like, keep both questions open — do they seem interested, and what am I learning about whether I want this? Here's the Play."], toPlayId: ITR_PLAY_ID },
  ],
};

// ---- JIT literature (Exposure only) -------------------------------------------
export const ITR_JIT: LiteratureEntry[] = [
  {
    id: "lit-jit-wanted-vs-compatible",
    version: 1,
    scope: "jit",
    anchor: "itr.fit-signal",
    title: "Being wanted isn't the same as being a fit",
    body: [
      { kind: "paragraph", body: ["It feels good when someone's clearly interested — and it's easy to let that stand in for the other question: is this actually something you want? They can be very into you and still not fit your life, and both of those can be true at once."] },
      { kind: "guardrail", body: ["Enjoy that they're interested. Just don't let it answer a question it can't answer — keep your own read alive."] },
    ],
  },
  {
    id: "lit-jit-respect-vs-fit",
    version: 1,
    scope: "jit",
    anchor: "itr.respect-signal",
    title: "Respect and fit are different kinds of information",
    body: [
      { kind: "paragraph", body: ["Whether your lives line up is a fit question. How someone treats what matters to you is a different kind of question — and it isn't something you weigh against how appealing they are. One moment doesn't tell you who someone is; a repeated pattern matters more."] },
      { kind: "guardrail", body: ["“They're great otherwise” is the sentence that files a brush-off under 'fit.' Notice it rather than explaining it away. Anything that feels like pressure or makes you feel unsafe is a different conversation, and there's support for it."] },
    ],
  },
  {
    id: "lit-jit-liking-vs-choosing",
    version: 1,
    scope: "jit",
    anchor: "itr.evaluator",
    title: "Liking someone and choosing someone are different questions",
    body: [
      { kind: "paragraph", body: ["You can like someone a lot and still be deciding whether this is what you want. Liking is about them; choosing is about you. Keeping both live is the whole move — it's not colder, it's just yours to answer too."] },
      { kind: "guardrail", body: ["If all your attention is on 'do they want me,' that's the pull to notice — the other question is the one that tells you whether you want this."] },
    ],
  },
];
