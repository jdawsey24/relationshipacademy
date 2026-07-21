import { getSupabaseAdminClient } from "@/lib/supabase";

// Server-only. Grant / resolve Playbook ownership. A grant is a
// playbook_entitlements ROW (one per user+cluster). Mirrors the Companion
// entitlement pattern so bundles / promos / manual grants all reuse it.

export type PlaybookGrantSource = "one_time_purchase" | "promotional" | "manual_grant";

export interface PlaybookGrantInput {
  userId: string;
  clusterId: number;
  source?: PlaybookGrantSource;
  stripeCustomerId?: string | null;
  stripeRef?: string | null;   // checkout session / charge id — idempotency key
  grantedBy?: string | null;
  notes?: string | null;
}

/** Idempotent. Returns true if the user owns this playbook after the call. */
export async function grantPlaybook(input: PlaybookGrantInput): Promise<boolean> {
  const s = getSupabaseAdminClient();
  try {
    // Already own it? (covers webhook retries and repeat purchases)
    const { data: existing } = await s
      .from("playbook_entitlements")
      .select("id")
      .eq("user_id", input.userId)
      .eq("cluster_id", input.clusterId)
      .eq("status", "active")
      .maybeSingle();
    if (existing) return true;

    const { error } = await s.from("playbook_entitlements").insert({
      user_id: input.userId,
      cluster_id: input.clusterId,
      source: input.source ?? "one_time_purchase",
      stripe_customer_id: input.stripeCustomerId ?? null,
      stripe_ref: input.stripeRef ?? null,
      status: "active",
      granted_by: input.grantedBy ?? null,
      notes: input.notes ?? null,
    });
    // A unique-violation means a concurrent grant already landed — treat as owned.
    if (error && error.code !== "23505") return false;
    return true;
  } catch {
    return false;
  }
}

/** Grant from a completed Stripe checkout session (called by the webhook). */
export async function grantPlaybookFromStripeSession(opts: {
  userId: string; clusterId: number; customerId: string | null; ref: string;
}): Promise<boolean> {
  return grantPlaybook({
    userId: opts.userId, clusterId: opts.clusterId, source: "one_time_purchase",
    stripeCustomerId: opts.customerId, stripeRef: opts.ref,
  });
}

/** True if the user owns an active grant for this playbook. */
export async function ownsPlaybook(userId: string, clusterId: number): Promise<boolean> {
  const s = getSupabaseAdminClient();
  try {
    const { data } = await s
      .from("playbook_entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("cluster_id", clusterId)
      .eq("status", "active")
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

/** All cluster ids the user currently owns (for the My Playbooks page). */
export async function getOwnedPlaybookClusterIds(userId: string): Promise<number[]> {
  const s = getSupabaseAdminClient();
  try {
    const { data } = await s
      .from("playbook_entitlements")
      .select("cluster_id")
      .eq("user_id", userId)
      .eq("status", "active");
    return ((data ?? []) as { cluster_id: number }[]).map((r) => r.cluster_id);
  } catch {
    return [];
  }
}

/** True if the user owns at least one playbook (drives the Companion discount). */
export async function ownsAnyPlaybook(userId: string): Promise<boolean> {
  return (await getOwnedPlaybookClusterIds(userId)).length > 0;
}

/** Revoke (refund/chargeback) — mark grants for a Stripe ref canceled. */
export async function revokePlaybookByStripeRef(ref: string): Promise<void> {
  const s = getSupabaseAdminClient();
  try {
    await s.from("playbook_entitlements")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("stripe_ref", ref);
  } catch {
    /* resilient */
  }
}
