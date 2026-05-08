/**
 * Tipos base do conteúdo educacional do módulo Diagnóstico Financeiro.
 *
 * Segue o padrão de `frontend/src/content/amortizacao/types.ts`, mas mantém
 * tipos próprios para evitar acoplamento entre domínios de conteúdo.
 */

/** Profundidade pedagógica (Doc 08 §10). */
export type ContentLevel = "nivel-1" | "nivel-2";

/** Bloco mínimo de conteúdo educacional. */
export interface EducationalContent {
  readonly slug: string;
  readonly version: string;
  readonly level: ContentLevel;
  readonly title: string;
  /** Parágrafos em prosa, sem markdown, já revisados. */
  readonly paragraphs: ReadonlyArray<string>;
  /** Produto educacional, não consultoria (Doc 08 §6.4). */
  readonly disclaimer: string;
}

/** Termo do glossário mínimo de diagnóstico financeiro. */
export interface GlossaryEntry {
  readonly slug: string;
  readonly term: string;
  readonly shortDefinition: string;
  readonly fullDefinition: string;
  readonly example: string;
  readonly relatedModule: "diagnostic";
}

/**
 * Conteúdo educacional para um código de alerta do diagnóstico.
 *
 * Os códigos são gerados pelo backend em UPPER_SNAKE_CASE e nunca
 * recalculados no frontend.
 */
export interface AlertEducationalContent {
  readonly code: string;
  readonly title: string;
  readonly explanation: string;
  readonly whyItMatters: string;
  readonly pedagogicalNote: string;
}

/**
 * Aviso educacional obrigatório (Doc 08 §6.4 / RF-DIAG-001).
 *
 * Deve aparecer em qualquer superfície que exiba resultados do diagnóstico.
 * Pode ter redação ajustada, mas não pode ter o sentido removido.
 */
export const DISCLAIMER_DIAGNOSTICO =
  "Este diagnóstico é educacional. Ele ajuda você a entender sinais da sua " +
  "vida financeira, mas não substitui análise profissional nem garante " +
  "resultado financeiro.";
