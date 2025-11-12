// arrumar o link da imagem pq sou burro e esqueci de mudar no json!!!!!

import { PrismaClient } from "../src/generated/prisma";
import { normalizeCoverPath } from "@/utils/image";

const prisma = new PrismaClient();

async function main() {
  const produtos = await prisma.produto.findMany({
    select: { id: true, cover: true },
  });

  const updates = produtos.flatMap((p) => {
    if (!p.cover) return [];

    const fixed = normalizeCoverPath(p.cover);
    if (fixed !== p.cover) {
      return [
        prisma.produto.update({
          where: { id: p.id },
          data: { cover: fixed },
        }),
      ];
    }
    return [];
  });

  if (updates.length === 0) {
    console.log("Nada para atualizar.");
    return;
  }

  await prisma.$transaction(updates);
  console.log(`✔ Atualizados ${updates.length} produtos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
