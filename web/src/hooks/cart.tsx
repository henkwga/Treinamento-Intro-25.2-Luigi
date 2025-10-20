"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";

type Line = { id: string; qty: number };
type CartItem = Product & { qty: number; lineTotal: number };

const LS_KEY = "cart";

function readLines(): Line[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
}
function writeLines(lines: Line[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(lines));
}

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children, products }: { children: React.ReactNode; products: Product[] }) {
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    setLines(readLines());
    const onStorage = (e: StorageEvent) => { if (e.key === LS_KEY) setLines(readLines()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const byId = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

  const items: CartItem[] = useMemo(() =>
    lines.map(l => {
      const p = byId.get(l.id);
      if (!p) return null;
      return { ...p, qty: l.qty, lineTotal: p.price * l.qty };
    }).filter(Boolean) as CartItem[], [lines, byId]
  );

  const count = items.reduce((n, it) => n + it.qty, 0);
  const total = items.reduce((s, it) => s + it.lineTotal, 0);

  function add(p: Product, qty = 1) {
    const next = [...lines];
    const found = next.find(l => l.id === p.id);
    if (found) found.qty += qty; else next.push({ id: p.id, qty });
    setLines(next); writeLines(next);
  }
  function remove(id: string) {
    const next = lines.filter(l => l.id !== id);
    setLines(next); writeLines(next);
  }
  function setQty(id: string, qty: number) {
    if (qty < 1) return;
    const next = lines.map(l => l.id === id ? ({ ...l, qty }) : l);
    setLines(next); writeLines(next);
  }
  function clear() { setLines([]); writeLines([]); }

  return <Ctx.Provider value={{ items, count, total, add, remove, setQty, clear }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
