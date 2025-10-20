"use client";
import { createContext, useContext, useMemo } from "react";
import { useSession, signIn, signOut, signUp } from "@/lib/auth-client";

type AuthContextType = {
  user: { id: string; name: string; email: string } | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; msg: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    confirm: string
  ) => Promise<{ ok: true } | { ok: false; msg: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const value: AuthContextType = useMemo(() => {
    const u = session?.user;
    const user = u
      ? { id: u.id, name: u.name ?? "", email: u.email }
      : null;

    return {
      user,
      async login(email, password) {
        const res = await signIn.email({ email, password });
        if ((res as any)?.error) {
          const msg = (res as any).error?.message ?? "Falha ao entrar";
          return { ok: false as const, msg };
        }
        return { ok: true as const };
      },
      async register(name, email, password, confirm) {
        if (password !== confirm) {
          return { ok: false as const, msg: "As senhas não coincidem." };
        }
        const res = await signUp.email({ name, email, password });
        if ((res as any)?.error) {
          const msg = (res as any).error?.message ?? "Falha no cadastro";
          return { ok: false as const, msg };
        }
        return { ok: true as const };
      },
      async logout() {
        await signOut();
      },
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
