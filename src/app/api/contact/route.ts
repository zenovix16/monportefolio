import { NextRequest, NextResponse } from "next/server";
import { databases } from "@/lib/appwrite-server";
import { ID } from "node-appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  await databases.createDocument(DB_ID, "messages", ID.unique(), {
    name,
    email,
    message,
  });

  return NextResponse.json({ success: true });
}
