# Sprint 3/F4 - Testes frontend

## Objetivo

Registrar os testes frontend da pagina real `/amortizacao` e do service de amortizacao.

## Cobertura criada

- `frontend/src/__tests__/services/amortization/amortizationService.test.ts`
  - endpoint PRICE: `/amortization/price`;
  - endpoint SAC: `/amortization/sac`;
  - endpoint compare: `/amortization/compare`;
  - envelope desembrulhado;
  - Problem+JSON;
  - falha de rede.
- `frontend/src/__tests__/app/amortizacao.test.tsx`
  - pagina deixou de ser placeholder;
  - formulario e validacao client-side;
  - happy path PRICE;
  - happy path SAC;
  - happy path compare;
  - loading;
  - erro de API;
  - resumo, tabela, grafico, alertas e interpretacao.

## Comando final

```bash
cd frontend
pnpm test -- --run
```

Saida relevante:

```text
Test Files  23 passed (23)
Tests  161 passed (161)
src/__tests__/services/amortization/amortizationService.test.ts  (5 tests)
src/__tests__/app/amortizacao.test.tsx  (7 tests)
```

## Observacao nao bloqueante

O `vitest` exibiu warnings de `ResponsiveContainer` do Recharts em jsdom:

```text
The width(0) and height(0) of chart should be greater than 0
```

Impacto: nao houve falha de teste. O mesmo tipo de warning ja aparece no teste existente de juros. A rota `/amortizacao` foi validada tambem por `next build`, que gerou a pagina estatica com sucesso.
