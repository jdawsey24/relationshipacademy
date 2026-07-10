import { toEmbedUrl, type LiveSession } from "@/lib/live";

// Renders a set of live sessions: anything currently live (with embedded player
// or join button), upcoming sessions, and past sessions with replays. Server
// component — no client state needed.

function fmt(dt: string | null): string {
  if (!dt) return "";
  return new Date(dt).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function Player({ embedUrl, title }: { embedUrl: string; title: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

export default function LiveSessionsView({ sessions }: { sessions: LiveSession[] }) {
  const live = sessions.filter((s) => s.status === "live");
  const upcoming = sessions.filter((s) => s.status === "scheduled");
  const replays = sessions.filter((s) => s.status === "ended" && s.replay_url);

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-midnight-navy/10 bg-white p-8 text-center">
        <p className="font-body text-charcoal/70">No live sessions scheduled right now. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Live now */}
      {live.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-rose px-2.5 py-0.5 font-ui text-xs font-semibold uppercase tracking-wide text-white">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live now
            </span>
          </div>
          <div className="space-y-8">
            {live.map((s) => {
              const embed = toEmbedUrl(s.embed_url);
              return (
                <div key={s.id} className="rounded-2xl border border-midnight-navy/10 bg-white p-5">
                  <h3 className="font-display text-xl font-semibold text-midnight-navy">{s.title}</h3>
                  {s.description && <p className="mt-1 font-body text-sm text-charcoal/70">{s.description}</p>}
                  <div className="mt-4">
                    {embed ? (
                      <Player embedUrl={embed} title={s.title} />
                    ) : s.join_url ? (
                      <a href={s.join_url} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white hover:bg-coral-rose/90">
                        Join live now →
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-midnight-navy">Upcoming</h2>
          <ul className="space-y-3">
            {upcoming.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-midnight-navy/10 bg-white p-5">
                <div>
                  <p className="font-body font-medium text-midnight-navy">{s.title}</p>
                  {s.scheduled_at && <p className="mt-0.5 font-ui text-sm text-charcoal/60">{fmt(s.scheduled_at)}</p>}
                  {s.description && <p className="mt-1 font-body text-sm text-charcoal/70">{s.description}</p>}
                </div>
                {s.join_url && (
                  <a href={s.join_url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full border border-midnight-navy/20 px-5 py-2 font-ui text-sm font-medium text-midnight-navy hover:bg-midnight-navy/5">
                    Join link
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Replays */}
      {replays.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-midnight-navy">Replays</h2>
          <ul className="space-y-3">
            {replays.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-midnight-navy/10 bg-white p-5">
                <div>
                  <p className="font-body font-medium text-midnight-navy">{s.title}</p>
                  {s.scheduled_at && <p className="mt-0.5 font-ui text-sm text-charcoal/50">{fmt(s.scheduled_at)}</p>}
                </div>
                <a href={s.replay_url!} target="_blank" rel="noopener noreferrer" className="shrink-0 font-ui text-sm text-midnight-navy underline underline-offset-4 hover:text-plum">
                  Watch replay →
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
