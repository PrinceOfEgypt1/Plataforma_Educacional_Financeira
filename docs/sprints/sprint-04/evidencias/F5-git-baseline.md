# F5 — Git Baseline

**Sprint:** 4 / Fatia: F5  
**Feature:** RF-FIN-001 — Financiamento Imobiliário  
**Data:** 2026-05-08  
**Branch:** `sprint-4/f5-financiamento-imobiliario-rf-fin-001-claude`

## Branch de desenvolvimento

```
branch: sprint-4/f5-financiamento-imobiliario-rf-fin-001-claude
base: origin/main (após merge de sprint-4/f4-diagnostico-conteudo-rf-diag-001-claude via PR #29)
```

## Arquivos criados no backend

```
backend/app/domain/financing/__init__.py
backend/app/domain/financing/_common.py
backend/app/domain/financing/real_estate.py
backend/app/schemas/financing/__init__.py
backend/app/schemas/financing/real_estate.py
backend/app/services/financing/__init__.py
backend/app/services/financing/simular_financiamento_service.py
backend/app/api/v1/financing.py
backend/tests/unit/domain/financing/__init__.py
backend/tests/unit/domain/financing/test_real_estate.py
backend/tests/unit/services/financing/__init__.py
backend/tests/unit/services/financing/test_simular_financiamento_service.py
backend/tests/integration/api/financing/__init__.py
backend/tests/integration/api/financing/test_real_estate.py
backend/tests/integration/api/financing/test_errors.py
backend/tests/contract/test_financing.py
```

## Arquivos modificados no backend

```
backend/app/api/v1/router.py  — include_router(financing.router)
```

## Arquivos criados no frontend

```
frontend/src/types/financing.ts
frontend/src/services/financing/financiamentoService.ts
frontend/src/services/financing/index.ts
frontend/src/components/financing/formValidation.ts
frontend/src/components/financing/FinanciamentoForm.tsx
frontend/src/components/financing/FinanciamentoSummary.tsx
frontend/src/components/financing/FinanciamentoTable.tsx
frontend/src/components/financing/FinanciamentoCockpit.tsx
frontend/src/components/financing/FinanciamentoSaibaMais.tsx
frontend/src/components/financing/index.ts
frontend/src/content/financiamento-imobiliario/types.ts
frontend/src/content/financiamento-imobiliario/nivel-1.ts
frontend/src/content/financiamento-imobiliario/nivel-2.ts
frontend/src/content/financiamento-imobiliario/glossario.ts
frontend/src/content/financiamento-imobiliario/index.ts
frontend/src/__tests__/app/financiamento-imobiliario.test.tsx
frontend/src/__tests__/components/financing/FinanciamentoSaibaMais.test.tsx
frontend/src/__tests__/content/financiamento-imobiliario/conteudo.test.ts
frontend/src/__tests__/services/financing/financiamentoService.test.ts
```

## Arquivos modificados no frontend

```
frontend/src/app/(app)/financiamento-imobiliario/page.tsx  — FinanciamentoCockpit substitui ModulePage
frontend/src/config/modules.ts  — status: em-construcao → disponivel
frontend/src/components/ui/cockpit/CockpitModal.tsx  — role="tab" + aria-selected nos botões de aba
```
