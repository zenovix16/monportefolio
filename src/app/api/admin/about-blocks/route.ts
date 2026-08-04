import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";
import { ID, Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  if (!await verifySession(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const docs = await databases.listDocuments(DB_ID, COLLECTIONS.ABOUT_BLOCKS, [Query.orderAsc("order")]);
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  if (!await verifySession(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const doc = await databases.createDocument(DB_ID, COLLECTIONS.ABOUT_BLOCKS, ID.unique(), body);
  return NextResponse.json(doc);
}
