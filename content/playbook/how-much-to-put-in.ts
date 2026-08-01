// Cluster 1 vertical slice — "How Much to Put In" (investmentView).
// Play + Experience simulation + JIT literature, authored from the approved specs
// (cluster-1-play-spec-how-much-to-put-in-v1.md, cluster-1-experience-graph-how-much-to-put-in-v1.md).
// The other person's beats are INDEPENDENT of the user's investment. Flag-gated via ExperienceShell.

import type { Play, Simulation, LiteratureEntry } from "@/lib/playbook/contentSchema";

export const HMP_PLAY_ID = "how-much-to-put-in";
export const HMP_SIM_ID = "sim-hmp-investment-view";

// The user's OWN moves — never mirroring, waiting tactics, withdrawal, response-time matching,
// or a pursuit test (owner ruling; excluded vocabulary never modeled).
const HMP_ACTIONS = [
  "keep my investment where it is",
  "put in a little more",
  "ease off effort that isn't being matched, so what's there gets clearer",
  "ask a clear question to get the information",
  "take what I've seen as my answer and decide",
];
const HMP_CONTROL_CHECK =
  "This governs your own next move based on what you can observe. It's not a test, a way to get them to chase, matching their timing, or waiting them out.";

// Investment options reused across the three rounds (labels are the consumer choices).
const INVEST_LABELS = {
  keep: "Keep it about where it is.",
  more: "Give a little more.",
  less: "Give a little less.",
  clarify: "Clarify something first.",
};
const GUARDRAIL_FEEDBACK = [
  "One thing to be clear about, because it gets twisted a lot: giving a little less here isn't a test, a withdrawal, a tactic, or a way to get someone to chase — and it has nothing to do with matching anyone's effort or timing. It just means easing off effort that isn't being met, so that what's actually there becomes easier to see.",
];
const CLARIFY_FEEDBACK = ["Asking is gathering evidence, not applying pressure. When the information's thin, a clear question is often the cleanest move there is."];
const RESPONSIVE_FEEDBACK = ["Your investment moved with a real signal — they met you, and you met them back. That's the whole idea: effort going where there's something meeting it."];

// ---- Play ---------------------------------------------------------------------
export const HMP_PLAY: Play = {
  playId: HMP_PLAY_ID,
  playVersion: 1,
  outputSchemaVersion: 1,
  name: "How Much to Put In",
  positioning: "Before you change how much you put in, name the evidence — and turn it into a move you decide on purpose.",
  recognitionGate: {
    prompt: "I sometimes change how much I'm putting in before I actually have new information.",
  },
  screens: [
    {
      kind: "shift",
      body: [
        "It's easy to change how much you're putting in based on the quiet, or a feeling — before you've actually got new information.",
        "This helps you tie your investment to what you can genuinely see, and to a move you decide on purpose — so your effort follows the evidence, not the silence.",
      ],
    },
    {
      kind: "literature",
      l1: "Early dating gives you information in uneven amounts — sometimes a lot, sometimes a quiet stretch. It's easy to change how much you're putting in based on the quiet or a feeling rather than on something you've actually seen. This helps you tie your investment to observable evidence: what you can genuinely point to — they initiated, they followed through, they made a plan — or, over time, a repeated pattern you can actually see. One quiet day or a hunch isn't new evidence; a pattern is. The move is small: before you change how much you put in, name what you're going on.",
      l2Heading: "What 'giving a little less' means",
      l2: "Because this one gets twisted a lot: easing off isn't a test, a withdrawal, a tactic, or a way to get someone to chase — and it has nothing to do with matching their response times or timing. Creating relational space means discontinuing unnecessary compensatory effort so existing mutual engagement becomes observable. If you're easing off to provoke a reaction, that's a different thing — and it usually just clouds the information you were trying to get.",
    },
    {
      kind: "learn",
      body: [
        "The move is small and repeatable:",
        "Name what you've actually seen — initiation, follow-through, plans. Over time, a repeated pattern counts too.",
        "Notice what's a gap you're filling — a quiet stretch, a feeling, a guess. That's not new evidence.",
        "Then choose your investment — keep / more / less / clarify — on purpose, tied to what you can see.",
      ],
    },
    {
      kind: "scenarioSort",
      prompt: "Quick sort. Evidence, or a gap you'd be filling?",
      situation: "A handful of moments from a few weeks of talking to someone.",
      buckets: [
        { id: "evidence", label: "Observable evidence" },
        { id: "gap", label: "A gap I'm filling / a feeling" },
      ],
      items: [
        { id: "s1", text: "They followed through on the plan they suggested.", correctBucket: "evidence" },
        { id: "s2", text: "It's been quiet for a day and I feel anxious.", correctBucket: "gap" },
        {
          id: "s3",
          text: "Over three weeks, they've cancelled every plan they made.",
          correctBucket: "evidence",
          correction: "Easy to file this under 'just the quiet' — but a repeated, observable pattern over time IS evidence. The line isn't 'silence = nothing'; it's whether you're filling a gap or responding to a pattern you've actually seen.",
        },
        { id: "s4", text: "I've got a feeling they're pulling away.", correctBucket: "gap" },
        { id: "s5", text: "They texted first and asked how my week went.", correctBucket: "evidence" },
        { id: "s6", text: "They haven't replied in two hours.", correctBucket: "gap" },
      ],
      note: "One quiet day or a feeling isn't new evidence — that's a gap you might be filling. A repeated pattern you can actually point to is evidence. Tie your investment to what you can see, not to the silence.",
      evidenceQuestion: {
        prompt: "When you feel the pull to put in more, what's worth checking first?",
        options: ["Whether there's actually a new sign it's mutual", "How the silence feels", "Whether they've texted yet today"],
      },
    },
    {
      kind: "ownTurn",
      intro: "Now a real situation of yours. Keep it to what you've genuinely seen.",
      fields: [
        { id: "evidence", label: "What have you actually seen? (initiation, follow-through, plans — or a repeated pattern over time)", input: "chips", placeholder: "e.g. planned our last two dates" },
        { id: "gap", label: "What are you filling in — a quiet stretch, a feeling, a guess?", input: "chips", placeholder: "e.g. quiet since Tuesday and I'm reading into it" },
        { id: "investment", label: "Right now, what do you want to do with your investment?", input: "text", suggestions: ["Keep it where it is", "Give a little more", "Give a little less (ease off effort that isn't being matched)", "Clarify first"], placeholder: "pick one, or say it your way" },
      ],
    },
    {
      kind: "ruleBuilder",
      intro: "Now turn it into a move you decide now — so you're not deciding in the quiet, from a feeling.",
      conditionLabel: "If I see… (the observable thing you'll watch for)",
      thenLabel: "…then I will",
      actions: HMP_ACTIONS,
      controlCheck: HMP_CONTROL_CHECK,
    },
    { kind: "output", heading: "Your Evidence & Move", body: "Here's what you're going on, and the move you've decided. Keep it, or save it to My Plays." },
    {
      kind: "portable",
      heading: "Take it with you",
      steps: [
        "What have I actually seen?",
        "Evidence (or a repeated pattern) — or a gap I'm filling?",
        "Keep / more / less / clarify — on purpose",
        "If I see ___, I'll ___. (my move, not a tactic)",
      ],
    },
    {
      kind: "realWorldUse",
      useWhen: "you feel the pull to text more into a silence, or to pull back to get a reaction.",
      doThis: "Name what you've actually seen before you change your investment — then run your 'if I see ___, I'll ___.'",
      safetyNote: "If the real issue is that someone's unavailable or treating you badly, that's not a pacing question — trust that, and you don't need more evidence for it.",
    },
  ],
  portable: [
    "What have I actually seen?",
    "Evidence (or a repeated pattern) — or a gap I'm filling?",
    "Keep / more / less / clarify — on purpose",
    "If I see ___, I'll ___. (my move, not a tactic)",
  ],
  myPlaysTemplate: {
    when: "I'm about to change how much I'm putting in",
    move: "name the evidence first, then choose keep / more / less / clarify — on purpose",
    lookingFor: "observable mutual signals (initiation, follow-through, plans), not the silence",
    watchOut: "effort climbing to fill quiet; using 'less' as a test or to provoke pursuit; scorekeeping",
    remember: "space means easing off unmatched effort so what's real becomes visible — not a tactic",
  },
  fidelity: {
    correct: "Your investment change is tied to something you actually observed, and it's a deliberate choice — not a reaction to the quiet or a way to get a response.",
    misuse: [
      "Using 'give a little less' as a test, a withdrawal, or a way to make someone chase.",
      "Scorekeeping or matching response times.",
    ],
    notMeaning: "This isn't playing games, withholding, or tit-for-tat. The other person's response isn't something you engineer.",
  },
  outputEditor: {
    heading: "Update your evidence & move",
    fields: [
      { id: "evidence", label: "What have you actually seen?", input: "text" },
      { id: "rule", label: "Your move", input: "rule", actions: HMP_ACTIONS, controlCheck: HMP_CONTROL_CHECK },
    ],
  },
};

// ---- Experience simulation (investmentView) -----------------------------------
// Three rounds — mutual stretch → quiet lull → an INDEPENDENT reach-out. Teaching lives in the
// investment options' inline feedback; the lull round's tags feed fidelity; the mirror recaps the
// reader's own investment choices next to what was there.
const evidenceOptions = (opts: { newSignalId?: string; nothingNewId?: string; next: string }) => [
  { id: "new", label: "A new sign it's mutual — they reached out / made a plan / followed through.", ...(opts.newSignalId ? { signal: opts.newSignalId } : {}), feedback: ["Good — that's the kind of thing worth moving with."], next: opts.next },
  { id: "nothing", label: "Nothing new, really — it's been quiet, or I just felt like it.", ...(opts.nothingNewId ? { signal: opts.nothingNewId } : {}), feedback: ["Honest — and that's the one to notice."], next: opts.next },
  { id: "unsure", label: "Not sure.", feedback: ["Fair — when it's thin, naming that is its own kind of clarity."], next: opts.next },
];

export const HMP_SIMULATION: Simulation = {
  id: HMP_SIM_ID,
  version: 1,
  simulationSchemaVersion: 1,
  playId: HMP_PLAY_ID,
  signature: "investmentView",
  startNodeId: "hmp-n1",
  nodes: [
    { id: "hmp-n1", kind: "moment", body: ["You've been talking to someone for a few weeks, and it's been good — you like them, and it feels like it might be going somewhere. Over the next stretch you'll get to choose, a few times, how much to put in."], next: "hmp-n2" },

    // Round 1 — clearly mutual (evidence present)
    { id: "hmp-n2", kind: "moment", jitLiteratureId: "lit-jit-mutual-signal", body: ["This week it's clearly mutual: they text first a couple of times, they follow through on a plan they'd suggested, they ask you something real about your week."], next: "hmp-d1" },
    {
      id: "hmp-d1",
      kind: "decision",
      prompt: "What do you want to do with your investment right now?",
      options: [
        { id: "keep", label: INVEST_LABELS.keep, feedback: ["Holding steady is a real choice — you're neither chasing a quiet patch nor reading into it."], next: "hmp-cap1" },
        { id: "more", label: INVEST_LABELS.more, feedback: RESPONSIVE_FEEDBACK, next: "hmp-cap1" },
        { id: "less", label: INVEST_LABELS.less, feedback: GUARDRAIL_FEEDBACK, next: "hmp-cap1" },
        { id: "clarify", label: INVEST_LABELS.clarify, feedback: CLARIFY_FEEDBACK, next: "hmp-cap1" },
      ],
    },
    { id: "hmp-cap1", kind: "decision", prompt: "What did you have to go on when you chose that?", options: evidenceOptions({ next: "hmp-n3" }) },

    // Round 2 — a quiet lull (NO new evidence): the pivot for fidelity
    { id: "hmp-n3", kind: "moment", jitLiteratureId: "lit-jit-effort-outruns-evidence", body: ["Then it goes quiet. Three days, nothing wrong — no fight, no weirdness — just… less. You've picked up your phone to text twice and put it back down."], next: "hmp-d2" },
    {
      id: "hmp-d2",
      kind: "decision",
      jitLiteratureId: "lit-jit-relational-space",
      prompt: "What do you want to do with your investment right now?",
      options: [
        { id: "keep", label: INVEST_LABELS.keep, feedback: ["Holding steady through a quiet patch is a fine call — you're neither chasing the silence nor reading into it."], next: "hmp-cap2" },
        { id: "more", label: INVEST_LABELS.more, signal: "increase_at_lull", feedback: ["Worth catching: your effort went up, and there wasn't a new sign it's mutual — it was more the quiet, or just the feeling. Reaching out isn't wrong. The move is only to notice which one you're doing, so it stays a choice and not a reflex."], next: "hmp-cap2" },
        { id: "less", label: INVEST_LABELS.less, feedback: GUARDRAIL_FEEDBACK, next: "hmp-cap2" },
        { id: "clarify", label: INVEST_LABELS.clarify, feedback: CLARIFY_FEEDBACK, next: "hmp-cap2" },
      ],
    },
    {
      id: "hmp-cap2",
      kind: "decision",
      prompt: "What did you have to go on when you chose that?",
      options: [
        { id: "new", label: "A new sign it's mutual — they reached out / made a plan / followed through.", signal: "claimed_evidence_at_lull", feedback: ["Worth a second look — it's been quiet this stretch. Was there a genuinely new sign, or the pull to see one?"], next: "hmp-n4" },
        { id: "nothing", label: "Nothing new, really — it's been quiet, or I just felt like it.", signal: "named_no_evidence", feedback: ["That's the honest read — and the useful one. Nothing new is nothing new."], next: "hmp-n4" },
        { id: "unsure", label: "Not sure.", feedback: ["Fair — when it's thin, naming that is its own kind of clarity."], next: "hmp-n4" },
      ],
    },

    // Round 3 — a warm reach-out, INDEPENDENT of anything the reader did
    { id: "hmp-n4", kind: "moment", body: ["A few days later, out of nowhere, they send a warm, real message — picking up a thread from before, glad to hear from you."], next: "hmp-note-independence" },
    { id: "hmp-note-independence", kind: "note", body: ["Before you choose — notice this: that message would have come, or not, whatever you'd done in the quiet stretch. Their move is theirs. Nothing you did (or didn't do) with your own investment made it happen. That's exactly why none of this is about easing off to get a response."], next: "hmp-d3" },
    {
      id: "hmp-d3",
      kind: "decision",
      prompt: "What do you want to do with your investment right now?",
      options: [
        { id: "keep", label: INVEST_LABELS.keep, feedback: ["Holding steady is a real choice — you're neither chasing nor reading into it."], next: "hmp-cap3" },
        { id: "more", label: INVEST_LABELS.more, feedback: RESPONSIVE_FEEDBACK, next: "hmp-cap3" },
        { id: "less", label: INVEST_LABELS.less, feedback: GUARDRAIL_FEEDBACK, next: "hmp-cap3" },
        { id: "clarify", label: INVEST_LABELS.clarify, feedback: CLARIFY_FEEDBACK, next: "hmp-cap3" },
      ],
    },
    { id: "hmp-cap3", kind: "decision", prompt: "What did you have to go on when you chose that?", options: evidenceOptions({ next: "hmp-reveal" }) },

    {
      id: "hmp-reveal",
      kind: "reveal",
      label: "Your steps, next to what was there",
      body: [
        "Here's each step you took, next to what was actually there — no score, no “right” curve.",
        "And the one worth keeping: their reaching back out wasn't caused by what you chose. The only thing that's ever really in your hands here is keeping your investment tied to what you can actually see — not to how quiet it got.",
      ],
      recap: [
        { label: "When it was clearly mutual, you chose", fromNode: "hmp-d1" },
        { label: "When it went quiet, you chose", fromNode: "hmp-d2" },
        { label: "When they reached back out, you chose", fromNode: "hmp-d3" },
      ],
      next: "hmp-teach",
    },
    { id: "hmp-teach", kind: "teach", body: ["Out in real life, the move is small and repeatable: before you change how much you're putting in, name what you're actually going on. That's the whole tool. Here's the Play."], toPlayId: HMP_PLAY_ID },
  ],
};

// ---- JIT literature (Exposure only) -------------------------------------------
export const HMP_JIT: LiteratureEntry[] = [
  {
    id: "lit-jit-mutual-signal",
    version: 1,
    scope: "jit",
    anchor: "hmp.evidence",
    title: "What counts as a mutual signal",
    body: [
      { kind: "paragraph", body: ["Evidence is what you can actually point to: they initiated, they followed through, they made a plan. Over time, a repeated pattern counts too — even a repeated pattern of not engaging. A feeling or a single quiet day isn't new evidence."] },
      { kind: "guardrail", body: ["Before you change your investment, name what you're going on — an observable signal, or a gap you're filling?"] },
    ],
  },
  {
    id: "lit-jit-effort-outruns-evidence",
    version: 1,
    scope: "jit",
    anchor: "hmp.lull",
    title: "Effort that outruns the evidence",
    body: [
      { kind: "paragraph", body: ["In a quiet stretch, the pull is to add effort — to fill the silence. That's the exact moment worth catching: is there a genuinely new sign it's mutual, or is it the quiet doing the talking? Reaching out isn't wrong; the point is to know which one you're doing."] },
      { kind: "guardrail", body: ["Effort going up while the evidence hasn't is the habit to notice — so it stays a choice, not a reflex."] },
    ],
  },
  {
    id: "lit-jit-relational-space",
    version: 1,
    scope: "jit",
    anchor: "hmp.space",
    title: "What relational space actually is",
    body: [
      { kind: "paragraph", body: ["Creating relational space is not a test, a withdrawal strategy, a manipulation tactic, or an attempt to provoke pursuit. It means discontinuing unnecessary compensatory effort so existing mutual engagement becomes observable."] },
      { kind: "guardrail", body: ["It has nothing to do with matching response times or making someone chase. If you're easing off to provoke a reaction, that just clouds the information you were after."] },
    ],
  },
];
