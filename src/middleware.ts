import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

// Giriş gerektiren rotalar
const AUTH_ROUTES = ["/feed", "/create", "/app"];
// Sadece staff erişebilir
const STAFF_ROUTES = ["/dashboard", "/admin"];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const { pathname } = request.nextUrl;

  // Oturumu yenile
  const { data: { user } } = await supabase.auth.getUser();

  const needsAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const needsStaff = STAFF_ROUTES.some((r) => pathname.startsWith(r));

  // Giriş yapılmamış → /login
  if ((needsAuth || needsStaff) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    if (needsStaff) loginUrl.searchParams.set("type", "staff");
    return NextResponse.redirect(loginUrl);
  }

  // Giriş yapılmış ama staff değil → /unauthorized
  if (needsStaff && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "staff") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
