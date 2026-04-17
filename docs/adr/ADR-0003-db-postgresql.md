# ADR-0003 — PostgreSQL como banco oficial

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Necessidade de SGBD relacional maduro, com JSONB, constraints fortes e ecossistema cloud.

## Decisão
Adotar PostgreSQL 15+.

## Alternativas consideradas
MySQL: OK, mas JSONB menos maduro; SQLite: insuficiente para produção; NoSQL: inadequado para dados relacionais do domínio.

## Consequências
Positivas: JSONB, constraints, extensões. Negativas: operação mais exigente que SQLite.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
