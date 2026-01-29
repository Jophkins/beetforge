import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/"];
const APP_PREFIX = "/app";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get("session")?.value;

  const isAppRoute = pathname === APP_PREFIX || pathname.startsWith(`${APP_PREFIX}/`);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // unauthenticated, redirect to login
  if (isAppRoute && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // authenticated, redirect to app
  if (session && (pathname === "/login" || pathname === "/register" || pathname === "/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // otherwise, redirect to home
  if (!isAppRoute && !isPublicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/register", "/"],
};
