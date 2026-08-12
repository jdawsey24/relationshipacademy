import "global-jsdom/register";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen, userEvent, h } from "./helpers/pbTestSetup";
import ClarityWaitlistForm, { leaveTo } from "../components/site/ClarityWaitlistForm";
import { CLARITY } from "../lib/datingWithClarity";

// Driving the real form, because clicking through the live page cannot: the
// Turnstile widget does not draw in an automated browser.
//
// What this has to prove is that a successful signup LEAVES. The first version
// swapped the form for a confirmation box in place, which the owner never saw —
// the page collapsed under her and left her looking at the footer.

const THANK_YOU = "/dating-with-clarity/waitlist/thank-you";
const props = { classTime: CLARITY.time, thankYouHref: THANK_YOU };

// jsdom forbids navigating AND forbids replacing window.location, so the
// component routes its one navigation through `leaveTo` and this watches that.
const went: string[] = [];
leaveTo.href = (url: string) => { went.push(url); };

const posted: { url: string; body: unknown }[] = [];
(globalThis as unknown as { fetch: unknown }).fetch = async (url: string, init?: RequestInit) => {
  posted.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
  return { ok: true, json: async () => ({ ok: true }) };
};

test("a successful signup leaves the form and lands on the thank-you page", async () => {
  posted.length = 0;
  went.length = 0;
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

  // And she is taken somewhere she cannot be scrolled past.
  assert.deepEqual(went, [THANK_YOU]);
});

test("an address the browser accepts but we do not never reaches the endpoint", async () => {
  // "maya@example" passes the browser's own type=email check — no dot required —
  // so it gets past the native validation and reaches our own. That gap is the
  // only reason the hand-written check earns its place; testing it with
  // "not-an-address" would just be testing the browser, which stops the submit
  // before any of this code runs.
  posted.length = 0;
  went.length = 0;
  const user = userEvent.setup();
  render(h(ClarityWaitlistForm, props));

  await user.type(screen.getByLabelText(/email address/i), "maya@example");
  await user.click(screen.getByRole("button", { name: /join the priority waitlist/i }));

  assert.equal(posted.length, 0, "nothing should have been posted");
  assert.ok(screen.getByText(/valid email address/i));
  assert.deepEqual(went, [], "she must not be sent to the thank-you page");
});
