// Client-safe live-session types + helpers. NO server imports.

export type LiveArea = "academy" | "institute";
export type LiveStatus = "scheduled" | "live" | "ended";
export const LIVE_STATUSES: LiveStatus[] = ["scheduled", "live", "ended"];
export const LIVE_AREAS: { key: LiveArea; label: string }[] = [
  { key: "academy", label: "Academy" },
  { key: "institute", label: "Institute" },
];

export interface LiveSession {
  id: string;
  area: LiveArea;
  title: string;
  description: string | null;
  embed_url: string | null;
  join_url: string | null;
  replay_url: string | null;
  scheduled_at: string | null;
  status: LiveStatus;
  min_tier: string;
  sort_order: number;
}

/**
 * Normalize common YouTube/Vimeo URLs into an embeddable iframe URL so admins
 * can paste a normal watch/live link. Unknown or already-embed URLs pass through.
 */
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const u = url.trim();
  try {
    const parsed = new URL(u);
    const host = parsed.hostname.replace(/^www\./, "");
    // Already an embed
    if (parsed.pathname.startsWith("/embed/") || host === "player.vimeo.com") return u;
    // youtu.be/ID
    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : u;
    }
    if (host === "youtube.com") {
      // watch?v=ID
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // /live/ID
      const live = parsed.pathname.match(/^\/live\/([^/]+)/);
      if (live) return `https://www.youtube.com/embed/${live[1]}`;
    }
    // vimeo.com/ID
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return u;
  } catch {
    return u;
  }
}

/** Sort for display: live first, then soonest upcoming, then most recent ended. */
export function sortSessions(sessions: LiveSession[]): LiveSession[] {
  const rank: Record<LiveStatus, number> = { live: 0, scheduled: 1, ended: 2 };
  return [...sessions].sort((a, b) => {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    const at = a.scheduled_at ? Date.parse(a.scheduled_at) : 0;
    const bt = b.scheduled_at ? Date.parse(b.scheduled_at) : 0;
    // upcoming: soonest first; ended: most recent first
    return a.status === "ended" ? bt - at : at - bt;
  });
}
