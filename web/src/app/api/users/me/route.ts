// web/src/app/api/account/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // @ts-ignore compat
  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  // @ts-ignore compat
  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  let { name, image } = body as { name?: string; image?: string | null };

  if (typeof name === "string") name = name.trim();
  if (name && name.length < 2) {
    return NextResponse.json({ error: "Nome muito curto." }, { status: 400 });
  }
  if (image !== undefined && image !== null && typeof image !== "string") {
    return NextResponse.json({ error: "Campo image inválido." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(image !== undefined ? { image } : {}),
    },
    select: { id: true, name: true, email: true, image: true },
  });

  return NextResponse.json(updated);
}
