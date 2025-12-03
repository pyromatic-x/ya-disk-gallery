import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const store = await cookies();
  const uid = await store.get("uid")?.value;

  const headers = new Headers(request.headers);
  const pathname = request.nextUrl.pathname;

  const isServerAction = request.headers.has("next-action") || request.headers.has("x-action");
  if (isServerAction) return NextResponse.next();

  if (!uid && !pathname.includes("login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/", "/folder/:id*", "/folder/create"],
};
