"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [msg, setMsg] = useState("");

  const [lemail, setLEmail] = useState("");
  const [lpass, setLPass] = useState("");

  const [rname, setRName] = useState("");
  const [remail, setREmail] = useState("");
  const [rpass, setRPass] = useState("");
  const [rpass2, setRPass2] = useState("");

  if (!open) return null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await login(lemail, lpass);
    if (res.ok) { onClose(); return; }
    setMsg(res.msg);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await register(rname, remail, rpass, rpass2);
    if (res.ok) { onClose(); return; }
    setMsg(res.msg);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] p-5 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm ${tab === "login" ? "bg-white/10" : "bg-transparent hover:bg-white/5"} border border-white/10`}
            onClick={() => setTab("login")}
          >
            Entrar
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm ${tab === "register" ? "bg-white/10" : "bg-transparent hover:bg-white/5"} border border-white/10`}
            onClick={() => setTab("register")}
          >
            Criar conta
          </button>
        </div>

        {tab === "login" ? (
          <form className="grid gap-3" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-white/60 outline-none focus:border-white/25"
              value={lemail}
              onChange={(e) => setLEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-white/60 outline-none focus:border-white/25"
              value={lpass}
              onChange={(e) => setLPass(e.target.value)}
              required
            />
            {msg && <p className="text-sm text-red-400">{msg}</p>}
            <button
              type="submit"
              className="mt-1 rounded-full bg-[#ffd100] px-4 py-2 text-sm font-semibold text-black"
            >
              Entrar
            </button>
          </form>
        ) : (
          <form className="grid gap-3" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Seu nome"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-white/60 outline-none focus:border-white/25"
              value={rname}
              onChange={(e) => setRName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-white/60 outline-none focus:border-white/25"
              value={remail}
              onChange={(e) => setREmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha (mín. 6)"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-white/60 outline-none focus:border-white/25"
              value={rpass}
              onChange={(e) => setRPass(e.target.value)}
              minLength={6}
              required
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder-white/60 outline-none focus:border-white/25"
              value={rpass2}
              onChange={(e) => setRPass2(e.target.value)}
              minLength={6}
              required
            />
            {msg && <p className="text-sm text-red-400">{msg}</p>}
            <button
              type="submit"
              className="mt-1 rounded-full bg-[#ffd100] px-4 py-2 text-sm font-semibold text-black"
            >
              Criar conta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
