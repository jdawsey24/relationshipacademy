import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import MissionCard from "../components/playbook/MissionCard";
import { MBR_MISSIONS } from "../content/playbook/moving-beyond-rejection-missions";
import type { MissionReport } from "../lib/playbook/contentSchema";

const RD = MBR_MISSIONS.find((m) => m.playId === "read-and-decide")!;

function mount(over: Record<string, unknown> = {}) {
  const calls = { select: 0, reports: [] as MissionReport[], review: 0 };
  render(
    h(MissionCard, {
      mission: RD,
      onSelect: () => (calls.select += 1),
      onReport: (r: MissionReport) => calls.reports.push(r),
      onReview: undefined,
      onExit: () => {},
      ...over,
    }),
  );
  return calls;
}

test("shows title, instruction, what-counts-as-an-attempt, link, and suitability boundary", () => {
  mount();
  assert.ok(screen.getByText(/read it before you react/i), "title");
  assert.ok(screen.getByText(/write down what you actually saw/i), "instruction");
  assert.ok(screen.getByText(/what counts as trying it/i), "attempt meaning");
  assert.ok(screen.getByText(/how it connects/i));
  assert.ok(screen.getByText(/this is for ambiguity, not safety/i), "suitability boundary");
  fireEvent.click(screen.getByRole("button", { name: /try this next/i }));
});

test("selected state: attempt distinct from success; suitability + opportunity are actionable (no failure)", () => {
  const calls = mount({ state: "selected" });
  // all four return outcomes are reportable, none framed as failure
  fireEvent.click(screen.getByRole("button", { name: /i tried this in real life/i }));
  fireEvent.click(screen.getByRole("button", { name: /it didn't feel right or safe for this/i }));
  fireEvent.click(screen.getByRole("button", { name: /the right moment hasn't come up yet/i }));
  fireEvent.click(screen.getByRole("button", { name: /it came up, but i didn't try it/i }));
  assert.deepEqual(calls.reports, ["attempted", "unsuitable", "no_opportunity", "opportunity_not_taken"]);
});

test("a non-attempt report reads as 'not a miss', not a failure", () => {
  mount({ state: "selected", lastReport: "unsuitable" });
  assert.ok(screen.getByText(/that's not a miss/i), "non-failure framing");
  // still able to try it
  assert.ok(screen.getByRole("button", { name: /i tried this in real life/i }));
});

test("attempted leads into the review (Step 7), NOT a progression recommendation", () => {
  mount({ state: "attempted" });
  assert.ok(screen.getByText(/now we can look at what happened in the practice itself/i), "leads into use review");
  assert.equal(screen.queryByText(/ready to stretch/i), null, "no stretch recommendation here");
  assert.equal(screen.queryByRole("button", { name: /try the next one/i }), null, "no advance action");
});

test("attempted with onReview wired shows the review CTA", () => {
  const calls = mount({ state: "attempted", onReview: () => (calls.review += 1) });
  const btn = screen.getByRole("button", { name: /look at how it went/i });
  fireEvent.click(btn);
  assert.equal(calls.review, 1);
});

test("no gamification words render, and no mastery/perfection claim", () => {
  mount({ state: "attempted" });
  for (const re of [/\blevel\b/i, /\bxp\b/i, /streak/i, /badge/i, /\d+%/, /leaderboard/i, /mastered|perfect\b/i]) {
    assert.ok(!screen.queryByText(re), `unwanted: ${re}`);
  }
});
