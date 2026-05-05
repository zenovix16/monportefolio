import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const secret = request.cookies.get("appwrite_session")?.value;
  if (!secret) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const res = await fetch(`${ENDPOINT}/account`, {
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": PROJECT_ID,
      "X-Appwrite-Session": secret,
    },
  });

  if (!res.ok) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("appwrite_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
