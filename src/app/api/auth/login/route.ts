import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Vérification des credentials via Appwrite
  const res = await fetch(`${ENDPOINT}/account/sessions/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": PROJECT_ID,
      "X-Appwrite-Response-Format": "1.0.0",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Appwrite login error:", err);
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  // Credentials valides — on pose un cookie signé localement
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
