import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionOfferings } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events | RLC™ Professional Institute" };

export default async function EventsPage() {
  const offerings = await getSectionOfferings("events");
  return (
    <InstituteSection
      eyebrow="Community & Gatherings"
      title="Conferences & Events"
      intro="Opportunities to gather, learn, and connect with the professional community around the Relationship Life Cycle™ Framework — conferences, summits, and special events."
      offerings={offerings}
      note="Events are planned for a future phase of the Institute. Register your interest to be notified first."
    />
  );
}
