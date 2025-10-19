import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const where = category
    ? { categorias: { some: { categoria: { slug: category } } } }
    : {};

  const items = await prisma.produto.findMany({
    where,
    include: { categorias: { include: { categoria: true } } } as any,
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { nome, descricao, preco, cover, categoriaIds } = await req.json();
  const created = await prisma.produto.create({
    data: {
      nome,
      descricao,
      preco,
      cover,
      categorias: categoriaIds?.length
        ? { create: categoriaIds.map((id: string) => ({ categoriaId: id })) }
        : undefined,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
