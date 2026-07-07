import InstituteSection from "@/components/institute/InstituteSection";

export const metadata = { title: "Workshops | RLC™ Professional Institute" };

export default function WorkshopsPage() {
  return (
    <InstituteSection
      eyebrow="Live Training"
      title="Professional Workshops"
      intro="Live, interactive workshops where helping professionals learn to use the Relationship Life Cycle™ Framework in real practice — with room for questions, discussion, and case examples."
      offerings={[
        { title: "Framework intensives", description: "Deep-dive sessions on the phases, domains, and developmental logic of the model." },
        { title: "Clinical application workshops", description: "How to translate the framework into assessment, treatment planning, and sessions." },
        { title: "Population-specific sessions", description: "Workshops focused on couples, families, faith communities, and workplace settings." },
        { title: "Cohort workshops", description: "Small-group live cohorts for practitioners who want guided implementation." },
      ]}
      note="Workshop dates and registration will open here as they are scheduled."
    />
  );
}
