import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import PlayContainer from "../components/playbook/PlayContainer";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";

const RD = C.plays.find((p) => p.playId === "read-and-decide")!;

function mount() {
  const saved: Record<string, unknown>[] = [];
  const routed: string[] = [];
  const utils = render(
    h(PlayContainer, {
      play: RD,
      onSaveOutput: (p: Record<string, unknown>) => saved.push(p),
      onExit: () => {},
      onRoute: (id: string) => routed.push(id),
      onScreenText: () => {},
    }),
  );
  return { saved, routed, ...utils };
}
const cont = (re: RegExp = /^continue$/i) => fireEvent.click(screen.getByRole("button", { name: re }));
function assignAll() {
  for (const g of screen.getAllByRole("group")) {
    const b = g.querySelector("button");
    if (b) fireEvent.click(b);
  }
}
function completeScenario() {
  assignAll();
  cont(); // SortEngine continue
  const radios = screen.queryAllByRole("radio");
  if (radios.length) fireEvent.click(radios[0]);
  cont(); // evidence continue
}

test("full walkthrough produces a correct executable output; rule builder is gated", () => {
  const { saved } = mount();
  cont(); // shift → Continue
  cont(/show me how/i); // literature → Show me how
  cont(); // learn → Continue
  // scenario 1: place "They're losing interest" in "Saw it" → correction
  const losing = screen.getByRole("group", { name: /They're losing interest/i });
  const sawBtn = Array.from(losing.querySelectorAll("button")).find((b) => b.textContent?.includes("Saw it"))!;
  fireEvent.click(sawBtn);
  assert.ok(screen.getByText(/That's a guess, not something you saw/i), "inference→observation correction fired");
  completeScenario();
  completeScenario(); // scenario 2
  // ownTurn
  const q = screen.getByPlaceholderText(/is this going somewhere/i);
  fireEvent.change(q, { target: { value: "Is this going somewhere?" } });
  fireEvent.blur(q);
  cont(); // ownTurn → Continue
  // ruleBuilder: gated until condition + action + control-check
  const looksRight = screen.getByRole("button", { name: /looks right/i }) as HTMLButtonElement;
  assert.equal(looksRight.disabled, true, "rule disabled with nothing set");
  const condition = screen.getByRole("textbox");
  fireEvent.change(condition, { target: { value: "they keep cancelling" } });
  const action = screen.getByRole("combobox") as HTMLSelectElement;
  fireEvent.change(action, { target: { value: "invest a little less for now" } });
  assert.equal(looksRight.disabled, true, "still gated until control-check");
  fireEvent.click(screen.getByRole("checkbox"));
  assert.equal(looksRight.disabled, false, "enabled once condition + action + control-check");
  fireEvent.click(looksRight);
  // output
  fireEvent.click(screen.getByRole("button", { name: /save to my plays/i }));
  assert.equal(saved.length, 1, "output saved once");
  const out = saved[0] as { question?: string; rule?: { condition: string; action: string } };
  assert.equal(out.question, "Is this going somewhere?");
  assert.equal(out.rule?.condition, "they keep cancelling");
  assert.equal(out.rule?.action, "invest a little less for now");
});

test("the if/then action set is user-controlled and non-gamey (no scorekeeping/mirroring)", () => {
  const rb = RD.screens.find((s) => s.kind === "ruleBuilder");
  assert.ok(rb && rb.kind === "ruleBuilder");
  const actions = (rb as { actions: string[] }).actions.join(" | ").toLowerCase();
  assert.ok(actions.includes("invest a little less"), "user-choice investment option present");
  for (const banned of ["pull back", "stop texting first", "mirror", "match their", "give less"]) {
    assert.ok(!actions.includes(banned), `banned dating-game phrasing absent: ${banned}`);
  }
  // control-check keeps it about the user's own move, not controlling the other person
  assert.match((rb as { controlCheck: string }).controlCheck, /not a way to get them to chase/i);
});
