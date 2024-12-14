import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const token = (await cookies()).get("adminToken");

  const protectedPaths = [
    "/dashboard",
    "/dashboard/coupons",
    "/dashboard/orders",
  ];

  if (token && req.url === new URL("/", req.url).href) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (protectedPaths.some((path) => req.url.includes(path)) && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/coupons", "/dashboard/orders", "/"],
};
