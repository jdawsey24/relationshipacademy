import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import ExperienceShell from "../components/playbook/ExperienceShell";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { emptyProgress, type PlaybookProgress } from "../lib/playbook/contentSchema";

const KEY = "moving-beyond-rejection";

function mount(rev3: boolean, progress: PlaybookProgress = emptyProgress(KEY, 1)) {
  return render(h(ExperienceShell, { content: C, playbookKey: KEY, initialProgress: progress, rev3 }));
}
function enterPlay() {
  fireEvent.click(screen.getByRole("button", { name: /see what sounds like me/i }));
  fireEvent.click(screen.getByText(/can't always tell what their behavior/i).closest("button")!);
  fireEvent.click(screen.getByRole("button", { name: /show me where to start/i }));
  fireEvent.click(screen.getByRole("button", { name: /start/i }));
  fireEvent.click(screen.getByRole("button", { name: /yes, this happens/i }));
}

test("flag ON: entering a Play runs its simulation first", () => {
  mount(true);
  enterPlay();
  assert.ok(screen.getByText(/great first date/i), "simulation runs before the Play");
  assert.equal(screen.queryByText(/an unclear signal can turn into a whole story/i), null, "Play intervention not shown yet");
});

test("flag OFF (v0 default): entering a Play goes straight to the Play — unchanged", () => {
  mount(false);
  enterPlay();
  assert.ok(screen.getByText(/an unclear signal can turn into a whole story/i), "v0 Play intervention shown directly");
  assert.equal(screen.queryByText(/great first date/i), null, "no simulation in v0");
});

test("flag ON: a completed simulation is not repeated on re-entry", () => {
  const progress: PlaybookProgress = {
    ...emptyProgress(KEY, 1),
    simulation_state: { version: 1, runs: { "sim-rd-shorter-texts": { completed: true, fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" } } } },
  };
  mount(true, progress);
  enterPlay();
  assert.ok(screen.getByText(/an unclear signal can turn into a whole story/i), "goes straight to the Play");
  assert.equal(screen.queryByText(/great first date/i), null, "completed sim not repeated");
});
