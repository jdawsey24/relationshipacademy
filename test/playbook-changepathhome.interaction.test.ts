import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import ChangePathHome from "../components/playbook/ChangePathHome";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { emptyProgress, type PlaybookProgress } from "../lib/playbook/contentSchema";
import type { SurfacedItem } from "../lib/playbook/changePath";

const RD = "read-and-decide";

function mount(progress: PlaybookProgress) {
  const calls = { surfaced: [] as SurfacedItem[], understand: 0, board: 0, myplays: 0, explore: 0 };
  render(
    h(ChangePathHome, {
      content: C,
      progress,
      displayName: "Moving Beyond Rejection",
      onSurfaced: (i: SurfacedItem) => calls.surfaced.push(i),
      onUnderstand: () => (calls.understand += 1),
      onWhereToStart: () => (calls.board += 1),
      onMyPlays: () => (calls.myplays += 1),
      onExplore: () => (calls.explore += 1),
    }),
  );
  return calls;
}

const practiced: PlaybookProgress = {
  ...emptyProgress("moving-beyond-rejection", 1),
  recognized: ["rec-evidence"],
  play_states: { [RD]: "in_my_plays" },
  outputs: { [RD]: { output_schema_version: 1, play_version: 1, payload: {} } },
};

test("shows 'Your next step' and routes the primary CTA to the surfaced item", () => {
  const calls = mount(practiced);
  assert.ok(screen.getByText(/welcome back/i));
  assert.ok(screen.getByText(/your next step/i));
  assert.ok(screen.getByText(/take it into real life/i), "context-bound next step");
  fireEvent.click(screen.getByRole("button", { name: /practice this in real life/i }));
  assert.equal(calls.surfaced.length, 1);
  assert.equal(calls.surfaced[0].kind, "practice");
  assert.equal(calls.surfaced[0].playId, RD);
});

test("entry points are wired; never framed as a clinical plan/diagnosis", () => {
  const calls = mount(practiced);
  fireEvent.click(screen.getByRole("button", { name: /understand this pattern/i }));
  fireEvent.click(screen.getByRole("button", { name: /where you might start/i }));
  fireEvent.click(screen.getByRole("button", { name: /explore another area/i }));
  assert.equal(calls.understand, 1);
  assert.equal(calls.board, 1);
  assert.equal(calls.explore, 1);
  for (const re of [/treatment/i, /diagnos/i, /clinical/i, /your plan\b/i, /assessment/i]) {
    assert.equal(screen.queryByText(re), null, `no clinical framing: ${re}`);
  }
});

test("'What I'm practicing' shows the one current mission", () => {
  const withMission: PlaybookProgress = {
    ...practiced,
    practice_state: { version: 1, currentMissionId: "mission-rd-read-before-react", missions: { "mission-rd-read-before-react": { state: "attempted" } } },
  };
  mount(withMission);
  assert.ok(screen.getByText(/what i'm practicing/i));
  assert.ok(screen.getByText(/read it before you react/i), "the current mission title");
});

test("'What I'm practicing' is not shown once the practice is reviewed", () => {
  const reviewed: PlaybookProgress = {
    ...practiced,
    practice_state: { version: 1, currentMissionId: "mission-rd-read-before-react", missions: { "mission-rd-read-before-react": { state: "reviewed" } } },
  };
  mount(reviewed);
  assert.ok(!screen.queryByText(/what i'm practicing/i), "not shown once reviewed");
});
