import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { tierLabel, TIERS } from "@/lib/academy";
import { TierBadge } from "@/components/academy/ui";
import AccountForm from "@/components/academy/AccountForm";
import BillingPanel from "@/components/academy/BillingPanel";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const currentTier = TIERS.find((t) => t.value === member.profile.membership_tier);

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Account</h1>
        <p className="mt-2 font-body text-charcoal/70">Manage your profile, password, and membership.</p>
      </header>

      {/* Membership status */}
      <div className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-plum">Membership</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-display text-2xl font-semibold text-midnight-navy">
                {tierLabel(member.profile.membership_tier)}
              </span>
              <TierBadge tier={member.profile.membership_tier} />
            </div>
            {currentTier && <p className="mt-1 font-body text-sm text-charcoal/60">{currentTier.blurb}</p>}
          </div>
          <div className="font-ui text-sm text-charcoal/60">
            <p>{member.user.email}</p>
          </div>
        </div>
        {member.isStaff && (
          <p className="mt-4 font-ui text-xs text-charcoal/50">
            Staff account — you have full-access preview of all Academy content.
          </p>
        )}
      </div>

      {/* Plans / billing (members only — staff get access via role) */}
      {!member.isStaff && (
        <Suspense fallback={null}>
          <BillingPanel
            currentTier={member.profile.membership_tier}
            hasBilling={!!member.profile.stripe_customer_id}
            status={member.profile.subscription_status ?? null}
          />
        </Suspense>
      )}

      <AccountForm
        initialName={member.profile.full_name ?? ""}
        initialSkoolJoined={member.profile.skool_joined}
      />

      <p className="text-center font-ui text-sm text-charcoal/60">
        Are you a therapist, coach, or practitioner?{" "}
        <a href="/academy/professional" className="text-midnight-navy underline underline-offset-4 hover:text-plum">
          Explore Professional training →
        </a>
      </p>
    </div>
  );
}
