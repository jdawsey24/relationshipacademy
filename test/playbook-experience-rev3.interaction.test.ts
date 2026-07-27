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
function toBoard() {
  fireEvent.click(screen.getByRole("button", { name: /see what sounds like me/i }));
  fireEvent.click(screen.getByText(/can't always tell what their behavior/i).closest("button")!);
  fireEvent.click(screen.getByRole("button", { name: /show me where to start/i }));
}
const explored: PlaybookProgress = { ...emptyProgress(KEY, 1), play_states: { "read-and-decide": "explored" } };

test("flag ON: entering a Play runs its simulation first", () => {
  mount(true);
  enterPlay();
  assert.ok(screen.getByText(/great first date/i), "simulation runs before the Play");
  assert.equal(screen.queryByText(/one unclear signal can turn into a whole story/i), null, "Play intervention not shown yet");
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
  assert.ok(screen.getByText(/one unclear signal can turn into a whole story/i), "goes straight to the Play (Rev 3 copy)");
  assert.equal(screen.queryByText(/great first date/i), null, "completed sim not repeated");
});

test("flag ON: an explored Play surfaces a Practice mission from the board", () => {
  mount(true, explored);
  toBoard();
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  assert.ok(screen.getByText(/write down what you actually saw/i), "mission opens");
  assert.ok(screen.getByText(/this is for ambiguity, not safety/i), "suitability shown");
  fireEvent.click(screen.getByRole("button", { name: /try this next/i }));
  assert.ok(screen.getByRole("button", { name: /i tried this in real life/i }), "assigned → can report an attempt");
});

test("flag OFF (v0): no Practice affordance on the board", () => {
  mount(false, explored);
  toBoard();
  assert.equal(screen.queryByRole("button", { name: /practice this/i }), null, "no practice surface in v0");
});

const savedRD: PlaybookProgress = {
  ...emptyProgress(KEY, 1),
  play_states: { "read-and-decide": "in_my_plays" },
  outputs: { "read-and-decide": { output_schema_version: 1, play_version: 1, payload: { evidence: "x", rule: { condition: "y", action: "z" } } } },
};

test("flag ON: 'I used this in real life' opens the STRUCTURED Use Review (not the v0 dialog)", () => {
  mount(true, savedRD);
  toBoard();
  fireEvent.click(screen.getByRole("button", { name: /i used this in real life/i }));
  assert.ok(screen.getByText(/what did you actually do differently/i), "structured review opens");
  assert.ok(screen.getByText(/how closely did you use the move/i), "non-evaluative fidelity prompt");
  fireEvent.click(screen.getByLabelText(/^some of it$/i));
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));
  assert.ok(screen.getByRole("heading", { name: /where you might start/i }), "returns to board after review");
});

test("flag OFF (v0): 'I used this in real life' keeps the original Keep/Update dialog", () => {
  mount(false, savedRD);
  toBoard();
  fireEvent.click(screen.getByRole("button", { name: /i used this in real life/i }));
  assert.ok(screen.getByText(/doing it right looks like/i), "v0 fidelity dialog");
  assert.equal(screen.queryByText(/what did you actually do differently/i), null, "no structured review in v0");
});

test("item 1: opening the review does NOT mark the mission reviewed; submitting does", () => {
  mount(true, savedRD);
  toBoard();
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  fireEvent.click(screen.getByRole("button", { name: /try this next/i }));
  fireEvent.click(screen.getByRole("button", { name: /i tried this in real life/i }));
  // open the review, then leave WITHOUT submitting
  fireEvent.click(screen.getByRole("button", { name: /look at how it went/i }));
  assert.ok(screen.getByText(/what did you actually do differently/i), "review opened");
  fireEvent.click(screen.getByRole("button", { name: /back/i }));
  // reopen practice — still 'attempted', NOT reviewed
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  assert.ok(screen.getByRole("button", { name: /look at how it went/i }), "still attempted");
  assert.equal(screen.queryByText(/you've reviewed this practice/i), null, "not reviewed on open");
  // now submit the review
  fireEvent.click(screen.getByRole("button", { name: /look at how it went/i }));
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  assert.ok(screen.getByText(/you've reviewed this practice/i), "reviewed only after submit");
});
