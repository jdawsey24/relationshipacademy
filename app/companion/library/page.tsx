"use client";
import CompanionChrome from "@/components/companion/CompanionChrome";

export default function CompanionLibrary() {
  return (
    <CompanionChrome active="library">
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Library</h1>
      <p className="mt-2 font-body text-sm text-charcoal/60">Playbooks, unlocked experiences, and saved resources. Arrives with entitlements in a later phase.</p>
      <div className="mt-6 rounded-2xl border border-dashed border-light-gray bg-white/60 p-8 text-center font-body text-sm text-charcoal/45">[LIBRARY CONTENT TO BE PROVIDED]</div>
    </CompanionChrome>
  );
}
