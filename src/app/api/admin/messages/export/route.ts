import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { databases, DB_ID, COLLECTIONS } from "@/lib/appwrite-server";
import { Query } from "node-appwrite";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  if (!await verifySession(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const docs = await databases.listDocuments(DB_ID, COLLECTIONS.MESSAGES, [
    Query.orderDesc("$createdAt"),
    Query.limit(500),
  ]);

  const rows = docs.documents.map((d) => ({
    Nom: d.name,
    Email: d.email,
    Message: d.message,
    Date: new Date(d.$createdAt).toLocaleString("fr-FR"),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "Messages");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="messages-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
