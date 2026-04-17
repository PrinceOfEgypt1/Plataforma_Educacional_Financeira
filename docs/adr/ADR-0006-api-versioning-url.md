# ADR-0006 — Versão de API explícita em URL (/api/v1)

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Necessidade de evolução controlada de contratos REST sem quebrar clientes.

## Decisão
Adotar prefixo /api/v{N}; breaking = nova major + manutenção da anterior por >=2 sprints + ADR.

## Alternativas consideradas
Versão em header: menos visível; negociação de conteúdo: complexa; sem versão: arriscado.

## Consequências
Positivas: visibilidade, compatibilidade. Negativas: URLs mudam; clientes precisam migrar.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
