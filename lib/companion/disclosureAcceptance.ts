import { getSupabaseAdminClient } from "@/lib/supabase";
import { DISCLOSURE_KEY, DISCLOSURE_VERSION, ACCEPT_EVENT } from "@/lib/companion/disclosures";

// Server-only. Records + checks acceptance of the CURRENT Companion disclosure
// version. Writes go through the service role with the authenticated user id — a
// user can never forge an acceptance. Idempotent (unique on user+key+version).

/** Has this user accepted the CURRENT disclosure version? */
export async function hasAcceptedCurrentDisclosure(userId: string): Promise<boolean> {
  const s = getSupabaseAdminClient();
  try {
    const { data } = await s.from("companion_disclosure_acceptances")
      .select("id").eq("user_id", userId).eq("disclosure_key", DISCLOSURE_KEY).eq("disclosure_version", DISCLOSURE_VERSION).maybeSingle();
    return !!data;
  } catch {
    // Fail CLOSED: if we can't confirm acceptance, treat as NOT accepted so the
    // gate shows (never let a lookup error skip the disclosure).
    return false;
  }
}

/** Record acceptance of the current version. Idempotent. Returns true on success. */
export async function recordDisclosureAcceptance(userId: string, userAgent: string | null): Promise<boolean> {
  const s = getSupabaseAdminClient();
  try {
    const { error } = await s.from("companion_disclosure_acceptances").insert({
      user_id: userId, disclosure_key: DISCLOSURE_KEY, disclosure_version: DISCLOSURE_VERSION,
      event: ACCEPT_EVENT, user_agent: userAgent ? userAgent.slice(0, 400) : null,
    });
    // A unique violation means already accepted this version — that's success.
    if (error && error.code !== "23505") { console.error("[disclosure] accept insert failed:", error.message); return false; }
    return true;
  } catch (e) { console.error("[disclosure] accept threw:", e instanceof Error ? e.message : e); return false; }
}
