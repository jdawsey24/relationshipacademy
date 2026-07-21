// Visual identity for each consumer situation category — a muted, on-brand accent
// + a simple line-icon (array of SVG path `d`). One source of truth for Home,
// Process, and situation cards. Colors are desaturated to harmonize with the
// warm-ivory / midnight-navy / coral palette (not a rainbow).

export interface CategoryMeta {
  accent: string;
  icon: string[];
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "CAT-001": { accent: "#6E8BA8", icon: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M15.5 8.5l-2.5 5-5 2.5 2.5-5 5-2.5z"] },            // Getting Started — compass
  "CAT-002": { accent: "#C08A5E", icon: ["M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M15.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M3 20c0-2.8 2.2-5 5-5s5 2.2 5 5", "M14 15.3c.9-.5 1.9-.8 3-.8 2.8 0 4.5 2.2 4.5 5"] }, // Getting to Know Each Other — two people
  "CAT-003": { accent: "#5E86A0", icon: ["M4 5h16v10H9l-4 4V5z"] },                                                                  // Communication — chat
  "CAT-004": { accent: "#5E8B7E", icon: ["M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z", "M9 12l2 2 4-4"] },                          // Trust — shield check
  "CAT-005": { accent: "#9B84A8", icon: ["M4 8h16", "M4 16h16", "M9 4v16", "M15 4v16"] },                                            // Boundaries — fence
  "CAT-006": { accent: "#C0714A", icon: ["M13 2L4 14h6l-1 8 9-12h-6l1-8z"] },                                                        // Conflict — spark
  "CAT-007": { accent: "#C97F87", icon: ["M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z"] },  // Emotional Connection — heart
  "CAT-008": { accent: "#B0596B", icon: ["M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3 0 1 1 2 2 2 0-3 2-5 2-8z"] },                    // Physical & Sexual Intimacy — flame
  "CAT-009": { accent: "#7E9B6E", icon: ["M3 11l9-8 9 8", "M5 10v10h14V10", "M10 20v-6h4v6"] },                                      // Shared Life — home
  "CAT-010": { accent: "#4F6D8C", icon: ["M12 3v18", "M12 8h6l2 2-2 2h-6", "M12 13H6l-2 2 2 2h6"] },                                 // Big Decisions — signpost
  "CAT-011": { accent: "#C09A52", icon: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M12 2v3", "M12 19v3", "M2 12h3", "M19 12h3", "M5 5l2 2", "M17 17l2 2", "M5 19l2-2", "M17 7l2-2"] }, // Life Changes — sun
  "CAT-012": { accent: "#868C96", icon: ["M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z", "M12 7l-2 4 3 2-1.5 4"] }, // Breakups & Loss — broken heart
  "CAT-013": { accent: "#5F9E7C", icon: ["M12 21v-9", "M12 12c-1-3-4-4-7-4 0 3 3 5 7 5z", "M12 12c1-4 4-5 7-5 0 3-3 5-7 5z"] },      // Growing Forward — sprout
  "CAT-014": { accent: "#C0982F", icon: ["M12 3l2.5 5.4L20 9.2l-4 3.9.9 5.6L12 16.3 7.1 18.7l.9-5.6-4-3.9 5.5-.8L12 3z"] },         // Wins Worth Celebrating — star
};

export const DEFAULT_CATEGORY: CategoryMeta = { accent: "#7C8794", icon: ["M4 5h16v10H9l-4 4V5z"] };

export const categoryMeta = (id: string | null | undefined): CategoryMeta =>
  (id && CATEGORY_META[id]) || DEFAULT_CATEGORY;

/** hex (#rrggbb) + alpha → rgba(), for soft accent tints. */
export const tint = (hex: string, alpha: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};
