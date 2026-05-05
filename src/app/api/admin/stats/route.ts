import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";

export async function GET(req: NextRequest) {
  if (!await verifySession(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [messages, projects, articles, experience] = await Promise.all([
    databases.listDocuments(DB_ID, COLLECTIONS.MESSAGES, [Query.limit(1)]),
    databases.listDocuments(DB_ID, COLLECTIONS.PROJECTS, [Query.limit(1)]),
    databases.listDocuments(DB_ID, "articles", [Query.limit(1)]),
    databases.listDocuments(DB_ID, COLLECTIONS.EXPERIENCE, [Query.limit(1)]),
  ]);

  return NextResponse.json({
    messages: messages.total,
    projects: projects.total,
    articles: articles.total,
    experience: experience.total,
  });
}
