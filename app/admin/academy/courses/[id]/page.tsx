"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AcademyTabs from "@/components/admin/AcademyTabs";
import { useCanWrite } from "@/components/admin/RoleContext";
import { TIERS } from "@/lib/academy";

interface Course {
  id: string; slug: string; title: string; subtitle: string | null; description: string | null;
  audience: string | null; learning_objectives: string[]; estimated_minutes: number | null;
  min_tier: string; status: string;
}
interface Mod { id: string; title: string; summary: string | null; sort_order: number }
interface LessonRow { id: string; module_id: string; slug: string; title: string; min_tier: string; is_preview: boolean; status: string; sort_order: number }

export default function CourseEditor() {
  const canWrite = useCanWrite();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Mod[]>([]);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [newModule, setNewModule] = useState("");
  const [newLesson, setNewLesson] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/academy/courses/${id}`).then((r) => r.json()).catch(() => null);
    if (res?.course) {
      setCourse({ ...res.course, learning_objectives: res.course.learning_objectives ?? [] });
      setModules(res.modules ?? []);
      setLessons(res.lessons ?? []);
    }
  }, [id]);
  useEffect(() => { load(); }, [load]);

  function set<K extends keyof Course>(k: K, v: Course[K]) {
    setCourse((c) => (c ? { ...c, [k]: v } : c));
  }

  async function saveCourse() {
    if (!course) return;
    setSaving(true);
    setMsg(null);
    const res = await fetch(`/api/admin/academy/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: course.title, slug: course.slug, subtitle: course.subtitle,
        description: course.description, audience: course.audience,
        learning_objectives: course.learning_objectives,
        estimated_minutes: course.estimated_minutes ? Number(course.estimated_minutes) : null,
        min_tier: course.min_tier, status: course.status,
      }),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    setMsg(res.ok ? "Saved." : d.error || "Failed to save.");
  }

  async function togglePublish() {
    if (!course) return;
    const next = course.status === "published" ? "draft" : "published";
    set("status", next);
    await fetch(`/api/admin/academy/courses/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
  }

  async function deleteCourse() {
    if (!confirm("Delete this course and all its modules and lessons? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/academy/courses/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/academy");
  }

  async function addModule() {
    if (!newModule.trim()) return;
    await fetch("/api/admin/academy/modules", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: id, title: newModule }),
    });
    setNewModule("");
    load();
  }
  async function renameModule(mid: string, title: string) {
    await fetch(`/api/admin/academy/modules/${mid}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  }
  async function deleteModule(mid: string) {
    if (!confirm("Delete this module and its lessons?")) return;
    await fetch(`/api/admin/academy/modules/${mid}`, { method: "DELETE" });
    load();
  }
  async function addLesson(mid: string) {
    const t = (newLesson[mid] || "").trim();
    if (!t) return;
    await fetch("/api/admin/academy/lessons", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module_id: mid, course_id: id, title: t }),
    });
    setNewLesson((s) => ({ ...s, [mid]: "" }));
    load();
  }

  if (!course) return <div><AcademyTabs /><p className="text-sm text-charcoal/60">Loading…</p></div>;

  return (
    <div>
      <div className="mb-2 text-sm">
        <Link href="/admin/academy" className="text-charcoal/60 hover:text-midnight-navy">← Academy</Link>
      </div>
      <AcademyTabs />

      {/* Course fields */}
      <div className="mb-8 rounded-lg border border-light-gray p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-midnight-navy">Course details</h2>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs ${course.status === "published" ? "bg-sage-green/20 text-midnight-navy" : "bg-light-gray text-charcoal/60"}`}>{course.status}</span>
            {canWrite && (
              <button onClick={togglePublish} className="rounded-md border border-light-gray px-3 py-1.5 text-sm hover:bg-light-gray/40">
                {course.status === "published" ? "Unpublish" : "Publish"}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title"><input value={course.title} onChange={(e) => set("title", e.target.value)} disabled={!canWrite} className={inp} /></Field>
          <Field label="Slug"><input value={course.slug} onChange={(e) => set("slug", e.target.value)} disabled={!canWrite} className={inp} /></Field>
          <Field label="Subtitle" full><input value={course.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} disabled={!canWrite} className={inp} /></Field>
          <Field label="Description" full><textarea rows={3} value={course.description ?? ""} onChange={(e) => set("description", e.target.value)} disabled={!canWrite} className={inp} /></Field>
          <Field label="Audience"><input value={course.audience ?? ""} onChange={(e) => set("audience", e.target.value)} disabled={!canWrite} className={inp} /></Field>
          <Field label="Estimated minutes"><input type="number" value={course.estimated_minutes ?? ""} onChange={(e) => set("estimated_minutes", e.target.value ? Number(e.target.value) : null)} disabled={!canWrite} className={inp} /></Field>
          <Field label="Minimum tier">
            <select value={course.min_tier} onChange={(e) => set("min_tier", e.target.value)} disabled={!canWrite} className={inp}>
              {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Learning objectives (one per line)" full>
            <textarea rows={4} value={course.learning_objectives.join("\n")}
              onChange={(e) => set("learning_objectives", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
              disabled={!canWrite} className={inp} />
          </Field>
        </div>

        {canWrite && (
          <div className="mt-5 flex items-center gap-3">
            <button onClick={saveCourse} disabled={saving} className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">
              {saving ? "Saving…" : "Save details"}
            </button>
            {msg && <span className="text-sm text-charcoal/60">{msg}</span>}
            <button onClick={deleteCourse} className="ml-auto text-sm text-coral-rose hover:underline">Delete course</button>
          </div>
        )}
      </div>

      {/* Modules & lessons */}
      <h2 className="mb-3 text-lg font-semibold text-midnight-navy">Modules &amp; lessons</h2>
      <div className="space-y-5">
        {modules.map((m, mi) => (
          <div key={m.id} className="rounded-lg border border-light-gray p-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-charcoal/50">Module {mi + 1}</span>
              <input defaultValue={m.title} disabled={!canWrite}
                onBlur={(e) => canWrite && e.target.value !== m.title && renameModule(m.id, e.target.value)}
                className="flex-1 rounded-md border border-transparent px-2 py-1 text-sm font-medium text-midnight-navy hover:border-light-gray focus:border-midnight-navy focus:outline-none" />
              {canWrite && <button onClick={() => deleteModule(m.id)} className="text-xs text-coral-rose hover:underline">Delete</button>}
            </div>

            <ul className="mt-3 space-y-1 pl-4">
              {lessons.filter((l) => l.module_id === m.id).map((l, li) => (
                <li key={l.id} className="flex items-center gap-2 text-sm">
                  <span className="text-charcoal/40">{li + 1}.</span>
                  <Link href={`/admin/academy/lessons/${l.id}`} className="text-midnight-navy hover:underline">{l.title}</Link>
                  {l.is_preview && <span className="rounded bg-sage-green/20 px-1.5 text-xs text-midnight-navy">preview</span>}
                  <span className={`rounded px-1.5 text-xs ${l.status === "published" ? "text-sage-green" : "text-charcoal/40"}`}>{l.status}</span>
                </li>
              ))}
            </ul>

            {canWrite && (
              <div className="mt-3 flex items-center gap-2 pl-4">
                <input value={newLesson[m.id] || ""} onChange={(e) => setNewLesson((s) => ({ ...s, [m.id]: e.target.value }))}
                  placeholder="New lesson title" className="h-9 w-64 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
                <button onClick={() => addLesson(m.id)} className="h-9 rounded-md border border-light-gray px-3 text-sm hover:bg-light-gray/40">Add lesson</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {canWrite && (
        <div className="mt-5 flex items-center gap-2">
          <input value={newModule} onChange={(e) => setNewModule(e.target.value)} placeholder="New module title"
            className="h-10 w-72 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
          <button onClick={addModule} className="h-10 rounded-md bg-midnight-navy px-4 text-sm font-medium text-white hover:bg-midnight-navy/90">Add module</button>
        </div>
      )}
    </div>
  );
}

const inp = "mt-1 w-full rounded-md border border-light-gray px-3 py-2 text-sm outline-none focus:border-midnight-navy disabled:bg-light-gray/30";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block text-sm font-medium text-charcoal ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
