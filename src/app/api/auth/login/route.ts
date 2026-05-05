import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const res = await fetch(`${ENDPOINT}/account/sessions/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": PROJECT_ID,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const session = await res.json();

  const response = NextResponse.json({ success: true });
  response.cookies.set("appwrite_session", session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: "/",
  });

  return response;
}
