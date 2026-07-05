import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import AnnouncementBanner from "@/components/site/AnnouncementBanner";
import Analytics from "@/components/site/Analytics";
import { getSiteContentMap, get } from "@/lib/siteContent";

// ISR so the footer's settings read (social links, footer note) is cached
// rather than hitting the DB on every request.
export const revalidate = 60;

// Shared chrome for all public marketing/framework pages. The quiz (/snapshot)
// and admin (/admin) live outside this group and are unaffected.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const map = await getSiteContentMap();
  return (
    <div className="min-h-screen bg-warm-ivory">
      <Analytics
        gaId={get(map, "settings.ga_id", "")}
        metaPixelId={get(map, "settings.meta_pixel_id", "")}
      />
      <AnnouncementBanner />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
