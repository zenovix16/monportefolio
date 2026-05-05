import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

export async function POST(req: NextRequest) {
  const secret = req.cookies.get("appwrite_session")?.value;

  if (secret) {
    await fetch(`${ENDPOINT}/account/sessions/current`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": PROJECT_ID,
        "X-Appwrite-Session": secret,
      },
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("appwrite_session");
  return response;
}
