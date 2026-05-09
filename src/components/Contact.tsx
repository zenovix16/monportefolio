"use client";

import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="px-5 md:px-10 py-10 md:py-14 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">06</span>
        <div className="flex-1 rule" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Contact</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div>
          <h2 className="font-bold text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            Travaillons ensemble.
          </h2>
          <p className="text-white/35 text-sm leading-relaxed mb-6">
            Un projet, une opportunité, une question ? Je lis tous les messages.
          </p>

          <div className="space-y-2.5">
            <a href="mailto:soumaila.niampa@centrale-casablanca.ma"
              className="glass rounded-xl p-4 flex items-center justify-between group hover:border-white/14 transition-all">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-white/20 mb-0.5">Email</p>
                <p className="text-white/45 text-xs group-hover:text-white/65 transition-colors break-all">
                  soumaila.niampa@centrale-casablanca.ma
                </p>
              </div>
              <span className="text-white/18 group-hover:text-white/45 transition-colors ml-3">↗</span>
            </a>
            <a href="tel:+212708778658"
              className="glass rounded-xl p-4 flex items-center justify-between group hover:border-white/14 transition-all">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-white/20 mb-0.5">Téléphone</p>
                <p className="text-white/45 text-xs group-hover:text-white/65 transition-colors">+212 708-778-658</p>
              </div>
              <span className="text-white/18 group-hover:text-white/45 transition-colors ml-3">↗</span>
            </a>
            <a href="https://linkedin.com/in/souma%C3%AFla-niampa" target="_blank" rel="noopener noreferrer"
              className="glass rounded-xl p-4 flex items-center justify-between group hover:border-white/14 transition-all">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-white/20 mb-0.5">LinkedIn</p>
                <p className="text-white/45 text-xs group-hover:text-white/65 transition-colors">linkedin.com/in/soumaïla-niampa</p>
              </div>
              <span className="text-white/18 group-hover:text-white/45 transition-colors ml-3">↗</span>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <input type="text" placeholder="Nom" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18 outline-none focus:border-white/16 transition-colors w-full" />
            <input type="email" placeholder="Email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18 outline-none focus:border-white/16 transition-colors w-full" />
          </div>
          <textarea placeholder="Message" required rows={5} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="glass rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18 outline-none focus:border-white/16 transition-colors w-full resize-none" />
          <button type="submit" disabled={status === "loading" || status === "success"}
            className="w-full py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50">
            {status === "loading" ? "Envoi..." : status === "success" ? "Message envoyé ✓" : "Envoyer"}
          </button>
          {status === "error" && <p className="text-center text-xs text-red-400/60">Une erreur s&apos;est produite.</p>}
        </form>
      </div>

      <div className="mt-12 pt-5 rule flex items-center justify-between">
        <p className="text-white/15 text-xs">© 2025 Soumaïla Niampa</p>
      </div>
    </section>
  );
}
