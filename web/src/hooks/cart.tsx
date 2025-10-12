"use client";
import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";

export type Product = { id: string; name: string; description: string; price: number };
export type CartItem = { product: Product; qty: number };

type CartContextType = {
  items: CartItem[];
  totalQty: number;
  totalPrice: number;
  add: (p: Product) => void;
  remove: (p: Product) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => { const saved = localStorage.getItem("lojinha_user"); if (saved) setUser(saved); }, []);
  const login = (name: string) => { localStorage.setItem("lojinha_user", name); setUser(name); };
  const logout = () => { localStorage.removeItem("lojinha_user"); setUser(null); };

  const add = (p: Product) =>
    setItems(curr => {
      const i = curr.findIndex(ci => ci.product.id === p.id);
      if (i >= 0) { const copy = [...curr]; copy[i] = { ...copy[i], qty: copy[i].qty + 1 }; return copy; }
      return [...curr, { product: p, qty: 1 }];
    });

  const remove = (p: Product) => setItems(curr => curr.filter(ci => ci.product.id !== p.id));
  const inc = (id: string) => setItems(curr => curr.map(ci => ci.product.id === id ? { ...ci, qty: ci.qty + 1 } : ci));
  const dec = (id: string) => setItems(curr => curr.flatMap(ci => ci.product.id === id ? (ci.qty - 1 <= 0 ? [] : [{ ...ci, qty: ci.qty - 1 }]) : [ci]));
  const clear = () => setItems([]);

  const { totalQty, totalPrice } = useMemo(() => ({
    totalQty: items.reduce((s, it) => s + it.qty, 0),
    totalPrice: items.reduce((s, it) => s + it.qty * it.product.price, 0)
  }), [items]);

  return (
    <CartContext.Provider value={{ items, totalQty, totalPrice, add, remove, inc, dec, clear, user, login, logout }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
