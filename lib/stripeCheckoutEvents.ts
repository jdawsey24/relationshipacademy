import type Stripe from "stripe";

// Which Stripe checkout events can carry a completed one-time purchase, and what
// actually authorizes a grant.
//
// Klarna and bank debits are DELAYED NOTIFICATION methods: the buyer finishes
// checkout and `checkout.session.completed` fires with payment_status "unpaid",
// then the money settles minutes-to-days later and
// `checkout.session.async_payment_succeeded` fires with "paid". Listening only to
// `completed` gets it wrong in one of two ways — grant on "unpaid" and you give
// the product away before being paid; withhold on "unpaid" with no async handler
// and a paying customer never gets access at all.
//
// So: handle both events, and let PAYMENT STATUS authorize the grant. Every
// grant is idempotent, so the double delivery is safe.
//
// Lives in lib/ (not the route) so it is importable and unit-testable.

export const CHECKOUT_GRANT_EVENTS = new Set<string>([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

/** Whether this event can carry a completed one-time purchase. */
export function isCheckoutGrantEvent(eventType: string): boolean {
  return CHECKOUT_GRANT_EVENTS.has(eventType);
}

/**
 * Whether Stripe considers the session actually paid. "no_payment_required" is
 * the $0 case (a 100%-off coupon) and counts as paid. A missing status is NOT
 * treated as paid — access must never be granted on absent information.
 */
export function isPaidSession(s: Pick<Stripe.Checkout.Session, "payment_status">): boolean {
  return s.payment_status === "paid" || s.payment_status === "no_payment_required";
}
