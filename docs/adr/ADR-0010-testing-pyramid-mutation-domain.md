# ADR-0010 — Pirâmide de testes com mutação semanal no domínio

- **Status:** accepted
- **Data:** 2026-04-14
- **Autoria:** Auditoria de Fundação (Prompt 1)

## Contexto
Assegurar qualidade real dos testes do núcleo matemático.

## Decisão
Muitos unit; médios integration/contract; poucos E2E. Mutação semanal (mutmut) em app/domain/ com score >=80%.

## Alternativas consideradas
Sem mutação: cobertura pode ser inflada; mutação em toda base: custosa.

## Consequências
Positivas: rigor onde importa. Negativas: tempo de CI para mutação (só semanal).

## Impacto em documentos
Ver referências cruzadas em `docs/04_Arquitetura_de_Software.md` e documentos vivos correlatos.

## Métricas de validação
Cobertura por testes da Estratégia §4, SLOs do Doc 23 quando aplicáveis, checklist Doc 25 por release.

## Revisão programada
Em cada gatilho de rebaseline do Doc 11 (Prompt-Mestre) ou em caso de incidente correlato.
