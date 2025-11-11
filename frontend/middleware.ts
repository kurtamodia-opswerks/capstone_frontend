import { auth } from "@/auth";
import { NextResponse } from "next/server";

const protectedRoutes = ["/", "/charts", "dashboard", "build"];
const authPageRoutes = ["/login"];
const apiAuthPrefix = "/api/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const path = nextUrl.pathname;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthPageRoute = authPageRoutes.includes(path);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!apip|_next/static|_next/image|favicon.ico).*)"],
};
