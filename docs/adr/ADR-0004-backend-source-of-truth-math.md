# ADR-0004 — Backend é fonte única da verdade matemática

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Evitar divergência entre frontend e backend em cálculos financeiros.

## Decisão
Toda fórmula autoritativa vive em backend/app/domain/. Frontend apenas formata/apresenta.

## Alternativas consideradas
Lógica duplicada FE+BE: inevitavelmente diverge; Lógica só no FE: insegura e não testável com rigor.

## Consequências
Positivas: consistência, auditabilidade, regressão controlada. Negativas: ida ao servidor para cada cálculo (mitigável por cache).

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
