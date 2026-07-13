"use client";

import { useState } from "react";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import SimulationPanel from "@/components/admin/scoring/SimulationPanel";
import RulesBandsPanel from "@/components/admin/scoring/RulesBandsPanel";
import IncongruencePanel from "@/components/admin/scoring/IncongruencePanel";
import PhaseMappingPanel from "@/components/admin/scoring/PhaseMappingPanel";

const TABS = [
  ["simulation", "Simulation"],
  ["rules", "Rules & Bands"],
  ["incongruence", "Incongruence"],
  ["phase", "Phase Mapping"],
] as const;

export default function ScoringPage() {
  const [tab, setTab] = useState<string>("simulation");
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Deterministic scoring for the Studio-authored Snapshot. Owner-authored, <strong>provisional</strong>, simulation-only — never scores real users. AI cannot compute scores or set cut-points.</p>
      <StudioNav />
      <AssessmentNav />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map(([v, label]) => (
          <button key={v} onClick={() => setTab(v)} className={`rounded-md px-3 py-1.5 text-sm ${tab === v ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"}`}>{label}</button>
        ))}
      </div>

      {tab === "simulation" && <SimulationPanel />}
      {tab === "rules" && <RulesBandsPanel />}
      {tab === "incongruence" && <IncongruencePanel />}
      {tab === "phase" && <PhaseMappingPanel />}
    </div>
  );
}
