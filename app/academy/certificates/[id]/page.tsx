import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { getCertificate } from "@/lib/certificates";
import Logo from "@/components/Logo";
import PrintButton from "@/components/academy/PrintButton";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const member = await getMember();
  if (!member) redirect("/academy/login");
  const { id } = await params;

  const cert = await getCertificate(id, member.user.id);
  if (!cert) notFound();

  const issued = new Date(cert.issued_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const name = cert.recipient_name || member.profile.full_name || "Valued Member";

  return (
    <div className="mx-auto max-w-4xl">
      {/* Controls (hidden when printing) */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/academy/certificates" className="font-ui text-sm text-charcoal/60 hover:text-midnight-navy">
          ← All certificates
        </Link>
        <PrintButton />
      </div>

      {/* The certificate */}
      <div className="relative overflow-hidden rounded-2xl border border-midnight-navy/15 bg-white p-10 shadow-sm print:rounded-none print:border-0 print:shadow-none sm:p-14">
        {/* Decorative inner frame */}
        <div className="pointer-events-none absolute inset-4 rounded-xl border border-plum/25 print:inset-6" />
        <div className="relative text-center">
          <Logo variant="mark" className="mx-auto h-12" />
          <p className="mt-6 font-ui text-xs uppercase tracking-[0.3em] text-plum">
            Relationship Life Cycle™ Academy
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
            Certificate of Completion
          </h1>

          <p className="mt-8 font-body text-charcoal/70">This certifies that</p>
          <p className="mt-2 font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
            {name}
          </p>

          <p className="mt-6 font-body text-charcoal/70">has successfully completed</p>
          <p className="mt-2 font-display text-2xl font-medium text-plum">{cert.course_title}</p>

          <div className="mx-auto mt-10 flex max-w-lg items-end justify-between gap-8">
            <div className="flex-1 text-center">
              <div className="border-t border-midnight-navy/30 pt-2 font-ui text-sm text-charcoal/70">
                Janelle Dawsey
              </div>
              <p className="font-ui text-xs text-charcoal/50">Founder, Relationship Life Cycle™</p>
            </div>
            <div className="flex-1 text-center">
              <div className="border-t border-midnight-navy/30 pt-2 font-ui text-sm text-charcoal/70">
                {issued}
              </div>
              <p className="font-ui text-xs text-charcoal/50">Date issued</p>
            </div>
          </div>

          <p className="mt-8 font-ui text-[11px] uppercase tracking-[0.2em] text-charcoal/40">
            Certificate No. {cert.serial}
          </p>
        </div>
      </div>
    </div>
  );
}
