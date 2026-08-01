import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, within, h } from "./helpers/pbTestSetup";
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
  fireEvent.click(screen.getByText(/can't always tell what someone/i).closest("button")!);
  fireEvent.click(screen.getByRole("button", { name: /show me where to start/i }));
}
// Returning (home) flow → board. The board is now the recognition/pathway picker reached via
// "Explore Another Area"; "Use a Tool" opens the dedicated Play library instead.
function homeToBoard() {
  fireEvent.click(screen.getByRole("button", { name: /explore another area/i }));
}

const recognized = ["rec-evidence"];
const output = { output_schema_version: 1, play_version: 1, payload: { evidence: "x", rule: { condition: "y", action: "z" } } };
const simDone: PlaybookProgress = { ...emptyProgress(KEY, 1), recognized, simulation_state: { version: 1, runs: { "sim-rd-shorter-texts": { completed: true, fidelity: { signature: "evidenceTimeline", evidence_reconsidered: "demonstrated", interpretation_response_appropriate: "demonstrated" } } } } };
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
  assert.ok(screen.getByText(/one small thing can turn into a big story/i), "v0 Play directly");
  assert.equal(screen.queryByText(/great first date/i), null);
});

test("flag ON: a completed simulation is not repeated", () => {
  mount(true, simDone);
  homeToBoard();
  const rdCard = screen.getByText(/can't always tell what someone/i).closest("li")!;
  fireEvent.click(within(rdCard).getByRole("button", { name: /start|revisit/i }));
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

test("flag ON: 'Log a real-life experience' opens the STRUCTURED Use Review", () => {
  mount(true, savedR);
  homeToBoard();
  fireEvent.click(screen.getByRole("button", { name: /log a real-life experience/i }));
  assert.ok(screen.getByText(/what was the experience/i), "optional free-text description");
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

test("My Plays: 'Edit this Play' opens the output editor for a Play that has one", () => {
  const myPlaysR: PlaybookProgress = {
    ...emptyProgress(KEY, 1), recognized,
    play_states: { [RD]: "in_my_plays" },
    outputs: { [RD]: output },
    my_plays: [{ play_id: RD, play_version: 1, name: "Read It, Then Decide", when: "w", move: "m", lookingFor: "l", watchOut: "wo", remember: "r" }],
  };
  mount(true, myPlaysR);
  fireEvent.click(screen.getByRole("button", { name: /my plays/i }));
  fireEvent.click(screen.getByRole("button", { name: /edit this play/i }));
  assert.ok(screen.getByRole("button", { name: /save changes/i }), "output editor opened");
  // Modal: while editing, the My Plays list is hidden — nothing to navigate past, so the editor
  // can't be left stranded over another screen.
  assert.equal(screen.queryByRole("heading", { name: /^my plays$/i }), null, "list hidden while editing");
  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  assert.equal(screen.queryByRole("button", { name: /save changes/i }), null, "editor closes on cancel");
  assert.ok(screen.getByRole("heading", { name: /^my plays$/i }), "returns to My Plays after cancel");
  // Editing from My Plays must NOT hijack My Plays' own Back (it returns to where My Plays was opened).
  fireEvent.click(screen.getByRole("button", { name: /^← back$/i }));
  assert.ok(screen.getByText(/welcome back/i), "My Plays Back returns to the home, not to itself");
});

test("logged experiences: 'View all' opens a history of every logged real-life experience, newest first", () => {
  const logged: PlaybookProgress = {
    ...savedR,
    play_states: { [RD]: "used" },
    use_review_state: { version: 1, reviews: { [RD]: [
      { performed: "yes", experience: "first note", didDifferently: ["I separated what I saw from what I was guessing"], at: "2026-07-20T10:00:00.000Z" },
      { performed: "partly", experience: "second note", stuck: "The feeling got loud", at: "2026-07-27T10:00:00.000Z" },
    ] } },
  };
  mount(true, logged);
  homeToBoard();
  assert.ok(screen.getByText(/logged 2 experiences in real life/i), "count on the card");
  fireEvent.click(screen.getByRole("button", { name: /view all/i }));
  assert.ok(screen.getByRole("heading", { name: /real-life experiences/i }), "history view");
  assert.ok(screen.getByText(/first note/i), "shows an older entry");
  assert.ok(screen.getByText(/second note/i), "shows the newest entry");
  assert.ok(screen.getByText(/used it closely/i), "plain-words fidelity per entry");
  assert.ok(screen.getByText(/used some of it/i));
  const body = document.body.textContent ?? "";
  assert.ok(body.indexOf("second note") < body.indexOf("first note"), "newest first");
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

// ---- Back navigation returns to the launch point (Home vs Board) --------------

test("Home → 'See It Play Out' opens the simulation library with context (not a drop-in)", () => {
  mount(true, savedR);
  fireEvent.click(screen.getByRole("button", { name: /see it play out/i }));
  assert.ok(screen.getByRole("heading", { name: /see it play out/i }), "the Experience library");
  assert.ok(screen.getByText(/read it, then decide/i), "RD scenario listed by name");
  assert.ok(screen.getByText(/what it actually means/i), "WM scenario listed by name");
  assert.equal(screen.queryByText(/great first date/i), null, "did NOT drop straight into a scenario");
});

test("picking a scenario steps straight in (no recognition gate); Back returns to the library", () => {
  mount(true, savedR);
  fireEvent.click(screen.getByRole("button", { name: /see it play out/i }));
  fireEvent.click(screen.getAllByRole("button", { name: /step (into|through) it/i })[0]);
  assert.ok(screen.getByText(/great first date/i), "stepped straight into the scenario");
  assert.equal(screen.queryByRole("button", { name: /yes, this happens/i }), null, "no recognition gate");
  fireEvent.click(screen.getByRole("button", { name: /^← back$/i }));
  assert.ok(screen.getByRole("heading", { name: /see it play out/i }), "back in the Experience library");
});

test("Home → 'Use a Tool' opens the Play library (only approved Plays, with when-it-helps)", () => {
  mount(true, savedR);
  fireEvent.click(screen.getByRole("button", { name: /use a tool/i }));
  assert.ok(screen.getByRole("heading", { name: /use a tool/i }), "the Play library");
  assert.ok(screen.getAllByText(/when it helps/i).length >= 2, "each card explains when it helps");
  assert.ok(screen.getByText(/read it, then decide/i), "RD Play listed");
  assert.ok(screen.getByText(/what it actually means/i), "WM Play listed");
  assert.ok(screen.getByText(/is this right for you/i), "the dualAttention Play listed");
  assert.ok(screen.getByText(/rest, or giving up/i), "the decisionRoom Play listed");
  assert.ok(screen.getByText(/how much to put in/i), "the investmentView Play listed");
  assert.ok(screen.getByText(/say the real thing/i), "the communicationRehearsal Play listed");
  // exactly the built Plays are offered (all six)
  assert.equal(screen.getAllByRole("button", { name: /start|revisit/i }).length, 6, "only the built Plays");
});

test("Home → 'Practice in Real Life' → Back returns to the Home, not the board", () => {
  mount(true, savedR);
  fireEvent.click(screen.getByRole("button", { name: /practice in real life/i }));
  assert.ok(screen.getByText(/write down what you actually saw/i), "at the mission");
  fireEvent.click(screen.getByRole("button", { name: /^← back$/i }));
  assert.ok(screen.getByText(/welcome back/i), "back on the Home");
});

test("Board → Start → Back still returns to the board (regression)", () => {
  mount(true, savedR);
  homeToBoard();
  const rdCard = screen.getByText(/can't always tell what someone/i).closest("li")!;
  fireEvent.click(within(rdCard).getByRole("button", { name: /start|revisit/i }));
  assert.ok(screen.getByRole("button", { name: /yes, this happens/i }), "at the gate");
  fireEvent.click(screen.getByRole("button", { name: /back to board/i }));
  assert.ok(screen.getByRole("heading", { name: /where you might start/i }), "back on the board");
});

// ---- JIT literature surfaced in-context (from the simulation) ------------------

test("flag ON: the simulation's 'Related read' surfaces the JIT entry as an overlay without losing sim state", () => {
  mount(true);
  openingToBoard();
  fireEvent.click(screen.getByRole("button", { name: /start/i }));
  fireEvent.click(screen.getByRole("button", { name: /yes, this happens/i }));
  // walk the sim to the first capture, which carries the JIT anchor
  fireEvent.click(screen.getByRole("button", { name: /^continue$/i })); // m1 → m2
  fireEvent.click(screen.getByRole("button", { name: /^continue$/i })); // m2 → c1
  assert.ok(screen.getAllByText(/what do you think the shorter texts mean/i).length > 0, "at the capture");
  const jit = screen.getByRole("button", { name: /related read/i });
  assert.ok(jit, "JIT 'Related read' is wired into the simulation");

  fireEvent.click(jit);
  assert.ok(screen.getByText(/when a small change becomes a big story/i), "JIT entry surfaced");
  // the simulation stays mounted underneath — no state loss
  assert.ok(screen.getAllByText(/what do you think the shorter texts mean/i).length > 0, "sim still mounted under the overlay");

  fireEvent.click(screen.getByRole("button", { name: /^done$/i }));
  assert.equal(screen.queryByText(/when a small change becomes a big story/i), null, "overlay dismissed");
  assert.ok(screen.getAllByText(/what do you think the shorter texts mean/i).length > 0, "back in the simulation, state intact");
});

// ---- Change Path home ---------------------------------------------------------

test("home: 'Understand the Pattern' opens the field guide", () => {
  mount(true, savedR);
  fireEvent.click(screen.getByRole("button", { name: /understand the pattern/i }));
  assert.ok(screen.getByText(/read whatever pulls at you/i), "field guide opens");
});

test("home: the Your-Next-Step CTA routes into the surfaced experience", () => {
  mount(true, practicedR); // practiced-in-app → next step is real-world practice
  assert.ok(screen.getByText(/a useful next step/i));
  fireEvent.click(screen.getByRole("button", { name: /practice this in real life/i }));
  assert.ok(screen.getByText(/write down what you actually saw/i), "routed to the mission");
});
