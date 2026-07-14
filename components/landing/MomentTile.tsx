import type { Moment } from "./moments";

// A single Relationship Moment™ — a rounded, tinted frame that shows the image
// once it exists in /public/moments, and its soft brand tint until then.
export default function MomentTile({
  moment,
  className = "",
  rounded = "rounded-2xl",
}: {
  moment: Moment;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      role="img"
      aria-label={moment.alt}
      className={`${rounded} ${moment.tint} bg-cover bg-center shadow-md shadow-midnight-navy/10 ring-1 ring-black/5 ${className}`}
      style={{ backgroundImage: `url(${moment.src})` }}
    />
  );
}
