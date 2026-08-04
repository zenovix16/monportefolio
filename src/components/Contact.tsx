"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import SectionTitle from "./SectionTitle";

interface Props {
  cvUrl: string | null;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
}

const DEFAULTS = {
  email: "soumaila.niampa@centrale-casablanca.ma",
  phone: "+212 708-778-658",
  linkedinUrl: "https://linkedin.com/in/souma%C3%AFla-niampa",
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export default function Contact({ cvUrl, email, phone, linkedinUrl }: Props) {
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const mail = email || DEFAULTS.email;
  const tel = phone || DEFAULTS.phone;
  const linkedin = linkedinUrl || DEFAULTS.linkedinUrl;

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

  const rows = [
    { label: "Email", value: mail, href: `mailto:${mail}` },
    { label: "Téléphone", value: tel, href: `tel:${tel.replace(/[\s-]/g, "")}` },
    { label: "LinkedIn", value: linkedin.replace(/^https?:\/\//, ""), href: linkedin, external: true },
    ...(cvUrl ? [{ label: "CV", value: "Télécharger le CV complet", href: cvUrl, download: true }] : []),
  ];

  return (
    <section id="contact" className="px-5 md:px-10 py-10 md:py-16 max-w-6xl mx-auto">
      <SectionHeading number="07" label="Contact" />

      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div>
          <SectionTitle>Travaillons ensemble.</SectionTitle>
          <p className="text-black/55 text-sm leading-relaxed mb-6">
            Un projet, une opportunité, une question ? Je lis tous les messages.
          </p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
            className="divide-y divide-black/[0.08] border-t border-black/[0.08]"
          >
            {rows.map((r) => (
              <motion.a
                key={r.label}
                variants={item}
                href={r.href}
                download={"download" in r ? r.download : undefined}
                target={"external" in r ? "_blank" : undefined}
                rel={"external" in r ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-between py-4"
              >
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-black/40 mb-0.5">{r.label}</p>
                  <p className="text-black/65 text-sm group-hover:text-[var(--accent-light)] transition-colors break-all">
                    {r.value}
                  </p>
                </div>
                <span className="text-black/30 group-hover:text-[var(--accent-light)] group-hover:translate-x-0.5 transition-all ml-3 shrink-0">
                  {"download" in r ? "↓" : "↗"}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <input type="text" placeholder="Nom" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass rounded-lg px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none focus:border-[var(--accent)]/50 transition-colors w-full" />
            <input type="email" placeholder="Email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="glass rounded-lg px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none focus:border-[var(--accent)]/50 transition-colors w-full" />
          </div>
          <textarea placeholder="Message" required rows={5} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="glass rounded-lg px-4 py-3 text-sm text-[#14161A] placeholder:text-black/35 outline-none focus:border-[var(--accent)]/50 transition-colors w-full resize-none" />
          <button type="submit" disabled={status === "loading" || status === "success"}
            className="glow w-full py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50">
            {status === "loading" ? "Envoi..." : status === "success" ? "Message envoyé ✓" : "Envoyer"}
          </button>
          {status === "error" && <p className="text-center text-xs text-red-600/80">Une erreur s&apos;est produite.</p>}
        </form>
      </div>
    </section>
  );
}
