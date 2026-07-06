import { getSupabaseAdminClient } from "@/lib/supabase";

// Append-only audit trail for administrator actions. Resilient by design: if the
// audit_log table doesn't exist yet (migration 0008 not run) or the write fails,
// it logs to the server console and never throws — auditing must never break the
// action it records. Best-effort by intent; treat the DB table as the system of
// record once the migration is applied.
export interface AuditEntry {
  actor: string | null;          // admin email
  action: string;                // e.g. "user.create", "settings.update"
  target?: string | null;        // affected id/email/key
  metadata?: Record<string, unknown>;
}

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("audit_log").insert({
      actor: entry.actor,
      action: entry.action,
      target: entry.target ?? null,
      metadata: entry.metadata ?? {},
    });
    if (error) {
      console.error(`[audit] ${entry.action} by ${entry.actor}:`, error.message);
    }
  } catch (e) {
    console.error(`[audit] ${entry.action} by ${entry.actor}:`, e instanceof Error ? e.message : e);
  }
}
