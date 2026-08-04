import { NextRequest, NextResponse } from "next/server";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const ADMIN_SECRET = process.env.ADMIN_SECRET!;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Vérification des credentials via Appwrite
  const res = await fetch(`${ENDPOINT}/account/sessions/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Project": PROJECT_ID,
      "X-Appwrite-Response-Format": "1.0.0",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Appwrite login error:", err);
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  // Appwrite ne renvoie pas le secret de session dans le corps JSON (vide par
  // sécurité) — il est livré via Set-Cookie (blob base64 opaque), scopé au
  // domaine d'Appwrite (inutilisable tel quel chez nous). On récupère cette
  // valeur telle quelle (X-Appwrite-Session attend le blob brut, pas son
  // contenu décodé) pour la reposer sur notre propre domaine — c'est ce que
  // verifySession() relit ensuite via le cookie "appwrite_session".
  const rawCookies = typeof res.headers.getSetCookie === "function"
    ? res.headers.getSetCookie()
    : (res.headers.get("set-cookie") ?? "").split(/,(?=[^;]+?=)/);

  let sessionSecret: string | null = null;
  for (const cookie of rawCookies) {
    const match = cookie.match(/^a_session_[a-z0-9]+=([^;]+)/i);
    if (match) { sessionSecret = match[1]; break; }
  }

  if (!sessionSecret) {
    console.error("Impossible d'extraire le secret de session Appwrite depuis Set-Cookie:", rawCookies);
    return NextResponse.json({ error: "Erreur de connexion" }, { status: 500 });
  }

  // Credentials valides — on pose nos propres cookies
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_token", ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  response.cookies.set("appwrite_session", sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
