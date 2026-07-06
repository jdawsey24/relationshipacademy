"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { JournalEntry } from "@/lib/academy";

// Full journal library: write standalone entries, filter by course, edit/delete.
// Lesson-linked entries deep-link back to their lesson.
interface CourseRef {
  id: string;
  title: string;
  slug: string;
}
interface LessonRef {
  id: string;
  slug: string;
  title: string;
  courseSlug: string;
}

export default function JournalManager({
  initialEntries,
  courses,
  lessons,
}: {
  initialEntries: JournalEntry[];
  courses: CourseRef[];
  lessons: Record<string, LessonRef>;
}) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [filter, setFilter] = useState<string>("all");
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const courseTitle = useMemo(() => {
    const m = new Map<string, string>();
    courses.forEach((c) => m.set(c.id, c.title));
    return m;
  }, [courses]);

  const visible = filter === "all" ? entries : entries.filter((e) => e.course_id === filter);

  async function add() {
    if (!draft.trim()) return;
    setSaving(true);
    const res = await fetch("/api/academy/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft, title: title || undefined }),
    }).catch(() => null);
    setSaving(false);
    if (res && res.ok) {
      const { entry } = await res.json();
      setEntries([entry, ...entries]);
      setDraft("");
      setTitle("");
    }
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/academy/journal/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: editBody }),
    }).catch(() => null);
    if (res && res.ok) {
      const { entry } = await res.json();
      setEntries(entries.map((e) => (e.id === id ? entry : e)));
      setEditingId(null);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/academy/journal/${id}`, { method: "DELETE" }).catch(() => null);
    if (res && res.ok) setEntries(entries.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* New entry */}
      <div className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="mb-3 w-full rounded-lg border border-light-gray px-3 py-2 font-body text-sm outline-none focus:border-midnight-navy"
        />
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="What's on your mind?"
          className="w-full rounded-xl border border-light-gray bg-warm-ivory/40 p-4 font-body text-sm outline-none focus:border-midnight-navy"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={add}
            disabled={saving || !draft.trim()}
            className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>

      {/* Filter */}
      {courses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
          {courses.map((c) => (
            <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>{c.title}</FilterChip>
          ))}
        </div>
      )}

      {/* Entries */}
      {visible.length === 0 ? (
        <p className="font-body text-charcoal/60">No entries yet. Your reflections will appear here.</p>
      ) : (
        <ul className="space-y-4">
          {visible.map((e) => {
            const lesson = e.lesson_id ? lessons[e.lesson_id] : undefined;
            return (
              <li key={e.id} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="font-body font-medium text-midnight-navy">{e.title || "Untitled reflection"}</p>
                  <span className="font-ui text-xs text-charcoal/50">{new Date(e.updated_at).toLocaleDateString()}</span>
                </div>
                {e.course_id && (
                  <p className="mb-2 font-ui text-xs text-plum">
                    {courseTitle.get(e.course_id)}
                    {lesson && (
                      <>
                        {" · "}
                        <Link href={`/academy/courses/${lesson.courseSlug}/${lesson.slug}`} className="underline underline-offset-2 hover:text-midnight-navy">
                          {lesson.title}
                        </Link>
                      </>
                    )}
                  </p>
                )}
                {editingId === e.id ? (
                  <>
                    <textarea
                      value={editBody}
                      onChange={(ev) => setEditBody(ev.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-light-gray p-3 font-body text-sm outline-none focus:border-midnight-navy"
                    />
                    <div className="mt-2 flex gap-3 font-ui text-sm">
                      <button onClick={() => saveEdit(e.id)} className="text-midnight-navy hover:underline">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-charcoal/60 hover:underline">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap font-body text-sm text-charcoal/85">{e.body}</p>
                    <div className="mt-3 flex gap-3 font-ui text-xs text-charcoal/50">
                      <button onClick={() => { setEditingId(e.id); setEditBody(e.body); }} className="hover:text-midnight-navy">Edit</button>
                      <button onClick={() => remove(e.id)} className="hover:text-coral-rose">Delete</button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 font-ui text-sm transition-colors ${
        active ? "bg-midnight-navy text-white" : "border border-midnight-navy/15 text-midnight-navy/70 hover:bg-midnight-navy/5"
      }`}
    >
      {children}
    </button>
  );
}
