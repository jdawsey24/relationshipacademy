"use client";

import { useCallback, useEffect, useState } from "react";

// The Dating With Clarity priority list.
//
// A separate page rather than a tab in the CRM, because this list is READ, not
// worked. The other lead tables answer "who do I contact"; this one answers
// "what are these women actually stuck on", and that lives in two free-text
// answers that a table row would truncate to nothing. So the answers get room.

interface Row {
  id: string;
  email: string;
  first_name: string | null;
  dating_status: string | null;
  hardest_part: string | null;
  confidence_goal: string | null;
  can_attend: string | null;
  status: string;
  created_at: string;
  notified_at: string | null;
}

interface Payload {
  rows: Row[];
  counts: { total: number; active: number; enrolled: number; unsubscribed: number };
  seats: number;
}

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(iso));

const csvCell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

function downloadCsv(rows: Row[]) {
  const head = ["Joined (ET)", "First name", "Email", "Dating status", "Can attend", "Hardest part", "Wants confidence in", "Status"];
  const body = rows.map((r) => [
    when(r.created_at), r.first_name, r.email, r.dating_status,
    r.can_attend, r.hardest_part, r.confidence_goal, r.status,
  ].map((c) => csvCell(c as string | null)).join(","));
  const blob = new Blob([[head.join(","), ...body].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dating-with-clarity-waitlist.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_STYLE: Record<string, string> = {
  active: "bg-slate-100 text-slate-700",
  enrolled: "bg-emerald-100 text-emerald-800",
  unsubscribed: "bg-amber-100 text-amber-800",
};

export default function ClarityWaitlistPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "enrolled" | "unsubscribed">("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/clarity-waitlist");
      if (!res.ok) throw new Error(String(res.status));
      setData(await res.json());
    } catch {
      setError("Could not load the waitlist.");
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  if (error) return <p className="p-8 text-sm text-red-600">{error}</p>;
  if (!data) return <p className="p-8 text-sm text-slate-500">Loading…</p>;

  const rows = filter === "all" ? data.rows : data.rows.filter((r) => r.status === filter);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dating With Clarity — priority list</h1>
          <p className="mt-1 text-sm text-slate-500">
            {data.counts.total} on the list &middot; {data.counts.enrolled} enrolled &middot; the founding cohort holds {data.seats}
          </p>
        </div>
        <button
          onClick={() => downloadCsv(rows)}
          disabled={!rows.length}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        {(["all", "active", "enrolled", "unsubscribed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm capitalize ${
              filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
            {f !== "all" && ` (${data.counts[f]})`}
          </button>
        ))}
      </div>

      {!rows.length ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          {filter === "all"
            ? "Nobody has joined the priority list yet."
            : `Nobody on the list is ${filter}.`}
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium text-slate-900">{r.first_name || "(no name given)"}</span>
                <a href={`mailto:${r.email}`} className="text-sm text-slate-500 underline-offset-2 hover:underline">{r.email}</a>
                <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[r.status] ?? "bg-slate-100 text-slate-700"}`}>
                  {r.status}
                </span>
                <span className="ml-auto text-xs text-slate-400">
                  {when(r.created_at)} ET
                  {!r.notified_at && <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-blue-700">not yet in a digest</span>}
                </span>
              </div>

              <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                <Answer label="Where she is with dating" value={r.dating_status} />
                <Answer label="Can attend Thursdays" value={r.can_attend} />
                <Answer label="Hardest part right now" value={r.hardest_part} wide />
                <Answer label="Wants to feel confident" value={r.confidence_goal} wide />
              </dl>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** An unanswered question is omitted rather than shown empty — every field on the form is optional. */
function Answer({ label, value, wide }: { label: string; value: string | null; wide?: boolean }) {
  if (!value) return null;
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">{value}</dd>
    </div>
  );
}
