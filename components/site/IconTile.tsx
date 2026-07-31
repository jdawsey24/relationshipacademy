import type { CSSProperties, ReactNode } from "react";

// Design primitives shared across the site so surfaces don't hand-roll the same
// treatment. One source of truth for the tinted icon tile and the card hover.

const BOX = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-11 w-11 rounded-xl",
  lg: "h-16 w-16 rounded-2xl",
} as const;

/** A tinted rounded square that holds a per-item mark. The tile carries the hue
 *  as both a ~12% background and the text color, so a `currentColor` glyph child
 *  inherits it — the caller just sizes the glyph. */
export function IconTile({
  hue,
  size = "md",
  className,
  style,
  children,
}: {
  hue: string;
  size?: keyof typeof BOX;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${BOX[size]} ${className ?? ""}`}
      style={{ backgroundColor: `${hue}1f`, color: hue, ...style }}
    >
      {children}
    </span>
  );
}

/** Shared card interaction — a subtle lift, a hue border, and a soft hue shadow.
 *  The element must set `--hue` inline (e.g. style={{ "--hue": hue }}). */
export const CARD_HOVER =
  "transition-all hover:-translate-y-0.5 hover:border-[var(--hue)] hover:shadow-[0_10px_30px_-16px_var(--hue)]";
