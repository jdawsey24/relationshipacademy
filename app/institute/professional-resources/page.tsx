import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionOfferings } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Professional Resources | RLC™ Professional Institute" };

export default async function ProfessionalResourcesPage() {
  const offerings = await getSectionOfferings("professional_resources");
  return (
    <InstituteSection
      eyebrow="Toolkits & Tools"
      title="Professional Resources"
      intro="Practical implementation resources that help professionals put the Relationship Life Cycle™ Framework to work — toolkits, assessment instruments, and ready-to-use materials."
      offerings={offerings}
      note="Resources and case consultation groups will be made available to enrolled and certified professionals."
    />
  );
}
