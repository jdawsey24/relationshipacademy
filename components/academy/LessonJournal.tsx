"use client";

import { useState } from "react";
import type { JournalEntry } from "@/lib/academy";

// Private journal box on a lesson page. Members write reflections tied to the
// lesson; existing entries for this lesson are listed with edit/delete.
export default function LessonJournal({
  lessonId,
  courseId,
  initialEntries,
}: {
  lessonId: string;
  courseId: string;
  initialEntries: JournalEntry[];
}) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  async function save() {
    if (!draft.trim()) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/academy/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: draft, lessonId, courseId }),
    }).catch(() => null);
    setSaving(false);
    if (!res || !res.ok) {
      setError("Could not save your entry. Please try again.");
      return;
    }
    const { entry } = await res.json();
    setEntries([entry, ...entries]);
    setDraft("");
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
    <div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={4}
        placeholder="Write a private reflection for this lesson…"
        className="w-full rounded-xl border border-light-gray bg-warm-ivory/40 p-4 font-body text-sm text-charcoal outline-none focus:border-midnight-navy"
      />
      {error && <p className="mt-2 font-body text-sm text-coral-rose">{error}</p>}
      <div className="mt-3 flex items-center justify-between">
        <p className="font-ui text-xs text-charcoal/50">Only you can see your journal.</p>
        <button
          type="button"
          onClick={save}
          disabled={saving || !draft.trim()}
          className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save reflection"}
        </button>
      </div>

      {entries.length > 0 && (
        <ul className="mt-6 space-y-4 border-t border-midnight-navy/8 pt-5">
          {entries.map((e) => (
            <li key={e.id} className="rounded-xl bg-warm-ivory/60 p-4">
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
                  <p className="whitespace-pre-wrap font-body text-sm text-charcoal">{e.body}</p>
                  <div className="mt-2 flex items-center gap-3 font-ui text-xs text-charcoal/50">
                    <span>{new Date(e.updated_at).toLocaleDateString()}</span>
                    <button onClick={() => { setEditingId(e.id); setEditBody(e.body); }} className="hover:text-midnight-navy">Edit</button>
                    <button onClick={() => remove(e.id)} className="hover:text-coral-rose">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
