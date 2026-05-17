# Relatório — Item 14F-F1 — FAIL oficial UI/UX do módulo Imóvel

## 1. Resumo executivo

Este relatório registra oficialmente a reprovação UI/UX atual do módulo Financiamento Imobiliário, com base no auditor `audit:uiux`.

A reprovação deixa de ser apenas percepção visual e passa a ser evidência técnica versionada.

## 2. Comando usado

~~~bash
cd frontend
pnpm audit:uiux:contract
pnpm audit:uiux:expect-fail
pnpm --silent audit:uiux:json > ../docs/gates/gate-po-ux-valor/14f/05-fail-oficial-uiux-imovel/EVIDENCIA_AUDITOR_UIUX_IMOVEL_ITEM_14F_F1.json
~~~

## 3. Resultado oficial

O auditor confirma 28 violações.

| Severidade | Quantidade |
|---|---:|
| high | 19 |
| medium | 9 |
| low | 0 |
| total | 28 |

## 4. Códigos detectados

| Código | Quantidade | Causa técnica predominante |
|---|---:|---|
| `UX-DUP-001` | 14 | Duplicidade entre componentes ativos e legados. |
| `UX-DUP-002` | 9 | Legados expostos como ativos sem marcação adequada. |
| `UX-CTA-001` | 2 | CTAs distintos apontando para destino repetido. |
| `UX-CTA-002` | 2 | CTA promete uma coisa e navega para destino genérico. |
| `UX-MOBILE-001` | 1 | Sidebar com largura fixa sem proteção clara de breakpoint. |

## 5. Arquivos envolvidos nas violações

A evidência JSON oficial lista violações em componentes do frontend do módulo Imóvel, principalmente:

- `frontend/src/components/financing/RealEstateFinancingTable.tsx`
- `frontend/src/components/financing/FinanciamentoTable.tsx`
- `frontend/src/components/financing/RealEstateCompareChart.tsx`
- `frontend/src/components/financing/FinanciamentoCompareChart.tsx`
- `frontend/src/components/financing/FinanciamentoSummary.tsx`
- `frontend/src/components/financing/FinanciamentoSaibaMais.tsx`
- `frontend/src/components/financing/RealEstateScenarioSidebar.tsx`
- `frontend/src/components/financing/RealEstateNextStepsZone.tsx`

## 6. Interpretação PO/UX

O módulo Imóvel ainda não possui aceite UI/UX.

A existência de testes verdes e build verde não significa aceite de produto. Neste caso, a aplicação compila, os testes passam, mas o contrato UI/UX ainda aponta violações que impedem aprovação visual e operacional.

## 7. Decisão

O módulo deve permanecer em reprovação UI/UX até que as violações sejam tratadas por correções cirúrgicas.

A correção futura não deve apagar a evidência histórica, alterar o contrato para esconder falhas, nem reduzir contadores artificialmente.

## 8. Próximo passo recomendado

A próxima etapa deve agrupar as 28 violações por causa raiz e transformar o laudo em plano de correção.
