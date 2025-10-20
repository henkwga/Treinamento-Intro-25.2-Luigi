"use client";

import { useEffect, useState } from "react";
import SiteNavbar from "@/components/SiteNavbar";

type Produto = { id: string; nome: string; cover: string; preco: number };
type Item = { id: string; quantidade: number; precoUnit: number; produto: Produto };
type Compra = {
  id: string;
  status: "PENDENTE" | "PAGO" | "ENVIADO" | "CANCELADO";
  precoTotal: number;
  createdAt: string;
  itens: Item[];
};

const toBRL = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

export default function OrdersPage() {
  const [data, setData] = useState<Compra[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/purchases/me", { cache: "no-store", credentials: "include" });
    const j = await r.json();
    setData(Array.isArray(j) ? j : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function finalizar(id: string) {
    const r = await fetch(`/api/purchases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PAGO" }),
      credentials: "include",
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      alert(e?.error ?? r.statusText);
      return;
    }
    await load();
  }

  return (
    <>
      <SiteNavbar />
      <main className="min-h-screen bg-[#0e0f11] pt-20 text-white">
        <div className="mx-auto max-w-5xl px-4 pb-16">
          <h1 className="mb-6 text-3xl font-extrabold tracking-wide text-[#ffd100]">
            Meus pedidos
          </h1>

          {loading && <p className="text-white/70">Carregando…</p>}

          {!loading && (!data || data.length === 0) && (
            <p className="text-white/70">Você ainda não possui pedidos.</p>
          )}

          <div className="space-y-6">
            {data?.map((c) => (
              <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm text-white/70">Pedido #{c.id.slice(0, 8)}</div>
                    <div className="text-xs text-white/50">
                      {new Date(c.createdAt).toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        c.status === "PENDENTE"
                          ? "bg-yellow-400 text-black"
                          : c.status === "PAGO"
                          ? "bg-green-500 text-black"
                          : c.status === "ENVIADO"
                          ? "bg-blue-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {c.status.toLowerCase()}
                    </span>
                    <span className="rounded-full bg-[#ffd100] px-3 py-1 text-xs font-bold text-black">
                      {toBRL(c.precoTotal)}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  {c.itens.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 py-3">
                      <img src={it.produto.cover} alt={it.produto.nome}
                           className="h-12 w-12 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{it.produto.nome}</div>
                        <div className="text-xs text-white/60">
                          {it.quantidade} × {toBRL(it.precoUnit)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {toBRL(it.quantidade * it.precoUnit)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ações */}
                <div className="mt-3 flex justify-end gap-2">
                  {c.status === "PENDENTE" && (
                    <button
                      onClick={() => finalizar(c.id)}
                      className="rounded-full bg-[#ffd100] px-4 py-2 text-sm font-semibold text-black"
                    >
                      Finalizar pagamento
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
