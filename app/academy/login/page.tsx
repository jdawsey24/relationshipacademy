import { redirect } from "next/navigation";

// The Academy login has moved to the neutral shared account doorway. Middleware
// already forwards /academy/login → /account/login; this page is the fallback and
// preserves a same-origin ?next=.
export default async function AcademyLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const n = typeof next === "string" && /^\/(?!\/)/.test(next) ? next : null;
  redirect(n ? `/account/login?next=${encodeURIComponent(n)}` : "/account/login");
}
