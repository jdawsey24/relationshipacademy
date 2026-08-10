// Rev 3 Experience layer — authored, deterministic simulations for "Moving Beyond
// Rejection". FOR REVIEW (content gate, revised). No LLM at runtime.
//
// Nodes form an authored graph (startNodeId + per-node/option `next`). Options may route
// to a short teaching branch (a `note`) that rejoins the main path — branching changes
// what TEACHING the reader receives, NEVER what the dating partner does. Every branch
// rejoins BEFORE the same authored evidence reveal.
//
// Non-scoring: no option is "correct" and no branch predicts a relationship outcome.
// Fidelity is authored per reconsider response as explicit states (Guardrail 1) — never
// fixed by signature. Revising is not the target: whether the evidence-appropriate response
// is to REVISE or to HOLD depends on the authored evidence in THAT scenario.
//
// Two signatures (owner decision 6): evidenceTimeline (RD), conclusionNarrowing (WM).

import type { Simulation } from "@/lib/playbook/contentSchema";

const RD = "read-and-decide";
const WM = "what-it-actually-means";

export const MBR_SIMULATIONS: Simulation[] = [
  // ---------------------------------------------------------------------------
  // Read It, Then Decide — evidenceTimeline
  // ---------------------------------------------------------------------------
  {
    id: "sim-rd-shorter-texts",
    version: 1,
    simulationSchemaVersion: 1,
    playId: RD,
    signature: "evidenceTimeline",
    startNodeId: "m1",
    nodes: [
      { id: "m1", role: "beat", kind: "moment", body: ["Great first date. It was easy, and they said they'd love to see you again."], next: "m2" },
      { id: "m2", role: "beat", kind: "moment", body: ["Over the next four days, their texts get shorter."], next: "c1" },
      {
        id: "c1",
        kind: "capture",
        jitLiteratureId: "lit-jit-ambiguity-spiral",
        prompt: "What do you think the shorter texts mean?",
        field: { kind: "choice", options: ["They're losing interest", "They're just busy this week", "That's just how they text", "I'm not sure yet"] },
        next: "c2",
      },
      {
        // Temptation as a real decision: acting before the meaning is clear earns a teaching
        // beat; "wait and watch" earns a different one. All branches rejoin before the reveal.
        id: "c2",
        kind: "decision",
        prompt: "What are you tempted to do right now?",
        options: [
          { id: "pull-back", label: "Pull back to protect myself", feedback: [], next: "note-c2-act" },
          { id: "double-text", label: "Double-text to check", feedback: [], next: "note-c2-act" },
          { id: "end-it", label: "End it now", feedback: [], next: "note-c2-act" },
          { id: "wait", label: "Wait and watch a bit", feedback: [], next: "note-c2-wait" },
        ],
      },
      {
        id: "note-c2-act",
        kind: "note",
        body: [
          "That's a move made before you have enough to go on.",
          "Right now the shorter texts could mean a lot of things. Acting on the story before the evidence is in is the exact habit this is here to interrupt.",
        ],
        next: "r1",
      },
      {
        id: "note-c2-wait",
        kind: "note",
        body: [
          "Good instinct — with one catch.",
          "Watching only works when you know what you're watching for. Gathering more information isn't the same as waiting forever. Decide what would actually tell you, so “wait” doesn't quietly become “never decide.”",
        ],
        next: "r1",
      },
      { id: "r1", role: "evidence", kind: "reveal", label: "New evidence", body: ["Day 5: they message you to set up a real plan for next week."], next: "rc1" },
      {
        id: "rc1",
        kind: "reconsider",
        prompt: "Weigh your first read against the new evidence. Where does it land now?",
        options: [
          {
            id: "revise",
            label: "The plan changes what I can reasonably conclude. I was ahead of the evidence.",
            feedback: ["Right — the plan is new evidence that widens what's possible. You updated the read to fit what you've seen, not the other way around."],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" },
            next: "t1",
          },
          {
            id: "hold-open",
            label: "Losing interest is still possible, but I don't have enough to call it that yet.",
            feedback: ["Exactly — “possible, not established” is the honest size of it. You're holding the conclusion to the evidence, not to the fear."],
            // Holding an open read is evidence-appropriate here — revising is not the target.
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" },
            next: "t1",
          },
          {
            id: "keep",
            label: "The shorter texts tell me they're losing interest. The plan doesn't really change that.",
            feedback: [],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" },
            next: "note-keep",
          },
        ],
      },
      {
        id: "note-keep",
        kind: "note",
        body: [
          "Both things are real evidence: the shorter texts, and the concrete plan.",
          "The shorter texts might still point to fading interest — but the plan is evidence too, and “losing interest” quietly discards it. The move isn't to pick the hopeful read or the fearful one. It's to hold a conclusion the size of everything you've actually seen.",
        ],
        next: "t1",
      },
      {
        id: "t1",
        kind: "teach",
        body: [
          "That gap — between your first read and the new evidence — is exactly what this tool trains.",
          "It doesn't predict what they'll do. It helps your next move follow what you've actually seen.",
        ],
        toPlayId: RD,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // What It Actually Means — conclusionNarrowing
  // ---------------------------------------------------------------------------
  {
    id: "sim-wm-not-a-match",
    version: 1,
    simulationSchemaVersion: 1,
    playId: WM,
    signature: "conclusionNarrowing",
    startNodeId: "m1",
    nodes: [
      { id: "m1", role: "event", kind: "moment", body: ["After a few good dates, they say: “I had a great time, but I don't think we're a match.”"], next: "c1" },
      {
        // First read as a decision so we can branch: globalizing reads continue to the
        // "what does this establish?" check; a bounded read is met with acknowledgment —
        // we never manufacture a self-worth problem that isn't there.
        id: "c1",
        role: "expansion",
        kind: "decision",
        jitLiteratureId: "lit-jit-globalizing",
        prompt: "In the moment, what did that start to turn into?",
        options: [
          { id: "everyone", label: "This will happen with everyone", processTag: "jumped_to_conclusion", feedback: [], next: "d1" },
          { id: "forever", label: "It'll always be like this", processTag: "jumped_to_conclusion", feedback: [], next: "d1" },
          { id: "identity", label: "Something's wrong with me", processTag: "jumped_to_conclusion", feedback: [], next: "d1" },
          { id: "worth", label: "I'm not worth choosing", processTag: "jumped_to_conclusion", feedback: [], next: "d1" },
          { id: "bounded", label: "It hurt, but I didn't make it mean something bigger about me", processTag: "bounded_to_evidence", feedback: [], next: "note-bounded" },
        ],
      },
      {
        id: "note-bounded",
        kind: "note",
        body: [
          "That's the move — the sting is real, and you kept it from turning into a verdict about you.",
          "Nothing to undo here. Let's just be clear about what the event does and doesn't establish, so it stays that way.",
        ],
        next: "r1",
      },
      {
        id: "d1",
        kind: "decision",
        prompt: "Which of these does the event actually establish?",
        options: [
          { id: "small", label: "Only that this one person didn't want to continue", processTag: "bounded_to_evidence", feedback: ["Right-sized. That's what the event supports — and it's worth being just as clear about what it doesn't."], next: "r1" },
          { id: "identity", label: "That something's wrong with me", processTag: "jumped_to_conclusion", feedback: ["That's the jump — let's look at why one event can't carry it."], next: "note-jump" },
          { id: "forever", label: "That it'll always be like this", processTag: "jumped_to_conclusion", feedback: ["“Always” reaches past one event — let's look at why."], next: "note-jump" },
        ],
      },
      {
        id: "note-jump",
        kind: "note",
        body: [
          "One event can't establish a claim about everyone, about forever, or about your worth.",
          "The event is real. The size of the conclusion is what to check.",
        ],
        next: "r1",
      },
      {
        id: "r1",
        role: "evidence",
        kind: "reveal",
        label: "What this actually establishes",
        body: [
          "For sure: this one person, at this time, didn't want to keep dating you.",
          "What it can't establish: anything about everyone, about how it will always go, or about your worth.",
        ],
        next: "rc1",
      },
      {
        id: "rc1",
        role: "narrowing",
        kind: "reconsider",
        prompt: "Land it on the smallest true thing the event supports.",
        options: [
          {
            id: "narrow",
            label: "This one person didn't want to keep dating me. That's what the event shows.",
            feedback: ["That's the fact the event supports — nothing added, nothing inflated."],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" },
            next: "t1",
          },
          {
            id: "narrow-with-feeling",
            label: "I know that's what the event shows, even though the bigger story still feels true right now.",
            feedback: ["That's the skill: the feeling doesn't have to disappear for you to stop treating it as evidence. You can hold the fact and the feeling at the same time."],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" },
            next: "t1",
          },
          {
            id: "still-wrong",
            label: "I still think this proves something is wrong with me.",
            feedback: [],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" },
            next: "note-still-wrong",
          },
        ],
      },
      {
        id: "note-still-wrong",
        kind: "note",
        body: [
          "The hurt is real, and it makes sense. Keep it — it's honest.",
          "But “something is wrong with me” is a conclusion this event can't support. One person's “not a match” can't establish that. Keep the pain; drop the verdict — the evidence doesn't back it.",
        ],
        next: "t1",
      },
      {
        id: "t1",
        kind: "teach",
        body: [
          "Keeping the story the size of the facts is the whole operation.",
          "It won't erase the sting. It keeps a hard moment from becoming a verdict about you.",
        ],
        toPlayId: WM,
      },
    ],
  },
];
