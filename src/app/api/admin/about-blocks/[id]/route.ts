import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifySession(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const doc = await databases.updateDocument(DB_ID, COLLECTIONS.ABOUT_BLOCKS, id, body);
  return NextResponse.json(doc);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifySession(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await databases.deleteDocument(DB_ID, COLLECTIONS.ABOUT_BLOCKS, id);
  return NextResponse.json({ success: true });
}
