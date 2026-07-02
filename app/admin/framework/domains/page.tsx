import FrameworkTabs from "@/components/admin/FrameworkTabs";
import ContentEditor from "@/components/admin/ContentEditor";
import { DOMAIN_FIELDS } from "@/lib/siteContent";

export default function FrameworkDomainsPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Framework</h1>
      <FrameworkTabs />
      <h2 className="mb-1 text-lg font-semibold text-midnight-navy">Domain descriptions</h2>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">
        The six universal domains as they appear on the framework page. Blank fields fall back to defaults.
      </p>
      <ContentEditor fields={DOMAIN_FIELDS} />
    </div>
  );
}
