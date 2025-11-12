import { describe, it, expect } from "vitest";
import { productCreateSchema, productPatchSchema } from "@/schemas/product";

describe("📦 productCreateSchema", () => {
  it("valida um produto válido", () => {
    const result = productCreateSchema.safeParse({
      nome: "Pôster Geométrico",
      descricao: "Arte minimalista inspirada na Bauhaus",
      preco: "249.90", // coerção: string → number
      cover: "/covers/geom.jpg",
      categoriaIds: ["abc123", "def456"],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preco).toBeTypeOf("number");
      expect(result.data.preco).toBeCloseTo(249.9);
    }
  });

  it("falha se faltar campos obrigatórios", () => {
    const result = productCreateSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.issues.map(i => i.path.join("."));
      expect(errors).toContain("nome");
      expect(errors).toContain("cover");
      expect(errors).toContain("preco");
    }
  });

  it("falha se preco for negativo ou inválido", () => {
    const result = productCreateSchema.safeParse({
      nome: "Teste",
      descricao: "Descrição teste",
      preco: "-10",
      cover: "/img/teste.jpg",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      expect(messages.some(m => m.includes("positivo"))).toBe(true);
    }
  });
});

describe("🧩 productPatchSchema", () => {
  it("aceita campos parciais", () => {
    const result = productPatchSchema.safeParse({
      nome: "Título alterado",
      preco: 99.9,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nome).toBe("Título alterado");
      expect(result.data.preco).toBe(99.9);
    }
  });

  it("falha se preco for string não numérica", () => {
    const result = productPatchSchema.safeParse({
      preco: "abc",
    });
    expect(result.success).toBe(false);
  });
});
