// passar .json pro MONGOloideDB

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { PrismaClient } from "../src/generated/prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALBUMS_PATH = path.join(__dirname, "../src/data/albums.json");

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

type RawAlbum = {
  id: string;
  title: string;
  artist?: string;
  price: number;
  image: string;
  category: string;
  weight?: number;
  description?: string;
};

const prisma = new PrismaClient();

async function main() {
  const rawJson = fs.readFileSync(ALBUMS_PATH, "utf-8");
  const albums: RawAlbum[] = JSON.parse(rawJson);
  const categoriasUnicas = Array.from(new Set(albums.map((a) => a.category)));
  const categoriaMap = new Map<string, string>();

  for (const nome of categoriasUnicas) {
    const slug = slugify(nome);
    const cat = await prisma.categoria.upsert({
      where: { slug },
      update: {},
      create: { nome, slug },
    });
    categoriaMap.set(nome, cat.id);
  }

  for (const a of albums) {
    const precoNum = Number(a.price.toFixed(2));

    const produto = await prisma.produto.upsert({
      where: { id: a.id },
      update: {
        nome: a.title,
        descricao: a.description ?? "",
        preco: precoNum,
        cover: a.image,
        categoryRaw: a.category,
      },
      create: {
        id: a.id,
        nome: a.title,
        descricao: a.description ?? "",
        preco: precoNum,
        cover: a.image,
        categoryRaw: a.category,
      },
    });

    const categoriaId = categoriaMap.get(a.category);
    if (!categoriaId) {
      throw new Error(`Categoria não encontrada para: ${a.category}`);
    }

    await prisma.produtoCategoria.upsert({
      where: {
        produtoId_categoriaId: { produtoId: produto.id, categoriaId },
      },
      update: {},
      create: { produtoId: produto.id, categoriaId },
    });
  }

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
