import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  const where: Prisma.ProdutoWhereInput = category
    ? { categorias: { some: { categoria: { slug: category } } } }
    : {};

  const args: Prisma.ProdutoFindManyArgs = {
    where,
    include: {
      categorias: { include: { categoria: true } },
    },
    orderBy: { nome: "asc" },
  };

  const items = await prisma.produto.findMany(args);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { nome, descricao, preco, cover, categoriaIds } = await req.json();

  const data: Prisma.ProdutoCreateInput = {
    nome,
    descricao,
    preco, 
    cover,
    categorias:
      Array.isArray(categoriaIds) && categoriaIds.length > 0
        ? {
            create: categoriaIds.map((id: string) => ({
              categoria: { connect: { id } },
            })),
          }
        : undefined,
  };

  const created = await prisma.produto.create({ data });
  return NextResponse.json(created, { status: 201 });
}
