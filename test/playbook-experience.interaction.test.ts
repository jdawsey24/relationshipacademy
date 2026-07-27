import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import axe from "axe-core";
import { render, screen, fireEvent, within, h } from "./helpers/pbTestSetup";
import ExperienceShell from "../components/playbook/ExperienceShell";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { emptyProgress, type PlaybookProgress } from "../lib/playbook/contentSchema";

const KEY = "moving-beyond-rejection";

function mount(progress: PlaybookProgress = emptyProgress(KEY, 1)) {
  return render(h(ExperienceShell, { content: C, playbookKey: KEY, initialProgress: progress }));
}
function clickText(re: RegExp) {
  const el = screen.getByText(re);
  fireEvent.click(el.closest("button") ?? el);
}
function toBoard(...recognize: RegExp[]) {
  fireEvent.click(screen.getByRole("button", { name: /see what sounds like me/i })); // opening → recognition
  for (const re of recognize) clickText(re);
  fireEvent.click(screen.getByRole("button", { name: /show me where to start/i })); // recognition → board
}

test("recognition selections surface the expected pathway cards on the board", () => {
  mount();
  toBoard(/can't always tell/i);
  // built pathway recognized → shows a Start button; unrecognized ones aren't shown yet
  assert.ok(screen.getByRole("button", { name: /start/i }), "the recognized pathway shows a Start button");
  assert.ok(screen.getByRole("button", { name: /start|revisit/i }), "a built pathway card is shown");
  // the self-editing pathway was NOT recognized → not on the default board
  assert.equal(screen.queryByText(/change myself so they'll keep liking me/i), null);
});

test("'Explore another area' reveals all pathways (incl. coming-soon) and never locks", () => {
  mount();
  toBoard(/can't always tell/i);
  fireEvent.click(screen.getByRole("button", { name: /explore another area/i }));
  // now the not-yet-built pathways appear, honestly marked "coming soon"
  assert.ok(screen.getAllByText(/coming soon/i).length >= 1, "unbuilt pathways shown as coming soon");
  assert.ok(screen.getByText(/change myself so they'll keep liking me/i), "a non-recognized pathway is now explorable");
  // toggling back returns to just the starting points
  fireEvent.click(screen.getByRole("button", { name: /show just my starting points/i }));
  assert.equal(screen.queryByText(/coming soon/i), null);
});

test("'I handle this okay' skips the Play and returns without entering it", () => {
  mount();
  toBoard(/can't always tell/i);
  fireEvent.click(screen.getByRole("button", { name: /start/i })); // → gate
  fireEvent.click(screen.getByRole("button", { name: /i handle this okay/i }));
  assert.ok(screen.getByText(/that's a real strength/i), "strengths affirmation shown");
  // did NOT enter the play (no play 'shift' copy present)
  assert.equal(screen.queryByText(/one small thing can turn into a big story/i), null);
  fireEvent.click(screen.getByRole("button", { name: /back to the board/i }));
  assert.ok(screen.getByRole("button", { name: /start/i }), "returned to board");
});

test("play state transition: gate → Yes enters the play (explored)", () => {
  mount();
  toBoard(/can't always tell/i);
  fireEvent.click(screen.getByRole("button", { name: /start/i }));
  fireEvent.click(screen.getByRole("button", { name: /yes, this happens/i }));
  assert.ok(screen.getByText(/one small thing can turn into a big story/i), "entered the play (shift screen)");
});

test("saved progress restores on re-entry (recognized + play state + My Plays)", () => {
  const restored: PlaybookProgress = {
    ...emptyProgress(KEY, 1),
    recognized: ["rec-evidence"],
    play_states: { "read-and-decide": "in_my_plays" },
    my_plays: [{ play_id: "read-and-decide", play_version: 1, name: "Read It, Then Decide", when: "w", move: "m", lookingFor: "l", watchOut: "wo", remember: "r" }],
  };
  mount(restored);
  // recognition reflects the prior selection (✓)
  fireEvent.click(screen.getByRole("button", { name: /see what sounds like me/i }));
  const recBtn = screen.getByText(/can't always tell/i).closest("button");
  assert.ok(recBtn?.textContent?.includes("✓"), "prior recognition restored");
  // board reflects saved state + My Plays count
  fireEvent.click(screen.getByRole("button", { name: /show me where to start/i }));
  assert.ok(screen.getByRole("button", { name: /revisit/i }), "saved play shows Revisit");
  assert.ok(screen.getByRole("button", { name: /my plays \(1\)/i }), "My Plays count restored");
});

test("My Plays view renders saved cards; empty state otherwise", () => {
  const withCard: PlaybookProgress = {
    ...emptyProgress(KEY, 1),
    recognized: ["rec-evidence"],
    play_states: { "read-and-decide": "in_my_plays" },
    my_plays: [{ play_id: "read-and-decide", play_version: 1, name: "Read It, Then Decide", when: "when-x", move: "move-x", lookingFor: "l", watchOut: "wo", remember: "remember-x" }],
  };
  mount(withCard);
  toBoard(); // no new recognition; goes to board (recognized restored)
  fireEvent.click(screen.getByRole("button", { name: /my plays \(1\)/i }));
  assert.ok(screen.getByText("when-x"));
  assert.ok(screen.getByText("remember-x"));
});

test("'Used in real life' opens the fidelity return/review with the Play's guidance", () => {
  const explored: PlaybookProgress = {
    ...emptyProgress(KEY, 1),
    recognized: ["rec-evidence"],
    play_states: { "read-and-decide": "explored" },
  };
  mount(explored);
  toBoard();
  fireEvent.click(screen.getByRole("button", { name: /i used this in real life/i }));
  assert.ok(screen.getByRole("dialog", { name: /how did it go/i }), "used-review opens");
  assert.ok(screen.getByText(/doing it right looks like/i), "surfaces authored fidelity.correct");
  assert.ok(screen.getByText(/a date ending isn't a failure/i), "outcome≠success stated");
  fireEvent.click(screen.getByRole("button", { name: /mark as used/i }));
  // after used, the 'I used this' affordance is gone (state === used)
  assert.equal(screen.queryByRole("button", { name: /i used this in real life/i }), null);
});

function withSavedRD(): PlaybookProgress {
  return {
    ...emptyProgress(KEY, 1),
    recognized: ["rec-evidence"],
    play_states: { "read-and-decide": "in_my_plays" },
    outputs: { "read-and-decide": { output_schema_version: 1, play_version: 1, payload: { evidence: "how they act on the plan", rule: { condition: "they keep cancelling", action: "put in a little less for now" } } } },
    my_plays: [{ play_id: "read-and-decide", play_version: 1, name: "Read It, Then Decide", when: "w", move: "m", lookingFor: "l", watchOut: "wo", remember: "r", userLine: "how they act on the plan · If they keep cancelling → put in a little less for now" }],
  };
}

test("Used → Keep preserves the saved output unchanged and stays 'Used'", () => {
  mount(withSavedRD());
  toBoard();
  fireEvent.click(screen.getByRole("button", { name: /i used this in real life/i }));
  assert.ok(screen.getByText(/does the play you saved still fit/i), "keep/update prompt appears (saved output exists)");
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));
  // stays used (the 'I used this' affordance is gone), output unchanged
  assert.equal(screen.queryByRole("button", { name: /i used this in real life/i }), null, "state is now Used");
  fireEvent.click(screen.getByRole("button", { name: /my plays/i }));
  assert.ok(screen.getByText(/they keep cancelling/i), "saved answer preserved unchanged");
});

test("Used → Update opens the prefilled editor; the change propagates to My Plays; stays 'Used'", () => {
  mount(withSavedRD());
  toBoard();
  fireEvent.click(screen.getByRole("button", { name: /i used this in real life/i }));
  fireEvent.click(screen.getByRole("button", { name: /update it/i }));
  // editor is the narrow output editor, prefilled
  assert.ok(screen.getByRole("form", { name: /update your read and plan/i }), "output editor opened");
  const condition = screen.getByLabelText(/if i see/i) as HTMLInputElement;
  assert.equal(condition.value, "they keep cancelling", "editor prefilled from the saved output");
  fireEvent.change(condition, { target: { value: "they follow through consistently" } });
  fireEvent.change(screen.getByLabelText(/then i will/i), { target: { value: "put in a little more" } });
  fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
  // still Used, and the updated output propagates to My Plays
  assert.equal(screen.queryByRole("button", { name: /i used this in real life/i }), null, "remains Used after Update");
  fireEvent.click(screen.getByRole("button", { name: /my plays/i }));
  assert.ok(screen.getByText(/they follow through consistently/i), "updated output propagated to My Plays");
  assert.equal(screen.queryByText(/they keep cancelling/i), null, "old value replaced");
});

test("axe: no serious/critical violations on the recognition + board states", async () => {
  const { container } = mount();
  fireEvent.click(screen.getByRole("button", { name: /see what sounds like me/i }));
  const r1 = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  const bad1 = r1.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  assert.deepEqual(bad1.map((v) => v.id), [], "recognition a11y: " + JSON.stringify(bad1.map((v) => v.id)));
  clickText(/can't always tell/i);
  fireEvent.click(screen.getByRole("button", { name: /show me where to start/i }));
  const r2 = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  const bad2 = r2.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  assert.deepEqual(bad2.map((v) => v.id), [], "board a11y: " + JSON.stringify(bad2.map((v) => v.id)));
});
