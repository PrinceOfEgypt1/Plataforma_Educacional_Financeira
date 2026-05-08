# F5 — Frontend Financing

**Sprint:** 4 / Fatia: F5  
**Feature:** RF-FIN-001 — Financiamento Imobiliário  
**Data:** 2026-05-08

## Tipos (`frontend/src/types/financing.ts`)

- `FinanciamentoImobRequest`: 7 campos (5 obrigatórios + 2 opcionais)
- `FinanciamentoPeriodo`: 7 campos de linha
- `FinanciamentoImobSummary`: 13 campos
- `FinanciamentoImobOut`: summary + parcelas
- `FinanciamentoProblem`: tipo de erro da API

## Service (`frontend/src/services/financing/financiamentoService.ts`)

```typescript
simularFinanciamentoImobiliario(input, options?) → Promise<FinanciamentoImobOut>
PATH: "/financing/real_estate"
```

Usa `postJson<ResponseEnvelope<FinanciamentoImobOut>>` via `@/lib/api/client`.

## Validação de formulário (`formValidation.ts`)

- `FinanciamentoDraft`: 7 campos como string (para inputs HTML)
- `FinanciamentoFieldErrors`: erros por campo
- `validateFinanciamentoDraft()`: retorna `{ ok: true, value: FinanciamentoImobRequest }` ou `{ ok: false, errors }`
- Campos opcionais (`seguro_mensal`, `tarifa_mensal`) omitidos quando zero (compatível com `exactOptionalPropertyTypes`)

## Componentes

### `FinanciamentoCockpit`
- 4 estados: idle | loading | error | ok
- `INITIAL_DRAFT` com todos os campos como string vazia e sistema PRICE
- `handleSubmit`: valida draft → chama service → atualiza estado
- `data-testid`: `financiamento-cockpit`, `financiamento-idle-state`, `financiamento-loading-state`, `financiamento-error-state`, `financiamento-ok-state`, `financiamento-result-panel`

### `FinanciamentoForm`
- 7 campos: valor imóvel, entrada, prazo (meses), taxa mensal (%), sistema amortização, seguro mensal, tarifa mensal
- Seletor de sistema: radio buttons PRICE/SAC com `data-testid="sistema-price"` / `"sistema-sac"`
- Botão submit: `<button class="cockpit-btn-calc" data-testid="financiamento-submit">`

### `FinanciamentoSummary`
- Seção azul: dados de entrada (imóvel, entrada, financiado, prazo, taxa)
- Seção cinza: resultados (1ª/última parcela, totais amortizado/juros/encargos/pago, custo total)
- Disclaimer educacional ao final

### `FinanciamentoTable`
- Exibe até `maxRows` (default 24) parcelas
- Coluna encargos condicional (só se `hasEncargos`)
- Footer "e mais N parcelas" quando há mais
- `data-testid`: `financiamento-table`, `parcela-row-{numero}`

### `FinanciamentoSaibaMais`
- Modal com 4 abas: Essencial, Aprofundado, Glossário, Aviso educacional
- Usa `CockpitModal` com props corretos: `open`, `tag`, `active`, `onTabChange`
- Fechar com Escape via `useEffect` no `CockpitModal`
- `data-testid`: `financiamento-saiba-mais-btn`

## Página

`/financiamento-imobiliario` — `app/(app)/financiamento-imobiliario/page.tsx`  
Renderiza `<FinanciamentoCockpit />` com metadata do `MODULES` config.  
Status em `modules.ts`: `"disponivel"` (atualizado de `"em-construcao"`).

## CockpitModal

Atualização realizada em `CockpitPrimitives.tsx`: botões de aba agora têm `role="tab"` e `aria-selected={tab.id === active}` para compatibilidade com `getByRole("tab")` nos testes.
