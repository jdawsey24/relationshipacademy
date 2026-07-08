import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionContent } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Certifications | RLC™ Professional Institute" };

export default async function CertificationsPage() {
  const props = await getSectionContent("certifications");
  return <InstituteSection {...props} />;
}
