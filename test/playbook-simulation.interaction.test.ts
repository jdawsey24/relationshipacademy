import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import SimulationPlayer from "../components/playbook/SimulationPlayer";
import { MBR_SIMULATIONS } from "../content/playbook/finding-love-that-feels-mutual-simulations";
import type { Simulation } from "../lib/playbook/contentSchema";

const RD = MBR_SIMULATIONS.find((s) => s.signature === "evidenceTimeline")!;
const WM = MBR_SIMULATIONS.find((s) => s.signature === "conclusionNarrowing")!;
const cont = () => fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));

test("evidenceTimeline: temptation choices earn teaching beats and rejoin the same reveal", () => {
  const calls: { payload: unknown; toPlayId: string }[] = [];
  render(h(SimulationPlayer, { simulation: RD, onComplete: (payload: unknown, toPlayId: string) => calls.push({ payload, toPlayId }) }));

  assert.ok(screen.getByText(/great first date/i));
  cont();
  assert.ok(screen.getByLabelText(/what you've seen so far/i), "timeline trail");
  cont();
  fireEvent.click(screen.getByLabelText(/i'm not sure yet/i)); // interpretation capture
  cont();
  // temptation is a real decision — "wait and watch" earns the not-indefinite teaching beat
  fireEvent.click(screen.getByRole("button", { name: /wait and watch a bit/i }));
  cont();
  assert.ok(screen.getByText(/gathering more information isn't the same as waiting forever/i), "wait teaching beat");
  cont();
  // ...and rejoins the SAME Day-5 reveal
  assert.ok(screen.getByText(/^new evidence$/i));
  assert.ok(screen.getByText(/set up a real plan/i));
  cont();
  // reconsider: holding the fearful read while discarding the plan is weighed-but-not-appropriate
  fireEvent.click(screen.getByRole("button", { name: /the shorter texts tell me they're losing interest/i }));
  cont();
  assert.ok(screen.getByText(/both things are real evidence/i), "teaching branch: neither evidence is discarded");
  cont();
  assert.ok(screen.getByText(/exactly what this tool trains/i));
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));

  assert.equal(calls[0].toPlayId, "read-and-decide");
  assert.deepEqual(calls[0].payload, { signature: "evidenceTimeline", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" });
});

test("evidenceTimeline: acting-before-clear beat; holding 'not enough yet' is evidence-appropriate", () => {
  const calls: { payload: unknown }[] = [];
  render(h(SimulationPlayer, { simulation: RD, onComplete: (payload: unknown) => calls.push({ payload }) }));
  cont(); cont(); // moments
  fireEvent.click(screen.getByLabelText(/that's just how they text/i));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /pull back to protect myself/i }));
  cont();
  assert.ok(screen.getByText(/a move made before you have enough to go on/i), "acting-before-clear beat");
  cont(); // → reveal
  cont(); // → reconsider
  fireEvent.click(screen.getByRole("button", { name: /losing interest is still possible, but i don't have enough/i }));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));
  assert.deepEqual(calls[0].payload, { signature: "evidenceTimeline", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
});

test("conclusionNarrowing: globalizing read expands, jump routes to a note, narrowing credits fidelity", () => {
  const calls: { payload: unknown; toPlayId: string }[] = [];
  render(h(SimulationPlayer, { simulation: WM, onComplete: (payload: unknown, toPlayId: string) => calls.push({ payload, toPlayId }) }));

  assert.ok(screen.getByText(/i don't think we're a match/i));
  cont();
  assert.ok(screen.getByText(/^what happened$/i), "event pinned");
  fireEvent.click(screen.getByRole("button", { name: /^something's wrong with me$/i })); // first read (expansion)
  cont();
  assert.ok(screen.getByText(/grew into/i), "red expansion chip for a globalizing read");
  // establish-check: choose a jump → teaching note
  fireEvent.click(screen.getByRole("button", { name: /that something's wrong with me/i }));
  cont();
  assert.ok(screen.getByText(/one event can't establish a claim about everyone/i), "teaching note");
  cont();
  // evidence-bounded reveal
  assert.ok(screen.getByText(/what this actually establishes/i));
  assert.ok(screen.getByText(/what it can't establish/i), "states what it cannot establish");
  cont();
  fireEvent.click(screen.getByRole("button", { name: /this one person didn't want to keep dating me\. that's what the event shows/i }));
  assert.ok(screen.getByText(/^narrowed to$/i), "contraction chip");
  cont();
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));
  assert.equal(calls[0].toPlayId, "what-it-actually-means");
  assert.deepEqual(calls[0].payload, { signature: "conclusionNarrowing", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
});

test("conclusionNarrowing: a bounded first read is acknowledged, not treated as a problem", () => {
  render(h(SimulationPlayer, { simulation: WM, onComplete: () => {} }));
  cont(); // event → first read
  fireEvent.click(screen.getByRole("button", { name: /it hurt, but i didn't make it mean something bigger about me/i }));
  cont();
  assert.ok(screen.getByText(/you kept it from turning into a verdict about you/i), "bounded acknowledgment branch");
  assert.ok(screen.getByText(/and you kept it bounded/i), "neutral chip, not a red expansion");
  assert.equal(screen.queryByText(/grew into/i), null, "no globalization manufactured");
});

test("conclusionNarrowing: naming the fact while the feeling persists is Technique Fidelity", () => {
  const calls: { payload: unknown }[] = [];
  render(h(SimulationPlayer, { simulation: WM, onComplete: (payload: unknown) => calls.push({ payload }) }));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /this will happen with everyone/i }));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /only that this one person didn't want to continue/i }));
  cont(); // → reveal
  cont(); // → narrowing
  fireEvent.click(screen.getByRole("button", { name: /even though the bigger story still feels true right now/i }));
  assert.ok(screen.getByText(/the feeling doesn't have to disappear/i), "feeling ≠ evidence teaching");
  cont();
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));
  assert.deepEqual(calls[0].payload, { signature: "conclusionNarrowing", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
});

test("conclusionNarrowing: 'still proves something is wrong' separates real pain from the unsupported conclusion", () => {
  const calls: { payload: unknown }[] = [];
  render(h(SimulationPlayer, { simulation: WM, onComplete: (payload: unknown) => calls.push({ payload }) }));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /i'm not worth choosing/i }));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /only that this one person didn't want to continue/i }));
  cont();
  cont();
  fireEvent.click(screen.getByRole("button", { name: /i still think this proves something is wrong with me/i }));
  cont();
  assert.ok(screen.getByText(/keep the pain; drop the verdict/i), "distinguishes pain from conclusion");
  cont();
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));
  assert.deepEqual(calls[0].payload, { signature: "conclusionNarrowing", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" });
});

test("focus moves to the new node's prompt on transition", () => {
  render(h(SimulationPlayer, { simulation: RD, onComplete: () => {} }));
  cont();
  assert.match(document.activeElement?.textContent ?? "", /texts get shorter/i);
});

test("resume: initialState seeds the run mid-graph and reconstructs the trail", () => {
  render(h(SimulationPlayer, { simulation: RD, onComplete: () => {}, initialState: { nodeId: "r1", selections: { c2: "wait" }, captures: { c1: "I'm not sure yet" } } }));
  assert.ok(screen.getByText(/set up a real plan/i), "resumed at the reveal");
  assert.ok(screen.getByLabelText(/what you've seen so far/i), "trail reconstructed");
});

test("JIT hook surfaces literature by id (never inlined)", () => {
  const surfaced: string[] = [];
  render(h(SimulationPlayer, { simulation: WM, onComplete: () => {}, onSurfaceJit: (id: string) => surfaced.push(id) }));
  cont(); // to the expansion first-read
  fireEvent.click(screen.getByRole("button", { name: /related read/i }));
  assert.deepEqual(surfaced, ["lit-jit-globalizing"]);
});

test("bounded free text updates immediately and screens at advance (not on blur)", () => {
  const screened: string[] = [];
  const sim: Simulation = {
    id: "sim-x", version: 1, simulationSchemaVersion: 1, playId: "read-and-decide", signature: "evidenceTimeline", startNodeId: "cap",
    nodes: [
      { id: "cap", kind: "capture", prompt: "Say it in your words", field: { kind: "shortText", maxLen: 200, purpose: "user-authored" }, next: "t" },
      { id: "t", kind: "teach", body: ["done"], toPlayId: "read-and-decide" },
    ],
  };
  render(h(SimulationPlayer, { simulation: sim, onComplete: () => {}, onScreenText: (t: string) => screened.push(t) }));
  const ta = screen.getByRole("textbox");
  assert.equal((screen.getByRole("button", { name: /^continue$/i }) as HTMLButtonElement).disabled, true);
  fireEvent.change(ta, { target: { value: "is this going anywhere" } });
  assert.equal((screen.getByRole("button", { name: /^continue$/i }) as HTMLButtonElement).disabled, false);
  cont();
  assert.deepEqual(screened, ["is this going anywhere"]);
});

test("no option is presented as the single correct relationship answer", () => {
  render(h(SimulationPlayer, { simulation: WM, onComplete: () => {} }));
  cont();
  for (const re of [/correct/i, /right answer/i, /best choice/i, /\+\d+/]) {
    assert.equal(screen.queryByText(re), null, `no scoring marker: ${re}`);
  }
});
