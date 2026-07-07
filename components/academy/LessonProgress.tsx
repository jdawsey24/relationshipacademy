"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Records a "view" when the lesson mounts and renders the Mark complete toggle.
// When completing a lesson finishes the whole course, the API returns a freshly
// issued certificate, which we celebrate inline.
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
  const [certId, setCertId] = useState<string | null>(null);

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
      try {
        const data = await res.json();
        if (data.certificateNew && data.certificate?.id) setCertId(data.certificate.id);
      } catch { /* ignore */ }
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {certId && (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-sage-green/20 px-5 py-4 text-center">
          <span className="text-2xl">🏆</span>
          <p className="font-body text-sm text-midnight-navy">
            You&apos;ve completed the course! Your certificate is ready.
          </p>
          <Link
            href={`/academy/certificates/${certId}`}
            className="rounded-full bg-midnight-navy px-5 py-2 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90"
          >
            View certificate
          </Link>
        </div>
      )}
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
    </div>
  );
}
