import Stripe from "stripe";

// Server-only Stripe client. Reads the secret key from the environment. The rest
// of the app should call stripeConfigured() before assuming billing is available
// so the site keeps working if keys aren't set (e.g. before go-live).

let client: Stripe | null = null;

export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function getStripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  // Omit apiVersion → use the SDK's pinned default (avoids drift/type mismatch).
  client = new Stripe(key);
  return client;
}
