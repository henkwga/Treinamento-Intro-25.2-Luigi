"use client";

import { useEffect, useState } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import { Check, Image as ImageIcon, Loader2, Mail, Save, Trash2, User as UserIcon } from "lucide-react";

type Me = { id: string; name: string; email: string; image: string | null };

export default function PerfilPage() {
    const [me, setMe] = useState<Me | null>(null);
    const [name, setName] = useState("");
    const [image, setImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<number | null>(null);

    async function load() {
        setLoading(true);
        const r = await fetch("/api/account/me", { cache: "no-store", credentials: "include" });
        if (r.ok) {
            const j = (await r.json()) as Me;
            setMe(j);
            setName(j?.name ?? "");
            setImage(j?.image ?? "");
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function save() {
        setSaving(true);
        const r = await fetch("/api/account/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, image: image || null }),
        });
        setSaving(false);
        if (!r.ok) {
            const e = await r.json().catch(() => ({}));
            alert(e?.error ?? r.statusText);
            return;
        }
        await load();
        setSavedAt(Date.now());
        setTimeout(() => setSavedAt(null), 2000);
    }

    function removePhoto() {
        setImage("");
    }

    const avatarSrc = image || me?.image || "/avatar-placeholder.png";

    return (
        <>
            <SiteNavbar />
            <main className="min-h-screen bg-[#0e0f11] pt-20 text-white">
                <div className="mx-auto max-w-4xl px-4 pb-20">
                    <header className="mb-8 flex items-center justify-between">
                        <h1 className="text-3xl font-extrabold tracking-wide text-[#ffd100]">Meu perfil</h1>

                        <button
                            onClick={save}
                            disabled={saving || loading}
                            className="inline-flex items-center gap-2 rounded-full bg-[#ffd100] px-5 py-2 text-sm font-semibold text-black
                         disabled:opacity-60"
                            title="Salvar alterações"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Salvando…" : "Salvar alterações"}
                        </button>
                    </header>

                    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_6px_30px_rgba(0,0,0,0.25)]">
                        <div className="grid gap-6 sm:grid-cols-[160px,1fr]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                    {loading ? (
                                        <div className="h-36 w-36 animate-pulse rounded-full bg-white/10" />
                                    ) : (
                                        <img
                                            src={avatarSrc}
                                            alt="avatar"
                                            className="h-36 w-36 rounded-full object-cover ring-2 ring-white/10"
                                        />
                                    )}
                                    {savedAt && (
                                        <span
                                            className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-black shadow"
                                            title="Alterações salvas"
                                        >
                                            <Check className="h-3.5 w-3.5" /> Salvo
                                        </span>
                                    )}
                                </div>

                                <div className="flex w-full flex-col gap-2">
                                    <div className="text-xs text-white/60">URL da foto (opcional)</div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-full">
                                            <ImageIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                            <input
                                                value={image}
                                                onChange={(e) => setImage(e.target.value)}
                                                placeholder="https://…"
                                                className="w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-3 py-2 text-sm outline-none placeholder:text-white/30"
                                            />
                                        </div>
                                        <button
                                            onClick={removePhoto}
                                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                                            title="Remover foto"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Nome</label>
                                    <div className="relative">
                                        <UserIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-white/5 pl-12 pr-3 py-2 text-sm outline-none placeholder:text-white/30"
                                            placeholder="Seu nome"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">E-mail</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                        <input
                                            value={me?.email ?? ""} readOnly
                                            className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.03] pl-12 pr-3 py-2 text-sm text-white/70 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end sm:hidden">
                                    <button
                                        onClick={save}
                                        disabled={saving || loading}
                                        className="inline-flex items-center gap-2 rounded-full bg-[#ffd100] px-5 py-2 text-sm font-semibold text-black disabled:opacity-60"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {saving ? "Salvando…" : "Salvar alterações"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {loading && (
                        <div className="mt-6 space-y-3">
                            <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
                            <div className="h-24 animate-pulse rounded-lg bg-white/10" />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
