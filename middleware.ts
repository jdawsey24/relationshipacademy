import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Gates every /admin and /api/admin route on a valid Supabase Auth session.
// Runs on all matched routes (see config.matcher). Also refreshes the session
// cookie on each request so sessions stay alive.
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
