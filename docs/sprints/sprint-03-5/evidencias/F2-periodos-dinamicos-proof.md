# Sprint 3.5/F2 — Prova de períodos dinâmicos

## Objetivo

Provar que tabelas e gráficos não estão limitados artificialmente a 12 períodos.

## Implementação

Arquivos envolvidos:

- `frontend/src/components/ui/cockpit/CockpitTables.tsx`
- `frontend/src/components/ui/cockpit/CockpitCharts.tsx`
- `frontend/src/components/amortization/AmortizationCockpit.tsx`
- `frontend/src/components/interest/InterestCockpit.tsx`

Tabelas:

- `InterestSimpleTable` renderiza `rows.map(...)`;
- `InterestCompoundTable` renderiza `rows.map(...)`;
- `AmortizationCockpitTable` renderiza `rows.map(...)`;
- `AmortizationCompareTable` usa o maior comprimento entre PRICE e SAC e renderiza uma linha por índice real.

Gráficos:

- `buildInterestChartData` usa o maior comprimento das séries retornadas pelo service/API;
- `buildAmortizationRowsChartData` usa todos os rows recebidos;
- `buildAmortizationCompareChartData` usa o maior comprimento das séries retornadas pelo service/API.

## Testes adicionados

Arquivo:

- `frontend/src/__tests__/components/cockpitDynamicData.test.tsx`

Casos:

- Juros simples prazo 24 → 24 linhas;
- Juros compostos prazo 24 → 24 linhas;
- PRICE/SAC prazo 60 → 60 linhas;
- Comparar amortização prazo 60 → 60 linhas;
- Juros prazo 24 → 24 pontos de gráfico;
- PRICE/SAC prazo 60 → 60 pontos de gráfico;
- Comparar amortização prazo 60 → 60 pontos de gráfico.

## Grep obrigatório

O grep de truncamento retorna apenas fixtures/testes com `12` e exemplos educativos canônicos. Não há `slice(0, 12)`, hardcode de 12 linhas nem truncamento artificial no cockpit.

Ocorrências relevantes:

```text
frontend/src/__tests__/services/amortization/amortizationService.test.ts:* n_periodos: 12
frontend/src/__tests__/app/routes.test.tsx:* n_periodos: 12
frontend/src/__tests__/app/amortizacao.test.tsx:* n_periodos: 12
frontend/src/content/amortizacao/glossario.ts:42: "Prazo de 12 períodos gera 12 linhas na tabela."
```

Interpretação: essas ocorrências são fixtures, casos canônicos ou testes legados. A prova dinâmica de 24/60 períodos está coberta no novo teste.
