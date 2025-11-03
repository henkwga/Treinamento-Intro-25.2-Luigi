import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import { productsQuerySchema } from "@/schemas/query";
import { productCreateSchema } from "@/schemas/product";
import { badRequest, toIssues } from "@/utils/http";

export async function GET(req: NextRequest) {
  const raw = Object.fromEntries(req.nextUrl.searchParams.entries());

  const parsed = productsQuerySchema.safeParse({
    category: raw["category"],
    ids: raw["ids"],
  });
  if (!parsed.success) {
    return badRequest(toIssues(parsed.error));
  }
  const { category, ids } = parsed.data;

  let where: Prisma.ProdutoWhereInput = {};

  if (ids && ids.length) {
    where = { id: { in: ids } };
  } else if (category && category !== "all") {
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
  const body = await req.json();
  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(toIssues(parsed.error));
  }

  const { nome, descricao, preco, cover, categoriaIds } = parsed.data;

  const created = await prisma.produto.create({
    data: {
      nome,
      descricao,
      preco,
      cover,
      categorias:
        Array.isArray(categoriaIds) && categoriaIds.length
          ? {
              create: categoriaIds.map((id: string) => ({
                categoria: { connect: { id } },
              })),
            }
          : undefined,
    },
    include: { categorias: { include: { categoria: true } } },
  });

  return NextResponse.json(created, { status: 201 });
}
