import Logo from "@/components/Logo";
import LandingHeader from "@/components/landing/LandingHeader";

// Dedicated chrome for the Relationship Snapshot™ landing page — its own
// simplified header (not the global site nav) and a mobile sticky CTA. Single
// offer only: every primary action starts the Snapshot.
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-ivory font-body text-charcoal">
      <LandingHeader />
      <div className="pb-24 md:pb-0">{children}</div>

      <footer className="border-t border-light-gray bg-warm-ivory px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
          <Logo variant="monogram" className="h-9" />
          <p className="font-body text-sm text-charcoal/60">
            The Relationship Snapshot&trade; · Relationship Life Cycle&trade;
          </p>
          <p className="font-body text-sm text-charcoal/50">Created by Janelle Dawsey, LMFT</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-ui text-xs text-charcoal/55">
            <a href="/framework" className="hover:text-midnight-navy">The Framework</a>
            <a href="/privacy" className="hover:text-midnight-navy">Privacy</a>
            <a href="/snapshot" className="hover:text-midnight-navy">Take the Snapshot</a>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-light-gray bg-warm-ivory/95 p-3 backdrop-blur md:hidden">
        <a href="/snapshot" className="flex min-h-[50px] w-full items-center justify-center rounded-full bg-midnight-navy font-ui text-base font-semibold text-white">
          Take the Snapshot
        </a>
      </div>
    </div>
  );
}
