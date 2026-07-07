import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionOfferings } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "CE Courses | RLC™ Professional Institute" };

export default async function CeCoursesPage() {
  const offerings = await getSectionOfferings("ce_courses");
  return (
    <InstituteSection
      eyebrow="Continuing Education"
      title="CE Courses"
      intro="Continuing education for licensed professionals — workshops and on-demand courses grounded in the Relationship Life Cycle™ Framework, designed to count toward your professional development."
      offerings={offerings}
      note="CE accreditation details and credit hours will be published as each course is finalized."
    />
  );
}
