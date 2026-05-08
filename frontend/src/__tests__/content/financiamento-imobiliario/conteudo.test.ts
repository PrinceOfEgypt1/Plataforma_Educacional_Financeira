/**
 * Testes editoriais e de lint pedagógico do conteúdo educacional
 * do módulo Financiamento Imobiliário.
 */

import { describe, expect, it } from "vitest";

import {
  CONTEUDO_NIVEL_1,
  CONTEUDO_NIVEL_2,
  DISCLAIMER_FINANCIAMENTO,
  GLOSSARIO_FINANCIAMENTO,
} from "@/content/financiamento-imobiliario";

// ─────────────────────────────── disclaimer ─────────────────────────────────

describe("DISCLAIMER_FINANCIAMENTO", () => {
  it("existe e não está vazio", () => {
    expect(DISCLAIMER_FINANCIAMENTO).toBeTruthy();
    expect(DISCLAIMER_FINANCIAMENTO.length).toBeGreaterThan(50);
  });

  it("menciona uso educacional", () => {
    expect(DISCLAIMER_FINANCIAMENTO).toMatch(/educacional/i);
  });

  it("menciona não substituição por proposta bancária", () => {
    expect(DISCLAIMER_FINANCIAMENTO).toMatch(/proposta banc/i);
  });

  it("menciona análise profissional ou financeira", () => {
    expect(DISCLAIMER_FINANCIAMENTO).toMatch(/profissional/i);
  });

  it("menciona CET ou contrato", () => {
    expect(DISCLAIMER_FINANCIAMENTO).toMatch(/CET|contrato/i);
  });
});

// ─────────────────────────────── nível 1 ────────────────────────────────────

describe("CONTEUDO_NIVEL_1", () => {
  it("tem pelo menos 5 blocos", () => {
    expect(CONTEUDO_NIVEL_1.length).toBeGreaterThanOrEqual(5);
  });

  it("todos os blocos têm level nivel-1", () => {
    for (const item of CONTEUDO_NIVEL_1) {
      expect(item.level).toBe("nivel-1");
    }
  });

  it("todos os blocos têm slug, title, version", () => {
    for (const item of CONTEUDO_NIVEL_1) {
      expect(item.slug).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.version).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it("todos os blocos têm ao menos 4 parágrafos", () => {
    for (const item of CONTEUDO_NIVEL_1) {
      expect(item.paragraphs.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("todos os blocos incluem disclaimer", () => {
    for (const item of CONTEUDO_NIVEL_1) {
      expect(item.disclaimer).toBeTruthy();
    }
  });

  it("slugs são únicos", () => {
    const slugs = CONTEUDO_NIVEL_1.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("explica diferença entre PRICE e SAC", () => {
    const texto = CONTEUDO_NIVEL_1.map((i) => i.paragraphs.join(" ")).join(" ");
    expect(texto).toMatch(/PRICE/i);
    expect(texto).toMatch(/SAC/i);
  });

  it("explica entrada e valor financiado", () => {
    const texto = CONTEUDO_NIVEL_1.map((i) => i.paragraphs.join(" ")).join(" ");
    expect(texto).toMatch(/entrada/i);
    expect(texto).toMatch(/financiado/i);
  });
});

// ─────────────────────────────── nível 2 ────────────────────────────────────

describe("CONTEUDO_NIVEL_2", () => {
  it("tem pelo menos 5 blocos", () => {
    expect(CONTEUDO_NIVEL_2.length).toBeGreaterThanOrEqual(5);
  });

  it("todos os blocos têm level nivel-2", () => {
    for (const item of CONTEUDO_NIVEL_2) {
      expect(item.level).toBe("nivel-2");
    }
  });

  it("mesmos slugs base do nível 1", () => {
    const slugs1 = CONTEUDO_NIVEL_1.map((i) => i.slug);
    const slugs2 = CONTEUDO_NIVEL_2.map((i) => i.slug);
    for (const s of slugs1) {
      expect(slugs2).toContain(s);
    }
  });

  it("menciona valor em reais no contexto financeiro", () => {
    const texto = CONTEUDO_NIVEL_2.map((i) => i.paragraphs.join(" ")).join(" ");
    expect(texto).toMatch(/reais|R\$/i);
  });

  it("menciona CET ou Custo Efetivo Total", () => {
    const texto = CONTEUDO_NIVEL_2.map((i) => i.paragraphs.join(" ")).join(" ");
    expect(texto).toMatch(/CET|Custo Efetivo Total/i);
  });
});

// ─────────────────────────────── glossário ──────────────────────────────────

describe("GLOSSARIO_FINANCIAMENTO", () => {
  it("tem pelo menos 12 termos", () => {
    expect(GLOSSARIO_FINANCIAMENTO.length).toBeGreaterThanOrEqual(12);
  });

  const TERMOS_OBRIGATORIOS = [
    "financiamento-imobiliario",
    "valor-imovel",
    "entrada",
    "valor-financiado",
    "prazo",
    "taxa-juros-mensal",
    "amortizacao",
    "saldo-devedor",
    "sistema-price",
    "sistema-sac",
    "encargos-mensais",
    "custo-total",
  ];

  for (const slug of TERMOS_OBRIGATORIOS) {
    it(`contém o termo obrigatório: ${slug}`, () => {
      expect(GLOSSARIO_FINANCIAMENTO.find((e) => e.slug === slug)).toBeTruthy();
    });
  }

  it("todos os termos têm definição, exemplo e relatedModule=financing", () => {
    for (const entry of GLOSSARIO_FINANCIAMENTO) {
      expect(entry.shortDefinition).toBeTruthy();
      expect(entry.fullDefinition).toBeTruthy();
      expect(entry.example).toBeTruthy();
      expect(entry.relatedModule).toBe("financing");
    }
  });
});

// ─────────────────────────────── lint pedagógico ────────────────────────────

describe("lint pedagógico — financiamento", () => {
  const TODO_TEXTO = [...CONTEUDO_NIVEL_1, ...CONTEUDO_NIVEL_2]
    .flatMap((i) => i.paragraphs)
    .join(" ");

  it("não contém 'garantido'", () => {
    expect(TODO_TEXTO).not.toMatch(/garantido/i);
  });

  it("não contém 'você deve' prescritivo", () => {
    expect(TODO_TEXTO).not.toMatch(
      /você deve\s+(fazer|comprar|escolher|evitar|usar|optar|contratar)/i,
    );
  });

  it("não contém 'recomendamos'", () => {
    expect(TODO_TEXTO).not.toMatch(/recomendamos/i);
  });

  it("não contém marcador de rascunho TODO/FIXME/placeholder", () => {
    expect(TODO_TEXTO).not.toMatch(/\bTODO\b|\bFIXME\b|\bplaceholder\b/i);
  });

  it("não promete aprovação de financiamento", () => {
    expect(TODO_TEXTO).not.toMatch(/aprovação garantida|crédito aprovado/i);
  });

  it("não promete economia como certa", () => {
    expect(TODO_TEXTO).not.toMatch(/você vai economizar|economia certa/i);
  });
});
