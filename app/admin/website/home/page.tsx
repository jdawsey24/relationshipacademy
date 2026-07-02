import WebsiteTabs from "@/components/admin/WebsiteTabs";
import ContentEditor from "@/components/admin/ContentEditor";
import { HOME_FIELDS } from "@/lib/siteContent";

export default function HomeAdminPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Website</h1>
      <WebsiteTabs />
      <h2 className="mb-1 text-lg font-semibold text-midnight-navy">Home page</h2>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">
        Edit the home hero. Leave a field blank to fall back to the built-in default. More sections and pages are being added.
      </p>
      <ContentEditor fields={HOME_FIELDS} />
    </div>
  );
}
