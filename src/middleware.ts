import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/register", "/urgences"];
  const isPublic = publicPaths.includes(pathname);

  if (isPublic) {
    if (token) {
      const payload = await verifyTokenEdge(token);
      if (payload) {
        if (pathname === "/login" || pathname === "/register" || pathname === "/") {
          const redirectMap: Record<string, string> = {
            SUPER_ADMIN: "/superadmin",
            ADMIN: "/admin",
            PERSONNEL: "/personnel",
            HOSPITAL: "/hopital",
            DONOR: "/donneur",
          };
          return NextResponse.redirect(new URL(redirectMap[payload.role] || "/donneur", request.url));
        }
      } else {
        const response = NextResponse.next();
        response.cookies.delete("auth-token");
        return response;
      }
    }
    return NextResponse.next();
  }

  const protectedPrefixes = ["/superadmin", "/admin", "/personnel", "/donneur", "/hopital"];
  const isProtected = protectedPrefixes.some(p => pathname.startsWith(p));

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("auth-token", "", { path: "/", maxAge: 0 });
      return response;
    }

    const roleAccess: Record<string, string[]> = {
      "/superadmin": ["SUPER_ADMIN"],
      "/admin": ["SUPER_ADMIN", "ADMIN"],
      "/personnel": ["SUPER_ADMIN", "ADMIN", "PERSONNEL"],
      "/hopital": ["SUPER_ADMIN", "HOSPITAL"],
      "/donneur": ["SUPER_ADMIN", "ADMIN", "PERSONNEL", "DONOR"],
    };

    const prefix = protectedPrefixes.find(p => pathname.startsWith(p));
    if (prefix && !roleAccess[prefix]?.includes(payload.role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
