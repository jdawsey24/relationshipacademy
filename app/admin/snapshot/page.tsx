"use client";

import { useEffect, useState } from "react";
import type { SnapshotAnalytics } from "@/lib/snapshot/analytics";
import { SnapshotAnalyticsView } from "./SnapshotAnalyticsView";

export default function SnapshotAnalyticsPage() {
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
