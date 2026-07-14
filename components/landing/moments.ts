// The Relationship Moments™ visual library — mapped to the owner's images in
// /public. Until a file exists the tile shows its soft brand tint (never a broken
// image). Spaces in filenames are URL-encoded.
export interface Moment {
  key: string;
  src: string;
  alt: string;
  tint: string; // fallback background before the asset loads
}

export const MOMENTS: Record<string, Moment> = {
  coffee: { key: "coffee", src: "/coffee.jpg", alt: "Two people talking over coffee", tint: "bg-soft-coral/30" },
  walking: { key: "walking", src: "/walking.jpg", alt: "A couple walking together", tint: "bg-sage-green/30" },
  conversation: { key: "conversation", src: "/talking.png", alt: "A couple in a respectful conversation", tint: "bg-dusty-plum/25" },
  planning: { key: "planning", src: "/working%20together.jpg", alt: "A couple planning together", tint: "bg-midnight-navy/15" },
  journal: { key: "journal", src: "/journaling.jpg", alt: "Someone reflecting in a journal", tint: "bg-coral-rose/20" },
  // Additional moments for breadth (ages / stages) in the "who it's for" section.
  proposal: { key: "proposal", src: "/proposal.jpg", alt: "A couple getting engaged", tint: "bg-soft-coral/25" },
  olderCouple: { key: "olderCouple", src: "/older%20couple.jpg", alt: "An older couple together", tint: "bg-sage-green/25" },
  cooking: { key: "cooking", src: "/cooking%20together.jpg", alt: "A couple cooking together", tint: "bg-dusty-plum/20" },
  // Founder portrait — add a headshot as /public/janelle-portrait.jpg to fill this.
  portrait: { key: "portrait", src: "/janelle-portrait.jpg", alt: "Janelle Dawsey, LMFT", tint: "bg-dusty-plum/20" },
};
