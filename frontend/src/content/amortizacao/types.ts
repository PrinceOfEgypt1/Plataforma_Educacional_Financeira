/**
 * Tipos e constantes base do conteúdo educacional de Amortização.
 *
 * O módulo segue o padrão de `frontend/src/content/juros/`, mas mantém tipos
 * próprios para evitar acoplamento entre domínios de conteúdo.
 */

/** Profundidade pedagógica oficial (Doc 08 §10). */
export type ContentLevel = "nivel-1" | "nivel-2";

/** Bloco mínimo de conteúdo educacional. */
export interface EducationalContent {
  readonly slug: string;
  readonly version: string;
  readonly level: ContentLevel;
  readonly title: string;
  /** Parágrafos em prosa. Cada item já vem revisado, sem markdown. */
  readonly paragraphs: ReadonlyArray<string>;
  /** Produto educacional, não consultoria (Doc 08 §6.4). */
  readonly disclaimer: string;
}

/** Termo do glossário mínimo de amortização. */
export interface GlossaryEntry {
  readonly slug: string;
  readonly term: string;
  readonly shortDefinition: string;
  readonly fullDefinition: string;
  readonly example: string;
  readonly relatedModule: "amortization";
}

/** Cuidado educacional exibido na página do módulo. */
export interface EducationalAlert {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly severity: "info" | "warning";
}

export const DISCLAIMER_EDUCACIONAL =
  "Este conteúdo é educacional e ilustrativo. A simulação não substitui " +
  "contrato real, análise profissional ou as condições efetivas de um " +
  "financiamento.";
