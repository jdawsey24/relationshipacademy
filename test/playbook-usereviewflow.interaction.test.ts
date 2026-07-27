import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import UseReviewFlow from "../components/playbook/UseReviewFlow";
import { MBR_USE_REVIEWS } from "../content/playbook/moving-beyond-rejection-usereviews";
import type { UseReviewSignals } from "../lib/playbook/contentSchema";

const RD = MBR_USE_REVIEWS.find((r) => r.playId === "read-and-decide")!;

test("structured selects only — no free-text journaling; non-evaluative fidelity prompt", () => {
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: true, onComplete: () => {} }));
  assert.ok(screen.getByText(/what did you actually do differently/i));
  assert.ok(screen.getByText(/how closely did you use the move/i), "non-evaluative fidelity prompt");
  assert.ok(screen.getByText(/what got clearer/i));
  assert.ok(screen.getByText(/where did you get stuck most/i), "prioritized single friction point");
  assert.equal(screen.queryByRole("textbox"), null, "no free-text field (not journaling)");
});

test("multi-select where more than one response applies; single-select for fidelity + stuck", () => {
  const calls: { s: UseReviewSignals; a: string }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: true, onComplete: (s: UseReviewSignals, a: string) => calls.push({ s, a }) }));
  // "did differently" is multi (checkboxes) — pick two
  fireEvent.click(screen.getByLabelText(/i separated what i saw from what i was guessing/i));
  fireEvent.click(screen.getByLabelText(/i figured out what would actually tell me more/i));
  // fidelity single — "Some of it" → partly
  fireEvent.click(screen.getByLabelText(/^some of it$/i));
  // "what got clearer" multi — pick one
  fireEvent.click(screen.getByLabelText(/what i'd need to see next/i));
  // stuck single
  fireEvent.click(screen.getByLabelText(/acting on what i already saw/i));
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));

  assert.equal(calls[0].a, "keep");
  assert.deepEqual(calls[0].s.didDifferently, ["I separated what I saw from what I was guessing", "I figured out what would actually tell me more"]);
  assert.equal(calls[0].s.performed, "partly", "yes/partly/no still mapped internally");
  assert.deepEqual(calls[0].s.becameClearer, ["What I'd need to see next"]);
  assert.equal(calls[0].s.stuck, "Acting on what I already saw");
  assert.equal(calls[0].s.kept, true);
});

test("stuck is single-select (a later choice replaces the earlier one)", () => {
  const calls: { s: UseReviewSignals }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: true, onComplete: (s: UseReviewSignals) => calls.push({ s }) }));
  fireEvent.click(screen.getByLabelText(/the feeling got loud/i));
  fireEvent.click(screen.getByLabelText(/acting on what i already saw/i));
  fireEvent.click(screen.getByRole("button", { name: /keep it/i }));
  assert.equal(calls[0].s.stuck, "Acting on what I already saw", "single friction point, not a list");
});

test("Update records tool_updated", () => {
  const calls: { s: UseReviewSignals; a: string }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: true, onComplete: (s: UseReviewSignals, a: string) => calls.push({ s, a }) }));
  fireEvent.click(screen.getByRole("button", { name: /update it/i }));
  assert.equal(calls[0].a, "update");
  assert.equal(calls[0].s.updated, true);
});

test("no saved Play → a SAVE decision (not Keep/Update); Save records tool_saved_after_use", () => {
  const calls: { s: UseReviewSignals; a: string }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: false, onComplete: (s: UseReviewSignals, a: string) => calls.push({ s, a }) }));
  assert.equal(screen.queryByRole("button", { name: /keep it/i }), null, "no keep/update without a saved Play");
  assert.ok(screen.getByText(/would this be useful to keep for next time/i));
  fireEvent.click(screen.getByRole("button", { name: /save this play/i }));
  assert.equal(calls[0].a, "save");
  assert.equal(calls[0].s.saved, true);
});

test("no saved Play + 'Not right now' saves nothing", () => {
  const calls: { s: UseReviewSignals; a: string }[] = [];
  render(h(UseReviewFlow, { review: RD, hasSavedOutput: false, onComplete: (s: UseReviewSignals, a: string) => calls.push({ s, a }) }));
  fireEvent.click(screen.getByRole("button", { name: /not right now/i }));
  assert.equal(calls[0].a, "none");
  assert.equal(calls[0].s.saved, undefined);
});
