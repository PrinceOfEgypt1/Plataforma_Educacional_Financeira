# ADR-0012 — Tailwind CSS + tokens do Doc 16

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Manter UI consistente e guiada por design system.

## Decisão
Tailwind como utilitário; tokens do Doc 16 gerados em frontend/styles/tokens.{ts,css}. Sem cor/tipografia ad-hoc.

## Alternativas consideradas
CSS-in-JS: runtime overhead; CSS puro: escala difícil; UI lib completa: opinativa demais.

## Consequências
Positivas: rapidez, consistência. Negativas: classes utilitárias podem poluir JSX (mitigável por extração).

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
