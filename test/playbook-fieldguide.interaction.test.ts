import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import FieldGuide from "../components/playbook/FieldGuide";
import { MBR_LITERATURE } from "../content/playbook/finding-love-that-feels-mutual-literature";

function mount() {
  return render(h(FieldGuide, { entries: MBR_LITERATURE }));
}

test("browse view splits Core Guides and Common Questions; JIT is not a browse section", () => {
  mount();
  assert.ok(screen.getByText(/read whatever pulls at you/i), "optional, non-sequential framing");
  assert.ok(screen.getByText(/core guides/i));
  assert.ok(screen.getByText(/question reads/i));
  assert.ok(screen.getByText(/related reads/i));
  // no JIT browse section and no JIT entry surfaced as a top-level topic
  assert.equal(screen.queryByText(/quick reads/i), null);
  assert.equal(screen.queryByRole("button", { name: /when one thing becomes everything/i }), null, "JIT not browseable by default");
  // no sequential control in a field guide
  assert.equal(screen.queryByRole("button", { name: /^(continue|next)$/i }), null);
});

test("a previously-surfaced JIT read becomes browseable under 'Previously surfaced'", () => {
  // not shown by default (no JIT seen yet)
  mount();
  assert.equal(screen.queryByText(/previously surfaced/i), null, "hidden until a JIT read is surfaced");
});

test("once surfaced, a JIT read is listed under 'Previously surfaced reads'", () => {
  render(h(FieldGuide, { entries: MBR_LITERATURE, availableJitIds: ["lit-jit-ambiguity-spiral"] }));
  assert.ok(screen.getByText(/previously surfaced reads/i), "section appears");
  assert.ok(screen.getByRole("button", { name: /small change becomes a big story/i }), "the surfaced JIT read is revisitable");
});

test("opening an entry renders its blocks and moves focus to the heading", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: /a .no. is information, not a verdict/i }));
  assert.ok(screen.getByRole("article", { name: /a .no. is information, not a verdict/i }));
  // distinction + guardrail blocks render
  assert.ok(screen.getByText(/event vs\. claim/i), "distinction block");
  assert.ok(screen.getByText(/one data point/i), "guardrail content");
  // focus management: the article heading receives focus on entry
  const active = document.activeElement;
  assert.equal(active?.tagName, "H1");
  assert.match(active?.textContent ?? "", /a .no. is information, not a verdict/i);
  assert.ok(screen.getByRole("button", { name: /all topics/i }));
});

test("related links navigate to another entry, then back returns (and refocuses) the index", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: /a .no. is information, not a verdict/i }));
  const relNav = screen.getByRole("navigation", { name: /related reading/i });
  assert.ok(relNav);
  fireEvent.click(screen.getByRole("button", { name: /behind .what it actually means./i }));
  assert.ok(screen.getByRole("article", { name: /behind .what it actually means./i }), "navigated to related entry");
  fireEvent.click(screen.getByRole("button", { name: /all topics/i }));
  assert.ok(screen.getByText(/read whatever pulls at you/i), "back to index");
  // returning to the index refocuses its heading
  assert.equal(document.activeElement?.tagName, "H1");
});
