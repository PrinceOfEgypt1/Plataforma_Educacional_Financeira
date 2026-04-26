/**
 * Tipos e constantes base do conteúdo educacional de Juros.
 *
 * Este arquivo não importa os módulos de conteúdo. Ele existe para evitar
 * dependência circular entre o barrel `index.ts` e os arquivos `nivel-1.ts`,
 * `nivel-2.ts` e `glossario.ts` durante o build de produção do Next.js.
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
  /** "produto educacional, não consultoria" (Doc 08 §6.4). */
  readonly disclaimer: string;
}

/** Termo do glossário mínimo (Doc 08 §13). */
export interface GlossaryEntry {
  readonly slug: string;
  readonly term: string;
  readonly shortDefinition: string;
  readonly fullDefinition: string;
  readonly example: string;
  readonly relatedModule: string;
}

export const DISCLAIMER_EDUCACIONAL =
  "Este conteúdo é educacional e ilustrativo. Não substitui consultoria " +
  "financeira individual. Os valores referenciados acompanham a massa de " +
  "validação oficial do Doc 15.";
