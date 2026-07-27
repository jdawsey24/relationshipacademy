import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h } from "./helpers/pbTestSetup";
import PlayContainer from "../components/playbook/PlayContainer";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";

const WM = C.plays.find((p) => p.playId === "what-it-actually-means")!;

function mount() {
  const saved: Record<string, unknown>[] = [];
  const routed: string[] = [];
  const utils = render(
    h(PlayContainer, {
      play: WM,
      onSaveOutput: (p: Record<string, unknown>) => saved.push(p),
      onExit: () => {},
      onRoute: (id: string) => routed.push(id),
      onScreenText: () => {},
    }),
  );
  return { saved, routed, ...utils };
}
const cont = (re: RegExp = /^continue$/i) => fireEvent.click(screen.getByRole("button", { name: re }));
function completeSort() {
  for (const g of screen.getAllByRole("group")) {
    const b = g.querySelector("button");
    if (b) fireEvent.click(b);
  }
  cont(); // SortEngine continue
  const radios = screen.queryAllByRole("radio");
  if (radios.length) fireEvent.click(radios[0]);
  cont(); // fallback/evidence continue
}
function toScenarioA() {
  cont(); // shift
  cont(/show me how/i); // literature
  cont(); // learn
}

test("a global self-verdict placed under 'supports' triggers the intended correction", () => {
  mount();
  toScenarioA();
  const g = screen.getByRole("group", { name: /I'm not enough/i });
  const supportsBtn = Array.from(g.querySelectorAll("button")).find((b) => b.textContent?.includes("supports"))!;
  fireEvent.click(supportsBtn);
  assert.ok(screen.getByText(/That's the story, not the evidence/i), "verdict→supports correction fired");
});

test("full walkthrough builds a bounded conclusion; emotion beat + pattern route present", () => {
  const { saved, routed } = mount();
  toScenarioA();
  completeSort(); // A
  completeSort(); // B
  completeSort(); // C (pattern)
  // ownTurn
  const event = screen.getByPlaceholderText(/one real event/i);
  fireEvent.change(event, { target: { value: "They said not a match" } });
  fireEvent.blur(event);
  const conclusion = screen.getByPlaceholderText(/what you turned it into/i);
  fireEvent.change(conclusion, { target: { value: "I'm the problem" } });
  fireEvent.blur(conclusion);
  cont(); // ownTurn → Continue
  // sentence builder (bounded conclusion)
  const ta = screen.getByRole("textbox");
  fireEvent.change(ta, { target: { value: "This person didn't want to keep dating me." } });
  cont();
  // emotion beat: preserves the hurt AND offers the pattern route (no invented cause)
  assert.ok(screen.getByText(/and this can still hurt/i), "emotion beat preserves the feeling");
  fireEvent.click(screen.getByRole("button", { name: /that pattern's worth looking at/i }));
  assert.deepEqual(routed, ["read-and-decide"], "pattern branch routes to Read It, Then Decide (no cause invented)");
  cont(); // emotion beat → Continue (routing does not consume the flow)
  // output
  fireEvent.click(screen.getByRole("button", { name: /save to my plays/i }));
  assert.equal(saved.length, 1);
  const out = saved[0] as { event?: string; narrowest_true_thing?: string };
  assert.equal(out.event, "They said not a match");
  assert.equal(out.narrowest_true_thing, "This person didn't want to keep dating me.");
});

test("the support signpost (Layer B) renders on demand and is content-driven", () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: /if this feels bigger than a dating moment/i }));
  assert.ok(screen.getByText(/if this is bigger than a dating moment/i), "signpost heading rendered");
  assert.ok(screen.getByText(/mental health professional/i), "signpost points to professional support (no diagnosis)");
});
