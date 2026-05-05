import { NextRequest, NextResponse } from "next/server";
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const fileId = (formData.get("fileId") as string) || ID.unique();

  if (!file) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  const storage = new Storage(client);
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await storage.createFile(
    process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
    fileId,
    InputFile.fromBuffer(buffer, file.name)
  );

  const previewUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${result.$id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=800`;

  return NextResponse.json({ fileId: result.$id, previewUrl });
}
