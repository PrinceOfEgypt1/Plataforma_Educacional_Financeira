# ADR-0005 — Organização por domínio no backend

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Manter fronteiras claras entre domínios financeiros (interest, amortization, ...).

## Decisão
Estrutura app/domain/<dominio>/, app/services/<dominio>/, app/api/<dominio>.py, app/schemas/<dominio>.py. Domínio A não importa domínio B sem ADR.

## Alternativas consideradas
Organização por tipo de arquivo: dificulta evolução; Monólito sem fronteiras: acopla tudo; Microservices: prematuro.

## Consequências
Positivas: manutenção, testabilidade, evolução. Negativas: disciplina de fronteiras exige governança.

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
