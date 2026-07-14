// The Relationship Moments™ visual library. Each entry maps to an image the owner
// drops into /public/moments/. Until the asset exists, the tile shows its soft
// brand tint (graceful — never a broken image). See public/moments/README.md.
export interface Moment {
  key: string;
  src: string;
  alt: string;
  tint: string; // fallback background before the asset loads
}

export const MOMENTS: Record<string, Moment> = {
  coffee: { key: "coffee", src: "/moments/coffee.jpg", alt: "Two people talking over coffee", tint: "bg-soft-coral/30" },
  walking: { key: "walking", src: "/moments/walking.jpg", alt: "A couple walking together", tint: "bg-sage-green/30" },
  conversation: { key: "conversation", src: "/moments/conversation.jpg", alt: "A couple in a respectful conversation", tint: "bg-dusty-plum/25" },
  planning: { key: "planning", src: "/moments/planning.jpg", alt: "A couple planning together", tint: "bg-midnight-navy/15" },
  journal: { key: "journal", src: "/moments/journal.jpg", alt: "Someone reflecting in a journal", tint: "bg-coral-rose/20" },
  portrait: { key: "portrait", src: "/moments/janelle-portrait.jpg", alt: "Janelle Dawsey, LMFT", tint: "bg-dusty-plum/20" },
};
