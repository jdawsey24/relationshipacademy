"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Markdown from "@/components/site/Markdown";
import { STATUS_LABELS, type StudioObject } from "@/lib/studio";

interface Detail {
  object: StudioObject;
  currentBody: Record<string, unknown>;
}
function s(v: unknown) { return typeof v === "string" ? v : ""; }

// Preview mode — renders the CURRENT draft version the way the surface would,
// clearly labelled DRAFT / NOT LIVE. It reads the same object payload as the
// workspace; nothing here publishes.
export default function StudioPreviewPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/studio/objects/${id}`)
      .then((r) => { if (!r.ok) throw new Error("Failed to load."); return r.json(); })
      .then((d) => setDetail(d))
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="p-6"><p className="text-sm text-coral-rose">{error}</p></div>;
  if (!detail) return <div className="p-6"><p className="text-sm text-charcoal/60">Loading…</p></div>;

  const { object, currentBody } = detail;
  const content = s(currentBody.content);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5">
        <span className="text-sm font-semibold text-amber-900">DRAFT PREVIEW — NOT LIVE · {STATUS_LABELS[object.status]} · v{object.current_version}</span>
        <Link href={`/admin/studio/objects/${id}`} className="text-sm font-medium text-midnight-navy hover:underline">← Back to workspace</Link>
      </div>

      <article className="mx-auto max-w-2xl">
        <p className="mb-1 text-xs uppercase tracking-wide text-charcoal/50">{object.object_type} · {object.audience}</p>
        <h1 className="mb-3 text-3xl font-semibold text-midnight-navy">{object.title}</h1>
        {object.summary && <p className="mb-6 text-lg text-charcoal/70">{object.summary}</p>}
        {content ? <Markdown content={content} /> : <p className="text-sm italic text-charcoal/50">No body content yet.</p>}

        {object.object_type === "article" && (s(currentBody.cta_text) || s(currentBody.cta_url)) && (
          <div className="mt-8 rounded-md bg-light-gray p-4">
            <a href={s(currentBody.cta_url) || "#"} className="font-medium text-midnight-navy underline">{s(currentBody.cta_text) || s(currentBody.cta_url)}</a>
          </div>
        )}
      </article>
    </div>
  );
}
