# ADR-0007 — Erros REST em formato RFC 7807 (application/problem+json)

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Padrão universal e interoperável para erros HTTP.

## Decisão
Toda resposta de erro segue RFC 7807 com type, title, status, detail, instance, code.

## Alternativas consideradas
Formato ad-hoc: inconsistente; GraphQL errors: fora do escopo REST.

## Consequências
Positivas: padrão aceito, fácil de documentar. Negativas: campos extras exigem extensão controlada.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
