# ADR-0001 — Frontend em Next.js + React + TypeScript

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Necessidade de frontend moderno, com SSR/SSG opcional, tipagem forte e bom ecossistema.

## Decisão
Adotar Next.js 14+ (App Router), React 18+, TypeScript 5+ estrito.

## Alternativas consideradas
Outras SPAs (Vite+React puro): menor suporte a SSR; Angular: curva maior e overhead; SvelteKit: ecossistema menor.

## Consequências
Positivas: SSR/SSG, ecossistema rico, tipagem forte. Negativas: framework opinativo, custo de aprendizagem do App Router.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
