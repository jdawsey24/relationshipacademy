"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCanWrite } from "@/components/admin/RoleContext";
import { TIERS } from "@/lib/academy";

interface Lesson {
  id: string; course_id: string; slug: string; title: string;
  video_url: string | null; content: string | null; key_takeaways: string | null;
  reflection_questions: string[]; homework: string | null; workbook_url: string | null;
  skool_url: string | null; min_tier: string; is_preview: boolean;
  estimated_minutes: number | null; status: string;
}

export default function LessonEditor() {
  const canWrite = useCanWrite();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/academy/lessons/${id}`).then((r) => r.json()).catch(() => null);
    if (res?.lesson) setLesson({ ...res.lesson, reflection_questions: res.lesson.reflection_questions ?? [] });
  }, [id]);
  useEffect(() => { load(); }, [load]);

  function set<K extends keyof Lesson>(k: K, v: Lesson[K]) {
    setLesson((l) => (l ? { ...l, [k]: v } : l));
  }

  async function save() {
    if (!lesson) return;
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/admin/academy/lessons/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: lesson.title, slug: lesson.slug, video_url: lesson.video_url,
        content: lesson.content, key_takeaways: lesson.key_takeaways,
        reflection_questions: lesson.reflection_questions, homework: lesson.homework,
        workbook_url: lesson.workbook_url, skool_url: lesson.skool_url,
        min_tier: lesson.min_tier, is_preview: lesson.is_preview,
        estimated_minutes: lesson.estimated_minutes ? Number(lesson.estimated_minutes) : null,
        status: lesson.status,
      }),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    setMsg(res.ok ? "Saved." : d.error || "Failed to save.");
  }

  async function togglePublish() {
    if (!lesson) return;
    const next = lesson.status === "published" ? "draft" : "published";
    set("status", next);
    await fetch(`/api/admin/academy/lessons/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
  }

  async function del() {
    if (!confirm("Delete this lesson? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/academy/lessons/${id}`, { method: "DELETE" });
    if (res.ok && lesson) router.push(`/admin/academy/courses/${lesson.course_id}`);
  }

  if (!lesson) return <p className="text-sm text-charcoal/60">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link href={`/admin/academy/courses/${lesson.course_id}`} className="text-charcoal/60 hover:text-midnight-navy">← Back to course</Link>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs ${lesson.status === "published" ? "bg-sage-green/20 text-midnight-navy" : "bg-light-gray text-charcoal/60"}`}>{lesson.status}</span>
          {canWrite && <button onClick={togglePublish} className="rounded-md border border-light-gray px-3 py-1.5 hover:bg-light-gray/40">{lesson.status === "published" ? "Unpublish" : "Publish"}</button>}
        </div>
      </div>

      <h1 className="mb-5 text-2xl font-semibold text-midnight-navy">Edit lesson</h1>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Title"><input value={lesson.title} onChange={(e) => set("title", e.target.value)} disabled={!canWrite} className={inp} /></F>
          <F label="Slug"><input value={lesson.slug} onChange={(e) => set("slug", e.target.value)} disabled={!canWrite} className={inp} /></F>
          <F label="Video URL"><input value={lesson.video_url ?? ""} onChange={(e) => set("video_url", e.target.value)} disabled={!canWrite} className={inp} placeholder="https://…" /></F>
          <F label="Estimated minutes"><input type="number" value={lesson.estimated_minutes ?? ""} onChange={(e) => set("estimated_minutes", e.target.value ? Number(e.target.value) : null)} disabled={!canWrite} className={inp} /></F>
          <F label="Minimum tier">
            <select value={lesson.min_tier} onChange={(e) => set("min_tier", e.target.value)} disabled={!canWrite} className={inp}>
              {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </F>
          <label className="flex items-end gap-2 pb-2 text-sm text-charcoal">
            <input type="checkbox" checked={lesson.is_preview} onChange={(e) => set("is_preview", e.target.checked)} disabled={!canWrite} className="h-4 w-4" />
            Free preview (visible to all tiers)
          </label>
        </div>

        <F label="Lesson content (Markdown)"><textarea rows={8} value={lesson.content ?? ""} onChange={(e) => set("content", e.target.value)} disabled={!canWrite} className={inp} /></F>
        <F label="Key takeaways (one per line)"><textarea rows={4} value={lesson.key_takeaways ?? ""} onChange={(e) => set("key_takeaways", e.target.value)} disabled={!canWrite} className={inp} /></F>
        <F label="Reflection questions (one per line)">
          <textarea rows={4} value={lesson.reflection_questions.join("\n")}
            onChange={(e) => set("reflection_questions", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            disabled={!canWrite} className={inp} />
        </F>
        <F label="Homework"><textarea rows={3} value={lesson.homework ?? ""} onChange={(e) => set("homework", e.target.value)} disabled={!canWrite} className={inp} /></F>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Workbook URL"><input value={lesson.workbook_url ?? ""} onChange={(e) => set("workbook_url", e.target.value)} disabled={!canWrite} className={inp} placeholder="https://…" /></F>
          <F label="Skool discussion URL"><input value={lesson.skool_url ?? ""} onChange={(e) => set("skool_url", e.target.value)} disabled={!canWrite} className={inp} placeholder="https://…" /></F>
        </div>
      </div>

      {canWrite && (
        <div className="mt-6 flex items-center gap-3">
          <button onClick={save} disabled={saving} className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">{saving ? "Saving…" : "Save lesson"}</button>
          {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
          <button onClick={del} className="ml-auto text-sm text-coral-rose hover:underline">Delete lesson</button>
        </div>
      )}
    </div>
  );
}

const inp = "mt-1 w-full rounded-md border border-light-gray px-3 py-2 text-sm outline-none focus:border-midnight-navy disabled:bg-light-gray/30";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-charcoal">{label}{children}</label>;
}
