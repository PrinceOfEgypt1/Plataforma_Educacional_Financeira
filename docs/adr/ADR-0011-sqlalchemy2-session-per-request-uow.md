# ADR-0011 — SQLAlchemy 2.0 + sessão por request + unit of work

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Gerenciar transações de forma previsível.

## Decisão
Sessão criada por request via FastAPI Depends; services usam context manager (with uow:) para múltiplas escritas.

## Alternativas consideradas
Sessão global: concorrência perigosa; sessão por função: overhead.

## Consequências
Positivas: isolamento, transações explícitas. Negativas: curva de aprendizado do SA 2.0.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
