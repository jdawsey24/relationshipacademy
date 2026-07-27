"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlaybookProgress } from "@/lib/playbook/contentSchema";

/**
 * Holds the user's progress locally and debounce-persists it to the progress API.
 * Optimistic: local state updates immediately; the PUT is best-effort (the
 * experience remains usable if a save is delayed). Functional data only.
 */
export function useProgress(playbookKey: string, initial: PlaybookProgress) {
  const [progress, setProgress] = useState<PlaybookProgress>(initial);
  const [saving, setSaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(progress);
  latest.current = progress;

  const flush = useCallback(async () => {
    setSaving(true);
    try {
      await fetch(`/api/playbook/${encodeURIComponent(playbookKey)}/progress`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(latest.current),
      });
    } catch {
      // best-effort; local state is the source of truth for this session
    } finally {
      setSaving(false);
    }
  }, [playbookKey]);

  const update = useCallback(
    (mutator: (prev: PlaybookProgress) => PlaybookProgress) => {
      setProgress((prev) => {
        const next = mutator(prev);
        latest.current = next;
        return next;
      });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), 800);
    },
    [flush],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { progress, update, saving, flushNow: flush };
}
