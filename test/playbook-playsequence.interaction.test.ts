import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import PlaySequence from "../components/playbook/PlaySequence";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";

const RD = C.plays.find((p) => p.playId === "read-and-decide")!;
const cont = () => fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));

test("the Play FOLLOWS its simulation: the sim runs first, the Play is not shown yet", () => {
  render(h(PlaySequence, { content: C, play: RD, onSaveOutput: () => {}, onExit: () => {} }));
  assert.ok(screen.getByText(/great first date/i), "simulation runs first");
  assert.equal(screen.queryByText(/one unclear signal can turn into a whole story/i), null, "Play intervention not shown yet");
});

test("finishing the simulation records completion and hands into the Play (no literature screen)", () => {
  const completed: { simId: string }[] = [];
  render(h(PlaySequence, { content: C, play: RD, onSaveOutput: () => {}, onExit: () => {}, onSimComplete: (simId: string) => completed.push({ simId }) }));

  // walk the RD simulation to its handoff
  cont(); // m1 → m2
  cont(); // m2 → c1
  fireEvent.click(screen.getByLabelText(/i'm not sure yet/i));
  cont();
  fireEvent.click(screen.getByRole("button", { name: /wait and watch a bit/i }));
  cont(); // → note
  cont(); // → reveal
  cont(); // → reconsider
  fireEvent.click(screen.getByRole("button", { name: /the plan changes what i can reasonably conclude/i }));
  cont(); // → teach
  fireEvent.click(screen.getByRole("button", { name: /open the tool/i }));

  assert.deepEqual(completed, [{ simId: "sim-rd-shorter-texts" }], "simulation completion recorded");
  // now inside the Play, starting at its intervention (shift), NOT a literature screen
  assert.ok(screen.getByText(/one unclear signal can turn into a whole story/i), "entered the Play intervention");
  fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));
  assert.equal(screen.queryByRole("button", { name: /show me how/i }), null, "in-Play literature screen extracted");
  assert.ok(screen.getByText(/three buckets/i), "advances straight to the learn screen");
});

test("resume: with the sim already completed, it goes straight to the Play", () => {
  render(h(PlaySequence, { content: C, play: RD, onSaveOutput: () => {}, onExit: () => {}, simCompleted: true }));
  assert.ok(screen.getByText(/one unclear signal can turn into a whole story/i), "skips the sim on resume");
  assert.equal(screen.queryByText(/great first date/i), null);
});
