"use client";
import { useMemo, useState } from "react";
import { normalizeCoverPath } from "@/utils/image";

type Album = {
  id: string;
  title: string;
  artist?: string;
  price: number;
  cover: string;
  category: string;
};

export default function AlbumCard({ album }: { album: Album }) {
  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const src = useMemo(() => normalizeCoverPath(album.cover), [album.cover]);

  function addToCart() {
    const LS_KEY = "cart";
    let cart: { id: string; qty: number }[] = [];
    try {
      cart = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch {}
    const item = cart.find((i) => i.id === album.id);
    if (item) item.qty += 1;
    else cart.push({ id: album.id, qty: 1 });
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="flex flex-col rounded-xl bg-[#181818]/60 p-3 shadow-lg transition hover:scale-[1.02] hover:shadow-xl">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={imgErr ? "/icons/under-construction.png" : src}
          alt={album.title}
          className="aspect-square w-full object-cover"
          onError={() => setImgErr(true)}
        />
        <span className="absolute bottom-2 right-2 rounded-full bg-[#ffd100] px-3 py-1 text-xs font-bold text-black shadow">
          R$ {album.price.toFixed(2)}
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-white">{album.title}</h3>
      {album.artist && <p className="text-xs text-white/70">{album.artist}</p>}
      <button
        onClick={addToCart}
        disabled={added}
        className="mt-3 rounded-full bg-[#ffd100] px-3 py-1 text-sm font-medium text-black transition hover:bg-[#ffcc00]"
      >
        {added ? "Adicionado!" : "Adicionar ao carrinho"}
      </button>
    </article>
  );
}
