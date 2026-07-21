import { getSupabaseAdminClient } from "@/lib/supabase";
import { tierRank } from "@/lib/academy";

// Server-only. Decides whether a user qualifies for the returning-customer
// Companion price (a cross-sell discount for people who already own another
// paid item).
//
// Today the only non-Companion ownership the platform records is an active
// Academy membership (profiles.membership_tier). Playbooks are currently free
// PDFs delivered from Snapshot results — NOT a purchased product — so there is
// nothing to detect for them yet. When a paid Playbook (or any other paid SKU)
// gains a purchase/entitlement record, add that check here and everything
// downstream (checkout price selection) keeps working unchanged.

export interface ReturningEligibility {
  qualifies: boolean;
  reason: "academy_member" | null;
}

/** True if the user already owns another paid item and should get the discount. */
export async function getReturningEligibility(userId: string): Promise<ReturningEligibility> {
  const admin = getSupabaseAdminClient();
  try {
    const { data } = await admin
      .from("profiles")
      .select("membership_tier")
      .eq("id", userId)
      .maybeSingle();
    const tier = (data as { membership_tier?: string } | null)?.membership_tier ?? "free";
    if (tierRank(tier) > tierRank("free")) return { qualifies: true, reason: "academy_member" };
  } catch {
    // Resilient: on any lookup failure, fall back to no discount (base price).
  }
  return { qualifies: false, reason: null };
}
