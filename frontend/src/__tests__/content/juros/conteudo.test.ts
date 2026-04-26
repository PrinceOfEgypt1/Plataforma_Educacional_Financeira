/**
 * Testes do conteúdo educacional estático do módulo de Juros.
 *
 * Validam invariantes editoriais (Doc 08 §6, §10, §13) que devem ser
 * verdade para qualquer texto presente em `frontend/src/content/juros/`:
 *
 *   - presença e formato dos campos versionáveis (slug, version, level);
 *   - cobertura mínima dos quatro temas obrigatórios da F5
 *     (juros simples, juros compostos, comparação, aportes);
 *   - ausência de termos proibidos (promessa, moralismo, placeholder);
 *   - presença do disclaimer educacional;
 *   - glossário cobre os termos exigidos pelo PLANO Sprint 2 §5.5.
 *
 * Este teste roda no mesmo `vitest` do frontend e é o substituto
 * runtime ao lint pedagógico estático (`tools/edu_lint/edu_lint.py`),
 * que cobre o mesmo universo de regras a partir do filesystem.
 */
import { describe, it, expect } from "vitest";

import {
  CONTEUDO_NIVEL_1,
  CONTEUDO_NIVEL_2,
  GLOSSARIO_MINIMO,
  DISCLAIMER_EDUCACIONAL,
  type EducationalContent,
  type GlossaryEntry,
} from "@/content/juros";

const SEMVER = /^\d+\.\d+\.\d+$/;
const SLUG_OBRIGATORIOS = [
  "juros-simples",
  "juros-compostos",
  "comparacao-juros",
  "aportes-mensais",
] as const;

// Termos que disparam bloqueio editorial (Doc 08 §20).
const TERMOS_PROIBIDOS = [
  /vai render/i,
  /\brendimento garantido\b/i,
  /\bobviamente\b/i,
  /\bvocê deveria\b/i,
  /\beh irresponsável\b/i,
  /\bé irresponsável\b/i,
  /lorem ipsum/i,
  /\bplaceholder\b/i,
  /\bTODO\b/,
  /\bFIXME\b/,
];

const TERMOS_GLOSSARIO_MIN = [
  "juros",
  "juros-simples",
  "juros-compostos",
  "principal",
  "taxa",
  "prazo",
  "montante",
  "aporte",
] as const;

function allParagraphs(items: ReadonlyArray<EducationalContent>): string {
  return items.flatMap((c) => c.paragraphs).join("\n");
}

describe("conteúdo educacional — invariantes estruturais", () => {
  it("Nível 1 cobre os quatro temas obrigatórios da F5", () => {
    const slugs = CONTEUDO_NIVEL_1.map((c) => c.slug).sort();
    expect(slugs).toEqual([...SLUG_OBRIGATORIOS].sort());
  });

  it("Nível 2 cobre os mesmos quatro temas obrigatórios", () => {
    const slugs = CONTEUDO_NIVEL_2.map((c) => c.slug).sort();
    expect(slugs).toEqual([...SLUG_OBRIGATORIOS].sort());
  });

  it.each([...CONTEUDO_NIVEL_1, ...CONTEUDO_NIVEL_2])(
    "$slug ($level) carrega slug, version semver e level corretos",
    (content) => {
      expect(content.slug).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(content.version).toMatch(SEMVER);
      expect(["nivel-1", "nivel-2"]).toContain(content.level);
      expect(content.title.length).toBeGreaterThan(0);
      expect(content.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(content.disclaimer).toBe(DISCLAIMER_EDUCACIONAL);
    },
  );
});

describe("conteúdo educacional — política editorial (Doc 08 §6, §20)", () => {
  it("nenhum parágrafo contém termos editorialmente proibidos", () => {
    const corpus =
      allParagraphs(CONTEUDO_NIVEL_1) + "\n" + allParagraphs(CONTEUDO_NIVEL_2);
    for (const padrao of TERMOS_PROIBIDOS) {
      expect(corpus).not.toMatch(padrao);
    }
  });

  it("nenhum parágrafo está vazio", () => {
    for (const c of [...CONTEUDO_NIVEL_1, ...CONTEUDO_NIVEL_2]) {
      for (const p of c.paragraphs) {
        expect(p.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("disclaimer cita 'educacional' e 'consultoria'", () => {
    expect(DISCLAIMER_EDUCACIONAL).toMatch(/educacional/i);
    expect(DISCLAIMER_EDUCACIONAL).toMatch(/consultoria/i);
  });
});

describe("glossário mínimo — cobertura exigida pelo PLANO Sprint 2 §5.5", () => {
  it("inclui todos os termos mínimos exigidos", () => {
    const slugsPresentes = GLOSSARIO_MINIMO.map(
      (g: GlossaryEntry) => g.slug,
    ).sort();
    const esperado = [...TERMOS_GLOSSARIO_MIN].sort();
    expect(slugsPresentes).toEqual(esperado);
  });

  it.each(GLOSSARIO_MINIMO)(
    "termo $slug carrega definição curta, completa e exemplo",
    (entry) => {
      expect(entry.term.length).toBeGreaterThan(0);
      expect(entry.shortDefinition.length).toBeGreaterThan(20);
      expect(entry.fullDefinition.length).toBeGreaterThan(40);
      expect(entry.example.length).toBeGreaterThan(10);
      expect(entry.relatedModule).toBe("interest");
    },
  );
});

describe("conteúdo educacional — coerência numérica com Doc 15", () => {
  it("texto de juros simples Nível 1 cita os números de JS-01", () => {
    const c = CONTEUDO_NIVEL_1.find((x) => x.slug === "juros-simples");
    expect(c).toBeDefined();
    const corpus = (c?.paragraphs ?? []).join(" ");
    expect(corpus).toContain("1.000,00");
    expect(corpus).toContain("1.120,00");
    expect(corpus).toContain("12 meses");
  });

  it("texto de juros compostos Nível 1 cita os números de JC-01", () => {
    const c = CONTEUDO_NIVEL_1.find((x) => x.slug === "juros-compostos");
    expect(c).toBeDefined();
    const corpus = (c?.paragraphs ?? []).join(" ");
    expect(corpus).toContain("1.000,00");
    expect(corpus).toContain("1.126,83");
    expect(corpus).toContain("12 meses");
  });
});
