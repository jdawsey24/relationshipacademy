import InstituteSection from "@/components/institute/InstituteSection";

export const metadata = { title: "CE Courses | RLC™ Professional Institute" };

export default function CeCoursesPage() {
  return (
    <InstituteSection
      eyebrow="Continuing Education"
      title="CE Courses"
      intro="Continuing education for licensed professionals — workshops and on-demand courses grounded in the Relationship Life Cycle™ Framework, designed to count toward your professional development."
      offerings={[
        { title: "CE-accredited workshops", description: "Live and recorded workshops eligible for continuing education credit." },
        { title: "On-demand CE courses", description: "Self-paced courses you can complete on your own schedule, with certificates of completion." },
        { title: "Framework foundations", description: "A grounding in the Relationship Life Cycle™ model and its clinical relevance." },
        { title: "Applied practice modules", description: "Focused modules on applying the framework to specific presentations and populations." },
      ]}
      note="CE accreditation details and credit hours will be published as each course is finalized."
    />
  );
}
