import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, h, net } from "./helpers/pbTestSetup";
import PlaybookCta, { showsOpen } from "../components/site/PlaybookCta";

const props = { clusterId: 1, slug: "finding-love-that-feels-mutual", buyLabel: "Get this Playbook — $29" };

test("showsOpen only when the viewer owns an interactive playbook", () => {
  assert.equal(showsOpen(undefined), false);
  assert.equal(showsOpen({ signedIn: true, interactive: true, owned: false }), false);
  assert.equal(showsOpen({ signedIn: true, interactive: false, owned: true }), false);
  assert.equal(showsOpen({ signedIn: true, interactive: true, owned: true }), true);
});

test("an owner sees 'Open your Playbook' → the interactive route, plus the PDF as secondary", async () => {
  net.access = { signedIn: true, interactive: true, owned: true };
  render(h(PlaybookCta, props));
  const open = await screen.findByRole("link", { name: /open your playbook/i });
  assert.equal(open.getAttribute("href"), "/playbook/finding-love-that-feels-mutual");
  const pdf = screen.getByRole("link", { name: /prefer the pdf/i });
  assert.equal(pdf.getAttribute("href"), "/api/playbooks/1/download");
  assert.equal(screen.queryByRole("button", { name: /get this playbook/i }), null, "no buy button for an owner");
});

test("a non-owner sees the buy button, never the interactive link", async () => {
  net.access = { signedIn: true, interactive: true, owned: false };
  render(h(PlaybookCta, props));
  // buy button is the default/initial render and remains after the access check resolves
  assert.ok(screen.getByRole("button", { name: /get this playbook/i }));
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(screen.queryByRole("link", { name: /open your playbook/i }), null);
});
