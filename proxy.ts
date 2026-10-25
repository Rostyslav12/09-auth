import { NextRequest, NextResponse } from "next/server";
import { parseSetCookie } from "cookie";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function copyCookies(
  response: NextResponse,
  setCookieHeaders: string[] | undefined
) {
  if (!setCookieHeaders) {
    return;
  }

  for (const cookieString of setCookieHeaders) {
    const parsed = parseSetCookie(cookieString);

    if (!parsed.value) {
      continue;
    }

    response.cookies.set({
      name: parsed.name,
      value: parsed.value,
      path: parsed.path ?? "/",
      ...(parsed.domain && { domain: parsed.domain }),
      ...(parsed.expires && { expires: parsed.expires }),
      ...(parsed.maxAge !== undefined && {
        maxAge: parsed.maxAge,
      }),
      ...(parsed.httpOnly !== undefined && {
        httpOnly: parsed.httpOnly,
      }),
      ...(parsed.secure !== undefined && {
        secure: parsed.secure,
      }),
      ...(parsed.sameSite && {
        sameSite: parsed.sameSite,
      }),
    });
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = matchesRoute(pathname, privateRoutes);
  const isPublicRoute = matchesRoute(pathname, publicRoutes);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let isAuthenticated = Boolean(accessToken);
  let refreshedCookies: string[] | undefined;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      isAuthenticated = sessionResponse.data.success;

      const setCookie = sessionResponse.headers["set-cookie"];

      refreshedCookies = setCookie
        ? Array.isArray(setCookie)
          ? setCookie
          : [setCookie]
        : undefined;
    } catch (error) {
      console.error("Session refresh failed:", error);
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/sign-in", request.url));

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  }

  if (isPublicRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL("/", request.url));

    copyCookies(response, refreshedCookies);

    return response;
  }

  const response = NextResponse.next();

  copyCookies(response, refreshedCookies);

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
