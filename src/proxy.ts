import { NextResponse, type NextRequest } from "next/server";

// Hızlı ön kontrol: çerez yoksa giriş sayfasına yönlendir.
// Asıl doğrulama sayfada ve server action'larda requireAdmin() ile yapılır.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.has("admin_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
