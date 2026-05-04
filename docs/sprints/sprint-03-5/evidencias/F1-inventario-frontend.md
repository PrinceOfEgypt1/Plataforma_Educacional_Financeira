# Sprint 3.5/F1 - Evidencia inventario frontend

Data: 2026-05-03
Branch: `sprint-3.5/f1-uiux-diagnostico-plano-codex`

## 1. App tree

Comando:

```bash
find frontend/src/app -maxdepth 4 -type f | sort
```

Saida real:

```text
frontend/src/app/(app)/amortizacao/page.tsx
frontend/src/app/(app)/atraso/page.tsx
frontend/src/app/(app)/cartao-rotativo/page.tsx
frontend/src/app/(app)/cdc/page.tsx
frontend/src/app/(app)/consignado/page.tsx
frontend/src/app/(app)/diagnostico/page.tsx
frontend/src/app/(app)/educacao/page.tsx
frontend/src/app/(app)/financiamento-imobiliario/page.tsx
frontend/src/app/(app)/financiamento-veiculo/page.tsx
frontend/src/app/(app)/indicadores/page.tsx
frontend/src/app/(app)/investir-vs-quitar/page.tsx
frontend/src/app/(app)/juros/page.tsx
frontend/src/app/(app)/layout.tsx
frontend/src/app/(app)/page.tsx
frontend/src/app/globals.css
frontend/src/app/layout.tsx
```

## 2. Components tree

Comando:

```bash
find frontend/src/components -maxdepth 5 -type f | sort
```

Saida real:

```text
frontend/src/components/amortization/AmortizacaoAlerts.tsx
frontend/src/components/amortization/AmortizacaoForm.tsx
frontend/src/components/amortization/AmortizacaoInterpretation.tsx
frontend/src/components/amortization/AmortizacaoSaibaMais.tsx
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx
frontend/src/components/amortization/AmortizacaoSummary.tsx
frontend/src/components/amortization/AmortizacaoTable.tsx
frontend/src/components/amortization/AmortizacaoTabs.tsx
frontend/src/components/amortization/ComparePanel.tsx
frontend/src/components/amortization/PricePanel.tsx
frontend/src/components/amortization/SacPanel.tsx
frontend/src/components/amortization/formPrimitives.tsx
frontend/src/components/amortization/formValidation.ts
frontend/src/components/amortization/simulationState.ts
frontend/src/components/interest/AmortizacaoTables.tsx
frontend/src/components/interest/CompararJurosForm.tsx
frontend/src/components/interest/CompararJurosPanel.tsx
frontend/src/components/interest/EvolucaoSaldoChart.tsx
frontend/src/components/interest/JurosAlerts.tsx
frontend/src/components/interest/JurosCompostosForm.tsx
frontend/src/components/interest/JurosCompostosPanel.tsx
frontend/src/components/interest/JurosInterpretation.tsx
frontend/src/components/interest/JurosSaibaMais.tsx
frontend/src/components/interest/JurosSimplesForm.tsx
frontend/src/components/interest/JurosSimplesPanel.tsx
frontend/src/components/interest/JurosSimulationState.ts
frontend/src/components/interest/JurosTabs.tsx
frontend/src/components/interest/SummaryGrid.tsx
frontend/src/components/interest/formPrimitives.tsx
frontend/src/components/interest/formValidation.ts
frontend/src/components/interest/index.ts
frontend/src/components/shell/EducationalNotice.tsx
frontend/src/components/shell/Header.tsx
frontend/src/components/shell/ModulePage.tsx
frontend/src/components/shell/NavItem.tsx
frontend/src/components/shell/ShellLayout.tsx
frontend/src/components/shell/Sidebar.tsx
frontend/src/components/states/EmptyState.tsx
frontend/src/components/states/ErrorState.tsx
frontend/src/components/states/LoadingState.tsx
frontend/src/components/states/index.ts
frontend/src/components/ui/AlertBanner.tsx
frontend/src/components/ui/EducationPanel.tsx
frontend/src/components/ui/FormSection.tsx
frontend/src/components/ui/SummaryCard.tsx
frontend/src/components/ui/index.ts
```

## 3. Styles tree

Comando:

```bash
find frontend/src/styles -maxdepth 4 -type f | sort
```

Saida real:

```text
frontend/src/styles/tokens.css
frontend/src/styles/tokens.ts
```

## 4. Content tree

Comando:

```bash
find frontend/src/content -maxdepth 5 -type f | sort
```

Saida real:

```text
frontend/src/content/amortizacao/alertas.ts
frontend/src/content/amortizacao/glossario.ts
frontend/src/content/amortizacao/index.ts
frontend/src/content/amortizacao/nivel-1.ts
frontend/src/content/amortizacao/nivel-2.ts
frontend/src/content/amortizacao/types.ts
frontend/src/content/juros/glossario.ts
frontend/src/content/juros/index.ts
frontend/src/content/juros/nivel-1.ts
frontend/src/content/juros/nivel-2.ts
frontend/src/content/juros/types.ts
```

## 5. Tests frontend

Comando:

```bash
find frontend/src -path '*__tests__*' -type f | sort
```

Saida real:

```text
frontend/src/__tests__/_helpers/axiosStubs.ts
frontend/src/__tests__/app/amortizacao.test.tsx
frontend/src/__tests__/app/home.test.tsx
frontend/src/__tests__/app/juros.test.tsx
frontend/src/__tests__/app/routes.test.tsx
frontend/src/__tests__/components/Header.test.tsx
frontend/src/__tests__/components/ShellLayout.test.tsx
frontend/src/__tests__/components/Sidebar.test.tsx
frontend/src/__tests__/components/interest/JurosCompostosForm.test.tsx
frontend/src/__tests__/components/interest/JurosSaibaMais.test.tsx
frontend/src/__tests__/components/interest/JurosSimplesForm.test.tsx
frontend/src/__tests__/components/interest/JurosSimplesPanel.test.tsx
frontend/src/__tests__/components/interest/JurosTabs.test.tsx
frontend/src/__tests__/components/interest/Visualizacao.test.tsx
frontend/src/__tests__/components/interest/formValidation.test.ts
frontend/src/__tests__/components/states.test.tsx
frontend/src/__tests__/components/ui.test.tsx
frontend/src/__tests__/content/amortizacao/conteudo.test.ts
frontend/src/__tests__/content/juros/conteudo.test.ts
frontend/src/__tests__/lib/api/envelope.test.ts
frontend/src/__tests__/lib/api/problem.test.ts
frontend/src/__tests__/lib/money.test.ts
frontend/src/__tests__/services/amortization/amortizationService.test.ts
frontend/src/__tests__/services/interest/interestService.test.ts
frontend/src/__tests__/tokens.test.ts
```

## 6. Routes app

Comando:

```bash
find frontend/src/app \( -name 'page.tsx' -o -name 'layout.tsx' \) | sort
```

Saida real:

```text
frontend/src/app/(app)/amortizacao/page.tsx
frontend/src/app/(app)/atraso/page.tsx
frontend/src/app/(app)/cartao-rotativo/page.tsx
frontend/src/app/(app)/cdc/page.tsx
frontend/src/app/(app)/consignado/page.tsx
frontend/src/app/(app)/diagnostico/page.tsx
frontend/src/app/(app)/educacao/page.tsx
frontend/src/app/(app)/financiamento-imobiliario/page.tsx
frontend/src/app/(app)/financiamento-veiculo/page.tsx
frontend/src/app/(app)/indicadores/page.tsx
frontend/src/app/(app)/investir-vs-quitar/page.tsx
frontend/src/app/(app)/juros/page.tsx
frontend/src/app/(app)/layout.tsx
frontend/src/app/(app)/page.tsx
frontend/src/app/layout.tsx
```

## 7. Design system/tokens references

Comando:

```bash
grep -R -n -E 'tokens|brand|financial|tailwind|className' \
  frontend/src/styles frontend/src/components frontend/src/app | head -200
```

Trechos materiais da saida:

```text
frontend/src/styles/tokens.css:10:  --color-brand-primary: #1b4f72;
frontend/src/styles/tokens.css:11:  --color-brand-secondary: #2e75b6;
frontend/src/styles/tokens.css:12:  --color-brand-accent: #27ae60;
frontend/src/styles/tokens.css:21:  --color-financial-positive: #16a34a;
frontend/src/styles/tokens.css:22:  --color-financial-negative: #dc2626;
frontend/src/styles/tokens.css:23:  --color-financial-neutral: #2563eb;
frontend/src/styles/tokens.css:24:  --color-financial-warning: #d97706;
frontend/src/components/shell/ShellLayout.tsx:34:      <div className="flex flex-1 flex-col md:flex-row">
frontend/src/components/shell/ShellLayout.tsx:35:        <aside className="hidden w-64 shrink-0 md:block">
frontend/src/components/interest/EvolucaoSaldoChart.tsx:36:  if (kind === "composto") return "var(--color-financial-positive, #0f766e)";
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:26:  if (kind === "sac") return "var(--color-financial-positive, #16a34a)";
```

## 8. Hardcoded hexes fora dos tokens

Comando:

```bash
grep -R -n -E '#[0-9a-fA-F]{3,8}' \
  frontend/src/styles frontend/src/components frontend/src/app | head -200
```

Trechos materiais da saida:

```text
frontend/src/components/interest/EvolucaoSaldoChart.tsx:36:  if (kind === "composto") return "var(--color-financial-positive, #0f766e)";
frontend/src/components/interest/EvolucaoSaldoChart.tsx:37:  return "var(--color-financial-neutral, #475569)";
frontend/src/components/interest/EvolucaoSaldoChart.tsx:105:              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
frontend/src/components/interest/EvolucaoSaldoChart.tsx:112:                  fill: "#64748b",
frontend/src/components/interest/EvolucaoSaldoChart.tsx:122:                  fill: "#64748b",
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:26:  if (kind === "sac") return "var(--color-financial-positive, #16a34a)";
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:27:  return "var(--color-financial-neutral, #2563eb)";
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:91:              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:98:                  fill: "#64748b",
frontend/src/components/amortization/AmortizacaoSaldoChart.tsx:108:                  fill: "#64748b",
frontend/src/app/globals.css:25:  color: #fff;
```

## 9. Responsive classes

Comando:

```bash
grep -R -n -E 'sm:|md:|lg:|xl:' frontend/src/components frontend/src/app | head -200
```

Trechos materiais da saida:

```text
frontend/src/components/shell/ShellLayout.tsx:34:      <div className="flex flex-1 flex-col md:flex-row">
frontend/src/components/shell/ShellLayout.tsx:35:        <aside className="hidden w-64 shrink-0 md:block">
frontend/src/components/interest/JurosCompostosForm.tsx:79:        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
frontend/src/components/interest/AmortizacaoTables.tsx:154:      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
frontend/src/components/interest/SummaryGrid.tsx:22:      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
frontend/src/components/amortization/AmortizacaoTable.tsx:65:      className="grid grid-cols-1 gap-4 xl:grid-cols-2"
frontend/src/app/(app)/amortizacao/page.tsx:66:        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
frontend/src/app/(app)/page.tsx:44:          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
frontend/src/app/(app)/juros/page.tsx:73:        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
```
