"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StudioNav from "@/components/admin/StudioNav";
import LibraryNav from "@/components/admin/LibraryNav";
import { LEARNING_TABLES, LIBRARY_ORDER } from "@/lib/studioLibrary";

export default function LibraryOverviewPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/studio/library")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setCounts(d.counts))
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">The learning library — practices, activities, worksheets, lessons, and more, keyed to competencies. Authoring only; nothing here publishes to the live Academy until a deliberate later step.</p>
      <StudioNav />
      <LibraryNav />

      {error && <p className="text-sm text-coral-rose">Failed to load. If the learning tables aren&apos;t set up yet, run migration 0019_studio_learning.sql and the importer.</p>}
      {!error && !counts && <p className="text-sm text-charcoal/60">Loading…</p>}

      {counts && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LIBRARY_ORDER.map((t) => (
            <Link key={t} href={`/admin/studio/library/${t}`} className="rounded-md border border-light-gray p-4 transition-colors hover:border-midnight-navy">
              <div className="text-sm font-semibold text-midnight-navy">{LEARNING_TABLES[t].label}</div>
              <div className="mt-1 text-2xl font-semibold text-charcoal">{(counts[t] ?? 0).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
