# F2 - Relatorio de execucao Codex

## Objetivo

Refazer a Sprint 3.5/F2 como transposicao fiel do Financial Cockpit da Claude
para React/Next, preservando services, rotas, testes e governanca do projeto.

## Arquitetura implementada

- `FinancialCockpitShell`: shell global sem sidebar, com topbar de modulos e
  badge de produto educacional.
- `CockpitPrimitives`: primitivas de painel, subtabs, KPIs, inputs, educacao e
  insight.
- `CockpitCharts`: graficos Recharts com tooltip rico.
- `CockpitTables`: tabelas por periodo sem truncamento artificial.
- `CockpitModal`: modal educacional com overlay blur e tabs.
- `InterestCockpit`: Juros Simples, Juros Compostos e Comparar.
- `AmortizationCockpit`: PRICE, SAC e Comparar.

## Decisoes tomadas

- Usar Syne e IBM Plex Mono via `next/font/google`.
- Remover a sidebar do shell operacional.
- Manter rotas existentes.
- Usar valores padrao uteis para carregar resultado inicial.
- Consumir os services existentes para todos os resultados financeiros.
- Usar Recharts em vez de Chart.js/CDN.
- Registrar screenshots versionados para auditoria visual.

## Escopo preservado

Nao houve alteracao em backend, OpenAPI, dominio financeiro, calculos backend,
pipeline, workflows, Prompt-Mestre, planilha, baseline ou
`docs/_meta/living_docs.json`.

## Status

Entrega local, sem push, sem PR e sem merge.
