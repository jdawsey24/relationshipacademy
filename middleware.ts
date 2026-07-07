import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Gates two SEPARATE protected areas on a valid Supabase Auth session:
//   • /admin + /api/admin   — STAFF. MFA-enforced, own login at /admin/login.
//   • /academy + /api/academy — MEMBERS (students). No MFA, own login at
//     /academy/login. Membership tier is checked per-page/route, not here.
// It also refreshes the session cookie on each request so sessions stay alive.

// Academy paths that must stay reachable without a session.
const ACADEMY_PUBLIC = new Set([
  "/academy",
  "/academy/login",
  "/academy/signup",
  "/academy/reset-password",
  "/academy/professional", // practitioner landing — viewable logged-out (linked from the public site)
]);
const ACADEMY_AUTH_PAGES = new Set(["/academy/login", "/academy/signup"]);

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

    if (!user) {
      if (isAcademyApi && !isPublicAcademyApi) {
        return NextResponse.json({ error: "Sign in required." }, { status: 401 });
      }
      if (isPublicAcademyApi) return response;
      if (!ACADEMY_PUBLIC.has(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = "/academy/login";
        return NextResponse.redirect(url);
      }
      return response;
    }

    // Signed in but sitting on the login/signup page: send to the dashboard.
    if (ACADEMY_AUTH_PAGES.has(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/academy/dashboard";
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
  ],
};
