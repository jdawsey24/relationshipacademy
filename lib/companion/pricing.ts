import { getSupabaseAdminClient } from "@/lib/supabase";
import { tierRank } from "@/lib/academy";
import { ownsAnyPlaybook } from "@/lib/snapshot/playbookGrants";

// Server-only. Decides whether a user qualifies for the returning-customer
// Companion price (a cross-sell discount for people who already own another
// paid item).
//
// Qualifying ownership today:
//   - an active Academy membership (profiles.membership_tier > free), or
//   - at least one purchased Playbook (playbook_entitlements).
// Add further paid SKUs here as they gain entitlement records; everything
// downstream (checkout price selection) keeps working unchanged.

export interface ReturningEligibility {
  qualifies: boolean;
  reason: "academy_member" | "playbook_owner" | null;
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
    // Resilient: on any lookup failure, fall through (may still qualify via playbook).
  }
  try {
    if (await ownsAnyPlaybook(userId)) return { qualifies: true, reason: "playbook_owner" };
  } catch {
    // Resilient: fall back to no discount (base price).
  }
  return { qualifies: false, reason: null };
}
