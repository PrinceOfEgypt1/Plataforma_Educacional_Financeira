# COMO APLICAR — PEF F8H Fase 0–1 (ENTREGA ADITIVA / RETROCOMPATÍVEL)

Gerado em **modo off-repo**. Esta versão é **estritamente aditiva**: NÃO contém
e NÃO altera os arquivos vivos `frontend/src/types/financing.ts` e
`frontend/src/services/financing/financiamentoService.ts`. Todos os artefatos
novos vivem em uma camada isolada `f8h/` + um arquivo de tipos novo.

## 1. Arquivos a adicionar (todos NOVOS — nenhum sobrescreve nada)

```text
frontend/src/types/financingF8H.ts                                  (NOVO)
frontend/src/types/openapiF8H.d.ts                                  (NOVO, gerado)
frontend/src/services/financing/f8h/errors.ts                       (NOVO)
frontend/src/services/financing/f8h/buildPayload.ts                 (NOVO)
frontend/src/services/financing/f8h/financiamentoCompareService.ts  (NOVO)
frontend/src/services/financing/f8h/adaptCompareResponse.ts         (NOVO)
frontend/src/services/financing/f8h/__tests__/fixtures.ts           (NOVO)
frontend/src/services/financing/f8h/__tests__/buildPayload.test.ts  (NOVO)
frontend/src/services/financing/f8h/__tests__/adaptCompareResponse.test.ts  (NOVO)
frontend/src/services/financing/f8h/__tests__/compararFinanciamentosF8H.test.ts (NOVO)
frontend/src/services/financing/f8h/__tests__/parityOracle.test.ts  (NOVO, describe.skip)
frontend/src/__fixtures__/financing/*.json                          (NOVO — 3 req + 3 resp + openapi)
```

## 2. O que NÃO está no pacote (de propósito)

- `frontend/src/types/financing.ts` — preservado no repo, intocado.
- `frontend/src/services/financing/financiamentoService.ts` — preservado no repo,
  intocado. `simularFinanciamentoImobiliario`, `compararFinanciamentos` e
  `FinanciamentoApiError` continuam exatamente como estão.

## 3. Nova superfície pública F8H

```text
types/financingF8H.ts: ComparePayload, CompareResponse, CompareData,
  BackendSystemOut, BackendSummary, BackendParcela, BackendComparacao,
  UiInputs, UiEncargosInput, UiRow, UiSummary, UiModel
f8h/financiamentoCompareService.ts: COMPARE_PATH, buildPayload, compararFinanciamentosF8H
f8h/adaptCompareResponse.ts: adaptCompareResponse
f8h/errors.ts: FinancingF8HValidationError, FinancingF8HApiError
```

> O nome `compararFinanciamentosF8H` é deliberadamente distinto de
> `compararFinanciamentos` para não colidir com a assinatura pública existente.

## 4. devDependencies dos testes

```jsonc
"vitest": "^2.1.8",
"openapi-typescript": "^7.4.4"
```

## 5. Regenerar tipos (opcional)

```bash
pnpm dlx openapi-typescript http://127.0.0.1:8000/api/openapi.json \
  -o frontend/src/types/openapiF8H.d.ts
```

## 6. Gates obrigatórios (rodar NA CLAUDE CODE)

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Off-repo executei `tsc --noEmit` + `vitest run` (36 testes verdes, 3 do oráculo
pulados). Os gates reais do repositório ainda precisam ser rodados após a
aplicação.

## 7. Oráculo de paridade

`parityOracle.test.ts` está `describe.skip`. Para ativar, aponte o `engine.js`
do protótipo para `src/__oracles__/engine.js` (somente teste; nunca produção) e
siga as instruções no topo do arquivo.
