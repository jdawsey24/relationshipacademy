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
      <button onClick={() => router.replace("/companion/journey")} className="font-ui text-sm text-charcoal/55">← Journey</button>

      <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== (d.entry.title ?? "") && patch({ title })}
        placeholder="Untitled reflection" className="mt-3 w-full bg-transparent font-display text-2xl font-semibold text-midnight-navy focus:outline-none" />
      <div className="mt-1 flex items-center gap-3">
        <span className="font-ui text-xs text-charcoal/45">{d.entry.status} · {d.experienceTitle ?? "Free reflection"}</span>
        <button onClick={() => patch({ favorite: !d.favorite })} className={`text-sm ${d.favorite ? "text-coral-rose" : "text-charcoal/30"}`}>♥</button>
      </div>

      {d.entry.status === "draft" && (
        <p className="mt-3 rounded-xl border border-midnight-navy/25 bg-white p-3 font-body text-sm text-charcoal/70">This reflection is unfinished — reopen it from the experience to continue.</p>
      )}

      {/* Tags */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-1.5">
          {d.tags.map((t) => (
            <span key={t} className="flex items-center gap-1 rounded-full bg-warm-ivory px-2.5 py-1 font-ui text-xs text-charcoal/60">
              {t}<button onClick={() => patch({ removeTag: t })} className="text-charcoal/35">×</button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Add a tag" onKeyDown={(e) => { if (e.key === "Enter" && tag.trim()) { patch({ addTag: tag }); setTag(""); } }}
            className="flex-1 rounded-lg border border-light-gray bg-white px-3 py-1.5 font-body text-sm focus:outline-none" />
        </div>
      </div>

      {/* Saved responses (read-only review) */}
      <div className="mt-5 space-y-2">
        {d.responses.length === 0 ? <p className="font-body text-sm text-charcoal/45">No saved responses.</p> :
          d.responses.map((r) => (
            <div key={r.block_ref} className="rounded-xl border border-light-gray bg-white p-3">
              <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-charcoal/80">{renderVal(r.response) || <span className="text-charcoal/35">—</span>}</p>
            </div>
          ))}
      </div>

      {/* Manage */}
      <div className="mt-6 flex gap-3 border-t border-light-gray pt-4">
        {d.entry.status !== "archived" && <button onClick={() => patch({ archive: true })} className="font-ui text-sm text-charcoal/55">Archive</button>}
        <button onClick={del} className="font-ui text-sm text-coral-rose">Delete</button>
      </div>
    </CompanionChrome>
  );
}
