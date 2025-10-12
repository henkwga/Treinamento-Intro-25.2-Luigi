"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; name: string; email: string; passHash: string };
type Session = { email: string };

type AuthContextType = {
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; msg: string }>;
  register: (name: string, email: string, password: string, confirm: string) => Promise<{ ok: true } | { ok: false; msg: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const LS_USERS = "users";
const LS_SESSION = "session";

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function emailOk(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // carrega sessão inicial
  useEffect(() => {
    try {
      const rawSess = localStorage.getItem(LS_SESSION);
      if (!rawSess) return;
      const sess: Session = JSON.parse(rawSess);
      const users: User[] = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
      const u = users.find(x => x.email === sess.email);
      if (u) setUser({ name: u.name, email: u.email });
    } catch {}
  }, []);

  async function register(name: string, email: string, password: string, confirm: string) {
    name = name.trim();
    email = email.trim().toLowerCase();
    if (!name || !emailOk(email) || password.length < 6) {
      return { ok: false as const, msg: "Verifique os campos (email válido e senha ≥ 6)." };
    }
    if (password !== confirm) {
      return { ok: false as const, msg: "As senhas não coincidem." };
    }

    let users: User[] = [];
    try { users = JSON.parse(localStorage.getItem(LS_USERS) || "[]"); } catch {}
    if (users.some(u => u.email === email)) {
      return { ok: false as const, msg: "Este e-mail já está cadastrado." };
    }

    const passHash = await sha256(password);
    const newUser: User = { id: crypto.randomUUID(), name, email, passHash };
    const next = [...users, newUser];
    localStorage.setItem(LS_USERS, JSON.stringify(next));
    localStorage.setItem(LS_SESSION, JSON.stringify({ email }));
    setUser({ name, email });
    return { ok: true as const };
  }

  async function login(email: string, password: string) {
    email = email.trim().toLowerCase();
    let users: User[] = [];
    try { users = JSON.parse(localStorage.getItem(LS_USERS) || "[]"); } catch {}
    const u = users.find(x => x.email === email);
    if (!u) return { ok: false as const, msg: "E-mail não encontrado." };
    const passHash = await sha256(password);
    if (u.passHash !== passHash) return { ok: false as const, msg: "Senha incorreta." };
    localStorage.setItem(LS_SESSION, JSON.stringify({ email }));
    setUser({ name: u.name, email: u.email });
    return { ok: true as const };
  }

  function logout() {
    localStorage.removeItem(LS_SESSION);
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
