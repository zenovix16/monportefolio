"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
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
    <section id="contact" ref={ref} className="py-24 md:py-36 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">06</span>
          <div className="flex-1 rule" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">Contact</span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-bold text-white mb-4"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)" }}>
              Travaillons<br />ensemble.
            </h2>
            <p className="text-white/38 text-sm leading-relaxed mb-8">
              Un projet, une opportunité, une question ? Je lis tous les messages.
            </p>

            <div className="space-y-3">
              <a href="mailto:soumaila.niampa@centrale-casablanca.ma"
                className="glass rounded-xl p-4 flex items-center justify-between group hover:border-white/14 transition-all">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-white/22 mb-1">Email</p>
                  <p className="text-white/50 text-xs group-hover:text-white/70 transition-colors">
                    soumaila.niampa@centrale-casablanca.ma
                  </p>
                </div>
                <span className="text-white/20 group-hover:text-white/50 transition-colors">↗</span>
              </a>
              <a href="tel:+212708778658"
                className="glass rounded-xl p-4 flex items-center justify-between group hover:border-white/14 transition-all">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-white/22 mb-1">Téléphone</p>
                  <p className="text-white/50 text-xs group-hover:text-white/70 transition-colors">+212 708-778-658</p>
                </div>
                <span className="text-white/20 group-hover:text-white/50 transition-colors">↗</span>
              </a>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Nom" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="glass rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/18 transition-colors w-full" />
              <input type="email" placeholder="Email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="glass rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/18 transition-colors w-full" />
            </div>
            <textarea placeholder="Message" required rows={5} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="glass rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/18 transition-colors w-full resize-none" />
            <button type="submit" disabled={status === "loading" || status === "success"}
              className="w-full py-3.5 bg-white text-black text-sm font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50">
              {status === "loading" ? "Envoi..." : status === "success" ? "Message envoyé ✓" : "Envoyer"}
            </button>
            {status === "error" && <p className="text-center text-sm text-red-400/60">Une erreur s&apos;est produite.</p>}
          </motion.form>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-6 rule flex items-center justify-between"
        >
          <p className="text-white/18 text-xs">© 2025 Soumaïla Niampa</p>
          <div className="flex gap-5">
            <a href="https://linkedin.com/in/souma%C3%AFla-niampa" target="_blank" rel="noopener noreferrer"
              className="text-xs text-white/28 hover:text-white transition-colors">LinkedIn ↗</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
