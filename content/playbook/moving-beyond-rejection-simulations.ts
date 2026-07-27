// Rev 3 Experience layer — authored, deterministic simulations for "Moving Beyond
// Rejection". FOR REVIEW (content gate). No LLM at runtime.
//
// Nodes form an authored graph (startNodeId + per-node/option `next`). Options may route
// to a short teaching branch (a `note`) that rejoins the main path — branching changes
// what TEACHING the reader receives, NEVER what the dating partner does.
//
// Non-scoring: no option is "correct" and no branch predicts a relationship outcome.
// Fidelity is authored per reconsider response as explicit states — and revising is NOT
// the target: whether the evidence-appropriate response is to REVISE or to HOLD depends on
// the authored evidence (RD: holding "still unsure" is appropriate; WM: holding the global
// verdict is not).
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
        id: "c2",
        kind: "capture",
        prompt: "What are you tempted to do?",
        field: { kind: "choice", options: ["Pull back to protect myself", "Double-text to check", "Wait and watch a bit", "End it now"] },
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
            label: "The plan is real evidence — my first read was ahead of the facts",
            feedback: ["You let the new evidence update the story instead of the story updating the evidence."],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" },
            next: "t1",
          },
          {
            id: "hold-open",
            label: "Still not fully clear — I'll hold it open and keep watching",
            feedback: ["“Not sure yet” is an evidence-appropriate place to stand: the plan is real, and some ambiguity remains."],
            // Holding is appropriate here — revising is NOT the target.
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" },
            next: "t1",
          },
          {
            id: "keep",
            label: "I still read it as losing interest",
            feedback: ["You weighed it — let's look at what the concrete plan adds."],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" },
            next: "note-keep",
          },
        ],
      },
      {
        id: "note-keep",
        kind: "note",
        body: [
          "One reading is “losing interest.” But they also just set up a real plan — that's evidence too, not only the shorter texts.",
          "The tool isn't about which read is nicer. It's about holding the read the size of what you've actually seen.",
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
        id: "c1",
        role: "expansion",
        kind: "capture",
        jitLiteratureId: "lit-jit-globalizing",
        prompt: "In the moment, what did that start to turn into?",
        field: { kind: "choice", options: ["This will happen with everyone", "It'll always be like this", "Something's wrong with me", "I'm not worth choosing"] },
        next: "d1",
      },
      {
        id: "d1",
        kind: "decision",
        prompt: "Which of these does the event actually establish?",
        options: [
          { id: "small", label: "Only that this one person didn't want to continue", processTag: "held_uncertainty", feedback: ["Right-sized. That's what the event supports — no more, no less."], next: "r1" },
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
      { id: "r1", role: "evidence", kind: "reveal", label: "What this actually establishes", body: ["This one person didn't want to continue. That's it — no more."], next: "rc1" },
      {
        id: "rc1",
        role: "narrowing",
        kind: "reconsider",
        prompt: "Narrow it back to the smallest true thing the event supports.",
        options: [
          {
            id: "narrow",
            label: "This one person didn't want to keep dating me",
            feedback: ["You kept the fact and dropped the verdict."],
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" },
            next: "t1",
          },
          {
            id: "hold-big",
            label: "I'll sit with the bigger version a while longer",
            feedback: ["You weighed it — notice the event still only supports the small version."],
            // Unlike RD, holding the global verdict is NOT evidence-appropriate here.
            fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" },
            next: "t1",
          },
        ],
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
