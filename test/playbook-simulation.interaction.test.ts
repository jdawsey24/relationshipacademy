import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import SimulationPlayer from "../components/playbook/SimulationPlayer";
import { MBR_SIMULATIONS } from "../content/playbook/moving-beyond-rejection-simulations";
import type { Simulation } from "../lib/playbook/contentSchema";

const RD = MBR_SIMULATIONS.find((s) => s.signature === "evidenceTimeline")!;
const WM = MBR_SIMULATIONS.find((s) => s.signature === "conclusionNarrowing")!;
const cont = () => fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));

test("evidenceTimeline: 'keep' routes through a teaching branch; fidelity is explicit, not positive-only", () => {
  const calls: { payload: unknown; toPlayId: string }[] = [];
  render(h(SimulationPlayer, { simulation: RD, onComplete: (payload: unknown, toPlayId: string) => calls.push({ payload, toPlayId }) }));

  assert.ok(screen.getByText(/great first date/i));
  cont();
  assert.ok(screen.getByLabelText(/what you've seen so far/i), "timeline chrome trail");
  cont();
  fireEvent.click(screen.getByLabelText(/i'm not sure yet/i));
  cont();
  fireEvent.click(screen.getByLabelText(/wait and watch a bit/i));
  cont();
  assert.ok(screen.getByText(/^new evidence$/i), "authored reveal label");
  assert.ok(screen.getByText(/set up a real plan/i));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /i still read it as losing interest/i }));
  cont();
  // teaching branch (a note) appears and rejoins toward the handoff
  assert.ok(screen.getByText(/that's evidence too, not only the shorter texts/i), "teaching branch content");
  cont();
  assert.ok(screen.getByText(/exactly what this tool trains/i));
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));

  assert.equal(calls[0].toPlayId, "read-and-decide");
  assert.deepEqual(calls[0].payload, { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "not_demonstrated" });
});

test("evidenceTimeline: holding 'not sure yet' open is evidence-appropriate (revision is not the target)", () => {
  const calls: { payload: unknown }[] = [];
  render(h(SimulationPlayer, { simulation: RD, onComplete: (payload: unknown) => calls.push({ payload }) }));
  cont(); cont(); // past moments
  fireEvent.click(screen.getByLabelText(/that's just how they text/i));
  cont();
  fireEvent.click(screen.getByLabelText(/wait and watch a bit/i));
  cont(); cont(); // capture2 → reveal → reconsider
  fireEvent.click(screen.getByRole("button", { name: /i'll hold it open and keep watching/i }));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));
  assert.deepEqual(calls[0].payload, { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
});

test("conclusionNarrowing: jump routes to a teaching note; narrowing shows the expand→narrow chrome", () => {
  const calls: { payload: unknown; toPlayId: string }[] = [];
  render(h(SimulationPlayer, { simulation: WM, onComplete: (payload: unknown, toPlayId: string) => calls.push({ payload, toPlayId }) }));

  assert.ok(screen.getByText(/i don't think we're a match/i));
  cont();
  assert.ok(screen.getByText(/^what happened$/i), "event pinned");
  fireEvent.click(screen.getByLabelText(/something's wrong with me/i));
  cont();
  assert.ok(screen.getByText(/grew into/i), "expansion visual");
  // decision — choose the jump → teaching note branch
  fireEvent.click(screen.getByRole("button", { name: /that something's wrong with me/i }));
  cont();
  assert.ok(screen.getByText(/one event can't establish a claim about everyone/i), "teaching branch");
  cont();
  assert.ok(screen.getByText(/what this actually establishes/i), "authored WM reveal label");
  cont();
  fireEvent.click(screen.getByRole("button", { name: /this one person didn't want to keep dating me/i }));
  assert.ok(screen.getByText(/^narrowed to$/i), "contraction visual");
  cont();
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));

  assert.equal(calls[0].toPlayId, "what-it-actually-means");
  assert.deepEqual(calls[0].payload, { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" });
});

test("focus moves to the new node's prompt on transition", () => {
  render(h(SimulationPlayer, { simulation: RD, onComplete: () => {} }));
  cont(); // m1 → m2
  assert.match(document.activeElement?.textContent ?? "", /texts get shorter/i);
});

test("resume: initialState seeds the run at a mid-graph node", () => {
  render(h(SimulationPlayer, { simulation: RD, onComplete: () => {}, initialState: { nodeId: "r1", selections: {}, captures: { c1: "I'm not sure yet", c2: "Wait and watch a bit" } } }));
  assert.ok(screen.getByText(/set up a real plan/i), "resumed at the reveal node");
  assert.ok(screen.getByLabelText(/what you've seen so far/i), "trail reconstructed from the recorded path");
});

test("JIT hook surfaces literature by id (never inlined)", () => {
  const surfaced: string[] = [];
  render(h(SimulationPlayer, { simulation: WM, onComplete: () => {}, onSurfaceJit: (id: string) => surfaced.push(id) }));
  cont(); // to the expansion capture
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
  // Continue is disabled until there is text; typing updates immediately (no blur needed)
  assert.equal((screen.getByRole("button", { name: /^continue$/i }) as HTMLButtonElement).disabled, true);
  fireEvent.change(ta, { target: { value: "is this going anywhere" } });
  assert.equal((screen.getByRole("button", { name: /^continue$/i }) as HTMLButtonElement).disabled, false);
  cont();
  assert.deepEqual(screened, ["is this going anywhere"], "screened at advance time");
});

test("no option is presented as the single correct relationship answer", () => {
  render(h(SimulationPlayer, { simulation: WM, onComplete: () => {} }));
  cont();
  for (const re of [/correct/i, /right answer/i, /best choice/i, /\+\d+/]) {
    assert.equal(screen.queryByText(re), null, `no scoring marker: ${re}`);
  }
});
