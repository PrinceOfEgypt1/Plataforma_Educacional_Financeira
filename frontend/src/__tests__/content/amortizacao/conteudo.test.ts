/**
 * Testes do conteúdo educacional estático do módulo de Amortização.
 *
 * Validam estrutura versionável, cobertura mínima de PRICE/SAC, glossário,
 * cuidados educacionais e ausência de conteúdo futuro materializado.
 */
import { describe, expect, it } from "vitest";

import {
  CONTEUDO_NIVEL_1,
  CONTEUDO_NIVEL_2,
  CUIDADOS_EDUCACIONAIS,
  DISCLAIMER_EDUCACIONAL,
  GLOSSARIO_MINIMO,
  type EducationalContent,
  type GlossaryEntry,
} from "@/content/amortizacao";

const SEMVER = /^\d+\.\d+\.\d+$/;
const SLUGS_OBRIGATORIOS = [
  "amortizacao",
  "sistema-price",
  "sistema-sac",
  "comparacao-price-sac",
] as const;

const TERMOS_GLOSSARIO_MIN = [
  "principal",
  "taxa-periodo",
  "numero-periodos",
  "parcela",
  "juros",
  "amortizacao",
  "saldo-devedor",
  "total-pago",
  "total-juros",
  "saldo-final",
  "price",
  "sac",
] as const;

const PADROES_BLOQUEADOS = [
  new RegExp("place" + "holder", "i"),
  new RegExp("\\bTO" + "DO\\b"),
  new RegExp("\\bFIX" + "ME\\b"),
  new RegExp("em\\s+bre" + "ve", "i"),
  new RegExp("a\\s+implemen" + "tar", "i"),
  new RegExp("SAC\\s+sempre\\s+(é|e)\\s+melhor", "i"),
  new RegExp("PRICE\\s+sempre\\s+(é|e)\\s+pior", "i"),
  /\bvocê deveria\b/i,
  /\brendimento garantido\b/i,
];

function slugs(
  items: ReadonlyArray<EducationalContent>,
): ReadonlyArray<string> {
  return items.map((content) => content.slug).sort();
}

function corpus(): string {
  return [
    ...CONTEUDO_NIVEL_1.flatMap((content) => [
      content.title,
      ...content.paragraphs,
      content.disclaimer,
    ]),
    ...CONTEUDO_NIVEL_2.flatMap((content) => [
      content.title,
      ...content.paragraphs,
      content.disclaimer,
    ]),
    ...GLOSSARIO_MINIMO.flatMap((entry) => [
      entry.term,
      entry.shortDefinition,
      entry.fullDefinition,
      entry.example,
    ]),
    ...CUIDADOS_EDUCACIONAIS.flatMap((alert) => [
      alert.title,
      alert.description,
    ]),
  ].join("\n");
}

describe("conteúdo educacional de amortização — estrutura", () => {
  it("Nível 1 cobre amortização, PRICE, SAC e comparação", () => {
    expect(slugs(CONTEUDO_NIVEL_1)).toEqual([...SLUGS_OBRIGATORIOS].sort());
  });

  it("Nível 2 cobre os mesmos temas do Nível 1", () => {
    expect(slugs(CONTEUDO_NIVEL_2)).toEqual([...SLUGS_OBRIGATORIOS].sort());
  });

  it.each([...CONTEUDO_NIVEL_1, ...CONTEUDO_NIVEL_2])(
    "$slug ($level) possui metadados versionáveis e disclaimer",
    (content) => {
      expect(content.slug).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(content.version).toMatch(SEMVER);
      expect(["nivel-1", "nivel-2"]).toContain(content.level);
      expect(content.title.length).toBeGreaterThan(0);
      expect(content.paragraphs.length).toBeGreaterThanOrEqual(4);
      expect(content.disclaimer).toBe(DISCLAIMER_EDUCACIONAL);
    },
  );
});

describe("conteúdo educacional de amortização — cobertura pedagógica", () => {
  it("explica PRICE, SAC e comparação lado a lado", () => {
    const text = corpus();
    expect(text).toMatch(/PRICE/i);
    expect(text).toMatch(/SAC/i);
    expect(text).toMatch(/parcela constante/i);
    expect(text).toMatch(/amortização constante/i);
    expect(text).toMatch(/custo total/i);
    expect(text).toMatch(/total de juros/i);
  });

  it("inclui cuidados educacionais e disclaimer de limites da simulação", () => {
    expect(CUIDADOS_EDUCACIONAIS.length).toBeGreaterThanOrEqual(4);
    expect(DISCLAIMER_EDUCACIONAL).toMatch(/educacional/i);
    expect(DISCLAIMER_EDUCACIONAL).toMatch(/contrato real/i);
    expect(DISCLAIMER_EDUCACIONAL).toMatch(/análise profissional/i);
    expect(corpus()).toMatch(/tarifas, seguros, impostos/i);
  });

  it("não contém conteúdo futuro materializado nem aconselhamento absoluto", () => {
    const text = corpus();
    for (const pattern of PADROES_BLOQUEADOS) {
      expect(text).not.toMatch(pattern);
    }
  });
});

describe("glossário mínimo de amortização", () => {
  it("inclui todos os termos essenciais da F5", () => {
    const presentes = GLOSSARIO_MINIMO.map((entry) => entry.slug).sort();
    expect(presentes).toEqual([...TERMOS_GLOSSARIO_MIN].sort());
  });

  it.each(GLOSSARIO_MINIMO)(
    "termo $slug carrega definição, exemplo e módulo correto",
    (entry: GlossaryEntry) => {
      expect(entry.term.length).toBeGreaterThan(0);
      expect(entry.shortDefinition.length).toBeGreaterThan(20);
      expect(entry.fullDefinition.length).toBeGreaterThan(40);
      expect(entry.example.length).toBeGreaterThan(10);
      expect(entry.relatedModule).toBe("amortization");
    },
  );
});

describe("conteúdo educacional de amortização — coerência com casos canônicos", () => {
  it("Nível 1 cita os valores principais de PR-01 e SAC-01", () => {
    const text = CONTEUDO_NIVEL_1.flatMap((content) => content.paragraphs).join(
      " ",
    );
    expect(text).toContain("R$ 100.000,00");
    expect(text).toContain("R$ 8.884,88");
    expect(text).toContain("R$ 9.333,33");
    expect(text).toContain("R$ 8.416,70");
    expect(text).toContain("R$ 6.618,53");
    expect(text).toContain("R$ 6.500,00");
  });
});
