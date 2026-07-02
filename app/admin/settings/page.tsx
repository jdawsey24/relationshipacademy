"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import ContentEditor from "@/components/admin/ContentEditor";
import { SETTINGS_FIELDS } from "@/lib/siteContent";

export default function SettingsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/me").then((r) => r.json()).then((d) => setRole(d.role)).catch(() => setRole("unknown"));
  }, []);

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-midnight-navy">Settings</h1>

      {role === null && <p className="mt-4 text-sm text-charcoal/60">Loading…</p>}

      {role && role !== "owner" && (
        <p className="mt-4 text-sm text-charcoal/70">Only owners can edit global settings.</p>
      )}

      {role === "owner" && (
        <div className="mt-6">
          <p className="mb-5 max-w-2xl text-sm text-charcoal/60">
            Global site settings — contact email, social links (used in the footer), analytics IDs, and the footer note.
          </p>
          <ContentEditor fields={SETTINGS_FIELDS} apiPath="/api/admin/settings" />
        </div>
      )}

      <button
        type="button"
        onClick={signOut}
        className="mt-10 rounded-md border border-light-gray px-4 py-2 text-sm font-medium text-charcoal hover:border-midnight-navy hover:text-midnight-navy"
      >
        Sign out
      </button>
    </div>
  );
}
