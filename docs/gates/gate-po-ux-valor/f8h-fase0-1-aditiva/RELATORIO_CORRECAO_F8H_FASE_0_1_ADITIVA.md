# Relatório de correção — F8H Fase 0–1 aditiva

## 1. Resumo executivo

A entrega anterior foi reprojetada para ser **estritamente aditiva e
retrocompatível**. Toda a camada de dados F8H passou a viver em arquivos novos e
isolados (`types/financingF8H.ts`, `types/openapiF8H.d.ts` e
`services/financing/f8h/**`), sem incluir nem alterar os dois arquivos vivos que
a auditoria do BLOCO 16B sinalizou como colisões perigosas
(`types/financing.ts` e `services/financing/financiamentoService.ts`).

Verificação off-repo: `tsc --noEmit` limpo e `vitest run` com **36 testes
passando** (3 do oráculo `engine.js` pulados, pois o arquivo não acompanha o
handoff). Backend, UI, CSS, Fase 2 e Fase 3: intocados.

## 2. O que foi corrigido em relação à entrega anterior

1. **Sem sobrescrita de contratos vivos**: removidos do pacote o
   `types/financing.ts` e o `services/financing/financiamentoService.ts` que a
   versão anterior substituía. Agora não há nenhum arquivo nesses dois caminhos.
2. **Tipos em arquivo novo**: os aliases de backend + tipos de UI migraram para
   `types/financingF8H.ts` (novo). O contrato vivo de `types/financing.ts`
   (MoneyString, RateString, SistemaAmortizacao, FinanciamentoImobRequest,
   FinanciamentoPeriodo, FinanciamentoImobSummary, FinanciamentoImobOut,
   FinanciamentoImobCompareRequest, FinanciamentoComparacaoEducacional,
   FinanciamentoImobCompareOut) permanece preservado no repositório.
3. **Tipos gerados sem colisão**: o `openapi.d.ts` foi renomeado para
   `openapiF8H.d.ts`, garantindo que nenhum tipo vivo seja substituído.
4. **Service novo, não destrutivo**: criado
   `services/financing/f8h/financiamentoCompareService.ts` expondo
   `compararFinanciamentosF8H` (nome novo). A função existente
   `compararFinanciamentos` e `simularFinanciamentoImobiliario` não são tocadas.
5. **Erros em namespace próprio**: `FinancingF8HApiError`/
   `FinancingF8HValidationError`, distintos do `FinanciamentoApiError` existente.
6. **buildPayload isolado**: extraído para `f8h/buildPayload.ts`, conforme a
   estrutura sugerida na correção.
7. **Testes novos e isolados** em `f8h/__tests__/`, sem editar/remover/enfraquecer
   testes existentes.

## 3. Arquivos novos

```text
frontend/src/types/financingF8H.ts
frontend/src/types/openapiF8H.d.ts
frontend/src/services/financing/f8h/errors.ts
frontend/src/services/financing/f8h/buildPayload.ts
frontend/src/services/financing/f8h/financiamentoCompareService.ts
frontend/src/services/financing/f8h/adaptCompareResponse.ts
frontend/src/services/financing/f8h/__tests__/fixtures.ts
frontend/src/services/financing/f8h/__tests__/buildPayload.test.ts
frontend/src/services/financing/f8h/__tests__/adaptCompareResponse.test.ts
frontend/src/services/financing/f8h/__tests__/compararFinanciamentosF8H.test.ts
frontend/src/services/financing/f8h/__tests__/parityOracle.test.ts   (describe.skip)
frontend/src/__fixtures__/financing/*.json   (3 req + 3 resp + openapi)
COMO_APLICAR.md
```

## 4. Arquivos alterados

Nenhum. A entrega é 100% aditiva: não altera nem remove nenhum arquivo
existente do repositório.

## 5. Confirmação de retrocompatibilidade

- `simularFinanciamentoImobiliario` foi preservado? **sim** (arquivo vivo não
  incluído no pacote, portanto intocado).
- `compararFinanciamentos` atual foi preservado? **sim** (não sobrescrito; a
  nova função tem nome distinto `compararFinanciamentosF8H`).
- tipos existentes em `types/financing.ts` foram preservados? **sim** (arquivo
  vivo não incluído/alterado; tipos F8H ficam em `financingF8H.ts`).
- backend foi alterado? **não**
- UI foi alterada? **não**
- CSS foi alterado? **não**
- Fase 2 foi executada? **não**
- Fase 3 foi executada? **não**

Checagem automatizada confirmou: nenhum arquivo nos caminhos de colisão; nenhum
export `compararFinanciamentos` (apenas `...F8H`); símbolos vivos citados só em
comentários.

## 6. Testes executados

```bash
tsc --noEmit
vitest run
tsx ev.mts   # dump de evidência por cenário
```

## 7. Resultado dos testes

- `tsc --noEmit`: **exit 0** (strict, noUnusedLocals/Params; sem erros).
- `vitest run`: **3 arquivos passaram, 1 pulado** — **36 testes verdes**, 3
  pulados (oráculo `engine.js`).

```text
✓ f8h/__tests__/adaptCompareResponse.test.ts (27 tests)
✓ f8h/__tests__/compararFinanciamentosF8H.test.ts (3 tests)
✓ f8h/__tests__/buildPayload.test.ts (6 tests)
↓ f8h/__tests__/parityOracle.test.ts (3 skipped)
Test Files  3 passed | 1 skipped (4)
     Tests  36 passed | 3 skipped (39)
```

## 8. Evidências de uso das fixtures reais

```text
[cenario_1000000_820000_120_085] i=0.0085 rows=120/120 sfUlt=0 ΣamortSAC=180000.00
  SACtot=272565.00 PRICEtot=287843.45 economia=15278.45 (backend 15278.45)
[cenario_1300000_1130000_120_085] i=0.0085 rows=120/120 sfUlt=0 ΣamortSAC=170000.00
  SACtot=257422.30 PRICEtot=271852.06 economia=14429.76 (backend 14429.76)
[cenario_900000_730000_120_091] i=0.0091 rows=120/120 sfUlt=0 ΣamortSAC=170000.00
  SACtot=263593.28 PRICEtot=280086.86 economia=16493.58 (backend 16493.58)
```

Invariantes verificados nos 3 cenários: `rows.length == prazo_meses` (120);
`saldo_final` final `== 0`; `Σ amortizações ≈ valor_financiado`;
`economiaSACvsPRICE == comparacao.diferenca_total_pago`; `i` lido como decimal;
totais idênticos ao `summary` bruto do backend (zero recálculo).

## 9. Limitações

1. **Off-repo**: os gates reais (`pnpm format:check/lint/typecheck/test/build`)
   não puderam ser executados com a config do repositório; usei `tsc`+`vitest`
   equivalentes. Os gates reais ainda precisam rodar após a aplicação.
2. **Conferência de não-colisão por nome**: a garantia de retrocompatibilidade
   foi feita por (a) não enviar os arquivos vivos e (b) usar nomes distintos. A
   confirmação final de que os imports existentes seguem compilando depende do
   `pnpm typecheck` no repo real (não tenho o conteúdo dos arquivos vivos aqui).
3. **Oráculo `engine.js`**: ausente neste handoff; teste C `describe.skip`.

## 10. Pendências

1. Aplicar os arquivos novos e rodar os 5 gates `pnpm` no repositório.
2. Confirmar raiz exata de `src`/alias de import (`@/...`) e ajustar se preciso.
3. Disponibilizar `engine.js` como oráculo e ativar `parityOracle.test.ts`.
4. Decidir versionamento de `openapiF8H.d.ts` (commitar vs. gerar em CI).

## 11. Veredito técnico

**PASS COM RESSALVAS**

Justificativa: a colisão destrutiva foi eliminada — a entrega é comprovadamente
aditiva (nenhum arquivo nos caminhos vivos; nomes novos; checagem automatizada),
com typecheck limpo e 36 testes verdes contra as 3 fixtures reais. As ressalvas
são ambientais e não estruturais: os gates `pnpm` do repositório, a verificação
de que os imports vivos seguem compilando (typecheck no repo) e o oráculo
`engine.js` ficam para a execução na Claude Code.
