import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Relationship Profile™ | Relationship Life Cycle™",
};

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-warm-ivory px-6 text-center">
      <Logo variant="full" href="/" className="mb-10 text-xl" />
      <h1 className="font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
        Relationship Profile&trade;
      </h1>
      <p className="mt-4 max-w-md font-body text-lg text-charcoal">
        The full Relationship Profile™ assessment is coming soon.
      </p>
      <Link
        href="/"
        className="mt-10 font-ui text-sm text-midnight-navy underline underline-offset-4"
      >
        ← Back to home
      </Link>
    </main>
  );
}
