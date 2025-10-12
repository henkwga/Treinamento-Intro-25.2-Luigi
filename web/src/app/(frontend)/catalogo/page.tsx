"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AlbumCard from "@/components/AlbumCard";
import raw from "@/data/albums.json";

type Album = {
  id: string;
  title: string;
  artist?: string;
  price: number;
  cover: string;      // normalizado para apontar ao /public
  category: string;
  weight?: number;
  description?: string;
};

type RawAlbum = {
  id: string;
  title: string;
  artist?: string;
  price: number;
  image: string;      // <- do JSON
  category: string;
  weight?: number;
  description?: string;
};

function normalizeCoverPath(imagePath: string) {
  // assets/imgs/albuns/foo.jpg -> /albuns/foo.jpg
  let p = imagePath.replace(/^assets\/imgs\/albuns\//, "/albuns/");
  // assets/imgs/anything.png -> /anything.png
  p = p.replace(/^assets\/imgs\//, "/");
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
}

// Normaliza uma vez (fora do componente)
const ALL_ALBUMS: Album[] = (raw as RawAlbum[]).map((a) => ({
  id: a.id,
  title: a.title,
  artist: a.artist,
  price: a.price,
  cover: normalizeCoverPath(a.image),
  category: a.category,
  weight: a.weight,
  description: a.description ?? "",
}));

export default function Catalogo() {
  const search = useSearchParams();
  const initialCat = (search.get("cat") || "all").toLowerCase();
  const [category, setCategory] = useState<string>(initialCat);

  // Se a URL mudar (navegação interna), sincroniza
  useEffect(() => {
    const urlCat = (search.get("cat") || "all").toLowerCase();
    setCategory(urlCat);
  }, [search]);

  const cats = useMemo(
    () => Array.from(new Set(ALL_ALBUMS.map((a) => a.category))).sort(),
    []
  );

  const filtered =
    category === "all"
      ? ALL_ALBUMS
      : ALL_ALBUMS.filter((a) => a.category.toLowerCase() === category);

  return (
    <main className="min-h-screen bg-[#0e0f11] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-[0.05em] text-[#ffd100]">
            Catálogo de Álbuns
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Explore clássicos, raridades e novos sons.
          </p>
        </header>

        {/* Filtros */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setCategory("all")}
            className={`rounded-full border border-[#232323] px-4 py-1 text-sm ${
              category === "all"
                ? "bg-[#ffd100] text-black"
                : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            Todos
          </button>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c.toLowerCase())}
              className={`rounded-full border border-[#232323] px-4 py-1 text-sm capitalize ${
                category === c.toLowerCase()
                  ? "bg-[#ffd100] text-black"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((a) => (
            <AlbumCard key={a.id} album={a} />
          ))}
        </div>
      </div>
    </main>
  );
}
