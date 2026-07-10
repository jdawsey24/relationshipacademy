"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// One-click professional activation for an existing signed-in member.
export default function ActivateProfessional() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function activate() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/institute/activate", { method: "POST" }).catch(() => null);
    if (res && res.ok) {
      router.refresh();
    } else {
      setError("Could not activate access. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={activate}
        disabled={busy}
        className="rounded-full bg-midnight-navy px-7 py-3 font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50"
      >
        {busy ? "Activating…" : "Get professional access"}
      </button>
      {error && <p className="mt-3 font-body text-sm text-coral-rose">{error}</p>}
    </div>
  );
}
