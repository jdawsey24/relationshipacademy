import InstituteSection from "@/components/institute/InstituteSection";

export const metadata = { title: "Research | RLC™ Professional Institute" };

export default function ResearchPage() {
  return (
    <InstituteSection
      eyebrow="Scholarship"
      title="Research & Publications"
      intro="The scholarly foundation of the Relationship Life Cycle™ Framework — research, white papers, and publications that inform professional practice and advance the model."
      offerings={[
        { title: "Framework white papers", description: "Foundational papers detailing the developmental model and its constructs." },
        { title: "Applied research", description: "Studies on outcomes and application across clinical and educational settings." },
        { title: "Publications library", description: "A curated library of articles and references for professional readers." },
        { title: "Contribute to research", description: "Opportunities for practitioners to participate in ongoing research." },
      ]}
      note="Publications and research participation opportunities will be posted here as they become available."
    />
  );
}
