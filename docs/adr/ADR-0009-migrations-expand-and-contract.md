# ADR-0009 — Migrations expand-and-contract reversíveis

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Evitar downtime e permitir rollback em mudanças de schema.

## Decisão
Toda migration tem upgrade+downgrade; mudança destrutiva em 4 PRs (expand/backfill/read-switch/contract).

## Alternativas consideradas
DROP direto: arriscado; migrations irreversíveis: impedem rollback.

## Consequências
Positivas: segurança, reversibilidade. Negativas: mais PRs para mudanças grandes.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
