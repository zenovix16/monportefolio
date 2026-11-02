import { Client, Databases, Account, Storage, ID, Query } from "appwrite";

export const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export { ID, Query };

export const COLLECTIONS = {
  PROJECTS: "projects",
  SKILLS: "skills",
  EXPERIENCE: "experience",
  MESSAGES: "messages",
  ARTICLES: "articles",
  SETTINGS: "settings",
  ABOUT_BLOCKS: "aboutBlocks",
  EDUCATION: "education",
};

// Quand la base est en pause, les fichiers sont servis depuis la sauvegarde
// locale (public/data/files, produite par tools/snapshot.mjs).
let localFiles = null;
export function useLocalFiles(map) {
  localFiles = map || {};
}

// Le plan Appwrite actuel bloque /preview (403) : on sert l'original, recadré
// en CSS par object-fit.
export function getFilePreviewUrl(fileId) {
  return getFileViewUrl(fileId);
}

export function getFileViewUrl(fileId) {
  if (localFiles) return localFiles[fileId] || "";
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}
