import { NextRequest } from "next/server";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

export async function verifySession(req: NextRequest) {
  const secret = req.cookies.get("appwrite_session")?.value;
  if (!secret) return null;

  const res = await fetch(`${ENDPOINT}/account`, {
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": PROJECT_ID,
      "X-Appwrite-Session": secret,
    },
  });

  if (!res.ok) return null;
  return res.json();
}
