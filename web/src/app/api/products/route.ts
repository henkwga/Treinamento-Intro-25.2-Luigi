import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const category = url.searchParams.get("category");
  const idsParam = url.searchParams.get("ids");

  let where: Prisma.ProdutoWhereInput = {};

  if (idsParam) {
    const ids = idsParam.split(",").map(s => s.trim()).filter(Boolean);
    where = { id: { in: ids } };
  } else if (category) {
    where = { categorias: { some: { categoria: { slug: category } } } };
  }

  const items = await prisma.produto.findMany({
    where,
    include: { categorias: { include: { categoria: true } } },
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
      preco, // number
      cover,
      categorias: Array.isArray(categoriaIds) && categoriaIds.length
        ? {
            create: categoriaIds.map((id: string) => ({
              categoria: { connect: { id } },
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
