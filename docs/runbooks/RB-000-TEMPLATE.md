# RB-000 — TEMPLATE DE RUNBOOK

> Copie este arquivo como `RB-XXX-<slug>.md` e preencha cada seção. Referência conceitual em `docs/24_Runbooks.md`.

## Sintoma
Descrição objetiva e observável do problema (evento, métrica, alerta).

## Hipótese mais provável
Causa raiz mais comum desse sintoma; mencionar evidências passadas (post-mortems).

## Verificações
1. Executar `make healthcheck`.
2. Consultar dashboard de observabilidade (ver `docs/23_Observabilidade.md`).
3. Conferir logs no período do alerta.
4. …

## Mitigação (imediata — reduz impacto)
1. Etapa 1…
2. Etapa 2…

## Resolução (definitiva)
1. Etapa 1…
2. Etapa 2…

## Pós-incidente
- Post-mortem em ≤ 48h.
- Novo alerta/teste de regressão se aplicável.
- Atualização deste runbook com lições aprendidas.

## Histórico de revisões
- AAAA-MM-DD — criação.
