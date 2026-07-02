import FrameworkTabs from "@/components/admin/FrameworkTabs";
import ContentEditor from "@/components/admin/ContentEditor";
import { PHASE_FIELDS } from "@/lib/siteContent";

export default function FrameworkPhasesPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Framework</h1>
      <FrameworkTabs />
      <div className="mb-5 rounded-md border-l-4 border-coral-rose bg-coral-rose/5 py-3 pl-4 pr-3 text-sm text-charcoal">
        The six developmental phases are protected. You can edit their public-facing copy here, but the phase
        structure (names, order, developmental tasks) cannot be changed from this panel — contact your developer
        to modify phase structure.
      </div>
      <h2 className="mb-1 text-lg font-semibold text-midnight-navy">Phase copy</h2>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">
        The primary focus and one-sentence description shown on the framework and home phase cards. Blank fields fall back to defaults.
      </p>
      <ContentEditor fields={PHASE_FIELDS} />
    </div>
  );
}
