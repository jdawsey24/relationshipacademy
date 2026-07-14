import Logo from "@/components/Logo";

export const metadata = { title: "Unsubscribed" };

export default function UnsubscribedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-warm-ivory px-6 text-center">
      <Logo variant="full" href="/" className="h-11" />
      <h1 className="mt-8 font-display text-3xl font-semibold text-midnight-navy">You&apos;re unsubscribed</h1>
      <p className="mt-3 max-w-md font-body text-charcoal/75">
        You won&apos;t receive any more emails from the Relationship Snapshot&trade; series. Your results are still yours to
        revisit anytime. Take good care.
      </p>
    </main>
  );
}
