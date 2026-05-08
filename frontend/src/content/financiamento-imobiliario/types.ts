/**
 * Tipos base do conteúdo educacional do módulo Financiamento Imobiliário.
 *
 * Segue o padrão de `frontend/src/content/diagnostico/types.ts`, mantendo
 * tipos próprios para evitar acoplamento entre domínios de conteúdo.
 */

export type ContentLevel = "nivel-1" | "nivel-2";

export interface EducationalContent {
  readonly slug: string;
  readonly version: string;
  readonly level: ContentLevel;
  readonly title: string;
  readonly paragraphs: ReadonlyArray<string>;
  readonly disclaimer: string;
}

export interface GlossaryEntry {
  readonly slug: string;
  readonly term: string;
  readonly shortDefinition: string;
  readonly fullDefinition: string;
  readonly example: string;
  readonly relatedModule: "financing";
}

/**
 * Aviso educacional obrigatório do módulo Financiamento Imobiliário.
 *
 * Deve aparecer em qualquer superfície que exiba resultados de simulação.
 * Pode ter redação ajustada, mas não pode ter o sentido removido.
 */
export const DISCLAIMER_FINANCIAMENTO =
  "Esta simulação é educacional. Ela ajuda você a entender a lógica de um " +
  "financiamento imobiliário, mas não substitui proposta bancária, contrato, " +
  "CET oficial, análise jurídica, análise profissional ou orientação " +
  "financeira individualizada.";
