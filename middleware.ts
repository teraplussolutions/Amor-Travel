import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_PREFIXES   = ["/admin", "/super-admin"];
const AGENT_PREFIXES   = ["/agent"];
const SKIP_INTL        = ["/login", "/crm-login", "/setup", "/api"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
  const isAgentRoute = AGENT_PREFIXES.some((p) => pathname.startsWith(p));
  const isProtected  = isAdminRoute || isAgentRoute;

  if (isProtected) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Admin routes → /login, Agent routes → /crm-login
      const loginPath = isAgentRoute ? "/crm-login" : "/login";
      const loginUrl  = new URL(loginPath, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Skip intl for login pages and API
  if (SKIP_INTL.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)",],
};
