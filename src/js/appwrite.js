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

export function getFilePreviewUrl(fileId, width = 800, height = 600) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/preview?project=${PROJECT_ID}&width=${width}&height=${height}&gravity=center&quality=80`;
}

export function getFileViewUrl(fileId) {
  return `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
}
// build: force redeploy avec VITE_APPWRITE_* 1785885944
