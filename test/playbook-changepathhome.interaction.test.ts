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
  const calls = { surfaced: [] as SurfacedItem[], understand: 0, seeItPlayOut: 0, useATool: 0, myplays: 0, explore: 0 };
  render(
    h(ChangePathHome, {
      content: C,
      progress,
      displayName: "Believing You're Worth Being Chosen",
      onSurfaced: (i: SurfacedItem) => calls.surfaced.push(i),
      onUnderstand: () => (calls.understand += 1),
      onSeeItPlayOut: () => (calls.seeItPlayOut += 1),
      onUseATool: () => (calls.useATool += 1),
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

test("shows 'A useful next step' and routes the primary CTA to the surfaced item", () => {
  const calls = mount(practiced);
  assert.ok(screen.getByText(/welcome back/i));
  assert.ok(screen.getByText(/a useful next step/i));
  assert.ok(screen.getByText(/take it into real life/i), "context-bound next step");
  fireEvent.click(screen.getByRole("button", { name: /practice this in real life/i }));
  assert.ok(calls.surfaced.some((s) => s.kind === "practice" && s.playId === RD), "routes to the Practice layer");
});

test("the FULL Playbook architecture stays visible, grouped into three buckets, never a clinical plan", () => {
  const calls = mount(practiced);
  // three consumer buckets
  assert.ok(screen.getByRole("heading", { name: /^learn$/i }), "Learn bucket");
  assert.ok(screen.getByRole("heading", { name: /work on it/i }), "Work on it bucket");
  assert.ok(screen.getByRole("heading", { name: /keep .* explore/i }), "Keep & explore bucket");
  // every major consumer function is discoverable from the home
  assert.ok(screen.getByRole("button", { name: /understand the pattern/i }), "Understand → Field Guide");
  assert.ok(screen.getByRole("button", { name: /see it play out/i }), "Experience → simulation library");
  assert.ok(screen.getByRole("button", { name: /use a tool/i }), "Play → Play library");
  assert.ok(screen.getByRole("button", { name: /practice in real life/i }), "Practice (no active mission)");
  assert.ok(screen.getByRole("button", { name: /explore another area/i }), "Explore → pathway picker");
  // wired to their dedicated handlers
  fireEvent.click(screen.getByRole("button", { name: /understand the pattern/i }));
  fireEvent.click(screen.getByRole("button", { name: /see it play out/i }));
  fireEvent.click(screen.getByRole("button", { name: /use a tool/i }));
  fireEvent.click(screen.getByRole("button", { name: /explore another area/i }));
  assert.equal(calls.understand, 1);
  assert.equal(calls.seeItPlayOut, 1, "See It Play Out → Experience library (not a Play)");
  assert.equal(calls.useATool, 1, "Use a Tool → Play library");
  assert.equal(calls.explore, 1);
  for (const re of [/treatment/i, /diagnos/i, /clinical/i, /your plan\b/i, /assessment/i]) {
    assert.equal(screen.queryByText(re), null, `no clinical framing: ${re}`);
  }
});

test("active mission (selected) → rich 'What I'm practicing'; Practice tile folds into it", () => {
  const withMission: PlaybookProgress = {
    ...practiced,
    practice_state: { version: 1, currentMissionId: "mission-rd-read-before-react", missions: { "mission-rd-read-before-react": { state: "selected" } } },
  };
  mount(withMission);
  assert.ok(screen.getByText(/what i'm practicing/i));
  assert.ok(screen.getByText(/read it before you react/i), "the current mission title");
  assert.ok(!screen.queryByRole("button", { name: /practice in real life/i }), "generic Practice tile folds into the active card");
});

test("attempted mission → Integrate 'Look at how it went' surfaces AND Practice stays discoverable", () => {
  const attempted: PlaybookProgress = {
    ...practiced,
    practice_state: { version: 1, currentMissionId: "mission-rd-read-before-react", missions: { "mission-rd-read-before-react": { state: "attempted", attemptCount: 1 } } },
  };
  const calls = mount(attempted);
  assert.ok(screen.getAllByText(/look at how it went/i).length > 0, "pending Use Review surfaced");
  assert.ok(!screen.queryByText(/what i'm practicing/i), "attempted is pending review, not 'What I'm practicing'");
  assert.ok(screen.getByRole("button", { name: /practice in real life/i }), "Practice layer remains discoverable");
  const looks = screen.getAllByRole("button", { name: /look at how it went/i });
  fireEvent.click(looks[looks.length - 1]);
  assert.ok(calls.surfaced.some((s) => s.kind === "review" && s.playId === RD), "Integrate routes to the Use Review");
});

test("reviewed mission → no active card, no pending review; offers another real-life practice", () => {
  const reviewed: PlaybookProgress = {
    ...practiced,
    practice_state: { version: 1, currentMissionId: "mission-rd-read-before-react", missions: { "mission-rd-read-before-react": { state: "reviewed" } } },
    use_review_state: { version: 1, reviews: { [RD]: [{ performed: "partly" }] } },
  };
  mount(reviewed);
  assert.ok(!screen.queryByText(/what i'm practicing/i), "no active card once reviewed");
  assert.ok(!screen.queryByText(/look at how it went/i), "nothing pending to review");
  assert.ok(screen.getByRole("button", { name: /practice in real life/i }), "offers another real-life practice");
});

test("'Integrate' does not show an empty section when there is nothing to review", () => {
  mount(practiced); // saved output, no mission attempted
  assert.ok(!screen.queryByText(/look at how it went/i), "no empty Integrate section");
});

test("Home surfaces a persistent 'Log a Real-Life Experience' entry that routes to that Play's review", () => {
  const calls = mount(practiced); // RD explored + has a Use Review → loggable
  const btn = screen.getByRole("button", { name: /log a real-life experience/i });
  fireEvent.click(btn);
  assert.ok(calls.surfaced.some((s) => s.kind === "review" && s.playId === RD), "routes to the Use Review for that Play");
});

test("Home 'Log a Real-Life Experience' shows a running count once experiences are logged", () => {
  const logged: PlaybookProgress = {
    ...practiced,
    play_states: { [RD]: "used" },
    use_review_state: { version: 1, reviews: { [RD]: [{ performed: "yes" }, { performed: "partly" }] } },
  };
  mount(logged);
  assert.ok(screen.getByText(/log a real-life experience/i), "log entry present");
  assert.ok(screen.getByText(/2 experiences/i), "shows how many real-life experiences have been logged");
});

test("Home 'View all' opens the logged-experience history for that Play", () => {
  const logged: PlaybookProgress = {
    ...practiced,
    play_states: { [RD]: "used" },
    use_review_state: { version: 1, reviews: { [RD]: [{ performed: "yes" }, { performed: "partly" }] } },
  };
  const calls = mount(logged);
  fireEvent.click(screen.getByRole("button", { name: /view all/i }));
  assert.ok(calls.surfaced.some((s) => s.kind === "history" && s.playId === RD), "routes to the history for that Play");
});
