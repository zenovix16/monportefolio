"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
    <section id="contact" ref={ref} className="py-32 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Travaillons ensemble.
          </h2>
          <p className="text-white/35">Un projet ? Une opportunité ? Dis-moi tout.</p>
        </motion.div>

        {/* Info directe */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <a
            href="mailto:soumaila.niampa@centrale-casablanca.ma"
            className="glass rounded-xl p-4 group hover:border-white/15 transition-colors"
          >
            <p className="text-[10px] tracking-widest uppercase text-white/25 mb-1">Email</p>
            <p className="text-white/60 text-xs group-hover:text-white/80 transition-colors break-all">
              soumaila.niampa@centrale-casablanca.ma
            </p>
          </a>
          <a
            href="tel:+212708778658"
            className="glass rounded-xl p-4 group hover:border-white/15 transition-colors"
          >
            <p className="text-[10px] tracking-widest uppercase text-white/25 mb-1">Téléphone</p>
            <p className="text-white/60 text-xs group-hover:text-white/80 transition-colors">
              +212 708-778-658
            </p>
          </a>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nom"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors w-full"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="glass rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors w-full"
            />
          </div>

          <textarea
            placeholder="Message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="glass rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/20 transition-colors w-full resize-none"
          />

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full py-3.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Envoi..." : status === "success" ? "Message envoyé ✓" : "Envoyer"}
          </button>

          {status === "error" && (
            <p className="text-center text-sm text-red-400/60">
              Une erreur s&apos;est produite. Réessaie.
            </p>
          )}
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 pt-8 border-t border-white/[0.05] flex items-center justify-between"
        >
          <p className="text-white/20 text-xs">© 2025 Soumaïla Niampa</p>
          <div className="flex gap-6">
            <a
              href="https://linkedin.com/in/souma%C3%AFla-niampa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
