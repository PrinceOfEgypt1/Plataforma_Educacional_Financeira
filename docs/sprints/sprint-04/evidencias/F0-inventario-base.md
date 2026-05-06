# F0 — Inventário da Base Real — Sprint 4

Data: 2026-05-06
Branch: sprint-4/f0-plano-execucao-claude
Commit base: c645138

---

## Rotas Frontend (frontend/src/app)

```
frontend/src/app/(app)/amortizacao/page.tsx        ← IMPLEMENTADO (cockpit)
frontend/src/app/(app)/atraso/page.tsx              ← stub ("em breve")
frontend/src/app/(app)/cartao-rotativo/page.tsx     ← stub ("em breve")
frontend/src/app/(app)/cdc/page.tsx                 ← stub ("em breve")
frontend/src/app/(app)/consignado/page.tsx          ← stub ("em breve")
frontend/src/app/(app)/diagnostico/page.tsx         ← stub ("em breve")
frontend/src/app/(app)/educacao/page.tsx            ← stub ("em breve")
frontend/src/app/(app)/financiamento-imobiliario/page.tsx ← stub ("em breve")
frontend/src/app/(app)/financiamento-veiculo/page.tsx     ← stub ("em breve")
frontend/src/app/(app)/indicadores/page.tsx         ← stub ("em breve")
frontend/src/app/(app)/investir-vs-quitar/page.tsx  ← stub ("em breve")
frontend/src/app/(app)/juros/page.tsx               ← IMPLEMENTADO (cockpit)
frontend/src/app/(app)/layout.tsx                   ← shell global
frontend/src/app/(app)/page.tsx                     ← Home (compacta)
frontend/src/app/globals.css
frontend/src/app/layout.tsx
```

**Resumo frontend — rotas:** 2 implementadas com cockpit (/juros, /amortizacao), 1 Home implementada, 10 stubs funcionais ("em breve").

---

## Componentes Frontend (frontend/src/components)

### amortization/ (11 arquivos)
AmortizacaoAlerts, AmortizacaoForm, AmortizacaoInterpretation, AmortizacaoSaibaMais,
AmortizacaoSaldoChart, AmortizacaoSummary, AmortizacaoTable, AmortizacaoTabs,
AmortizationCockpit, ComparePanel, PricePanel, SacPanel, formPrimitives, formValidation, simulationState

### interest/ (14 arquivos)
AmortizacaoTables, CompararJurosForm, CompararJurosPanel, EvolucaoSaldoChart,
InterestCockpit, JurosAlerts, JurosCompostosForm, JurosCompostosPanel,
JurosInterpretation, JurosSaibaMais, JurosSimplesForm, JurosSimplesPanel,
JurosSimulationState, JurosTabs, SummaryGrid, formPrimitives, formValidation, index

### shell/ (5 arquivos)
EducationalNotice, Header, ModulePage, NavItem, ShellLayout, Sidebar

### states/ (4 arquivos)
EmptyState, ErrorState, LoadingState, index

### ui/ (5 arquivos base + 6 cockpit)
AlertBanner, EducationPanel, FormSection, SummaryCard, index
cockpit/: CockpitCharts, CockpitModal, CockpitPrimitives, CockpitTables,
FinancialCockpitShell, index

**Infraestrutura de cockpit disponível e reutilizável para módulos futuros.**

---

## Services Frontend (frontend/src/services)

```
frontend/src/services/amortization/amortizationService.ts
frontend/src/services/interest/index.ts
frontend/src/services/interest/interestService.ts
```

INFERÊNCIA: padrão de service estabelecido. Sprint 4 deve criar
`frontend/src/services/diagnostic/diagnosticService.ts` seguindo o mesmo padrão.

---

## Content Frontend (frontend/src/content)

```
frontend/src/content/amortizacao/alertas.ts
frontend/src/content/amortizacao/glossario.ts
frontend/src/content/amortizacao/index.ts
frontend/src/content/amortizacao/nivel-1.ts
frontend/src/content/amortizacao/nivel-2.ts
frontend/src/content/amortizacao/tipos.ts
frontend/src/content/juros/glossario.ts
frontend/src/content/juros/index.ts
frontend/src/content/juros/nivel-1.ts
frontend/src/content/juros/nivel-2.ts
frontend/src/content/juros/types.ts
```

INFERÊNCIA: padrão de content estabelecido (nivel-1, nivel-2, glossario, alertas, index).
Sprint 4 deve criar `frontend/src/content/diagnostico/` seguindo o mesmo padrão.

---

## Testes Frontend (frontend/src/__tests__)

```
_helpers/axiosStubs.ts
app/amortizacao.test.tsx
app/cockpitGovernance.test.ts
app/home.test.tsx
app/juros.test.tsx
app/routes.test.tsx
components/Header.test.tsx
components/ShellLayout.test.tsx
components/Sidebar.test.tsx
components/cockpitDynamicData.test.tsx
components/interest/JurosCompostosForm.test.tsx
components/interest/JurosSaibaMais.test.tsx
components/interest/JurosSimplesForm.test.tsx
components/interest/JurosSimplesPanel.test.tsx
components/interest/JurosTabs.test.tsx
components/interest/Visualizacao.test.tsx
components/interest/formValidation.test.ts
components/states.test.tsx
components/ui.test.tsx
content/amortizacao/conteudo.test.ts
content/juros/conteudo.test.ts
lib/api/envelope.test.ts
lib/api/problem.test.ts
lib/money.test.ts
services/amortization/amortizationService.test.ts
services/interest/interestService.test.ts
tokens.test.ts
```

Gates da Sprint 3.5/F3: 188 testes passando.

---

## Backend — Domínios implementados (backend/app/domain)

| Domínio | Estado |
| --- | --- |
| interest/ | IMPLEMENTADO — simple.py, compound.py, _rounding.py |
| amortization/ | IMPLEMENTADO — price.py, sac.py, _common.py |
| credit_card/ | stub vazio (__init__.py apenas) |
| diagnostic/ | stub vazio (__init__.py apenas) |
| education/ | stub vazio (__init__.py apenas) |
| export/ | stub vazio (__init__.py apenas) |
| financing/ | stub vazio (__init__.py apenas) |
| indicators/ | stub vazio (__init__.py apenas) |
| invest_vs_debt/ | stub vazio (__init__.py apenas) |
| late_payment/ | stub vazio (__init__.py apenas) |
| loans/ | stub vazio (__init__.py apenas) |

---

## Backend — API v1 exposta (backend/app/api/v1)

| Arquivo | Endpoints |
| --- | --- |
| contract.py | GET /api/v1/contract/ping |
| interest.py | POST /api/v1/interest/simple, /compound, /compare |
| amortization.py | POST /api/v1/amortization/price, /sac, /compare |
| router.py | roteador principal |

**Domínios pendentes de exposição na API:** diagnostic, financing, loans, credit_card,
late_payment, indicators, invest_vs_debt, education, export.

---

## Backend — Schemas implementados

- interest/: base, simple, compound, compare
- amortization/: base, price, sac, compare
- Demais schemas: apenas __init__.py vazio

---

## Backend — Services implementados

- interest/: calcular_juros_service.py
- amortization/: calcular_amortizacao_service.py
- Demais services: apenas __init__.py vazio

---

## Testes Backend

| Camada | Módulos cobertos |
| --- | --- |
| unit/domain/ | interest (simple, compound, properties), amortization (price, sac, properties) |
| unit/services/ | interest, amortization |
| unit/ | envelope, health |
| contract/ | contract_base, error_handling, interest, amortization |
| integration/api/ | health, interest (simple, compound, compare, errors), amortization (price, sac, compare, errors) |
| regression/pedagogical/ | interest |

**Cobertura: apenas interest e amortization têm testes reais. Todos os outros domínios são stubs sem teste.**

---

## Resumo executivo do inventário

| Item | Total | Implementado | Stub/Pendente |
| --- | --- | --- | --- |
| Rotas frontend | 13 | 3 (Home, /juros, /amortizacao) | 10 |
| Domínios backend | 11 | 2 (interest, amortization) | 9 |
| Services backend | 11 | 2 | 9 |
| Schemas backend | 11 | 2 | 9 |
| Endpoints API v1 | 10 estimados | 7 (ping + 3 juros + 3 amort) | estimado 3+ pendentes |
