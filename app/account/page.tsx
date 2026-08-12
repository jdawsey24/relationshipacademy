import { redirect } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { tierRank } from "@/lib/academy";

// The client portal doorway.
//
// /account/login and /account/signup already existed; the address they are
// leaves of did not. That was fine while the header's only entry point was
// labelled "Academy" and pointed at the Academy join page, and stopped being
// fine the moment the label became "Client Portal": most clients here have
// never joined the Academy. They bought a Playbook or the Companion, and
// sending them to a membership sales page is telling a paying customer she is
// a stranger.
//
// So this routes by what she actually has, rather than asking her to know
// which product's portal she belongs in:
//
//   not signed in  → the neutral login, returning here afterwards
//   Academy member → the Academy dashboard
//   anyone else    → her Playbook library
//
// A redirect rather than a page, because a portal that is only a menu of links
// to the one place she can go is a page she has to read to learn nothing.

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const member = await getMember();
  if (!member) redirect("/account/login?next=/account");
  if (member.isStaff || tierRank(member.tier) >= tierRank("academy")) redirect("/academy/dashboard");
  redirect("/playbooks");
}
