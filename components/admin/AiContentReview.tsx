"use client";

import { useCallback, useEffect, useState } from "react";
import AiStatusBadge from "@/components/admin/AiStatusBadge";
import type { QualityCheck } from "@/lib/ai/types";

const VIEWS = [["queue", "Open"], ["approved", "Approved"], ["rejected", "Rejected"], ["history", "All"]] as const;
type ContentDraft = { id: string; asset_type: string; competency_id: string | null; temporary_title: string | null; draft_content: Record<string, unknown>; quality_status: string; status: string; permanent_id: string | null };

export default function AiContentReview({ onMsg }: { onMsg: (m: string) => void }) {
  const [view, setView] = useState("queue");
  const [rows, setRows] = useState<ContentDraft[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/ai/content-drafts?view=${view}`).then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed."); else { setRows(j.rows); setErr(null); } })
      .catch(() => setErr("Failed to load."));
  }, [view]);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="mb-3 flex gap-1.5">
        {VIEWS.map(([v, label]) => <button key={v} onClick={() => setView(v)} className={`rounded-md px-3 py-1.5 text-sm ${view === v ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"}`}>{label}</button>)}
      </div>
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err}</p>}
      {!err && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No content drafts in this view.</p>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal"><th className="px-3 py-2 font-semibold">Title</th><th className="px-3 py-2 font-semibold">Type</th><th className="px-3 py-2 font-semibold">Competency</th><th className="px-3 py-2 font-semibold">Quality</th><th className="px-3 py-2 font-semibold">Status</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2"><button onClick={() => setOpen(r.id)} className="text-left font-medium text-midnight-navy hover:underline">{r.temporary_title}</button>{r.permanent_id && <span className="ml-1 font-mono text-[11px] text-sage-green">{r.permanent_id}</span>}</td>
                  <td className="px-3 py-2 capitalize text-charcoal/60">{r.asset_type}</td>
                  <td className="px-3 py-2 text-charcoal/60">{r.competency_id}</td>
                  <td className="px-3 py-2 text-xs uppercase text-charcoal/50">{r.quality_status}</td>
                  <td className="px-3 py-2"><AiStatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {open && <ContentDrawer id={open} onClose={() => setOpen(null)} onChanged={(m) => { onMsg(m); load(); }} />}
    </div>
  );
}

const PREVIEWS = [["web", "Web"], ["mobile", "Mobile"], ["print", "Printable"], ["pro", "Professional"]] as const;

function ContentDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: (m: string) => void }) {
  const [data, setData] = useState<{ draft: ContentDraft; checks: QualityCheck[]; sources: { source_entity_id: string }[] } | null>(null);
  const [preview, setPreview] = useState<string>("web");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { fetch(`/api/admin/ai/content-drafts/${id}`).then((r) => r.json()).then(setData).catch(() => setErr("Failed to load.")); }, [id]);

  async function act(action: string, needsNote?: boolean) {
    let notes: string | null = null;
    if (needsNote) notes = window.prompt(action === "reject" ? "Reason for rejecting:" : "Notes:") ?? "";
    if (action === "approve" && !window.confirm("Approve this content? It will get a permanent id and enter the Content Library.")) return;
    setBusy(true); setErr(null);
    const res = await fetch(`/api/admin/ai/content-drafts/${id}/transition`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, notes }) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(d.error ?? "Failed."); return; }
    onChanged(action === "approve" ? `Approved → ${d.permanent_id} added to the Content Library.` : `Marked ${action.replace(/_/g, " ")}.`);
    onClose();
  }

  const draft = data?.draft;
  const dc = (draft?.draft_content ?? {}) as Record<string, unknown>;
  const failed = (data?.checks ?? []).filter((c) => !c.passed);
  const pro = preview === "pro";
  const width = preview === "mobile" ? "max-w-[360px]" : "max-w-none";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-midnight-navy">Review {draft?.asset_type} draft</h2>
          <button onClick={onClose} className="text-sm text-charcoal/50 hover:text-midnight-navy">Close ✕</button>
        </div>
        {!data && <p className="text-sm text-charcoal/60">Loading…</p>}
        {draft && (
          <>
            <div className="mb-3 flex items-center gap-2"><AiStatusBadge status={draft.status} /><span className="text-xs text-charcoal/50">{draft.competency_id}</span></div>
            <div className="mb-3 flex gap-1.5">{PREVIEWS.map(([v, l]) => <button key={v} onClick={() => setPreview(v)} className={`rounded px-2 py-1 text-xs ${preview === v ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/60"}`}>{l}</button>)}</div>

            <div className={`rounded-md border border-light-gray p-4 ${preview === "print" ? "bg-white" : "bg-light-gray/20"}`}>
              <div className={`mx-auto ${width}`}>
                {draft.asset_type === "worksheet" ? <WorksheetPreview dc={dc} pro={pro} /> : draft.asset_type === "lesson" ? <LessonPreview dc={dc} pro={pro} /> : <GenericPreview dc={dc} pro={pro} />}
              </div>
            </div>

            <section className="mt-4">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal/60">Quality checks</h3>
              {failed.length === 0 ? <p className="text-xs text-sage-green">No issues flagged.</p> : failed.map((c) => (
                <div key={c.id} className="mt-1 rounded border-l-2 border-coral-rose bg-coral-rose/5 px-2 py-1 text-xs"><span className="font-semibold uppercase text-coral-rose">{c.severity} · {c.check_type}</span> — {c.finding} <span className="text-charcoal/60">→ {c.recommendation}</span></div>
              ))}
              <p className="mt-2 text-xs text-charcoal/50">Sources: {(data.sources ?? []).map((s) => s.source_entity_id).filter(Boolean).slice(0, 8).join(", ") || "—"}</p>
            </section>

            {err && <p className="mt-3 text-sm text-coral-rose">{err}</p>}
            {["draft", "in_review", "changes_requested"].includes(draft.status) && (
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => act("approve")} disabled={busy} className="rounded-md bg-sage-green px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Approve → Content Library</button>
                <button onClick={() => act("request_changes", true)} disabled={busy} className="rounded-md border border-midnight-navy px-3 py-2 text-sm text-midnight-navy disabled:opacity-50">Request changes</button>
                <button onClick={() => act("reject", true)} disabled={busy} className="rounded-md border border-coral-rose px-3 py-2 text-sm text-coral-rose disabled:opacity-50">Reject</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function s(dc: Record<string, unknown>, k: string) { return typeof dc[k] === "string" ? (dc[k] as string) : ""; }
function a(dc: Record<string, unknown>, k: string) { return Array.isArray(dc[k]) ? (dc[k] as unknown[]) : []; }
function Sec({ h, children }: { h: string; children: React.ReactNode }) { return <div className="mt-3"><h4 className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">{h}</h4><div className="mt-0.5 text-sm text-charcoal/80">{children}</div></div>; }
function List({ items }: { items: unknown[] }) { return <ul className="list-disc pl-5">{items.map((x, i) => <li key={i}>{typeof x === "object" ? JSON.stringify(x) : String(x)}</li>)}</ul>; }

// Renders any content draft generically (used for practice / conversation guide /
// journal prompt / activity / video outline). Facilitator/instructor fields show
// only in the professional preview.
function GenericPreview({ dc, pro }: { dc: Record<string, unknown>; pro: boolean }) {
  const PRO_KEYS = new Set(["facilitator_notes", "facilitator_instructions", "accessibility_notes"]);
  const keys = Object.keys(dc).filter((k) => k !== "title" && (pro || !PRO_KEYS.has(k)));
  return (
    <article>
      <h3 className="text-xl font-semibold text-midnight-navy">{s(dc, "title")}</h3>
      {keys.map((k) => {
        const v = dc[k];
        const label = k.replace(/_/g, " ");
        if (Array.isArray(v)) {
          if (v.length === 0) return null;
          return <Sec key={k} h={label}>{typeof v[0] === "object" ? v.map((o, i) => { const oo = o as Record<string, unknown>; return <p key={i}>{Object.values(oo).map(String).join(" — ")}</p>; }) : <List items={v} />}</Sec>;
        }
        if (typeof v === "string" && v.trim()) return <Sec key={k} h={label}><span className="whitespace-pre-wrap">{v}</span></Sec>;
        return null;
      })}
    </article>
  );
}

function WorksheetPreview({ dc, pro }: { dc: Record<string, unknown>; pro: boolean }) {
  return (
    <article>
      <h3 className="text-xl font-semibold text-midnight-navy">{s(dc, "title")}</h3>
      {s(dc, "subtitle") && <p className="text-sm text-charcoal/60">{s(dc, "subtitle")}</p>}
      <p className="mt-1 text-xs text-charcoal/50">{s(dc, "purpose")} · {s(dc, "estimated_time")}</p>
      {s(dc, "introduction") && <Sec h="Introduction">{s(dc, "introduction")}</Sec>}
      {s(dc, "instructions") && <Sec h="Instructions">{s(dc, "instructions")}</Sec>}
      {a(dc, "section_headings").length > 0 && <Sec h="Sections"><List items={a(dc, "section_headings")} /></Sec>}
      {a(dc, "reflection_questions").length > 0 && <Sec h="Reflection questions"><List items={a(dc, "reflection_questions")} /></Sec>}
      {a(dc, "activity_prompts").length > 0 && <Sec h="Activity prompts"><List items={a(dc, "activity_prompts")} /></Sec>}
      {s(dc, "practice_plan") && <Sec h="Practice plan">{s(dc, "practice_plan")}</Sec>}
      {a(dc, "debrief_questions").length > 0 && <Sec h="Debrief"><List items={a(dc, "debrief_questions")} /></Sec>}
      {s(dc, "next_step") && <Sec h="Next step">{s(dc, "next_step")}</Sec>}
      {pro && s(dc, "facilitator_notes") && <Sec h="Facilitator notes">{s(dc, "facilitator_notes")}</Sec>}
      {pro && s(dc, "accessibility_notes") && <Sec h="Accessibility">{s(dc, "accessibility_notes")}</Sec>}
    </article>
  );
}

function LessonPreview({ dc, pro }: { dc: Record<string, unknown>; pro: boolean }) {
  return (
    <article>
      <h3 className="text-xl font-semibold text-midnight-navy">{s(dc, "title")}</h3>
      {a(dc, "learning_objectives").length > 0 && <Sec h="Learning objectives"><List items={a(dc, "learning_objectives")} /></Sec>}
      {s(dc, "overview") && <Sec h="Overview">{s(dc, "overview")}</Sec>}
      {a(dc, "teaching_outline").length > 0 && <Sec h="Teaching outline"><List items={a(dc, "teaching_outline")} /></Sec>}
      {s(dc, "teaching_script") && <Sec h="Teaching script"><span className="whitespace-pre-wrap">{s(dc, "teaching_script")}</span></Sec>}
      {a(dc, "examples").length > 0 && <Sec h="Examples"><List items={a(dc, "examples")} /></Sec>}
      {a(dc, "reflection_questions").length > 0 && <Sec h="Reflection"><List items={a(dc, "reflection_questions")} /></Sec>}
      {s(dc, "practice_assignment") && <Sec h="Practice assignment">{s(dc, "practice_assignment")}</Sec>}
      {s(dc, "journal_prompt") && <Sec h="Journal prompt">{s(dc, "journal_prompt")}</Sec>}
      {a(dc, "knowledge_check").length > 0 && <Sec h="Knowledge check">{a(dc, "knowledge_check").map((q, i) => { const o = q as { question?: string; answer?: string }; return <p key={i}><strong>Q:</strong> {o.question} <br /><strong>A:</strong> {o.answer}</p>; })}</Sec>}
      {s(dc, "homework") && <Sec h="Homework">{s(dc, "homework")}</Sec>}
      {s(dc, "completion_criteria") && <Sec h="Completion criteria">{s(dc, "completion_criteria")}</Sec>}
      {s(dc, "worksheet_recommendation") && <Sec h="Recommended worksheet">{s(dc, "worksheet_recommendation")}</Sec>}
      {pro && s(dc, "facilitator_notes") && <Sec h="Facilitator notes">{s(dc, "facilitator_notes")}</Sec>}
      {a(dc, "source_references").length > 0 && <Sec h="Sources"><List items={a(dc, "source_references")} /></Sec>}
    </article>
  );
}
