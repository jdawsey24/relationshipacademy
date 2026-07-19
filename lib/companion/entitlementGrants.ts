import { getSupabaseAdminClient } from "@/lib/supabase";
import { COMPANION_PRODUCT_KEY } from "@/lib/companion";
import { trackCompanionEvent } from "@/lib/companion/analytics";

// Server-only. Grant/resolve Companion access. Independent of the Academy tier
// ladder; a grant is a companion_entitlements ROW. Extensible source so bundles /
// Academy inclusion / promos / manual grants all reuse this without restructuring.

export type GrantSource = "one_time_purchase" | "bundle" | "academy_inclusion" | "promotional" | "manual_grant" | "subscription";

export interface GrantInput {
  userId: string;
  source: GrantSource;
  stripeCustomerId?: string | null;
  stripeRef?: string | null;      // checkout session / charge / subscription id — idempotency key
  expiresAt?: string | null;      // null = perpetual (one-time purchase)
  grantedBy?: string | null;      // admin actor for manual grants
  notes?: string | null;
}

/** Idempotent by (user, source, stripe_ref). Returns true if a grant is active. */
export async function grantCompanion(input: GrantInput): Promise<boolean> {
  const s = getSupabaseAdminClient();
  try {
    if (input.stripeRef) {
      const { data: existing } = await s.from("companion_entitlements").select("id").eq("user_id", input.userId).eq("stripe_ref", input.stripeRef).maybeSingle();
      if (existing) return true; // already granted for this Stripe object
    }
    const { error } = await s.from("companion_entitlements").insert({
      user_id: input.userId, source: input.source, product_key: COMPANION_PRODUCT_KEY,
      stripe_customer_id: input.stripeCustomerId ?? null, stripe_ref: input.stripeRef ?? null,
      status: "active", expires_at: input.expiresAt ?? null, granted_by: input.grantedBy ?? null, notes: input.notes ?? null,
    });
    if (error) return false;
    await trackCompanionEvent(input.userId, "entitlement_unlocked", { source: input.source });
    return true;
  } catch { return false; }
}

/** Grant from a completed Stripe checkout session (called by the webhook). */
export async function grantFromStripeSession(opts: { userId: string; customerId: string | null; ref: string }): Promise<boolean> {
  return grantCompanion({ userId: opts.userId, source: "one_time_purchase", stripeCustomerId: opts.customerId, stripeRef: opts.ref, expiresAt: null });
}

/** Revoke (e.g. refund/chargeback) — mark grants for a Stripe ref canceled. */
export async function revokeByStripeRef(ref: string): Promise<void> {
  const s = getSupabaseAdminClient();
  try { await s.from("companion_entitlements").update({ status: "canceled", updated_at: new Date().toISOString() }).eq("stripe_ref", ref); } catch { /* resilient */ }
}
