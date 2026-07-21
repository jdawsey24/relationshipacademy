"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Detail {
  entry: { id: string; title: string | null; status: string; entry_type: string; updated_at: string };
  experienceTitle: string | null;
  responses: { block_ref: string; response: unknown }[];
  favorite: boolean;
  tags: string[];
}

function StatusPill({ status }: { status: string }) {
  const archived = /archiv/i.test(status);
  const done = /complete|published/i.test(status);
  const c = archived ? "#868C96" : done ? "#5F9E7C" : "#C09A52";
  const label = archived ? "Archived" : done ? "Complete" : "In progress";
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${c}22`, color: c }}>{label}</span>
  );
}

export default function CompanionJourneyDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<Detail | null>(null);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch(`/api/companion/journey/${id}`);
    if (!r.ok) { setNotFound(true); return; }
    const j: Detail = await r.json();
    setD(j); setTitle(j.entry.title ?? "");
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function patch(body: Record<string, unknown>) { await fetch(`/api/companion/journey/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); load(); }
  async function del() { if (!confirm("Delete this entry permanently? This cannot be undone.")) return; await fetch(`/api/companion/journey/${id}`, { method: "DELETE" }); router.replace("/companion/journey"); }

  if (notFound) return <CompanionChrome active="journey"><p className="font-body text-sm text-charcoal/55">This entry isn&apos;t available.</p></CompanionChrome>;
  if (!d) return <CompanionChrome active="journey"><p className="font-body text-sm text-charcoal/50">Loading…</p></CompanionChrome>;

  const renderVal = (v: unknown) => typeof v === "string" ? v : v && typeof v === "object" ? Object.values(v).filter(Boolean).join(" · ") : "";

  return (
    <CompanionChrome active="journey">
      <button onClick={() => router.replace("/companion/journey")} className="flex items-center gap-1 font-ui text-sm text-charcoal/55 hover:text-charcoal"><span aria-hidden="true">←</span> Journey</button>

      <div className="mt-4 flex items-start justify-between gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== (d.entry.title ?? "") && patch({ title })}
          placeholder="Untitled reflection" className="w-full bg-transparent font-display text-3xl font-semibold leading-tight text-midnight-navy placeholder:text-midnight-navy/30 focus:outline-none" />
        <button onClick={() => patch({ favorite: !d.favorite })} aria-label={d.favorite ? "Remove from favorites" : "Add to favorites"}
          className={`mt-1.5 shrink-0 p-1 transition-colors ${d.favorite ? "text-coral-rose" : "text-charcoal/25 hover:text-coral-rose/60"}`}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill={d.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z" /></svg>
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusPill status={d.entry.status} />
        <span className="font-ui text-xs text-charcoal/45">{d.experienceTitle ?? "Free reflection"} · {new Date(d.entry.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
      </div>

      {d.entry.status === "draft" && (
        <p className="mt-4 rounded-2xl border border-amber-warm/40 bg-amber-warm/5 p-3.5 font-body text-sm text-charcoal/70">This reflection is unfinished — reopen it from the experience to continue.</p>
      )}

      <div className="mt-5">
        <div className="flex flex-wrap gap-1.5">
          {d.tags.map((t) => (
            <span key={t} className="flex items-center gap-1 rounded-full bg-warm-ivory px-2.5 py-1 font-ui text-xs text-charcoal/60">
              {t}<button onClick={() => patch({ removeTag: t })} aria-label={`Remove tag ${t}`} className="text-charcoal/35 hover:text-charcoal/60">×</button>
            </span>
          ))}
        </div>
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Add a tag" onKeyDown={(e) => { if (e.key === "Enter" && tag.trim()) { patch({ addTag: tag }); setTag(""); } }}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-1.5 font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:border-midnight-navy/40 focus:outline-none" />
      </div>

      <p className="mt-6 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">Your reflections</p>
      <div className="mt-2.5 space-y-2.5">
        {d.responses.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/45">No saved responses.</p> :
          d.responses.map((r, i) => (
            <div key={r.block_ref} className="rounded-2xl border border-light-gray bg-white p-4">
              <p className="font-ui text-[10px] font-semibold uppercase tracking-wide text-charcoal/35">Reflection {i + 1}</p>
              <p className="mt-1 whitespace-pre-wrap font-body text-[15px] leading-relaxed text-charcoal/80">{renderVal(r.response) || <span className="text-charcoal/35">—</span>}</p>
            </div>
          ))}
      </div>

      <div className="mt-7 flex gap-4 border-t border-light-gray pt-4">
        {d.entry.status !== "archived" && <button onClick={() => patch({ archive: true })} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">Archive</button>}
        <button onClick={del} className="font-ui text-sm text-coral-rose hover:underline">Delete</button>
      </div>
    </CompanionChrome>
  );
}
