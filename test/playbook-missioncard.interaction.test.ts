import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import MissionCard from "../components/playbook/MissionCard";
import { MBR_MISSIONS } from "../content/playbook/moving-beyond-rejection-missions";

const RD = MBR_MISSIONS.find((m) => m.playId === "read-and-decide")!;

function mount(over: Record<string, unknown> = {}) {
  const calls = { select: 0, attempt: 0, advance: [] as string[] };
  render(
    h(MissionCard, {
      mission: RD,
      onSelect: () => (calls.select += 1),
      onAttempt: () => (calls.attempt += 1),
      onAdvance: (id: string) => calls.advance.push(id),
      onExit: () => {},
      ...over,
    }),
  );
  return calls;
}

test("shows the assignment, its link to the operation, and a suitability boundary", () => {
  mount();
  assert.ok(screen.getByText(/write down what you actually saw/i), "behaviorally specific instruction");
  assert.ok(screen.getByText(/how it connects/i));
  assert.ok(screen.getByText(/this is for ambiguity, not safety/i), "suitability boundary shown");
});

test("select → attempt → optional stretch; no mastery claim, no gamification", () => {
  const calls = mount();
  fireEvent.click(screen.getByRole("button", { name: /try this next/i }));
  assert.equal(calls.select, 1);
});

test("assigned state offers 'I tried this'; attempted acknowledges the attempt and offers the next stretch", () => {
  const calls = mount({ state: "assigned" });
  fireEvent.click(screen.getByRole("button", { name: /i tried this in real life/i }));
  assert.equal(calls.attempt, 1);

  const calls2 = mount({ state: "attempted" });
  assert.ok(screen.getByText(/that's the point — trying the move, not getting it perfect/i), "no mastery/perfection claim");
  assert.ok(screen.getByText(/ready to stretch this a little further/i), "consumer-copy next stretch");
  const next = RD.progression![0];
  fireEvent.click(screen.getByRole("button", { name: /try the next one/i }));
  assert.deepEqual(calls2.advance, [next.id]);
});

test("no gamification words render", () => {
  mount({ state: "attempted" });
  for (const re of [/\blevel\b/i, /\bxp\b/i, /streak/i, /badge/i, /\d+%/, /leaderboard/i, /\d+ points/i]) {
    assert.ok(!screen.queryByText(re), `no gamification: ${re}`);
  }
});
