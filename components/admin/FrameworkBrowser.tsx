"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DOMAIN_SLUGS, PHASE_SLUGS, domainLabel, phaseLabel, type FrameworkTree } from "@/lib/studioFramework";

// The Framework hierarchy browser. Preserves the full theoretical structure —
// Phase → Domain → Competency — and keeps every competency associated with BOTH
// its phase and its domain. A pivot toggle flips which axis nests first; the other
// axis is always shown as a chip so the relationship stays obvious. Competencies
// link into their workspace (the operational hub).

type Pivot = "domain" | "phase";

export default function FrameworkBrowser({ tree }: { tree: FrameworkTree }) {
  const [pivot, setPivot] = useState<Pivot>("domain");
  const [search, setSearch] = useState("");
  const [hideRetired, setHideRetired] = useState(true);

  const domainName = useMemo(() => new Map(tree.domains.map((d) => [d.slug, d.name])), [tree.domains]);
  const phaseName = useMemo(() => new Map(tree.phases.map((p) => [p.slug, p.name])), [tree.phases]);

  const competencies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tree.competencies.filter((c) => {
      if (hideRetired && c.status === "retired") return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    });
  }, [tree.competencies, search, hideRetired]);

  // Nesting order — primary group, then secondary subgroup.
  const primarySlugs = pivot === "domain" ? DOMAIN_SLUGS : PHASE_SLUGS;
  const secondarySlugs = pivot === "domain" ? PHASE_SLUGS : DOMAIN_SLUGS;
  const primaryOf = (c: (typeof competencies)[number]) => (pivot === "domain" ? c.domain_slug : c.phase_slug) ?? "";
  const secondaryOf = (c: (typeof competencies)[number]) => (pivot === "domain" ? c.phase_slug : c.domain_slug) ?? "";
  const primaryLabel = (s: string) => (pivot === "domain" ? domainName.get(s) ?? domainLabel(s) : phaseName.get(s) ?? phaseLabel(s));
  const secondaryLabel = (s: string) => (pivot === "domain" ? phaseName.get(s) ?? phaseLabel(s) : domainName.get(s) ?? domainLabel(s));

  // Preserve declared order, then append any unexpected slugs found in data.
  const orderedPrimary = useMemo(() => {
    const found = new Set(competencies.map(primaryOf).filter(Boolean));
    const extras = [...found].filter((s) => !(primarySlugs as readonly string[]).includes(s));
    return [...(primarySlugs as readonly string[]).filter((s) => found.has(s)), ...extras];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competencies, pivot]);

  const btn = "rounded-md px-3 py-1.5 text-sm transition-colors";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-charcoal/70">Group by</span>
        <div className="flex overflow-hidden rounded-md border border-light-gray">
          <button onClick={() => setPivot("domain")} className={`${btn} ${pivot === "domain" ? "bg-midnight-navy text-white" : "text-charcoal/70 hover:bg-light-gray"}`}>Domain → Phase</button>
          <button onClick={() => setPivot("phase")} className={`${btn} ${pivot === "phase" ? "bg-midnight-navy text-white" : "text-charcoal/70 hover:bg-light-gray"}`}>Phase → Domain</button>
        </div>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search competencies…" className="min-w-[180px] flex-1 rounded-md border border-light-gray px-2 py-1.5 text-sm" />
        <label className="flex items-center gap-1.5 text-sm text-charcoal/70"><input type="checkbox" checked={hideRetired} onChange={(e) => setHideRetired(e.target.checked)} /> Hide retired</label>
      </div>
      <div className="mb-4 text-xs text-charcoal/50">{competencies.length} competencies · {tree.domains.length} domains · {tree.phases.length} phases</div>

      {orderedPrimary.length === 0 && (
        <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-6 text-sm text-charcoal/60">
          No competencies found. If the Studio tables aren&apos;t populated yet, run the KB import.
        </p>
      )}

      <div className="space-y-6">
        {orderedPrimary.map((pslug) => {
          const inPrimary = competencies.filter((c) => primaryOf(c) === pslug);
          const secondaryFound = new Set(inPrimary.map(secondaryOf).filter(Boolean));
          const orderedSecondary = [
            ...(secondarySlugs as readonly string[]).filter((s) => secondaryFound.has(s)),
            ...[...secondaryFound].filter((s) => !(secondarySlugs as readonly string[]).includes(s)),
          ];
          return (
            <section key={pslug} className="rounded-lg border border-light-gray">
              <header className="flex items-center justify-between rounded-t-lg bg-midnight-navy/5 px-4 py-2.5">
                <h2 className="text-base font-semibold text-midnight-navy">{primaryLabel(pslug)}</h2>
                <span className="text-xs text-charcoal/50">{inPrimary.length} {inPrimary.length === 1 ? "competency" : "competencies"}</span>
              </header>
              <div className="divide-y divide-light-gray">
                {orderedSecondary.map((sslug) => {
                  const rows = inPrimary.filter((c) => secondaryOf(c) === sslug);
                  if (rows.length === 0) return null;
                  return (
                    <div key={sslug} className="px-4 py-3">
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">{secondaryLabel(sslug)}</div>
                      <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {rows.map((c) => (
                          <li key={c.code}>
                            <Link
                              href={`/admin/studio/competency/${encodeURIComponent(c.code)}`}
                              className={`block rounded-md border border-light-gray px-3 py-2 transition-colors hover:border-midnight-navy hover:bg-light-gray/50 ${c.status === "retired" ? "opacity-50" : ""}`}
                            >
                              <span className="block text-sm font-medium text-midnight-navy">{c.name}</span>
                              <span className="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] text-charcoal/50">
                                <span className="font-mono">{c.code}</span>
                                <span className="rounded bg-dusty-plum/10 px-1.5 py-0.5 text-dusty-plum">{domainName.get(c.domain_slug ?? "") ?? domainLabel(c.domain_slug ?? "")}</span>
                                <span className="rounded bg-sage-green/15 px-1.5 py-0.5 text-sage-green">{phaseName.get(c.phase_slug ?? "") ?? phaseLabel(c.phase_slug ?? "")}</span>
                                {c.status === "retired" && <span className="rounded bg-light-gray px-1.5 py-0.5 uppercase">retired</span>}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
