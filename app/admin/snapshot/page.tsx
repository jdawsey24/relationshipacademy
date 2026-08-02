"use client";

import { useEffect, useState } from "react";
import type { SnapshotAnalytics } from "@/lib/snapshot/analytics";
import { SnapshotAnalyticsView } from "./SnapshotAnalyticsView";
import { SnapshotLeadsView } from "./SnapshotLeadsView";

type Tab = "analytics" | "leads";

export default function SnapshotAdminPage() {
  const [tab, setTab] = useState<Tab>("analytics");

  const tabCls = (t: Tab) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      tab === t ? "bg-midnight-navy text-white" : "text-charcoal/70 hover:bg-charcoal/5"
    }`;

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button className={tabCls("analytics")} onClick={() => setTab("analytics")}>Analytics</button>
        <button className={tabCls("leads")} onClick={() => setTab("leads")}>Leads</button>
      </div>
      {tab === "analytics" ? <AnalyticsTab /> : <SnapshotLeadsView />}
    </div>
  );
}

function AnalyticsTab() {
  const [a, setA] = useState<SnapshotAnalytics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/snapshot/analytics")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setA)
      .catch(() => setError(true));
  }, []);

  if (error) return <p className="text-sm text-coral-rose">Failed to load Snapshot analytics.</p>;
  if (!a) return <p className="text-sm text-charcoal/60">Loading…</p>;
  return <SnapshotAnalyticsView data={a} />;
}
