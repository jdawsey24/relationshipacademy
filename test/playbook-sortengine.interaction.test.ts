import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, userEvent, h } from "./helpers/pbTestSetup";
import SortEngine from "../components/playbook/SortEngine";
import type { SortBucket, SortItem } from "../lib/playbook/contentSchema";

const buckets: SortBucket[] = [
  { id: "supports", label: "Supports" },
  { id: "cant", label: "Can't prove" },
];
const items: SortItem[] = [
  { id: "verdict", text: "I'm not enough", correctBucket: "cant", correction: "That's the story, not the evidence." },
  { id: "fact", text: "They said not a match" }, // non-scored: no correctBucket
];

function mount(onComplete: (a: Record<string, string>) => void = () => {}) {
  return render(h(SortEngine, { buckets, items, onComplete }));
}

function bucketBtn(itemText: string, bucketLabel: string): HTMLButtonElement {
  const group = screen.getByRole("group", { name: new RegExp(itemText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
  return Array.from(group.querySelectorAll("button")).find((b) => b.textContent?.includes(bucketLabel)) as HTMLButtonElement;
}

test("tap-to-assign updates aria-pressed (no drag needed)", () => {
  mount();
  const btn = bucketBtn("They said not a match", "Supports");
  assert.equal(btn.getAttribute("aria-pressed"), "false");
  fireEvent.click(btn);
  assert.equal(btn.getAttribute("aria-pressed"), "true");
  // the other bucket for the same item stays unpressed → SR reflects the assignment
  assert.equal(bucketBtn("They said not a match", "Can't prove").getAttribute("aria-pressed"), "false");
});

test("keyboard-only assignment works (focus + Enter)", async () => {
  mount();
  const user = userEvent.setup();
  const btn = bucketBtn("They said not a match", "Supports");
  btn.focus();
  assert.equal(document.activeElement, btn);
  await user.keyboard("{Enter}");
  assert.equal(btn.getAttribute("aria-pressed"), "true");
});

test("continue is disabled until every item is assigned, then enabled", () => {
  const calls: Record<string, string>[] = [];
  mount((a) => calls.push(a));
  const cont = screen.getByRole("button", { name: /continue/i });
  assert.equal((cont as HTMLButtonElement).disabled, true);
  fireEvent.click(bucketBtn("I'm not enough", "Can't prove"));
  assert.equal((cont as HTMLButtonElement).disabled, true); // one still unassigned
  fireEvent.click(bucketBtn("They said not a match", "Supports"));
  assert.equal((cont as HTMLButtonElement).disabled, false);
  fireEvent.click(cont);
  assert.deepEqual(calls[0], { verdict: "cant", fact: "supports" });
});

test("correction appears ONLY on the wrong bucket for a criterion item", () => {
  mount();
  // wrong bucket → correction
  fireEvent.click(bucketBtn("I'm not enough", "Supports"));
  assert.ok(screen.queryByText(/That's the story/), "correction shown on wrong placement");
  // moving to the correct bucket clears it
  fireEvent.click(bucketBtn("I'm not enough", "Can't prove"));
  assert.equal(screen.queryByText(/That's the story/), null, "correction cleared on correct placement");
});

test("non-scored items are never treated as right/wrong (no correction ever)", () => {
  mount();
  fireEvent.click(bucketBtn("They said not a match", "Supports"));
  fireEvent.click(bucketBtn("They said not a match", "Can't prove"));
  // there is no correction text anywhere for the non-scored item
  assert.equal(document.body.textContent?.includes("That's the story"), false);
});

test("focus moves to the correction when it appears (a11y)", () => {
  mount();
  fireEvent.click(bucketBtn("I'm not enough", "Supports"));
  const correction = document.getElementById("pb-correction-verdict");
  assert.ok(correction, "correction element exists");
  assert.equal(document.activeElement, correction, "focus moved to the correction");
  assert.equal(correction!.getAttribute("role"), "status");
});
