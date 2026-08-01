import { routesFrom } from "@/lib/playbook/crossPlaybookRoutes";

// "This might not be the one" — cross-Playbook suggestions for the current Playbook.
// Decoupled from navigation so it works both in the live route and the preview
// switcher: pass `titleFor` to resolve a target's display name, and EITHER `onSelect`
// (in-page switch) OR `hrefFor` (routed links). Renders nothing when there are no routes.
export default function RelatedPlaybooks({
  fromKey,
  titleFor,
  onSelect,
  hrefFor,
}: {
  fromKey: string;
  titleFor: (key: string) => string | undefined;
  onSelect?: (key: string) => void;
  hrefFor?: (key: string) => string;
}) {
  const routes = routesFrom(fromKey);
  if (routes.length === 0) return null;

  const cls =
    "block w-full rounded-xl border border-light-gray bg-white px-4 py-3 text-left transition hover:border-midnight-navy/40";

  return (
    <section className="mx-auto mt-10 max-w-2xl rounded-2xl border border-light-gray bg-white/60 p-5">
      <p className="font-ui text-eyebrow font-semibold uppercase text-charcoal/45">This might not be the one</p>
      <p className="mt-1 font-body text-micro text-charcoal/60">If one of these fits your situation better, start there instead.</p>
      <ul className="mt-4 space-y-2.5">
        {routes.map((r) => {
          const inner = (
            <span className="flex items-start gap-3">
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-semibold leading-tight text-midnight-navy">{titleFor(r.to) ?? r.to}</span>
                <span className="mt-0.5 block font-body text-micro text-charcoal/65">{r.reason}</span>
              </span>
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-charcoal/30">→</span>
            </span>
          );
          return (
            <li key={r.to}>
              {hrefFor ? (
                <a href={hrefFor(r.to)} className={cls}>{inner}</a>
              ) : (
                <button type="button" onClick={() => onSelect?.(r.to)} className={cls}>{inner}</button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
