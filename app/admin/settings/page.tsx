"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function SettingsPage() {
  const router = useRouter();

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-midnight-navy">Settings</h1>
      <p className="mt-3 text-sm text-charcoal/70">
        Site settings and configuration coming in a future update.
      </p>
      <button
        type="button"
        onClick={signOut}
        className="mt-8 rounded-md border border-light-gray px-4 py-2 text-sm font-medium text-charcoal hover:border-midnight-navy hover:text-midnight-navy"
      >
        Sign out
      </button>
    </div>
  );
}
