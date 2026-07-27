import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import UseReviewFlow from "../components/playbook/UseReviewFlow";
import { MBR_USE_REVIEWS } from "../content/playbook/moving-beyond-rejection-usereviews";
import type { UseReviewSignals } from "../lib/playbook/contentSchema";

const RD = MBR_USE_REVIEWS.find((r) => r.playId === "read-and-decide")!;

test("structured selects only — no free-text journaling", () => {
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: true, onComplete: () => {} }));
  assert.ok(screen.getByText(/what did you actually do differently/i));
  assert.ok(screen.getByText(/did you run the move the way it's meant to work/i), "fidelity prompt");
  assert.ok(screen.getByText(/what got clearer/i));
  assert.ok(screen.getByText(/where did you get stuck/i));
  assert.equal(screen.queryByRole("textbox"), null, "no free-text field (not journaling)");
});

test("captures functional signals; Keep records kept=true", () => {
  const calls: { s: UseReviewSignals; a: string }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: true, onComplete: (s: UseReviewSignals, a: string) => calls.push({ s, a }) }));
  fireEvent.click(screen.getByLabelText(/i separated what i saw from what i was guessing/i));
  fireEvent.click(screen.getByLabelText(/^partly$/i));
  fireEvent.click(screen.getByLabelText(/what i'd need to see next/i));
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].a, "keep");
  assert.equal(calls[0].s.performed, "partly", "yes/partly/no fidelity mapped");
  assert.equal(calls[0].s.kept, true);
  assert.match(calls[0].s.didDifferently ?? "", /separated what i saw/i);
});

test("Update records updated=true", () => {
  const calls: { s: UseReviewSignals; a: string }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: true, onComplete: (s: UseReviewSignals, a: string) => calls.push({ s, a }) }));
  fireEvent.click(screen.getByRole("button", { name: /update it/i }));
  assert.equal(calls[0].a, "update");
  assert.equal(calls[0].s.updated, true);
});

test("no saved output shows a plain Done (no Keep/Update)", () => {
  const calls: { a: string }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: false, onComplete: (_s: UseReviewSignals, a: string) => calls.push({ a }) }));
  assert.ok(!screen.queryByRole("button", { name: /keep it/i }), "no keep/update without a saved output");
  fireEvent.click(screen.getByRole("button", { name: /^done$/i }));
  assert.equal(calls[0].a, "none");
});
