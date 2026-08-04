"use client";

import { useEffect, useState } from "react";
import { getFileViewUrl } from "@/lib/storage";

interface Settings {
  profileFileId?: string;
  cvFileId?: string;
  heroName?: string;
  heroLocation?: string;
  heroTagline?: string;
  heroDescription?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
}

const FIELD = "glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none w-full";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () =>
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setSettings(d ?? {}));

  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-secret": "portfolio2025secret" }, body: fd });
    const data = await res.json();
    return data.fileId as string;
  };

  const uploadPhoto = async (file: File) => {
    setUploadingPhoto(true);
    const fileId = await upload(file);
    setSettings((s) => ({ ...s, profileFileId: fileId }));
    setUploadingPhoto(false);
  };

  const uploadCv = async (file: File) => {
    setUploadingCv(true);
    const fileId = await upload(file);
    setSettings((s) => ({ ...s, cvFileId: fileId }));
    setUploadingCv(false);
  };

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const set = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((s) => ({ ...s, [key]: e.target.value }));

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-black/45 mb-2">Site public</p>
        <h1 className="text-3xl font-bold text-[#14161A]">Réglages</h1>
      </div>

      <div className="space-y-4 max-w-xl">
        {/* Profil (Hero) */}
        <div className="glass rounded-2xl p-6">
          <p className="text-sm font-medium text-[#14161A] mb-1">Profil (Hero)</p>
          <p className="text-xs text-black/50 mb-4">
            Nom, accroche et description affichés sur l&apos;accueil.
          </p>
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <input value={settings.heroName ?? ""} onChange={set("heroName")} placeholder="Nom complet" className={FIELD} />
              <input value={settings.heroLocation ?? ""} onChange={set("heroLocation")} placeholder="Localisation" className={FIELD} />
            </div>
            <input value={settings.heroTagline ?? ""} onChange={set("heroTagline")} placeholder="Accroche (ex: Consultant Data...)" className={FIELD} />
            <input value={settings.heroDescription ?? ""} onChange={set("heroDescription")} placeholder="Description courte" className={FIELD} />
          </div>
        </div>

        {/* Contact */}
        <div className="glass rounded-2xl p-6">
          <p className="text-sm font-medium text-[#14161A] mb-1">Contact</p>
          <p className="text-xs text-black/50 mb-4">
            Coordonnées affichées dans la section Contact et le lien LinkedIn du Hero.
          </p>
          <div className="space-y-2.5">
            <input value={settings.email ?? ""} onChange={set("email")} placeholder="Email" className={FIELD} />
            <div className="grid grid-cols-2 gap-2.5">
              <input value={settings.phone ?? ""} onChange={set("phone")} placeholder="Téléphone" className={FIELD} />
              <input value={settings.linkedinUrl ?? ""} onChange={set("linkedinUrl")} placeholder="URL LinkedIn" className={FIELD} />
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="glass rounded-2xl p-6">
          <p className="text-sm font-medium text-[#14161A] mb-1">Portrait (Hero)</p>
          <p className="text-xs text-black/50 mb-4">
            Image affichée en arrière-plan de l&apos;accueil, à côté du nom. Idéalement une photo détourée (fond transparent).
          </p>
          {settings.profileFileId && (
            <img
              src={getFileViewUrl(settings.profileFileId)}
              alt="Portrait actuel"
              className="h-32 w-auto rounded-lg border border-black/10 mb-4 object-contain bg-black/[0.04]"
            />
          )}
          <label className="cursor-pointer inline-flex items-center gap-3">
            <span className="text-xs text-black/60 border border-black/[0.1] rounded-lg px-3 py-2 hover:border-[var(--accent)]/50 transition-colors">
              {uploadingPhoto ? "Upload en cours..." : "Changer la photo"}
            </span>
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
              disabled={uploadingPhoto} />
          </label>
        </div>

        {/* CV */}
        <div className="glass rounded-2xl p-6">
          <p className="text-sm font-medium text-[#14161A] mb-1">CV (PDF)</p>
          <p className="text-xs text-black/50 mb-4">
            Fichier proposé au téléchargement depuis l&apos;accueil et la section Contact.
          </p>
          {settings.cvFileId ? (
            <a href={getFileViewUrl(settings.cvFileId)} target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-lg px-3 py-2 mb-4">
              Voir le CV actuel ↗
            </a>
          ) : (
            <p className="text-xs text-black/40 mb-4">Aucun CV en ligne pour le moment.</p>
          )}
          <div>
            <label className="cursor-pointer inline-flex items-center gap-3">
              <span className="text-xs text-black/60 border border-black/[0.1] rounded-lg px-3 py-2 hover:border-[var(--accent)]/50 transition-colors">
                {uploadingCv ? "Upload en cours..." : "Changer le CV"}
              </span>
              <input type="file" accept="application/pdf" className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadCv(e.target.files[0])}
                disabled={uploadingCv} />
            </label>
          </div>
        </div>

        <button onClick={save} disabled={saving}
          className="glow w-full py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50">
          {saving ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
