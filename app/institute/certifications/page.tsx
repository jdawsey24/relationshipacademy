import InstituteSection from "@/components/institute/InstituteSection";

export const metadata = { title: "Certifications | RLC™ Professional Institute" };

export default function CertificationsPage() {
  return (
    <InstituteSection
      eyebrow="Credentialing"
      title="Certification Programs"
      intro="Formal certification in the Relationship Life Cycle™ Framework for professionals who want to demonstrate proficiency and integrate the model deeply into their practice."
      offerings={[
        { title: "Framework Certification", description: "Core certification in the Relationship Life Cycle™ model and its application." },
        { title: "Clinical Implementation Certification", description: "For clinicians integrating the framework into assessment and treatment." },
        { title: "Assessment Certification", description: "Training and credentialing in administering and interpreting the assessments." },
        { title: "Facilitator Certification", description: "For those leading groups, courses, or workshops using the framework." },
      ]}
      note="Certification requirements, curricula, and pricing will be published as each program launches."
    />
  );
}
