import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, fireEvent, h, net } from "./helpers/pbTestSetup";
import ExperienceShell from "../components/playbook/ExperienceShell";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { emptyProgress } from "../lib/playbook/contentSchema";

const KEY = "moving-beyond-rejection";
const byName = (re: RegExp) => screen.getByRole("button", { name: re });
const cont = (re: RegExp = /^continue$/i) => fireEvent.click(byName(re));
function clickText(re: RegExp) {
  const el = screen.getByText(re);
  fireEvent.click(el.closest("button") ?? el);
}
function completeSort() {
  for (const g of screen.getAllByRole("group")) {
    const b = g.querySelector("button");
    if (b) fireEvent.click(b);
  }
  cont();
  const radios = screen.queryAllByRole("radio");
  if (radios.length) fireEvent.click(radios[0]);
  cont();
}
function mount() {
  return render(h(ExperienceShell, { content: C, playbookKey: KEY, initialProgress: emptyProgress(KEY, 1) }));
}
function toWMOwnTurn() {
  fireEvent.click(byName(/see what sounds like me/i));
  clickText(/what's wrong with me/i);
  fireEvent.click(byName(/show me where to start/i));
  fireEvent.click(byName(/start/i));
  fireEvent.click(byName(/yes, this happens/i));
  cont(); // shift
  cont(/show me how/i); // literature
  cont(); // learn
  completeSort();
  completeSort();
  completeSort();
}

test("Layer A: a crisis signal in free-text surfaces crisis resources and preserves the user's input", async () => {
  net.crisis = { interrupt: true, heading: "If you're in immediate danger", message: "Reach out now.", resources: [{ label: "988", value: "Call or text 988" }] };
  mount();
  toWMOwnTurn();
  const event = screen.getByPlaceholderText(/one real event/i) as HTMLInputElement;
  fireEvent.change(event, { target: { value: "sensitive text" } });
  fireEvent.blur(event); // → onScreenText → POST /screen (Layer A)

  const alert = await screen.findByRole("alert");
  assert.match(alert.textContent || "", /immediate danger/i, "Layer A crisis banner shown");
  assert.ok(net.calls.some((c) => c.url.includes("/screen")), "screening endpoint (Layer A) was called");
  // crisis detection did NOT overwrite the user's functional Play input
  assert.equal(event.value, "sensitive text", "the user's typed input is preserved");
});

test("Layer B: the Play support signpost is content-driven — it does NOT emit a crisis screening call", () => {
  mount();
  toWMOwnTurn();
  const screenCallsBefore = net.calls.filter((c) => c.url.includes("/screen")).length;
  fireEvent.click(byName(/if this feels bigger than a dating moment/i));
  assert.ok(screen.getByText(/if this is bigger than a dating moment/i), "Layer B signpost rendered");
  const screenCallsAfter = net.calls.filter((c) => c.url.includes("/screen")).length;
  assert.equal(screenCallsAfter, screenCallsBefore, "opening a Play signpost is not a crisis event");
});

test("persistence sends only functional keys — no raw free-text journaling channel", async () => {
  net.crisis = { interrupt: false, heading: null, message: null, resources: [] };
  mount();
  // any progress-changing action triggers a debounced PUT
  fireEvent.click(byName(/see what sounds like me/i));
  clickText(/what's wrong with me/i);
  await new Promise((r) => setTimeout(r, 900)); // let the debounce flush
  const puts = net.calls.filter((c) => c.url.includes("/progress") && c.method === "PUT");
  assert.ok(puts.length >= 1, "a progress PUT fired");
  const allowed = new Set(["playbook_key", "playbook_version", "recognized", "play_states", "outputs", "my_plays"]);
  for (const p of puts) {
    for (const k of Object.keys(p.body as Record<string, unknown>)) {
      assert.ok(allowed.has(k), `progress body key is functional-only: ${k}`);
    }
    // no journaling-style fields
    const b = p.body as Record<string, unknown>;
    for (const banned of ["journal", "notes", "feelings", "mood", "diary"]) {
      assert.ok(!(banned in b), `no ${banned} field in persisted progress`);
    }
  }
});
