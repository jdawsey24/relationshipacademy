// Icon + one-line descriptor for each relationship status. Shared by onboarding
// and settings so the status picker looks the same in both places.

export interface StatusMeta { desc: string; icon: string[] }

export const STATUS_META: Record<string, StatusMeta> = {
  single: { desc: "On my own right now", icon: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M5 20c0-3.5 3-6 7-6s7 2.5 7 6"] },
  dating: { desc: "Getting to know someone", icon: ["M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M15.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M3.5 20c0-2.8 2.2-5 5-5", "M20.5 20c0-2.8-2.2-5-5-5"] },
  committed: { desc: "In a committed relationship", icon: ["M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z"] },
  engaged: { desc: "Planning toward marriage", icon: ["M12 9a5 5 0 1 0 0 10 5 5 0 0 0 0-10z", "M9 9l3-5 3 5"] },
  married: { desc: "Married", icon: ["M9 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M15 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"] },
};
