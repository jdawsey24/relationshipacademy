import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionOfferings } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Certifications | RLC™ Professional Institute" };

export default async function CertificationsPage() {
  const offerings = await getSectionOfferings("certifications");
  return (
    <InstituteSection
      eyebrow="Credentialing"
      title="Certification Programs"
      intro="Formal certification in the Relationship Life Cycle™ Framework for professionals who want to demonstrate proficiency and integrate the model deeply into their practice."
      offerings={offerings}
      note="Certification requirements, curricula, and pricing will be published as each program launches."
    />
  );
}
