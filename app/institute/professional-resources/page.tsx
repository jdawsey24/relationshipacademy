import InstituteSection from "@/components/institute/InstituteSection";

export const metadata = { title: "Professional Resources | RLC™ Professional Institute" };

export default function ProfessionalResourcesPage() {
  return (
    <InstituteSection
      eyebrow="Toolkits & Tools"
      title="Professional Resources"
      intro="Practical implementation resources that help professionals put the Relationship Life Cycle™ Framework to work — toolkits, assessment instruments, and ready-to-use materials."
      offerings={[
        { title: "Implementation toolkits", description: "Step-by-step guides for integrating the framework into your practice." },
        { title: "Assessment instruments", description: "Professional versions of the Relationship Life Cycle™ assessments and scoring guides." },
        { title: "Client-facing materials", description: "Handouts, worksheets, and psychoeducational materials to use with clients." },
        { title: "Case consultation groups", description: "Ongoing peer consultation groups to support applied use of the framework." },
      ]}
      note="Resources and case consultation groups will be made available to enrolled and certified professionals."
    />
  );
}
