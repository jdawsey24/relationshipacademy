import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import AnnouncementBanner from "@/components/site/AnnouncementBanner";

// Shared chrome for all public marketing/framework pages. The quiz (/snapshot)
// and admin (/admin) live outside this group and are unaffected.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-ivory">
      <AnnouncementBanner />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
