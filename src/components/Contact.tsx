"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface Props {
  cvUrl: string | null;
}

export default function Contact({ cvUrl }: Props) {
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
    <section id="contact" className="px-5 md:px-10 py-16 md:py-24 max-w-6xl mx-auto">
      <SectionHeading number="07" label="Contact" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-8 md:gap-16 items-start"
      >
        <div>
          <h2 className="font-bold text-[#14161A] mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            Travaillons ensemble.
          </h2>
          <p className="text-black/55 text-sm leading-relaxed mb-6">
            Un projet, une opportunité, une question ? Je lis tous les messages.
          </p>

          <div className="space-y-2.5">
            <a href="mailto:soumaila.niampa@centrale-casablanca.ma"
              className="glass rounded-xl p-4 flex items-center justify-between group hover:border-[var(--accent)]/40 transition-all">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-black/40 mb-0.5">Email</p>
                <p className="text-black/65 text-xs group-hover:text-[var(--accent-light)] transition-colors break-all">
                  soumaila.niampa@centrale-casablanca.ma
                </p>
              </div>
              <span className="text-black/35 group-hover:text-[var(--accent-light)] transition-colors ml-3">↗</span>
            </a>
            <a href="tel:+212708778658"
              className="glass rounded-xl p-4 flex items-center justify-between group hover:border-[var(--accent)]/40 transition-all">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-black/40 mb-0.5">Téléphone</p>
                <p className="text-black/65 text-xs group-hover:text-[var(--accent-light)] transition-colors">+212 708-778-658</p>
              </div>
              <span className="text-black/35 group-hover:text-[var(--accent-light)] transition-colors ml-3">↗</span>
            </a>
            <a href="https://linkedin.com/in/souma%C3%AFla-niampa" target="_blank" rel="noopener noreferrer"
              className="glass rounded-xl p-4 flex items-center justify-between group hover:border-[var(--accent)]/40 transition-all">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-black/40 mb-0.5">LinkedIn</p>
                <p className="text-black/65 text-xs group-hover:text-[var(--accent-light)] transition-colors">linkedin.com/in/soumaïla-niampa</p>
              </div>
              <span className="text-black/35 group-hover:text-[var(--accent-light)] transition-colors ml-3">↗</span>
            </a>
            {cvUrl && (
              <a href={cvUrl} download
                className="glass rounded-xl p-4 flex items-center justify-between group hover:border-[var(--accent)]/40 transition-all">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-black/40 mb-0.5">CV</p>
                  <p className="text-black/65 text-xs group-hover:text-[var(--accent-light)] transition-colors">Télécharger le CV complet</p>
                </div>
                <span className="text-black/35 group-hover:text-[var(--accent-light)] transition-colors ml-3">↓</span>
              </a>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <input type="text" placeholder="Nom" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none focus:border-[var(--accent)]/50 transition-colors w-full" />
            <input type="email" placeholder="Email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none focus:border-[var(--accent)]/50 transition-colors w-full" />
          </div>
          <textarea placeholder="Message" required rows={5} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="glass rounded-xl px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none focus:border-[var(--accent)]/50 transition-colors w-full resize-none" />
          <button type="submit" disabled={status === "loading" || status === "success"}
            className="glow w-full py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50">
            {status === "loading" ? "Envoi..." : status === "success" ? "Message envoyé ✓" : "Envoyer"}
          </button>
          {status === "error" && <p className="text-center text-xs text-red-600/80">Une erreur s&apos;est produite.</p>}
        </form>
      </motion.div>

      <div className="mt-12 pt-5 rule flex items-center justify-between">
        <p className="text-black/35 text-xs">© 2026 Soumaïla Niampa</p>
      </div>
    </section>
  );
}
