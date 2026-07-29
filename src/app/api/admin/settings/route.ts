import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";

export async function GET(req: NextRequest) {
  if (!await verifySession(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const doc = await databases.getDocument(DB_ID, COLLECTIONS.SETTINGS, "main");
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(req: NextRequest) {
  if (!await verifySession(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const doc = await databases.updateDocument(DB_ID, COLLECTIONS.SETTINGS, "main", body);
  return NextResponse.json(doc);
}
