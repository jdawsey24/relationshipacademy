import { test } from "node:test";
import assert from "node:assert/strict";
import type Stripe from "stripe";
import { CHECKOUT_GRANT_EVENTS, isCheckoutGrantEvent, isPaidSession } from "../lib/stripeCheckoutEvents";

// Regression cover for the delayed-payment (Klarna / bank debit) money bug:
// `checkout.session.completed` can arrive with payment_status "unpaid", and the
// money only lands later on `checkout.session.async_payment_succeeded`.

const session = (payment_status: string) =>
  ({ payment_status }) as unknown as Pick<Stripe.Checkout.Session, "payment_status">;

test("a delayed payment's settlement event can grant", () => {
  assert.ok(isCheckoutGrantEvent("checkout.session.completed"));
  assert.ok(isCheckoutGrantEvent("checkout.session.async_payment_succeeded"));
  assert.equal(CHECKOUT_GRANT_EVENTS.size, 2);
});

test("unrelated events never grant", () => {
  for (const t of [
    "checkout.session.async_payment_failed",
    "checkout.session.expired",
    "charge.refunded",
    "customer.subscription.created",
    "payment_intent.succeeded",
  ]) {
    assert.equal(isCheckoutGrantEvent(t), false, `${t} must not authorize a grant`);
  }
});

test("only a settled session is paid", () => {
  assert.equal(isPaidSession(session("paid")), true);
  // $0 via a 100%-off coupon — nothing to collect, so it counts as paid.
  assert.equal(isPaidSession(session("no_payment_required")), true);
});

test("an UNPAID session must never grant (the Klarna/bank hole)", () => {
  assert.equal(isPaidSession(session("unpaid")), false);
});

test("absent payment status is not treated as paid", () => {
  // Access must never be granted on missing information.
  assert.equal(isPaidSession({ payment_status: undefined } as never), false);
  assert.equal(isPaidSession({} as never), false);
});

test("the two-event sequence resolves correctly for a delayed payment", () => {
  // completed(unpaid) -> withhold; async_payment_succeeded(paid) -> grant.
  const completedUnpaid = { type: "checkout.session.completed", s: session("unpaid") };
  const settled = { type: "checkout.session.async_payment_succeeded", s: session("paid") };
  const grants = (e: { type: string; s: Pick<Stripe.Checkout.Session, "payment_status"> }) =>
    isCheckoutGrantEvent(e.type) && isPaidSession(e.s);

  assert.equal(grants(completedUnpaid), false, "must not hand over the product before payment");
  assert.equal(grants(settled), true, "must grant once the money actually lands");
});

test("an instant card payment still grants on the first event", () => {
  assert.equal(
    isCheckoutGrantEvent("checkout.session.completed") && isPaidSession(session("paid")),
    true,
  );
});
