// Repli quand Appwrite ne répond pas (projet en pause sur le plan gratuit) :
// on charge la dernière sauvegarde publiée avec le site (public/data/), mise
// à jour chaque jour par la GitHub Action appwrite-watch.
import { useLocalFiles } from "./appwrite.js";

let cached;

export async function loadSnapshot() {
  if (cached !== undefined) return cached;
  try {
    const res = await fetch("/data/snapshot.json", { cache: "no-cache" });
    cached = res.ok ? await res.json() : null;
  } catch {
    cached = null;
  }
  if (cached) useLocalFiles(cached.files);
  return cached;
}
