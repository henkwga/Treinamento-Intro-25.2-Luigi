"use client";

import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";

export default function Page() {
  return (
    <>
      <SiteNavbar />

      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden overscroll-y-none">
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
    </>
  );
}
