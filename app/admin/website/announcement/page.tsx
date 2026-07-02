import WebsiteTabs from "@/components/admin/WebsiteTabs";
import ContentEditor from "@/components/admin/ContentEditor";
import { ANNOUNCEMENT_FIELDS } from "@/lib/siteContent";

export default function AnnouncementAdminPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Website</h1>
      <WebsiteTabs />
      <h2 className="mb-1 text-lg font-semibold text-midnight-navy">Announcement banner</h2>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">
        A site-wide bar shown above the header on every public page. Toggle it on, add your message, and optionally link it somewhere.
      </p>
      <ContentEditor fields={ANNOUNCEMENT_FIELDS} />
    </div>
  );
}
