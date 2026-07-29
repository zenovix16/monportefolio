"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F2F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-black/45 mb-3">Admin</p>
          <h1 className="text-2xl font-bold text-[#14161A]">Connexion</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full glass rounded-xl px-4 py-3.5 text-sm text-[#14161A] placeholder:text-black/35 outline-none"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full glass rounded-xl px-4 py-3.5 text-sm text-[#14161A] placeholder:text-black/35 outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="glow w-full py-3.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Connexion..." : "Se connecter"}
          </button>
          {status === "error" && (
            <p className="text-center text-sm text-red-600/80">Identifiants incorrects.</p>
          )}
        </form>
      </div>
    </div>
  );
}
