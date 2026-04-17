# ADR-0002 — Backend em Python 3.11+ / FastAPI

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Domínio financeiro com ênfase em clareza matemática e validação de contrato.

## Decisão
Adotar Python 3.11+ com FastAPI + Pydantic v2 + SQLAlchemy 2.0.

## Alternativas consideradas
Node/NestJS: bom, mas Python facilita expressão matemática; Go: performance superior mas verbose; Django: monolítico demais.

## Consequências
Positivas: OpenAPI automático, Pydantic, ecossistema científico. Negativas: performance inferior a Go.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
