"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Records a "view" when the lesson mounts and renders the Mark complete toggle.
// Only active for accessible lessons (locked previews pass active={false}).
export default function LessonProgress({
  lessonId,
  courseId,
  initialCompleted,
  active,
}: {
  lessonId: string;
  courseId: string;
  initialCompleted: boolean;
  active: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!active) return;
    fetch("/api/academy/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, courseId, action: "view" }),
    }).catch(() => {});
  }, [active, lessonId, courseId]);

  if (!active) return null;

  async function toggle() {
    setSaving(true);
    const action = completed ? "uncomplete" : "complete";
    const res = await fetch("/api/academy/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, courseId, action }),
    }).catch(() => null);
    setSaving(false);
    if (res && res.ok) {
      setCompleted(!completed);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-ui text-sm font-medium transition-colors disabled:opacity-50 ${
        completed
          ? "bg-sage-green text-white hover:bg-sage-green/90"
          : "bg-midnight-navy text-white hover:bg-midnight-navy/90"
      }`}
    >
      {completed ? "✓ Completed" : saving ? "Saving…" : "Mark complete"}
    </button>
  );
}
