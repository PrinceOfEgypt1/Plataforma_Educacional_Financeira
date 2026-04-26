/**
 * Conteúdo educacional do módulo de Juros (Sprint 2 — F5).
 *
 * Barrel de re-exportação. Tipos e constantes base ficam em `types.ts`
 * para evitar ciclo de importação entre este arquivo e os módulos de
 * conteúdo (`nivel-1.ts`, `nivel-2.ts`, `glossario.ts`).
 */

export type { ContentLevel, EducationalContent, GlossaryEntry } from "./types";
export { DISCLAIMER_EDUCACIONAL } from "./types";

export { CONTEUDO_NIVEL_1 } from "./nivel-1";
export { CONTEUDO_NIVEL_2 } from "./nivel-2";
export { GLOSSARIO_MINIMO } from "./glossario";
