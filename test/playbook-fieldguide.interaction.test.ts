import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import FieldGuide from "../components/playbook/FieldGuide";
import { MBR_LITERATURE } from "../content/playbook/moving-beyond-rejection-literature";

function mount() {
  return render(h(FieldGuide, { entries: MBR_LITERATURE }));
}

test("browse view lists topics under scope sections; nothing is required", () => {
  mount();
  assert.ok(screen.getByText(/read whatever pulls at you/i), "optional, non-sequential framing");
  assert.ok(screen.getByText(/the big picture/i), "cluster section header");
  assert.ok(screen.getByRole("button", { name: /what .difficulty feeling chosen. really is/i }));
  // no sequential 'continue'/'next' control in a field guide
  assert.equal(screen.queryByRole("button", { name: /^(continue|next)$/i }), null);
});

test("opening an entry shows its body and a back-to-topics control", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: /a .no. is not a verdict on you/i }));
  assert.ok(screen.getByRole("article", { name: /a .no. is not a verdict on you/i }));
  assert.ok(screen.getByText(/one person saying .not a match. is one person/i));
  assert.ok(screen.getByRole("button", { name: /all topics/i }));
});

test("related links navigate to another entry (navigable, non-sequential)", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: /a .no. is not a verdict on you/i }));
  // related nav present; follow one
  const relNav = screen.getByRole("navigation", { name: /related reading/i });
  assert.ok(relNav);
  fireEvent.click(screen.getByRole("button", { name: /behind .what it actually means./i }));
  assert.ok(screen.getByRole("article", { name: /behind .what it actually means./i }), "navigated to the related entry");
  // back returns to the index
  fireEvent.click(screen.getByRole("button", { name: /all topics/i }));
  assert.ok(screen.getByText(/read whatever pulls at you/i));
});
