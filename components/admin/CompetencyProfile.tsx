"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KbRecordEditor from "@/components/admin/KbRecordEditor";
import { useCanWrite } from "@/components/admin/RoleContext";
import type { KbCompetency } from "@/lib/studio";

// Inline render of a competency's canonical Framework profile (the imported
// 62-field detail) for the Competency Workspace → Overview tab. Reuses the raw
// record editor so the source of truth is edited in place. Read-only for viewers.
const SECTIONS: [string, string[]][] = [
  ["Definition & purpose", ["Definition", "Purpose", "Developmental Significance", "Consumer Translation"]],
  ["Clinical", ["Clinical Notes", "Assessment Intent", "Item Writing Considerations", "Interpretation Notes"]],
  ["Developmental continuum", ["Continuum - Emerging", "Continuum - Developing", "Continuum - Competent", "Continuum - Advanced", "Continuum - Mastery"]],
  ["Expected applications", ["Clinical Applications", "Educational Applications", "Coaching Considerations", "Facilitation Notes"]],
  ["Developmental barriers & safety", ["Developmental Barriers", "Contraindications", "Cautions", "Suppression or Safety Logic", "Escalation Logic", "Public or Clinical Boundary"]],
  ["Related & links", ["Related Competency IDs", "Behavioral Indicator IDs", "Recommended Practice IDs", "Linked Activity IDs", "Linked Worksheet IDs", "Linked Lesson IDs"]],
  ["Source", ["Source Document", "Source Chapter", "Source Construct", "Source Version"]],
];

export default function CompetencyProfile({ competency }: { competency: KbCompetency }) {
  const canWrite = useCanWrite();
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  const detail = (competency.detail ?? {}) as Record<string, unknown>;
  const get = (k: string) => { const v = detail[k]; return v == null || v === "" ? null : String(v); };
  const list = (arr?: string[]) => (arr && arr.length ? <ul className="mt-1 list-disc pl-5 text-sm text-charcoal/80">{arr.map((x, i) => <li key={i}>{x}</li>)}</ul> : null);

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <p className="max-w-2xl text-sm text-charcoal/70">The canonical definition of this competency — the source of truth every asset below derives from.</p>
        {canWrite && <button onClick={() => setEditing(true)} className="shrink-0 rounded-md border border-midnight-navy px-3 py-1.5 text-sm font-medium text-midnight-navy hover:bg-light-gray">Edit record</button>}
      </div>

      {competency.definition && <p className="mb-3 text-sm text-charcoal/90"><span className="font-semibold">Definition:</span> {competency.definition}</p>}
      {competency.developmental_task && <p className="mb-3 text-sm"><span className="font-semibold">Developmental task:</span> {competency.developmental_task}</p>}
      {competency.healthy_markers?.length > 0 && <div className="mb-4"><span className="text-sm font-semibold text-charcoal">Observable expressions</span>{list(competency.healthy_markers)}</div>}
      {competency.common_challenges?.length > 0 && <div className="mb-4"><span className="text-sm font-semibold text-charcoal">Common challenges</span>{list(competency.common_challenges)}</div>}

      {SECTIONS.map(([heading, keys]) => {
        const present = keys.map((k) => [k, get(k)] as const).filter(([, v]) => v);
        if (present.length === 0) return null;
        return (
          <div key={heading} className="mb-4 border-t border-light-gray pt-3">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal/60">{heading}</h3>
            {present.map(([k, v]) => (
              <p key={k} className="mb-1.5 text-sm text-charcoal/80"><span className="font-medium">{k.replace(/^Continuum - /, "")}:</span> {v}</p>
            ))}
          </div>
        );
      })}

      {editing && <KbRecordEditor draft={competency} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); router.refresh(); }} />}
    </div>
  );
}
