"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/auth";
import AuthModal from "@/components/AuthModal";

function Home() {
  // Hide on scroll
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
      {/* NAVBAR */}
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
                <span className="hidden text-sm text-[#c7c7c7] sm:inline">
                  Olá, {user.name.split(" ")[0]}
                </span>
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

      {/* HERO */}
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden overscroll-y-none">
        {/* fundo */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_#ffb347_0%,_#ffcc33_60%,_#ffa622_100%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/clean-gray-paper.png')] mix-blend-overlay opacity-60" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.05),rgba(0,0,0,0.05),rgba(255,255,255,0.05))] animate-spin motion-safe:duration-[25s] [animation-timing-function:linear] opacity-40 mix-blend-overlay transform-gpu will-change-transform scale-125 origin-center" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 text-center">
          <h1 className="m-0 text-[clamp(64px,15vw,160px)] font-extrabold leading-none tracking-[0.02em] text-[#a94f14] drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)]">
            DISCOSHOP
          </h1>
          <p className="mt-3 text-sm tracking-[0.02em] text-[#a7a7a7]">
            Clássicos, raridades e novos sons girando sem parar.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href="/catalogo"
              className="rounded-full bg-[#ffd100] px-4 py-2 text-sm font-semibold text-black shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      </section>

      <AuthModal open={authOpen && !user} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}
