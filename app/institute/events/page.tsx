import InstituteSection from "@/components/institute/InstituteSection";

export const metadata = { title: "Events | RLC™ Professional Institute" };

export default function EventsPage() {
  return (
    <InstituteSection
      eyebrow="Community & Gatherings"
      title="Conferences & Events"
      intro="Opportunities to gather, learn, and connect with the professional community around the Relationship Life Cycle™ Framework — conferences, summits, and special events."
      offerings={[
        { title: "Annual conference", description: "A flagship gathering for professionals using the framework (future)." },
        { title: "Special events & summits", description: "Focused events on emerging topics and applications." },
        { title: "Guest lectures & panels", description: "Sessions with leaders across the helping professions." },
        { title: "Community networking", description: "Connect with a growing network of certified professionals." },
      ]}
      note="Events are planned for a future phase of the Institute. Register your interest to be notified first."
    />
  );
}
