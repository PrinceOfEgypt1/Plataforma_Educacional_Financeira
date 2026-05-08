/**
 * Testes do conteúdo educacional estático do módulo Diagnóstico Financeiro.
 *
 * Validam estrutura versionável, cobertura mínima dos conceitos obrigatórios,
 * glossário, alertas educacionais e ausência de conteúdo proibido (promessas
 * financeiras, linguagem de consultoria individualizada, placeholders).
 */
import { describe, expect, it } from "vitest";

import {
  ALERTAS_EDUCACIONAIS,
  CONTEUDO_NIVEL_1,
  CONTEUDO_NIVEL_2,
  DISCLAIMER_DIAGNOSTICO,
  GLOSSARIO_MINIMO,
  getAlertaEducacional,
  type AlertEducationalContent,
  type EducationalContent,
  type GlossaryEntry,
} from "@/content/diagnostico";

const SEMVER = /^\d+\.\d+\.\d+$/;

const SLUGS_NIVEL_1 = [
  "diagnostico-financeiro",
  "despesas-fixas-variaveis",
  "dividas-mensais",
  "reserva-emergencia",
  "sobra-saude-financeira",
] as const;

const SLUGS_NIVEL_2 = [
  "diagnostico-financeiro",
  "dividas-mensais",
  "despesas-fixas-variaveis",
  "reserva-emergencia",
  "sobra-saude-financeira",
] as const;

const TERMOS_GLOSSARIO_OBRIGATORIOS = [
  "renda-mensal",
  "despesa-fixa",
  "despesa-variavel",
  "divida-mensal",
  "reserva-emergencia",
  "sobra-mensal",
  "comprometimento-renda",
  "score-financeiro",
  "alerta-critico",
  "alerta-atencao",
  "saude-financeira",
  "diagnostico-financeiro",
] as const;

const CODIGOS_ALERTA_OBRIGATORIOS = [
  "COMPROMETIMENTO_CRITICO",
  "COMPROMETIMENTO_ALTO",
  "RESERVA_CRITICA",
  "RESERVA_INSUFICIENTE",
  "SOBRA_NEGATIVA",
  "SOBRA_MINIMA",
] as const;

const PADROES_PROIBIDOS = [
  new RegExp("place" + "holder", "i"),
  new RegExp("\\bTO" + "DO\\b"),
  new RegExp("\\bFIX" + "ME\\b"),
  new RegExp("em\\s+bre" + "ve", "i"),
  new RegExp("a\\s+implemen" + "tar", "i"),
  /\bgarantimos\b/i,
  /\bgarantido\b/i,
  /\bvocê deveria\b/i,
  /\bvocê deve\b/i,
  /\brecomendamos\b/i,
  /\binvista em\b/i,
  /\bcontrate\b/i,
  /\brendimento garantido\b/i,
  /\bretorno garantido\b/i,
];

function slugsOf(
  items: ReadonlyArray<EducationalContent>,
): ReadonlyArray<string> {
  return items.map((c) => c.slug).sort();
}

function corpusConteudo(): string {
  return [
    ...CONTEUDO_NIVEL_1.flatMap((c) => [
      c.title,
      ...c.paragraphs,
      c.disclaimer,
    ]),
    ...CONTEUDO_NIVEL_2.flatMap((c) => [
      c.title,
      ...c.paragraphs,
      c.disclaimer,
    ]),
    ...GLOSSARIO_MINIMO.flatMap((e) => [
      e.term,
      e.shortDefinition,
      e.fullDefinition,
      e.example,
    ]),
    ...ALERTAS_EDUCACIONAIS.flatMap((a) => [
      a.title,
      a.explanation,
      a.whyItMatters,
      a.pedagogicalNote,
    ]),
    DISCLAIMER_DIAGNOSTICO,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Estrutura do conteúdo
// ---------------------------------------------------------------------------
describe("conteúdo educacional do diagnóstico — estrutura", () => {
  it("Nível 1 cobre os cinco temas obrigatórios", () => {
    expect(slugsOf(CONTEUDO_NIVEL_1)).toEqual([...SLUGS_NIVEL_1].sort());
  });

  it("Nível 2 cobre os mesmos temas do Nível 1", () => {
    expect(slugsOf(CONTEUDO_NIVEL_2)).toEqual([...SLUGS_NIVEL_2].sort());
  });

  it.each([...CONTEUDO_NIVEL_1, ...CONTEUDO_NIVEL_2])(
    "$slug ($level) tem metadados versionáveis, título e disclaimer",
    (content: EducationalContent) => {
      expect(content.slug).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(content.version).toMatch(SEMVER);
      expect(["nivel-1", "nivel-2"]).toContain(content.level);
      expect(content.title.length).toBeGreaterThan(0);
      expect(content.paragraphs.length).toBeGreaterThanOrEqual(4);
      expect(content.disclaimer).toBe(DISCLAIMER_DIAGNOSTICO);
    },
  );
});

// ---------------------------------------------------------------------------
// Cobertura pedagógica — Nível 1
// ---------------------------------------------------------------------------
describe("conteúdo educacional do diagnóstico — cobertura Nível 1", () => {
  it("explica o que é diagnóstico financeiro", () => {
    const text = CONTEUDO_NIVEL_1.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/diagnóstico financeiro/i);
    expect(text).toMatch(/renda.+não.+(garante|mostra)/i);
  });

  it("explica despesas fixas e variáveis", () => {
    const text = CONTEUDO_NIVEL_1.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/despesas fixas/i);
    expect(text).toMatch(/despesas variáveis/i);
  });

  it("explica dívidas mensais e comprometimento de renda", () => {
    const text = CONTEUDO_NIVEL_1.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/dívidas mensais/i);
    expect(text).toMatch(/comprometimento/i);
  });

  it("explica reserva de emergência em meses", () => {
    const text = CONTEUDO_NIVEL_1.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/reserva de emergência/i);
    expect(text).toMatch(/meses/i);
  });

  it("explica sobra mensal", () => {
    const text = CONTEUDO_NIVEL_1.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/sobra mensal/i);
  });

  it("menciona os níveis de saúde financeira", () => {
    const text = CONTEUDO_NIVEL_1.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/saúde financeira/i);
    expect(text).toMatch(/críti/i);
  });
});

// ---------------------------------------------------------------------------
// Cobertura pedagógica — Nível 2
// ---------------------------------------------------------------------------
describe("conteúdo educacional do diagnóstico — cobertura Nível 2", () => {
  it("explica relação entre renda, despesas, dívidas e reserva", () => {
    const text = CONTEUDO_NIVEL_2.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/renda.+despesas/i);
    expect(text).toMatch(/reserva/i);
  });

  it("explica por que dívida alta pressiona o orçamento", () => {
    const text = CONTEUDO_NIVEL_2.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/dívida.*(pressiona|reduz|restringe)/i);
  });

  it("explica reserva em meses vs valor absoluto", () => {
    const text = CONTEUDO_NIVEL_2.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/meses/i);
    expect(text).toMatch(/reais/i);
  });

  it("diferencia ganhar bem de ter equilíbrio financeiro", () => {
    const text = CONTEUDO_NIVEL_2.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/equilíbrio financeiro/i);
    expect(text).toMatch(/renda alta/i);
  });

  it("explica sobra negativa como sinal crítico", () => {
    const text = CONTEUDO_NIVEL_2.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/sobra.+negativa/i);
  });

  it("explica score e alertas sem linguagem de recomendação", () => {
    const text = CONTEUDO_NIVEL_2.map((c) => c.paragraphs.join(" ")).join("\n");
    expect(text).toMatch(/score/i);
    expect(text).toMatch(/alertas/i);
    expect(text).not.toMatch(/\bvocê deve\b/i);
    expect(text).not.toMatch(/\brecomendamos\b/i);
  });
});

// ---------------------------------------------------------------------------
// Disclaimer obrigatório
// ---------------------------------------------------------------------------
describe("disclaimer educacional do diagnóstico", () => {
  it("existe e menciona caráter educacional e ausência de garantia", () => {
    expect(DISCLAIMER_DIAGNOSTICO).toMatch(/educacional/i);
    expect(DISCLAIMER_DIAGNOSTICO).toMatch(/não substitui/i);
    expect(DISCLAIMER_DIAGNOSTICO).toMatch(/análise profissional/i);
    expect(DISCLAIMER_DIAGNOSTICO).toMatch(/garante resultado/i);
    expect(DISCLAIMER_DIAGNOSTICO).toMatch(/resultado financeiro/i);
  });
});

// ---------------------------------------------------------------------------
// Glossário
// ---------------------------------------------------------------------------
describe("glossário mínimo do diagnóstico", () => {
  it("contém todos os termos obrigatórios", () => {
    const slugsPresentes = GLOSSARIO_MINIMO.map((e) => e.slug).sort();
    expect(slugsPresentes).toEqual([...TERMOS_GLOSSARIO_OBRIGATORIOS].sort());
  });

  it.each(GLOSSARIO_MINIMO)(
    "termo $slug tem definição, exemplo e módulo correto",
    (entry: GlossaryEntry) => {
      expect(entry.term.length).toBeGreaterThan(0);
      expect(entry.shortDefinition.length).toBeGreaterThan(10);
      expect(entry.fullDefinition.length).toBeGreaterThan(40);
      expect(entry.example.length).toBeGreaterThan(10);
      expect(entry.relatedModule).toBe("diagnostic");
    },
  );
});

// ---------------------------------------------------------------------------
// Alertas educacionais
// ---------------------------------------------------------------------------
describe("alertas educacionais do diagnóstico", () => {
  it("cobre todos os códigos de alerta obrigatórios", () => {
    const codigosPresentes = ALERTAS_EDUCACIONAIS.map((a) => a.code).sort();
    expect(codigosPresentes).toEqual([...CODIGOS_ALERTA_OBRIGATORIOS].sort());
  });

  it.each(ALERTAS_EDUCACIONAIS)(
    "alerta $code tem título, explicação, importância e nota pedagógica",
    (alerta: AlertEducationalContent) => {
      expect(alerta.code).toMatch(/^[A-Z][A-Z0-9_]+$/);
      expect(alerta.title.length).toBeGreaterThan(5);
      expect(alerta.explanation.length).toBeGreaterThan(30);
      expect(alerta.whyItMatters.length).toBeGreaterThan(30);
      expect(alerta.pedagogicalNote.length).toBeGreaterThan(30);
    },
  );

  it("função getAlertaEducacional retorna conteúdo para código existente", () => {
    const resultado = getAlertaEducacional("SOBRA_NEGATIVA");
    expect(resultado).toBeDefined();
    expect(resultado?.code).toBe("SOBRA_NEGATIVA");
  });

  it("função getAlertaEducacional retorna undefined para código desconhecido", () => {
    const resultado = getAlertaEducacional("CODIGO_INEXISTENTE");
    expect(resultado).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Lint pedagógico — conteúdo proibido
// ---------------------------------------------------------------------------
describe("conteúdo educacional do diagnóstico — ausência de conteúdo proibido", () => {
  it("não contém placeholder, TODO, FIXME ou 'em breve'", () => {
    const text = corpusConteudo();
    const proibidosMeta = [
      new RegExp("place" + "holder", "i"),
      new RegExp("\\bTO" + "DO\\b"),
      new RegExp("\\bFIX" + "ME\\b"),
      new RegExp("em\\s+bre" + "ve", "i"),
    ];
    for (const pattern of proibidosMeta) {
      expect(text).not.toMatch(pattern);
    }
  });

  it("não contém promessa de resultado financeiro", () => {
    const text = corpusConteudo();
    const proibidosFinanceiros = [
      /\bgarantido\b/i,
      /\bgarantimos\b/i,
      /\bretorno garantido\b/i,
      /\brendimento garantido\b/i,
    ];
    for (const pattern of proibidosFinanceiros) {
      expect(text).not.toMatch(pattern);
    }
  });

  it("não usa linguagem de consultoria individualizada", () => {
    const text = corpusConteudo();
    const proibidosConsultoria = [
      /\bvocê deve\b/i,
      /\bvocê deveria\b/i,
      /\brecomendamos\b/i,
    ];
    for (const pattern of proibidosConsultoria) {
      expect(text).not.toMatch(pattern);
    }
  });

  it("não contém nenhum dos padrões proibidos completos", () => {
    const text = corpusConteudo();
    for (const pattern of PADROES_PROIBIDOS) {
      expect(text).not.toMatch(pattern);
    }
  });
});
