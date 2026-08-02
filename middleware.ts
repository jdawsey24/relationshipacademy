import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Gates two SEPARATE protected areas on a valid Supabase Auth session:
//   • /admin + /api/admin   — STAFF. MFA-enforced, own login at /admin/login.
//   • /academy + /api/academy — MEMBERS (students). No MFA. Sign-in is the neutral
//     /account doorway; the portal PAGES are gated here on paid Academy membership
//     (a bare/free account is sent to the /academy join page). Content APIs keep
//     their own per-route auth so a free user can still call checkout to join.
// It also refreshes the session cookie on each request so sessions stay alive.

// Academy paths that must stay reachable without a session.
const ACADEMY_PUBLIC = new Set([
  "/academy",
  "/academy/login",
  "/academy/signup",
  "/academy/reset-password",
]);
// Tiers that count as "in the Academy" (paid). A free/bare account is NOT in the
// Academy — it just has a shared account (e.g. from a Playbook purchase).
const ACADEMY_TIERS = new Set(["academy", "academy_plus", "professional"]);

// Companion paths reachable without a session (login + post-purchase access flow).
const COMPANION_PUBLIC = new Set([
  "/companion/login",
  "/companion/signup",
  "/companion/welcome",
  "/companion/verify",
  "/companion/offline", // PWA offline shell — must be reachable without a session
]);
const COMPANION_AUTH_PAGES = new Set(["/companion/login", "/companion/signup"]);

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // -------------------------------------------------------------------------
  // MEMBER branch: /academy + /api/academy (no MFA)
  // -------------------------------------------------------------------------
  if (pathname.startsWith("/academy") || pathname.startsWith("/api/academy")) {
    const isAcademyApi = pathname.startsWith("/api/academy");
    // Public academy APIs reachable without a session (e.g. self-serve signup).
    const isPublicAcademyApi = pathname === "/api/academy/signup";

    // The old Academy auth pages forward to the neutral account doorway (Part A).
    // Preserves the ?next= query (clone keeps search).
    if (pathname === "/academy/login" || pathname === "/academy/signup") {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/academy/signup" ? "/account/signup" : "/account/login";
      return NextResponse.redirect(url);
    }

    if (!user) {
      if (isAcademyApi && !isPublicAcademyApi) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
      }
      if (isPublicAcademyApi) return response;
      // Non-members start at the public Academy (join) page.
      if (!ACADEMY_PUBLIC.has(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = "/academy";
        return NextResponse.redirect(url);
      }
      return response;
    }

    // Signed in. Gate the portal PAGES behind paid Academy membership; staff bypass
    // for previews. Public pages (/academy, reset-password) and APIs stay reachable
    // (checkout must work so a free account can JOIN). Read the member's own row.
    if (!isAcademyApi && !ACADEMY_PUBLIC.has(pathname)) {
      const role = (user.app_metadata as { role?: string } | undefined)?.role;
      const isStaff = role === "owner" || role === "editor" || role === "viewer";
      if (!isStaff) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("membership_tier")
          .eq("id", user.id)
          .maybeSingle();
        const tier = (prof as { membership_tier?: string } | null)?.membership_tier ?? "free";
        if (!ACADEMY_TIERS.has(tier)) {
          const url = request.nextUrl.clone();
          url.pathname = "/academy";
          return NextResponse.redirect(url);
        }
      }
    }
    return response;
  }

  // -------------------------------------------------------------------------
  // COMPANION branch: /companion + /api/companion (no MFA). Entitlement is
  // checked per-page/route (requireEntitledCompanionUser), not here.
  // -------------------------------------------------------------------------
  if (pathname.startsWith("/companion") || pathname.startsWith("/api/companion")) {
    const isCompanionApi = pathname.startsWith("/api/companion");
    // Public companion APIs reachable without a session (self-serve signup).
    const isPublicCompanionApi = pathname === "/api/companion/signup";
    if (!user) {
      if (isCompanionApi && !isPublicCompanionApi) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
      if (isPublicCompanionApi) return response;
      if (!COMPANION_PUBLIC.has(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = "/companion/login";
        return NextResponse.redirect(url);
      }
      return response;
    }
    // Signed in but on the login page: send into the app.
    if (COMPANION_AUTH_PAGES.has(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/companion";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // -------------------------------------------------------------------------
  // INSTITUTE branch: gated professional area + /api/institute (no MFA).
  // Only the gated paths, auth pages, and API are matched (see config) — the
  // public Institute marketing pages are NOT matched and stay open + fast.
  // -------------------------------------------------------------------------
  if (pathname.startsWith("/institute") || pathname.startsWith("/api/institute")) {
    const isInstituteApi = pathname.startsWith("/api/institute");
    const isPublicInstituteApi = pathname === "/api/institute/signup";
    const isAuthPage = pathname === "/institute/login" || pathname === "/institute/signup";

    if (!user) {
      if (isInstituteApi && !isPublicInstituteApi) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
      }
      if (isPublicInstituteApi || isAuthPage) return response;
      // Gated page (dashboard/account/live) — send to the professional login.
      const url = request.nextUrl.clone();
      url.pathname = "/institute/login";
      return NextResponse.redirect(url);
    }

    // Signed in on an auth page → go to the professional dashboard.
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/institute/dashboard";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // -------------------------------------------------------------------------
  // STAFF branch: /admin + /api/admin (unchanged behavior)
  // -------------------------------------------------------------------------
  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");

  // Unauthenticated: block.
  if (!user) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // MFA enforcement: a password-only (AAL1) session for an account that has an
  // enrolled factor still owes its 2FA step. Send it back to the login page to
  // finish. Fails OPEN on any error so it can never cause a lockout.
  let needsMfa = false;
  try {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    needsMfa = !!aal && aal.currentLevel === "aal1" && aal.nextLevel === "aal2";
  } catch {
    needsMfa = false;
  }

  if (needsMfa && !isLoginPage) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Multi-factor authentication required." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Fully authenticated on the login page: send to the dashboard.
  if (isLoginPage && !needsMfa) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/academy/:path*",
    "/api/academy/:path*",
    "/companion/:path*",
    "/api/companion/:path*",
    // Institute: only the gated paths + auth pages + API (marketing stays public).
    "/institute/dashboard/:path*",
    "/institute/account/:path*",
    "/institute/live/:path*",
    "/institute/login",
    "/institute/signup",
    "/api/institute/:path*",
  ],
};
