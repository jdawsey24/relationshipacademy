import { getSupabaseAdminClient } from "@/lib/supabase";

// Guest-checkout account provisioning (owner decision 2026-08-04: "the person needs
// to pay and then they can create the account. once the account has been created,
// their playbook will be there").
//
// A Playbook entitlement is keyed by user_id, so a paid guest still needs a user
// row for the purchase to attach to. Rather than parking the purchase in a pending
// table, we resolve-or-create the account from the Stripe email at webhook time:
// the entitlement is always attached to a real user, ownsPlaybook() keeps working
// unchanged, and "creating the account" becomes "setting a password" on a row that
// already owns the Playbook.
//
// Safety properties this file must keep:
//   • IDEMPOTENT — webhooks retry; a second call must return the same user, never
//     a duplicate account and never an error that fails the grant.
//   • NEVER THROWS — the caller (Stripe webhook) treats provisioning failure as
//     recoverable; the purchase itself must never be lost.
//   • Case-insensitive email matching (Stripe echoes whatever the buyer typed).

export interface ProvisionResult {
  userId: string | null;
  /** true when this call created the account (buyer still needs to set a password). */
  created: boolean;
  /** true when an account already existed for that email (they sign in as usual). */
  existed: boolean;
  error?: string;
}

/** Find an auth user by email (case-insensitive). Paginates; null if absent. */
async function findUserIdByEmail(email: string): Promise<string | null> {
  const admin = getSupabaseAdminClient();
  const target = email.trim().toLowerCase();
  // listUsers is paginated; a project this size fits in a couple of pages, but
  // loop defensively rather than assuming page 1 holds everyone.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return null;
    const users = data?.users ?? [];
    const hit = users.find((u) => (u.email ?? "").trim().toLowerCase() === target);
    if (hit) return hit.id;
    if (users.length < 200) break; // last page
  }
  return null;
}

/**
 * Resolve the account a guest purchase should attach to, creating one if needed.
 * The created account is email-confirmed but has NO password — the buyer sets one
 * via the link in the delivery email, and their Playbook is already waiting.
 */
export async function resolveOrCreatePurchaser(email: string | null | undefined): Promise<ProvisionResult> {
  const clean = (email ?? "").trim().toLowerCase();
  if (!clean || !clean.includes("@")) return { userId: null, created: false, existed: false, error: "no email" };

  try {
    const existing = await findUserIdByEmail(clean);
    if (existing) return { userId: existing, created: false, existed: true };

    const admin = getSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email: clean,
      email_confirm: true, // they proved the address by paying; no verification step
      user_metadata: { created_via: "playbook_purchase" },
    });
    if (error) {
      // Lost a race with a concurrent webhook retry (or a signup in another tab) —
      // the account exists now, so look it up again rather than failing the grant.
      const again = await findUserIdByEmail(clean);
      if (again) return { userId: again, created: false, existed: true };
      return { userId: null, created: false, existed: false, error: error.message };
    }
    const userId = data.user?.id ?? null;
    if (!userId) return { userId: null, created: false, existed: false, error: "no user returned" };

    // Defense-in-depth alongside the DB trigger: make sure a profiles row exists,
    // so the Library and membership reads never hit a missing row.
    await admin.from("profiles").upsert({ id: userId }, { onConflict: "id" });
    return { userId, created: true, existed: false };
  } catch (e) {
    return { userId: null, created: false, existed: false, error: e instanceof Error ? e.message : "provision failed" };
  }
}

/**
 * A one-time link that lets the buyer set a password and land signed in.
 * Uses a recovery link (Supabase's set-a-new-password flow) because the account
 * we create has no password yet. Returns null if generation fails — the delivery
 * email then falls back to pointing at the normal reset-password page.
 */
export async function generateSetPasswordLink(email: string, redirectTo: string): Promise<string | null> {
  try {
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email: email.trim().toLowerCase(),
      options: { redirectTo },
    });
    if (error) return null;
    return data?.properties?.action_link ?? null;
  } catch {
    return null;
  }
}
