// Sauvegarde du contenu public Appwrite dans public/data/ :
//   - snapshot.json : toutes les collections lues par le site + settings
//   - files/<id>.<ext> : images / CV référencés
// Le site s'en sert automatiquement quand Appwrite ne répond pas (projet en
// pause pour inactivité sur le plan gratuit). Lancé par la GitHub Action
// .github/workflows/appwrite-watch.yml — aucune clé API nécessaire, ce sont
// les mêmes lectures publiques que le navigateur.
//
// Sortie : code 2 si le projet est en pause, 1 pour toute autre erreur.
import { mkdir, writeFile, readdir, rm } from "node:fs/promises";

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const PROJECT = process.env.APPWRITE_PROJECT_ID || "69fa52a7000b29463580";
const DB = process.env.APPWRITE_DATABASE_ID || "69fa53ff003d590321f1";
const BUCKET = process.env.APPWRITE_BUCKET_ID || "media";
const OUT = new URL("../public/data/", import.meta.url);

const COLLECTIONS = ["projects", "skills", "experience", "articles", "aboutBlocks", "education"];
const headers = { "X-Appwrite-Project": PROJECT };

class Paused extends Error {}

async function get(path) {
  const res = await fetch(`${ENDPOINT}${path}`, { headers });
  if (res.ok) return res;
  const body = await res.json().catch(() => ({}));
  if (body.type === "project_paused") throw new Paused(body.message);
  const err = new Error(`${res.status} ${path} — ${body.message || res.statusText}`);
  err.status = res.status;
  throw err;
}

async function listAll(collection) {
  const q = encodeURIComponent(JSON.stringify({ method: "limit", values: [100] }));
  const res = await get(`/databases/${DB}/collections/${collection}/documents?queries[]=${q}`);
  const { documents } = await res.json();
  return documents.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "application/pdf": "pdf" };

async function main() {
  const data = {};
  for (const c of COLLECTIONS) {
    try {
      data[c] = await listAll(c);
    } catch (e) {
      if (e instanceof Paused) throw e;
      console.warn(`! ${c}: ${e.message}`);
      data[c] = [];
    }
  }
  try {
    data.settings = await (await get(`/databases/${DB}/collections/settings/documents/main`)).json();
  } catch (e) {
    if (e instanceof Paused) throw e;
    data.settings = {};
  }

  // Fichiers référencés (photos, images de projets, CV)
  const ids = new Set([
    data.settings.profileFileId, data.settings.aboutImageFileId, data.settings.cvFileId,
    ...data.projects.map((p) => p.imageId),
  ].filter(Boolean));

  const filesDir = new URL("files/", OUT);
  await rm(filesDir, { recursive: true, force: true });
  await mkdir(filesDir, { recursive: true });
  data.files = {};
  if (BUCKET) {
    for (const id of ids) {
      try {
        const res = await get(`/storage/buckets/${BUCKET}/files/${id}/view?project=${PROJECT}`);
        const ext = EXT[(res.headers.get("content-type") || "").split(";")[0]] || "bin";
        await writeFile(new URL(`${id}.${ext}`, filesDir), Buffer.from(await res.arrayBuffer()));
        data.files[id] = `/data/files/${id}.${ext}`;
      } catch (e) {
        if (e instanceof Paused) throw e;
        console.warn(`! fichier ${id}: ${e.message}`);
      }
    }
  } else {
    console.warn("! APPWRITE_BUCKET_ID absent : fichiers non sauvegardés");
  }

  // Pas d'horodatage dans le JSON : le fichier ne change (et ne déclenche un
  // commit) que si le contenu change réellement.
  await writeFile(new URL("snapshot.json", OUT), JSON.stringify(data, null, 2) + "\n");
  const n = COLLECTIONS.map((c) => `${c}=${data[c].length}`).join(" ");
  console.log(`✓ snapshot : ${n}, fichiers=${Object.keys(data.files).length}`);
  console.log((await readdir(filesDir)).join("\n"));
}

main().catch((e) => {
  if (e instanceof Paused) {
    console.error(`✗ Projet Appwrite EN PAUSE : ${e.message}`);
    process.exit(2);
  }
  console.error(`✗ ${e.message}`);
  process.exit(1);
});
