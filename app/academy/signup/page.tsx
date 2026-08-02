import { redirect } from "next/navigation";

// The Academy signup has moved to the neutral shared account doorway. Middleware
// already forwards /academy/signup → /account/signup; this page is the fallback and
// preserves a same-origin ?next=.
export default async function AcademySignupRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const n = typeof next === "string" && /^\/(?!\/)/.test(next) ? next : null;
  redirect(n ? `/account/signup?next=${encodeURIComponent(n)}` : "/account/signup");
}
