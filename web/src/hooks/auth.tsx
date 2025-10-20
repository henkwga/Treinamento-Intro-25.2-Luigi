"use client";
import { createContext, useContext, useMemo } from "react";
import { useSession, signIn, signOut, signUp } from "@/lib/auth-client";

type User = { id: string; name: string; email: string };

type Ok = { ok: true };
type Fail = { ok: false; msg: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<Ok | Fail>;
  register: (name: string, email: string, password: string, confirm: string) => Promise<Ok | Fail>;
  logout: () => Promise<void>;
};

type AuthClientErrorShape = {
  error?: { message?: string } | null;
};

function hasAuthError(x: unknown): x is Required<AuthClientErrorShape> {
  if (typeof x !== "object" || x === null) return false;
  const r = x as Record<string, unknown>;
  const err = r["error"];
  if (typeof err !== "object" || err === null) return false;
  const msg = (err as Record<string, unknown>)["message"];
  return typeof msg === "string" || typeof msg === "undefined";
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const value = useMemo<AuthContextType>(() => {
    const u = session?.user;
    const user: User | null = u
      ? {
          id: u.id,
          name: (u.name ?? "").toString(),
          email: (u.email ?? "").toString(),
        }
      : null;

    return {
      user,

      async login(email, password) {
        const res: unknown = await signIn.email({ email, password });
        if (hasAuthError(res) && res.error) {
          const msg = res.error.message ?? "Falha ao entrar";
          return { ok: false, msg } as const;
        }
        return { ok: true } as const;
      },

      async register(name, email, password, confirm) {
        if (password !== confirm) {
          return { ok: false, msg: "As senhas não coincidem." } as const;
        }
        const res: unknown = await signUp.email({ name, email, password });
        if (hasAuthError(res) && res.error) {
          const msg = res.error.message ?? "Falha no cadastro";
          return { ok: false, msg } as const;
        }
        return { ok: true } as const;
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
