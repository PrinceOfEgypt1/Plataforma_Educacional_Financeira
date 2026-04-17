# ADR-0008 — Trunk-based + squash merge

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Manter histórico linear e feedback loop rápido.

## Decisão
main protegida; branches curtas (<=5 dias); squash merge; sem force push em main.

## Alternativas consideradas
Git-flow: excesso de branches; rebase merge: preserva histórico mas complica revisão.

## Consequências
Positivas: simplicidade, histórico limpo. Negativas: exige disciplina para PRs pequenas.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
