import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = matchesRoute(pathname, privateRoutes);
  const isPublicRoute = matchesRoute(pathname, publicRoutes);

  // Назви cookie потрібно звірити з готовими app/api маршрутами.
  const hasSessionCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.toLowerCase().includes("session") ||
        cookie.name.toLowerCase().includes("token")
    );

  if (isPrivateRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isPublicRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
