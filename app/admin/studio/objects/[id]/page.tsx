"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import {
  AUDIENCES,
  PROVENANCE_LABELS,
  PUBLISHABLE_TYPES,
  STATUS_LABELS,
  availableActions,
  isEditable,
  type Audience,
  type ObjectType,
  type StudioObject,
  type StudioReview,
  type StudioStatus,
  type StudioVersion,
} from "@/lib/studio";

interface Detail {
  object: StudioObject;
  versions: StudioVersion[];
  reviews: StudioReview[];
  currentBody: Record<string, unknown>;
}

// Body fields per type. Articles map 1:1 to the live `articles` table; other
// types get a generic Markdown body for now (rich per-type builders arrive in
// later phases).
const ARTICLE_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "content", label: "Body (Markdown)", multiline: true },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
  { key: "tags", label: "Tags (comma-separated)" },
  { key: "related_phase_slug", label: "Related phase slug" },
  { key: "featured_image_url", label: "Featured image URL" },
  { key: "cta_text", label: "CTA text" },
  { key: "cta_url", label: "CTA URL" },
  { key: "seo_title", label: "SEO title" },
  { key: "seo_description", label: "SEO description", multiline: true },
];
const GENERIC_FIELDS: { key: string; label: string; multiline?: boolean }[] = [
  { key: "content", label: "Content (Markdown)", multiline: true },
];

const ACTION_LABELS: Record<string, string> = {
  submit_for_review: "Submit for review",
  approve: "Approve",
  request_changes: "Request changes",
  publish: "Publish",
  unpublish: "Unpublish",
  retire: "Retire",
};

function fmt(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
function s(v: unknown) { return typeof v === "string" ? v : ""; }

const INPUT = "mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm disabled:bg-[#F9F9F9] disabled:text-charcoal/50";

export default function StudioObjectPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ title: "", slug: "", summary: "", audience: "consumer" as Audience });
  const [body, setBody] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/studio/objects/${id}`)
      .then((r) => { if (!r.ok) throw new Error(r.status === 403 ? "You don't have access to this item." : "Failed to load."); return r.json(); })
      .then((d: Detail) => {
        setDetail(d);
        setMeta({ title: d.object.title, slug: d.object.slug ?? "", summary: d.object.summary ?? "", audience: d.object.audience });
        const b: Record<string, string> = {};
        for (const [k, v] of Object.entries(d.currentBody)) b[k] = typeof v === "string" ? v : "";
        setBody(b);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (error) return <div><BackLink /><p className="mt-4 text-sm text-coral-rose">{error}</p></div>;
  if (!detail) return <div><BackLink /><p className="mt-4 text-sm text-charcoal/60">Loading…</p></div>;

  const { object, versions, reviews } = detail;
  const editable = isEditable(object.status) && canWrite;
  const fields = object.object_type === "article" ? ARTICLE_FIELDS : GENERIC_FIELDS;
  const actions = availableActions(object.status, role);
  const notPublishable = !PUBLISHABLE_TYPES.includes(object.object_type as ObjectType);
  const aiNotes = s(detail.currentBody.ai_editor_notes);

  async function saveDraft() {
    setBusy(true); setMsg(null);
    const merged: Record<string, unknown> = { ...detail!.currentBody, ...body };
    const res = await fetch(`/api/admin/studio/objects/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: meta.title, slug: meta.slug, summary: meta.summary, audience: meta.audience, body: merged }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed to save."); return; }
    setMsg("Draft saved."); load();
  }

  async function doAction(action: string) {
    let notes: string | null = null;
    if (action === "request_changes" || action === "retire") {
      notes = window.prompt(action === "request_changes" ? "What changes are needed?" : "Reason for retiring (optional):") ?? "";
    }
    if (action === "publish" && !window.confirm("Publish this item live? It will appear on the corresponding public surface.")) return;
    setBusy(true); setMsg(null);
    const res = await fetch(`/api/admin/studio/objects/${id}/transition`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(`Done: ${ACTION_LABELS[action] ?? action}.`); load();
  }

  async function restore(versionNo: number) {
    if (!window.confirm(`Restore v${versionNo} into a new draft version?`)) return;
    setBusy(true); setMsg(null);
    const res = await fetch(`/api/admin/studio/objects/${id}/versions`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version_no: versionNo }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(`Restored v${versionNo}.`); load();
  }

  async function del() {
    if (!window.confirm("Permanently delete this item and its history? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/studio/objects/${id}`, { method: "DELETE" });
    if (res.ok) { router.push("/admin/studio"); return; }
    const d = await res.json().catch(() => ({}));
    setMsg(d.error ?? "Failed to delete.");
  }

  return (
    <div>
      <BackLink />
      <div className="mt-2 mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-midnight-navy">{object.title}</h1>
        <span className="rounded-full bg-light-gray px-2.5 py-0.5 text-[11px] font-semibold uppercase text-charcoal/70">{STATUS_LABELS[object.status]}</span>
        <span className="text-sm text-charcoal/50">{object.object_type} · {object.audience} · v{object.current_version}</span>
        <Link href={`/admin/studio/preview/${id}`} className="ml-auto rounded-md border border-light-gray px-3 py-1.5 text-sm hover:bg-light-gray">Preview</Link>
      </div>

      {object.provenance !== "human" && (
        <div className="mb-4 rounded-md border border-dusty-plum/30 bg-dusty-plum/5 p-3 text-sm text-dusty-plum">
          <strong>{PROVENANCE_LABELS[object.provenance]}.</strong> This draft was produced by AI from approved Knowledge Base records. Review carefully before approving — it must be human-approved to publish.
          {aiNotes && <div className="mt-2 whitespace-pre-wrap text-xs text-dusty-plum/90"><strong>Reviewer notes:</strong> {aiNotes}</div>}
        </div>
      )}

      {msg && <div className="mb-4 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}

      {object.status === "published" && object.canonical_ref && (
        <p className="mb-4 text-xs text-charcoal/50">Published into <code>{object.canonical_ref.table}</code> (id <code>{object.canonical_ref.id}</code>), preserving its live record.</p>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Editor */}
        <div className="md:col-span-2">
          <section className="rounded-md border border-light-gray p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Details</h2>
            <Field label="Title"><input disabled={!editable} value={meta.title} onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))} className={INPUT} /></Field>
            <Field label="Slug"><input disabled={!editable} value={meta.slug} onChange={(e) => setMeta((m) => ({ ...m, slug: e.target.value }))} className={INPUT} /></Field>
            <Field label="Summary"><textarea disabled={!editable} value={meta.summary} onChange={(e) => setMeta((m) => ({ ...m, summary: e.target.value }))} rows={2} className={INPUT} /></Field>
            <Field label="Audience">
              <select disabled={!editable} value={meta.audience} onChange={(e) => setMeta((m) => ({ ...m, audience: e.target.value as Audience }))} className={INPUT}>
                {AUDIENCES.filter((a) => !a.ownerOnly || isOwner).map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </Field>
          </section>

          <section className="mt-4 rounded-md border border-light-gray p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Content</h2>
            {fields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.multiline
                  ? <textarea disabled={!editable} value={body[f.key] ?? ""} onChange={(e) => setBody((b) => ({ ...b, [f.key]: e.target.value }))} rows={f.key === "content" ? 12 : 2} className={` font-mono text-[13px]`} />
                  : <input disabled={!editable} value={body[f.key] ?? ""} onChange={(e) => setBody((b) => ({ ...b, [f.key]: e.target.value }))} className={INPUT} />}
              </Field>
            ))}
          </section>

          {editable && (
            <div className="mt-4">
              <button onClick={saveDraft} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Save draft (new version)</button>
            </div>
          )}
        </div>

        {/* Sidebar: workflow + history */}
        <div>
          <section className="rounded-md border border-light-gray p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Workflow</h2>
            {actions.length === 0 && <p className="text-sm text-charcoal/50">No actions available for your role in this state.</p>}
            {notPublishable && actions.includes("publish") && (
              <p className="mb-2 text-xs text-amber-700">Note: a publisher for this type isn&apos;t wired yet — publishing arrives in a later phase.</p>
            )}
            <div className="flex flex-col gap-2">
              {actions.map((a) => (
                <button key={a} onClick={() => doAction(a)} disabled={busy}
                  className={`rounded-md px-3 py-2 text-sm font-medium disabled:opacity-50 ${a === "publish" ? "bg-sage-green text-white" : a === "approve" ? "bg-blue-600 text-white" : a === "retire" ? "border border-coral-rose text-coral-rose" : "border border-midnight-navy text-midnight-navy"}`}>
                  {ACTION_LABELS[a]}
                </button>
              ))}
            </div>
            {isOwner && (object.status === "draft" || object.status === "retired") && (
              <button onClick={del} disabled={busy} className="mt-3 w-full rounded-md border border-coral-rose px-3 py-2 text-xs font-medium text-coral-rose disabled:opacity-50">Delete permanently</button>
            )}
          </section>

          <section className="mt-4 rounded-md border border-light-gray p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Version history</h2>
            <ul className="space-y-2 text-sm">
              {versions.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2">
                  <span>
                    <span className="font-medium">v{v.version_no}</span>
                    {v.version_no === object.current_version && <span className="ml-1 text-[10px] uppercase text-sage-green">current</span>}
                    <span className="block text-xs text-charcoal/50">{fmt(v.created_at)}{v.note ? ` · ${v.note}` : ""}</span>
                  </span>
                  {editable && v.version_no !== object.current_version && (
                    <button onClick={() => restore(v.version_no)} className="text-xs font-medium text-midnight-navy hover:underline">Restore</button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-4 rounded-md border border-light-gray p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Review log</h2>
            <ul className="space-y-2 text-sm">
              {reviews.map((r) => (
                <li key={r.id}>
                  <span className="font-medium capitalize">{r.action.replace(/_/g, " ")}</span>
                  <span className="block text-xs text-charcoal/50">{fmt(r.created_at)}{r.actor ? ` · ${r.actor}` : ""}{r.notes ? ` — ${r.notes}` : ""}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <style jsx>{`.input{margin-top:.25rem;width:100%;border-radius:.375rem;border:1px solid #E5E5E5;padding:.375rem .5rem;font-size:.875rem}.input:disabled{background:#F9F9F9;color:#6b7280}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block text-sm font-medium text-charcoal">
      {label}
      {children}
    </label>
  );
}
function BackLink() {
  return <Link href="/admin/studio" className="text-sm text-midnight-navy hover:underline">← Studio</Link>;
}
