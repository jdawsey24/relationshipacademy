import { redirect } from "next/navigation";

// Legacy per-domain step — the flagship is now a single-page flow at /snapshot/intro.
export default function QuestionsRedirect() {
  redirect("/snapshot/intro");
}
