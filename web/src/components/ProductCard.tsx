"use client";
import { useState } from "react";
import { useCart } from "@/hooks/cart";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  const { add, remove } = useCart();
  const [added, setAdded] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <article className="flex flex-col rounded-xl bg-[#181818]/60 p-3 shadow-lg transition hover:scale-[1.02] hover:shadow-xl">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={err ? "/icons/under-construction.png" : product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
          onError={() => setErr(true)}
        />
        <span className="absolute bottom-2 right-2 rounded-full bg-[#ffd100] px-3 py-1 text-xs font-bold text-black shadow">
          R$ {product.price.toFixed(2)}
        </span>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-white">{product.name}</h3>
      {product.description && <p className="text-xs text-white/70">{product.description}</p>}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => { add(product, 1); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          className="flex-1 rounded-full bg-[#ffd100] px-3 py-1 text-sm font-medium text-black transition hover:bg-[#ffcc00]"
        >
          {added ? "Adicionado!" : "Adicionar"}
        </button>
        <button
          onClick={() => remove(product.id)}
          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm"
        >
          Remover
        </button>
      </div>
    </article>
  );
}
