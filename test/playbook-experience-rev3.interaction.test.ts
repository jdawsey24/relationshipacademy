import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import ExperienceShell from "../components/playbook/ExperienceShell";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { emptyProgress, type PlaybookProgress } from "../lib/playbook/contentSchema";

const KEY = "moving-beyond-rejection";
const RD = "read-and-decide";

function mount(rev3: boolean, progress: PlaybookProgress = emptyProgress(KEY, 1)) {
  return render(h(ExperienceShell, { content: C, playbookKey: KEY, initialProgress: progress, rev3 }));
}
// First-time (opening) flow → recognizes rec-evidence and lands on the board.
function openingToBoard() {
  fireEvent.click(screen.getByRole("button", { name: /see what sounds like me/i }));
  fireEvent.click(screen.getByText(/can't always tell what their behavior/i).closest("button")!);
  fireEvent.click(screen.getByRole("button", { name: /show me where to start/i }));
}
// Returning (home) flow → board.
function homeToBoard() {
  fireEvent.click(screen.getByRole("button", { name: /where you might start/i }));
}

const recognized = ["rec-evidence"];
const output = { output_schema_version: 1, play_version: 1, payload: { evidence: "x", rule: { condition: "y", action: "z" } } };
const simDone: PlaybookProgress = { ...emptyProgress(KEY, 1), recognized, simulation_state: { version: 1, runs: { "sim-rd-shorter-texts": { completed: true, fidelity: { evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" } } } } };
const exploredR: PlaybookProgress = { ...emptyProgress(KEY, 1), recognized, play_states: { [RD]: "explored" } };
const savedR: PlaybookProgress = { ...emptyProgress(KEY, 1), recognized, play_states: { [RD]: "in_my_plays" }, outputs: { [RD]: output } };
const practicedR: PlaybookProgress = { ...emptyProgress(KEY, 1), recognized, play_states: { [RD]: "in_my_plays" }, outputs: { [RD]: output } };

// ---- landing / resume ---------------------------------------------------------

test("flag ON, first-time: lands on the opening (not the home)", () => {
  mount(true);
  assert.ok(screen.getByRole("button", { name: /see what sounds like me/i }));
  assert.equal(screen.queryByText(/welcome back/i), null);
});

test("flag ON, returning: resumes on the home, not onboarding", () => {
  mount(true, savedR);
  assert.ok(screen.getByText(/welcome back/i), "returning user lands on the home");
  assert.equal(screen.queryByRole("button", { name: /see what sounds like me/i }), null, "not the opening");
});

test("flag OFF, returning: v0 opening unchanged", () => {
  mount(false, savedR);
  assert.ok(screen.getByRole("button", { name: /see what sounds like me/i }), "v0 opening");
  assert.equal(screen.queryByText(/welcome back/i), null, "no Rev 3 home in v0");
});

// ---- Experience (sim → play) --------------------------------------------------

test("flag ON, first-time: entering a Play runs its simulation first", () => {
  mount(true);
  openingToBoard();
  fireEvent.click(screen.getByRole("button", { name: /start/i }));
  fireEvent.click(screen.getByRole("button", { name: /yes, this happens/i }));
  assert.ok(screen.getByText(/great first date/i), "simulation runs first");
});

test("flag OFF, first-time: goes straight to the Play (v0)", () => {
  mount(false);
  openingToBoard();
  fireEvent.click(screen.getByRole("button", { name: /start/i }));
  fireEvent.click(screen.getByRole("button", { name: /yes, this happens/i }));
  assert.ok(screen.getByText(/an unclear signal can turn into a whole story/i), "v0 Play directly");
  assert.equal(screen.queryByText(/great first date/i), null);
});

test("flag ON: a completed simulation is not repeated", () => {
  mount(true, simDone);
  homeToBoard();
  fireEvent.click(screen.getByRole("button", { name: /start/i }));
  fireEvent.click(screen.getByRole("button", { name: /yes, this happens/i }));
  assert.ok(screen.getByText(/one unclear signal can turn into a whole story/i), "straight to the Play (Rev 3 copy)");
  assert.equal(screen.queryByText(/great first date/i), null);
});

// ---- Practice -----------------------------------------------------------------

test("flag ON: an explored Play surfaces a Practice mission", () => {
  mount(true, exploredR);
  homeToBoard();
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  assert.ok(screen.getByText(/write down what you actually saw/i), "mission opens");
  assert.ok(screen.getByText(/this is for ambiguity, not safety/i), "suitability shown");
  fireEvent.click(screen.getByRole("button", { name: /try this next/i }));
  assert.ok(screen.getByRole("button", { name: /i tried this in real life/i }));
});

test("flag OFF: no Practice affordance", () => {
  mount(false, { ...emptyProgress(KEY, 1), play_states: { [RD]: "explored" } });
  openingToBoard();
  assert.equal(screen.queryByRole("button", { name: /practice this/i }), null);
});

// ---- Integrate (structured Use Review) ---------------------------------------

test("flag ON: 'I used this in real life' opens the STRUCTURED Use Review", () => {
  mount(true, savedR);
  homeToBoard();
  fireEvent.click(screen.getByRole("button", { name: /i used this in real life/i }));
  assert.ok(screen.getByText(/what did you actually do differently/i), "structured review");
  assert.ok(screen.getByText(/how closely did you use the move/i), "non-evaluative fidelity prompt");
  fireEvent.click(screen.getByLabelText(/^some of it$/i));
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));
  assert.ok(screen.getByRole("heading", { name: /where you might start/i }), "returns to board");
});

test("flag OFF: 'I used this in real life' keeps the v0 Keep/Update dialog", () => {
  mount(false, { ...emptyProgress(KEY, 1), play_states: { [RD]: "in_my_plays" }, outputs: { [RD]: output } });
  openingToBoard();
  fireEvent.click(screen.getByRole("button", { name: /i used this in real life/i }));
  assert.ok(screen.getByText(/doing it right looks like/i), "v0 dialog");
  assert.equal(screen.queryByText(/what did you actually do differently/i), null);
});

test("item 1: opening the review does NOT mark the mission reviewed; submitting does", () => {
  mount(true, savedR);
  homeToBoard();
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  fireEvent.click(screen.getByRole("button", { name: /try this next/i }));
  fireEvent.click(screen.getByRole("button", { name: /i tried this in real life/i }));
  fireEvent.click(screen.getByRole("button", { name: /look at how it went/i }));
  assert.ok(screen.getByText(/what did you actually do differently/i), "review opened");
  fireEvent.click(screen.getByRole("button", { name: /back/i }));
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  assert.ok(screen.getByRole("button", { name: /look at how it went/i }), "still attempted");
  assert.equal(screen.queryByText(/you've reviewed this practice/i), null, "not reviewed on open");
  fireEvent.click(screen.getByRole("button", { name: /look at how it went/i }));
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));
  fireEvent.click(screen.getByRole("button", { name: /practice this/i }));
  assert.ok(screen.getByText(/you've reviewed this practice/i), "reviewed only after submit");
});

// ---- Change Path home ---------------------------------------------------------

test("home: 'Understand this pattern' opens the field guide", () => {
  mount(true, savedR);
  fireEvent.click(screen.getByRole("button", { name: /understand this pattern/i }));
  assert.ok(screen.getByText(/read whatever pulls at you/i), "field guide opens");
});

test("home: the Your-Next-Step CTA routes into the surfaced experience", () => {
  mount(true, practicedR); // practiced-in-app → next step is real-world practice
  assert.ok(screen.getByText(/your next step/i));
  fireEvent.click(screen.getByRole("button", { name: /practice this in real life/i }));
  assert.ok(screen.getByText(/write down what you actually saw/i), "routed to the mission");
});
