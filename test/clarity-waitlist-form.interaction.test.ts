import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, userEvent, h } from "./helpers/pbTestSetup";
import ClarityWaitlistForm from "../components/site/ClarityWaitlistForm";
import { CLARITY } from "../lib/datingWithClarity";

// The thank-you screen is where the free guide is actually delivered, so it is
// worth driving for real rather than reading. The Turnstile widget does not draw
// in an automated browser, which is why this could not be checked by clicking
// through the live page.

const props = {
  classTime: CLARITY.time,
  guideTitle: CLARITY.guide.title,
  guideHref: CLARITY.guide.href,
};

const posted: { url: string; body: unknown }[] = [];
(globalThis as unknown as { fetch: unknown }).fetch = async (url: string, init?: RequestInit) => {
  posted.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
  return { ok: true, json: async () => ({ ok: true }) };
};

test("submitting the form hands over the guide, and sends the answers", async () => {
  posted.length = 0;
  const user = userEvent.setup();
  render(h(ClarityWaitlistForm, props));

  await user.type(screen.getByLabelText(/first name/i), "Maya");
  await user.type(screen.getByLabelText(/email address/i), "maya@example.com");
  await user.type(screen.getByLabelText(/most confusing or difficult/i), "Telling a moment from a pattern.");
  await user.click(screen.getByRole("button", { name: /join the priority waitlist/i }));

  // The answers reach the endpoint under the names the table expects.
  const sent = posted[0]?.body as Record<string, string>;
  assert.equal(posted[0]?.url, "/api/dating-with-clarity/waitlist");
  assert.equal(sent.email, "maya@example.com");
  assert.equal(sent.first_name, "Maya");
  assert.equal(sent.hardest_part, "Telling a moment from a pattern.");

  // And the guide is right there, as a download, not a promise of an email.
  const download = await screen.findByRole("link", { name: new RegExp(CLARITY.guide.title, "i") });
  assert.equal(download.getAttribute("href"), CLARITY.guide.href);
  assert.ok(download.hasAttribute("download"));

  // The form is gone — one thing to do on this screen.
  assert.equal(screen.queryByRole("button", { name: /join the priority waitlist/i }), null);
});

test("an address the browser accepts but we do not never reaches the endpoint", async () => {
  // "maya@example" passes the browser's own type=email check — no dot required —
  // so it gets past the native validation and reaches our own. That gap is the
  // only reason the hand-written check earns its place; testing it with
  // "not-an-address" would just be testing the browser, which stops the submit
  // before any of this code runs.
  posted.length = 0;
  const user = userEvent.setup();
  render(h(ClarityWaitlistForm, props));

  await user.type(screen.getByLabelText(/email address/i), "maya@example");
  await user.click(screen.getByRole("button", { name: /join the priority waitlist/i }));

  assert.equal(posted.length, 0, "nothing should have been posted");
  assert.ok(screen.getByText(/valid email address/i));
  assert.equal(screen.queryByRole("link", { name: new RegExp(CLARITY.guide.title, "i") }), null,
    "the guide must not appear to somebody who is not on the list");
});
