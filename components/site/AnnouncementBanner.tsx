"use client";

import { useEffect, useState } from "react";

interface Announcement {
  enabled: boolean;
  text: string;
  link: string;
}

// Global banner, fetched client-side so the (site) pages stay static. Renders
// nothing unless enabled with text. Sits above the fixed header.
export default function AnnouncementBanner() {
  const [a, setA] = useState<Announcement | null>(null);

  useEffect(() => {
    fetch("/api/public-content")
      .then((r) => r.json())
      .then((d) => setA(d.announcement))
      .catch(() => setA(null));
  }, []);

  if (!a || !a.enabled || !a.text) return null;

  const inner = <span className="font-ui text-sm">{a.text}</span>;
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-coral-rose px-4 py-2 text-center text-white">
      {a.link ? (
        <a href={a.link} className="underline underline-offset-2 hover:opacity-90">{inner}</a>
      ) : inner}
    </div>
  );
}
