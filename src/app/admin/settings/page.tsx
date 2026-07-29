"use client";

import { useEffect, useState } from "react";
import { getFileViewUrl } from "@/lib/storage";

interface Settings {
  profileFileId?: string;
  cvFileId?: string;
}

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

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">Site public</p>
        <h1 className="text-3xl font-bold text-[#F4F5F7]">Réglages</h1>
      </div>

      <div className="space-y-4 max-w-xl">
        {/* Photo */}
        <div className="glass rounded-2xl p-6">
          <p className="text-sm font-medium text-[#F4F5F7] mb-1">Portrait (Hero)</p>
          <p className="text-xs text-white/45 mb-4">
            Image affichée en arrière-plan de l&apos;accueil, à côté du nom. Idéalement une photo détourée (fond transparent).
          </p>
          {settings.profileFileId && (
            <img
              src={getFileViewUrl(settings.profileFileId)}
              alt="Portrait actuel"
              className="h-32 w-auto rounded-lg border border-white/10 mb-4 object-contain bg-black/20"
            />
          )}
          <label className="cursor-pointer inline-flex items-center gap-3">
            <span className="text-xs text-white/55 border border-white/[0.1] rounded-lg px-3 py-2 hover:border-[var(--accent)]/50 transition-colors">
              {uploadingPhoto ? "Upload en cours..." : "Changer la photo"}
            </span>
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
              disabled={uploadingPhoto} />
          </label>
        </div>

        {/* CV */}
        <div className="glass rounded-2xl p-6">
          <p className="text-sm font-medium text-[#F4F5F7] mb-1">CV (PDF)</p>
          <p className="text-xs text-white/45 mb-4">
            Fichier proposé au téléchargement depuis l&apos;accueil et la section Contact.
          </p>
          {settings.cvFileId ? (
            <a href={getFileViewUrl(settings.cvFileId)} target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs text-[var(--accent-light)] border border-[var(--accent)]/40 rounded-lg px-3 py-2 mb-4">
              Voir le CV actuel ↗
            </a>
          ) : (
            <p className="text-xs text-white/35 mb-4">Aucun CV en ligne pour le moment.</p>
          )}
          <div>
            <label className="cursor-pointer inline-flex items-center gap-3">
              <span className="text-xs text-white/55 border border-white/[0.1] rounded-lg px-3 py-2 hover:border-[var(--accent)]/50 transition-colors">
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
