import type Stripe from "stripe";
import { getStripe, stripeIsLive } from "@/lib/stripe";
import { livemodeMatches } from "@/lib/companion/entitlementReliability";
import { COMPANION_PRICE_LOOKUP_KEY, COMPANION_RETURNING_PRICE_LOOKUP_KEY } from "@/lib/companion";

// ---- 1b-iii) Companion sold as a CROSS-SELL on a Playbook checkout ----
// A Stripe cross-sell adds a SECOND line item to a session whose metadata still
// reads product_key "playbook", so applyCompanionGrant — which keys off that
// metadata — never sees it. Without this the upsell buyer is CHARGED and granted
// nothing. Detect it by the price lookup_key on the line items and grant through
// the normal Companion path, so the payment_intent link (and therefore the
// existing refund/dispute revocation) is preserved.
//
// Runs only from applyPlaybookGrant, after the buyer's user_id is resolved —
// which is also what makes it work for a GUEST who bought both at once.
// Standalone Companion purchases are unaffected (applyCompanionGrant still owns
// those); if both paths ever saw the same session the duplicate insert returns
// "already_granted", so no double grant.
export async function applyCompanionCrossSell(
  s: Stripe.Checkout.Session, userId: string, livemode: boolean,
): Promise<void> {
  try {
    // Stripe stays authoritative for payment: only grant on a settled session.
    if (s.payment_status && s.payment_status !== "paid" && s.payment_status !== "no_payment_required") return;
    // Environment separation: a test-mode event must never grant in a live env.
    if (!livemodeMatches(stripeIsLive(), livemode)) return;

    const wanted = new Set([COMPANION_PRICE_LOOKUP_KEY, COMPANION_RETURNING_PRICE_LOOKUP_KEY]);
    const items = await getStripe().checkout.sessions.listLineItems(s.id, { limit: 20 });
    const hasCompanion = items.data.some((i) => {
      const lookupKey = i.price?.lookup_key ?? null;
      return lookupKey !== null && wanted.has(lookupKey);
    });
    if (!hasCompanion) return;

    const customerId = typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
    const paymentIntentId = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null;
    const { grantFromStripeSession } = await import("@/lib/companion/entitlementGrants");
    const result = await grantFromStripeSession({ userId, customerId, ref: s.id, paymentIntentId, livemode: livemode });
    console.log(`[stripe/webhook] companion cross-sell on ${s.id}: ${result}`);

    // Access email once, only on a fresh grant (not on idempotent replays). A
    // guest gets their set-password link in the Playbook delivery email; this one
    // is the Companion's own welcome.
    if (result === "granted") {
      const email = s.customer_details?.email ?? s.customer_email ?? null;
      if (email) {
        const { sendCompanionAccessEmail } = await import("@/lib/companion/email");
        const origin = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
        await sendCompanionAccessEmail(email, `${origin}/companion/welcome?purchase=success`);
      }
    }
  } catch (e) {
    // Never fail the Playbook grant over the add-on; log loudly so a missed
    // Companion can be placed by hand.
    console.error(
      `[stripe/webhook] COMPANION CROSS-SELL FAILED for session ${s.id} (user ${userId}):`,
      e instanceof Error ? e.message : e,
    );
  }
}
