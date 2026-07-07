import { randomUUID } from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getCourseWithContent, getProgress } from "@/lib/academyData";
import { courseLessons, type Certificate } from "@/lib/academy";
import type { Member } from "@/lib/academyAuth";

// Server-only. Certificate issuance + reads. Resilient: if migration 0011 hasn't
// run, every function degrades to a no-op / empty result instead of throwing.

function makeSerial(): string {
  const year = new Date().getFullYear();
  return `RLC-${year}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

/**
 * If the member has completed every published lesson in the course, issue a
 * certificate (idempotent — one per user+course). Returns the certificate row
 * (existing or newly created), or null if the course isn't complete / on error.
 */
export async function issueCertificateIfComplete(
  member: Member,
  courseId: string
): Promise<{ certificate: Certificate; newlyIssued: boolean } | null> {
  try {
    const s = getSupabaseAdminClient();

    // Already issued? Return it.
    const { data: existing } = await s
      .from("certificates")
      .select("*")
      .eq("user_id", member.user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    if (existing) return { certificate: existing as Certificate, newlyIssued: false };

    // Is the course actually 100% complete?
    const { data: course } = await s
      .from("courses")
      .select("slug, title")
      .eq("id", courseId)
      .maybeSingle();
    if (!course) return null;
    const full = await getCourseWithContent(course.slug);
    if (!full) return null;
    const lessons = courseLessons(full);
    if (lessons.length === 0) return null;

    const progress = await getProgress(member.user.id, courseId);
    const done = new Set(
      progress.filter((p) => p.status === "completed").map((p) => p.lesson_id)
    );
    const allComplete = lessons.every((l) => done.has(l.id));
    if (!allComplete) return null;

    // Issue it.
    const row = {
      user_id: member.user.id,
      course_id: courseId,
      serial: makeSerial(),
      recipient_name: member.profile.full_name ?? null,
      course_title: course.title,
    };
    const { data: created, error } = await s
      .from("certificates")
      .insert(row)
      .select("*")
      .maybeSingle();
    if (error) {
      // Unique-violation race: someone/something issued it in parallel — fetch it.
      const { data: raced } = await s
        .from("certificates")
        .select("*")
        .eq("user_id", member.user.id)
        .eq("course_id", courseId)
        .maybeSingle();
      return raced ? { certificate: raced as Certificate, newlyIssued: false } : null;
    }
    return { certificate: created as Certificate, newlyIssued: true };
  } catch {
    return null;
  }
}

export async function getCertificates(userId: string): Promise<Certificate[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false });
    if (error) return [];
    return (data as Certificate[]) ?? [];
  } catch {
    return [];
  }
}

/** A single certificate the given user owns, or null. */
export async function getCertificate(id: string, userId: string): Promise<Certificate | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("certificates")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    return (data as Certificate) ?? null;
  } catch {
    return null;
  }
}

/** Certificate for a specific course the user owns, or null (for course-page badges). */
export async function getCertificateForCourse(
  userId: string,
  courseId: string
): Promise<Certificate | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();
    return (data as Certificate) ?? null;
  } catch {
    return null;
  }
}
