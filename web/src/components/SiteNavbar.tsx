"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/auth";
import AuthModal from "@/components/AuthModal";

export default function SiteNavbar() {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset;
      setHidden(y > last.current && y > 80);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <nav
        className={[
          "fixed inset-x-0 top-0 z-40 border-b border-[#232323]",
          "bg-[rgba(14,15,17,0.7)] backdrop-blur-sm",
          "transition-all duration-300",
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
        ].join(" ")}
      >
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-bold tracking-[0.14em] text-[#ffd100]">
            DISCOSHOP
          </Link>

          <div className="hidden gap-7 text-sm text-[#c7c7c7] sm:flex">
            <Link href="/catalogo" className="hover:text-[#a7a7a7]">
              Catálogo
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>

                  Olá, {user.name.split(" ")[0]}


                <Link
                  href="/conta/pedidos"
                  className="rounded-full border border-[#232323] bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Meus pedidos
                </Link>

                <Link
                  href="/carrinho"
                  className="rounded-full border border-[#232323] bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Carrinho
                </Link>

                <button
                  onClick={logout}
                  className="rounded-full bg-[#ffd100] px-4 py-2 text-sm font-semibold text-black"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/carrinho"
                  className="rounded-full border border-[#232323] bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Carrinho
                </Link>

                <button
                  onClick={() => setAuthOpen(true)}
                  className="rounded-full bg-[#ffd100] px-4 py-2 text-sm font-semibold text-black"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AuthModal open={authOpen && !user} onClose={() => setAuthOpen(false)} />
    </>
  );
}
