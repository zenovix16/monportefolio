import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  if (!await verifySession(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const docs = await databases.listDocuments(DB_ID, COLLECTIONS.MESSAGES, [
    Query.orderDesc("$createdAt"),
    Query.limit(100),
  ]);

  return NextResponse.json(docs);
}

export async function DELETE(req: NextRequest) {
  if (!await verifySession(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await req.json();
  await databases.deleteDocument(DB_ID, COLLECTIONS.MESSAGES, id);
  return NextResponse.json({ success: true });
}
